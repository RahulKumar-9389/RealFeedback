import { z } from 'zod';

export const verifyCodeSchema = z.object({
    code: z.string().min(6, 'Verification code must be 6 digits')
})