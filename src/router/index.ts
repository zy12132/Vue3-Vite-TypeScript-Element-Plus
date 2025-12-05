// RouteRecordRaw TypeScript 类型，约束路由配置的结构
import NProgress from "nprogress";
import "nprogress/nprogress.css"; // 导入进度条样式

import { useUserStoreHook } from "@/store/modules/user";
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

// 通过懒加载方式导入全局布局组件（Layout），避免首屏加载过多代码，提升性能；
// Layout 通常是项目的公共布局（如包含侧边栏、顶部导航、内容区域），大部分页面会嵌套在这个布局中。
export const Layout = () => import("@/layout/index.vue");

// 静态路由  无需权限即可访问的路由
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: "/redirect",
    component: Layout, // 嵌套在全局布局中y
    meta: { hidden: true }, // 表示该路由不在侧边栏菜单中显示；
    children: [
      {
        path: "/redirect/:path(.*)", // 动态参数匹配任意路径
        component: () => import("@/views/redirect/index.vue"),
      },
    ],
  },

  {
    path: "/login",
    component: () => import("@/views/login/index.vue"),
    meta: { hidden: true },
  },

  // 首页路由（/）
  {
    path: "/",
    component: Layout,
    redirect: "/dashboard", // 根路径 / 匹配后，先重定向到 /dashboard；
    // children 定义子路由，实现嵌套路由（Layout 作为父布局，dashboard 作为子页面内容）。
    children: [
      {
        path: "dashboard",
        component: () => import("@/views/dashboard/index.vue"),
        name: "Dashboard",
        meta: { title: "dashboard", icon: "homepage", affix: true },
      },
    ],
  },
];

/**
 * 创建路由
 */
const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes as RouteRecordRaw[],
  // 刷新时，滚动条位置还原
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

/**
 * 重置路由
 * location.reload()：强制刷新页面，确保路由状态完全重置（避免缓存问题）。
 * 用户退出登录或 Token 失效时，重置路由并跳转到登录页
 */
export function resetRouter() {
  router.replace({ path: "/login" }); // 跳转到登录页
  location.reload(); // 刷新页面，重置路由状态
}

// 路由守卫
// 全局前置守卫
router.beforeEach(async (to, from, next) => {
  NProgress.start(); // 开启进度条
  // const userStore = useUserStoreHook();
  next();
  // 1. 不需要登录的路由（白名单）直接放行
  //   if (to.path === '/login' || to.path === '/redirect') {
  //     next();
  //     return;
  //   }

  //   // 2. 需要登录的路由：检查 Token
  //   if (userStore.token) {
  //     next(); // 已登录，放行
  //   } else {
  //     next('/login'); // 未登录，跳转到登录页
  //   }
});

// 全局后置守卫：关闭进度条（可选，提升体验）
router.afterEach(() => {
  NProgress.done();
});
export default router;
