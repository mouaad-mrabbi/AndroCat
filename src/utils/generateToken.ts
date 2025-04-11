import jwt from "jsonwebtoken";
import { JWTPayload } from "./types";
import { serialize } from "cookie";

// Genereate JWT Token
export function generateJWT(jwtPayload: JWTPayload): string {
  const privateKey = process.env.JWT_SECRET as string;

  const token = jwt.sign(jwtPayload, privateKey, {
    expiresIn: "3d",
  });

  return token;
}

// Set Cookie with JWT
export function setCookie(jwtPayload: JWTPayload): string {
  const token = generateJWT(jwtPayload);

  const cookie = serialize("jwtToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // development=http, production= https
    sameSite: "strict",
    /*     sameSite: "none", // لتسمح بالإرسال عبر النطاقات المختلفة */
    /* sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", */
    path: "/",
    maxAge: 60 * 60 * 24 * 3, // 3 days
  });

  return cookie;
}
