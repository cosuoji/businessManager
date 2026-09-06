import express from "express";
import cors from "cors";
import apiRoutes from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";
import logger from "./middleware/logger.js";
import cookieParser from "cookie-parser";
import helmet from "helmet";
//import { mongoSanitizeMiddleware } from "./middleware/mongoSanitize.middleware.js";


const app = express();
app.use(logger);


const allowedOrigins =
  process.env.CLIENT_URLS
    ?.split(",")
    .map((origin) =>
      origin.trim()
    )
    .filter(Boolean);


app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }
      if (
        allowedOrigins.includes(origin)
      ) {
        return callback(null, true);
      }
      return callback(
        new Error(
          "Not allowed by CORS"
        )
      );
    },
    credentials: true,
  })
);


app.set("trust proxy", 1);
app.use(helmet());
app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
//app.use(mongoSanitizeMiddleware);
app.use("/api/v1/", apiRoutes);
app.use(errorHandler);


export default app;
