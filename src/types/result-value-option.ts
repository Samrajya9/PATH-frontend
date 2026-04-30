import { BaseAPIResource } from './base-api-resource';

export type ResultValueOption = BaseAPIResource & {
  isDefault: boolean;
  sortOrder: number;
  name: string;
};
