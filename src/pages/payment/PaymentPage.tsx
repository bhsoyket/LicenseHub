import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { api } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { CardSkeleton } from '@/components/ui/Skeleton'
import { ArrowLeft, CreditCard, Clock, Key, CheckCircle, Shield, DollarSign, Check, ChevronRight, Package } from 'lucide-react'
import { formatDate, cn } from '@/lib/utils'
import type { License, Package as PackageType } from '@/types'

type PaymentMethod = 'card' | 'custom'

export function PaymentPage() {
  const { licenseId } = useParams<{ licenseId: string }>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectUrl = searchParams.get('redirect') || '/licenses'
  const [license, setLicense] = useState<License | null>(null)
  const [packages, setPackages] = useState<PackageType[]>([])
  const [selectedPkg, setSelectedPkg] = useState<PackageType | null>(null)
  const [loading, setLoading] = useState(true)
  const [step, setStep] = useState<'package' | 'payment'>('package')
  const [submitting, setSubmitting] = useState(false)
  const [paymentResult, setPaymentResult] = useState<{ status: string; transactionId: string; method: PaymentMethod } | null>(null)

  // Card form
  const [cardForm, setCardForm] = useState({ name: '', cardNumber: '', expiry: '', cvv: '' })

  // Custom form
  const [customForm, setCustomForm] = useState({ name: '', transactionId: '' })
  const [customAmount, setCustomAmount] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card')

  useEffect(() => {
    if (!licenseId) return
    Promise.all([
      api.getLicense(licenseId),
      api.getPackages(),
    ]).then(([lic, pkgs]) => {
      if (!lic) { setLoading(false); return }
      setLicense(lic)
      const productPkgs = pkgs.filter(p => p.productId === lic.productId)
      setPackages(productPkgs)
      const current = productPkgs.find(p => p.id === lic.packageId) || productPkgs[0] || null
      setSelectedPkg(current)
      setLoading(false)
    })
  }, [licenseId])

  function getAmount(pkg: PackageType): number {
    if (!license) return 0
    if (pkg.type === 'custom' || pkg.type === 'free_trial') return license.amount
    if (license.type === 'yearly') return pkg.yearlyAmount
    return pkg.monthlyAmount
  }

  async function handlePackageNext() {
    if (!license || !selectedPkg) return
    const amount = getAmount(selectedPkg)
    await api.updateLicense(license.id, {
      packageId: selectedPkg.id,
      packageType: selectedPkg.type,
      amount,
      enabledFeatures: selectedPkg.features,
    })
    setLicense(prev => prev ? { ...prev, packageId: selectedPkg.id, packageType: selectedPkg.type, amount, enabledFeatures: selectedPkg.features } : prev)
    setStep('payment')
  }

  async function handleCardPay(e: React.FormEvent) {
    e.preventDefault()
    if (!license) return
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 1500))
    const payment = await api.createPayment({
      licenseId: license.id,
      licenseKey: license.licenseKey,
      productName: license.productName,
      customerName: license.customerName,
      amount: getAmount(selectedPkg!),
      currency: license.currency,
      transactionId: `TXN-CARD-${Date.now()}`,
      method: 'card',
    })
    setSubmitting(false)
    setPaymentResult({ status: payment.status, transactionId: payment.transactionId, method: 'card' })
  }

  async function handleCustomSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!license) return
    setSubmitting(true)
    const payment = await api.createPayment({
      licenseId: license.id,
      licenseKey: license.licenseKey,
      productName: license.productName,
      customerName: license.customerName,
      amount: customAmount ? Number((document.getElementById('custom-amount') as HTMLInputElement)?.value) || license.amount : getAmount(selectedPkg!),
      currency: license.currency,
      transactionId: customForm.transactionId || `TXN-CUSTOM-${Date.now()}`,
      method: 'custom',
    })
    setSubmitting(false)
    setPaymentResult({ status: payment.status, transactionId: payment.transactionId, method: 'custom' })
  }

  if (loading) return <div className="max-w-3xl mx-auto space-y-4 mt-8"><CardSkeleton /><CardSkeleton /></div>
  if (!license) return <div className="text-center py-20 text-muted-foreground">License not found</div>

  if (paymentResult) {
    const isApproved = paymentResult.status === 'approved'
    return (
      <div className="max-w-lg mx-auto mt-12">
        <Card className="text-center">
          <CardContent className="py-12 space-y-4">
            <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${isApproved ? 'bg-emerald-500/10' : 'bg-amber-500/10'}`}>
              {isApproved ? <CheckCircle className="h-8 w-8 text-emerald-500" /> : <Clock className="h-8 w-8 text-amber-500" />}
            </div>
            <CardTitle className="text-2xl">{isApproved ? 'Payment Successful' : 'Payment Submitted'}</CardTitle>
            <CardDescription>
              {isApproved
                ? `Your card payment of ${license.currency} ${getAmount(selectedPkg!)} for ${license.licenseKey} has been confirmed.`
                : `Your custom payment of ${license.currency} ${customAmount ? (document.getElementById('custom-amount') as HTMLInputElement)?.value || license.amount : getAmount(selectedPkg!)} for ${license.licenseKey} has been submitted and is awaiting approval.`
              }
            </CardDescription>
            <div className="rounded-lg bg-muted p-4 text-left text-sm space-y-2">
              <div className="flex justify-between"><span className="text-muted-foreground">License</span><span className="font-mono">{license.licenseKey}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Product</span><span>{license.productName}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Amount</span><span className="font-bold">{license.currency} {paymentResult.method === 'card' ? getAmount(selectedPkg!) : (customAmount ? (document.getElementById('custom-amount') as HTMLInputElement)?.value || license.amount : getAmount(selectedPkg!))}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Transaction ID</span><span className="font-mono text-xs">{paymentResult.transactionId}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Status</span><Badge variant={paymentResult.status}>{isApproved ? 'Active' : 'Pending Approval'}</Badge></div>
            </div>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => navigate(`/licenses/${license.id}`)}>View License</Button>
              <Button onClick={() => navigate('/admin/payments')}>View All Payments</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 mt-4">
      <Button variant="ghost" size="sm" onClick={() => navigate(redirectUrl)}><ArrowLeft className="h-4 w-4 mr-2" />Back</Button>

      {/* Steps indicator */}
      <div className="flex items-center gap-3 text-sm">
        <div className={`flex items-center gap-2 ${step === 'package' ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>
          <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${step === 'package' ? 'bg-primary text-primary-foreground' : step === 'payment' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-muted text-muted-foreground'}`}>
            {step === 'payment' ? <Check className="h-3.5 w-3.5" /> : '1'}
          </span>
          Choose Package
        </div>
        <div className="h-px flex-1 bg-border" />
        <div className={`flex items-center gap-2 ${step === 'payment' ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>
          <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${step === 'payment' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>2</span>
          Payment
        </div>
      </div>

      {step === 'package' ? (
        <>
          <div>
            <h2 className="text-xl font-bold tracking-tight">Select a Package</h2>
            <p className="text-sm text-muted-foreground">Choose a package for <strong>{license.productName}</strong></p>
          </div>

          <div className="grid gap-4">
            {packages.map(pkg => {
              const isCurrent = pkg.id === license.packageId
              const isSelected = selectedPkg?.id === pkg.id
              const amount = getAmount(pkg)
              return (
                <button
                  key={pkg.id}
                  type="button"
                  onClick={() => setSelectedPkg(pkg)}
                  className={cn(
                    'relative flex items-start gap-4 rounded-xl border-2 p-5 text-left transition-all text-sm',
                    isSelected ? 'border-primary bg-primary/5 shadow-sm' : 'border-border hover:border-primary/50',
                    isCurrent && !isSelected ? 'ring-1 ring-primary/30' : ''
                  )}
                >
                  {isCurrent && (
                    <span className="absolute -top-2.5 -right-2.5">
                      <Badge variant="active">Current</Badge>
                    </span>
                  )}
                  {isSelected && (
                    <span className="absolute top-3 right-3 text-primary">
                      <CheckCircle className="h-5 w-5" />
                    </span>
                  )}
                  <div className="flex-1 space-y-1">
                    <p className="font-semibold capitalize text-base">{pkg.type.replace('_', ' ')}</p>
                    <p className="text-muted-foreground">{pkg.features.length} features</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {pkg.features.map(f => (
                        <span key={f} className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium capitalize">
                          {f.replace(/_/g, ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-2xl font-bold">{license.currency} {amount}</p>
                    <p className="text-xs text-muted-foreground capitalize">/{license.type}</p>
                  </div>
                </button>
              )
            })}
          </div>

          <div className="flex justify-end">
            <Button onClick={handlePackageNext} disabled={!selectedPkg}>
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="md:col-span-3 space-y-6">
            {/* Method toggle */}
            <div className="flex gap-1 rounded-lg border p-1 bg-muted/30">
              {(['card', 'custom'] as const).map(m => (
                <button
                  key={m}
                  onClick={() => setPaymentMethod(m)}
                  className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors capitalize ${
                    paymentMethod === m ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {m === 'card' ? '💳 Card Payment' : '📄 Custom Payment'}
                </button>
              ))}
            </div>

            {paymentMethod === 'card' ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">Pay with Card</CardTitle>
                  </div>
                  <CardDescription>Enter your card information to complete payment — auto-approved</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCardPay} className="space-y-4">
                    <Input label="Cardholder Name" value={cardForm.name} onChange={e => setCardForm({ ...cardForm, name: e.target.value })} placeholder="John Doe" required />
                    <Input label="Card Number" value={cardForm.cardNumber} onChange={e => setCardForm({ ...cardForm, cardNumber: e.target.value })} placeholder="4242 4242 4242 4242" required />
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="Expiry Date" value={cardForm.expiry} onChange={e => setCardForm({ ...cardForm, expiry: e.target.value })} placeholder="MM/YY" required />
                      <Input label="CVV" value={cardForm.cvv} onChange={e => setCardForm({ ...cardForm, cvv: e.target.value })} placeholder="123" required />
                    </div>
                    <div className="flex items-center gap-2 rounded-lg bg-amber-500/10 p-3 text-xs text-amber-600">
                      <Shield className="h-4 w-4 shrink-0" />
                      <span>This is a mock payment. No real charges will be made.</span>
                    </div>
                    <Button type="submit" loading={submitting} className="w-full h-12 text-base">
                      Pay {license.currency} {getAmount(selectedPkg!)}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">Custom Payment</CardTitle>
                  </div>
                  <CardDescription>Submit a custom payment for admin approval</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCustomSubmit} className="space-y-4">
                    <Input label="Payer Name" value={customForm.name} onChange={e => setCustomForm({ ...customForm, name: e.target.value })} placeholder="John Doe" required />
                    <Input label="Transaction ID" value={customForm.transactionId} onChange={e => setCustomForm({ ...customForm, transactionId: e.target.value })} placeholder="TXN-123456789" />
                    <div className="rounded-lg bg-muted p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Amount</span>
                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                          <input type="checkbox" checked={customAmount} onChange={e => setCustomAmount(e.target.checked)} className="rounded border-input" />
                          Custom amount
                        </label>
                      </div>
                      {customAmount ? (
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <input
                            id="custom-amount"
                            type="number"
                            defaultValue={getAmount(selectedPkg!)}
                            className="pl-9 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            min={1}
                            required
                          />
                        </div>
                      ) : (
                        <p className="text-2xl font-bold">{license.currency} {getAmount(selectedPkg!)}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 rounded-lg bg-blue-500/10 p-3 text-xs text-blue-600">
                      <Clock className="h-4 w-4 shrink-0" />
                      <span>Custom payments require admin approval before activation.</span>
                    </div>
                    <Button type="submit" loading={submitting} className="w-full h-12 text-base">
                      Submit Payment
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="md:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                  <Key className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">License Key</p>
                    <p className="text-sm font-mono font-medium">{license.licenseKey}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Product</span><span>{license.productName}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Customer</span><span>{license.customerName}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Package</span><Badge variant={selectedPkg?.type}>{selectedPkg?.type.replace('_', ' ')}</Badge></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Type</span><Badge variant={license.type}>{license.type}</Badge></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Expires</span><span>{formatDate(license.expiryDate)}</span></div>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-base font-bold">
                    <span>Total</span>
                    <span>{license.currency} {getAmount(selectedPkg!)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
