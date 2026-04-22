import z from "zod";

export const messageSchema = z.object({
    body: z.object({
        Body: z.string().startsWith("/")
    })
})