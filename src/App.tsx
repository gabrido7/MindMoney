import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import AuthLayout from "./layouts/AuthLayout";
import AppLayout from "./layouts/AppLayout";
import ProtectedRoute from "./layouts/ProtectedRoute";

import Landing from "./pages/Landing";

// Divisão de código por rota: a landing pública (o que a maioria dos
// visitantes vê primeiro) não precisa baixar o bundle do Dashboard,
// Recharts incluso, nem das telas de autenticação -- cada uma vira um
// chunk próprio, carregado só quando a rota é acessada.
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Profile = lazy(() => import("./pages/Profile"));
const Goals = lazy(() => import("./pages/Goals"));
const Reports = lazy(() => import("./pages/Reports"));
const FinancialEducation = lazy(() => import("./pages/FinancialEducation"));
const EducationTrail = lazy(() => import("./pages/EducationTrail"));
const EducationCourse = lazy(() => import("./pages/EducationCourse"));
const EducationLesson = lazy(() => import("./pages/EducationLesson"));

function RouteFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-gray-900">
      <p className="text-sm text-gray-400">Carregando...</p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<Landing />} />

          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Register />} />
            <Route path="/esqueci-senha" element={<ForgotPassword />} />
            <Route path="/redefinir-senha" element={<ResetPassword />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/perfil" element={<Profile />} />
              <Route path="/metas" element={<Goals />} />
              <Route path="/relatorios" element={<Reports />} />
              <Route path="/educacao-financeira" element={<FinancialEducation />} />
              <Route path="/educacao-financeira/:trailId" element={<EducationTrail />} />
              <Route path="/educacao-financeira/:trailId/:courseId" element={<EducationCourse />} />
              <Route
                path="/educacao-financeira/:trailId/:courseId/:lessonId"
                element={<EducationLesson />}
              />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
