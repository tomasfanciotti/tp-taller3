// usePostMutation.tsx

import { QueryClient, useMutation, useQuery, useQueryClient, UseQueryOptions } from 'react-query';
export type MutateType<TBody> = { body?: TBody, headers?: HeadersInit };
const headerToken = (isUsers?: boolean) => ({
  Authorization: `${isUsers ? `Bearer ` : ''}${localStorage.getItem('TOKEN_USER')}`
})
const usePostMutation = <TBody = Record<string, unknown>, TData = TBody, TError = unknown>(queriesToInvalidate?: string) => {
  const queryClient = useQueryClient();

  const postMutation = useMutation(
    async ({ url, body }: { url: string; body: any }) => {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headerToken(url.includes('users')),
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error('Failed to perform POST request');
      }

      return response.json();
    },
    {
      onSuccess: (data: TData, vars: MutateType<TBody>) => {
        const newData = { ...vars.body, ...data };
        if (Array.isArray(newData)) {
          queryClient.setQueryData(queriesToInvalidate || '', newData);
        }
      },
      onSettled: async () => invalidateQueries(queryClient, queriesToInvalidate),
    }
  );

  return postMutation;
};

export const useGetQuery = <T>(url: string) => {
  const { data, ...query } = useQuery<T>(url, async () => {
    const response = await fetch(url, {headers: { ...headerToken(url.includes('users')) }});

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return response.json();
  }, { retry: false } );

  return { data, ...query };
};
export const usePutMutation = <T extends unknown, R extends unknown>(
  queriesToInvalidate?: string[]
) => {
  const queryClient = useQueryClient();

  const putMutation = useMutation<R, Error, { url: string; body: T }>(
    async ({ url, body }) => {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...headerToken(url.includes('users')),
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error('Failed to perform PUT request');
      }

      return response.json();
    },
    {
      onSettled: async () => invalidateQueries(queryClient, queriesToInvalidate),
    }
  );

  return putMutation;
};

export const usePatchMutation = <T extends unknown, R extends unknown>(
  queriesToInvalidate?: string[]
) => {
  const queryClient = useQueryClient();

  const patchMutation = useMutation<R, Error, { url: string; body: T }>(
    async ({ url, body }) => {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...headerToken(url.includes('users')),
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error('Failed to perform PUT request');
      }

      return response.json();
    },
    {
      onSettled: async () => invalidateQueries(queryClient, queriesToInvalidate),
    }
  );

  return patchMutation;
};
const splitPath = (route: string) => route.split('/').filter((param) => param.length > 0);

export const invalidateQueries = async (
  queryClient: QueryClient,
  queriesToInvalidate?: string | Array<string>,
) => {
  if (!queriesToInvalidate) return undefined;
  const queries = Array.isArray(queriesToInvalidate) ? queriesToInvalidate : [queriesToInvalidate];

  return Promise.all(queries.map((q: string) => {
    const partialQueries = splitPath(q);
    return queryClient.invalidateQueries(partialQueries);
  }));
};

export default usePostMutation;
