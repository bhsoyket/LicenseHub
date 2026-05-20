import React, { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Input, Select } from '@/components/ui/Input'
import { Modal, ConfirmDialog, Toast } from '@/components/ui/Dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import { CardSkeleton, TableSkeleton } from '@/components/ui/Skeleton'
import { Plus, Trash2, ShoppingBag } from 'lucide-react'
import type { Package, Product } from '@/types'

export function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' })

  const [form, setForm] = useState({ productId: '', type: 'basic' as Package['type'], monthlyAmount: 0, yearlyAmount: 0, features: '' })

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const [pkgData, prodData] = await Promise.all([api.getPackages(), api.getProducts()])
    setPackages(pkgData)
    setProducts(prodData)
    setLoading(false)
  }

  async function handleSave() {
    const product = products.find(p => p.id === form.productId)
    await api.createPackage({
      ...form,
      productName: product?.name || '',
      features: form.features.split(',').map(f => f.trim()).filter(Boolean),
    })
    setShowForm(false)
    setToast({ show: true, message: 'Package created', type: 'success' })
    load()
  }

  async function handleDelete() {
    if (!deleteId) return
    await api.deletePackage(deleteId)
    setDeleteId(null)
    setToast({ show: true, message: 'Package deleted', type: 'success' })
    load()
  }

  if (loading) return <div className="space-y-4"><CardSkeleton /><TableSkeleton /></div>

  const packageTypes: Record<string, string> = {
    free_trial: 'Free Trial', basic: 'Basic', standard: 'Standard', custom: 'Custom',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Packages</h1>
          <p className="text-muted-foreground text-sm">Manage product pricing packages</p>
        </div>
        <Button onClick={() => { setForm({ productId: products[0]?.id || '', type: 'basic', monthlyAmount: 0, yearlyAmount: 0, features: '' }); setShowForm(true) }}>
          <Plus className="h-4 w-4 mr-2" />Add Package
        </Button>
      </div>

      {products.map(product => {
        const productPackages = packages.filter(p => p.productId === product.id)
        if (productPackages.length === 0) return null
        return (
          <div key={product.id}>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-1 flex-1 bg-border rounded-full" />
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{product.name}</h2>
              <div className="h-1 flex-1 bg-border rounded-full" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {productPackages.map(pkg => (
                <Card key={pkg.id} hover>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">{packageTypes[pkg.type]}</CardTitle>
                        <p className="text-sm text-muted-foreground">{pkg.productName}</p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => setDeleteId(pkg.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex gap-4">
                        <div>
                          <p className="text-2xl font-bold">${pkg.monthlyAmount}</p>
                          <p className="text-xs text-muted-foreground">per month</p>
                        </div>
                        <div className="border-l pl-4">
                          <p className="text-2xl font-bold">${pkg.yearlyAmount}</p>
                          <p className="text-xs text-muted-foreground">per year</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {pkg.features.map(f => <Badge key={f} variant="active">{(product.features.find(feat => feat.key === f)?.name) || f}</Badge>)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )
      })}
      {packages.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <ShoppingBag className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>No packages defined. Create a package for your products.</p>
        </div>
      )}

      <Modal open={showForm} onClose={() => setShowForm(false)} title="Add Package">
        <div className="space-y-4">
          <Select label="Product" value={form.productId} onChange={e => setForm({ ...form, productId: e.target.value })}
            options={products.map(p => ({ value: p.id, label: p.name }))} />
          <Select label="Package Type" value={form.type} onChange={e => setForm({ ...form, type: e.target.value as any })}
            options={[
              { value: 'free_trial', label: 'Free Trial' },
              { value: 'basic', label: 'Basic' },
              { value: 'standard', label: 'Standard' },
              { value: 'custom', label: 'Custom' },
            ]} />
          <Input label="Monthly Amount ($)" type="number" value={form.monthlyAmount} onChange={e => setForm({ ...form, monthlyAmount: Number(e.target.value) })} />
          <Input label="Yearly Amount ($)" type="number" value={form.yearlyAmount} onChange={e => setForm({ ...form, yearlyAmount: Number(e.target.value) })} />
          <Input label="Features (comma-separated keys)" value={form.features} onChange={e => setForm({ ...form, features: e.target.value })} placeholder="hrm, payroll, inventory" />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button onClick={handleSave}>Create Package</Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Package" message="Are you sure?" confirmLabel="Delete" />
      <Toast {...toast} onClose={() => setToast({ ...toast, show: false })} />
    </div>
  )
}
