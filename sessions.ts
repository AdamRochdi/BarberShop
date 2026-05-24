import session from "express-session";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.SESSION_SECRET) {
    throw new Error("SESSION_SECRET is missing");
}

export const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
});