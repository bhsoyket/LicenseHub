export interface User {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'support' | 'customer';
  avatar?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  code: string;
  description: string;
  type: 'saas' | 'desktop' | 'api';
  status: 'active' | 'inactive' | 'development';
  version: string;
  webhookUrl?: string;
  features: Feature[];
  createdAt: string;
  updatedAt: string;
}

export interface Feature {
  id: string;
  name: string;
  key: string;
  enabledDefault: boolean;
  productId: string;
}

export interface Customer {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  status: 'active' | 'suspended' | 'inactive';
  createdAt: string;
}

export interface Package {
  id: string;
  productId: string;
  productName: string;
  type: 'free_trial' | 'basic' | 'standard' | 'custom';
  monthlyAmount: number;
  yearlyAmount: number;
  features: string[];
  createdAt: string;
}

export interface License {
  id: string;
  licenseKey: string;
  productId: string;
  productName: string;
  customerId: string;
  customerName: string;
  packageId: string;
  packageType: 'free_trial' | 'basic' | 'standard' | 'custom';
  type: 'monthly' | 'yearly' | 'lifetime';
  amount: number;
  currency: 'USD' | 'EUR' | 'GBP' | 'BDT';
  expiryDate: string;
  activationLimit: number;
  activationsUsed: number;
  status: 'active' | 'suspended' | 'revoked' | 'expired';
  enabledFeatures: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Activation {
  id: string;
  licenseId: string;
  licenseKey: string;
  deviceName: string;
  deviceId: string;
  ipAddress: string;
  activatedAt: string;
  status: 'active' | 'revoked';
}

export interface ActivityLog {
  id: string;
  event: string;
  description: string;
  userId: string;
  userName: string;
  resourceType: string;
  resourceId: string;
  createdAt: string;
}

export interface DashboardStats {
  totalProducts: number;
  activeLicenses: number;
  expiredLicenses: number;
  totalCustomers: number;
  onlineActivations: number;
  licenseGrowth: { month: string; count: number }[];
  activationsPerDay: { date: string; count: number }[];
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed: string;
}

export interface Payment {
  id: string;
  licenseId: string;
  licenseKey: string;
  productName: string;
  customerName: string;
  amount: number;
  currency: string;
  transactionId: string;
  method: 'card' | 'custom';
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  approvedAt?: string;
  approvedBy?: string;
}
