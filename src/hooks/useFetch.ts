"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ApiResponseBody,
  FetchBackendApiParams,
  MethodType,
  fetchBackendApi,
} from "@/api/fetch";

type ApiResponse<ResponseT> = {
  responseData: ApiResponseBody<ResponseT>;
  isPending: boolean | null;
  error: string | null;
};

type FetchDataParams<BodyType = unknown> = {
  customUrl?: string;
  customBody?: BodyType;
};

export type UseFetchReturnType<ResponseT, BodyT> = {
  api: ApiResponse<ResponseT>;
  fetchData: (
    params?: FetchDataParams<BodyT>
  ) => Promise<ApiResponseBody<ResponseT> | null>;
  clearCache: () => void;
};

type UseFetchParams<BodyType> = {
  url: string;
  method?: MethodType;
  body?: BodyType;
};

type UseFetchOptions = {
  manual?: boolean;
  notification?: FetchBackendApiParams["notification"];
};

//NOTE: isPending === null === not even started call to api
export const useFetch = <ResponseT, BodyT = unknown>(
  params: UseFetchParams<BodyT>,
  options?: UseFetchOptions
): UseFetchReturnType<ResponseT, BodyT> => {
  const { url, method, body } = params;
  const { manual, notification } = options || {};

  const [responseData, setResponseData] = useState<ApiResponseBody<ResponseT>>({
    message: null,
    data: null,
  });
  const [isPending, setIsPending] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(
    async (params?: FetchDataParams<BodyT>) => {
      setIsPending(true);
      return fetchBackendApi<ResponseT, BodyT>({
        url: params?.customUrl || url,
        body: params?.customBody || params?.customBody,
        method,
        notification,
      })
        .then((response) => {
          if (!response) throw new Error("Data from server not found");
          setResponseData(response.body);
          setError(null);
          return response.body;
        })
        .catch((error) => {
          setError(`There is an error -> ${error}`);
          return null;
        })
        .finally(() => {
          setIsPending(false);
        });
    },
    [body, method, notification, url]
  );

  const clearCache = useCallback(() => {
    setResponseData({ message: null, data: null });
  }, []);

  useEffect(() => {
    if (!manual) fetchData();
  }, [fetchData, manual]);

  return { api: { responseData, isPending, error }, fetchData, clearCache };
};
