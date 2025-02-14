import express from "express";
import "dotenv/config";
import userRoute from "./routes/user.routes.js";
import contentRoute from "./routes/content.routes.js";
import tagRoute from "./routes/tag.routes.js";
import cors from 'cors'

const app = express();
// Enable CORS for all origins
app.use(cors());


app.use(express.json());

app.get('/',(req,res)=>{
  res.send('welcome to your second brain')
})
app.use("/api/v1/user", userRoute);
app.use("/api/v1/content", contentRoute);
app.use("/api/v1/tag", tagRoute);

app.listen(process.env.PORT, async () => {
  console.log("server started" + process.env.PORT);
});
