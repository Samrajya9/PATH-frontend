import { z } from 'zod';

export const departmentFormSchema = z.object({
  name: z.string().min(3, 'Department name must be at least 3 characters long'),
});
