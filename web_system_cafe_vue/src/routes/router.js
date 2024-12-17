import { createRouter, createWebHistory } from "vue-router";

import Dashboard from "../pages/dashboard/Dashboard.vue";
import CustomerPage from "../pages/customer/CustomerPage.vue";
import EmployeesPage from "../pages/employees/EmployeesPage.vue";
import OrderPage from "../pages/order/OrderPage.vue";
import ExpensePage from "../pages/expense/ExpensePage.vue";
import POSPage from "../pages/POS/POSPage.vue";
import AccountStaffPage from "../pages/accountStaff/AccountStaffPage.vue";
import RolePage from "../pages/role/RolePage.vue";
import NotFoundPage from "../pages/NotFound/NotFoundPage.vue";
import LoginPage from "../pages/auth/LoginPage.vue";
import MainLayout from "../components/layouts/MainLayout.vue";
import AuthLayout from "../components/layouts/auth/AuthLayout.vue";
import RegisterPage from "../pages/auth/RegisterPage.vue";
const routes = [
  {
    path: "/",
    component: MainLayout,
    children: [
      { path: "", component: Dashboard },
      { path: "/customer", component: CustomerPage },
      { path: "/employees", component: EmployeesPage },
      { path: "/order", component: OrderPage },
      { path: "/expense", component: ExpensePage },
      { path: "/pos", component: POSPage },
      { path: "/account_staff", component: AccountStaffPage },
      { path: "/role", component: RolePage },
    ],
  },
  {
    path: "/login",
    component: AuthLayout,
    children: [
      { path: "", component: LoginPage },
      { path: "/register", component: RegisterPage },
    ],
  },
  { path: "/:catchAll(.*)", component: NotFoundPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
