'use client';

import React from 'react';
import { Controller, useFieldArray } from 'react-hook-form';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Plus, Trash2 } from 'lucide-react';
import useTestFormContext from '../contexts/test-form.context';
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { GenderEnum } from '@/types/reference-range';
import { ResultValueTypeEnum } from '@/types/tests';

const RESULT_VALUE_TYPES = [
  ResultValueTypeEnum.NUMERIC,
  ResultValueTypeEnum.TEXT,
  ResultValueTypeEnum.CATEGORICAL,
] as const;

const GENDER_OPTIONS = [
  GenderEnum.ANY,
  GenderEnum.MALE,
  GenderEnum.FEMALE,
] as const;

export default function TestFormFields() {
  const { control, watch, setValue } = useTestFormContext();

  const resultValueType = watch('resultValueType');

  const { data: departmentsData } = useSuspenseQuery(
    getAllDepartmentsOptions({ page: 1, limit: 100 })
  );
  const { data: testUnitsData } = useSuspenseQuery(
    getAllTestUnitsOptions({ page: 1, limit: 100 })
  );

  const departments = departmentsData?.departments ?? [];
  const testUnits = testUnitsData?.testUnits ?? [];

  const {
    fields: referenceRangeFields,
    append: appendReferenceRange,
    remove: removeReferenceRange,
  } = useFieldArray({ control, name: 'referenceRanges' });

  const {
    fields: resultValueOptionFields,
    append: appendResultValueOption,
    remove: removeResultValueOption,
  } = useFieldArray({ control, name: 'resultValueOptions' });

  const handleResultTypeChange = (type: ResultValueTypeEnum) => {
    setValue('resultValueType', type);
    if (type !== ResultValueTypeEnum.CATEGORICAL) {
      setValue('resultValueOptions', undefined);
    } else if (!watch('resultValueOptions')?.length) {
      setValue('resultValueOptions', [
        { name: '', isDefault: false, sortOrder: 0 },
      ]);
    }
  };

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
          <Controller
            control={control}
            name="department_id"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-test-department">
                  Department
                </FieldLabel>
                <Select
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
          />

          {/* Test Unit */}
          <Controller
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
          />
        </div>

        {/* Result Value Type */}
        <Field>
          <FieldLabel>Result Value Type</FieldLabel>
          <div className="flex flex-wrap gap-2">
            {RESULT_VALUE_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => handleResultTypeChange(type)}
                className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
                  resultValueType === type
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-input bg-background text-foreground hover:bg-muted'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </Field>
      </div>

      {/* Categorical Result Options */}
      {resultValueType === ResultValueTypeEnum.CATEGORICAL && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
              Result Options
            </h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                appendResultValueOption({
                  name: '',
                  isDefault: false,
                  sortOrder: resultValueOptionFields.length,
                })
              }
            >
              <Plus className="mr-1 h-3.5 w-3.5" />
              Add Option
            </Button>
          </div>

          <Controller
            control={control}
            name="resultValueOptions"
            render={({ fieldState }) => (
              <>
                {fieldState.invalid && fieldState.error?.message && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </>
            )}
          />

          {resultValueOptionFields.map((optField, idx) => (
            <div
              key={optField.id}
              className="space-y-3 rounded-md border bg-muted/30 p-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  Option {idx + 1}
                </span>
                <div className="flex items-center gap-2">
                  <Controller
                    control={control}
                    name={`resultValueOptions.${idx}.isDefault`}
                    render={({ field }) => (
                      <label className="flex cursor-pointer items-center gap-1.5 text-xs">
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="h-3.5 w-3.5 rounded"
                        />
                        Default
                      </label>
                    )}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                    onClick={() => removeResultValueOption(idx)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Controller
                  control={control}
                  name={`resultValueOptions.${idx}.name`}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={`form-test-opt-name-${idx}`}>
                        Value Name
                      </FieldLabel>
                      <Input
                        {...field}
                        id={`form-test-opt-name-${idx}`}
                        placeholder="e.g. Positive"
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError>{fieldState.error?.message}</FieldError>
                      )}
                    </Field>
                  )}
                />
                <Controller
                  control={control}
                  name={`resultValueOptions.${idx}.sortOrder`}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={`form-test-opt-sort-${idx}`}>
                        Sort Order
                      </FieldLabel>
                      <Input
                        {...field}
                        id={`form-test-opt-sort-${idx}`}
                        type="number"
                        min={0}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError>{fieldState.error?.message}</FieldError>
                      )}
                    </Field>
                  )}
                />
              </div>
            </div>
          ))}

          {resultValueOptionFields.length === 0 && (
            <p className="py-2 text-center text-sm text-muted-foreground italic">
              Add at least one result option for categorical tests.
            </p>
          )}
        </div>
      )}

      {/* Reference Ranges */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
            Reference Ranges
          </h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              appendReferenceRange({
                gender: GenderEnum.ANY,
                age_min_years: 0,
                age_max_years: 120,
                normal_min: 0,
                normal_max: 0,
              })
            }
          >
            <Plus className="mr-1 h-3.5 w-3.5" />
            Add Range
          </Button>
        </div>

        <Controller
          control={control}
          name="referenceRanges"
          render={({ fieldState }) => (
            <>
              {fieldState.invalid && fieldState.error?.message && (
                <FieldError>{fieldState.error.message}</FieldError>
              )}
            </>
          )}
        />

        {referenceRangeFields.map((rangeField, idx) => (
          <div
            key={rangeField.id}
            className="space-y-3 rounded-md border bg-muted/30 p-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">
                  Range {idx + 1}
                </span>
                <Controller
                  control={control}
                  name={`referenceRanges.${idx}.gender`}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        size="sm"
                        className="h-6 gap-1 px-2 text-xs"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Genders</SelectLabel>
                          {GENDER_OPTIONS.map((g) => (
                            <SelectItem key={g} value={g} className="text-xs">
                              {g}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              {referenceRangeFields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                  onClick={() => removeReferenceRange(idx)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>

            {/* Age Range */}
            <div className="grid grid-cols-2 gap-3">
              <Controller
                control={control}
                name={`referenceRanges.${idx}.age_min_years`}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={`form-test-range-age-min-${idx}`}>
                      Age Min (yrs)
                    </FieldLabel>
                    <Input
                      {...field}
                      id={`form-test-range-age-min-${idx}`}
                      type="number"
                      min={0}
                      max={120}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError>{fieldState.error?.message}</FieldError>
                    )}
                  </Field>
                )}
              />
              <Controller
                control={control}
                name={`referenceRanges.${idx}.age_max_years`}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={`form-test-range-age-max-${idx}`}>
                      Age Max (yrs)
                    </FieldLabel>
                    <Input
                      {...field}
                      id={`form-test-range-age-max-${idx}`}
                      type="number"
                      min={0}
                      max={120}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError>{fieldState.error?.message}</FieldError>
                    )}
                  </Field>
                )}
              />
            </div>

            {/* Normal Range */}
            <div className="grid grid-cols-2 gap-3">
              <Controller
                control={control}
                name={`referenceRanges.${idx}.normal_min`}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={`form-test-range-normal-min-${idx}`}>
                      Normal Min
                    </FieldLabel>
                    <Input
                      {...field}
                      id={`form-test-range-normal-min-${idx}`}
                      type="number"
                      step="any"
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError>{fieldState.error?.message}</FieldError>
                    )}
                  </Field>
                )}
              />
              <Controller
                control={control}
                name={`referenceRanges.${idx}.normal_max`}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={`form-test-range-normal-max-${idx}`}>
                      Normal Max
                    </FieldLabel>
                    <Input
                      {...field}
                      id={`form-test-range-normal-max-${idx}`}
                      type="number"
                      step="any"
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError>{fieldState.error?.message}</FieldError>
                    )}
                  </Field>
                )}
              />
            </div>

            {/* Critical Range (optional) */}
            <div className="grid grid-cols-2 gap-3">
              <Controller
                control={control}
                name={`referenceRanges.${idx}.critical_min`}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={`form-test-range-critical-min-${idx}`}>
                      Critical Min{' '}
                      <span className="font-normal text-muted-foreground">
                        (optional)
                      </span>
                    </FieldLabel>
                    <Input
                      id={`form-test-range-critical-min-${idx}`}
                      type="number"
                      step="any"
                      value={field.value ?? ''}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === ''
                            ? undefined
                            : Number(e.target.value)
                        )
                      }
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError>{fieldState.error?.message}</FieldError>
                    )}
                  </Field>
                )}
              />
              <Controller
                control={control}
                name={`referenceRanges.${idx}.critical_max`}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={`form-test-range-critical-max-${idx}`}>
                      Critical Max{' '}
                      <span className="font-normal text-muted-foreground">
                        (optional)
                      </span>
                    </FieldLabel>
                    <Input
                      id={`form-test-range-critical-max-${idx}`}
                      type="number"
                      step="any"
                      value={field.value ?? ''}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === ''
                            ? undefined
                            : Number(e.target.value)
                        )
                      }
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError>{fieldState.error?.message}</FieldError>
                    )}
                  </Field>
                )}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
