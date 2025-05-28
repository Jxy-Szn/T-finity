import { randomBytes } from "crypto";

// Generate a secure random string for JWT secret
const secret = randomBytes(64).toString("hex");
console.log("Your JWT Secret:", secret);
