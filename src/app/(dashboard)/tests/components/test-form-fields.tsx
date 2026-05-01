'use client';

import { Controller } from 'react-hook-form';
import useTestFormContext from '../contexts/test-form.context';
import { Field, FieldLabel, FieldError } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { ResultValueFormFields } from './result-value-form-fields';
import ReferenceRangeArrayFormFields from './reference-range-array-form-fields';
import TestUnitFormFields from './test-unit-form-fields';
import DepartmentFormFields from './department-form-fields';

export default function TestFormFields() {
  const { control } = useTestFormContext();

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
          Basic Information
        </h3>

        {/* Name */}
        <Controller
          control={control}
          name="name"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-test-name">Test Name</FieldLabel>
              <Input
                {...field}
                id="form-test-name"
                placeholder="e.g. Complete Blood Count"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && (
                <FieldError>{fieldState.error?.message}</FieldError>
              )}
            </Field>
          )}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <DepartmentFormFields />

          <TestUnitFormFields />
        </div>
      </div>

      <ResultValueFormFields />
      <ReferenceRangeArrayFormFields />
    </div>
  );
}
