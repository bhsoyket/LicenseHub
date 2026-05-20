import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { ThemeProvider } from '@/context/ThemeContext'
import { AppLayout, AuthLayout } from '@/components/layout/AppLayout'
import { LoginPage } from '@/pages/auth/LoginPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'
import { ResetPasswordPage } from '@/pages/auth/ResetPasswordPage'
import { DashboardPage } from '@/pages/dashboard/DashboardPage'
import { ProductsPage } from '@/pages/products/ProductsPage'
import { ProductDetailPage } from '@/pages/products/ProductDetailPage'
import { FeaturesPage } from '@/pages/features/FeaturesPage'
import { CustomersPage } from '@/pages/customers/CustomersPage'
import { CustomerDetailPage } from '@/pages/customers/CustomerDetailPage'
import { PackagesPage } from '@/pages/packages/PackagesPage'
import { LicensesPage } from '@/pages/licenses/LicensesPage'
import { LicenseDetailPage } from '@/pages/licenses/LicenseDetailPage'
import { ActivityPage } from '@/pages/activity/ActivityPage'
import { SettingsPage } from '@/pages/settings/SettingsPage'
import { ApiPage } from '@/pages/api/ApiPage'
import { PaymentPage } from '@/pages/payment/PaymentPage'
import { PaymentsPage } from '@/pages/payments/PaymentsPage'

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
            </Route>

            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/:id" element={<ProductDetailPage />} />
              <Route path="/features" element={<FeaturesPage />} />
              <Route path="/customers" element={<CustomersPage />} />
              <Route path="/customers/:id" element={<CustomerDetailPage />} />
              <Route path="/packages" element={<PackagesPage />} />
              <Route path="/licenses" element={<LicensesPage />} />
              <Route path="/licenses/:id" element={<LicenseDetailPage />} />
              <Route path="/activity" element={<ActivityPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/api" element={<ApiPage />} />
              <Route path="/admin/payments" element={<PaymentsPage />} />
            </Route>

            <Route path="/pay/:licenseId" element={<PaymentPage />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
