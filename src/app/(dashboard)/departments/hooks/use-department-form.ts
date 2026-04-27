'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { departmentFormSchema } from '../schemas/department-form.schema';
import { DepartmentFormValues } from '../types/department-form.types';

const defaultValues: DepartmentFormValues = {
  name: '',
};

export default function useDepartmentForm({
  initialValue,
}: {
  initialValue?: Partial<DepartmentFormValues>;
} = {}) {
  const form = useForm<DepartmentFormValues>({
    defaultValues: {
      ...defaultValues,
      ...initialValue,
    },
    resolver: zodResolver(departmentFormSchema),
  });

  return form;
}
