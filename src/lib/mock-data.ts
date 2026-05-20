import type { User, Product, Feature, Customer, Package, License, Activation, ActivityLog, DashboardStats, ApiKey, Payment } from '@/types'

export const currentUser: User = {
  id: 'usr_1',
  name: 'John Doe',
  email: 'john@licensehub.io',
  role: 'super_admin',
  createdAt: '2024-01-01T00:00:00Z',
}

export const users: User[] = [
  currentUser,
  { id: 'usr_2', name: 'Jane Smith', email: 'jane@licensehub.io', role: 'admin', createdAt: '2024-02-01T00:00:00Z' },
  { id: 'usr_3', name: 'Mike Johnson', email: 'mike@licensehub.io', role: 'support', createdAt: '2024-03-01T00:00:00Z' },
  { id: 'usr_4', name: 'Acme Corp', email: 'admin@acmecorp.com', role: 'customer', createdAt: '2024-01-15T00:00:00Z' },
]

export const products: Product[] = [
  {
    id: 'prod_1',
    name: 'Enterprise ERP',
    code: 'ERP',
    description: 'Complete enterprise resource planning solution with modules for finance, HR, inventory, and more.',
    type: 'saas',
    status: 'active',
    version: '3.2.1',
    features: [
      { id: 'feat_1', name: 'HR Management', key: 'hrm', enabledDefault: true, productId: 'prod_1' },
      { id: 'feat_2', name: 'Payroll', key: 'payroll', enabledDefault: true, productId: 'prod_1' },
      { id: 'feat_3', name: 'Inventory', key: 'inventory', enabledDefault: true, productId: 'prod_1' },
      { id: 'feat_4', name: 'Reporting & Analytics', key: 'reporting', enabledDefault: false, productId: 'prod_1' },
    ],
    webhookUrl: 'https://hook.acmecorp.com/license/callback',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-06-01T00:00:00Z',
  },
  {
    id: 'prod_2',
    name: 'CloudPOS',
    code: 'POS',
    webhookUrl: 'https://hooks.initech.com/payment/confirm',
    description: 'Modern point of sale system for retail and hospitality businesses.',
    type: 'desktop',
    status: 'active',
    version: '2.1.0',
    features: [
      { id: 'feat_5', name: 'Sales Tracking', key: 'sales', enabledDefault: true, productId: 'prod_2' },
      { id: 'feat_6', name: 'Inventory Management', key: 'inventory', enabledDefault: true, productId: 'prod_2' },
      { id: 'feat_7', name: 'Customer Loyalty', key: 'loyalty', enabledDefault: false, productId: 'prod_2' },
    ],
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-05-15T00:00:00Z',
  },
  {
    id: 'prod_3',
    name: 'API Gateway',
    code: 'APIGW',
    description: 'Enterprise API management and gateway solution.',
    type: 'api',
    status: 'active',
    version: '1.0.0',
    features: [
      { id: 'feat_8', name: 'Rate Limiting', key: 'rate_limiting', enabledDefault: true, productId: 'prod_3' },
      { id: 'feat_9', name: 'Analytics', key: 'analytics', enabledDefault: true, productId: 'prod_3' },
    ],
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2024-06-10T00:00:00Z',
  },
  {
    id: 'prod_4',
    name: 'DataVault',
    code: 'DV',
    description: 'Secure data storage and backup solution for enterprises.',
    type: 'saas',
    status: 'development',
    version: '0.9.0',
    features: [
      { id: 'feat_10', name: 'Encryption', key: 'encryption', enabledDefault: true, productId: 'prod_4' },
    ],
    createdAt: '2024-04-01T00:00:00Z',
    updatedAt: '2024-06-20T00:00:00Z',
  },
]

