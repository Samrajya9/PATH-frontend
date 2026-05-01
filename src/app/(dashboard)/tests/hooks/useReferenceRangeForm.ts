import { useForm } from 'react-hook-form';
import {
  referenceRangeFormSchema,
  ReferenceRangeFormValues,
} from '../schemas/reference-range-form.schema';
import { GenderEnum } from '@/types/reference-range';
import { zodResolver } from '@hookform/resolvers/zod';

const defaultReferenceRangeValues: ReferenceRangeFormValues = {
  gender: GenderEnum.ANY,
  age_min_years: 0,
  age_max_years: 120,
  normal_min: 0,
  normal_max: 100,
  critical_min: 0,
  critical_max: 100,
};

export function useReferenceRangeForm({
  initialValue,
}: { initialValue?: Partial<ReferenceRangeFormValues> } = {}) {
  return useForm<ReferenceRangeFormValues>({
    defaultValues: { ...defaultReferenceRangeValues, ...initialValue },
    resolver: zodResolver(referenceRangeFormSchema),
  });
}
