"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
// import { keccak256, solidityPacked } from 'ethers';

import { Button } from "../../../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../../../components/ui/card";
import { Input } from "../../../../../components/ui/input";
import { Label } from "../../../../../components/ui/label";
import { Alert, AlertDescription } from "../../../../../components/ui/alert";
import { ArrowLeft, Coins } from "lucide-react";
import DashBoardLayout from "../../token-creator/DashboardLayout";
import { verifyAddressEligibility } from "../../../../lib/merkle"; // Import from merkle.ts

type RecipientFile = {
  id: string;
  name: string;
  count: number;
  merkleRoot: string;
  distributorAddress?: string;
  recipients: { address: string; amount?: string; proof?: string[] }[];
  proofs: { [address: string]: string[] };
  isCustomDistribution?: boolean; // Add flag to indicate distribution type
};

const DISTRIBUTOR_ABI = [
  {
    inputs: [
      { internalType: "address", name: "token_", type: "address" },
      { internalType: "bytes32", name: "merkleRoot_", type: "bytes32" },
      { internalType: "uint8", name: "tokenType_", type: "uint8" },
      { internalType: "uint256", name: "dropAmount_", type: "uint256" },
      { internalType: "uint256[]", name: "tokenIds_", type: "uint256[]" },
      { internalType: "uint256", name: "tokenId_", type: "uint256" },
      { internalType: "uint32", name: "totalRecipients_", type: "uint32" },
      { internalType: "uint32", name: "startTime_", type: "uint32" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  { inputs: [], name: "AirdropNotStarted", type: "error" },
  { inputs: [], name: "AlreadyClaimed", type: "error" },
  { inputs: [], name: "InvalidProof", type: "error" },
  { inputs: [], name: "TransferFailed", type: "error" },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Claimed",
    type: "event",
  },
  {
    inputs: [{ internalType: "bytes32[]", name: "proof", type: "bytes32[]" }],
    name: "claim",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "claimedCount",
    outputs: [{ internalType: "uint32", name: "", type: "uint32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "dropAmount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getRemainingTokens",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getTokenIds",
    outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "hasClaimed",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "merkleRoot",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "token",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "tokenId",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "tokenType",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalRecipients",
    outputs: [{ internalType: "uint32", name: "", type: "uint32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "startTime",
    outputs: [{ internalType: "uint32", name: "", type: "uint32" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

const TOKEN_ABI = [
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "account", type: "address" },
      { internalType: "uint256", name: "id", type: "uint256" },
    ],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

export default function ClaimPage() {
  const { address, isConnected } = useAccount();
  const [distributorAddress, setDistributorAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const [airdropInfo, setAirdropInfo] = useState<{
    tokenAddress: string;
    dropAmount: string;
    startTime: string;
    merkleRoot: string;
    tokenType: number;
    tokenIds?: string[];
    tokenId?: string;
    decimals?: number;
    isCustomDistribution?: boolean;
  } | null>(null);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDistributorAddress(e.target.value);
    setError("");
    setSuccess("");
    setAirdropInfo(null);
  };

  const fetchAirdropInfo = async (address: string) => {
    try {
      if (!ethers.isAddress(address)) {
        setError("Invalid contract address");
        return;
      }

      setStatusMessage("Fetching airdrop details...");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(address, DISTRIBUTOR_ABI, provider);

      const [
        tokenAddress,
        dropAmount,
        merkleRoot,
        tokenType,
        tokenId,
        startTime,
      ] = await Promise.all([
        contract.token(),
        contract.dropAmount(),
        contract.merkleRoot(),
        contract.tokenType(),
        contract.tokenId(),
        contract.startTime(),
      ]);

      const tokenContract = new ethers.Contract(
        tokenAddress,
        TOKEN_ABI,
        provider
      );

      let decimals = 18;
      let formattedDropAmount = dropAmount.toString();

      if (Number(tokenType) === 0) {
        decimals = await tokenContract.decimals();
        formattedDropAmount = ethers.formatUnits(dropAmount, decimals);
      }

      let tokenIds: string[] | undefined;
      if (Number(tokenType) !== 0) {
        try {
          const ids = await contract.getTokenIds();
          tokenIds = ids.map((id: bigint) => id.toString());
        } catch (err) {
          console.warn("Could not fetch token IDs:", err);
        }
      }

      const startTimeDate = new Date(Number(startTime) * 1000);

      // Determine if it's a custom distribution by checking recipient file
      let isCustomDistribution = false;
      const stored = localStorage.getItem("recipientFiles");
      if (stored) {
        const files: RecipientFile[] = JSON.parse(stored);
        const matchingFile = files.find(
          (f) => f.distributorAddress?.toLowerCase() === address.toLowerCase()
        );
        if (matchingFile) {
          isCustomDistribution =
            matchingFile.isCustomDistribution ||
            matchingFile.recipients.some((r) => !!r.amount && r.amount !== "0");
        }
      }

      setAirdropInfo({
        tokenAddress,
        dropAmount: formattedDropAmount,
        startTime: startTimeDate.toLocaleString(),
        merkleRoot,
        tokenType: Number(tokenType),
        tokenIds,
        tokenId: tokenId.toString(),
        decimals,
        isCustomDistribution,
      });

      setStatusMessage("");
    } catch (err: unknown) {
      console.error("Error fetching airdrop info:", err);
      setError(
        "Failed to fetch airdrop information. Please check the contract address."
      );
      setStatusMessage("");
    }
  };

  useEffect(() => {
    if (distributorAddress && ethers.isAddress(distributorAddress)) {
      const timeoutId = setTimeout(() => {
        fetchAirdropInfo(distributorAddress);
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [distributorAddress]);

  const handleClaim = async () => {
    try {
      if (!window.ethereum) throw new Error("Please install MetaMask!");
      if (!isConnected || !address)
        throw new Error("Please connect your wallet!");
      if (!ethers.isAddress(distributorAddress))
        throw new Error("Invalid distributor address!");

      setLoading(true);
      setError("");
      setSuccess("");
      setStatusMessage("Starting claim...");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        distributorAddress,
        DISTRIBUTOR_ABI,
        signer
      );

      // Check if user has already claimed
      const hasClaimed = await contract.hasClaimed(address);
      if (hasClaimed) {
        throw new Error("You have already claimed your tokens");
      }

      // Check airdrop start time
      const startTime = await contract.startTime();
      if (Math.floor(Date.now() / 1000) < Number(startTime)) {
        throw new Error(
          `Airdrop not started. Starts at ${new Date(
            Number(startTime) * 1000
          ).toLocaleString()}`
        );
      }

      // Get recipient file and find user data
      const stored = localStorage.getItem("recipientFiles");
      if (!stored) throw new Error("Missing recipient file.");
      const files: RecipientFile[] = JSON.parse(stored);

      let userProof: string[] | null = null;
      let userAmount: string | undefined;
      const isCustomDistribution = airdropInfo?.isCustomDistribution ?? false;
      const lowerAddr = address.toLowerCase();

      const matchingFile = files.find(
        (f) => f.id.toLowerCase() === distributorAddress.toLowerCase()
      );
      if (!matchingFile)
        throw new Error(
          "No recipient file found for this distributor address."
        );

      if (matchingFile.proofs[lowerAddr]) {
        userProof = matchingFile.proofs[lowerAddr];
        const rec = matchingFile.recipients.find(
          (r) => r.address.toLowerCase() === lowerAddr
        );
        userAmount = rec?.amount;
      }

      if (!userProof) {
        throw new Error("Address not whitelisted for this airdrop");
      }

      console.log("User data:", {
        address: lowerAddr,
        amount: userAmount,
        hasProof: !!userProof,
        isCustomDistribution,
      });

      const tokenAddress = await contract.token();
      const tokenType = await contract.tokenType();
      const tokenId = await contract.tokenId();
      const dropAmount = await contract.dropAmount();
      const merkleRoot = await contract.merkleRoot();

      const tokenContract = new ethers.Contract(
        tokenAddress,
        TOKEN_ABI,
        provider
      );

      let decimals = 18;
      if (Number(tokenType) === 0) {
        decimals = await tokenContract.decimals();
      }

      // Check contract balance
      const contractBalance =
        Number(tokenType) === 0
          ? await tokenContract.balanceOf(distributorAddress)
          : await tokenContract.balanceOf(distributorAddress, tokenId);

      // Determine amount to use
      let userAmountWei = dropAmount; // Default to contract's dropAmount
      if (
        Number(tokenType) === 0 &&
        isCustomDistribution &&
        userAmount &&
        userAmount !== "0"
      ) {
        try {
          userAmountWei = ethers.parseUnits(userAmount, decimals);
        } catch (err) {
          console.error("parseUnits error:", err);
          throw new Error(`Invalid amount in recipient file: "${userAmount}"`);
        }
      } else if (Number(tokenType) !== 0) {
        // For NFTs, use quantity (default to 1 if not specified)
        userAmountWei =
          userAmount && userAmount !== "0"
            ? ethers.parseUnits(userAmount, 0)
            : BigInt(1);
      }

      if (contractBalance < userAmountWei) {
        throw new Error("Contract has insufficient balance.");
      }

      // Verify proof locally using merkle.ts
      setStatusMessage("Verifying Merkle proof...");
      const { eligible, proof } = verifyAddressEligibility(
        address,
        matchingFile.recipients.map((r) => ({
          address: r.address,
          amount: r.amount,
          proof: r.proof || [],
        })),
        merkleRoot,
        isCustomDistribution
      );

      if (!eligible || !proof) {
        throw new Error(
          "Invalid Merkle proof. Your address may not be whitelisted."
        );
      }

      // Ensure proof matches
      if (JSON.stringify(proof) !== JSON.stringify(userProof)) {
        console.warn("Proof mismatch:", { expected: proof, actual: userProof });
        userProof = proof; // Use the verified proof
      }

      // Debug contract and proof details
      console.log("Contract Info:", {
        tokenAddress,
        tokenType: Number(tokenType),
        tokenId: tokenId.toString(),
        dropAmount: dropAmount.toString(),
        userAmount: userAmountWei.toString(),
        merkleRoot,
        userAddress: address,
        userProof,
      });

      // Estimate gas
      setStatusMessage("Estimating gas...");
      const gasLimit = await contract.claim
        .estimateGas(userProof)
        .then((g: bigint) => (g * 12n) / 10n);

      // Submit claim transaction
      setStatusMessage("Submitting transaction...");
      const tx = await contract.claim(userProof, { gasLimit });

      setStatusMessage("Waiting for confirmation...");
      await tx.wait();

      setSuccess(`Claim successful! TX: ${tx.hash}`);
    } catch (err: unknown) {
      console.error("Claim error:", err);
      if (
        typeof err === "object" &&
        err !== null &&
        "code" in err &&
        (err as { code?: string }).code === "CALL_EXCEPTION"
      ) {
        const errorObj = err as { data?: string; message?: string };
        if (errorObj.data === "0x09bde339") {
          setError(
            "Invalid Merkle proof. Your address may not be whitelisted or the proof is incorrect."
          );
        } else if (errorObj.data === "0x646cf558") {
          setError("You have already claimed your tokens.");
        } else if (errorObj.data === "0x0963bd8a") {
          setError("This airdrop has not started yet.");
        } else if (errorObj.data === "0x90b8ec18") {
          setError(
            "Token transfer failed. The contract may not have sufficient tokens."
          );
        } else {
          setError(
            `Contract error: ${
              errorObj.data || errorObj.message || "Unknown error"
            }`
          );
        }
      } else if (
        typeof err === "object" &&
        err !== null &&
        "message" in err &&
        typeof (err as { message?: string }).message === "string"
      ) {
        setError((err as { message: string }).message);
      } else {
        setError("Unexpected error occurred");
      }
    } finally {
      setLoading(false);
      setStatusMessage("");
    }
  };

  return (
    <DashBoardLayout>
      <div className="bg-black/90 text-purple-100 min-h-screen">
        <header className="border-b border-purple-500/20 p-4">
          <div className="container flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Coins className="h-6 w-6" />
              <span className="text-xl font-bold">LaunchPad</span>
            </div>
          </div>
        </header>

        <main className="container py-8">
          <div className="mb-6 flex items-center">
            <Link href="/dashboard/airdrop-listing">
              <Button
                variant="ghost"
                className="text-purple-100 hover:bg-purple-500/10 hover:text-purple-200"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="ml-4 text-2xl font-bold">Claim Airdrop</h1>
          </div>

          <div className="max-w-2xl mx-auto">
            <Card className="bg-zinc-900 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-purple%x-100">
                  Claim Your Tokens
                </CardTitle>
                <CardDescription className="text-purple-100/70">
                  Enter your airdrop distributor address and claim your tokens
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="distributorAddress">
                    Distributor Address
                  </Label>
                  <Input
                    id="distributorAddress"
                    placeholder="0x..."
                    value={distributorAddress}
                    onChange={handleAddressChange}
                    className="mt-1.5 bg-purple-800/40 border-purple-500/20 focus:border-purple-500"
                  />
                </div>

                {airdropInfo && (
                  <div className="space-y-2 p-4 bg-purple-800/20 rounded-lg border border-purple-500/20">
                    <h3 className="text-lg font-semibold text-purple-100">
                      Airdrop Details
                    </h3>
                    <div className="space-y-1 text-sm">
                      <p>
                        <strong>Token Address:</strong>
                        <span className="font-mono text-xs ml-2">
                          {airdropInfo.tokenAddress}
                        </span>
                      </p>
                      <p>
                        <strong>Drop Amount:</strong> {airdropInfo.dropAmount}{" "}
                        {airdropInfo.tokenType === 0
                          ? "tokens"
                          : `NFTs (ID: ${airdropInfo.tokenId})`}
                      </p>
                      <p>
                        <strong>Start Time:</strong> {airdropInfo.startTime}
                      </p>
                      <p>
                        <strong>Merkle Root:</strong>
                        <span className="font-mono text-xs ml-2">
                          {airdropInfo.merkleRoot}
                        </span>
                      </p>
                      {airdropInfo.tokenType !== 0 && airdropInfo.tokenIds && (
                        <p>
                          <strong>Token IDs:</strong>{" "}
                          {airdropInfo.tokenIds.join(", ")}
                        </p>
                      )}
                      <p>
                        <strong>Distribution Type:</strong>{" "}
                        {airdropInfo.isCustomDistribution ? "Custom" : "Equal"}
                      </p>
                    </div>
                  </div>
                )}

                {statusMessage && (
                  <Alert className="bg-blue-500/10 border-blue-500/20">
                    <AlertDescription>{statusMessage}</AlertDescription>
                  </Alert>
                )}

                {error && (
                  <Alert className="bg-red-500/10 border-red-500/20">
                    <AlertDescription className="text-red-200">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="bg-green-500/10 border-green-500/20">
                    <AlertDescription className="text-green-200">
                      {success}
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  className="w-full bg-purple-500 hover:bg-purple-600 text-black font-semibold"
                  onClick={handleClaim}
                  disabled={
                    !distributorAddress ||
                    loading ||
                    !isConnected ||
                    !airdropInfo
                  }
                >
                  {loading ? "Claiming..." : "Claim Airdrop"}
                </Button>

                {!isConnected && (
                  <p className="text-center text-purple-300 text-sm">
                    Please connect your wallet to claim tokens
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </DashBoardLayout>
  );
}
