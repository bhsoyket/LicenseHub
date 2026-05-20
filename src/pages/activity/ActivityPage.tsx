import React, { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import { CardSkeleton, TableSkeleton } from '@/components/ui/Skeleton'
import { Input } from '@/components/ui/Input'
import { Activity, Search } from 'lucide-react'
import { formatDate } from '@/lib/utils'

const eventColors: Record<string, string> = {
  'License Created': 'active',
  'License Activated': 'active',
  'Device Revoked': 'revoked',
  'License Suspended': 'suspended',
  'Login': 'basic',
  'License Renewed': 'active',
  'Customer Created': 'active',
  'Customer Suspended': 'suspended',
  'Product Created': 'active',
}

export function ActivityPage() {
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    api.getActivityLogs().then(data => {
      setLogs(data)
      setLoading(false)
    })
  }, [])

  const filtered = logs.filter(log =>
    log.event.toLowerCase().includes(search.toLowerCase()) ||
    log.description.toLowerCase().includes(search.toLowerCase()) ||
    log.userName.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <div className="space-y-4"><CardSkeleton /><TableSkeleton /></div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Activity Logs</h1>
        <p className="text-muted-foreground text-sm">Track all events across the platform</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          className="flex h-10 w-full rounded-lg border border-input bg-background pl-9 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="Search activity..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Resource</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(log => (
                <TableRow key={log.id}>
                  <TableCell>
                    <Badge variant={eventColors[log.event] || 'basic'}>{log.event}</Badge>
                  </TableCell>
                  <TableCell className="max-w-md truncate">{log.description}</TableCell>
                  <TableCell>{log.userName}</TableCell>
                  <TableCell className="text-muted-foreground capitalize">{log.resourceType}</TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(log.createdAt)}</TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                    <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>{search ? 'No matching activity' : 'No activity logs yet'}</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
