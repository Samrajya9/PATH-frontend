export interface PaginationParams {
  page?: number;
  limit?: number;
}

// Perfect for creating query keys for React Query
export const createQueryKeys = <TResource extends string>(
  resource: TResource
) => ({
  all: [resource] as const,
  list: (params: PaginationParams = {}) => [resource, 'list', params] as const,
  detail: (id: number) => [resource, 'detail', id] as const,
  options: [resource, 'options'] as const,
});
