import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import userRoute from "./routes/user.routes";
import contentRoute from "./routes/content.routes";

const app = express();

app.use(express.json());

app.use("/api/v1/user", userRoute);
app.use("/api/v1/content", contentRoute);

app.listen(process.env.PORT, async () => {
  mongoose.connect(process.env.DATABASE_URL as string);

  console.log("server started" + process.env.PORT);
});
