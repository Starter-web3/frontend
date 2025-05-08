"use client";

import { useState } from "react";
import Link from "next/link";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Coins } from "lucide-react";
import DashBoardLayout from "../../DashboardLayout";
// import WalletConnect from "@/components/WalletConnect";
import MerkleDistributorABI from "../../../../lib/contracts/MerkleDistributor.json";
import { createMerkleTree, Recipient } from "../../../../lib/merkle";

export default function ClaimPage() {
  const { address, isConnected } = useAccount();
  const [distributorAddress, setDistributorAddress] = useState(
    process.env.NEXT_PUBLIC_DISTRIBUTOR_ADDRESS || ""
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleClaim = async () => {
    if (!window.ethereum) {
      setError("Please install MetaMask!");
      return;
    }
    if (!isConnected || !address) {
      setError("Please connect your wallet!");
      return;
    }
    if (!distributorAddress) {
      setError("Please enter a valid distributor address!");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Load recipients from local storage
      const files: { recipients: Recipient[] }[] = JSON.parse(localStorage.getItem("recipientFiles") || "[]");
      const allRecipients = files.flatMap((file) => file.recipients);

      if (allRecipients.length === 0) {
        throw new Error("No recipient data found. Please upload a CSV file first.");
      }

      const { proofs, merkleRoot } = createMerkleTree(allRecipients);
      const proof = proofs[address.toLowerCase()];

      console.log("Debugging Claim:");
      console.log("Caller Address:", address);
      console.log("Distributor Address:", distributorAddress);
      console.log("Merkle Root:", merkleRoot);
      console.log("Proof:", proof);

      if (!proof) {
        throw new Error("Your address is not whitelisted for this airdrop.");
      }

      const contract = new ethers.Contract(distributorAddress, MerkleDistributorABI, signer);

      // Check contract state (optional, if contract has public getters)
      try {
        const isClaimed = await contract.isClaimed(address);
        if (isClaimed) {
          throw new Error("This address has already claimed the airdrop.");
        }
      } catch (err) {
        console.warn("Could not check claim status; proceeding with claim attempt.");
      }

      // Estimate gas first to catch errors
    try {
        const gasEstimate = await contract.claim.estimateGas(proof);
        console.log("Gas estimate:", gasEstimate);
      } catch (estimateError) {
        console.error("Gas estimate failed:", estimateError);
        throw new Error("Claim verification failed. Check distributor address and proof.");
      }
      
      const tx = await contract.claim(proof);
      await tx.wait();

      setSuccess("Airdrop claimed successfully!");
    } catch (err: any) {
      console.error("Claim Error:", err);
      setError(`Error: ${err.message || "Transaction failed. Check the distributor address and try again."}`);
    } finally {
      setLoading(false);
}
  };

  return (
    <DashBoardLayout>
      <div className="bg-#201726 text-purple-100 min-h-screen">
        <header className="border-b border-purple-500/20 p-4">
          <div className="container flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Coins className="h-6 w-6" />
              <span className="text-xl font-bold">LaunchPad</span>
            </div>
            {/* <WalletConnect /> */}
          </div>
        </header>

        <main className="container py-8">
          <div className="mb-6 flex items-center">
            <Link href="/dashboard/airdrop-listing">
              <Button variant="ghost" className="text-purple-100 hover:bg-purple-500/10 hover:text-purple-200">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="ml-4 text-2xl font-bold">Claim Airdrop</h1>
          </div>

          <div className="max-w-md mx-auto">
            <Card className="bg-zinc-900 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-purple-100">Claim Your Tokens</CardTitle>
                <CardDescription className="text-purple-100/70">
                  Enter the airdrop distributor address to claim your tokens
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="distributorAddress">Distributor Address</Label>
                  <Input
                    id="distributorAddress"
                    placeholder="0x..."
                    value={distributorAddress}
                    onChange={(e) => setDistributorAddress(e.target.value)}
                    className="mt-1.5 bg-purple-800/40 border-purple-500/20 focus:border-purple-500"
                  />
                </div>
                {error && (
                  <Alert className="bg-red-500/10 border-red-500/20">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                {success && (
                  <Alert className="bg-green-500/10 border-green-500/20">
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}
                <Button
                  className="w-full bg-purple-500 hover:bg-purple-600 text-black"
                  onClick={handleClaim}
                  disabled={!distributorAddress || loading || !isConnected}
                >
                  {loading ? "Claiming..." : "Claim Airdrop"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </DashBoardLayout>
  );
}