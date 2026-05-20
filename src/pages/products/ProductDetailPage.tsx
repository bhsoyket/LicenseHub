import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import { CardSkeleton } from '@/components/ui/Skeleton'
import { ArrowLeft, Key, Copy, Check } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { Product, ApiKey } from '@/types'

function decodeKeyPayload(key: string): string {
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

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [product, setProduct] = useState<Product | null>(null)
  const [apiKey, setApiKey] = useState<ApiKey | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!id) return
    Promise.all([api.getProduct(id), api.getApiKeys()]).then(([prod, keys]) => {
      setProduct(prod || null)
      setApiKey(keys.find(k => k.name === `${prod?.code} Auto Key`) || null)
      setLoading(false)
    })
  }, [id])

  function copyKey() {
    if (!apiKey) return
    navigator.clipboard.writeText(apiKey.key)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) return <div className="space-y-4"><CardSkeleton /><CardSkeleton /></div>
  if (!product) return <div className="text-center py-12 text-muted-foreground">Product not found</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/products')}><ArrowLeft className="h-4 w-4 mr-2" />Back</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-sm text-muted-foreground">Code</p><p className="font-mono text-sm">{product.code}</p></div>
                <div><p className="text-sm text-muted-foreground">Version</p><p>v{product.version}</p></div>
                <div><p className="text-sm text-muted-foreground">Type</p><Badge variant={product.type}>{product.type}</Badge></div>
                <div><p className="text-sm text-muted-foreground">Status</p><Badge variant={product.status}>{product.status}</Badge></div>
                <div><p className="text-sm text-muted-foreground">Created</p><p className="text-sm">{formatDate(product.createdAt)}</p></div>
                <div><p className="text-sm text-muted-foreground">Updated</p><p className="text-sm">{formatDate(product.updatedAt)}</p></div>
              </div>
              <div><p className="text-sm text-muted-foreground mb-1">Description</p><p className="text-sm">{product.description}</p></div>
              {product.webhookUrl && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Webhook URL</p>
                  <div className="flex items-center gap-2 rounded-lg bg-muted p-3">
                    <code className="text-xs font-mono break-all">{product.webhookUrl}</code>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Called on customer create &amp; payment confirm events</p>
                </div>
              )}
            </CardContent>
          </Card>

          {apiKey && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  API Key
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 rounded-lg bg-muted p-3">
                  <code className="text-xs font-mono break-all flex-1">{apiKey.key}</code>
                  <Button variant="ghost" size="sm" onClick={copyKey}>
                    {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground font-medium mb-1">Decoded payload:</p>
                  <code className="text-xs font-mono text-muted-foreground break-all">{decodeKeyPayload(apiKey.key)}</code>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Feature Flags</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Key</TableHead>
                    <TableHead>Default</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {product.features.map(f => (
                    <TableRow key={f.id}>
                      <TableCell className="font-medium">{f.name}</TableCell>
                      <TableCell className="font-mono text-xs">{f.key}</TableCell>
                      <TableCell><Badge variant={f.enabledDefault ? 'active' : 'inactive'}>{f.enabledDefault ? 'Enabled' : 'Disabled'}</Badge></TableCell>
                    </TableRow>
                  ))}
                  {product.features.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">No feature flags configured</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-blue-500/10 p-4">
                <p className="text-sm text-muted-foreground">Feature Flags</p>
                <p className="text-2xl font-bold text-blue-500">{product.features.length}</p>
              </div>
              <div className="rounded-lg bg-emerald-500/10 p-4">
                <p className="text-sm text-muted-foreground">Active Licenses</p>
                <p className="text-2xl font-bold text-emerald-500">--</p>
              </div>
              <div className="rounded-lg bg-purple-500/10 p-4">
                <p className="text-sm text-muted-foreground">Packages</p>
                <p className="text-2xl font-bold text-purple-500">--</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
