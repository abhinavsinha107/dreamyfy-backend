import express, { type Express, type Request, type Response } from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import http from "http";
import cors from "cors";
import cookieSession from "cookie-session";
import dotenv from "dotenv";
import errorHandler from "./middleware/errorHandler";
import { initDB } from "./services/initDB";
import { loadConfig } from "./helper/config";
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";
import filterRoutes from "./routes/filter.route"
import uploadRoutes from "./routes/upload.route";
import courseRoutes from "./routes/course.route";
import subjectRoutes from "./routes/subject.route";
import classRoutes from "./routes/class.route";
import bookingRoutes from "./routes/booking.route";
import ChatMessage from "./schema/message.schema";
import investerRoutes from "./routes/invester.route";
import paymentRoutes from "./routes/payment.route";
import chatRoutes from "./routes/chat.route";
import { IUser } from "schema/user.schema";
import socketHandler from "./services/socketHandler";

loadConfig();
dotenv.config();

declare global {
  namespace Express {
    interface Request {
      user?: IUser | undefined;
    }
  }
}

const port = Number(process.env.PORT) ?? 5000;

const app: Express = express();
const server = http.createServer(app);

// Initialize Socket.IO
export const io = socketHandler(server);

const router = express.Router();

app.use(
  cookieSession({
    name: "session",
    keys: ["eduApp"],
    maxAge: 24 * 60 * 60 * 1000,
  })
);

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(morgan("dev"));

// Initialize routes
const initApp = async (): Promise<void> => {
  await initDB(); // Ensure the database connection is initialized

  app.use("/api", router);

  app.get("/", (req: Request, res: Response) => {
    res.send({ status: "EduApp is ready to launch" });
  });

  // Mount routes
  router.use("/auth", authRoutes);
  router.use("/users", userRoutes);
  router.use("/upload", uploadRoutes);
  router.use("/courses", courseRoutes);
  router.use("/subjects", subjectRoutes);
  router.use("/classes", classRoutes);
  router.use("/payments", paymentRoutes);
  router.use("/filter", filterRoutes);
  router.use("/session", bookingRoutes);
  router.use("/chat", chatRoutes);
  router.use("/investers", investerRoutes);

  app.use(errorHandler);

  server.listen(port, () =>
    console.log(`Express server is listening at http://localhost:${port} 🚀`)
  );
};

initApp();
