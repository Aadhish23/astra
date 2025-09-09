import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Users } from "./pages/Users";
import { Alerts } from "./pages/Alerts";
import { Mesh } from "./pages/Mesh";
import { Behavior } from "./pages/Behavior";
import { Evidence } from "./pages/Evidence";
import { Audit } from "./pages/Audit";
import { Settings } from "./pages/Settings";
import { AdminLayout } from "./components/AdminLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <ProtectedRoute>
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/users" element={
            <ProtectedRoute>
              <AdminLayout>
                <Users />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/alerts" element={
            <ProtectedRoute>
              <AdminLayout>
                <Alerts />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/mesh" element={
            <ProtectedRoute>
              <AdminLayout>
                <Mesh />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/behavior" element={
            <ProtectedRoute>
              <AdminLayout>
                <Behavior />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/evidence" element={
            <ProtectedRoute>
              <AdminLayout>
                <Evidence />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/audit" element={
            <ProtectedRoute>
              <AdminLayout>
                <Audit />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <AdminLayout>
                <Settings />
              </AdminLayout>
            </ProtectedRoute>
          } />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
