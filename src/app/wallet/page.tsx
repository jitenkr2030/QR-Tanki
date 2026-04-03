'use client'

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Wallet, 
  Plus, 
  Minus, 
  ArrowUpRight, 
  ArrowDownRight, 
  CreditCard, 
  IndianRupee, 
  History, 
  Download,
  ArrowLeft,
  Settings,
  Eye,
  Shield,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  PiggyBank,
  Receipt,
  Droplets
} from "lucide-react"
import { signOut } from "next-auth/react"
import { NotificationCenter } from "@/components/notifications"
import { MobileNav } from "@/components/mobile-nav"

interface Wallet {
  id: string
  balance: number
  currency: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface Transaction {
  id: string
  type: string
  amount: number
  description?: string
  referenceId?: string
  referenceType?: string
  status: string
  createdAt: string
}

interface EscrowAccount {
  id: string
  amount: number
  status: string
  releasedAt?: string
  refundedAt?: string
  releaseReason?: string
  createdAt: string
}

export default function WalletPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [escrowAccounts, setEscrowAccounts] = useState<EscrowAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddFunds, setShowAddFunds] = useState(false)
  const [showWithdraw, setShowWithdraw] = useState(false)
  const [addFundsData, setAddFundsData] = useState({
    amount: "",
    paymentMethod: "UPI",
    description: ""
  })
  const [withdrawData, setWithdrawData] = useState({
    amount: "",
    bankAccount: "",
    description: ""
  })

  useEffect(() => {
    if (status === "loading") return
    
    if (!session) {
      router.push('/auth/signin')
      return
    }

    if (session.user.role !== 'USER') {
      router.push(session.user.role === 'ADMIN' ? '/admin' : '/cleaner')
      return
    }

    loadWalletData()
  }, [session, status, router])

  const loadWalletData = async () => {
    try {
      // Mock data for demo
      const mockWallet: Wallet = {
        id: "wallet1",
        balance: 2500.50,
        currency: "INR",
        isActive: true,
        createdAt: "2024-01-01",
        updatedAt: "2024-01-25"
      }

      const mockTransactions: Transaction[] = [
        {
          id: "txn1",
          type: "CREDIT",
          amount: 500,
          description: "Earning from cleaning service",
          referenceId: "earning1",
          referenceType: "EARNING",
          status: "COMPLETED",
          createdAt: "2024-01-25T10:00:00Z"
        },
        {
          id: "txn2",
          type: "DEBIT",
          amount: 299,
          description: "Payment for subscription",
          referenceId: "payment1",
          referenceType: "PAYMENT",
          status: "COMPLETED",
          createdAt: "2024-01-24T14:30:00Z"
        },
        {
          id: "txn3",
          type: "CREDIT",
          amount: 1500,
          description: "Refund for cancelled booking",
          referenceId: "refund1",
          referenceType: "REFUND",
          status: "COMPLETED",
          createdAt: "2024-01-23T09:15:00Z"
        },
        {
          id: "txn4",
          type: "DEBIT",
          amount: 699,
          description: "Payment for emergency service",
          referenceId: "emergency1",
          referenceType: "PAYMENT",
          status: "COMPLETED",
          createdAt: "2024-01-22T16:45:00Z"
        },
        {
          id: "txn5",
          type: "CREDIT",
          amount: 100,
          description: "Reward points redemption",
          referenceId: "reward1",
          referenceType: "REWARD",
          status: "COMPLETED",
          createdAt: "2024-01-21T11:20:00Z"
        }
      ]

      const mockEscrowAccounts: EscrowAccount[] = [
        {
          id: "escrow1",
          amount: 999,
          status: "HELD",
          createdAt: "2024-01-25T12:00:00Z"
        },
        {
          id: "escrow2",
          amount: 499,
          status: "RELEASED",
          releasedAt: "2024-01-24T15:30:00Z",
          releaseReason: "Service completed successfully",
          createdAt: "2024-01-23T10:00:00Z"
        }
      ]

      setWallet(mockWallet)
      setTransactions(mockTransactions)
      setEscrowAccounts(mockEscrowAccounts)
    } catch (error) {
      console.error("Failed to load wallet data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  const handleAddFunds = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!addFundsData.amount || parseFloat(addFundsData.amount) <= 0) {
      alert("Please enter a valid amount")
      return
    }

    try {
      const response = await fetch('/api/wallet/add-funds', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(addFundsData.amount),
          paymentMethod: addFundsData.paymentMethod,
          description: addFundsData.description
        })
      })

      const result = await response.json()

      if (!response.ok) {
        alert(result.error || 'Failed to add funds')
        return
      }

      alert('Funds added successfully!')
      setShowAddFunds(false)
      setAddFundsData({ amount: "", paymentMethod: "UPI", description: "" })
      loadWalletData()
    } catch (error) {
      alert("An error occurred. Please try again.")
    }
  }

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!withdrawData.amount || parseFloat(withdrawData.amount) <= 0) {
      alert("Please enter a valid amount")
      return
    }

    if (!withdrawData.bankAccount) {
      alert("Please enter bank account details")
      return
    }

    if (wallet && parseFloat(withdrawData.amount) > wallet.balance) {
      alert("Insufficient balance")
      return
    }

    try {
      const response = await fetch('/api/wallet/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(withdrawData.amount),
          bankAccount: withdrawData.bankAccount,
          description: withdrawData.description
        })
      })

      const result = await response.json()

      if (!response.ok) {
        alert(result.error || 'Failed to withdraw funds')
        return
      }

      alert('Withdrawal request submitted successfully!')
      setShowWithdraw(false)
      setWithdrawData({ amount: "", bankAccount: "", description: "" })
      loadWalletData()
    } catch (error) {
      alert("An error occurred. Please try again.")
    }
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'CREDIT': return <ArrowDownRight className="w-4 h-4 text-green-600" />
      case 'DEBIT': return <ArrowUpRight className="w-4 h-4 text-red-600" />
      case 'TRANSFER': return <ArrowUpRight className="w-4 h-4 text-blue-600" />
      case 'WITHDRAWAL': return <ArrowUpRight className="w-4 h-4 text-orange-600" />
      default: return <IndianRupee className="w-4 h-4 text-gray-600" />
    }
  }

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'CREDIT': return 'text-green-600'
      case 'DEBIT': return 'text-red-600'
      case 'TRANSFER': return 'text-blue-600'
      case 'WITHDRAWAL': return 'text-orange-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'default'
      case 'PENDING': return 'secondary'
      case 'FAILED': return 'destructive'
      default: return 'secondary'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const downloadStatement = () => {
    // Mock download functionality
    const statementData = {
      wallet: wallet,
      transactions: transactions,
      escrowAccounts: escrowAccounts,
      generatedAt: new Date().toISOString()
    }

    const dataStr = JSON.stringify(statementData, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `wallet-statement-${new Date().toISOString().split('T')[0]}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50 safe-area-padding">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Droplets className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900 hidden sm:block">QR Tanki</span>
                <span className="text-lg font-bold text-gray-900 sm:hidden">QT</span>
              </Link>
              <nav className="hidden md:flex items-center space-x-6">
                <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</Link>
                <Link href="/tanks" className="text-gray-600 hover:text-gray-900">My Tanks</Link>
                <Link href="/bookings" className="text-gray-600 hover:text-gray-900">Bookings</Link>
                <Link href="/society" className="text-gray-600 hover:text-gray-900">Society</Link>
                <Link href="/emergency" className="text-gray-600 hover:text-gray-900">Emergency</Link>
                <Link href="/wallet" className="text-blue-600 font-medium">Wallet</Link>
                <Link href="/subscriptions" className="text-gray-600 hover:text-gray-900">Subscriptions</Link>
              </nav>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <MobileNav userId={session.user.id} />
              <NotificationCenter userId={session.user.id} />
              <Button variant="ghost" size="sm" className="hidden sm:flex">
                <Settings className="w-4 h-4" />
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600">
                    {session.user.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm font-medium hidden sm:block">{session.user.name}</span>
              </div>
              <Button variant="ghost" size="sm" className="hidden sm:flex" onClick={handleSignOut}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Digital Wallet
            </h1>
            <p className="text-gray-600">
              Manage your funds, transactions, and payments
            </p>
          </div>
          <div className="flex space-x-2">
            <Button onClick={downloadStatement} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download Statement
            </Button>
            <Button onClick={() => setShowAddFunds(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Funds
            </Button>
            <Button onClick={() => setShowWithdraw(true)} variant="outline">
              <ArrowUpRight className="w-4 h-4 mr-2" />
              Withdraw
            </Button>
          </div>
        </div>

        {/* Wallet Balance Card */}
        {wallet && (
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Wallet className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Available Balance</h3>
                    <p className="text-sm text-gray-600">Digital Wallet</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900">
                    ₹{wallet.balance.toFixed(2)}
                  </div>
                  <p className="text-sm text-gray-600">{wallet.currency}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <CardTitle className="text-sm font-medium">Total Credits</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹2,100</div>
              <p className="text-xs text-muted-foreground">
                This month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-red-600" />
                <CardTitle className="text-sm font-medium">Total Debits</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹1,498</div>
              <p className="text-xs text-muted-foreground">
                This month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-blue-600" />
                <CardTitle className="text-sm font-medium">Escrow Balance</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹1,498</div>
              <p className="text-xs text-muted-foreground">
                Held in escrow
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-2">
                <PiggyBank className="h-4 w-4 text-purple-600" />
                <CardTitle className="text-sm font-medium">Total Savings</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹602</div>
              <p className="text-xs text-muted-foreground">
                Available balance
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="transactions" className="space-y-6">
          <TabsList>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="escrow">Escrow</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>
                  Your wallet transaction history
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-full ${getTransactionColor(transaction.type)} bg-opacity-10`}>
                          {getTransactionIcon(transaction.type)}
                        </div>
                        <div>
                          <h4 className="font-medium">{transaction.description}</h4>
                          <p className="text-sm text-gray-600">
                            {transaction.referenceType && `(${transaction.referenceType})`}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className={`font-bold ${getTransactionColor(transaction.type)}`}>
                          {transaction.type === 'CREDIT' ? '+' : '-'}₹{transaction.amount}
                        </div>
                        <p className="text-xs text-gray-600">{formatDate(transaction.createdAt)}</p>
                        <Badge variant={getStatusColor(transaction.status)} className="mt-1">
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="escrow" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Escrow Accounts</CardTitle>
                <CardDescription>
                  Funds held in escrow until service completion
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {escrowAccounts.map((escrow) => (
                    <div key={escrow.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Shield className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">Escrow Account</h4>
                            <p className="text-sm text-gray-600">
                              ID: {escrow.id.slice(0, 8)}...
                            </p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600">₹{escrow.amount}</div>
                          <Badge variant={getStatusColor(escrow.status)} className="mt-1">
                            {escrow.status}
                          </Badge>
                        </div>
                      </div>

                      {escrow.status === 'RELEASED' && escrow.releasedAt && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <div className="flex items-center space-x-2 text-green-800">
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-sm font-medium">
                              Released on {formatDate(escrow.releasedAt)}
                            </span>
                          </div>
                          {escrow.releaseReason && (
                            <p className="text-xs text-green-600 mt-1">
                              Reason: {escrow.releaseReason}
                            </p>
                          )}
                        </div>
                      )}

                      {escrow.status === 'REFUNDED' && escrow.refundedAt && (
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                          <div className="flex items-center space-x-2 text-orange-800">
                            <AlertCircle className="w-4 h-4" />
                            <span className="text-sm font-medium">
                              Refunded on {formatDate(escrow.refundedAt)}
                            </span>
                          </div>
                        </div>
                      )}

                      {escrow.status === 'HELD' && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                          <div className="flex items-center space-x-2 text-yellow-800">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm font-medium">
                              Funds held in escrow
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Spending</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">January</span>
                      <span className="font-medium">₹2,500</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">February</span>
                      <span className="font-medium">₹1,800</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">March</span>
                      <span className="font-medium">₹3,200</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Transaction Types</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Earnings</span>
                      <span className="font-medium text-green-600">₹1,500</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Payments</span>
                      <span className="font-medium text-red-600">₹2,000</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Refunds</span>
                      <span className="font-medium text-green-600">₹500</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Rewards</span>
                      <span className="font-medium text-green-600">₹200</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Add Funds Modal */}
      {showAddFunds && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Add Funds to Wallet</CardTitle>
              <CardDescription>
                Add money to your digital wallet for easy payments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddFunds} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (₹)</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="1"
                    value={addFundsData.amount}
                    onChange={(e) => setAddFundsData(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="Enter amount"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Payment Method</Label>
                  <Select 
                    value={addFundsData.paymentMethod}
                    onValueChange={(value) => setAddFundsData(prev => ({ ...prev, paymentMethod: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UPI">UPI</SelectItem>
                      <SelectItem value="CARD">Credit/Debit Card</SelectItem>
                      <SelectItem value="NETBANKING">Net Banking</SelectItem>
                      <SelectItem value="CASH">Cash</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    value={addFundsData.description}
                    onChange={(e) => setAddFundsData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Add a note for this transaction"
                    rows={2}
                  />
                </div>

                <div className="flex space-x-2">
                  <Button type="submit" className="flex-1">
                    Add Funds
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowAddFunds(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdraw && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Withdraw Funds</CardTitle>
              <CardDescription>
                Withdraw money from your digital wallet
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleWithdraw} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="withdrawAmount">Amount (₹)</Label>
                  <Input
                    id="withdrawAmount"
                    type="number"
                    step="0.01"
                    min="1"
                    max={wallet?.balance}
                    value={withdrawData.amount}
                    onChange={(e) => setWithdrawData(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="Enter amount"
                    required
                  />
                  {wallet && (
                    <p className="text-sm text-gray-600">
                      Available balance: ₹{wallet.balance.toFixed(2)}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bankAccount">Bank Account</Label>
                  <Input
                    id="bankAccount"
                    value={withdrawData.bankAccount}
                    onChange={(e) => setWithdrawData(prev => ({ ...prev, bankAccount: e.target.value }))}
                    placeholder="Enter bank account number"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="withdrawDescription">Description (Optional)</Label>
                  <Textarea
                    id="withdrawDescription"
                    value={withdrawData.description}
                    onChange={(e) => setWithdrawData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Add a note for this withdrawal"
                    rows={2}
                  />
                </div>

                <div className="flex space-x-2">
                  <Button type="submit" className="flex-1">
                    Withdraw
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowWithdraw(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}