import { BaseAPIResource } from './base-api-resource';

export enum GenderEnum {
  MALE = 'male',
  FEMALE = 'female',
  ANY = 'any',
}

export type ReferenceRange = BaseAPIResource & {
  gender: GenderEnum;
  age_min_years: number;
  age_max_years: number;
  normal_min: number;
  normal_max: number;
  critical_min: number;
  critical_max: number;
};
