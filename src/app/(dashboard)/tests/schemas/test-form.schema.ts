import { z } from 'zod';
import { resultValueFormSchema } from './result-value-form.schema';
import { referenceRangeArraySchema } from './reference-range-form.schema';

const baseTestSchema = z.object({
  name: z.string().min(3, 'Test unit name must be at least 3 characters long'),
  test_unit_id: z.number(),
  department_id: z.number(),
});

export const testFormSchema = baseTestSchema
  .and(resultValueFormSchema)
  .and(referenceRangeArraySchema);

export type TestFormValues = z.infer<typeof testFormSchema>;
