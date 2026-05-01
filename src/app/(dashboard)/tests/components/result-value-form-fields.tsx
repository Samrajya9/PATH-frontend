import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import { Field, FieldLabel, FieldError } from '@/components/ui/field';
import { ResultValueTypeEnum } from '@/types/tests';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';

const RESULT_VALUE_TYPES = [
  ResultValueTypeEnum.NUMERIC,
  ResultValueTypeEnum.TEXT,
  ResultValueTypeEnum.CATEGORICAL,
] as const;

export function ResultValueFormFields() {
  const { control, watch, setValue } = useFormContext();

  const {
    fields: resultValueOptionFields,
    append: appendResultValueOption,
    remove: removeResultValueOption,
  } = useFieldArray({ control, name: 'resultValueOptions' });

  const resultValueType = watch('resultValueType');

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
    <>
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
    </>
  );
}
