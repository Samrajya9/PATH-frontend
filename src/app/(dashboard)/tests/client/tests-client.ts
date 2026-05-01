import { clientHttp } from '@/lib/axios/client.axios';
import { Test } from '@/types/tests';
import { Meta } from '@/types/data-response-meta';
import {
  ReferenceRangeValues,
  ResultValueOptionValues,
  TestFormValues,
  TestUpdateFormValues,
} from '../types/test-form.types';
import { ReferenceRange } from '@/types/reference-range';
import { ResultValueOption } from '@/types/result-value-option';

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

  async deleteTest(id: number) {
    return await clientHttp.delete<true>(`${this.TESTS_ENDPOINT}/${id}`);
  }

  async updateTest(id: number, data: TestUpdateFormValues) {
    return await clientHttp.patch<Test>(`${this.TESTS_ENDPOINT}/${id}`, data);
  }

  async addRefRangesForTest(testId: number, data: ReferenceRangeValues) {
    return await clientHttp.post<ReferenceRange>(
      `${this.TESTS_ENDPOINT}/${testId}/reference-ranges`,
      data
    );
  }

  async updateRefRangeForTest(refRangeId: number, data: ReferenceRangeValues) {
    return await clientHttp.patch<ReferenceRange>(
      `${this.TESTS_ENDPOINT}/reference-ranges/${refRangeId}`,
      data
    );
  }
  async deleteRefRangeForTest(refRangeId: number) {
    return await clientHttp.delete<true>(
      `${this.TESTS_ENDPOINT}/reference-ranges/${refRangeId}`
    );
  }

  async addResultOptionsForTest(testId: number, data: ResultValueOptionValues) {
    return await clientHttp.post<ResultValueOption>(
      `${this.TESTS_ENDPOINT}/${testId}/result-value-options`,
      data
    );
  }

  async updateResultOptionsForTest(
    testId: number,
    data: ResultValueOptionValues
  ) {
    return await clientHttp.patch<ResultValueOption>(
      `${this.TESTS_ENDPOINT}/${testId}/result-value-options`,
      data
    );
  }

  async deleteResultOptionsForTest(resultValueOptionId: number) {
    return await clientHttp.delete<true>(
      `${this.TESTS_ENDPOINT}/result-value-options/${resultValueOptionId}`
    );
  }
}
const testClient = new TestClient();
export default testClient;
