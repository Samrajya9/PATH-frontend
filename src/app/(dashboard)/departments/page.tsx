import Prefetcher from '@/components/prefetcher';
import { serverHttp } from '@/lib/axios/server.axios';
import DepartmentTable from './components/department-table';
import departmentQueryKeys from './constants/department.queryKeys';
import { Department } from '@/types/departments';
import { Meta } from '@/types/data-response-meta';

const page = () => {
  return (
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
      <DepartmentTable />
    </Prefetcher>
  );
};

export default page;
