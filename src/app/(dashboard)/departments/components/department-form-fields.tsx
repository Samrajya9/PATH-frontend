'use client';
import { Controller } from 'react-hook-form';
import useDepartmentFormContext from '../contexts/department-form.context';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

export default function DepartmentFormFields() {
  const form = useDepartmentFormContext();
  return (
    <Controller
      name="name"
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor="form-department-name">
            Department Name
          </FieldLabel>
          <Input
            {...field}
            id="form-department-name"
            aria-invalid={fieldState.invalid}
            placeholder="Department Name"
            autoComplete="off"
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
