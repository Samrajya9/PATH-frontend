'use client';

import { useFormContext } from 'react-hook-form';
import { TestFormValues } from '../types/test-form.types';

export default function useTestFormContext() {
  return useFormContext<TestFormValues>();
}
