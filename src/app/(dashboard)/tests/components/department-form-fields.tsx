import { useSuspenseQuery } from '@tanstack/react-query';
import { getAllDepartmentsOptions } from '../../departments/hooks/queries/department-queries-options';
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

const DepartmentFormFields = () => {
  const { control } = useFormContext();

  const { data: departmentsData } = useSuspenseQuery(
    getAllDepartmentsOptions({ page: 1, limit: 100 })
  );

  const departments = departmentsData?.departments ?? [];

  return (
    <Controller
      control={control}
      name="department_id"
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor="form-test-department">Department</FieldLabel>
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
    />
  );
};

export default DepartmentFormFields;
