'use client';

import { useFormContext } from 'react-hook-form';
import z from 'zod';
import { departmentFormSchema } from '../schemas/department-form.schema';

export default function useDepartmentFormContext() {
  return useFormContext<z.infer<typeof departmentFormSchema>>();
}
