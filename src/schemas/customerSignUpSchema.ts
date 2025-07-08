import { z } from "zod";

export const customerSignUpSchema = z.object({
    email: z.string().email({message: "Invalid email address"}),
    password: z.string().min(5, {message: "password must be of at least five digits"}),
    fullname: z.string().min(1, "Full name is required"),
    phone: z.string().optional(),
    address: z.string().optional(),
})