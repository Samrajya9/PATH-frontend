import React from 'react';
import { serverHttp } from '@/lib/axios/server.axios';
import testUnitQueryKeys from './constants/test-unit.queryKeys';
import CreateTestUnitButton from './components/create-test-unit-button';
import TestUnitTable from './components/test-unit-table';
import { TestUnit } from '@/types/test-unit';
import { Meta } from '@/types/data-response-meta';
import Prefetcher from '@/components/prefetcher';
import { ErrorBoundary } from '@/components/error-boundary';

export default async function TestUnitsPage() {
  const page = 1;
  const limit = 10;

  return (
    <Prefetcher
      fetchQueryOptions={[
        {
          queryKey: testUnitQueryKeys.list({ page, limit }),
          queryFn: async () => {
            const response = await serverHttp.get<{
              testUnits: TestUnit[];
              meta: Meta;
            }>('test-units', {
              params: { page, limit },
            });
            return response.data;
          },
        },
      ]}
    >
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Test Units</h2>
          <CreateTestUnitButton />
        </div>

        <ErrorBoundary
          fallback={
            <p className="text-destructive">
              Failed to load test units. Please refresh.
            </p>
          }
        >
          <TestUnitTable />
        </ErrorBoundary>
      </div>
    </Prefetcher>
  );
}
