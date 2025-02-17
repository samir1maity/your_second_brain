import { prisma } from "../db.js";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SECRET_USER_PASSWORD } from "../config.js";
import { userAuth } from "../types/user.js";
import { AppError } from "../utils/errors.js";

export const userSignup = async (userData: {
  email: string;
  password: string;
}) => {
  try {
    const { email, password } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);

    const isUserExsist = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (isUserExsist) {
        throw new AppError(409, 'Email already taken', [
            { field: 'email', message: 'This email is already registered' }
        ]);
    }

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
      },
    });

  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(500, "Signup failed");
  }
};




export const userLogin = async (userData: {
  email: string;
  password: string;
}) => {
  try {
    const { email, password } = userData;

    const isUser = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!isUser) {
      throw new AppError(401, "Invalid credentials", [
        { field: "email", message: "Email not found" },
      ]);
    }

    const isMatch = await bcrypt.compare(password, isUser.passwordHash);

    if (!isMatch) {
      throw new AppError(401, "Invalid credentials", [
        { field: "password", message: "Incorrect password" },
      ]);
    }

    const jwt_token = jwt.sign(
      { id: isUser.id, email: isUser.email },
      SECRET_USER_PASSWORD
    );

    return {
      user: {
        id: isUser.id,
        email: isUser.email,
        jwt_token,
      },
    };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(500, "Login failed");
  }
};
