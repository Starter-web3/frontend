"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Coins, Calendar, Info, Copy, Check, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import DashBoardLayout from "../../DashboardLayout";
import AirdropFactoryABI from "../../../../lib/contracts/AirdropFactory.json";
import WebCoinABI from "../../../../lib/contracts/WebCoin.json";
import { Recipient } from "../../../../lib/merkle";

type RecipientFile = {
  id: string;
  name: string;
  count: number;
  merkleRoot: string;
  recipients: Recipient[];
  proofs: { [address: string]: string[] };
};

type TransactionStatus = "idle" | "approving" | "creating" | "success" | "error";

export default function DistributePage() {
  const { address, isConnected } = useAccount();
  const [tokenName, setTokenName] = useState("WebCoin");
  const [tokenAmount, setTokenAmount] = useState("");
  const [contractAddress, setContractAddress] = useState(process.env.NEXT_PUBLIC_TOKEN_ADDRESS || "");
  const [distributionMethod, setDistributionMethod] = useState("equal");
  const [scheduleDate, setScheduleDate] = useState("");
  const [gasOptimization, setGasOptimization] = useState(true);
  const [batchSize, setBatchSize] = useState("100");
  const [files, setFiles] = useState<RecipientFile[]>([]);
  const [txStatus, setTxStatus] = useState<TransactionStatus>("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [error, setError] = useState("");
  const [distributorAddress, setDistributorAddress] = useState("");
  const [copied, setCopied] = useState(false);
  const [tokenBalance, setTokenBalance] = useState<string>("0");
  const [tokenDecimals, setTokenDecimals] = useState(18);
  const [estimatedGas, setEstimatedGas] = useState("0.05 ETH");

  // Load files from local storage
  useEffect(() => {
    const storedFiles = localStorage.getItem("recipientFiles");
    if (storedFiles) {
      try {
        const parsedFiles = JSON.parse(storedFiles);
        setFiles(parsedFiles);
        
        // Update estimated gas based on recipient count
        const totalRecipients = parsedFiles.reduce((sum: number, file: RecipientFile) => sum + file.count, 0);
        const estimated = (0.0001 * totalRecipients + 0.03).toFixed(4);
        setEstimatedGas(`${estimated} ETH`);
      } catch (err) {
        console.error("Error parsing recipientFiles from localStorage:", err);
      }
    }
  }, []);

  // Load token info when contract address changes
  useEffect(() => {
    const loadTokenInfo = async () => {
      if (!contractAddress || !ethers.isAddress(contractAddress) || !window.ethereum) return;
      
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const tokenContract = new ethers.Contract(
          contractAddress, 
          [
            "function name() view returns (string)",
            "function decimals() view returns (uint8)",
            "function balanceOf(address) view returns (uint256)"
          ],
          provider
        );
        
        // Get token name and decimals
        const [name, decimals, balance] = await Promise.all([
          tokenContract.name().catch(() => "Unknown Token"),
          tokenContract.decimals().catch(() => 18),
          address ? tokenContract.balanceOf(address).catch(() => "0") : "0"
        ]);
        
        setTokenName(name);
        setTokenDecimals(decimals);
        
        // Format balance with correct decimals
        const formattedBalance = ethers.formatUnits(balance, decimals);
        setTokenBalance(formattedBalance);
      } catch (err) {
        console.error("Error loading token info:", err);
      }
    };
    
    loadTokenInfo();
  }, [contractAddress, address, isConnected]);

  const handleMaxAmount = async () => {
    if (!isConnected || !address || !contractAddress) return;
    
    try {
      // Use 90% of balance for max to leave room for gas
      const maxAmount = parseFloat(tokenBalance) * 0.9 / 
        (files.reduce((sum, file) => sum + file.count, 0) || 1);
      
      setTokenAmount(maxAmount.toFixed(tokenDecimals > 6 ? 6 : tokenDecimals));
    } catch (err) {
      console.error("Error calculating max amount:", err);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const validateInputs = () => {
    if (!isConnected) return "Please connect your wallet";
    if (!contractAddress || !ethers.isAddress(contractAddress)) return "Enter a valid token contract address";
    if (!tokenAmount || parseFloat(tokenAmount) <= 0) return "Enter a valid token amount";
    if (files.length === 0) return "No recipient files uploaded";
    
    const totalRecipients = files.reduce((sum, file) => sum + file.count, 0);
    if (totalRecipients === 0) return "No recipients found in uploaded files";
    
    const totalAmount = parseFloat(tokenAmount) * totalRecipients;
    if (totalAmount > parseFloat(tokenBalance)) return "Insufficient token balance";
    
    return null;
  };

  const handleDistribute = async () => {
    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setTxStatus("approving");
      setError("");
      setStatusMessage("Connecting to wallet...");

      // Connect to MetaMask
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Initialize contracts
      const factoryContract = new ethers.Contract(
        process.env.NEXT_PUBLIC_FACTORY_ADDRESS!,
        AirdropFactoryABI,
        signer
      );
      const tokenContract = new ethers.Contract(contractAddress, WebCoinABI, signer);

      // Combine recipients from all files
      const allRecipients = files.flatMap((file) => file.recipients);
      const totalRecipients = allRecipients.length;
      const merkleRoot = files[0].merkleRoot; // Use the first file's Merkle root
      const dropAmount = ethers.parseUnits(tokenAmount, tokenDecimals);
      const totalDropAmount = dropAmount * BigInt(totalRecipients);
      const startTime = scheduleDate
        ? Math.floor(new Date(scheduleDate).getTime() / 1000)
        : Math.floor(Date.now() / 1000);

      // Check allowance first
      const currentAllowance = await tokenContract.allowance(address, factoryContract.target);
      
      // Only approve if needed
      if (currentAllowance < totalDropAmount) {
        setStatusMessage("Approving token transfer...");
        const approveTx = await tokenContract.approve(factoryContract.target, totalDropAmount);
        setStatusMessage("Waiting for approval confirmation...");
        await approveTx.wait();
      }

      // Create airdrop
      setTxStatus("creating");
      setStatusMessage("Creating airdrop...");
      
      // Save distributor parameters for future reference
      const distributorParams = {
        tokenAddress: contractAddress,
        merkleRoot,
        dropAmount: dropAmount.toString(),
        totalRecipients,
        startTime
      };
      localStorage.setItem("lastDistributorParams", JSON.stringify(distributorParams));
      
      const createTx = await factoryContract.createAirdrop(
        contractAddress,
        merkleRoot,
        dropAmount,
        totalRecipients,
        startTime
      );
      
      setStatusMessage("Waiting for transaction confirmation...");
      const receipt = await createTx.wait();

      // Extract distributor address from event
      const event = receipt.logs
        .map((log: any) => {
          try {
            return factoryContract.interface.parseLog(log);
          } catch (e) {
            return null;
          }
        })
        .find((e: any) => e?.name === "AirdropCreated");
        
      const newDistributorAddress = event?.args.distributorAddress;

      if (!newDistributorAddress) {
        throw new Error("Could not retrieve distributor address from transaction");
      }

      setDistributorAddress(newDistributorAddress);
      setTxStatus("success");
      
      // Save distributor address to localStorage for future reference
      localStorage.setItem("lastDistributorAddress", newDistributorAddress);
      
    } catch (err: any) {
      console.error("Distribution Error:", err);
      setError(`Error: ${err.message || "Transaction failed"}`);
      setTxStatus("error");
    } finally {
      setStatusMessage("");
    }
  };

  const isLoading = txStatus === "approving" || txStatus === "creating";
  const validationError = validateInputs();
  const totalRecipients = files.reduce((sum, file) => sum + file.count, 0);
  const totalAmountValue = parseFloat(tokenAmount || "0") * totalRecipients;

  return (
    <DashBoardLayout>
      <div className="bg-[#201726] text-purple-100 min-h-screen">
        <header className="border-b border-purple-500/20 p-4">
          <div className="container flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Coins className="h-6 w-6" />
              <span className="text-xl font-bold">LaunchPad</span>
            </div>
            {/* Wallet connection would go here */}
          </div>
        </header>

        <main className="container py-8">
          <div className="mb-6 flex items-center">
            <Link href="/dashboard/airdrop-listing/upload">
              <Button variant="ghost" className="text-purple-100 hover:bg-purple-500/10 hover:text-purple-200">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Recipients
              </Button>
            </Link>
            <h1 className="ml-4 text-2xl font-bold">Distribute Airdrop</h1>
          </div>

          {error && (
            <Alert className="mb-4 bg-red-500/10 border-red-500/20">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {statusMessage && (
            <Alert className="mb-4 bg-blue-500/10 border-blue-500/20">
              <AlertDescription>{statusMessage}</AlertDescription>
            </Alert>
          )}

          {txStatus === "success" && distributorAddress && (
            <Alert className="mb-4 bg-green-500/10 border-green-500/20">
              <div className="flex flex-col space-y-2">
                <AlertDescription className="flex items-center">
                  <span className="mr-2">✅ Airdrop created successfully!</span>
                </AlertDescription>
                <div className="flex items-center">
                  <span className="mr-2 text-sm">Distributor Address:</span>
                  <code className="bg-purple-800/30 px-2 py-0.5 rounded text-sm">{distributorAddress}</code>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="ml-2 h-6 w-6 p-0"
                    onClick={() => copyToClipboard(distributorAddress)}
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <div className="flex items-center mt-2">
                  <Link href={`/dashboard/airdrop-listing/claim`} className="text-purple-400 hover:text-purple-300 text-sm flex items-center">
                    Go to claim page
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </Link>
                </div>
              </div>
            </Alert>
          )}

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card className="bg-purple-900/40 border-purple-500/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Create New Airdrop</CardTitle>
                      <CardDescription>Configure your token distribution parameters</CardDescription>
                    </div>
                    <Coins className="h-8 w-8 text-purple-400" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="tokenName">Token Name</Label>
                      <Input
                        id="tokenName"
                        placeholder="Enter token name"
                        value={tokenName}
                        onChange={(e) => setTokenName(e.target.value)}
                        className="mt-1.5 bg-purple-800/40 border-purple-500/20 focus:border-purple-500"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between">
                        <Label htmlFor="tokenAmount">Token Amount (per recipient)</Label>
                        {isConnected && Number(tokenBalance) > 0 && (
                          <span className="text-xs text-purple-300">Balance: {parseFloat(tokenBalance).toFixed(4)} {tokenName}</span>
                        )}
                      </div>
                      <div className="flex mt-1.5">
                        <Input
                          id="tokenAmount"
                          type="number"
                          step="0.000001"
                          placeholder="0.0"
                          value={tokenAmount}
                          onChange={(e) => setTokenAmount(e.target.value)}
                          className="bg-purple-800/40 border-purple-500/20 focus:border-purple-500"
                        />
                        <Button
                          variant="outline"
                          className="ml-2 border-purple-500 text-purple-100 hover:bg-purple-500/10"
                          onClick={handleMaxAmount}
                          disabled={!isConnected || Number(tokenBalance) === 0}
                        >
                          MAX
                        </Button>
                      </div>
                      {totalRecipients > 0 && tokenAmount && (
                        <div className="mt-1 text-xs text-purple-300">
                          Total: {totalAmountValue.toFixed(4)} {tokenName} for {totalRecipients} recipients
                        </div>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="contractAddress">Token Contract Address</Label>
                      <Input
                        id="contractAddress"
                        placeholder="0x..."
                        value={contractAddress}
                        onChange={(e) => setContractAddress(e.target.value)}
                        className="mt-1.5 bg-purple-800/40 border-purple-500/20 focus:border-purple-500"
                      />
                    </div>
                  </div>

                  <Separator className="bg-purple-500/20" />

                  <div>
                    <Label className="mb-2 block">Recipients</Label>
                    <div className="flex flex-wrap gap-2">
                      {files.map((file) => (
                        <Badge
                          key={file.id}
                          variant="outline"
                          className="border-purple-500 text-purple-100 px-3 py-1"
                        >
                          {file.name} ({file.count} addresses)
                        </Badge>
                      ))}
                      <Link href="/dashboard/airdrop-listing/upload">
                        <Badge
                          variant="outline"
                          className="border-purple-500/50 text-purple-100/70 px-3 py-1 cursor-pointer hover:border-purple-500 hover:text-purple-100"
                        >
                          + Add more
                        </Badge>
                      </Link>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="distributionMethod">Distribution Method</Label>
                    <Select value={distributionMethod} onValueChange={setDistributionMethod}>
                      <SelectTrigger className="mt-1.5 bg-purple-800/40 border-purple-500/20 focus:border-purple-500">
                        <SelectValue placeholder="Select distribution method" />
                      </SelectTrigger>
                      <SelectContent className="bg-purple-800/40 border-purple-500/20">
                        <SelectItem value="equal">Equal Split</SelectItem>
                        <SelectItem value="custom">Custom Amounts (from CSV)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="scheduleDate">Schedule</Label>
                    <div className="flex mt-1.5">
                      <Input
                        id="scheduleDate"
                        type="datetime-local"
                        value={scheduleDate}
                        onChange={(e) => setScheduleDate(e.target.value)}
                        className="bg-purple-800/40 border-purple-500/20 focus:border-purple-500"
                      />
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              className="ml-2 border-purple-500 text-purple-100 hover:bg-purple-500/10"
                              onClick={() => setScheduleDate("")}
                            >
                              <Calendar className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent className="bg-purple-800/40 border-purple-500/20">
                            <p>Leave empty for immediate distribution</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    {scheduleDate && (
                      <p className="text-xs text-purple-300 mt-1">
                        Airdrop will be claimable from {new Date(scheduleDate).toLocaleString()}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="bg-purple-900/40 border-purple-500/20">
                <CardHeader>
                  <CardTitle>Advanced Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="gasOptimization">Gas Optimization</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-purple-100/70" />
                          </TooltipTrigger>
                          <TooltipContent className="bg-purple-800/40 border-purple-500/20">
                            <p>Optimize gas usage for large distributions</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Switch
                      id="gasOptimization"
                      checked={gasOptimization}
                      onCheckedChange={setGasOptimization}
                      className="data-[state=checked]:bg-purple-500"
                    />
                  </div>

                  <div>
                    <Label htmlFor="batchSize">Batch Size</Label>
                    <Input
                      id="batchSize"
                      type="number"
                      value={batchSize}
                      onChange={(e) => setBatchSize(e.target.value)}
                      className="mt-1.5 bg-purple-800/40 border-purple-500/20 focus:border-purple-500"
                      disabled={!gasOptimization}
                    />
                  </div>

                  <Separator className="bg-purple-500/20" />

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Estimated Gas:</Label>
                      <span className="font-mono">{estimatedGas}</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Total Recipients:</Label>
                      <span>{totalRecipients}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Distribution Type:</Label>
                      <Badge variant="outline" className="border-purple-500/50 text-purple-100">
                        {distributionMethod === "equal" ? "Equal Split" : "Custom"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full bg-purple-500 hover:bg-purple-600 text-black"
                    onClick={handleDistribute}
                    disabled={isLoading || !!validationError || txStatus === "success"}
                  >
                    {isLoading 
                      ? txStatus === "approving" 
                        ? "Approving Tokens..." 
                        : "Creating Airdrop..." 
                      : txStatus === "success" 
                        ? "Airdrop Created" 
                        : "Distribute Airdrop"
                    }
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </DashBoardLayout>
  );
}