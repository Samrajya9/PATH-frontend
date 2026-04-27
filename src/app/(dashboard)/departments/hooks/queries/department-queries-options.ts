// department-queries-options.ts
import {
  QueryClient,
  UseMutationOptions,
  UseSuspenseQueryOptions,
} from '@tanstack/react-query';
import z from 'zod';
import { departmentFormSchema } from '../../schemas/department-form.schema';
import departmentClient from '../../client.ts/department-client';
import departmentQueryKeys from '../../constants/department.queryKeys';
import { ApiSuccess } from '@/types/api-response';
import { Department } from '@/types/departments';
import { Meta } from '@/types/data-response-meta';
import { id } from 'zod/locales';

type CreateDepartmentVariables = z.infer<typeof departmentFormSchema>;
type CreateDepartmentResponse = ApiSuccess<{ department: Department }>;

export const createDepartmentOptions = ({
  queryClient,
  options,
}: {
  queryClient: QueryClient;
  options?: UseMutationOptions<
    CreateDepartmentResponse,
    Error,
    CreateDepartmentVariables
  >;
}): UseMutationOptions<
  CreateDepartmentResponse,
  Error,
  CreateDepartmentVariables
> => {
  return {
    ...options,
    mutationFn: async (data) => {
      return await departmentClient.createDepartment(data);
    },
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: departmentQueryKeys.all });
      options?.onSuccess?.(...args);
    },
    onError: (...args) => {
      options?.onError?.(...args);
    },
  };
};

export const getAllDepartmentsOptions = ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}): UseSuspenseQueryOptions<{ departments: Department[]; meta: Meta }> => {
  return {
    queryKey: [...departmentQueryKeys.all, { page, limit }],
    queryFn: async () => {
      const response = await departmentClient.getAllDepartments({
        page,
        limit,
      });
      return response.data;
    },
  };
};

type UpdateDepartmentVariables = Partial<z.infer<typeof departmentFormSchema>>;
type UpdateDepartmentResponse = ApiSuccess<{ department: Department }>;

export const updateDepartmentOptions = ({
  queryClient,
  options,
  id,
}: {
  queryClient: QueryClient;
  options?: UseMutationOptions<
    UpdateDepartmentResponse,
    Error,
    UpdateDepartmentVariables
  >;
  id: number;
}): UseMutationOptions<
  UpdateDepartmentResponse,
  Error,
  UpdateDepartmentVariables
> => {
  return {
    ...options,
    mutationFn: async (data) => {
      return await departmentClient.updateDepartment(id, data);
    },
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: departmentQueryKeys.detail(id),
      });
      options?.onSuccess?.(...args);
    },
    onError: (...args) => {
      options?.onError?.(...args);
    },
  };
};