export const customers: Customer[] = [
  { id: 'cust_1', companyName: 'Acme Corporation', contactPerson: 'John Smith', email: 'john@acmecorp.com', phone: '+1 (555) 123-4567', address: '123 Business Ave, Suite 100, New York, NY 10001', status: 'active', createdAt: '2024-01-15T00:00:00Z' },
  { id: 'cust_2', companyName: 'Globex Inc.', contactPerson: 'Sarah Johnson', email: 'sarah@globex.com', phone: '+1 (555) 234-5678', address: '456 Tech Park Blvd, San Francisco, CA 94105', status: 'active', createdAt: '2024-02-20T00:00:00Z' },
  { id: 'cust_3', companyName: 'Initech Solutions', contactPerson: 'Michael Bolton', email: 'michael@initech.com', phone: '+1 (555) 345-6789', address: '789 Innovation Drive, Austin, TX 78701', status: 'active', createdAt: '2024-03-10T00:00:00Z' },
  { id: 'cust_4', companyName: 'Umbrella Corp', contactPerson: 'Alice Williams', email: 'alice@umbrella.com', phone: '+1 (555) 456-7890', address: '321 Research Lane, Boston, MA 02110', status: 'suspended', createdAt: '2024-01-05T00:00:00Z' },
  { id: 'cust_5', companyName: 'Stark Industries', contactPerson: 'Tony Stark', email: 'tony@stark.com', phone: '+1 (555) 567-8901', address: '2000 Tech Drive, Malibu, CA 90265', status: 'active', createdAt: '2024-04-01T00:00:00Z' },
  { id: 'cust_6', companyName: 'Wayne Enterprises', contactPerson: 'Bruce Wayne', email: 'bruce@wayne.com', phone: '+1 (555) 678-9012', address: '1007 Mountain Drive, Gotham, NY 10001', status: 'inactive', createdAt: '2024-05-01T00:00:00Z' },
]

export const packages: Package[] = [
  { id: 'pkg_1', productId: 'prod_1', productName: 'Enterprise ERP', type: 'free_trial', monthlyAmount: 0, yearlyAmount: 0, features: ['hrm', 'inventory'], createdAt: '2024-01-01T00:00:00Z' },
  { id: 'pkg_2', productId: 'prod_1', productName: 'Enterprise ERP', type: 'basic', monthlyAmount: 99, yearlyAmount: 990, features: ['hrm', 'payroll'], createdAt: '2024-01-01T00:00:00Z' },
  { id: 'pkg_3', productId: 'prod_1', productName: 'Enterprise ERP', type: 'standard', monthlyAmount: 299, yearlyAmount: 2990, features: ['hrm', 'payroll', 'inventory'], createdAt: '2024-01-01T00:00:00Z' },
  { id: 'pkg_4', productId: 'prod_1', productName: 'Enterprise ERP', type: 'custom', monthlyAmount: 0, yearlyAmount: 0, features: ['hrm', 'payroll', 'inventory', 'reporting'], createdAt: '2024-01-01T00:00:00Z' },
  { id: 'pkg_5', productId: 'prod_2', productName: 'CloudPOS', type: 'basic', monthlyAmount: 49, yearlyAmount: 490, features: ['sales'], createdAt: '2024-02-01T00:00:00Z' },
  { id: 'pkg_6', productId: 'prod_2', productName: 'CloudPOS', type: 'standard', monthlyAmount: 149, yearlyAmount: 1490, features: ['sales', 'inventory'], createdAt: '2024-02-01T00:00:00Z' },
]

