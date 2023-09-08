import axios, { AxiosResponse } from "axios";
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
  // @ts-nocheck
  // @ts-ignore
    queryKey: key,
    queryFn: async () => {
      try {
        const { data, } = await apiClient.get<T>(url, {
          headers: {
            ...headers,
          },
        })
        return data;
      } catch (error:any) {
        console.error(error)
        const {message, statusCode:status} = error.response.data;
        return {message, status}
      } 
    }
      ,
    ...options,
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
      try {
        const {data} = await apiClient.delete<T>(url, {
          headers: {
            ...headers,
          },
        })
        return data
      } catch (error:any) {
        console.error(error)
        const {message, statusCode:status} = error.response.data;
        return {message, status}
      } 
    }
      
    case "PATCH": {
      try {
        const {data} = await apiClient.patch<T>(url, value, {
          headers: {
            ...headers,
          },
        })
        return data
      } catch (error:any) {
        console.error(error)
        const {message, statusCode:status} = error.response.data;
        return {message, status}
      } 
    }
      
    case "POST": {
      try {
        const {data} = await apiClient.post<T>(url, value, {
          headers: {
            ...headers,
          },
        })
        return data
      } catch (error:any) {
        console.error(error)
        const {message, statusCode:status} = error.response.data;
        return {message, status}
      } 
    }
    case "PUT": {
      try {
        const {data} = await apiClient.put<T>(url, value, {
          headers: {
            ...headers,
          },
        })
        return data
      } catch (error:any) {
        console.error(error)
        const {message, statusCode:status} = error.response.data;
        return {message, status}
      } 
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
    mutationFn: async (value: T) => mutationMethod<T>(url, method, value, headers) as K,
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
      // @ts-ignore
      // @ts-nocheck
      queryClient.setQueryData(key, context.previousData);
    },
    onSettled: (data) => {
      queryClient.invalidateQueries(key);
    },
  });
};
