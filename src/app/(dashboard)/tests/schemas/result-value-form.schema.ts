import { ResultValueTypeEnum } from '@/types/tests';
import { z } from 'zod';

export const resultValueOptionSchema = z.object({
  id: z.number().int().positive().optional(),

  name: z.string().min(1, 'Value is required').max(255, 'Value too long'),
  isDefault: z.boolean(), // No default
  sortOrder: z.number().int().min(0), // No default
});

export const resultValueFormSchema = z
  .object({
    resultValueType: z.enum(ResultValueTypeEnum),
    resultValueOptions: z.array(resultValueOptionSchema).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.resultValueType === 'Categorical') {
      if (!data.resultValueOptions || data.resultValueOptions.length === 0) {
        ctx.addIssue({
          path: ['resultValueOptions'],
          code: 'custom',
          message: 'resultValueOptions is required for categorical tests',
        });
      } else {
        const defaultCount = data.resultValueOptions.filter(
          (opt) => opt.isDefault
        ).length;

        if (defaultCount > 1) {
          ctx.addIssue({
            path: ['resultValueOptions'],
            code: 'custom',
            message: 'Only one option can be set as default',
          });
        }
      }
    }

    if (data.resultValueType !== 'Categorical' && data.resultValueOptions) {
      ctx.addIssue({
        path: ['resultValueOptions'],
        code: 'custom',
        message:
          'resultValueOptions should only be provided for categorical tests',
      });
    }
  });

export type ResultValueFormValues = z.infer<typeof resultValueFormSchema>;
