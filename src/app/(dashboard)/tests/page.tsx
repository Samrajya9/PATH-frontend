import React from 'react';
import { serverHttp } from '@/lib/axios/server.axios';
import testsQueryKeys from './constants/tests.queryKeys';
import departmentQueryKeys from '../departments/constants/department.queryKeys';
import testUnitQueryKeys from '../test-units/constants/test-unit.queryKeys';
import CreateTestButton from './components/create-test-button';
import TestTable from './components/test-table';
import { Test } from '@/types/tests';
import { Department } from '@/types/departments';
import { TestUnit } from '@/types/test-unit';
import { Meta } from '@/types/data-response-meta';
import Prefetcher from '@/components/prefetcher';
import { ErrorBoundary } from '@/components/error-boundary';

export default async function TestsPage() {
  const page = 1;
  const limit = 10;

  return (
    <Prefetcher
      fetchQueryOptions={[
        // Seed the tests list
        {
          queryKey: testsQueryKeys.list({ page, limit }),
          queryFn: async () => {
            const response = await serverHttp.get<{
              tests: Omit<Test, 'resultValueOptions' | 'referenceRanges'>[];
              meta: Meta;
            }>('tests', { params: { page, limit } });
            return response.data;
          },
        },
        // Pre-seed departments for the create form dropdowns
        {
          queryKey: [...departmentQueryKeys.all, { page: 1, limit: 100 }],
          queryFn: async () => {
            const response = await serverHttp.get<{
              departments: Department[];
              meta: Meta;
            }>('departments', { params: { page: 1, limit: 100 } });
            return response.data;
          },
        },
        // Pre-seed test units for the create form dropdowns
        {
          queryKey: testUnitQueryKeys.list({ page: 1, limit: 100 }),
          queryFn: async () => {
            const response = await serverHttp.get<{
              testUnits: TestUnit[];
              meta: Meta;
            }>('test-units', { params: { page: 1, limit: 100 } });
            return response.data;
          },
        },
      ]}
    >
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Tests</h2>
          <CreateTestButton />
        </div>

        <ErrorBoundary
          fallback={
            <p className="text-destructive">
              Failed to load tests. Please refresh.
            </p>
          }
        >
          <TestTable />
        </ErrorBoundary>
      </div>
    </Prefetcher>
  );
}
