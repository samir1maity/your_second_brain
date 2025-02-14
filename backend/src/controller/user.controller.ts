import { Request, Response } from "express";
import { userLogin, userSignup } from "../services/user.services.js";

export const signup = async (req: Request, res: Response) => {
    try {
        const result = await userSignup(req.body);
        res.status(201).json({
          status: 'success',
          data: result
        });
      } catch (error) {
        console.log('error while signup process', error)
      }
};

export const login = async (req: Request, res: Response) => {
    try {
        const result = await userLogin(req.body);
        res.status(200).json({
          status: 'success',
          token: result
        });
      } catch (error) {
        console.log('error while login process', error)
      }
};
