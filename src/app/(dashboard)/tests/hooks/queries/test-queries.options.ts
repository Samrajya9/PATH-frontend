import {
  UseSuspenseQueryOptions,
  QueryClient,
  UseMutationOptions,
} from '@tanstack/react-query';
import testClient from '../../client/tests-client';
import testsQueryKeys from '../../constants/tests.queryKeys';
import { Test } from '@/types/tests';
import { Meta } from '@/types/data-response-meta';
import { ApiSuccess } from '@/types/api-response';
import {
  TestFormValues,
  TestUpdateFormValues,
} from '../../types/test-form.types';

export const getAllTestsOptions = ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}): UseSuspenseQueryOptions<{
  tests: Omit<Test, 'resultValueOptions' | 'referenceRanges'>[];
  meta: Meta;
}> => {
  return {
    queryKey: testsQueryKeys.list({ page, limit }),
    queryFn: async () => {
      const response = await testClient.getAllTests({
        page,
        limit,
      });
      return response.data;
    },
  };
};

export const getOneTestOptions = (
  id: number
): UseSuspenseQueryOptions<Test> => {
  return {
    queryKey: testsQueryKeys.detail(id),
    queryFn: async () => {
      const response = await testClient.getOneTest(id);
      return response.data;
    },
  };
};

type TestResponse = ApiSuccess<Test>;

type CreateTestMutationOptions = UseMutationOptions<
  TestResponse,
  Error,
  TestFormValues
>;
export const createTestOptions = ({
  queryClient,
  options,
}: {
  queryClient: QueryClient;
  options?: CreateTestMutationOptions;
}): CreateTestMutationOptions => {
  return {
    ...options,
    mutationFn: async (data) => {
      return await testClient.createTest(data);
    },
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: testsQueryKeys.all });
      options?.onSuccess?.(...args);
    },
    onError: (...args) => {
      options?.onError?.(...args);
    },
  };
};

type DeleteTestMutationOptions = UseMutationOptions<
  ApiSuccess<true>,
  Error,
  number
>;
export const deleteTestOptions = ({
  queryClient,
  options,
}: {
  queryClient: QueryClient;
  options?: DeleteTestMutationOptions;
}): DeleteTestMutationOptions => {
  return {
    ...options,
    mutationFn: async (id: number) => {
      return await testClient.deleteTest(id);
    },
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: testsQueryKeys.all });
      options?.onSuccess?.(...args);
    },
    onError: (...args) => {
      options?.onError?.(...args);
    },
  };
};

type UpdateTestMutationOptions = UseMutationOptions<
  TestResponse,
  Error,
  { id: number; data: TestUpdateFormValues }
>;

export const updateTestOptions = ({
  queryClient,
  options,
}: {
  queryClient: QueryClient;
  options?: UpdateTestMutationOptions;
}): UpdateTestMutationOptions => {
  return {
    ...options,
    mutationFn: async ({ id, data }) => {
      return await testClient.updateTest(id, data);
    },
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: testsQueryKeys.all });
      options?.onSuccess?.(...args);
    },
    onError: (...args) => {
      options?.onError?.(...args);
    },
  };
};
