import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '@/lib/api'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Input, TextArea, Select } from '@/components/ui/Input'
import { Modal, ConfirmDialog, Toast } from '@/components/ui/Dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import { CardSkeleton, TableSkeleton } from '@/components/ui/Skeleton'
import { Plus, Pencil, Trash2, Eye, Users, Building2 } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { Customer } from '@/types'

export function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Customer | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' })
  const navigate = useNavigate()

  const [form, setForm] = useState({ companyName: '', contactPerson: '', email: '', phone: '', address: '', status: 'active' as Customer['status'] })

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const data = await api.getCustomers()
    setCustomers(data)
    setLoading(false)
  }

  function openCreate() {
    setEditing(null)
    setForm({ companyName: '', contactPerson: '', email: '', phone: '', address: '', status: 'active' })
    setShowForm(true)
  }

  function openEdit(customer: Customer) {
    setEditing(customer)
    setForm({ companyName: customer.companyName, contactPerson: customer.contactPerson, email: customer.email, phone: customer.phone, address: customer.address, status: customer.status })
    setShowForm(true)
  }

  async function handleSave() {
    if (editing) {
      await api.updateCustomer(editing.id, form)
    } else {
      await api.createCustomer(form)
    }
    setShowForm(false)
    setToast({ show: true, message: `Customer ${editing ? 'updated' : 'created'}`, type: 'success' })
    load()
  }

  async function handleDelete() {
    if (!deleteId) return
    await api.deleteCustomer(deleteId)
    setDeleteId(null)
    setToast({ show: true, message: 'Customer deleted', type: 'success' })
    load()
  }

  if (loading) return <div className="space-y-4"><CardSkeleton /><TableSkeleton /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
          <p className="text-muted-foreground text-sm">Manage your customer companies</p>
        </div>
        <Button onClick={openCreate}><Plus className="h-4 w-4 mr-2" />Add Customer</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Contact Person</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map(customer => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.companyName}</TableCell>
                  <TableCell>{customer.contactPerson}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell><Badge variant={customer.status}>{customer.status}</Badge></TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(customer.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="sm" onClick={() => navigate(`/customers/${customer.id}`)}><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => openEdit(customer)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => setDeleteId(customer.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {customers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                    <Building2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No customers yet</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Modal open={showForm} onClose={() => setShowForm(false)} title={editing ? 'Edit Customer' : 'Add Customer'}>
        <div className="space-y-4">
          <Input label="Company Name" value={form.companyName} onChange={e => setForm({ ...form, companyName: e.target.value })} placeholder="Acme Corp" />
          <Input label="Contact Person" value={form.contactPerson} onChange={e => setForm({ ...form, contactPerson: e.target.value })} placeholder="John Smith" />
          <Input label="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="john@acme.com" />
          <Input label="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+1 (555) 123-4567" />
          <TextArea label="Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="123 Business Ave" />
          <Select label="Status" value={form.status} onChange={e => setForm({ ...form, status: e.target.value as any })} options={[
            { value: 'active', label: 'Active' }, { value: 'suspended', label: 'Suspended' }, { value: 'inactive', label: 'Inactive' },
          ]} />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editing ? 'Update' : 'Create'} Customer</Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Customer" message="Are you sure you want to delete this customer?" confirmLabel="Delete" />
      <Toast {...toast} onClose={() => setToast({ ...toast, show: false })} />
    </div>
  )
}
