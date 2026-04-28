import { useForm } from 'react-hook-form';
import { TestUnitFormValues } from '../types/test-unit-form.types';
import { zodResolver } from '@hookform/resolvers/zod';
import { testUnitFormSchema } from '../schemas/test-unit-form.schema';

const defaultValues: TestUnitFormValues = {
  name: '',
};

export default function useTestUnitForm({
  initialValue,
}: {
  initialValue?: Partial<TestUnitFormValues>;
} = {}) {
  const form = useForm<TestUnitFormValues>({
    defaultValues: {
      ...defaultValues,
      ...initialValue,
    },
    resolver: zodResolver(testUnitFormSchema),
  });

  return form;
}
