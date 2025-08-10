"use client";
import React, { useState, useEffect } from "react";
import { useWallet } from "../../../../contexts/WalletContext";
import {
  useReadContract,
  useReadContracts,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { Abi } from "viem";
import StrataForgeAdminABI from "../../../../app/components/ABIs/StrataForgeAdminABI.json";
import AdminDashboardLayout from "../AdminDashboardLayout";

const ADMIN_CONTRACT_ADDRESS =
  "0xFEc4e9718B1dfef72Db183f3e30b418762B674C4" as const;
const adminABI = StrataForgeAdminABI as Abi;

interface AirdropFeeTier {
  minRecipients: number;
  maxRecipients: number;
  feeUSD: number;
}

type AirdropFeeResult = [bigint, bigint, bigint]; // [minRecipients, maxRecipients, feeUSD]

const FeeManagement = () => {
  const { address, isConnected } = useWallet();
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [newFeatureFee, setNewFeatureFee] = useState("");
  const [newAirdropTiers, setNewAirdropTiers] = useState<AirdropFeeTier[]>([]);
  const [recipientCount, setRecipientCount] = useState("");
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined);
  const [isFeatureFeeLoading, setIsFeatureFeeLoading] = useState(false);
  const [isAirdropFeesLoading, setIsAirdropFeesLoading] = useState(false);

  // Wagmi write contract hook
  const { writeContract, error: writeError } = useWriteContract();

  // Wait for transaction receipt
  const { isLoading: isTxConfirming, isSuccess: isTxSuccess } =
    useWaitForTransactionReceipt({
      hash: txHash,
    });

  // Get admin count
  const {
    data: adminCount,
    error: adminCountError,
    isLoading: adminCountLoading,
    isSuccess: adminCountSuccess,
  } = useReadContract({
    address: ADMIN_CONTRACT_ADDRESS,
    abi: adminABI,
    functionName: "adminCount",
    query: { enabled: isConnected, retry: 3, retryDelay: 1000 },
  });

  // Get feature fee
  const {
    data: featureFee,
    error: featureFeeError,
    isLoading: featureFeeLoading,
  } = useReadContract({
    address: ADMIN_CONTRACT_ADDRESS,
    abi: adminABI,
    functionName: "featureFeeUSD", // <-- FIX: Changed from "featureFee"
    query: { enabled: isConnected, retry: 3, retryDelay: 1000 },
  });

  // Get airdrop fee tiers
  const {
    data: airdropFees,
    error: airdropFeesError,
    isLoading: airdropFeesLoading,
  } = useReadContracts({
    contracts: Array.from({ length: 10 }, (_, i) => ({
      address: ADMIN_CONTRACT_ADDRESS,
      abi: adminABI,
      functionName: "airdropFees",
      args: [i],
    })),
    query: { enabled: isConnected, retry: 3, retryDelay: 1000 },
  });

  // Get airdrop fee for a specific recipient count
  const {
    data: airdropFeeUSD,
    error: airdropFeeUSDError,
    isLoading: airdropFeeUSDLoading,
    refetch: refetchAirdropFeeUSD,
  } = useReadContract({
    address: ADMIN_CONTRACT_ADDRESS,
    abi: adminABI,
    functionName: "getAirdropFeeUSD",
    args: [recipientCount ? BigInt(recipientCount) : BigInt(0)],
    query: {
      enabled: isConnected && !!recipientCount && Number(recipientCount) > 0,
      retry: 3,
      retryDelay: 1000,
    },
  });

  const {
    data: airdropFeeETH,
    error: airdropFeeETHError,
    isLoading: airdropFeeETHLoading,
    refetch: refetchAirdropFeeETH,
  } = useReadContract({
    address: ADMIN_CONTRACT_ADDRESS,
    abi: adminABI,
    functionName: "getAirdropFeeETH",
    args: [recipientCount ? BigInt(recipientCount) : BigInt(0)],
    query: {
      enabled: isConnected && !!recipientCount && Number(recipientCount) > 0,
      retry: 3,
      retryDelay: 1000,
    },
  });

  // Create array of admin read calls
  const adminChecks = React.useMemo(() => {
    if (!adminCount || !isConnected || !adminCountSuccess) return [];
    const count = Number(adminCount);
    return Array.from({ length: count }, (_, i) => ({
      address: ADMIN_CONTRACT_ADDRESS as `0x${string}`,
      abi: adminABI,
      functionName: "admin" as const,
      args: [i] as const,
    }));
  }, [adminCount, isConnected, adminCountSuccess]);

  const {
    data: adminAddresses,
    error: adminAddressesError,
    isLoading: adminAddressesLoading,
    isSuccess: adminAddressesSuccess,
  } = useReadContracts({
    contracts: adminChecks,
    query: { enabled: adminChecks.length > 0, retry: 3, retryDelay: 1000 },
  });

  // Check admin status
  useEffect(() => {
    if (
      !address ||
      !adminAddressesSuccess ||
      !adminAddresses ||
      adminAddresses.length === 0
    ) {
      if (!adminCountLoading && !adminAddressesLoading && adminCountSuccess) {
        setLoading(false);
      }
      return;
    }

    let isAdminUser = false;
    for (let i = 0; i < adminAddresses.length; i++) {
      const result = adminAddresses[i];
      if (result?.status === "success" && result.result) {
        const adminAddress = result.result as string;
        if (
          adminAddress &&
          adminAddress.toLowerCase() === address?.toLowerCase()
        ) {
          isAdminUser = true;
          break;
        }
      }
    }

    setIsAdmin(isAdminUser);
    setLoading(false);
  }, [
    address,
    adminAddresses,
    adminAddressesSuccess,
    adminCountLoading,
    adminAddressesLoading,
    adminCountSuccess,
  ]);

  // Format fees from 8 decimals to USD
  const formatFee = (fee: bigint | undefined) => {
    if (!fee) return "0.00";
    return (Number(fee) / 10 ** 8).toFixed(2);
  };

  // Format ETH fees
  const formatETH = (fee: bigint | undefined) => {
    if (!fee) return "0.0";
    return (Number(fee) / 10 ** 18).toFixed(6);
  };

  // Sync newAirdropTiers with contract data
  useEffect(() => {
    if (airdropFees && !airdropFeesError && !airdropFeesLoading) {
      const validTiers = airdropFees
        .map((tier) => {
          if (tier?.status === "success" && tier.result) {
            const [minRecipients, maxRecipients, feeUSD] =
              tier.result as AirdropFeeResult;
            return {
              minRecipients: Number(minRecipients),
              maxRecipients: Number(maxRecipients),
              feeUSD: Number(feeUSD) / 10 ** 8,
            };
          }
          return null;
        })
        .filter((tier): tier is AirdropFeeTier => tier !== null);
      if (validTiers.length > 0) {
        setNewAirdropTiers(validTiers);
      } else if (newAirdropTiers.length === 0) {
        setNewAirdropTiers([{ minRecipients: 0, maxRecipients: 0, feeUSD: 0 }]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [airdropFees, airdropFeesError, airdropFeesLoading]);

  // Handle errors
  useEffect(() => {
    const errors: string[] = [];
    if (adminCountError) errors.push("Failed to load admin count");
    if (adminAddressesError) errors.push("Failed to load admin addresses");
    if (featureFeeError) errors.push("Failed to load feature fee");
    if (airdropFeesError) errors.push("Failed to load airdrop fee tiers");
    if (airdropFeeUSDError) errors.push("Failed to load airdrop fee in USD");
    if (airdropFeeETHError) errors.push("Failed to load airdrop fee in ETH");
    if (writeError) {
      const errorMessage = writeError.message.includes("NotAdmin")
        ? "Only admins can perform this action"
        : writeError.message.includes("InvalidAmount")
        ? "Fees must be greater than zero"
        : writeError.message.includes("InvalidRecipientCount")
        ? "Invalid recipient count"
        : "Transaction failed";
      errors.push(errorMessage);
    }

    setError(errors.join(", "));
    if (
      !adminCountLoading &&
      !adminAddressesLoading &&
      !featureFeeLoading &&
      !airdropFeesLoading &&
      !airdropFeeUSDLoading &&
      !airdropFeeETHLoading &&
      !isTxConfirming
    ) {
      setLoading(false);
    }
  }, [
    adminCountError,
    adminAddressesError,
    featureFeeError,
    airdropFeesError,
    airdropFeeUSDError,
    airdropFeeETHError,
    writeError,
    adminCountLoading,
    adminAddressesLoading,
    featureFeeLoading,
    airdropFeesLoading,
    airdropFeeUSDLoading,
    airdropFeeETHLoading,
    isTxConfirming,
  ]);

  // Handle transaction success
  useEffect(() => {
    if (isTxSuccess && txHash) {
      setNewFeatureFee("");
      setNewAirdropTiers([]);
      setTxHash(undefined);
    }
  }, [isTxSuccess, txHash]);

  // Set feature fee
  const handleSetFeatureFee = () => {
    const featureFeeValue = parseFloat(newFeatureFee);
    if (!featureFeeValue || featureFeeValue <= 0) {
      setError("Please enter a valid, non-zero feature fee");
      return;
    }

    const featureFeeWei = BigInt(Math.round(featureFeeValue * 10 ** 8));
    setIsFeatureFeeLoading(true);
    writeContract(
      {
        address: ADMIN_CONTRACT_ADDRESS,
        abi: adminABI,
        functionName: "setFeatureFee",
        args: [featureFeeWei],
      },
      {
        onSuccess: (hash) => {
          setTxHash(hash);
          setIsFeatureFeeLoading(false);
        },
        onError: () => {
          setIsFeatureFeeLoading(false);
        },
      }
    );
  };

  // Set airdrop fee tiers
  const handleSetAirdropFees = () => {
    for (const tier of newAirdropTiers) {
      if (
        !tier.minRecipients ||
        !tier.maxRecipients ||
        !tier.feeUSD ||
        tier.feeUSD <= 0 ||
        tier.minRecipients > tier.maxRecipients
      ) {
        setError("Invalid airdrop fee tier configuration");
        return;
      }
    }

    const formattedTiers = newAirdropTiers.map((tier) => ({
      minRecipients: BigInt(tier.minRecipients),
      maxRecipients: BigInt(tier.maxRecipients),
      feeUSD: BigInt(Math.round(tier.feeUSD * 10 ** 8)),
    }));

    setIsAirdropFeesLoading(true);
    writeContract(
      {
        address: ADMIN_CONTRACT_ADDRESS,
        abi: adminABI,
        functionName: "setAirdropFees",
        args: [formattedTiers],
      },
      {
        onSuccess: (hash) => {
          setTxHash(hash);
          setIsAirdropFeesLoading(false);
        },
        onError: () => {
          setIsAirdropFeesLoading(false);
        },
      }
    );
  };

  // Query airdrop fee
  const handleQueryAirdropFee = () => {
    const count = parseInt(recipientCount);
    if (!count || count <= 0) {
      setError("Please enter a valid recipient count");
      return;
    }
    refetchAirdropFeeUSD();
    refetchAirdropFeeETH();
  };

  // Update airdrop tier input
  const handleAirdropTierChange = (
    index: number,
    field: keyof AirdropFeeTier,
    value: string
  ) => {
    const updatedTiers = [...newAirdropTiers];
    updatedTiers[index] = {
      ...updatedTiers[index],
      [field]: Number(value) || 0,
    };
    setNewAirdropTiers(updatedTiers);
  };

  // Add new airdrop tier
  const handleAddTier = () => {
    setNewAirdropTiers([
      ...newAirdropTiers,
      { minRecipients: 0, maxRecipients: 0, feeUSD: 0 },
    ]);
  };

  // Remove airdrop tier
  const handleRemoveTier = (index: number) => {
    const updatedTiers = newAirdropTiers.filter((_, i) => i !== index);
    if (updatedTiers.length === 0) {
      setNewAirdropTiers([{ minRecipients: 0, maxRecipients: 0, feeUSD: 0 }]);
    } else {
      setNewAirdropTiers(updatedTiers);
    }
  };

  // Loading Component
  const LoadingSpinner = () => (
    <div className="flex items-center justify-center min-h-screen bg-[#1A0D23] relative">
      <div className="text-center relative z-10">
        <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white text-lg">Loading fee management data...</p>
        {error && <p className="text-red-400 text-sm mt-2 max-w-md">{error}</p>}
      </div>
    </div>
  );

  // Wallet Connection Component
  const WalletConnection = () => (
    <div className="min-h-screen bg-[#1A0D23] flex items-center justify-center p-4 relative">
      <div className="bg-[#1E1425]/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-purple-500/20 p-8 text-center relative z-10">
        <h2 className="text-2xl font-bold text-white mb-2">
          Connect Your Wallet
        </h2>
        <p className="text-gray-300 mb-6">Connect your wallet to manage fees</p>
        <button
          onClick={() => document.querySelector("appkit-button")?.click()}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-xl hover:opacity-90 transition"
        >
          Connect Wallet
        </button>
      </div>
    </div>
  );

  // Unauthorized Access Component
  const UnauthorizedAccess = () => (
    <div className="min-h-screen bg-[#1A0D23] relative overflow-hidden flex items-center justify-center p-4">
      <div className="max-w-lg w-full relative z-10">
        <div className="bg-[#1E1425]/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-red-500/20 p-8 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Access Denied
            </h2>
            <p className="text-gray-300 mb-6">
              You are not authorized to manage fees
            </p>
          </div>
          <div className="bg-[#16091D]/60 backdrop-blur-sm rounded-xl p-4 mb-6 text-left space-y-2 border border-gray-700/30">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Connected Address:</span>
              <span className="font-mono text-gray-300 text-xs">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Admin Count:</span>
              <span className="font-mono text-gray-300">
                {adminCount ? Number(adminCount).toString() : "0"}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Network:</span>
              <span className="font-mono text-gray-300">Base Sepolia</span>
            </div>
            {error && (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Status:</span>
                  <span className="text-red-400 text-xs">Error</span>
                </div>
                <div className="text-xs text-red-400 mt-2 p-2 bg-red-500/10 rounded">
                  {error}
                </div>
              </>
            )}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="w-full px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            Reload Page
          </button>
        </div>
      </div>
    </div>
  );

  if (!isConnected) return <WalletConnection />;
  if (loading) return <LoadingSpinner />;
  if (!isAdmin) return <UnauthorizedAccess />;

  return (
    <AdminDashboardLayout>
      <div className="min-h-screen bg-[#1A0D23] p-4 md:p-8 relative">
        <div
          className="welcome-section text-center mb-8 rounded-lg p-6 relative z-10"
          style={{
            background:
              "radial-gradient(50% 206.8% at 50% 50%, rgba(10, 88, 116, 0.7) 0%, rgba(32, 23, 38, 0.7) 56.91%)",
          }}
        >
          <h1 className="font-poppins font-semibold text-3xl md:text-4xl leading-[170%] mb-2">
            Fee Management <span className="text-green-400">💰</span>
          </h1>
          <p className="font-vietnam font-normal text-base leading-[170%] tracking-[1%] text-[hsl(var(--foreground)/0.7)]">
            Configure feature and airdrop fee settings for the StrataForge
            platform.
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center space-x-3 relative z-10">
            <svg
              className="w-5 h-5 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-red-300 font-medium">{error}</p>
          </div>
        )}

        <div className="mb-10 relative z-10">
          <h2 className="font-poppins font-semibold text-xl md:text-2xl mb-6">
            Current Fees
          </h2>
          <div className="bg-[#1E1425]/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-purple-500/10 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-[#16091D]/60 rounded-xl">
              <h3 className="text-lg font-semibold text-white">
                Feature Fee (per feature)
              </h3>
              <p className="text-2xl font-bold text-green-400">
                ${formatFee(featureFee as bigint)}
              </p>
              <p className="text-gray-400 text-sm">
                USD per enabled token feature
              </p>
            </div>
            <div className="p-4 bg-[#16091D]/60 rounded-xl">
              <h3 className="text-lg font-semibold text-white mb-3">
                Airdrop Fee Tiers
              </h3>
              <div className="space-y-2">
                {airdropFees &&
                  airdropFees
                    .map((tier, index) => {
                      if (tier?.status === "success" && tier.result) {
                        const minRecipients =
                          Number((tier.result as AirdropFeeResult)[0]) || 0;
                        const maxRecipients = Number(
                          (tier.result as AirdropFeeResult)[1]
                        );
                        const feeAmount = formatFee(
                          (tier.result as AirdropFeeResult)[2]
                        );
                        const maxDisplay =
                          maxRecipients === Number.MAX_SAFE_INTEGER
                            ? "∞"
                            : maxRecipients.toString();

                        return (
                          <p key={index} className="text-gray-300 text-sm">
                            Tier {index + 1}: ${feeAmount} for {minRecipients} -{" "}
                            {maxDisplay} recipients
                          </p>
                        );
                      }
                      return null;
                    })
                    .filter((item): item is React.JSX.Element => item !== null)}
              </div>
            </div>
          </div>
        </div>

        <div className="mb-10 relative z-10">
          <h2 className="font-poppins font-semibold text-xl md:text-2xl mb-6">
            Set Feature Fee
          </h2>
          <div className="bg-[#1E1425]/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-purple-500/10">
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 mb-4">
              <input
                type="number"
                placeholder="Enter feature fee (e.g., 10)"
                value={newFeatureFee}
                onChange={(e) => setNewFeatureFee(e.target.value)}
                className="w-full md:flex-1 bg-[#16091D]/60 border border-gray-700/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
              />
              <button
                onClick={handleSetFeatureFee}
                disabled={isFeatureFeeLoading}
                className={`w-full md:w-auto px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 ${
                  isFeatureFeeLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isFeatureFeeLoading ? "Processing..." : "Set Feature Fee"}
              </button>
            </div>
          </div>
        </div>

        <div className="mb-10 relative z-10">
          <h2 className="font-poppins font-semibold text-xl md:text-2xl mb-6">
            Set Airdrop Fee Tiers
          </h2>
          <div className="bg-[#1E1425]/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-purple-500/10">
            {newAirdropTiers.map((tier, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 items-end"
              >
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">
                    Min Recipients
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 1"
                    value={tier.minRecipients || ""}
                    onChange={(e) =>
                      handleAirdropTierChange(
                        index,
                        "minRecipients",
                        e.target.value
                      )
                    }
                    className="w-full bg-[#16091D]/60 border border-gray-700/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">
                    Max Recipients
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 99"
                    value={tier.maxRecipients || ""}
                    onChange={(e) =>
                      handleAirdropTierChange(
                        index,
                        "maxRecipients",
                        e.target.value
                      )
                    }
                    className="w-full bg-[#16091D]/60 border border-gray-700/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">
                    Fee (USD)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 50"
                    value={tier.feeUSD || ""}
                    onChange={(e) =>
                      handleAirdropTierChange(index, "feeUSD", e.target.value)
                    }
                    className="w-full bg-[#16091D]/60 border border-gray-700/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
                  />
                </div>
                <div>
                  <button
                    onClick={() => handleRemoveTier(index)}
                    disabled={newAirdropTiers.length <= 1}
                    className={`w-full px-4 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition ${
                      newAirdropTiers.length <= 1
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <button
              onClick={handleAddTier}
              className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 mb-4 mr-4"
            >
              Add Airdrop Fee Tier
            </button>
            <button
              onClick={handleSetAirdropFees}
              disabled={isAirdropFeesLoading}
              className={`w-full md:w-auto px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 ${
                isAirdropFeesLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isAirdropFeesLoading ? "Processing..." : "Set Fees"}
            </button>
          </div>
        </div>

        <div className="mb-10 relative z-10">
          <h2 className="font-poppins font-semibold text-xl md:text-2xl mb-6">
            Query Airdrop Fee
          </h2>
          <div className="bg-[#1E1425]/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-purple-500/10">
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 mb-4">
              <input
                type="number"
                placeholder="Enter recipient count (e.g., 500)"
                value={recipientCount}
                onChange={(e) => setRecipientCount(e.target.value)}
                className="w-full md:flex-1 bg-[#16091D]/60 border border-gray-700/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
              />
              <button
                onClick={handleQueryAirdropFee}
                disabled={airdropFeeUSDLoading || airdropFeeETHLoading}
                className={`w-full md:w-auto px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 ${
                  airdropFeeUSDLoading || airdropFeeETHLoading
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                {airdropFeeUSDLoading || airdropFeeETHLoading
                  ? "Loading..."
                  : "Query Airdrop Fee"}
              </button>
            </div>
            {airdropFeeUSD && airdropFeeETH ? (
              <div className="p-4 bg-[#16091D]/60 rounded-xl">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Airdrop Fee Details
                </h3>
                <p className="text-gray-300">
                  <span className="font-medium">Fee (USD):</span> $
                  {formatFee(airdropFeeUSD as bigint)}
                </p>
                <p className="text-gray-300">
                  <span className="font-medium">Fee (ETH):</span>{" "}
                  {formatETH(airdropFeeETH as bigint)} ETH
                </p>
                <p className="text-gray-300">
                  <span className="font-medium">Recipient Count:</span>{" "}
                  {recipientCount}
                </p>
              </div>
            ) : null}
          </div>
        </div>

        {(isFeatureFeeLoading || isAirdropFeesLoading) && (
          <p className="text-yellow-400 text-sm mt-2 relative z-10">
            Transaction pending: {txHash}
          </p>
        )}
        {isTxSuccess && (
          <p className="text-green-400 text-sm mt-2 relative z-10">
            Fees updated successfully!
          </p>
        )}
      </div>
    </AdminDashboardLayout>
  );
};

export default FeeManagement;
