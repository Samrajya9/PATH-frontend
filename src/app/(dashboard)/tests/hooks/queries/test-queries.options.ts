import {
  UseSuspenseQueryOptions,
  UseQueryOptions,
} from '@tanstack/react-query';
import testClient from '../../client/tests-client';
import testsQueryKeys from '../../constants/tests.queryKeys';
import { Test } from '@/types/tests';
import { Meta } from '@/types/data-response-meta';

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
