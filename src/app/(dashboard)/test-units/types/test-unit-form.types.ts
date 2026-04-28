import z from 'zod';
import { testUnitFormSchema } from '../schemas/test-unit-form.schema';

export type TestUnitFormValues = z.infer<typeof testUnitFormSchema>;
