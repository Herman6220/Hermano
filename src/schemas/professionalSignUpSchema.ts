import { z } from "zod";

export const professionalSignUpSchema = z.object({
    email: z.string().email({message: "Invalid email address"}),
    password: z.string().min(5, {message: "password must be of at least 5 digits"}),
    fullname: z.string().min(1, "Full name is required").regex(/^[a-zA-Z0-9_]+$/, "Full name must not contain any special characters"),
    phone: z.string().optional(),
    services: z.array(z.object({
        serviceId: z.string(),
        price: z.number(),
        description: z.string().optional(),
        images: z.array(z.string()).optional(),
        averageRating: z.number(),
        reviewsCount: z.number(),
        isServiceActive: z.boolean()
    })),
    description: z.string().max(100, "description must be no more than 100 words").optional(),
    experience: z.number().optional(),
    location: z.string().optional(),
    profilePicture: z.string().optional()
})