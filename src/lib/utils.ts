import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export function generateLicenseKey(productCode: string): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const segment1 = Array(4).fill(0).map(() => chars[Math.floor(Math.random() * chars.length)]).join('')
  const segment2 = Array(4).fill(0).map(() => chars[Math.floor(Math.random() * chars.length)]).join('')
  return `LIC-${productCode}-${segment1}-${new Date().getFullYear()}`
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    active: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    inactive: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
    suspended: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    revoked: 'bg-red-500/10 text-red-500 border-red-500/20',
    expired: 'bg-red-500/10 text-red-500 border-red-500/20',
    development: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    super_admin: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    admin: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    support: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
    customer_role: 'bg-green-500/10 text-green-500 border-green-500/20',
    free_trial: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    basic: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
    standard: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    custom: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    monthly: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    yearly: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    lifetime: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    approved: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    rejected: 'bg-red-500/10 text-red-500 border-red-500/20',
  }
  return colors[status] || 'bg-gray-500/10 text-gray-400 border-gray-500/20'
}

export function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}
