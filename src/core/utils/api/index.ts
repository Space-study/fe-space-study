import {
    ApiSuccessResponse,
    DeleteRequestProps,
    GetRequestProps,
    PatchRequestProps,
    PostRequestProps,
    PutRequestProps,
  } from "@/core/types/api.type";
  import axios, { AxiosInstance, AxiosRequestConfig, isAxiosError } from "axios";
  import { isSafeParseError } from "../validation";
  import { setupInterceptorsTo } from "./interceptors";
  import { ErrorMessages } from "@/core/utils/exception/error-messages";
  interface IHttpClient {
    get<T>(props: GetRequestProps): Promise<ApiSuccessResponse<T>>;
    post<T, U>(props: PostRequestProps<U>): Promise<ApiSuccessResponse<T>>;
    put<T, U>(props: PutRequestProps<U>): Promise<ApiSuccessResponse<T>>;
    patch<T, U>(props: PatchRequestProps<U>): Promise<ApiSuccessResponse<T>>;
    delete<T>(props: GetRequestProps): Promise<ApiSuccessResponse<T>>;
  }
  type ApiRequestProps<U> =
    | {
        method: "get";
        options: GetRequestProps;
      }
    | {
        method: "post";
        options: PostRequestProps<U>;
      }
    | {
        method: "put";
        options: PutRequestProps<U>;
      }
    | {
        method: "patch";
        options: PatchRequestProps<U>;
      }
    | {
        method: "delete";
        options: DeleteRequestProps;
      };
  class HttpClient implements IHttpClient {
    private static instance: HttpClient;
    private axiosInstance: AxiosInstance;
    private constructor(axiosInstance: AxiosInstance) {
      this.axiosInstance = axiosInstance;
    }
    public static getInstance(): HttpClient {
      if (!HttpClient.instance) {
        // const accessToken = typeof window === "undefined" ? null : localStorage?.getItem("accessToken");
        const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mywicm9sZSI6eyJpZCI6MSwibmFtZSI6IkFkbWluIiwiX19lbnRpdHkiOiJSb2xlRW50aXR5In0sInNlc3Npb25JZCI6MTQsImlhdCI6MTczMzkwMDE3NiwiZXhwIjoxNzMzOTAxOTc2fQ.XG_0h6Dpswx8aiFrvlc3w-wR3aEjQBQ_L1kHTqDr9zA';
        HttpClient.instance = new HttpClient(
          setupInterceptorsTo(
            axios.create({
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken || ""}`,
              },
              baseURL: process.env.NEXT_PUBLIC_URL_API,
              withCredentials: true,
            }),
          ),
        );
      }
      return HttpClient.instance;
    }
    public get instance(): AxiosInstance {
      return this.axiosInstance;
    }
    private extractErrorMessages(error: unknown) {
      if (Array.isArray(error) && error.length > 0) {
        /* eslint-disable  @typescript-eslint/no-explicit-any */
        return error.flatMap((error: any) => (error?.errors?.field ? error?.errors : error));
      }
      return "Unknown error";
    }
    private handleError(error: unknown) {
      if (isAxiosError(error)) {
        const errorData = error.response?.data;
        const errorMessage =
          typeof errorData.error === "string"
            ? ErrorMessages.get(errorData.error) || errorData.error
            : this.extractErrorMessages(errorData.error);
        return errorMessage || "Network error!";
      }
      return "Network error!";
    }
    private async request<T, U>(params: ApiRequestProps<U>): Promise<ApiSuccessResponse<T>> {
      return new Promise(async (resolve, reject) => {
        try {
          const { method, options } = params;
          const requestConfig: AxiosRequestConfig = {
            ...(options?.config || {}),
          };
          const response = await this.instance[method]<ApiSuccessResponse<T>>(
            options.url,
            method === "get" || method === "delete" ? requestConfig : options.body,
            requestConfig,
          );
          const result = response.data;
          if (options?.typeCheck) {
            const isValid = options.typeCheck(result?.payload);
            if (isSafeParseError(isValid)) {
              throw new Error(isValid?.error?.issues.map((issue) => issue.message).join("\n"));
            }
          }
          resolve(result);
        } catch (error) {
          reject(this.handleError(error));
        }
      });
    }
    public get<T>(props: GetRequestProps): Promise<ApiSuccessResponse<T>> {
      return this.request<T, unknown>({ method: "get", options: props });
    }
    public post<T, U>(props: PostRequestProps<U>): Promise<ApiSuccessResponse<T>> {
      return this.request<T, U>({ method: "post", options: props });
    }
    public put<T, U>(props: PutRequestProps<U>): Promise<ApiSuccessResponse<T>> {
      return this.request<T, U>({ method: "put", options: props });
    }
    public patch<T, U>(props: PatchRequestProps<U>): Promise<ApiSuccessResponse<T>> {
      return this.request<T, U>({ method: "patch", options: props });
    }
    public delete<T>(props: DeleteRequestProps): Promise<ApiSuccessResponse<T>> {
      return this.request<T, unknown>({ method: "delete", options: props });
    }
  }
  export const httpClient = HttpClient.getInstance();