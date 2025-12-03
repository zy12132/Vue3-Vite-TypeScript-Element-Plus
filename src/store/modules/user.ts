import { defineStore } from "pinia";
import { loginApi } from "@/api/auth";
import { LoginData, LoginResult } from "@/api/auth/types";

export const useUserStoreHook = defineStore("user", () => {
  const loginResult = ref<LoginResult>();
  const token = ref<string>(localStorage.getItem("token") || "");

  /**
   * 用户角色列表
   */
  const roles = ref<string[]>([]);

  /**
   * 登录调用
   *
   * @param {LoginData}
   * @returns
   */
  const login = async (loginParams: LoginData) => {
    const res = await loginApi(loginParams);
    loginResult.value = res.data;
    token.value = loginResult.value.accessToken;
    // 登录成功后，将token存储到localStorage
    localStorage.setItem("token", token.value);
  };

  // 退出登录
  const logout = () => {
    // 清除token
    token.value = "";
    // 清除localStorage中的token
    localStorage.removeItem("token");
  };
  return {
    token,
    login,
    logout,
    roles,
  };
});
