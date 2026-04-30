import z from 'zod';
import {
  testFormSchema,
  referenceRangeSchema,
  resultValueOptionSchema,
} from '../schemas/test-form.schema';

export type TestFormValues = z.infer<typeof testFormSchema>;
export type ReferenceRangeValues = z.infer<typeof referenceRangeSchema>;
export type ResultValueOptionValues = z.infer<typeof resultValueOptionSchema>;

// ReferenceRange with optional id for update
export type ReferenceRangeUpdateValues = ReferenceRangeValues & { id?: number };

export type ResultValueOptionUpdateValues = Partial<ResultValueOptionValues> & {
  id?: number;
};

export type TestUpdateFormValues = Partial<
  Omit<TestFormValues, 'referenceRanges' | 'resultValueOptions'>
> & {
  referenceRanges?: ReferenceRangeUpdateValues[];
  resultValueOptions?: ResultValueOptionUpdateValues[];
};
