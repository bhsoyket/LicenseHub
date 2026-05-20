import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Input, Select } from '@/components/ui/Input'
import { Modal, ConfirmDialog, Toast } from '@/components/ui/Dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import { CardSkeleton, TableSkeleton } from '@/components/ui/Skeleton'
import { Plus, Key, Copy, Check, Eye, RefreshCw, Ban, XCircle, Search, Package } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { License, Product, Customer } from '@/types'
import type { Package as PackageType } from '@/types'

const packageLabels: Record<string, string> = {
  free_trial: 'Free Trial',
  basic: 'Basic',
  standard: 'Standard',
  custom: 'Custom',
}

function calcExpiryDate(type: string): string {
  const now = new Date()
  switch (type) {
    case 'monthly':
      return new Date(now.getFullYear(), now.getMonth() + 1, now.getDate()).toISOString().split('T')[0]
    case 'yearly':
      return new Date(now.getFullYear() + 1, now.getMonth(), now.getDate()).toISOString().split('T')[0]
    case 'lifetime':
      return new Date(now.getFullYear() + 100, now.getMonth(), now.getDate()).toISOString().split('T')[0]
    default:
      return new Date(now.getFullYear() + 1, now.getMonth(), now.getDate()).toISOString().split('T')[0]
  }
}

