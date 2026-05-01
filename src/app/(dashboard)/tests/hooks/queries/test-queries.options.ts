// import {
//   UseSuspenseQueryOptions,
//   QueryClient,
//   UseMutationOptions,
// } from '@tanstack/react-query';
// import testClient from '../../client/tests-client';
// import testsQueryKeys from '../../constants/tests.queryKeys';
// import { Test } from '@/types/tests';
// import { Meta } from '@/types/data-response-meta';
// import { ApiSuccess } from '@/types/api-response';
// import {
//   TestFormValues,
//   TestUpdateFormValues,
// } from '../../types/test-form.types';

// export const getAllTestsOptions = ({
//   page,
//   limit,
// }: {
//   page: number;
//   limit: number;
// }): UseSuspenseQueryOptions<{
//   tests: Omit<Test, 'resultValueOptions' | 'referenceRanges'>[];
//   meta: Meta;
// }> => {
//   return {
//     queryKey: testsQueryKeys.list({ page, limit }),
//     queryFn: async () => {
//       const response = await testClient.getAllTests({
//         page,
//         limit,
//       });
//       return response.data;
//     },
//   };
// };

// export const getOneTestOptions = (
//   id: number
// ): UseSuspenseQueryOptions<Test> => {
//   return {
//     queryKey: testsQueryKeys.detail(id),
//     queryFn: async () => {
//       const response = await testClient.getOneTest(id);
//       return response.data;
//     },
//   };
// };

// type TestResponse = ApiSuccess<Test>;

// type CreateTestMutationOptions = UseMutationOptions<
//   TestResponse,
//   Error,
//   TestFormValues
// >;
// export const createTestOptions = ({
//   queryClient,
//   options,
// }: {
//   queryClient: QueryClient;
//   options?: CreateTestMutationOptions;
// }): CreateTestMutationOptions => {
//   return {
//     ...options,
//     mutationFn: async (data) => {
//       return await testClient.createTest(data);
//     },
//     onSuccess: (...args) => {
//       queryClient.invalidateQueries({ queryKey: testsQueryKeys.all });
//       options?.onSuccess?.(...args);
//     },
//     onError: (...args) => {
//       options?.onError?.(...args);
//     },
//   };
// };

// type DeleteTestMutationOptions = UseMutationOptions<
//   ApiSuccess<true>,
//   Error,
//   number
// >;
// export const deleteTestOptions = ({
//   queryClient,
//   options,
// }: {
//   queryClient: QueryClient;
//   options?: DeleteTestMutationOptions;
// }): DeleteTestMutationOptions => {
//   return {
//     ...options,
//     mutationFn: async (id: number) => {
//       return await testClient.deleteTest(id);
//     },
//     onSuccess: (...args) => {
//       queryClient.invalidateQueries({ queryKey: testsQueryKeys.all });
//       options?.onSuccess?.(...args);
//     },
//     onError: (...args) => {
//       options?.onError?.(...args);
//     },
//   };
// };

// type UpdateTestMutationOptions = UseMutationOptions<
//   TestResponse,
//   Error,
//   { id: number; data: TestUpdateFormValues }
// >;

// export const updateTestOptions = ({
//   queryClient,
//   options,
// }: {
//   queryClient: QueryClient;
//   options?: UpdateTestMutationOptions;
// }): UpdateTestMutationOptions => {
//   return {
//     ...options,
//     mutationFn: async ({ id, data }) => {
//       return await testClient.updateTest(id, data);
//     },
//     onSuccess: (...args) => {
//       queryClient.invalidateQueries({ queryKey: testsQueryKeys.all });
//       options?.onSuccess?.(...args);
//     },
//     onError: (...args) => {
//       options?.onError?.(...args);
//     },
//   };
// };

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
  ReferenceRangeValues,
  ResultValueOptionValues,
} from '../../types/test-form.types';
import { ReferenceRange } from '@/types/reference-range';
import { ResultValueOption } from '@/types/result-value-option';

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
    mutationFn: async (data) => {
      return await testClient.createTest(data);
    },
    ...options,

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
    mutationFn: async (id: number) => {
      return await testClient.deleteTest(id);
    },
    ...options,

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
    mutationFn: async ({ id, data }) => {
      return await testClient.updateTest(id, data);
    },
    ...options,

    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: testsQueryKeys.all });
      options?.onSuccess?.(...args);
    },
    onError: (...args) => {
      options?.onError?.(...args);
    },
  };
};

// ─── Reference Range Mutation Options ────────────────────────────────────────

type AddRefRangeMutationOptions = UseMutationOptions<
  ApiSuccess<ReferenceRange>,
  Error,
  { data: ReferenceRangeValues }
