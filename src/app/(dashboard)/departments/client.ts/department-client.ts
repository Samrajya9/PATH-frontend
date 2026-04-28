import { clientHttp } from '@/lib/axios/client.axios';
import { Department } from '@/types/departments';
import { Meta } from '@/types/data-response-meta';
import { DepartmentFormValues } from '../types/department-form.types';

// this should sent the full api response format ApiSucess<T>
class DepartmentClient {
  private readonly DEPARTMENT_ENDPOINT = '/departments';
  async createDepartment(data: DepartmentFormValues) {
    return await clientHttp.post<{ department: Department }>(
      this.DEPARTMENT_ENDPOINT,
      data
    );
  }

  async getAllDepartments({ page, limit }: { page: number; limit: number }) {
    return await clientHttp.get<{
      departments: Department[];
      meta: Meta;
    }>(this.DEPARTMENT_ENDPOINT, { params: { page, limit } });
  }

  async updateDepartment(id: number, data: Partial<DepartmentFormValues>) {
    return await clientHttp.patch<{ department: Department }>(
      `${this.DEPARTMENT_ENDPOINT}/${id}`,
      data
    );
  }

  async deleteDepartment(id: number) {
    return await clientHttp.delete<{ department: Department }>(
      `${this.DEPARTMENT_ENDPOINT}/${id}`
    );
  }
}

const departmentClient = new DepartmentClient();
export default departmentClient;
