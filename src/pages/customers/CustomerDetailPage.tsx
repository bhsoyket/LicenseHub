import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import { CardSkeleton } from '@/components/ui/Skeleton'
import { ArrowLeft, Building2, Mail, Phone, MapPin } from 'lucide-react'
import { formatDate, getStatusColor } from '@/lib/utils'
import type { Customer, License } from '@/types'

export function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [licenses, setLicenses] = useState<License[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    Promise.all([api.getCustomer(id), api.getLicenses()]).then(([cust, allLicenses]) => {
      setCustomer(cust || null)
      setLicenses(allLicenses.filter(l => l.customerId === id))
      setLoading(false)
    })
  }, [id])

  if (loading) return <div className="space-y-4"><CardSkeleton /><CardSkeleton /></div>
  if (!customer) return <div className="text-center py-12 text-muted-foreground">Customer not found</div>

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" onClick={() => navigate('/customers')}><ArrowLeft className="h-4 w-4 mr-2" />Back</Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{customer.companyName}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{customer.contactPerson}</p>
                </div>
                <Badge variant={customer.status}>{customer.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm"><Mail className="h-4 w-4 text-muted-foreground" />{customer.email}</div>
              <div className="flex items-center gap-2 text-sm"><Phone className="h-4 w-4 text-muted-foreground" />{customer.phone}</div>
              <div className="flex items-center gap-2 text-sm"><MapPin className="h-4 w-4 text-muted-foreground" />{customer.address}</div>
              <p className="text-xs text-muted-foreground pt-2">Customer since {formatDate(customer.createdAt)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Licenses ({licenses.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>License Key</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Expiry</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {licenses.map(lic => (
                    <TableRow key={lic.id} className="cursor-pointer" onClick={() => navigate(`/licenses/${lic.id}`)}>
                      <TableCell className="font-mono text-xs">{lic.licenseKey}</TableCell>
                      <TableCell>{lic.productName}</TableCell>
                      <TableCell><Badge variant={lic.type}>{lic.type}</Badge></TableCell>
                      <TableCell><Badge variant={lic.status}>{lic.status}</Badge></TableCell>
                      <TableCell className="text-muted-foreground">{formatDate(lic.expiryDate)}</TableCell>
                    </TableRow>
                  ))}
                  {licenses.length === 0 && (
                    <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No licenses assigned</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle className="text-base">Quick Stats</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-blue-500/10 p-4">
              <p className="text-sm text-muted-foreground">Total Licenses</p>
              <p className="text-2xl font-bold text-blue-500">{licenses.length}</p>
            </div>
            <div className="rounded-lg bg-emerald-500/10 p-4">
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-bold text-emerald-500">{licenses.filter(l => l.status === 'active').length}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
