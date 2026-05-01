import z from 'zod';
import { testFormSchema } from '../schemas/test-form.schema';
import { referenceRangeSchema } from '../schemas/reference-range-form.schema';
import { resultValueOptionSchema } from '../schemas/result-value-form.schema';

export type TestFormValues = z.infer<typeof testFormSchema>;
export type ReferenceRangeValues = z.infer<typeof referenceRangeSchema>;
export type ResultValueOptionValues = z.infer<typeof resultValueOptionSchema>;

// For update: root fields are partial, nested arrays reuse the same types
// (id is already optional in both schemas — present for existing records, absent for new ones)
export type TestUpdateFormValues = Partial<
  Omit<TestFormValues, 'referenceRanges' | 'resultValueOptions'>
> & {
  referenceRanges?: ReferenceRangeValues[];
  resultValueOptions?: ResultValueOptionValues[];
};
