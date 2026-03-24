import { z } from 'zod';
import Mime from '../Mime';

const ProcessImageRequestSchema = z.object({
  body: z.object({
    base64Image: z.string().min(1, "Base64 image data is required"),
    mimeType: z.enum(Mime),
  }),
});

export default ProcessImageRequestSchema