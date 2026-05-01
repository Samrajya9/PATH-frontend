import { Controller, useFormContext } from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { GenderEnum } from '@/types/reference-range';

import { Field, FieldLabel, FieldError } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

const GENDER_OPTIONS = [
  GenderEnum.ANY,
  GenderEnum.MALE,
  GenderEnum.FEMALE,
] as const;

export default function ReferenceRangeFormFields({
  idx,
  onClick,
  showDelete = false,
}: {
  idx?: number;
  onClick: (idx: number) => void;
  showDelete?: boolean;
}) {
  const { control } = useFormContext();

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            Range {(idx ?? 0) + 1}
          </span>

          <Controller
            control={control}
            name={`referenceRanges.${idx || 0}.gender`}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger size="sm" className="h-6 gap-1 px-2 text-xs">
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
        {showDelete && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-destructive hover:text-destructive"
            onClick={() => onClick(idx ?? 0)}
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
                    e.target.value === '' ? undefined : Number(e.target.value)
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
                    e.target.value === '' ? undefined : Number(e.target.value)
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
    </>
  );
}
