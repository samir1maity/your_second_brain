import { Router, Request, Response } from "express";
import { userModel } from "../model/user.schema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SECRET_USER_PASSWORD } from "../config";
import { authMiddleware } from "../middlewares/auth.middleware";

const userRoute = Router();

// SIGNUP
userRoute.post("/signup", async (req: Request, res: Response) => {
  const { username, password, firstName, lastName } = req.body;

  /**
   * TODO : add validations for inputs
   * TODO : improve errors
   */

  const hashedPassword = await bcrypt.hash(password, 10);

  const isUserExsist = await userModel.findOne({ username });

  if (isUserExsist) {
    res.status(403).json({
      msg: "user already exsists",
      data: isUserExsist,
      successful: false,
    });
    return;
  }

  try {
    const user = await userModel.create({
      username,
      password: hashedPassword, // storing hashed password
      firstName,
      lastName,
    });

    res.status(200).json({
      msg: "user creation successful",
      successful: true,
      data: user,
    });
  } catch (e) {
    console.error("Error during user signup:", e); // Optional logging
    res.status(500).json({
      message: "Internal server error. Please try again later.",
      successful: false,
    });
  }
});

//SIGNIN
userRoute.post("/signin", async (req: Request, res: Response) => {
  /**
   * TODO : add validations for inputs
   * TODO : improve errors
   */

  const { username, password } = req.body;
  try {
    const isUser = await userModel.findOne({
      username,
    });

    if (!isUser) {
      res.status(404).json({
        msg: "user not found",
        sucessfull: false,
      });
      return;
    }

    console.log("isUser", isUser);

    const isMatch = await bcrypt.compare(password, isUser.password);

    console.log("isMatch", isMatch);

    if (!isMatch) {
      res.status(403).json({
        msg: "password is incorrect",
        successful: false,
      });
      return;
    }
    const jwt_token = jwt.sign({ id: isUser._id }, SECRET_USER_PASSWORD);

    console.log("jwt_token", jwt_token);

    res.status(200).json({
      msg: "user signed",
      successful: true,
      data: isUser,
      token: jwt_token,
    });
  } catch (error) {
    res.status(500).json({
      msg: "something went wrong, server error",
      successful: false,
    });
  }
});

export default userRoute;
