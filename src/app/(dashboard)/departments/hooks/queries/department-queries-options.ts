import {
  QueryClient,
  UseMutationOptions,
  UseSuspenseQueryOptions,
} from '@tanstack/react-query';
import departmentClient from '../../client.ts/department-client';
import departmentQueryKeys from '../../constants/department.queryKeys';
import { ApiSuccess } from '@/types/api-response';
import { Department } from '@/types/departments';
import { Meta } from '@/types/data-response-meta';
import { DepartmentFormValues } from '../../types/department-form.types';

type DepartmentResponse = ApiSuccess<{ department: Department }>;

type UpdateDepartmentVariables = {
  id: number;
  data: Partial<DepartmentFormValues>;
};

type CreateDepartmentMutationOptions = UseMutationOptions<
  DepartmentResponse,
  Error,
  DepartmentFormValues
>;
export const createDepartmentOptions = ({
  queryClient,
  options,
}: {
  queryClient: QueryClient;
  options?: CreateDepartmentMutationOptions;
}): CreateDepartmentMutationOptions => {
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

type UpdateDepartmentMutationOptions = UseMutationOptions<
  DepartmentResponse,
  Error,
  UpdateDepartmentVariables
>;

export const updateDepartmentOptions = ({
  queryClient,
  options,
}: {
  queryClient: QueryClient;
  options?: UpdateDepartmentMutationOptions;
}): UpdateDepartmentMutationOptions => {
  return {
    ...options,
    mutationFn: async ({ id, data }) => {
      return await departmentClient.updateDepartment(id, data);
    },
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: departmentQueryKeys.all,
      });
      options?.onSuccess?.(...args);
    },
    onError: (...args) => {
      options?.onError?.(...args);
    },
  };
};

type DeleteDepartmentMutationOptions = UseMutationOptions<
  DepartmentResponse,
  Error,
  number
>;
export const deleteDepartmentOptions = ({
  queryClient,
  options,
}: {
  queryClient: QueryClient;
  options?: DeleteDepartmentMutationOptions;
}): DeleteDepartmentMutationOptions => {
  return {
    ...options,
    mutationFn: async (id: number) => {
      return await departmentClient.deleteDepartment(id);
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
