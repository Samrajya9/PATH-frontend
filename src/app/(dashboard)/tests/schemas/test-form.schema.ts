import { GenderEnum } from '@/types/reference-range';
import { ResultValueTypeEnum } from '@/types/tests';
import { z } from 'zod';

export const resultValueOptionSchema = z.object({
  name: z.string().min(1, 'Value is required').max(255, 'Value too long'),
  isDefault: z.boolean(), // No default
  sortOrder: z.number().int().min(0), // No default
});

export const referenceRangeSchema = z
  .object({
    gender: z.enum(GenderEnum),
    age_min_years: z
      .number()
      .min(0, 'Age must be at least 0')
      .max(120, 'Age must be at most 120 years'),
    age_max_years: z
      .number()
      .min(0, 'Age must be at least 0')
      .max(120, 'Age must be at most 120 years'),
    normal_min: z.number(),
    normal_max: z.number(),
    critical_min: z.number().optional(),
    critical_max: z.number().optional(),
  })
  .refine((data) => data.age_min_years < data.age_max_years, {
    message: 'age_min_years must be less than age_max_years',
    path: ['age_min_years'],
  })
  .refine((data) => data.normal_min < data.normal_max, {
    message: 'normal_min must be less than normal_max',
    path: ['normal_min'],
  })
  .superRefine((data, ctx) => {
    const hasCriticalMin = data.critical_min !== undefined;
    const hasCriticalMax = data.critical_max !== undefined;

    if (hasCriticalMin !== hasCriticalMax) {
      ctx.addIssue({
        code: 'custom',
        path: ['critical_min'],
        message:
          'Both critical_min and critical_max must be provided together, or neither',
      });
      return;
    }

    if (data.critical_min !== undefined && data.critical_max !== undefined) {
      if (data.critical_min >= data.critical_max) {
        ctx.addIssue({
          code: 'custom',
          path: ['critical_min'],
          message: 'critical_min must be less than critical_max',
        });
      }

      if (data.critical_min >= data.normal_min) {
        ctx.addIssue({
          code: 'custom',
          path: ['critical_min'],
          message:
            'critical_min must be less than normal_min (critical values should be outside normal range)',
        });
      }

      if (data.critical_max <= data.normal_max) {
        ctx.addIssue({
          code: 'custom',
          path: ['critical_max'],
          message:
            'critical_max must be greater than normal_max (critical values should be outside normal range)',
        });
      }
    }
  });

export const testFormSchema = z
  .object({
    name: z
      .string()
      .min(3, 'Test unit name must be at least 3 characters long'),
    test_unit_id: z.number(),
    department_id: z.number(),
    resultValueType: z.enum(ResultValueTypeEnum),
    resultValueOptions: z.array(resultValueOptionSchema).optional(),
    referenceRanges: z
      .array(referenceRangeSchema)
      .min(1, 'At least one reference range is required'),
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
