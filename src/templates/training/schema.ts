import { z } from "zod";

export const trainingSchema = z.object({
  showSubtitles: z.boolean().default(false),
});
