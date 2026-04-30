import { ErrorBoundary } from '@/components/error-boundary';
import TestTable from './components/test-table';

export default function TestsPage() {
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Test </h2>
        {/* <CreateTestUnitButton /> */}
      </div>

      <ErrorBoundary
        fallback={
          <p className="text-destructive">
            Failed to load test units. Please refresh.
          </p>
        }
      >
        <TestTable />
      </ErrorBoundary>
    </div>
  );
}
