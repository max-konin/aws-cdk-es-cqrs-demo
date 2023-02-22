import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
  QueryKey,
} from 'react-query';
import { amplifyFetcher, amplifySubscriber } from './api';

export const useGraphQLMutaion = <
  TData,
  TVariables,
  TError = unknown,
  TContext = unknown
>(
  query: string,
  options?: UseMutationOptions<TData, TError, TVariables, TContext>
) =>
  useMutation<TData, TError, TVariables, TContext>(
    (variables?: TVariables) =>
      amplifyFetcher<TData, TVariables>(query, variables)(),
    options
  );

export const useGraphQLQuery = <TData, TVariables = {}>(
  queryKey: QueryKey,
  query: string,
  variables?: TVariables,
  options?: UseQueryOptions<TData>
) =>
  useQuery<TData>(
    queryKey,
    amplifyFetcher<TData, TVariables>(query, variables),
    options
  );

export const useGraphQLSubscription = <TData = {}, TVariables = {}>(
  query: string,
  observer: ZenObservable.Observer<TData>,
  variables?: TVariables
) => amplifySubscriber<TData, TVariables>(query, observer, variables)();
