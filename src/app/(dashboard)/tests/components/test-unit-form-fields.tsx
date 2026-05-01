import { useSuspenseQuery } from '@tanstack/react-query';
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
import { Field, FieldLabel, FieldError } from '@/components/ui/field';
import { getAllTestUnitsOptions } from '../../test-units/hooks/queries/test-unit-queries-options';

const TestUnitFormFields = () => {
  const { control } = useFormContext();
  const { data: testUnitsData } = useSuspenseQuery(
    getAllTestUnitsOptions({ page: 1, limit: 100 })
  );
  const testUnits = testUnitsData?.testUnits ?? [];

  return (
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
  );
};

export default TestUnitFormFields;