>;
export const addReferenceRangeOptions = ({
  queryClient,
  testId,
  options,
}: {
  queryClient: QueryClient;
  testId: number;
  options?: AddRefRangeMutationOptions;
}): AddRefRangeMutationOptions => ({
  mutationFn: async ({ data }) => testClient.addRefRangesForTest(testId, data),
  ...options,

  onSuccess: (...args) => {
    queryClient.invalidateQueries({ queryKey: testsQueryKeys.detail(testId) });
    options?.onSuccess?.(...args);
  },
  onError: (...args) => {
    options?.onError?.(...args);
  },
});

type DeleteRefRangeMutationOptions = UseMutationOptions<
  ApiSuccess<true>,
  Error,
  { refRangeId: number }
>;
export const deleteRefRangeOptions = ({
  queryClient,
  testId,
  options,
}: {
  queryClient: QueryClient;
  testId: number;
  options?: DeleteRefRangeMutationOptions;
}): DeleteRefRangeMutationOptions => ({
  mutationFn: async ({ refRangeId }) =>
    testClient.deleteRefRangeForTest(testId, refRangeId),
  ...options,

  onSuccess: (...args) => {
    queryClient.invalidateQueries({ queryKey: testsQueryKeys.detail(testId) });
    options?.onSuccess?.(...args);
  },
  onError: (...args) => {
    options?.onError?.(...args);
  },
});

type UpdateRefRangeMutationOptions = UseMutationOptions<
  ApiSuccess<ReferenceRange>,
  Error,
  { refRangeId: number; data: ReferenceRangeValues }
>;
export const updateRefRangeOptions = ({
  queryClient,
  testId,
  options,
}: {
  queryClient: QueryClient;
  testId: number;
  options?: UpdateRefRangeMutationOptions;
}): UpdateRefRangeMutationOptions => ({
  mutationFn: async ({ refRangeId, data }) =>
    testClient.updateRefRangeForTest(testId, refRangeId, data),
  ...options,

  onSuccess: (...args) => {
    queryClient.invalidateQueries({ queryKey: testsQueryKeys.detail(testId) });
    options?.onSuccess?.(...args);
  },
  onError: (...args) => {
    options?.onError?.(...args);
  },
});

// ─── Result Value Option Mutation Options ─────────────────────────────────────

type AddResultOptionMutationOptions = UseMutationOptions<
  ApiSuccess<ResultValueOption>,
  Error,
  { data: ResultValueOptionValues }
>;
export const addResultValueOptionOptions = ({
  queryClient,
  testId,
  options,
}: {
  queryClient: QueryClient;
  testId: number;
  options?: AddResultOptionMutationOptions;
}): AddResultOptionMutationOptions => ({
  mutationFn: async ({ data }) =>
    testClient.addResultOptionsForTest(testId, data),
  ...options,

  onSuccess: (...args) => {
    queryClient.invalidateQueries({ queryKey: testsQueryKeys.detail(testId) });
    options?.onSuccess?.(...args);
  },
  onError: (...args) => {
    options?.onError?.(...args);
  },
});

type DeleteResultOptionMutationOptions = UseMutationOptions<
  ApiSuccess<true>,
  Error,
  { resultValueOptionId: number }
>;
export const deleteResultOptionOptions = ({
  queryClient,
  testId,
  options,
}: {
  queryClient: QueryClient;
  testId: number;
  options?: DeleteResultOptionMutationOptions;
}): DeleteResultOptionMutationOptions => ({
  mutationFn: async ({ resultValueOptionId }) =>
    testClient.deleteResultOptionsForTest(testId, resultValueOptionId),
  ...options,

  onSuccess: (...args) => {
    queryClient.invalidateQueries({ queryKey: testsQueryKeys.detail(testId) });
    options?.onSuccess?.(...args);
  },
  onError: (...args) => {
    options?.onError?.(...args);
  },
});

type UpdateResultOptionMutationOptions = UseMutationOptions<
  ApiSuccess<ResultValueOption>,
  Error,
  { resultValueOptionId: number; data: ResultValueOptionValues }
>;
export const updateResultOptionOptions = ({
  queryClient,
  testId,
  options,
}: {
  queryClient: QueryClient;
  testId: number;
  options?: UpdateResultOptionMutationOptions;
}): UpdateResultOptionMutationOptions => ({
  mutationFn: async ({ resultValueOptionId, data }) =>
    testClient.updateResultOptionsForTest(testId, resultValueOptionId, data),
  ...options,

  onSuccess: (...args) => {
    queryClient.invalidateQueries({ queryKey: testsQueryKeys.detail(testId) });
    options?.onSuccess?.(...args);
  },
  onError: (...args) => {
    options?.onError?.(...args);
  },
});
