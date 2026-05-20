import type { User, Product, Customer, License, ActivityLog, DashboardStats, ApiKey, Package, Activation, Feature, Payment } from '@/types'
import * as mock from './mock-data'

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

function generateId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}`
}

export const api = {
  // Auth
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    await delay(600)
    if (email === 'john@licensehub.io' && password === 'password') {
      return { user: mock.currentUser, token: 'jwt_mock_token_123' }
    }
    throw new Error('Invalid credentials')
  },

  async register(name: string, email: string, password: string): Promise<{ user: User; token: string }> {
    await delay(600)
    const user: User = {
      id: generateId('usr'),
      name,
      email,
      role: 'admin',
      createdAt: new Date().toISOString(),
    }
    return { user, token: 'jwt_mock_token_123' }
  },

  async resetPassword(email: string): Promise<void> {
    await delay(600)
    return
  },

  // Dashboard
  async getDashboardStats(): Promise<DashboardStats> {
    await delay(400)
    return mock.dashboardStats
  },

  // Products
  async getProducts(): Promise<Product[]> {
    await delay(400)
    return mock.products
  },

  async getProduct(id: string): Promise<Product | undefined> {
    await delay(300)
    return mock.products.find(p => p.id === id)
  },

  async createProduct(data: Omit<Product, 'id' | 'features' | 'createdAt' | 'updatedAt'>): Promise<{ product: Product; apiKey: ApiKey }> {
    await delay(500)
    const product: Product = {
      ...data,
      id: generateId('prod'),
      features: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    const apiKey = await this.generateProductApiKey(product.id, product.code, product.name)
    mock.products.push(product)
    mock.apiKeys.push(apiKey)
    return { product, apiKey }
  },

  async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
    await delay(500)
    const index = mock.products.findIndex(p => p.id === id)
    if (index === -1) throw new Error('Product not found')
    mock.products[index] = { ...mock.products[index], ...data, updatedAt: new Date().toISOString() }
    return mock.products[index]
  },

  async deleteProduct(id: string): Promise<void> {
    await delay(400)
    const index = mock.products.findIndex(p => p.id === id)
    if (index !== -1) mock.products.splice(index, 1)
  },

  // Features
  async addFeature(productId: string, data: Omit<Feature, 'id' | 'productId'>): Promise<Feature> {
    await delay(300)
    const product = mock.products.find(p => p.id === productId)
    if (!product) throw new Error('Product not found')
    const feature: Feature = { ...data, id: generateId('feat'), productId }
    product.features.push(feature)
    return feature
  },

  async updateFeature(featureId: string, data: Partial<Feature>): Promise<Feature> {
    await delay(300)
    const product = mock.products.find(p => p.features.some(f => f.id === featureId))
    if (!product) throw new Error('Feature not found')
    const feature = product.features.find(f => f.id === featureId)!
    Object.assign(feature, data)
    return feature
  },

  async deleteFeature(featureId: string): Promise<void> {
    await delay(300)
    const product = mock.products.find(p => p.features.some(f => f.id === featureId))
    if (product) {
      product.features = product.features.filter(f => f.id !== featureId)
    }
  },

  // Customers
  async getCustomers(): Promise<Customer[]> {
    await delay(400)
    return mock.customers
  },

  async getCustomer(id: string): Promise<Customer | undefined> {
    await delay(300)
    return mock.customers.find(c => c.id === id)
  },

  async createCustomer(data: Omit<Customer, 'id' | 'createdAt'>): Promise<Customer> {
    await delay(500)
    const customer: Customer = { ...data, id: generateId('cust'), createdAt: new Date().toISOString() }
    mock.customers.push(customer)
    return customer
  },

  async updateCustomer(id: string, data: Partial<Customer>): Promise<Customer> {
    await delay(500)
    const index = mock.customers.findIndex(c => c.id === id)
    if (index === -1) throw new Error('Customer not found')
    mock.customers[index] = { ...mock.customers[index], ...data }
    return mock.customers[index]
  },

  async deleteCustomer(id: string): Promise<void> {
    await delay(400)
    const index = mock.customers.findIndex(c => c.id === id)
    if (index !== -1) mock.customers.splice(index, 1)
  },

  // Packages
  async getPackages(): Promise<Package[]> {
    await delay(400)
    return mock.packages
  },

  async createPackage(data: Omit<Package, 'id' | 'createdAt'>): Promise<Package> {
    await delay(500)
    const pkg: Package = { ...data, id: generateId('pkg'), createdAt: new Date().toISOString() }
    mock.packages.push(pkg)
    return pkg
  },

  async deletePackage(id: string): Promise<void> {
    await delay(300)
    const index = mock.packages.findIndex(p => p.id === id)
    if (index !== -1) mock.packages.splice(index, 1)
  },

  // Licenses
  async getLicenses(): Promise<License[]> {
    await delay(400)
    return mock.licenses
  },

  async getLicense(id: string): Promise<License | undefined> {
    await delay(300)
    return mock.licenses.find(l => l.id === id)
  },

  async createLicense(data: Omit<License, 'id' | 'licenseKey' | 'productName' | 'customerName' | 'packageType' | 'activationsUsed' | 'createdAt' | 'updatedAt'>): Promise<License> {
    await delay(600)
    const product = mock.products.find(p => p.id === data.productId)
    const customer = mock.customers.find(c => c.id === data.customerId)
    const pkg = mock.packages.find(p => p.id === data.packageId)
    const license: License = {
      ...data,
      id: generateId('lic'),
      licenseKey: `LIC-${product?.code || 'XXXX'}-${generateId('').slice(0, 4).toUpperCase()}-2026`,
      productName: product?.name || 'Unknown',
      customerName: customer?.companyName || 'Unknown',
      packageType: pkg?.type || 'basic',
      activationsUsed: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    mock.licenses.push(license)
    return license
  },

  async updateLicense(id: string, data: Partial<License>): Promise<License> {
    await delay(500)
    const index = mock.licenses.findIndex(l => l.id === id)
    if (index === -1) throw new Error('License not found')
    mock.licenses[index] = { ...mock.licenses[index], ...data, updatedAt: new Date().toISOString() }
    return mock.licenses[index]
  },

  // Activations
  async getActivations(licenseId?: string): Promise<Activation[]> {
    await delay(300)
    if (licenseId) return mock.activations.filter(a => a.licenseId === licenseId)
    return mock.activations
  },

  // Activity Logs
  async getActivityLogs(): Promise<ActivityLog[]> {
    await delay(400)
    return mock.activityLogs
  },

  // API Keys
  async getApiKeys(): Promise<ApiKey[]> {
    await delay(300)
    return mock.apiKeys
  },

  async generateProductApiKey(productId: string, productCode: string, productName: string): Promise<ApiKey> {
    const payload = JSON.stringify({
      product_id: productId,
      product_code: productCode,
      product_name: productName,
      created_at: new Date().toISOString(),
    })
    const encoded = btoa(payload)
    const hash = Array.from(encoded).reduce((a, c) => ((a << 5) - a + c.charCodeAt(0)) | 0, 0).toString(36).slice(0, 8)
    return {
      id: generateId('ak'),
      name: `${productCode} Auto Key`,
      key: `lhub_prod_${encoded}.${hash}`,
      createdAt: new Date().toISOString(),
      lastUsed: new Date().toISOString(),
    }
  },

  async generateApiKey(name: string): Promise<ApiKey> {
    await delay(500)
    return {
      id: generateId('ak'),
      name,
      key: `lhub_sk_${generateId('').slice(0, 16).toLowerCase()}`,
      createdAt: new Date().toISOString(),
      lastUsed: new Date().toISOString(),
    }
  },

  async deleteApiKey(id: string): Promise<void> {
    await delay(300)
  },

  // Payments
  async getPayments(): Promise<Payment[]> {
    await delay(400)
    return mock.payments
  },

  async createPayment(data: { licenseId: string; licenseKey: string; productName: string; customerName: string; amount: number; currency: string; transactionId: string; method: 'card' | 'custom' }): Promise<Payment> {
    await delay(600)
    const payment: Payment = {
      id: generateId('pay'),
      ...data,
      status: data.method === 'card' ? 'approved' : 'pending',
      createdAt: new Date().toISOString(),
      approvedAt: data.method === 'card' ? new Date().toISOString() : undefined,
      approvedBy: data.method === 'card' ? 'Auto (Card)' : undefined,
    }
    mock.payments.unshift(payment)
    return payment
  },

  async approvePayment(id: string): Promise<void> {
    await delay(400)
    const p = mock.payments.find(p => p.id === id)
    if (p) {
      p.status = 'approved'
      p.approvedAt = new Date().toISOString()
      p.approvedBy = 'John Doe'
    }
  },

  async rejectPayment(id: string): Promise<void> {
    await delay(400)
    const p = mock.payments.find(p => p.id === id)
    if (p) p.status = 'rejected'
  },
}
