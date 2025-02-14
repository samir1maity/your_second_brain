import { prisma } from "../db.js";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SECRET_USER_PASSWORD } from "../config.js";
import { signupSchema } from "../types/user.js";

export const userSignup = async (userData: {
  email: string;
  password: string;
}) => {
  const result = signupSchema.safeParse(userData);

  if (!result.success) {
    console.error(result.error.format());
  } else {
    console.log("Validation successful");
  }

  const { email, password } = userData;
  const hashedPassword = await bcrypt.hash(password, 10);

  const isUserExsist = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (isUserExsist) {
    return;
  }

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash: hashedPassword,
    },
  });
};

export const userLogin = async (userData: {
  email: string;
  password: string;
}) => {
  const { email, password } = userData;

  const isUser = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (!isUser) {
    return ;
  }

  const isMatch = await bcrypt.compare(password, isUser.passwordHash);

  if (!isMatch) {
    return;
  }
  const jwt_token = jwt.sign(
    { id: isUser.id, email: isUser.email },
    SECRET_USER_PASSWORD
  );

  return jwt_token;
};
