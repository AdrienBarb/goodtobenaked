import {
  useQuery,
  useMutation,
  UseQueryOptions,
  UseMutationOptions,
  useInfiniteQuery,
} from "react-query";
import axios, { AxiosResponse } from "axios";
import axiosInstance from "../axios/axiosConfig";

interface FetchParams {
  url: string;
  params?: Record<string, any>;
}

interface MutationParams {
  url: string;
  data: any;
}

export const fetchData = async (
  url: string,
  params?: Record<string, any>
): Promise<any> => {
  try {
    const response = await axiosInstance.get(url, { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const useApi = () => {
  const fetcher = async ({
    queryKey,
  }: {
    queryKey: [string, FetchParams];
  }): Promise<any> => {
    const [_, { url, params }] = queryKey;
    const response: AxiosResponse = await axiosInstance.get(url, { params });
    return response.data;
  };

  const poster = async ({ url, data }: MutationParams): Promise<any> => {
    const response: AxiosResponse = await axiosInstance.post(url, data);
    return response.data;
  };

  const editer = async ({ url, data }: MutationParams): Promise<any> => {
    const response: AxiosResponse = await axiosInstance.put(url, data);
    return response.data;
  };

  const useGet = (
    url: string,
    params?: Record<string, any>,
    options: UseQueryOptions<any, any, any, [string, FetchParams]> = {}
  ) => useQuery(["get", { url, params }], fetcher, options);

  const useInfinite = (
    queryKey: any,
    url: string,
    params: Record<string, any>,
    options: {}
  ) => {
    return useInfiniteQuery(
      queryKey,
      async ({ pageParam = "" }) => {
        const response = await axiosInstance.get(url, {
          params: { ...params, cursor: pageParam },
        });
        return response.data;
      },
      {
        ...options,
        getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
      }
    );
  };

  const usePost = (
    url: string,
    options: UseMutationOptions<any, any, any, any> = {}
  ) => useMutation((data: any) => poster({ url, data }), options);

  const usePut = (
    url: string,
    options: UseMutationOptions<any, any, any, any> = {}
  ) => useMutation((data: any) => editer({ url, data }), options);

  return { useGet, usePost, usePut, useInfinite, fetchData };
};

export default useApi;
