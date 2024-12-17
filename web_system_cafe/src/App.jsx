import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layouts/MainLayout";
// import LogingPage from "./page/auth/LogingPage";
// import RegisterPage from "./page/auth/RegisterPage";
import DashbordPage from "./pages/dashbord/DashbordPage";
import EmployeesPage from "./pages/employees/EmployeesPage";
import CustomerPage from "./pages/customer/CustomerPage";
import MainLayoutAuth from "./components/layouts/auth/MainLayoutAuth";
import LoginPage from "./pages/auth/LoginPage";
import POSPage from "./pages/POS/POSPage";
import ProductPage from "./pages/product/ProductPage";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<DashbordPage />} />
          <Route path="/employees" element={<EmployeesPage />} />
          <Route path="/customer" element={<CustomerPage />} />
          <Route path="/pos" element={<POSPage />} />
          <Route path="/product_detail" element={<ProductPage />} />

          <Route path="*" element={<h1>404-Route Not Found!</h1>} />
        </Route>

        <Route element={<MainLayoutAuth />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
