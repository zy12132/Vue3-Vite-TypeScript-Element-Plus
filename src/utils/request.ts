import axios, { type InternalAxiosRequestConfig, type AxiosResponse } from "axios";
import { useUserStoreHook } from "@/store/modules/user";
import { ElMessage, ElMessageBox } from "element-plus";

// 创建 axios 实例
const http = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 50000,
  headers: {
    "Content-Type": "application/json;charset=UTF-8", // 请求体的格式为JSON
  },
});

// 请求拦截器
http.interceptors.request.use(
  // InternalAxiosRequestConfig 操作请求配置、保证类型安全、遵循 Axios 规范
  (config: InternalAxiosRequestConfig) => {
    const userStore = useUserStoreHook();
    if (userStore.token) {
      config.headers.Authorization = userStore.token; // 携带Token到请求头
    }
    return config; // 必须返回修改后的配置
  },
  (error: any) => {
    return Promise.reject(error); // 请求出错时返回Promise错误
  }
);

// 响应拦截器
http.interceptors.response.use(
  // 处理HTTP 状态码为 2xx 的响应（请求成功到达后端并返回结果），但后端返回的业务状态码 code 可能非 200（如参数错误、权限问题）。
  (response: AxiosResponse) => {
    const { code, msg } = response.data; // 解构后端返回的状态码和消息
    if (code === "00000") {
      return response.data; // 成功则返回接口数据
    }
    ElMessage({
      // 业务错误提示
      message: msg || "系统出错",
      type: "error",
    });
    return Promise.reject(new Error(msg || "Error")); // 业务错误抛异常
  },
  // 处理HTTP 状态码非 2xx 的响应（如 401/403/500），或网络错误、超时等请求失败的情况。
  (error: any) => {
    if (error.response.data) {
      const { code, msg } = error.response.data;
      // token 过期，跳转登录页
      if (code === "A0230") {
        ElMessageBox.confirm("当前页面已失效，请重新登录", "提示", {
          confirmButtonText: "确定",
          type: "warning",
        }).then(() => {
          localStorage.clear(); //  清空本地存储
          window.location.href = "/"; // 跳转登录页
        });
      } else {
        ElMessage.error(msg || "系统出错"); // 其他错误提示
      }
    }
    return Promise.reject(error.message); // 网络/HTTP错误抛异常
  }
);

export default http;
