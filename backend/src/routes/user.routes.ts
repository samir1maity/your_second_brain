import { Router} from "express";
import { login, signup } from "../controller/user.controller.js";

const userRoute = Router();

userRoute.post("/signup", signup);
userRoute.post("/signin", login);

export default userRoute;
