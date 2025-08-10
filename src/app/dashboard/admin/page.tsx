"use client";
import React, { useState, useEffect } from "react";
import { useWallet } from "../../../contexts/WalletContext";
import { useReadContract, useReadContracts } from "wagmi";
import { Abi } from "viem";
import StrataForgeAdminABI from "../../../app/components/ABIs/StrataForgeAdminABI.json";
import StrataForgeFactoryABI from "../../../app/components/ABIs/StrataForgeFactoryABI.json";
import StrataForgeAirdropFactoryABI from "../../../app/components/ABIs/StrataForgeAirdropFactoryABI.json";
import AdminDashboardLayout from "./AdminDashboardLayout";
import { useUsdEthPrice } from "../../../hooks/useUsdEthPrice"; // Added Moralis hook

const ADMIN_CONTRACT_ADDRESS =
  "0xFEc4e9718B1dfef72Db183f3e30b418762B674C4" as const;
const FACTORY_CONTRACT_ADDRESS =
  "0x676EA6F52b4f27a164DaC428247e3458b74754b9" as const;
const AIRDROP_FACTORY_ADDRESS =
  "0x5463D07280b6b6B503C69Af31956265a0Ef4AA13" as const;

const adminABI = StrataForgeAdminABI as Abi;
const factoryABI = StrataForgeFactoryABI as Abi;
const airdropFactoryABI = StrataForgeAirdropFactoryABI as Abi;

