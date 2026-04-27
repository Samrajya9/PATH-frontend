'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { departmentFormSchema } from '../schemas/department-form.schema';
import { useEffect } from 'react';

export default function useDepartmentForm({
  initialValue = {},
}: {
  initialValue?: Partial<z.infer<typeof departmentFormSchema>>;
}) {
  const form = useForm<z.infer<typeof departmentFormSchema>>({
    defaultValues: {
      name: '',
    },
    resolver: zodResolver(departmentFormSchema),
  });

  useEffect(() => {
    if (initialValue) {
      form.reset({ ...initialValue });
    }
  }, [initialValue]);

  return form;
}
