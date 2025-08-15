"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useWallet } from "../../../../../contexts/WalletContext";
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { Abi } from "viem";
import { ethers, Log, LogDescription } from "ethers";
console.log(Log, LogDescription )
import { Button } from "../../../../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../../../../components/ui/card";
import { Input } from "../../../../../../components/ui/input";
import { Label } from "../../../../../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../../../components/ui/select";
import { Switch } from "../../../../../../components/ui/switch";
import { Alert, AlertDescription } from "../../../../../../components/ui/alert";
import { Coins, Calendar, Info, TrendingUp, TrendingDown } from "lucide-react";
import { Badge } from "../../../../../../components/ui/badge";
import { Separator } from "../../../../../../components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../../../../components/ui/tooltip";
import DashBoardLayout from "../../DashboardLayout";
import StrataForgeAirdropFactoryABI from "../../../../../app/components/ABIs/StrataForgeAirdropFactoryABI.json";
import StrataForgeERC20ImplementationABI from "../../../../components/ABIs/StrataForgeERC20ImplementationABI.json";
import StrataForgeAdminABI from "../../../../../app/components/ABIs/StrataForgeAdminABI.json";
import { createMerkleTree, Recipient } from "../../../../../lib/merkle";
import {
  useUsdEthPrice,
  useAirdropPriceData,
} from "../../../../../hooks/useUsdEthPrice";

const BackgroundShapes = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
    <div className="absolute top-20 left-10 w-32 h-32 border-2 border-purple-500/20 rounded-full animate-pulse"></div>
    <div className="absolute top-40 right-20 w-24 h-24 border-2 border-blue-500/20 rotate-45 animate-pulse delay-200"></div>
    <div className="absolute bottom-32 left-20 w-40 h-40 border-2 border-purple-400/15 rounded-2xl rotate-12 animate-pulse delay-400"></div>
    <div className="absolute top-1/3 left-1/4 w-16 h-16 border-2 border-cyan-500/20 rotate-45 animate-pulse delay-600"></div>
    <div className="absolute bottom-1/4 right-1/3 w-28 h-28 border-2 border-purple-300/15 rounded-full animate-pulse delay-800"></div>
    <div className="absolute top-10 right-1/3 w-64 h-64 bg-gradient-to-br from-purple-500/15 to-transparent rounded-full blur-xl animate-pulse delay-1000"></div>
    <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full blur-xl animate-pulse delay-1200"></div>
    <div className="absolute top-1/2 right-10 w-48 h-48 bg-gradient-to-bl from-cyan-500/10 to-transparent rounded-full blur-xl animate-pulse delay-1400"></div>
  </div>
);

const FACTORY_CONTRACT_ADDRESS = "0xFe9fDE126C4aE4Be8A6D4F1Da284611935726920" as const;
const ADMIN_CONTRACT_ADDRESS = "0x4eB7bba93734533350455B50056c33e93DD86493" as const;

// Convert ABIs to proper types
const adminABI = StrataForgeAdminABI as Abi;
const airdropFactoryABI = StrataForgeAirdropFactoryABI as Abi;
const erc20ABI = StrataForgeERC20ImplementationABI as Abi;

type RecipientFile = {
  id: string;
  name: string;
  count: number;
  merkleRoot: string;
  recipients: Recipient[];
  proofs: { [address: string]: string[] };
};

const PriceDisplay = ({
  price,
  loading,
  error,
  priceChangePercentage,
}: {
  price: number | null;
  loading: boolean;
  error: string | null;
  priceChangePercentage?: number;
}) => {
  if (loading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500"></div>
        <span className="text-white">Loading price...</span>
      </div>
    );
  }

  if (error || !price) {
    return <div className="text-red-400 text-sm">Failed to load price</div>;
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  return (
    <div className="flex items-center space-x-2">
      <span className="font-mono text-white">{formatPrice(price)}</span>
      {priceChangePercentage !== undefined && (
        <div
          className={`flex items-center space-x-1 ${
            priceChangePercentage >= 0 ? "text-green-400" : "text-red-400"
          }`}
        >
          {priceChangePercentage >= 0 ? (
            <TrendingUp className="h-3 w-3" />
          ) : (
            <TrendingDown className="h-3 w-3" />
          )}
          <span className="text-xs">
            {priceChangePercentage >= 0 ? "+" : ""}
            {priceChangePercentage.toFixed(2)}%
          </span>
        </div>
      )}
    </div>
  );
};

