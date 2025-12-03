// src/api/auth/index.ts
import request from "@/utils/request";
import { LoginData, LoginResult } from "./types";

/**
 * 登录API
 *
 * @param data {LoginData}
 * @returns
 */
export const loginApi = (data: LoginData) => {
  return request<LoginResult>({
    url: "/api/v1/auth/login",
    method: "post",
    params: data,
  });
};
