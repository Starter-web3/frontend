import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Upload, Coins } from "lucide-react"
import DashBoardLayout from '../DashboardLayout';

export default function Home() {
  return (
    <DashBoardLayout>
      <div className="bg-#201726 text-purple-100">
      {/* <header className="border-b border-purple-500/20 p-4">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coins className="h-6 w-6" />
            <span className="text-xl font-bold">StrataForge</span>
          </div>
          <Button variant="outline" className="border-purple-500 text-purple-100 hover:bg-purple-500/10">
            <Coins className="mr-2 h-4 w-4" />
            0x1234...5678
          </Button>
        </div>
      </header> */}

      <main className="container py-12">
        <h1 className="mb-8 text-center text-3xl font-bold">Airdrop Management</h1>

        <div className="grid gap-8 md:grid-cols-2">
          <Card className="bg-zinc-900 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-purple-100">Upload Recipients</CardTitle>
              <CardDescription className="text-purple-100/70">
                Upload CSV files with recipient addresses and amounts
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <Upload className="h-16 w-16 mb-4 text-purple-400" />
              <p className="mb-6 text-center text-purple-100/70">Manage your recipient lists by uploading CSV files</p>
              <Link href="/dashboard/airdrop-listing/upload" className="w-full">
                <Button className="w-full bg-purple-500 hover:bg-purple-600 text-black">
                  Manage Recipients
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-purple-100">Distribute Tokens</CardTitle>
              <CardDescription className="text-purple-100/70">
                Configure and execute your airdrop distribution
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <Coins className="h-16 w-16 mb-4 text-purple-400" />
              <p className="mb-6 text-center text-purple-100/70">
                Set up distribution parameters and execute your airdrop
              </p>
              <Link href="/dashboard/airdrop-listing/distribute" className="w-full">
                <Button className="w-full bg-purple-500 hover:bg-purple-600 text-black">
                  Configure Distribution
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
    </DashBoardLayout>
    
  )
}