export function LicensesPage() {
  const [licenses, setLicenses] = useState<License[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [packages, setPackages] = useState<PackageType[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' })
  const [copiedKey, setCopiedKey] = useState('')
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  const [form, setForm] = useState({
    productId: '', customerId: '', packageId: '', type: 'monthly' as License['type'],
    amount: 0, currency: 'USD' as License['currency'], expiryDate: '', activationLimit: 1,
    status: 'active' as License['status'], enabledFeatures: [] as string[],
  })

  const [actionTarget, setActionTarget] = useState<{ id: string; action: string } | null>(null)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const [lic, prod, cust, pkg] = await Promise.all([
      api.getLicenses(), api.getProducts(), api.getCustomers(), api.getPackages(),
    ])
    setLicenses(lic)
    setProducts(prod)
    setCustomers(cust)
    setPackages(pkg)
    setLoading(false)
  }

  const filteredLicenses = licenses.filter(l =>
    l.licenseKey.toLowerCase().includes(search.toLowerCase()) ||
    l.productName.toLowerCase().includes(search.toLowerCase()) ||
    l.customerName.toLowerCase().includes(search.toLowerCase())
  )

  const filteredPackages = packages.filter(p => p.productId === form.productId)
  const currentProductFeatures = products.find(p => p.id === form.productId)?.features || []

  function calcAmount(pkg: PackageType | undefined, type: string): number {
    if (!pkg) return 0
    if (pkg.type === 'free_trial') return 0
    return type === 'monthly' ? pkg.monthlyAmount : pkg.yearlyAmount
  }

  function openCreate() {
    const firstProduct = products[0]
    const firstPkg = packages.find(p => p.productId === firstProduct?.id)
    setForm({
      productId: firstProduct?.id || '',
      customerId: customers[0]?.id || '',
      packageId: firstPkg?.id || '',
      type: 'yearly',
      amount: calcAmount(firstPkg, 'yearly'),
      currency: 'USD',
      expiryDate: calcExpiryDate('yearly'),
      activationLimit: firstPkg ? 1 : 1,
      status: 'active',
      enabledFeatures: firstPkg?.features || firstProduct?.features?.filter(f => f.enabledDefault).map(f => f.key) || [],
    })
    setShowForm(true)
  }

  function handlePackageSelect(packageId: string) {
    const pkg = packages.find(p => p.id === packageId)
    if (pkg) {
      setForm({
        ...form,
        packageId,
        type: 'yearly',
        amount: calcAmount(pkg, 'yearly'),
        activationLimit: Math.max(1, Math.floor(pkg.monthlyAmount > 0 ? pkg.monthlyAmount / 50 + 1 : 1)),
        enabledFeatures: pkg.features,
      })
    } else {
      setForm({ ...form, packageId, amount: 0, enabledFeatures: [] })
    }
  }

  function handleProductChange(productId: string) {
    const firstPkg = packages.find(p => p.productId === productId)
    setForm({
      ...form,
      productId,
      packageId: firstPkg?.id || '',
      amount: calcAmount(firstPkg, form.type),
      enabledFeatures: firstPkg?.features ||
        products.find(p => p.id === productId)?.features?.filter(f => f.enabledDefault).map(f => f.key) || [],
    })
  }

  async function handleCreate() {
    await api.createLicense({
      productId: form.productId,
      customerId: form.customerId,
      packageId: form.packageId,
      type: form.type,
      amount: form.amount,
      currency: form.currency,
      expiryDate: new Date(form.expiryDate).toISOString(),
      activationLimit: form.activationLimit,
      status: form.status,
      enabledFeatures: form.enabledFeatures,
    })
    setShowForm(false)
    setToast({ show: true, message: 'License generated successfully', type: 'success' })
    load()
  }

  async function handleAction() {
    if (!actionTarget) return
    const { id, action } = actionTarget
    const updates: Record<string, any> = {
      renew: { status: 'active', expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() },
      suspend: { status: 'suspended' },
      revoke: { status: 'revoked' },
    }
    if (updates[action]) {
      await api.updateLicense(id, updates[action])
      setToast({ show: true, message: `License ${action}ed successfully`, type: 'success' })
    }
    setActionTarget(null)
    load()
  }

  function copyKey(key: string) {
    navigator.clipboard.writeText(key)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(''), 2000)
  }

  if (loading) return <div className="space-y-4"><CardSkeleton /><TableSkeleton /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Licenses</h1>
          <p className="text-muted-foreground text-sm">Generate and manage software licenses</p>
        </div>
        <Button onClick={openCreate}><Plus className="h-4 w-4 mr-2" />Generate License</Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            className="flex h-10 w-full rounded-lg border border-input bg-background pl-9 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="Search licenses..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>License Key</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Package</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Activations</TableHead>
                <TableHead>Expiry</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLicenses.map(lic => (
                <TableRow key={lic.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs">{lic.licenseKey}</span>
                      <button onClick={() => copyKey(lic.licenseKey)} className="text-muted-foreground hover:text-foreground transition-colors">
                        {copiedKey === lic.licenseKey ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </TableCell>
                  <TableCell>{lic.productName}</TableCell>
                  <TableCell>{lic.customerName}</TableCell>
                  <TableCell><Badge variant={lic.packageType}>{packageLabels[lic.packageType] || lic.packageType}</Badge></TableCell>
                  <TableCell className="font-medium">{lic.currency} {lic.amount}</TableCell>
                  <TableCell><Badge variant={lic.type}>{lic.type}</Badge></TableCell>
                  <TableCell>{lic.activationsUsed}/{lic.activationLimit}</TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(lic.expiryDate)}</TableCell>
                  <TableCell><Badge variant={lic.status}>{lic.status}</Badge></TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="sm" onClick={() => navigate(`/licenses/${lic.id}`)}><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => setActionTarget({ id: lic.id, action: 'renew' })}><RefreshCw className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => setActionTarget({ id: lic.id, action: 'suspend' })}><Ban className="h-4 w-4 text-amber-500" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => setActionTarget({ id: lic.id, action: 'revoke' })}><XCircle className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredLicenses.length === 0 && (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-12 text-muted-foreground">
                    <Key className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>{search ? 'No matching licenses' : 'No licenses yet. Generate your first license.'}</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Modal open={showForm} onClose={() => setShowForm(false)} title="Generate License">
        <div className="space-y-4">
          <Select label="Product" value={form.productId} onChange={e => handleProductChange(e.target.value)}
            options={products.map(p => ({ value: p.id, label: p.name }))} />

          <Select label="Customer" value={form.customerId} onChange={e => setForm({ ...form, customerId: e.target.value })}
            options={customers.map(c => ({ value: c.id, label: c.companyName }))} />

          <Select label="Package" value={form.packageId} onChange={e => handlePackageSelect(e.target.value)}
            options={[
              { value: '', label: '-- No package --' },
              ...filteredPackages.map(p => ({
                value: p.id,
                label: `${packageLabels[p.type]} ($${p.monthlyAmount}/mo - $${p.yearlyAmount}/yr)`,
              })),
            ]} />

          {form.packageId && (
            <Card className="bg-muted/50">
              <CardContent className="p-3 flex items-center gap-2">
                <Package className="h-4 w-4 text-primary" />
                <span className="text-sm">
                  {packageLabels[packages.find(p => p.id === form.packageId)?.type || '']} &mdash;{' '}
                  {packages.find(p => p.id === form.packageId)?.features.join(', ') || 'No features'}
                </span>
              </CardContent>
            </Card>
          )}

          <Select label="License Type" value={form.type} onChange={e => {
            const newType = e.target.value as License['type']
            const pkg = packages.find(p => p.id === form.packageId)
            setForm({ ...form, type: newType, expiryDate: calcExpiryDate(newType), amount: calcAmount(pkg, newType) })
          }}
            options={[
              { value: 'monthly', label: 'Monthly' },
              { value: 'yearly', label: 'Yearly' },
              { value: 'lifetime', label: 'Lifetime' },
            ]} />

          <Input label="Expiry Date" type="date" value={form.expiryDate}
            onChange={e => setForm({ ...form, expiryDate: e.target.value })} />

          <Input label="Activation Limit" type="number" value={form.activationLimit}
            onChange={e => setForm({ ...form, activationLimit: Number(e.target.value) })} />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Amount</label>
                {form.packageId && packages.find(p => p.id === form.packageId)?.type !== 'custom' && (
                  <span className="text-xs text-muted-foreground">Auto-calculated</span>
                )}
              </div>
              <input
                type="number"
                value={form.amount}
                onChange={e => setForm({ ...form, amount: Number(e.target.value) })}
                disabled={!!form.packageId && packages.find(p => p.id === form.packageId)?.type !== 'custom'}
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <Select label="Currency" value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value as any })}
              options={[
                { value: 'USD', label: 'USD ($)' },
                { value: 'EUR', label: 'EUR (€)' },
                { value: 'GBP', label: 'GBP (£)' },
                { value: 'BDT', label: 'BDT (৳)' },
              ]} />
          </div>

          {currentProductFeatures.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Enabled Features</p>
              <div className="space-y-2">
                {currentProductFeatures.map(f => (
                  <label key={f.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form.enabledFeatures.includes(f.key)}
                      onChange={e => {
                        if (e.target.checked) {
                          setForm({ ...form, enabledFeatures: [...form.enabledFeatures, f.key] })
                        } else {
                          setForm({ ...form, enabledFeatures: form.enabledFeatures.filter(k => k !== f.key) })
                        }
                      }}
                      className="rounded border-input"
                    />
                    <span className="text-sm">{f.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button onClick={handleCreate}>Generate License</Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!actionTarget}
        onClose={() => setActionTarget(null)}
        onConfirm={handleAction}
        title={`${actionTarget?.action || ''} License`}
        message={`Are you sure you want to ${actionTarget?.action} this license?`}
        confirmLabel={actionTarget?.action || 'Confirm'}
      />

      <Toast {...toast} onClose={() => setToast({ ...toast, show: false })} />
    </div>
  )
}
