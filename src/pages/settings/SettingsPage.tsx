import React, { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal, Toast } from '@/components/ui/Dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import { CardSkeleton } from '@/components/ui/Skeleton'
import { Settings, Key, Copy, Check, Plus, Trash2 } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { ApiKey } from '@/types'

export function SettingsPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [loading, setLoading] = useState(true)
  const [showKeyForm, setShowKeyForm] = useState(false)
  const [keyName, setKeyName] = useState('')
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' })
  const [copiedKey, setCopiedKey] = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const keys = await api.getApiKeys()
    setApiKeys(keys)
    setLoading(false)
  }

  async function handleGenerate() {
    const newKey = await api.generateApiKey(keyName)
    setApiKeys([...apiKeys, newKey])
    setShowKeyForm(false)
    setKeyName('')
    setToast({ show: true, message: 'API key generated', type: 'success' })
  }

  async function handleDelete(id: string) {
    await api.deleteApiKey(id)
    setApiKeys(apiKeys.filter(k => k.id !== id))
    setToast({ show: true, message: 'API key deleted', type: 'success' })
  }

  function copyKey(key: string) {
    navigator.clipboard.writeText(key)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(''), 2000)
  }

  if (loading) return <div className="space-y-4"><CardSkeleton /><CardSkeleton /></div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-sm">Manage your account and API keys</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Company Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Company Name" defaultValue="LicenseHub Inc." />
            <Input label="Website" defaultValue="https://licensehub.io" />
            <Input label="Support Email" defaultValue="support@licensehub.io" />
            <Input label="Support Phone" defaultValue="+1 (555) 000-0000" />
          </div>
          <div className="flex justify-end">
            <Button>Save Changes</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">API Keys</CardTitle>
            <Button size="sm" onClick={() => setShowKeyForm(true)}><Plus className="h-4 w-4 mr-2" />Generate Key</Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>API Key</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Used</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apiKeys.map(ak => (
                <TableRow key={ak.id}>
                  <TableCell className="font-medium">{ak.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-muted-foreground">
                        {ak.key.slice(0, 20)}...
                      </span>
                      <button onClick={() => copyKey(ak.key)} className="text-muted-foreground hover:text-foreground">
                        {copiedKey === ak.key ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(ak.createdAt)}</TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(ak.lastUsed)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(ak.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Security Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Two-Factor Authentication</p>
              <p className="text-xs text-muted-foreground">Add an extra layer of security to your account</p>
            </div>
            <Button variant="outline" size="sm">Enable</Button>
          </div>
          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Session Timeout</p>
                <p className="text-xs text-muted-foreground">Automatically log out after inactivity</p>
              </div>
              <select className="rounded-lg border border-input bg-background px-3 py-1.5 text-sm">
                <option>30 minutes</option>
                <option>1 hour</option>
                <option>4 hours</option>
                <option>Never</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Modal open={showKeyForm} onClose={() => setShowKeyForm(false)} title="Generate API Key">
        <div className="space-y-4">
          <Input label="Key Name" value={keyName} onChange={e => setKeyName(e.target.value)} placeholder="Production API Key" />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setShowKeyForm(false)}>Cancel</Button>
            <Button onClick={handleGenerate}>Generate</Button>
          </div>
        </div>
      </Modal>

      <Toast {...toast} onClose={() => setToast({ ...toast, show: false })} />
    </div>
  )
}
