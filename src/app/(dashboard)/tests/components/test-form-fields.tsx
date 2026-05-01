'use client';

import { Controller } from 'react-hook-form';
import { useSuspenseQuery } from '@tanstack/react-query';
import useTestFormContext from '../contexts/test-form.context';
import { Field, FieldLabel, FieldError } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getAllDepartmentsOptions } from '../../departments/hooks/queries/department-queries-options';
import { getAllTestUnitsOptions } from '../../test-units/hooks/queries/test-unit-queries-options';
import { ResultValueFormFields } from './result-value-form-fields';
import { ReferenceRangeArrayFormFields } from './reference-range-array-form-fields';
import TestUnitFormFields from './test-unit-form-fields';
import DepartmentFormFields from './department-form-fields';

export default function TestFormFields() {
  const { control } = useTestFormContext();

  const { data: departmentsData } = useSuspenseQuery(
    getAllDepartmentsOptions({ page: 1, limit: 100 })
  );
  const { data: testUnitsData } = useSuspenseQuery(
    getAllTestUnitsOptions({ page: 1, limit: 100 })
  );

  const departments = departmentsData?.departments ?? [];
  const testUnits = testUnitsData?.testUnits ?? [];

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
          {/* Department */}
          {/* <Controller
            control={control}
            name="department_id"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-test-department">
                  Department
                </FieldLabel>
                <Select
                  defaultValue={String(
                    departments.find((d) => d.id == field.value)?.id
                  )}
                  value={field.value ? String(field.value) : ''}
                  onValueChange={(val) => field.onChange(Number(val))}
                >
                  <SelectTrigger
                    id="form-test-department"
                    aria-invalid={fieldState.invalid}
                    className="w-full"
                  >
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Departments</SelectLabel>

                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={String(dept.id)}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError>{fieldState.error?.message}</FieldError>
                )}
              </Field>
            )}
          /> */}

          <DepartmentFormFields />

          {/* Test Unit */}
          {/* <Controller
            control={control}
            name="test_unit_id"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-test-unit">Test Unit</FieldLabel>
                <Select
                  value={field.value ? String(field.value) : ''}
                  onValueChange={(val) => field.onChange(Number(val))}
                >
                  <SelectTrigger
                    id="form-test-unit"
                    aria-invalid={fieldState.invalid}
                    className="w-full"
                  >
                    <SelectValue placeholder="Select test unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Test Units</SelectLabel>

                      {testUnits.map((unit) => (
                        <SelectItem key={unit.id} value={String(unit.id)}>
                          {unit.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError>{fieldState.error?.message}</FieldError>
                )}
              </Field>
            )}
          /> */}

          <TestUnitFormFields />
        </div>
      </div>

      <ResultValueFormFields />

      {/* Reference Ranges */}

      <ReferenceRangeArrayFormFields />
    </div>
  );
}
