import { Button } from '@/components/ui/button';
import { FieldError } from '@/components/ui/field';
import { GenderEnum } from '@/types/reference-range';
import { Plus } from 'lucide-react';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import { ReferenceRangeFormFields } from './reference-range-form-fields';

export function ReferenceRangeArrayFormFields() {
  const { control } = useFormContext();

  const {
    fields: referenceRangeFields,
    append: appendReferenceRange,
    remove: removeReferenceRange,
  } = useFieldArray({ control, name: 'referenceRanges' });

  return (
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
          <ReferenceRangeFormFields
            idx={idx}
            onClick={() => {
              removeReferenceRange(idx);
            }}
            showDelete={referenceRangeFields.length > 1}
          />
        </div>
      ))}
    </div>
  );
}
