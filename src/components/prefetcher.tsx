import {
  dehydrate,
  FetchQueryOptions,
  HydrationBoundary,
} from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import { ReactNode } from 'react';

interface PrefetcherProps {
  fetchQueryOptions: FetchQueryOptions[];
  children: ReactNode;
}

export default async function Prefetcher({
  fetchQueryOptions,
  children,
}: PrefetcherProps) {
  const queryClient = getQueryClient();

  await Promise.allSettled(
    fetchQueryOptions.map((options) => queryClient.prefetchQuery(options))
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
