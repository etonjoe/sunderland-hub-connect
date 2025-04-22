
import * as z from "zod";

export const resourceSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  isPremium: z.boolean().default(false),
  file: z.any()
    .refine(file => file?.length === 1, "Please select a file")
    .transform(file => file[0]),
});

export type ResourceFormValues = z.infer<typeof resourceSchema>;
