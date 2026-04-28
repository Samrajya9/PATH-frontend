'use client';

import { useFormContext } from 'react-hook-form';
import { TestUnitFormValues } from '../types/test-unit-form.types';

export default function useTestUnitFormContext() {
  return useFormContext<TestUnitFormValues>();
}
