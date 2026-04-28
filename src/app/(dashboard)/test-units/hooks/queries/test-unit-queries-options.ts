import {
  QueryClient,
  UseMutationOptions,
  UseSuspenseQueryOptions,
  UseQueryOptions,
} from '@tanstack/react-query';
import testUnitClient from '../../client/test-units-client';
import testUnitQueryKeys from '../../constants/test-unit.queryKeys';
import { ApiSuccess } from '@/types/api-response';
import { TestUnit } from '@/types/test-unit';
import { Meta } from '@/types/data-response-meta';
import { TestUnitFormValues } from '../../types/test-unit-form.types';

type TestUnitResponse = ApiSuccess<{ testUnit: TestUnit }>;

type UpdateTestUnitVariables = {
  id: number;
  data: Partial<TestUnitFormValues>;
};

type CreateTestUnitMutationOptions = UseMutationOptions<
  TestUnitResponse,
  Error,
  TestUnitFormValues
>;

export const createTestUnitOptions = ({
  queryClient,
  options,
}: {
  queryClient: QueryClient;
  options?: CreateTestUnitMutationOptions;
}): CreateTestUnitMutationOptions => {
  return {
    ...options,
    mutationFn: async (data) => {
      return await testUnitClient.createTestUnit(data);
    },
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: testUnitQueryKeys.all });
      options?.onSuccess?.(...args);
    },
    onError: (...args) => {
      options?.onError?.(...args);
    },
  };
};

export const getAllTestUnitsOptions = ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}): UseSuspenseQueryOptions<{ testUnits: TestUnit[]; meta: Meta }> => {
  return {
    queryKey: testUnitQueryKeys.list({ page, limit }),
    queryFn: async () => {
      const response = await testUnitClient.getAllTestUnits({
        page,
        limit,
      });
      return response.data;
    },
  };
};

export const getOneTestUnitOptions = (
  id: number
): UseQueryOptions<{ testUnit: TestUnit }> => {
  return {
    queryKey: testUnitQueryKeys.detail(id),
    queryFn: async () => {
      const response = await testUnitClient.getOneTestUnit(id);
      return response.data;
    },
  };
};

type UpdateTestUnitMutationOptions = UseMutationOptions<
  TestUnitResponse,
  Error,
  UpdateTestUnitVariables
>;

export const updateTestUnitOptions = ({
  queryClient,
  options,
}: {
  queryClient: QueryClient;
  options?: UpdateTestUnitMutationOptions;
}): UpdateTestUnitMutationOptions => {
  return {
    ...options,
    mutationFn: async ({ id, data }) => {
      return await testUnitClient.updateTestUnit(id, data);
    },
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: testUnitQueryKeys.all,
      });
      options?.onSuccess?.(...args);
    },
    onError: (...args) => {
      options?.onError?.(...args);
    },
  };
};

type DeleteTestUnitMutationOptions = UseMutationOptions<
  TestUnitResponse,
  Error,
  number
>;

export const deleteTestUnitOptions = ({
  queryClient,
  options,
}: {
  queryClient: QueryClient;
  options?: DeleteTestUnitMutationOptions;
}): DeleteTestUnitMutationOptions => {
  return {
    ...options,
    mutationFn: async (id: number) => {
      return await testUnitClient.deleteTestUnit(id);
    },
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: testUnitQueryKeys.all });
      options?.onSuccess?.(...args);
    },
    onError: (...args) => {
      options?.onError?.(...args);
    },
  };
};
