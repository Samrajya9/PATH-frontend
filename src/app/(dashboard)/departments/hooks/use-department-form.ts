'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { departmentFormSchema } from '../schemas/department-form.schema';

const defaultValues: z.infer<typeof departmentFormSchema> = {
  name: '',
};

export default function useDepartmentForm({
  initialValue,
}: {
  initialValue?: Partial<z.infer<typeof departmentFormSchema>>;
} = {}) {
  const form = useForm<z.infer<typeof departmentFormSchema>>({
    defaultValues: {
      ...defaultValues,
      ...initialValue,
    },
    resolver: zodResolver(departmentFormSchema),
  });

  return form;
}