export default function DistributePage() {
  const { address, isConnected } = useWallet();
  const [tokenName, setTokenName] = useState("");
  const [tokenAmount, setTokenAmount] = useState("");
  const [contractAddress, setContractAddress] = useState("");
  const [distributionMethod, setDistributionMethod] = useState("equal");
  const [scheduleDate, setScheduleDate] = useState("");
  const [gasOptimization, setGasOptimization] = useState(true);
  const [batchSize, setBatchSize] = useState("100");
  const [files, setFiles] = useState<RecipientFile[]>([]);
  const [error, setError] = useState("");
  const [distributorAddress, setDistributorAddress] = useState("");
  const [mintAmount, setMintAmount] = useState("");
  const [mintStatus, setMintStatus] = useState("");
  const [networkStatus, setNetworkStatus] = useState<string>("");

  // Wagmi hooks for contract interactions
  const { writeContractAsync, isPending: isWritePending } = useWriteContract();
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();
  
  const { isLoading: isTxLoading, isSuccess: isTxSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const {
    usdPrice: ethPrice,
    loading: priceLoading,
    error: priceError,
  } = useUsdEthPrice();
  const { ethPrice: enhancedEthPrice, priceChangePercentage } = useAirdropPriceData();

  // Calculate total recipients for fee calculation
  const totalRecipients = useMemo(() => {
    return files.reduce((sum, file) => sum + file.count, 0);
  }, [files]);

  // Use wagmi to get airdrop fee USD
  const {
    data: airdropFeeUSDRaw,
    error: airdropFeeUSDError,
    isLoading: airdropFeeUSDLoading,
  } = useReadContract({
    address: ADMIN_CONTRACT_ADDRESS,
    abi: adminABI,
    functionName: "getAirdropFeeUSD",
    args: [totalRecipients],
    query: {
      enabled: isConnected && totalRecipients > 0,
      retry: 3,
      retryDelay: 1000,
    },
  });

  // Format USD fee for display
  const airdropFeeUSD = useMemo(() => {
    if (!airdropFeeUSDRaw) return null;
    return ethers.formatUnits(airdropFeeUSDRaw as bigint, 8);
  }, [airdropFeeUSDRaw]);

  // Calculate ETH fee from USD fee using current ETH price
  const airdropFeeETH = useMemo(() => {
    if (!airdropFeeUSD || !enhancedEthPrice) return null;
    const usdFee = parseFloat(airdropFeeUSD);
    const ethFee = usdFee / enhancedEthPrice;
    return ethFee.toString();
  }, [airdropFeeUSD, enhancedEthPrice]);

  // Convert ETH fee to Wei for contract calls
  const airdropFeeETHRaw = useMemo(() => {
    if (!airdropFeeETH) return null;
    try {
      return ethers.parseEther(airdropFeeETH);
    } catch (error) {
      console.error("Error parsing ETH fee:", error);
      return null;
    }
  }, [airdropFeeETH]);

  // Fee loading state
  const feeLoading = airdropFeeUSDLoading;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedFiles = sessionStorage.getItem("recipientFiles");
      if (storedFiles) {
        try {
          const parsed = JSON.parse(storedFiles);
          if (Array.isArray(parsed)) {
            setFiles(parsed);
          }
        } catch (error) {
          console.error("Invalid recipientFiles in sessionStorage:", error);
        }
      }
    }
  }, []);

  // Update network status based on fee loading
  useEffect(() => {
    if (feeLoading) {
      setNetworkStatus(`Fetching fees for ${totalRecipients} recipients...`);
    } else if (airdropFeeUSDError) {
      setNetworkStatus("Error fetching fees");
      setError(`Failed to fetch airdrop fees: ${airdropFeeUSDError?.message}`);
    } else if (airdropFeeUSD) {
      setNetworkStatus("Fees fetched successfully");
      setError("");
    }
  }, [feeLoading, airdropFeeUSDError, airdropFeeUSD, totalRecipients]);

  const handleMaxAmount = () => {
    setTokenAmount("1000");
  };

  const handleMint = async () => {
    if (!isConnected) {
      setError("Please connect your wallet!");
      return;
    }
    if (!ethers.isAddress(distributorAddress)) {
      setError("No valid distributor address available. Create an airdrop first.");
      return;
    }
    if (!mintAmount || isNaN(Number(mintAmount)) || Number(mintAmount) <= 0) {
      setError("Enter a valid mint amount.");
      return;
    }
    if (!ethers.isAddress(contractAddress)) {
      setError("Invalid token contract address.");
      return;
    }

    try {
      setError("");
      setMintStatus("Preparing mint transaction...");

      const amountToMint = ethers.parseUnits(mintAmount, 18);

      const result = await writeContractAsync({
        address: contractAddress as `0x${string}`,
        abi: erc20ABI,
        functionName: "mint",
        args: [distributorAddress as `0x${string}`, amountToMint],
      });

      setTxHash(result);
      setMintStatus("Transaction submitted, waiting for confirmation...");
    } catch (mintErr) {
      console.error("Minting error:", mintErr);
      setError(`Minting failed: ${(mintErr as Error).message}`);
      setMintStatus("");
    }
  };

  // Handle mint transaction success
  useEffect(() => {
    if (isTxSuccess && txHash) {
      setMintStatus(`Successfully minted ${mintAmount} tokens to ${distributorAddress}`);
      setTxHash(undefined);
    }
  }, [isTxSuccess, txHash, mintAmount, distributorAddress]);

  const handleDistribute = async () => {
    if (!isConnected) {
      setError("Please connect your wallet!");
      return;
    }
    if (files.length === 0) {
      setError("No recipient files uploaded.");
      return;
    }
    if (
      distributionMethod === "custom" &&
      files.some((file) => file.recipients.some((r) => !r.amount))
    ) {
      setError("Custom distribution requires amounts for all recipients in the CSV.");
      return;
    }
    if (!ethers.isAddress(contractAddress)) {
      setError("Invalid token contract address");
      return;
    }

    try {
      setError("");
      setDistributorAddress("");
      setNetworkStatus("Preparing airdrop creation...");

      const allRecipients = files.flatMap((file) => file.recipients);
      const totalRecipients = allRecipients.length;

      const isCustomDistribution = distributionMethod === "custom";
      const { merkleRoot } = createMerkleTree(
        allRecipients,
        isCustomDistribution,
        tokenAmount || "100"
      );

      let dropAmount: bigint;

      if (isCustomDistribution) {
        dropAmount = ethers.parseUnits("1", 18); // dummy value for custom mode
      } else {
        dropAmount = ethers.parseUnits(tokenAmount || "100", 18);
      }

      const startTime = scheduleDate
        ? Math.floor(new Date(scheduleDate).getTime() / 1000)
        : Math.floor(Date.now() / 1000);

      // Get the required ETH fee
      if (!airdropFeeETHRaw) {
        throw new Error("Could not determine airdrop fee. Please try again.");
      }

      setNetworkStatus("Creating airdrop...");

      // Create the airdrop
      const result = await writeContractAsync({
        address: FACTORY_CONTRACT_ADDRESS,
        abi: airdropFactoryABI,
        functionName: "createERC20Airdrop",
        args: [
          contractAddress as `0x${string}`,
          merkleRoot as `0x${string}`,
          dropAmount,
          totalRecipients,
          startTime,
        ],
        value: airdropFeeETHRaw as bigint,
      });

      setTxHash(result);
      setNetworkStatus("Transaction submitted, waiting for confirmation...");

      // Note: You'll need to parse the transaction receipt to get the distributor address
      // This requires additional logic to decode the event logs
      
    } catch (err) {
      console.error("Distribution error:", err);
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";

      if (errorMessage.includes("Insufficient ETH for airdrop fee")) {
        setError("Insufficient ETH sent for airdrop fee.");
      } else if (errorMessage.includes("InvalidRecipientCount")) {
        setError("Invalid number of recipients for the selected fee tier.");
      } else if (errorMessage.includes("PriceFeedNotSet")) {
        setError("Price feed not set in the admin contract.");
      } else if (errorMessage.includes("StalePriceFeed")) {
        setError("Price feed data is stale.");
      } else if (errorMessage.includes("InvalidPriceFeed")) {
        setError("Invalid price feed data.");
      } else {
        setError(`Error: ${errorMessage}`);
      }
      setNetworkStatus("Error occurred");
    }
  };

  const loading = isWritePending || isTxLoading;
  const mintLoading = isWritePending || isTxLoading;

  return (
    <DashBoardLayout>
      <div className="min-h-screen bg-gradient-to-br from-[#1A0D23] to-[#2A1F36]">
        <BackgroundShapes />
        <header className="border-b border-purple-500/20 p-4">
          <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-6">
            <h1 className="text-2xl font-bold text-white flex items-center">
              <Coins className="h-6 w-6 mr-2 text-purple-400" />
              Token Distribution
            </h1>
            <Link href="/dashboard">
              <Button
                variant="outline"
                className="text-white border-purple-500 hover:bg-purple-500/20"
              >
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </header>

        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Airdrop Creation Section */}
            <Card className="bg-[#2A1F36]/80 border-purple-500/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Create Airdrop</CardTitle>
                <CardDescription className="text-gray-400">
                  Distribute tokens to multiple recipients using a Merkle tree-based airdrop.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Network Status Indicator */}
                {(feeLoading || networkStatus) && (
                  <Alert>
                    <AlertDescription className="text-blue-400">
                      {feeLoading && (
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                          <span>{networkStatus || "Processing..."}</span>
                        </div>
                      )}
                      {!feeLoading && networkStatus && <span>{networkStatus}</span>}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="tokenName" className="text-white">
                    Token Name
                  </Label>
                  <Input
                    id="tokenName"
                    value={tokenName}
                    onChange={(e) => setTokenName(e.target.value)}
                    placeholder="e.g., MyToken"
                    className="bg-[#3A2F46]/50 border-purple-500/30 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contractAddress" className="text-white">
                    Token Contract Address
                  </Label>
                  <Input
                    id="contractAddress"
                    value={contractAddress}
                    onChange={(e) => setContractAddress(e.target.value)}
                    placeholder="0x..."
                    className="bg-[#3A2F46]/50 border-purple-500/30 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tokenAmount" className="text-white flex items-center">
                    Token Amount per Recipient
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 ml-2 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>For equal distribution, specify the amount each recipient gets.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <div className="flex space-x-2">
                    <Input
                      id="tokenAmount"
                      type="number"
                      value={tokenAmount}
                      onChange={(e) => setTokenAmount(e.target.value)}
                      placeholder="100"
                      disabled={distributionMethod === "custom"}
                      className="bg-[#3A2F46]/50 border-purple-500/30 text-white"
                    />
                    <Button
                      onClick={handleMaxAmount}
                      variant="outline"
                      className="text-white border-purple-500 hover:bg-purple-500/20"
                    >
                      Max
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="distributionMethod" className="text-white">
                    Distribution Method
                  </Label>
                  <Select value={distributionMethod} onValueChange={setDistributionMethod}>
                    <SelectTrigger className="bg-[#3A2F46]/50 border-purple-500/30 text-white">
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#2A1F36] border-purple-500/30 text-white">
                      <SelectItem value="equal">Equal Distribution</SelectItem>
                      <SelectItem value="custom">Custom Distribution (CSV)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="scheduleDate" className="text-white flex items-center">
                    Schedule Distribution
                    <Calendar className="h-4 w-4 ml-2 text-gray-400" />
                  </Label>
                  <Input
                    id="scheduleDate"
                    type="datetime-local"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="bg-[#3A2F46]/50 border-purple-500/30 text-white"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="gasOptimization"
                      checked={gasOptimization}
                      onCheckedChange={setGasOptimization}
                    />
                    <Label htmlFor="gasOptimization" className="text-white">
                      Gas Optimization
                    </Label>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="batchSize" className="text-white">
                      Batch Size
                    </Label>
                    <Input
                      id="batchSize"
                      type="number"
                      value={batchSize}
                      onChange={(e) => setBatchSize(e.target.value)}
                      className="w-20 bg-[#3A2F46]/50 border-purple-500/30 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Recipient Files</Label>
                  <div className="space-y-2">
                    {files.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between bg-[#3A2F46]/50 p-2 rounded-md"
                      >
                        <span className="text-white">
                          {file.name} ({file.count} recipients)
                        </span>
                        <Badge variant="secondary" className="text-gray-300">
                          Merkle Root: {file.merkleRoot.slice(0, 8)}...
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Airdrop Fee</Label>
                  {feeLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500"></div>
                      <span className="text-white">Calculating fees...</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {airdropFeeUSD && (
                        <div className="text-white">
                          USD: ${parseFloat(airdropFeeUSD).toFixed(2)}
                        </div>
                      )}
                      {airdropFeeETH && (
                        <div className="flex items-center space-x-2">
                          <span className="text-white">
                            ETH: {parseFloat(airdropFeeETH).toFixed(6)}
                          </span>
                          <span className="text-gray-400">
                            (${parseFloat(airdropFeeUSD || "0").toFixed(2)})
                          </span>
                        </div>
                      )}
                      {airdropFeeUSDError && (
                        <div className="text-red-400 text-sm">
                          Error loading fees. Please check your connection.
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-white">ETH Price</Label>
                  <PriceDisplay
                    price={enhancedEthPrice}
                    loading={priceLoading}
                    error={priceError}
                    priceChangePercentage={priceChangePercentage}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handleDistribute}
                  disabled={loading || !isConnected}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {loading ? "Creating Airdrop..." : "Create Airdrop"}
                </Button>
              </CardFooter>
            </Card>

            {/* Mint Tokens Section */}
            <Card className="bg-[#2A1F36]/80 border-purple-500/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Mint Tokens</CardTitle>
                <CardDescription className="text-gray-400">
                  Mint tokens to the distributor address for airdrop distribution.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {mintStatus && (
                  <Alert>
                    <AlertDescription className="text-green-400">
                      {mintStatus}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="distributorAddress" className="text-white">
                    Distributor Address
                  </Label>
                  <Input
                    id="distributorAddress"
                    value={distributorAddress}
                    onChange={(e) => setDistributorAddress(e.target.value)}
                    placeholder="0x..."
                    className="bg-[#3A2F46]/50 border-purple-500/30 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mintAmount" className="text-white">
                    Mint Amount
                  </Label>
                  <Input
                    id="mintAmount"
                    type="number"
                    value={mintAmount}
                    onChange={(e) => setMintAmount(e.target.value)}
                    placeholder="1000"
                    className="bg-[#3A2F46]/50 border-purple-500/30 text-white"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handleMint}
                  disabled={mintLoading || !isConnected}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {mintLoading ? "Minting Tokens..." : "Mint Tokens"}
                </Button>
              </CardFooter>
            </Card>
          </div>

          {distributorAddress && (
            <div className="mt-8">
              <Separator className="bg-purple-500/20" />
              <Card className="bg-[#2A1F36]/80 border-purple-500/20 backdrop-blur-sm mt-4">
                <CardHeader>
                  <CardTitle className="text-white">Airdrop Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-white">
                      <span className="font-semibold">Distributor Address:</span>{" "}
                      {distributorAddress}
                    </p>
                    <p className="text-gray-400 text-sm">
                      Save this address to interact with the airdrop contract.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </DashBoardLayout>
  );
}