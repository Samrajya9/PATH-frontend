import Prefetcher from '@/components/prefetcher';
import { serverHttp } from '@/lib/axios/server.axios';
import DepartmentTable from './components/department-table';
import departmentQueryKeys from './constants/department.queryKeys';
import { Department } from '@/types/departments';
import { Meta } from '@/types/data-response-meta';
import CreateDepartmentButton from './components/create-department-button';
import { ErrorBoundary } from '@/components/error-boundary';

const page = () => {
  return (
    <>
      <Prefetcher
        fetchQueryOptions={[
          {
            queryKey: departmentQueryKeys.all,

            queryFn: async () => {
              const response = await serverHttp.get<{
                departments: Department[];
                meta: Meta;
              }>('departments', { params: { page: 1, limit: 10 } });
              return response.data;
            },
          },
        ]}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Departments</h2>
          <CreateDepartmentButton />
        </div>
        <ErrorBoundary fallback={<p>Custom error UI</p>}>
          <DepartmentTable />
        </ErrorBoundary>
      </Prefetcher>
    </>
  );
};

export default page;
