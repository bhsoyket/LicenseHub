import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Tabs } from '@/components/ui/Tabs'
import { FileJson, Copy, Check } from 'lucide-react'

const endpoints = [
  {
    method: 'POST',
    path: '/api/license/validate',
    description: 'Validate a license key and return its status and enabled features.',
    response: `{
  "valid": true,
  "license_key": "LIC-ERP-A1B2-2026",
  "status": "active",
  "expires_at": "2027-01-15T00:00:00Z",
  "features": {
    "hrm": true,
    "payroll": true,
    "inventory": true,
    "reporting": false
  }
}`,
    curl: `curl -X POST https://api.licensehub.io/api/license/validate \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"license_key": "LIC-ERP-A1B2-2026"}'`,
  },
  {
    method: 'POST',
    path: '/api/license/activate',
    description: 'Activate a license on a device. Returns activation details.',
    response: `{
  "success": true,
  "activation_id": "act_001",
  "device_name": "Server-Prod-01",
  "device_id": "DEV-001",
  "activated_at": "2026-05-18T00:00:00Z",
  "activations_remaining": 9
}`,
    curl: `curl -X POST https://api.licensehub.io/api/license/activate \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "license_key": "LIC-ERP-A1B2-2026",
    "device_name": "Server-Prod-01",
    "device_id": "DEV-001"
  }'`,
  },
  {
    method: 'POST',
    path: '/api/license/deactivate',
    description: 'Deactivate a license on a device, freeing up an activation slot.',
    response: `{
  "success": true,
  "message": "Device deactivated successfully",
  "activation_id": "act_001",
  "activations_remaining": 10
}`,
    curl: `curl -X POST https://api.licensehub.io/api/license/deactivate \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "license_key": "LIC-ERP-A1B2-2026",
    "activation_id": "act_001"
  }'`,
  },
]

export function ApiPage() {
  const [activeTab, setActiveTab] = useState(endpoints[0].path)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const currentEndpoint = endpoints.find(e => e.path === activeTab) || endpoints[0]

  function copyToClipboard(text: string, index: number) {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">API Console</h1>
        <p className="text-muted-foreground text-sm">Validate, activate, and deactivate licenses via API</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">API Endpoints</CardTitle>
          <CardDescription>Use these endpoints to integrate license validation into your products</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            tabs={endpoints.map(e => ({ id: e.path, label: `${e.method} ${e.path}` }))}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            className="mb-6"
          />

          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={currentEndpoint.method === 'POST' ? 'active' : 'basic'}>{currentEndpoint.method}</Badge>
                <code className="text-sm font-mono">{currentEndpoint.path}</code>
              </div>
              <p className="text-sm text-muted-foreground">{currentEndpoint.description}</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium">cURL Example</h3>
                <Button variant="ghost" size="sm" onClick={() => {
                  const idx = endpoints.indexOf(currentEndpoint)
                  copyToClipboard(currentEndpoint.curl, idx)
                }}>
                  {copiedIndex === endpoints.indexOf(currentEndpoint) ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                  Copy
                </Button>
              </div>
              <pre className="rounded-lg bg-muted p-4 overflow-x-auto text-sm font-mono">
                <code>{currentEndpoint.curl}</code>
              </pre>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium">Response</h3>
              </div>
              <pre className="rounded-lg bg-muted p-4 overflow-x-auto text-sm font-mono">
                <code>{currentEndpoint.response}</code>
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Authentication</CardTitle>
          <CardDescription>All API requests require authentication via API key</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-4">
            <p className="text-sm font-medium text-amber-500 mb-1">Authorization Header</p>
            <p className="text-sm text-amber-500/80">Include your API key in the Authorization header:</p>
            <pre className="mt-2 text-sm font-mono">Authorization: Bearer lhub_sk_your_api_key_here</pre>
          </div>
          <p className="text-sm text-muted-foreground">
            Generate your API keys in the{' '}
            <a href="/settings" className="text-primary hover:underline">Settings</a> page.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
