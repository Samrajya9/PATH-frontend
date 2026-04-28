import { clientHttp } from '@/lib/axios/client.axios';
import { TestUnit } from '@/types/test-unit';
import { Meta } from '@/types/data-response-meta';
import { TestUnitFormValues } from '../types/test-unit-form.types';

class TestUnitClient {
  private readonly TEST_UNITS_ENDPOINT = '/test-units';

  async getAllTestUnits({ page, limit }: { page: number; limit: number }) {
    return await clientHttp.get<{
      testUnits: TestUnit[];
      meta: Meta;
    }>(this.TEST_UNITS_ENDPOINT, { params: { page, limit } });
  }

  async getOneTestUnit(id: number) {
    return await clientHttp.get<{ testUnit: TestUnit }>(
      `${this.TEST_UNITS_ENDPOINT}/${id}`
    );
  }

  async createTestUnit(data: TestUnitFormValues) {
    return await clientHttp.post<{ testUnit: TestUnit }>(
      this.TEST_UNITS_ENDPOINT,
      data
    );
  }

  async updateTestUnit(id: number, data: Partial<TestUnitFormValues>) {
    return await clientHttp.patch<{ testUnit: TestUnit }>(
      `${this.TEST_UNITS_ENDPOINT}/${id}`,
      data
    );
  }

  async deleteTestUnit(id: number) {
    return await clientHttp.delete<{ testUnit: TestUnit }>(
      `${this.TEST_UNITS_ENDPOINT}/${id}`
    );
  }
}

const testUnitClient = new TestUnitClient();
export default testUnitClient;
