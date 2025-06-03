'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ethers } from 'ethers';
import { useWallet } from '../../../../contexts/WalletContext';
import { useReadContract } from 'wagmi';
import { Button } from '../../../../../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../../../components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../../../components/ui/table';
import { Alert, AlertDescription } from '../../../../../components/ui/alert';
import { Coins, Upload, Send, Gift } from 'lucide-react';
import DashBoardLayout from '../DashboardLayout';
import StrataForgeFactoryABI from '../../../../app/components/ABIs/StrataForgeFactoryABI.json';

// Background Shapes Component
const BackgroundShapes = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
    <div className="absolute top-20 left-10 w-32 h-32 border-2 border-purple-500/20 rounded-full animate-pulse"></div>
    <div className="absolute top-40 right-20 w-24 h-24 border-2 border-blue-500/20 rotate-45 animate-pulse delay-200"></div>
    <div className="absolute bottom-32 left-20 w-40 h-40 border-2 border-purple-400/15 rounded-2xl rotate-12 animate-pulse delay-400"></div>
    <div className="absolute top-1/3 left-1/4 w-16 h-16 border-2 border-cyan-500/20 rotate-45 animate-pulse delay-600"></div>
    <div className="absolute bottom-1/4 right-1/3 w-28 h-28 border-2 border-purple-300/15 rounded-full animate-pulse delay-800"></div>
    <div className="absolute top-10 right-1/3 w-64 h-64 bg-gradient-to-br from-purple-500/15 to-transparent rounded-full blur-xl animate-pulse delay-1000"></div>
    <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-gradient-to-tr from-blue-500/15 to-transparent rounded-full blur-xl animate-pulse delay-1200"></div>
    <div className="absolute top-1/2 right-10 w-48 h-48 bg-gradient-to-bl from-cyan-500/10 to-transparent rounded-full blur-xl animate-pulse delay-1400"></div>
  </div>
);

const FACTORY_CONTRACT_ADDRESS = '0x59F42c3eEcf829b34d8Ca846Dfc83D3cDC105C3F' as const;

type RecipientFile = {
  id: string;
  name: string;
  count: number;
  merkleRoot: string;
  recipients: { address: string }[];
  proofs: { [address: string]: string[] };
};

type AirdropData = {
  tokenAddress: string;
  distributorAddress: string;
  startTime: bigint;
  totalRecipients: bigint;
  dropAmount: bigint;
};

export default function AirdropListing() {
  const { address, isConnected } = useWallet();
  const [files, setFiles] = useState<RecipientFile[]>([]);

  // Fetch airdrops
  const { data: airdrops } = useReadContract({
    address: FACTORY_CONTRACT_ADDRESS,
    abi: StrataForgeFactoryABI,
    functionName: 'getCreatorAirdrops',
    args: [address],
    query: { enabled: isConnected && !!address },
  });

  // Load recipient files
  useEffect(() => {
    const storedFiles = localStorage.getItem('recipientFiles');
    if (storedFiles) {
      setFiles(JSON.parse(storedFiles));
    }
  }, []);

  const airdropsList = Array.isArray(airdrops) ? (airdrops as AirdropData[]) : [];

  return (
    <DashBoardLayout>
      <div className="min-h-screen bg-gradient-to-br from-[#1A0D23] to-[#2A1F36]">
        <BackgroundShapes />
        <header className="border-b border-purple-500/20 p-4">
          <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2">
              <Coins className="h-6 w-6 text-purple-400" />
              <span className="text-xl font-bold text-white">LaunchPad</span>
            </div>
          </div>
        </header>

        <main className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-white mb-8">Airdrop Management</h1>

            <div className="grid gap-8 md:grid-cols-3">
              <div className="md:col-span-2">
                <Card className="bg-[#2A1F36]/80 border-purple-500/20 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">Your Airdrops</CardTitle>
                    <CardDescription className="text-gray-300">
                      View and manage your created airdrops
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {airdropsList && airdropsList.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow className="border-purple-500/20">
                            <TableHead className="text-gray-300">Token</TableHead>
                            <TableHead className="text-gray-300">Distributor</TableHead>
                            <TableHead className="text-gray-300">Start Time</TableHead>
                            <TableHead className="text-gray-300">Recipients</TableHead>
                            <TableHead className="text-gray-300">Amount</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {airdropsList.map((airdrop: AirdropData, index: number) => (
                            <TableRow key={index} className="border-purple-500/20">
                              <TableCell className="text-white">{airdrop.tokenAddress}</TableCell>
                              <TableCell className="text-white">{airdrop.distributorAddress}</TableCell>
                              <TableCell className="text-white">
                                {new Date(Number(airdrop.startTime) * 1000).toLocaleString()}
                              </TableCell>
                              <TableCell className="text-white">{Number(airdrop.totalRecipients)}</TableCell>
                              <TableCell className="text-white">{ethers.formatUnits(airdrop.dropAmount, 18)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="flex h-[200px] items-center justify-center">
                        <p className="text-gray-400">No airdrops created yet.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card className="bg-[#2A1F36]/80 border-purple-500/20 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">How to Create an Airdrop</CardTitle>
                    <CardDescription className="text-gray-300">
                      Follow these steps to distribute your tokens
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-white">1. Upload Recipient List</h3>
                      <p className="text-sm text-gray-400">
                        Start by uploading a CSV file with the wallet addresses of your airdrop
                        recipients. Click the {"\"Upload Whitelisted CSV\""} button below.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">2. Configure and Create Airdrop</h3>
                      <p className="text-sm text-gray-400">
                        {files.length > 0
                          ? `Create your airdrop with ${files.reduce(
                              (sum, file) => sum + file.count,
                              0,
                            )} uploaded addresses by clicking {"\"Advanced Distribution\""}. Select your token, set the amount per recipient, and finalize the airdrop creation to deploy a distributor contract.`
                          : 'Upload recipients first to enable airdrop creation on the "Advanced Distribution" page.'}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">3. Claim Tokens</h3>
                      <p className="text-sm text-gray-400">
                        After creating the airdrop, recipients can claim their tokens using the
                        distributor address. Click {"\"Claim Airdrop\""} to start claiming.
                      </p>
                    </div>
                    {!isConnected && (
                      <Alert className="bg-yellow-500/10 border-yellow-500/20">
                        <AlertDescription className="text-yellow-300">
                          Please connect your wallet to create an airdrop.
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              <Link href="/dashboard/token-creator/airdrop-listing/upload">
                <Button className="w-full bg-gradient-to-r from-purple-500/30 to-blue-600/30 hover:from-purple-500/40 hover:to-blue-600/40 text-white">
                  <Upload className="mr-2 h-4 w-4" /> Upload Whitelisted CSV
                </Button>
              </Link>
              <Link href="/dashboard/token-creator/airdrop-listing/distribute">
                <Button
                  className="w-full bg-gradient-to-r from-purple-500/30 to-blue-600/30 hover:from-purple-500/40 hover:to-blue-600/40 text-white"
                  disabled={files.length === 0}
                >
                  <Send className="mr-2 h-4 w-4" /> Advanced Distribution
                </Button>
              </Link>
              <Link href="/dashboard/token-creator/airdrop-listing/claim">
                <Button className="w-full bg-gradient-to-r from-purple-500/30 to-blue-600/30 hover:from-purple-500/40 hover:to-blue-600/40 text-white">
                  <Gift className="mr-2 h-4 w-4" /> Claim Airdrop
                </Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </DashBoardLayout>
  );
}