import { BaseAPIResource } from './base-api-resource';
import { Department } from './departments';
import { ReferenceRange } from './reference-range';
import { ResultValueOption } from './result-value-option';
import { TestUnit } from './test-unit';

export enum ResultValueTypeEnum {
  NUMERIC = 'Numeric',
  TEXT = 'Text',
  CATEGORICAL = 'Categorical',
}

type BaseTest = BaseAPIResource & {
  name: string;
  testUnit: TestUnit;
  department: Department;
  referenceRanges: ReferenceRange[];
};

type NumericTest = BaseTest & {
  resultValueType: ResultValueTypeEnum.NUMERIC;
  resultValueOptions?: never;
};

type TextTest = BaseTest & {
  resultValueType: ResultValueTypeEnum.TEXT;
  resultValueOptions?: never;
};

type CategoricalTest = BaseTest & {
  resultValueType: ResultValueTypeEnum.CATEGORICAL;
  resultValueOptions: ResultValueOption[]; // ✅ required when Categorical
};

export type Test = NumericTest | TextTest | CategoricalTest;
