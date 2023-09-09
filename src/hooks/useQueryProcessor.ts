import axios, { AxiosResponse, AxiosError  } from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const apiClient = axios.create({
  baseURL: "http://localhost:3001/api",
  headers: { "Content-type": "application/json" },
});

export const query = <T>(
  url: string,
  key: any[] = [],
  options = {},
  headers = {}
) => {
  return useQuery<T>({
    queryKey: key,
    queryFn: async () => {
      const { data } = await apiClient.get<T>(url, {
        headers: {
          ...headers,
        },
      });
      return data;
    },
    ...options,
    onError(error) {
      console.log('🚀 error query processor 🚀')
    },
    onSuccess(data) {
      console.log('🚀 succes query processor 🚀')
    },
  });
};

type HttpMutationMethod = "DELETE" | "POST" | "PUT" | "PATCH";

const mutationMethod = async <T>(
  url: string,
  method: HttpMutationMethod,
  value: T,
  headers = {}
) => {
  switch (method) {
    case "DELETE": {
      const { data } = await apiClient.delete<T>(url, {
        headers: {
          ...headers,
        },
      });
      return data;
    }

    case "PATCH": {
      const { data } = await apiClient.patch<T>(url, value, {
        headers: {
          ...headers,
        },
      });
      return data;
    }
    case "POST": {
      const { data } = await apiClient.post<T>(url, value, {
        headers: {
          ...headers,
        },
      });
      return data;
    }
    case "PUT": {
      const { data } = await apiClient.put<T>(url, value, {
        headers: {
          ...headers,
        },
      });
      return data;
    }

    default:
      throw new Error("Invalid mutation method");
  }
};

export const mutate = <T, K>(
  url: string,
  method: HttpMutationMethod,
  key: any[],
  options = {},
  headers = {}
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: async (value: T) =>
      mutationMethod<T>(url, method, value, headers) as K,
    onMutate: (newData: T) => {
      const previousData = queryClient.getQueryData<T>(key);
      const isArray = Array.isArray(previousData);

      //checking if the previous data is an array type if yes then update the array data
      if (isArray) {
        // @ts-ignore
        // @ts-nocheck
        queryClient.setQueryData(key, (old) => [...old, newData]);
      } else {
        // if not then update the single object data with the new data
        queryClient.setQueryData(key, newData);
      }
      return { previousData };
    },
    onError: (err, newTodo, context) => {
      if (axios.isAxiosError(err)) {
        console.error(err.response?.data.message);
        window.alert(err.response?.data.message)
      } else {
        console.error(err);
      }
      // @ts-ignore
      // @ts-nocheck
      queryClient.setQueryData(key, context.previousData);
      console.log(' 🚀 error mutate processor 🚀')
    },
    onSuccess(data, variables, context) {
      console.log(' 🚀 success mutate processor 🚀')
    },
    onSettled: (data) => {
      queryClient.invalidateQueries(key);
      console.log(' 🚀 settled mutate processor 🚀')
    },
  });
};