export const licenses: License[] = [
  { id: 'lic_1', licenseKey: 'LIC-ERP-A1B2-2026', productId: 'prod_1', productName: 'Enterprise ERP', customerId: 'cust_1', customerName: 'Acme Corporation', packageId: 'pkg_3', packageType: 'standard', type: 'yearly', amount: 2990, currency: 'USD', expiryDate: '2027-01-15T00:00:00Z', activationLimit: 10, activationsUsed: 3, status: 'active', enabledFeatures: ['hrm', 'payroll', 'inventory'], createdAt: '2024-01-15T00:00:00Z', updatedAt: '2024-06-01T00:00:00Z' },
  { id: 'lic_2', licenseKey: 'LIC-ERP-C3D4-2026', productId: 'prod_1', productName: 'Enterprise ERP', customerId: 'cust_2', customerName: 'Globex Inc.', packageId: 'pkg_4', packageType: 'custom', type: 'monthly', amount: 499, currency: 'EUR', expiryDate: '2026-06-20T00:00:00Z', activationLimit: 5, activationsUsed: 5, status: 'active', enabledFeatures: ['hrm', 'payroll', 'inventory', 'reporting'], createdAt: '2024-02-20T00:00:00Z', updatedAt: '2024-06-15T00:00:00Z' },
  { id: 'lic_3', licenseKey: 'LIC-POS-E5F6-2026', productId: 'prod_2', productName: 'CloudPOS', customerId: 'cust_3', customerName: 'Initech Solutions', packageId: 'pkg_6', packageType: 'standard', type: 'yearly', amount: 1490, currency: 'USD', expiryDate: '2027-03-10T00:00:00Z', activationLimit: 3, activationsUsed: 1, status: 'active', enabledFeatures: ['sales', 'inventory'], createdAt: '2024-03-10T00:00:00Z', updatedAt: '2024-05-01T00:00:00Z' },
  { id: 'lic_4', licenseKey: 'LIC-ERP-G7H8-2026', productId: 'prod_1', productName: 'Enterprise ERP', customerId: 'cust_4', customerName: 'Umbrella Corp', packageId: 'pkg_2', packageType: 'basic', type: 'lifetime', amount: 990, currency: 'GBP', expiryDate: '2029-01-05T00:00:00Z', activationLimit: 20, activationsUsed: 15, status: 'suspended', enabledFeatures: ['hrm', 'payroll'], createdAt: '2024-01-05T00:00:00Z', updatedAt: '2024-06-10T00:00:00Z' },
  { id: 'lic_5', licenseKey: 'LIC-DV-I9J0-2026', productId: 'prod_4', productName: 'DataVault', customerId: 'cust_5', customerName: 'Stark Industries', packageId: 'pkg_1', packageType: 'free_trial', type: 'monthly', amount: 0, currency: 'USD', expiryDate: '2026-05-01T00:00:00Z', activationLimit: 25, activationsUsed: 0, status: 'expired', enabledFeatures: ['encryption'], createdAt: '2024-04-01T00:00:00Z', updatedAt: '2024-05-01T00:00:00Z' },
  { id: 'lic_6', licenseKey: 'LIC-POS-K1L2-2026', productId: 'prod_2', productName: 'CloudPOS', customerId: 'cust_5', customerName: 'Stark Industries', packageId: 'pkg_6', packageType: 'standard', type: 'yearly', amount: 1490, currency: 'USD', expiryDate: '2027-04-01T00:00:00Z', activationLimit: 50, activationsUsed: 12, status: 'active', enabledFeatures: ['sales', 'inventory', 'loyalty'], createdAt: '2024-04-01T00:00:00Z', updatedAt: '2024-06-20T00:00:00Z' },
  { id: 'lic_7', licenseKey: 'LIC-APIGW-M3N4-2026', productId: 'prod_3', productName: 'API Gateway', customerId: 'cust_1', customerName: 'Acme Corporation', packageId: 'pkg_5', packageType: 'basic', type: 'yearly', amount: 490, currency: 'USD', expiryDate: '2027-06-10T00:00:00Z', activationLimit: 100, activationsUsed: 45, status: 'active', enabledFeatures: ['rate_limiting', 'analytics'], createdAt: '2024-06-10T00:00:00Z', updatedAt: '2024-06-10T00:00:00Z' },
]

export const activations: Activation[] = [
  { id: 'act_1', licenseId: 'lic_1', licenseKey: 'LIC-ERP-A1B2-2026', deviceName: 'Server-Prod-01', deviceId: 'DEV-001', ipAddress: '192.168.1.100', activatedAt: '2024-01-20T00:00:00Z', status: 'active' },
  { id: 'act_2', licenseId: 'lic_1', licenseKey: 'LIC-ERP-A1B2-2026', deviceName: 'Server-Prod-02', deviceId: 'DEV-002', ipAddress: '192.168.1.101', activatedAt: '2024-02-15T00:00:00Z', status: 'active' },
  { id: 'act_3', licenseId: 'lic_1', licenseKey: 'LIC-ERP-A1B2-2026', deviceName: 'Server-Staging', deviceId: 'DEV-003', ipAddress: '192.168.2.100', activatedAt: '2024-03-01T00:00:00Z', status: 'active' },
  { id: 'act_4', licenseId: 'lic_2', licenseKey: 'LIC-ERP-C3D4-2026', deviceName: 'Globex-Main', deviceId: 'DEV-004', ipAddress: '10.0.0.50', activatedAt: '2024-02-25T00:00:00Z', status: 'active' },
  { id: 'act_5', licenseId: 'lic_2', licenseKey: 'LIC-ERP-C3D4-2026', deviceName: 'Globex-Backup', deviceId: 'DEV-005', ipAddress: '10.0.0.51', activatedAt: '2024-03-10T00:00:00Z', status: 'revoked' },
  { id: 'act_6', licenseId: 'lic_3', licenseKey: 'LIC-POS-E5F6-2026', deviceName: 'Initech-POS-01', deviceId: 'DEV-006', ipAddress: '172.16.0.10', activatedAt: '2024-03-15T00:00:00Z', status: 'active' },
  { id: 'act_7', licenseId: 'lic_6', licenseKey: 'LIC-POS-K1L2-2026', deviceName: 'Stark-Tower-POS', deviceId: 'DEV-007', ipAddress: '10.0.1.100', activatedAt: '2024-04-05T00:00:00Z', status: 'active' },
]

