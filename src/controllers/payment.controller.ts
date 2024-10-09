import User from "../schema/user.schema";

import { Request, Response } from "express";
import Stripe from "stripe";
import { createResponse } from "../helper/response";
import Course from "../schema/course.schema";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",
  typescript: true,
});
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

export const createPaymentSession = async (req: Request, res: Response) => {
  const data = req.body;
  const course = await Course.findById(data.courseId)
    .populate("teacher", "stripe_id")
    .select("-createdAt -updatedAt -__v");
  // if (!course?.teacher?.stripe_id){
  //     res.status(400).send({ error: 'Tutor does not have connected account setup' });
  //   }
  const user = await User.findById(req.user?._id).select(
    "-password -createdAt -updatedAt -__v"
  );
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: Math.round((course?.price as number) * 100),
          product_data: {
            name: course?.name as string,
            description: course?.description,
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      courseId: data.courseId as string,
      userId: req.user?._id as string,
    },
    payment_intent_data: {
      application_fee_amount: Math.round((course?.price as number) * 100) * 0.3,
      transfer_data: {
        destination: course?.teacher?.stripe_id as string,
      },
    },
    success_url: `${process.env.FE_BASE_URL}/Student/subjects/${data?.courseId}/success=true`,
    cancel_url: `${process.env.FE_BASE_URL}/Student/subjects/${data?.courseId}/success=false`,
  });

  res.send(createResponse({ id: session.id, url: session.url }));
};

export const createOnboardingSession = async (req: Request, res: Response) => {
  let data = req.body;

  try {
    // Fetch user from the database
    const user = await User.findById(req.user?._id).select(
      "-password -createdAt -updatedAt -__v"
    );

    // Check if User is defined before proceeding
    if (!user) {
      return res.status(400).send({ error: "User information is required." });
    }

    console.log(user.stripe_id); // Should now log the actual stripe_id

    // Create or retrieve the Stripe account
    const account = user.stripe_id
      ? { id: user.stripe_id }
      : await stripe.accounts.create({
          type: "custom",
          country: "US",
          email: data.email,
          capabilities: {
            transfers: { requested: true },
            card_payments: { requested: true },
          },
          metadata: {
            userId: user._id.toString(),
          },
        });

    // Update user's stripe_id if it was created
    if (!user.stripe_id) {
      user.stripe_id = account.id;
      await user.save(); // Save the updated user document
    }

    console.log(user.stripe_id); // Should now log the updated stripe_id

    // Create an account link for onboarding
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url:
        process.env.REFRESH_URL || `${process.env.FE_BASE_URL}/courses`,
      return_url:
        process.env.RETURN_URL ||
        `${process.env.FE_BASE_URL}/onboarding/success`,
      type: "account_onboarding",
    });

    // Send back the response with the account link URL
    res.send(createResponse({ url: accountLink.url }));
  } catch (error) {
    console.error("Error creating onboarding session:", error);
    res.status(500).send({ error: "Unable to create onboarding session." });
  }
};
//@ts-ignore
export const handleStripeWebhook = async (req, res): Promise<void> => {
  const sig = req.headers["stripe-signature"];
  let event;

  // Verify the webhook signature
  try {
    // Assuming you have a method to verify the signature here
    event = req.body;
  } catch (err) {
    // @ts-ignore
    console.error(`Webhook signature verification failed: ${err.message}`);
    // @ts-ignore
    res.status(400).send(`Webhook Error: ${err.message}`);
    return; // Ensure you return to prevent further execution
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object as Stripe.Checkout.Session;
      console.log(`Payment successful for session ID: ${session.id}`);

      const userId = session.metadata?.userId; // Ensure this is set in your checkout session
      const courseId = session.metadata?.courseId; // Assuming you have courseId in the metadata
      console.log(`Payment made by user ID: ${userId}, Course ID: ${courseId}`);

      if (userId && courseId) {
        try {
          // Logic to update the user's enrolled courses
          await updateUserEnrolledCourses(userId, courseId);
          console.log(`User ID ${userId} enrolled in course ID ${courseId}`);
        } catch (updateError) {
          //@ts-ignore
          console.error(
            `Failed to update enrolled courses: ${updateError.message}`
          );
          //@ts-ignore
          res.status(500).send(`Webhook Error: ${updateError.message}`);
          return; // Prevent further execution on error
        }
      } else {
        console.error("User ID or Course ID missing in session metadata.");
      }
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  // Acknowledge receipt of the event
  res.json({ received: true });
};

const updateUserEnrolledCourses = async (
  userId: string,
  courseId: string
): Promise<void> => {
  const user = await User.findById(userId).select(
    "-password -createdAt -updatedAt -__v"
  );
  const course = await Course.findById(courseId).select(
    "-createdAt -updatedAt -__v"
  );

  if (!user) {
    throw new Error("User not found");
  }

  if (!course) {
    throw new Error("Course not found");
  }
  //@ts-ignore
  if (!user.enrolledCourses.includes(course._id)) {
    //@ts-ignore
    user.enrolledCourses.push(course._id);
  }

  // Save the updated user document
  await user.save();
};
