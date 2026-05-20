import React, { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table'
import { CardSkeleton } from '@/components/ui/Skeleton'
import { CreditCard, CheckCircle, XCircle, Search } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { Payment } from '@/types'

export function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')

  useEffect(() => {
    api.getPayments().then(data => {
      setPayments(data)
      setLoading(false)
    })
  }, [])

  async function handleApprove(id: string) {
    await api.approvePayment(id)
    setPayments(prev => prev.map(p => p.id === id ? { ...p, status: 'approved', approvedAt: new Date().toISOString(), approvedBy: 'John Doe' } : p))
  }

  async function handleReject(id: string) {
    await api.rejectPayment(id)
    setPayments(prev => prev.map(p => p.id === id ? { ...p, status: 'rejected' } : p))
  }

  const filtered = payments.filter(p => {
    if (filter !== 'all' && p.status !== filter) return false
    if (!search) return true
    const q = search.toLowerCase()
    return p.licenseKey.toLowerCase().includes(q) ||
      p.productName.toLowerCase().includes(q) ||
      p.customerName.toLowerCase().includes(q) ||
      p.transactionId.toLowerCase().includes(q)
  })

  if (loading) return <div className="space-y-4"><CardSkeleton /><CardSkeleton /></div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Payments</h1>
        <p className="text-muted-foreground">Review and approve payment submissions</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search payments..."
            className="pl-9 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>
        <div className="flex gap-1 rounded-lg border p-1">
          {(['all', 'pending', 'approved', 'rejected'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors capitalize ${
                filter === f ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction</TableHead>
                <TableHead>License</TableHead>
                <TableHead>Product / Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No payments found
                  </TableCell>
                </TableRow>
              ) : filtered.map(p => (
                <TableRow key={p.id}>
                  <TableCell>
                    <p className="font-mono text-xs">{p.transactionId}</p>
                  </TableCell>
                  <TableCell>
                    <p className="font-mono text-xs">{p.licenseKey}</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">{p.productName}</p>
                    <p className="text-xs text-muted-foreground">{p.customerName}</p>
                  </TableCell>
                  <TableCell className="font-medium">{p.currency} {p.amount}</TableCell>
                  <TableCell>
                    <Badge variant={p.method === 'card' ? 'active' : 'pending'} className="capitalize">{p.method}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={p.status}>{p.status}</Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {formatDate(p.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    {p.status === 'pending' ? (
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleApprove(p.id)}>
                          <CheckCircle className="h-4 w-4 mr-1 text-emerald-500" />Approve
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleReject(p.id)}>
                          <XCircle className="h-4 w-4 mr-1 text-red-500" />Reject
                        </Button>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        {p.approvedBy ? `Approved by ${p.approvedBy}` : '-'}
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
