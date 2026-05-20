import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Input, TextArea, Select } from '@/components/ui/Input'
import { Modal, ConfirmDialog, Toast } from '@/components/ui/Dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import { CardSkeleton, TableSkeleton } from '@/components/ui/Skeleton'
import { Plus, Pencil, Trash2, Eye, Package, Key, Copy, Check } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { Product } from '@/types'
import type { ApiKey } from '@/types'

function formatProductKeyPayload(key: string): string {
  try {
    const parts = key.split('.')
    if (parts.length >= 2) {
      const encoded = parts[0].replace('lhub_prod_', '')
      return atob(encoded)
    }
    return 'Unable to decode'
  } catch {
    return 'Unable to decode'
  }
}

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' })
  const [newApiKey, setNewApiKey] = useState<ApiKey | null>(null)
  const [copied, setCopied] = useState(false)
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '', code: '', description: '', type: 'saas' as Product['type'], status: 'active' as Product['status'], version: '1.0.0', webhookUrl: '',
  })

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const data = await api.getProducts()
    setProducts(data)
    setLoading(false)
  }

  function openCreate() {
    setEditing(null)
    setForm({ name: '', code: '', description: '', type: 'saas', status: 'active', version: '1.0.0', webhookUrl: '' })
    setShowForm(true)
  }

  function openEdit(product: Product) {
    setEditing(product)
    setForm({ name: product.name, code: product.code, description: product.description, type: product.type, status: product.status, version: product.version, webhookUrl: product.webhookUrl || '' })
    setShowForm(true)
  }

  async function handleSave() {
    if (editing) {
      await api.updateProduct(editing.id, form)
      setShowForm(false)
      setToast({ show: true, message: 'Product updated successfully', type: 'success' })
    } else {
      const result = await api.createProduct(form)
      setShowForm(false)
      setNewApiKey(result.apiKey)
      setToast({ show: true, message: 'Product created successfully', type: 'success' })
    }
    load()
  }

  function copyKey() {
    if (!newApiKey) return
    navigator.clipboard.writeText(newApiKey.key)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleDelete() {
    if (!deleteId) return
    await api.deleteProduct(deleteId)
    setDeleteId(null)
    setToast({ show: true, message: 'Product deleted', type: 'success' })
    load()
  }

  if (loading) return <div className="space-y-4"><CardSkeleton /><TableSkeleton /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground text-sm">Manage your software products</p>
        </div>
        <Button onClick={openCreate}><Plus className="h-4 w-4 mr-2" />Create Product</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Features</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map(product => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="font-mono text-xs">{product.code}</TableCell>
                  <TableCell><Badge variant={product.type}>{product.type}</Badge></TableCell>
                  <TableCell>v{product.version}</TableCell>
                  <TableCell><Badge variant={product.status}>{product.status}</Badge></TableCell>
                  <TableCell>{product.features.length}</TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(product.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="sm" onClick={() => navigate(`/products/${product.id}`)}><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => openEdit(product)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => setDeleteId(product.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {products.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                    <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No products yet. Create your first product.</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Modal open={showForm} onClose={() => setShowForm(false)} title={editing ? 'Edit Product' : 'Create Product'}>
        <div className="space-y-4">
          <Input label="Product Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Enterprise ERP" />
          <Input label="Product Code" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} placeholder="ERP" />
          <TextArea label="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Product description..." />
          <Select label="Type" value={form.type} onChange={e => setForm({ ...form, type: e.target.value as any })} options={[
            { value: 'saas', label: 'SaaS' }, { value: 'desktop', label: 'Desktop' }, { value: 'api', label: 'API' },
          ]} />
          <Select label="Status" value={form.status} onChange={e => setForm({ ...form, status: e.target.value as any })} options={[
            { value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }, { value: 'development', label: 'Development' },
          ]} />
          <Input label="Version" value={form.version} onChange={e => setForm({ ...form, version: e.target.value })} placeholder="1.0.0" />
          <div>
            <Input label="Webhook URL" type="url" value={form.webhookUrl} onChange={e => setForm({ ...form, webhookUrl: e.target.value })} placeholder="https://api.yourdomain.com/webhook/license" />
            <p className="text-xs text-muted-foreground mt-1">Called on customer create &amp; payment confirm events</p>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editing ? 'Update' : 'Create'} Product</Button>
          </div>
        </div>
      </Modal>

      <Modal open={!!newApiKey} onClose={() => setNewApiKey(null)} title="Product API Key Generated">
        <div className="space-y-4">
          <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-4">
            <p className="text-sm text-amber-500 font-medium mb-1">Save this key — it won't be shown again.</p>
            <p className="text-xs text-amber-500/80">Use this API key to validate licenses for this product.</p>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-muted p-3">
            <Key className="h-4 w-4 text-muted-foreground shrink-0" />
            <code className="text-xs font-mono break-all flex-1">{newApiKey?.key}</code>
            <Button variant="ghost" size="sm" onClick={copyKey}>
              {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground font-medium mb-1">Decoded payload:</p>
            <code className="text-xs font-mono text-muted-foreground break-all">
              {newApiKey ? formatProductKeyPayload(newApiKey.key) : ''}
            </code>
          </div>
          <div className="flex justify-end pt-2">
            <Button onClick={() => setNewApiKey(null)}>Done</Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Product" message="Are you sure you want to delete this product? This action cannot be undone." confirmLabel="Delete" />
      <Toast {...toast} onClose={() => setToast({ ...toast, show: false })} />
    </div>
  )
}
