import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import logger from "morgan";
import favicon from "serve-favicon";
import path from "path";
import { fileURLToPath } from "url";
import { connectToDB } from "./config/database.js";
import usersRouter from "./routes/api/users.js";
import videosRouter from "./routes/api/videos.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(favicon(path.join(__dirname, "build", "favicon.ico")));
app.use(express.static(path.join(__dirname, "build")));

app.use("/api/users", usersRouter);
app.use("/api/videos", videosRouter);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(3000, () => {
  connectToDB();
  console.log("Server started at http://localhost:3000");
});
