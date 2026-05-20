import React, { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { Modal, ConfirmDialog, Toast } from '@/components/ui/Dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import { CardSkeleton, TableSkeleton } from '@/components/ui/Skeleton'
import { Select } from '@/components/ui/Input'
import { Plus, Pencil, Trash2, Blocks } from 'lucide-react'
import type { Product, Feature } from '@/types'

export function FeaturesPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState<string>('')
  const [showForm, setShowForm] = useState(false)
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' })
  const [form, setForm] = useState({ name: '', key: '', enabledDefault: true })

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const data = await api.getProducts()
    setProducts(data)
    if (data.length > 0) setSelectedProduct(data[0].id)
    setLoading(false)
  }

  const currentProduct = products.find(p => p.id === selectedProduct)

  function openCreate() {
    setEditingFeature(null)
    setForm({ name: '', key: '', enabledDefault: true })
    setShowForm(true)
  }

  function openEdit(feature: Feature) {
    setEditingFeature(feature)
    setForm({ name: feature.name, key: feature.key, enabledDefault: feature.enabledDefault })
    setShowForm(true)
  }

  async function handleSave() {
    if (!selectedProduct) return
    if (editingFeature) {
      await api.updateFeature(editingFeature.id, form)
    } else {
      await api.addFeature(selectedProduct, form)
    }
    setShowForm(false)
    setToast({ show: true, message: `Feature ${editingFeature ? 'updated' : 'created'}`, type: 'success' })
    load()
  }

  async function handleDelete() {
    if (!deleteId) return
    await api.deleteFeature(deleteId)
    setDeleteId(null)
    setToast({ show: true, message: 'Feature deleted', type: 'success' })
    load()
  }

  if (loading) return <div className="space-y-4"><CardSkeleton /><TableSkeleton /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Feature Flags</h1>
          <p className="text-muted-foreground text-sm">Manage feature flags per product</p>
        </div>
        <Button onClick={openCreate} disabled={!selectedProduct}><Plus className="h-4 w-4 mr-2" />Add Feature</Button>
      </div>

      <div className="flex items-center gap-4">
        <Select
          label="Product"
          value={selectedProduct}
          onChange={e => setSelectedProduct(e.target.value)}
          options={products.map(p => ({ value: p.id, label: p.name }))}
        />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Feature Name</TableHead>
                <TableHead>Feature Key</TableHead>
                <TableHead>Enabled by Default</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(currentProduct?.features || []).map(feature => (
                <TableRow key={feature.id}>
                  <TableCell className="font-medium">{feature.name}</TableCell>
                  <TableCell className="font-mono text-xs">{feature.key}</TableCell>
                  <TableCell><Badge variant={feature.enabledDefault ? 'active' : 'inactive'}>{feature.enabledDefault ? 'Yes' : 'No'}</Badge></TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(feature)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => setDeleteId(feature.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {(!currentProduct?.features || currentProduct.features.length === 0) && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                    <Blocks className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No features for this product</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Modal open={showForm} onClose={() => setShowForm(false)} title={editingFeature ? 'Edit Feature' : 'Add Feature'}>
        <div className="space-y-4">
          <Input label="Feature Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="HR Management" />
          <Input label="Feature Key" value={form.key} onChange={e => setForm({ ...form, key: e.target.value })} placeholder="hrm" />
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.enabledDefault} onChange={e => setForm({ ...form, enabledDefault: e.target.checked })} className="rounded border-input" />
            <span className="text-sm">Enabled by default</span>
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editingFeature ? 'Update' : 'Add'} Feature</Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Feature" message="Are you sure you want to delete this feature?" confirmLabel="Delete" />
      <Toast {...toast} onClose={() => setToast({ ...toast, show: false })} />
    </div>
  )
}