export const activityLogs: ActivityLog[] = [
  { id: 'log_1', event: 'License Created', description: 'License LIC-ERP-A1B2-2026 created for Acme Corporation', userId: 'usr_1', userName: 'John Doe', resourceType: 'license', resourceId: 'lic_1', createdAt: '2024-01-15T10:30:00Z' },
  { id: 'log_2', event: 'License Activated', description: 'License LIC-ERP-A1B2-2026 activated on Server-Prod-01', userId: 'usr_1', userName: 'System', resourceType: 'activation', resourceId: 'act_1', createdAt: '2024-01-20T14:22:00Z' },
  { id: 'log_3', event: 'Product Created', description: 'Enterprise ERP product created', userId: 'usr_1', userName: 'John Doe', resourceType: 'product', resourceId: 'prod_1', createdAt: '2024-01-01T09:00:00Z' },
  { id: 'log_4', event: 'Customer Created', description: 'Acme Corporation added as customer', userId: 'usr_1', userName: 'John Doe', resourceType: 'customer', resourceId: 'cust_1', createdAt: '2024-01-15T10:00:00Z' },
  { id: 'log_5', event: 'Device Revoked', description: 'Device Globex-Backup revoked from license LIC-ERP-C3D4-2026', userId: 'usr_2', userName: 'Jane Smith', resourceType: 'activation', resourceId: 'act_5', createdAt: '2024-04-01T16:45:00Z' },
  { id: 'log_6', event: 'License Suspended', description: 'License LIC-ERP-G7H8-2026 suspended for Umbrella Corp', userId: 'usr_1', userName: 'John Doe', resourceType: 'license', resourceId: 'lic_4', createdAt: '2024-06-10T11:20:00Z' },
  { id: 'log_7', event: 'Customer Suspended', description: 'Umbrella Corp account suspended', userId: 'usr_3', userName: 'Mike Johnson', resourceType: 'customer', resourceId: 'cust_4', createdAt: '2024-06-10T11:00:00Z' },
  { id: 'log_8', event: 'Login', description: 'John Doe logged in from IP 192.168.1.1', userId: 'usr_1', userName: 'John Doe', resourceType: 'auth', resourceId: '', createdAt: '2024-06-20T08:00:00Z' },
  { id: 'log_9', event: 'License Renewed', description: 'License LIC-ERP-A1B2-2026 renewed for another year', userId: 'usr_1', userName: 'John Doe', resourceType: 'license', resourceId: 'lic_1', createdAt: '2024-06-15T09:30:00Z' },
  { id: 'log_10', event: 'Login', description: 'Jane Smith logged in from IP 192.168.1.2', userId: 'usr_2', userName: 'Jane Smith', resourceType: 'auth', resourceId: '', createdAt: '2024-06-20T09:00:00Z' },
]

export const dashboardStats: DashboardStats = {
  totalProducts: products.length,
  activeLicenses: licenses.filter(l => l.status === 'active').length,
  expiredLicenses: licenses.filter(l => l.status === 'expired').length,
  totalCustomers: customers.filter(c => c.status === 'active').length,
  onlineActivations: activations.filter(a => a.status === 'active').length,
  licenseGrowth: [
    { month: 'Jan', count: 1 },
    { month: 'Feb', count: 2 },
    { month: 'Mar', count: 4 },
    { month: 'Apr', count: 5 },
    { month: 'May', count: 6 },
    { month: 'Jun', count: 7 },
  ],
  activationsPerDay: [
    { date: 'Jun 1', count: 2 },
    { date: 'Jun 2', count: 5 },
    { date: 'Jun 3', count: 3 },
    { date: 'Jun 4', count: 7 },
    { date: 'Jun 5', count: 4 },
    { date: 'Jun 6', count: 8 },
    { date: 'Jun 7', count: 6 },
  ],
}

