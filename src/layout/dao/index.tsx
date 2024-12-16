import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Bell, Menu, Moon, Sun } from 'lucide-react'
import { useState } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUpRight } from 'lucide-react'
import { cn } from "@/utils/class-merge"

export function Dashboard() {
  return (
    <div className="container py-10">
      <section className="mb-10 text-center">
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Connect to a{" "}
          <span className="bg-gradient-to-r from-[#C1F045] to-[#93E088] bg-clip-text text-transparent">
            New World
          </span>{" "}
          of dApps
        </h1>
        <p className="mx-auto max-w-[700px] text-lg text-muted-foreground">
          Seamless bridging and smart scaling for a truly interconnected
          blockchain ecosystem via Boba's Hybrid Compute
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Button size="lg">Start Bridging</Button>
          <Button variant="outline" size="lg">
            Trade
          </Button>
        </div>
      </section>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="assets">Assets</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Total Balance"
              value="$6,857.28"
              description="Across all chains"
            />
            <MetricCard
              title="BOBA Price"
              value="$0.2356"
              description="+0.22% (24h)"
              trend="up"
            />
            <MetricCard
              title="Active Bridges"
              value="24"
              description="Last 24 hours"
            />
            <MetricCard
              title="Gas Savings"
              value="$123.45"
              description="This month"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-7">
            <Card className="md:col-span-4">
              <CardHeader>
                <CardTitle>Portfolio Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[350px] rounded-lg bg-muted" />
              </CardContent>
            </Card>
            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center">
                      <div className="mr-4 h-8 w-8 rounded-full bg-primary/10" />
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          Bridge ETH
                        </p>
                        <p className="text-sm text-muted-foreground">
                          0.00038 ETH
                        </p>
                      </div>
                      <div className="ml-auto text-right text-sm">
                        <p className="font-medium">Completed</p>
                        <p className="text-muted-foreground">2 mins ago</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function MetricCard({ title, value, description, trend }: {
  title: string
  value: string
  description: string
  trend?: 'up' | 'down'
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {trend && (
          <ArrowUpRight className={cn(
            "h-4 w-4",
            trend === 'up' ? "text-green-500" : "text-red-500 transform rotate-180"
          )} />
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}



const navItems = [
  { name: 'Bridge', href: '#' },
  { name: 'Trade', href: '#' },
  { name: 'Smart Account', href: '#' },
  { name: 'History', href: '#' },
  { name: 'Stake', href: '#' },
  { name: 'DAO', href: '#' },
  { name: 'Ecosystem', href: '#' },
]

export function Layout({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false)

  return (
    <div className={cn("min-h-screen bg-background font-sans antialiased", isDarkMode && "dark")}>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 hidden md:flex">
            <a className="mr-6 flex items-center space-x-2" href="/">
              <img src="/placeholder.svg" alt="Logo" className="h-6 w-6" />
              <span className="hidden font-bold sm:inline-block">
                Boba Gateway
              </span>
            </a>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="transition-colors hover:text-foreground/80 text-foreground/60"
                >
                  {item.name}
                </a>
              ))}
            </nav>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <nav className="grid gap-6 text-lg font-medium">
                {navItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="transition-colors hover:text-foreground/80 text-foreground/60"
                  >
                    {item.name}
                  </a>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              <Input placeholder="Search..." className="max-w-[300px]" />
            </div>
            <Button variant="ghost" size="icon" className="mr-2">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle Theme"
              className="mr-6"
              onClick={() => setIsDarkMode(!isDarkMode)}
            >
              {isDarkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" className="gap-2">
                  0x8131...4E1f
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Disconnect</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  )
}

function DaoPage() {
  return (
    <Layout>
      <Dashboard />
    </Layout>
  )
}

export default DaoPage

