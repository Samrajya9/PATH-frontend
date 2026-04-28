'use client';

import React from 'react';
import { Controller } from 'react-hook-form';
import useTestUnitFormContext from '../contexts/test-unit-form.context';
import { Field, FieldLabel, FieldError } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

export default function TestUnitFormFields() {
  const { control } = useTestUnitFormContext();

  return (
    <>
      <Controller
        control={control}
        name="name"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="form-test-unit-name">Name</FieldLabel>
            <Input
              {...field}
              id="form-test-unit-name"
              placeholder="Enter test unit name"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && (
              <FieldError>{fieldState.error?.message}</FieldError>
            )}
          </Field>
        )}
      />
    </>
  );
}
