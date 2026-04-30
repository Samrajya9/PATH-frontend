import z from 'zod';
import { testFormSchema } from '../schemas/test-form.schema';

export type TestFormValues = z.infer<typeof testFormSchema>;
