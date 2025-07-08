import { z } from "zod";

export const professionalServiceCreationSchema = z.object({
    services: z.array(z.object({
        serviceId: z.string(),
        price: z.number(),
        description: z.string().optional(),
        images: z.array(z.string()).optional()
    }))
})