const AdminDashboard = () => {
  const { address, isConnected } = useWallet();
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminIndex, setAdminIndex] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch ETH/USD price from Moralis
  const {
    usdPrice: ethPrice,
    loading: ethPriceLoading,
    error: ethPriceError,
  } = useUsdEthPrice();

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

  // Get contract balance
  const {
    data: balance,
    error: balanceError,
    isLoading: balanceLoading,
  } = useReadContract({
    address: ADMIN_CONTRACT_ADDRESS,
    abi: adminABI,
    functionName: "getBalance",
    query: { enabled: isConnected, retry: 3, retryDelay: 1000 },
  });

  // Get total tokens created
  const {
    data: totalTokens,
    error: totalTokensError,
    isLoading: totalTokensLoading,
  } = useReadContract({
    address: FACTORY_CONTRACT_ADDRESS,
    abi: factoryABI,
    functionName: "getTotalTokenCount",
    query: { enabled: isConnected, retry: 3, retryDelay: 1000 },
  });

  // Get total airdrops created
  const {
    data: totalAirdrops,
    error: totalAirdropsError,
    isLoading: totalAirdropsLoading,
  } = useReadContract({
    address: AIRDROP_FACTORY_ADDRESS,
    abi: airdropFactoryABI,
    functionName: "getAirdropCount",
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
    functionName: "featureFeeUSD",
    query: { enabled: isConnected, retry: 3, retryDelay: 1000 },
  });

  // Get airdrop fee tiers
  const airdropTierCalls = React.useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => ({
      address: ADMIN_CONTRACT_ADDRESS as `0x${string}`,
      abi: adminABI,
      functionName: "airdropFees" as const,
      args: [i] as const,
    }));
  }, []);

  const {
    data: airdropFeeTiers,
    error: airdropFeesError,
    isLoading: airdropFeesLoading,
  } = useReadContracts({
    contracts: airdropTierCalls,
    query: { enabled: isConnected, retry: 3, retryDelay: 1000 },
  });

  // Get proposal counter
  const {
    data: proposalCounter,
    error: proposalCounterError,
    isLoading: proposalCounterLoading,
  } = useReadContract({
    address: ADMIN_CONTRACT_ADDRESS,
    abi: adminABI,
    functionName: "proposalCounter",
    query: { enabled: isConnected, retry: 3, retryDelay: 1000 },
  });
  void proposalCounter;

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
    let userAdminIndex = null;

    for (let i = 0; i < adminAddresses.length; i++) {
      const result = adminAddresses[i];
      if (result?.status === "success" && result.result) {
        const adminAddress = result.result as string;
        if (
          adminAddress &&
          adminAddress.toLowerCase() === address.toLowerCase()
        ) {
          isAdminUser = true;
          userAdminIndex = i;
          break;
        }
      }
    }

    setIsAdmin(isAdminUser);
    setAdminIndex(userAdminIndex);
    setLoading(false);
  }, [
    address,
    adminAddresses,
    adminAddressesSuccess,
    adminCountLoading,
    adminAddressesLoading,
    adminCountSuccess,
  ]);

  // Handle errors
  useEffect(() => {
    const errors: string[] = [];
    if (adminCountError) errors.push("Failed to load admin count");
    if (balanceError) errors.push("Failed to load contract balance");
    if (totalTokensError) errors.push("Failed to load total tokens");
    if (totalAirdropsError) errors.push("Failed to load total airdrops");
    if (adminAddressesError) errors.push("Failed to load admin addresses");
    if (featureFeeError) errors.push("Failed to load feature fee");
    if (airdropFeesError) errors.push("Failed to load airdrop fees");
    if (proposalCounterError) errors.push("Failed to load proposal counter");
    if (ethPriceError) errors.push("Failed to load ETH/USD price"); // Updated for Moralis
    if (errors.length > 0 && !adminAddressesSuccess && !adminCountSuccess) {
      setError(errors.join(", "));
    } else {
      setError("");
    }

    if (
      !adminCountLoading &&
      !balanceLoading &&
      !totalTokensLoading &&
      !totalAirdropsLoading &&
      !adminAddressesLoading &&
      !featureFeeLoading &&
      !airdropFeesLoading &&
      !proposalCounterLoading &&
      !ethPriceLoading // Added Moralis loading
    ) {
      setLoading(false);
    }
  }, [
    adminCountError,
    balanceError,
    totalTokensError,
    totalAirdropsError,
    adminAddressesError,
    featureFeeError,
    airdropFeesError,
    proposalCounterError,
    ethPriceError, // Updated for Moralis
    adminCountLoading,
    balanceLoading,
    totalTokensLoading,
    totalAirdropsLoading,
    adminAddressesLoading,
    featureFeeLoading,
    airdropFeesLoading,
    proposalCounterLoading,
    ethPriceLoading, // Added Moralis loading
    adminAddressesSuccess,
    adminCountSuccess,
  ]);

  // Loading timeout
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        setError("Loading timed out. Please try again.");
        setLoading(false);
      }
    }, 10000);
    return () => clearTimeout(timeout);
  }, [loading]);

  // Format balance
  const formatBalance = (balanceWei: bigint | undefined) => {
    if (!balanceWei) return { eth: "0", usd: "0" };
    try {
      const eth = (Number(balanceWei) / 1e18).toFixed(4);
      const usd = ethPrice
        ? ((Number(balanceWei) / 1e18) * ethPrice).toFixed(2)
        : "N/A";
      return { eth, usd };
    } catch (error) {
      console.error("Error formatting balance:", error);
      return { eth: "0", usd: "0" };
    }
  };

  // Format feature fee (USD with 8 decimals)
  const formatFeatureFee = (feeUSD: bigint | undefined) => {
    if (!feeUSD) return { usd: "0", eth: "0" };
    try {
      const usd = (Number(feeUSD) / 1e8).toFixed(2);
      const eth = ethPrice
        ? (Number(feeUSD) / 1e8 / ethPrice).toFixed(6)
        : "N/A";
      return { usd, eth };
    } catch (error) {
      console.error("Error formatting feature fee:", error);
      return { usd: "0", eth: "0" };
    }
  };

  // Format airdrop fee
  const formatAirdropFee = (feeUSD: bigint | undefined) => {
    if (!feeUSD) return { usd: "0", eth: "0" };
    try {
      const usd = (Number(feeUSD) / 1e8).toFixed(2);
      const eth = ethPrice
        ? (Number(feeUSD) / 1e8 / ethPrice).toFixed(6)
        : "N/A";
      return { usd, eth };
    } catch (error) {
      console.error("Error formatting airdrop fee:", error);
      return { usd: "0", eth: "0" };
    }
  };

  // Background Shapes Component
  const BackgroundShapes = () => (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute top-20 left-10 w-32 h-32 border border-purple-500/10 rounded-full"></div>
      <div className="absolute top-40 right-20 w-24 h-24 border border-blue-500/10 rotate-45"></div>
      <div className="absolute bottom-32 left-20 w-40 h-40 border border-purple-400/8 rounded-2xl rotate-12"></div>
      <div className="absolute top-1/3 left-1/4 w-16 h-16 border border-cyan-500/10 rotate-45"></div>
      <div className="absolute bottom-1/4 right-1/3 w-28 h-28 border border-purple-300/8 rounded-full"></div>
      <div className="absolute top-1/4 right-1/4">
        <div className="grid grid-cols-4 gap-3">
          {[...Array(16)].map((_, i) => (
            <div
              key={i}
              className="w-1 h-1 bg-purple-500/10 rounded-full"
            ></div>
          ))}
        </div>
      </div>
      <div className="absolute bottom-1/3 left-1/3">
        <div className="grid grid-cols-3 gap-4">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="w-1 h-1 bg-blue-500/10 rounded-full"></div>
          ))}
        </div>
      </div>
      <svg
        className="absolute top-0 left-0 w-full h-full"
        viewBox="0 0 1200 800"
      >
        <path
          d="M200,100 Q400,50 600,100 T1000,100"
          stroke="rgba(147, 51, 234, 0.06)"
          strokeWidth="1"
          fill="none"
        />
        <path
          d="M100,300 Q300,250 500,300 T900,300"
          stroke="rgba(59, 130, 246, 0.06)"
          strokeWidth="1"
          fill="none"
        />
        <path
          d="M300,500 Q500,450 700,500 T1100,500"
          stroke="rgba(147, 51, 234, 0.08)"
          strokeWidth="1"
          fill="none"
        />
      </svg>
      <div className="absolute top-2/3 right-10">
        <svg width="80" height="80" viewBox="0 0 80 80">
          <polygon
            points="40,10 65,25 65,55 40,70 15,55 15,25"
            stroke="rgba(147, 51, 234, 0.08)"
            strokeWidth="1"
            fill="none"
          />
          <polygon
            points="40,20 55,30 55,50 40,60 25,50 25,30"
            stroke="rgba(59, 130, 246, 0.06)"
            strokeWidth="1"
            fill="none"
          />
        </svg>
      </div>
      <div className="absolute top-1/2 left-10">
        <svg width="120" height="80" viewBox="0 0 120 80">
          <circle cx="20" cy="20" r="2" fill="rgba(147, 51, 234, 0.1)" />
          <circle cx="60" cy="15" r="2" fill="rgba(59, 130, 246, 0.1)" />
          <circle cx="100" cy="25" r="2" fill="rgba(147, 51, 234, 0.1)" />
          <circle cx="40" cy="50" r="2" fill="rgba(59, 130, 246, 0.1)" />
          <circle cx="80" cy="55" r="2" fill="rgba(147, 51, 234, 0.1)" />
          <line
            x1="20"
            y1="20"
            x2="60"
            y2="15"
            stroke="rgba(147, 51, 234, 0.06)"
            strokeWidth="1"
          />
          <line
            x1="60"
            y1="15"
            x2="100"
            y2="25"
            stroke="rgba(59, 130, 246, 0.06)"
            strokeWidth="1"
          />
          <line
            x1="20"
            y1="20"
            x2="40"
            y2="50"
            stroke="rgba(147, 51, 234, 0.06)"
            strokeWidth="1"
          />
          <line
            x1="60"
            y1="15"
            x2="80"
            y2="55"
            stroke="rgba(59, 130, 246, 0.06)"
            strokeWidth="1"
          />
          <line
            x1="40"
            y1="50"
            x2="80"
            y2="55"
            stroke="rgba(147, 51, 234, 0.06)"
            strokeWidth="1"
          />
        </svg>
      </div>
      <div className="absolute top-10 right-1/3 w-64 h-64 bg-gradient-to-br from-purple-500/3 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-gradient-to-tr from-blue-500/3 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 right-10 w-48 h-48 bg-gradient-to-bl from-cyan-500/2 to-transparent rounded-full blur-2xl"></div>
    </div>
  );

  // Loading Component
  const LoadingSpinner = () => (
    <div className="flex items-center justify-center min-h-screen bg-[#1A0D23] relative">
      <BackgroundShapes />
      <div className="text-center relative z-10">
        <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white text-lg">Loading admin dashboard...</p>
        {error && <p className="text-red-400 text-sm mt-2 max-w-md">{error}</p>}
      </div>
    </div>
  );

  // Wallet Connection Component
  const WalletConnection = () => (
    <div className="min-h-screen bg-[#1A0D23] flex items-center justify-center p-4 relative">
      <BackgroundShapes />
      <div className="bg-[#1E1425]/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-purple-500/20 p-8 text-center relative z-10">
        <h2 className="text-2xl font-bold text-white mb-2">
          Connect Your Wallet
        </h2>
        <p className="text-gray-300 mb-6">
          Connect your wallet to access the admin dashboard
        </p>
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
      <BackgroundShapes />
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
              You are not authorized to access the admin dashboard
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
              <span className="font-mono text-gray-300">
                Lisk Sepolia Testnet
              </span>
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

  // Stats Card Component
  const StatsCard = ({
    icon,
    title,
    value,
    subtitle,
    gradient,
  }: {
    icon: React.ReactNode;
    title: string;
    value: string;
    subtitle?: string;
    gradient: string;
  }) => (
    <div className="group relative overflow-hidden bg-[#1E1425]/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-purple-500/10 hover:border-purple-500/30">
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}
      ></div>
      <div className="relative p-6">
        <div className="flex items-center justify-between mb-4">
          <div
            className={`p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}
          >
            {icon}
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-white">{value}</p>
            {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-300">{title}</h3>
      </div>
    </div>
  );

  // Quick Action Card Component
  const QuickActionCard = ({
    icon,
    title,
    description,
    href,
    gradient,
  }: {
    icon: React.ReactNode;
    title: string;
    description: string;
    href: string;
    gradient: string;
  }) => {
    const getBorderAndTextColor = (gradient: string) => {
      if (gradient.includes("blue")) return "border-blue-500 text-blue-400";
      if (gradient.includes("green")) return "border-green-500 text-green-400";
      if (gradient.includes("purple"))
        return "border-purple-500 text-purple-400";
      return "border-gray-500 text-gray-400";
    };

    return (
      <div className="group relative overflow-hidden bg-[#1E1425]/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-purple-500/10 hover:border-purple-500/30">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}
        ></div>
        <div className="relative p-6">
          <div
            className={`inline-flex p-3 rounded-xl border-2 ${
              getBorderAndTextColor(gradient).split(" ")[0]
            } shadow-lg mb-4`}
          >
            <div className={getBorderAndTextColor(gradient).split(" ")[1]}>
              {icon}
            </div>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
          <p className="text-gray-400 mb-6 leading-relaxed">{description}</p>
          <a
            href={href}
            className={`inline-flex items-center px-6 py-3 border-2 ${getBorderAndTextColor(
              gradient
            )} font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 group`}
          >
            <span>Get Started</span>
            <svg
              className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        </div>
      </div>
    );
  };

  if (!isConnected) {
    return <WalletConnection />;
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAdmin) {
    return <UnauthorizedAccess />;
  }

  return (
    <AdminDashboardLayout>
      <div className="min-h-screen bg-[#1A0D23] p-4 md:p-8 relative">
        <BackgroundShapes />
        <div
          className="welcome-section text-center mb-8 rounded-lg p-6 relative z-10"
          style={{
            background:
              "radial-gradient(50% 206.8% at 50% 50%, rgba(10, 88, 116, 0.7) 0%, rgba(32, 23, 38, 0.7) 56.91%)",
          }}
        >
          <h1 className="font-poppins font-semibold text-3xl md:text-4xl leading-[170%] mb-2">
            Hi Admin <span className="text-yellow-400">⚡</span>
          </h1>
          <p className="font-vietnam font-normal text-base leading-[170%] tracking-[1%] text-[hsl(var(--foreground)/0.7)]">
            Manage your StrataForge platform with ease – secure and powerful!
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
            Platform Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <StatsCard
              icon={
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              }
              title="Contract Balance"
              value={`${formatBalance(balance as bigint).eth} ETH / $${
                formatBalance(balance as bigint).usd
              }`}
              subtitle="Available Funds"
              gradient="from-green-500 to-emerald-600"
            />
            <StatsCard
              icon={
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
              }
              title="Total Admins"
              value={adminCount ? Number(adminCount).toString() : "0"}
              subtitle="Active Administrators"
              gradient="from-blue-500 to-indigo-600"
            />
            <StatsCard
              icon={
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              }
              title="Total Tokens"
              value={totalTokens ? totalTokens.toString() : "0"}
              subtitle="Created on Platform"
              gradient="from-purple-500 to-pink-600"
            />
            <StatsCard
              icon={
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7v-2a3 3 0 005.356-1.857M17 20c0-2.5-3.5-4.5-5-4.5s-5 2-5 4.5m10-12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              }
              title="Total Airdrops"
              value={totalAirdrops ? totalAirdrops.toString() : "0"}
              subtitle="Created on Platform"
              gradient="from-cyan-500 to-teal-600"
            />
          </div>

          {/* Feature & Airdrop Fees - Full Width Row */}
          <div className="mb-6">
            <div className="relative overflow-hidden bg-[#1E1425]/80 backdrop-blur-sm rounded-2xl shadow-lg border border-purple-500/10">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-600 opacity-5"></div>
              <div className="relative p-6">
                <div className="flex items-center mb-6">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white ml-4">
                    Feature & Airdrop Fees
                  </h3>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Feature Fee Section */}
                  <div className="p-4">
                    <h4 className="text-lg font-medium text-white mb-1">
                      Feature Fee
                    </h4>
                    <p className="text-sm text-gray-400 mb-2">
                      Per token creation
                    </p>
                    <p className="text-2xl font-bold text-green-400">
                      ${formatFeatureFee(featureFee as bigint).usd}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFeatureFee(featureFee as bigint).eth} ETH
                    </p>
                  </div>
                  {/* Airdrop Fees Section */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-medium text-white">
                        Airdrop Fee Tiers
                      </h4>
                      <p className="text-sm text-gray-400">Recipient → Fee</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {airdropFeeTiers &&
                        airdropFeeTiers.map((tier, index) => {
                          if (tier?.status === "success" && tier.result) {
                            const [minRecipients, maxRecipients, feeUSD] =
                              tier.result as [bigint, bigint, bigint];
                            const { usd, eth } = formatAirdropFee(feeUSD);
                            const min = Number(minRecipients).toLocaleString();
                            const max =
                              maxRecipients ===
                              BigInt(
                                "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
                              )
                                ? "10,001+"
                                : Number(maxRecipients).toLocaleString();

                            return (
                              <div
                                key={index}
                                className="inline-flex items-center px-3 py-1.5 bg-black/20 backdrop-blur-sm rounded-lg"
                              >
                                <svg
                                  className="w-3 h-3 text-gray-300 mr-2"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7a2 2 0 11-4 0 2 2 0 014 0zM5 7a2 2 0 11-4 0 2 2 0 014 0z"
                                  />
                                </svg>
                                <span className="text-xs font-medium text-gray-300 mr-2">
                                  {min} - {max} :
                                </span>
                                <span className="text-xs font-bold text-orange-400">
                                  ${usd} ({eth} ETH)
                                </span>
                              </div>
                            );
                          }
                          return null;
                        })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-10 relative z-10">
          <h2 className="font-poppins font-semibold text-xl md:text-2xl mb-6">
            Account Information
          </h2>
          <div className="bg-[#1E1425]/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-purple-500/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 opacity-5">
              <svg viewBox="0 0 40 40" className="w-full h-full">
                <circle
                  cx="20"
                  cy="20"
                  r="15"
                  stroke="currentColor"
                  strokeWidth="1"
                  fill="none"
                />
                <circle
                  cx="20"
                  cy="20"
                  r="8"
                  stroke="currentColor"
                  strokeWidth="1"
                  fill="none"
                />
              </svg>
            </div>
            <div className="flex items-center justify-between mb-6 relative z-10">
              <h3 className="text-lg font-semibold text-white">
                Connected Wallet
              </h3>
              <div className="flex items-center space-x-2 bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-sm font-medium border border-green-500/20">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Authorized Admin</span>
              </div>
            </div>
            <div className="flex items-center justify-between relative z-10">
              <p className="font-mono text-gray-300 break-all">{address}</p>
              {adminIndex !== null && (
                <span className="ml-4 px-2 py-1 bg-purple-500/10 text-purple-400 rounded-md text-xs font-medium">
                  Admin #{adminIndex}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mb-10 relative z-10">
          <h2 className="font-poppins font-semibold text-xl md:text-2xl mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <QuickActionCard
              icon={
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
              }
              title="Manage Admins"
              description="Add, remove, or modify administrator permissions and access levels across the platform."
              href="/dashboard/admin/manage-admins"
              gradient="from-blue-500 to-indigo-600"
            />
            <QuickActionCard
              icon={
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              }
              title="Feature & Airdrop Fees"
              description="Configure feature pricing, airdrop fee tiers, and payment processing settings for the platform."
              href="/dashboard/admin/fee-management"
              gradient="from-green-500 to-emerald-600"
            />
            <QuickActionCard
              icon={
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              }
              title="Analytics & Reports"
              description="View detailed analytics, transaction history, fee collections, and generate comprehensive platform reports."
              href="/dashboard/admin/analytics"
              gradient="from-purple-500 to-pink-600"
            />
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default AdminDashboard;
