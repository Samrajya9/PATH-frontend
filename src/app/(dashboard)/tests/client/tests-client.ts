import { clientHttp } from '@/lib/axios/client.axios';
import { Test } from '@/types/tests';
import { Meta } from '@/types/data-response-meta';
import { TestFormValues } from '../types/test-form.types';

class TestClient {
  private readonly TESTS_ENDPOINT = '/tests';

  async getAllTests({ page, limit }: { page: number; limit: number }) {
    return await clientHttp.get<{
      tests: Omit<Test, 'resultValueOptions' | 'referenceRanges'>[];
      meta: Meta;
    }>(this.TESTS_ENDPOINT, { params: { page, limit } });
  }

  async getOneTest(id: number) {
    return await clientHttp.get<Test>(`${this.TESTS_ENDPOINT}/${id}`);
  }

  async createTest(data: TestFormValues) {
    return await clientHttp.post<Test>(`${this.TESTS_ENDPOINT}`, data);
  }
}

const testClient = new TestClient();
export default testClient;