export const payments: Payment[] = [
  { id: 'pay_1', licenseId: 'lic_1', licenseKey: 'LIC-ERP-A1B2-2026', productName: 'Enterprise ERP', customerName: 'Acme Corporation', amount: 2990, currency: 'USD', transactionId: 'TXN-001', method: 'card', status: 'approved', createdAt: '2024-06-01T10:00:00Z', approvedAt: '2024-06-01T12:00:00Z', approvedBy: 'Auto (Card)' },
  { id: 'pay_2', licenseId: 'lic_3', licenseKey: 'LIC-POS-E5F6-2026', productName: 'CloudPOS', customerName: 'Initech Solutions', amount: 1490, currency: 'USD', transactionId: 'TXN-002', method: 'custom', status: 'pending', createdAt: '2024-06-15T14:30:00Z' },
  { id: 'pay_3', licenseId: 'lic_6', licenseKey: 'LIC-POS-K1L2-2026', productName: 'CloudPOS', customerName: 'Stark Industries', amount: 1490, currency: 'USD', transactionId: 'TXN-003', method: 'custom', status: 'pending', createdAt: '2024-06-18T09:15:00Z' },
]

export const apiKeys: ApiKey[] = [
  { id: 'ak_1', name: 'Production API Key', key: 'lhub_sk_prod_8a7b6c5d4e3f2g1h', createdAt: '2024-01-01T00:00:00Z', lastUsed: '2024-06-20T00:00:00Z' },
  { id: 'ak_2', name: 'Development API Key', key: 'lhub_sk_dev_1a2b3c4d5e6f7g8h', createdAt: '2024-03-15T00:00:00Z', lastUsed: '2024-06-19T00:00:00Z' },
  { id: 'ak_3', name: 'ERP Auto Key', key: 'lhub_prod_eyJwcm9kdWN0X2lkIjoicHJvZF8xIiwicHJvZHVjdF9jb2RlIjoiRVJQIiwicHJvZHVjdF9uYW1lIjoiRW50ZXJwcmlzZSBFUlAiLCJjcmVhdGVkX2F0IjoiMjAyNC0wMS0wMVQwMDowMDowMFoifQ==.1a2b3c4d', createdAt: '2024-01-01T00:00:00Z', lastUsed: '2024-06-20T00:00:00Z' },
  { id: 'ak_4', name: 'POS Auto Key', key: 'lhub_prod_eyJwcm9kdWN0X2lkIjoicHJvZF8yIiwicHJvZHVjdF9jb2RlIjoiUE9TIiwicHJvZHVjdF9uYW1lIjoiQ2xvdWRQT1MiLCJjcmVhdGVkX2F0IjoiMjAyNC0wMi0wMVQwMDowMDowMFoifQ==.e5f6g7h8', createdAt: '2024-02-01T00:00:00Z', lastUsed: '2024-06-19T00:00:00Z' },
  { id: 'ak_5', name: 'APIGW Auto Key', key: 'lhub_prod_eyJwcm9kdWN0X2lkIjoicHJvZF8zIiwicHJvZHVjdF9jb2RlIjoiQVBJR1ciLCJwcm9kdWN0X25hbWUiOiJBUEkgR2F0ZXdheSIsImNyZWF0ZWRfYXQiOiIyMDI0LTAzLTAxVDAwOjAwOjAwWiJ9.i9j0k1l2', createdAt: '2024-03-01T00:00:00Z', lastUsed: '2024-06-18T00:00:00Z' },
  { id: 'ak_6', name: 'DV Auto Key', key: 'lhub_prod_eyJwcm9kdWN0X2lkIjoicHJvZF80IiwicHJvZHVjdF9jb2RlIjoiRFYiLCJwcm9kdWN0X25hbWUiOiJEYXRhVmF1bHQiLCJjcmVhdGVkX2F0IjoiMjAyNC0wNC0wMVQwMDowMDowMFoifQ==.m3n4o5p6', createdAt: '2024-04-01T00:00:00Z', lastUsed: '2024-06-15T00:00:00Z' },
]
