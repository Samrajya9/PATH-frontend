'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { testFormSchema } from '../schemas/test-form.schema';
import { TestFormValues } from '../types/test-form.types';
import { GenderEnum } from '@/types/reference-range';
import { ResultValueTypeEnum } from '@/types/tests';

const defaultValues: TestFormValues = {
  name: '',
  test_unit_id: 0,
  department_id: 0,
  resultValueType: ResultValueTypeEnum.NUMERIC,
  referenceRanges: [
    {
      gender: GenderEnum.ANY,
      age_min_years: 0,
      age_max_years: 120,
      normal_min: 0,
      normal_max: 0,
    },
  ],
};

export default function useTestForm({
  initialValue,
}: {
  initialValue?: Partial<TestFormValues>;
} = {}) {
  const form = useForm<TestFormValues>({
    defaultValues: {
      ...defaultValues,
      ...initialValue,
    },
    resolver: zodResolver(testFormSchema),
  });

  return form;
}
