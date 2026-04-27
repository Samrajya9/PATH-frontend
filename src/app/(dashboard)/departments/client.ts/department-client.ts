import { clientHttp } from '@/lib/axios/client.axios';
import z from 'zod';
import { departmentFormSchema } from '../schemas/department-form.schema';
import { Department } from '@/types/departments';
import { Meta } from '@/types/data-response-meta';

// this should sent the full api response format ApiSucess<T>
class DepartmentClient {
  private readonly DEPARTMENT_ENDPOINT = '/departments';
  async createDepartment(data: z.infer<typeof departmentFormSchema>) {
    const response = await clientHttp.post<{ department: Department }>(
      this.DEPARTMENT_ENDPOINT,
      data
    );
    return response;
  }

  async getAllDepartments({ page, limit }: { page: number; limit: number }) {
    const response = await clientHttp.get<{
      departments: Department[];
      meta: Meta;
    }>(this.DEPARTMENT_ENDPOINT, { params: { page, limit } });
    return response;
  }

  async updateDepartment(
    id: number,
    data: Partial<z.infer<typeof departmentFormSchema>>
  ) {
    const response = await clientHttp.patch<{ department: Department }>(
      `${this.DEPARTMENT_ENDPOINT}/${id}`,
      data
    );
    return response;
  }
}

const departmentClient = new DepartmentClient();
export default departmentClient;
