'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ethers } from 'ethers';
import { Button } from '../../../../../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../../../components/ui/card';
import { Input } from '../../../../../components/ui/input';
import { Label } from '../../../../../components/ui/label';
import { Alert, AlertDescription } from '../../../../../components/ui/alert';
import { ArrowRight, Coins } from 'lucide-react';
import DashBoardLayout from '../DashboardLayout';
import MerkleDistributorABI from '../../../../lib/contracts/MerkleDistributor.json';
import { useWallet } from '../../../../contexts/WalletContext'; // Import useWallet

export default function Home() {
  const { address, isConnected } = useWallet(); // Use useWallet instead of useAccount
  const [distributorAddress, setDistributorAddress] = useState(
    process.env.NEXT_PUBLIC_DISTRIBUTOR_ADDRESS || '',
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Load last distributor address
  useEffect(() => {
    const lastAddress = localStorage.getItem('lastDistributorAddress');
    if (lastAddress) {
      setDistributorAddress(lastAddress);
    }
  }, []);

  const handleClaim = async () => {
    if (!window.ethereum) {
      setError('Please install MetaMask or another wallet provider!');
      return;
    }
    if (!isConnected || !address) {
      setError('Please connect your wallet!');
      return;
    }
    if (!ethers.isAddress(distributorAddress)) {
      setError('Enter a valid distributor address!');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      // Use AppKit-compatible provider
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Load recipients and proofs from local storage
      const storedFiles = localStorage.getItem('recipientFiles');
      if (!storedFiles) {
        throw new Error('No recipient data found. Please upload recipients first.');
      }

      const files = JSON.parse(storedFiles);
      if (!files.length) {
        throw new Error('No recipient files found.');
      }

      // Find user's proof in saved files
      let userProof = null;
      const userAddress = address.toLowerCase();

      for (const file of files) {
        if (file.proofs && file.proofs[userAddress]) {
          userProof = file.proofs[userAddress];
          break;
        }

        if (file.recipients) {
          const recipient = file.recipients.find(
            (r: { address?: string; proof?: string[] }) =>
              r.address && r.address.toLowerCase() === userAddress && r.proof,
          );

          if (recipient && recipient.proof) {
            userProof = recipient.proof;
            break;
          }
        }
      }

      if (!userProof) {
        throw new Error('Your address is not whitelisted for this airdrop.');
      }

      // Initialize contract
      const contract = new ethers.Contract(distributorAddress, MerkleDistributorABI, signer);

      // Check if already claimed
      const claimed = await contract.hasClaimed(address);
      if (claimed) {
        throw new Error('You have already claimed this airdrop.');
      }

      // Check if started
      const startTime = await contract.startTime();
      const now = Math.floor(Date.now() / 1000);
      if (now < Number(startTime)) {
        const startDate = new Date(Number(startTime) * 1000);
        throw new Error(`Airdrop not started yet. Starts at ${startDate.toLocaleString()}`);
      }

      // Send claim transaction
      const tx = await contract.claim(userProof, {
        gasLimit: 300000,
      });
      await tx.wait();

      localStorage.setItem('lastDistributorAddress', distributorAddress);
      setSuccess('Airdrop claimed successfully!');
    } catch (err) {
      console.error('Claim error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashBoardLayout>
      <div className='bg-[#201726] text-purple-100 min-h-screen'>
        <header className='border-b border-purple-500/20 p-4'>
          <div className='container flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <Coins className='h-6 w-6' />
              <span className='text-xl font-bold'>LaunchPad</span>
            </div>
          </div>
        </header>

        <main className='container py-8'>
          <div className='mb-6 flex items-center justify-between'>
            <h1 className='text-2xl font-bold'>Claim Airdrop</h1>
            <Link href='/dashboard/airdrop-listing'>
              <Button
                variant='ghost'
                className='text-purple-100 hover:bg-purple-500/10 hover:text-purple-200'
              >
                View Airdrop Listings <ArrowRight className='ml-2 h-4 w-4' />
              </Button>
            </Link>
          </div>

          <div className='max-w-md mx-auto'>
            <Card className='bg-zinc-900 border-purple-500/20'>
              <CardHeader>
                <CardTitle className='text-purple-100'>Claim Your Tokens</CardTitle>
                <CardDescription className='text-purple-100/70'>
                  Enter the airdrop distributor address to claim your tokens
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div>
                  <Label htmlFor='distributorAddress'>Distributor Address</Label>
                  <Input
                    id='distributorAddress'
                    placeholder='0x...'
                    value={distributorAddress}
                    onChange={(e) => setDistributorAddress(e.target.value)}
                    className='mt-1.5 bg-purple-800/40 border-purple-500/20 focus:border-purple-500'
                  />
                </div>
                {error && (
                  <Alert className='bg-red-500/10 border-red-500/20'>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                {success && (
                  <Alert className='bg-green-500/10 border-green-500/20'>
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}
                <Button
                  className='w-full bg-purple-500 hover:bg-purple-600 text-black'
                  onClick={handleClaim}
                  disabled={loading || !isConnected || !distributorAddress}
                >
                  {loading ? 'Claiming...' : 'Claim Airdrop'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </DashBoardLayout>
  );
}
