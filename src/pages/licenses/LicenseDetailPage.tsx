import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import { CardSkeleton } from '@/components/ui/Skeleton'
import { ArrowLeft, Key, Monitor, Copy, Check, CreditCard } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { License, Activation } from '@/types'

export function LicenseDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [license, setLicense] = useState<License | null>(null)
  const [activations, setActivations] = useState<Activation[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!id) return
    Promise.all([api.getLicense(id), api.getActivations(id)]).then(([lic, acts]) => {
      setLicense(lic || null)
      setActivations(acts)
      setLoading(false)
    })
  }, [id])

  function copyKey() {
    if (!license) return
    navigator.clipboard.writeText(license.licenseKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) return <div className="space-y-4"><CardSkeleton /><CardSkeleton /></div>
  if (!license) return <div className="text-center py-12 text-muted-foreground">License not found</div>

  const usagePercent = Math.round((license.activationsUsed / license.activationLimit) * 100)

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" onClick={() => navigate('/licenses')}><ArrowLeft className="h-4 w-4 mr-2" />Back</Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5 text-primary" />
                    {license.licenseKey}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{license.productName} &mdash; {license.customerName}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={license.packageType}>{license.packageType.replace('_', ' ')}</Badge>
                  <Button variant="outline" size="sm" onClick={copyKey}>
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? 'Copied' : 'Copy Key'}
                  </Button>
                  <Badge variant={license.status}>{license.status}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <Badge variant={license.type}>{license.type}</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="text-lg font-bold">{license.currency} {license.amount}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Expiry</p>
                  <p className="text-sm font-medium">{formatDate(license.expiryDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Activation Limit</p>
                  <p className="text-sm font-medium">{license.activationLimit}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Used</p>
                  <p className="text-sm font-medium">{license.activationsUsed}</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-muted-foreground mb-2">Usage ({usagePercent}%)</p>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${usagePercent}%` }} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Enabled Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {license.enabledFeatures.map(f => (
                  <Badge key={f} variant="active">{f}</Badge>
                ))}
                {license.enabledFeatures.length === 0 && (
                  <p className="text-sm text-muted-foreground">No features enabled</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Device Activations ({activations.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Device Name</TableHead>
                    <TableHead>Device ID</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Activated</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activations.map(act => (
                    <TableRow key={act.id}>
                      <TableCell className="font-medium">{act.deviceName}</TableCell>
                      <TableCell className="font-mono text-xs">{act.deviceId}</TableCell>
                      <TableCell className="font-mono text-xs">{act.ipAddress}</TableCell>
                      <TableCell className="text-muted-foreground">{formatDate(act.activatedAt)}</TableCell>
                      <TableCell><Badge variant={act.status}>{act.status}</Badge></TableCell>
                    </TableRow>
                  ))}
                  {activations.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        <Monitor className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No activations yet</p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">License Info</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Package</span><span className="capitalize">{license.packageType.replace('_', ' ')}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Created</span><span>{formatDate(license.createdAt)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Updated</span><span>{formatDate(license.updatedAt)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Product</span><span>{license.productName}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Customer</span><span>{license.customerName}</span></div>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Make a Payment</p>
                  <p className="text-xs text-muted-foreground">{license.currency} {license.amount} due</p>
                </div>
                <Button size="sm" onClick={() => window.open(`/pay/${license.id}`, '_blank')}>
                  <CreditCard className="h-4 w-4 mr-1" />Pay Now
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Validation Info</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-lg bg-emerald-500/10 p-3">
                <p className="text-xs text-emerald-500 font-medium">POST /api/license/validate</p>
                <p className="text-sm mt-1">Valid: true</p>
              </div>
              <div className="text-xs text-muted-foreground bg-muted p-3 rounded-lg font-mono leading-relaxed whitespace-pre">
{`curl -X POST https://api.licensehub.io/api/license/validate \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{"license_key": "LIC-XXXX-0000"}'`}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
