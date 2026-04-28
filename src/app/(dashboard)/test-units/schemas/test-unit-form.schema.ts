import { z } from 'zod';

export const testUnitFormSchema = z.object({
  name: z.string().min(3, 'Test unit name must be at least 3 characters long'),
});
