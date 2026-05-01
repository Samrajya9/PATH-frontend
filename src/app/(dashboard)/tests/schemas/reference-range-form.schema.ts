import { z } from 'zod';
import { GenderEnum } from '@/types/reference-range';

export const referenceRangeSchema = z
  .object({
    id: z.number().int().positive().optional(),

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

export const referenceRangeFormSchema = referenceRangeSchema;

export const referenceRangeArraySchema = z.object({
  referenceRanges: z
    .array(referenceRangeSchema)
    .min(1, 'At least one reference range is required'),
});
export type ReferenceRangeFormValues = z.infer<typeof referenceRangeFormSchema>;
