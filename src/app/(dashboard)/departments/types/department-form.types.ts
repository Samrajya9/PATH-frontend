import z from 'zod';
import { departmentFormSchema } from '../schemas/department-form.schema';

export type DepartmentFormValues = z.infer<typeof departmentFormSchema>;
