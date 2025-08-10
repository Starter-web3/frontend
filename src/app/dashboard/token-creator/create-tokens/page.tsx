"use client";
import React, { useState, useEffect } from "react";
import { useWallet } from "../../../../contexts/WalletContext";
import {
  useReadContract,
  useReadContracts,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { Abi, isAddress, decodeEventLog } from "viem";
import StrataForgeAdminABI from "../../../../app/components/ABIs/StrataForgeAdminABI.json";
import StrataForgeFactoryABI from "../../../../app/components/ABIs/StrataForgeFactoryABI.json";
import DashboardLayout from "../DashboardLayout";
import { useRouter } from "next/navigation";
import { useUsdEthPrice } from "../../../../hooks/useUsdEthPrice"; // Import Moralis hook

const ADMIN_CONTRACT_ADDRESS =
  "0xFEc4e9718B1dfef72Db183f3e30b418762B674C4" as const;
const FACTORY_CONTRACT_ADDRESS =
  "0x676EA6F52b4f27a164DaC428247e3458b74754b9" as const;
const adminABI = StrataForgeAdminABI as Abi;
const factoryABI = StrataForgeFactoryABI as Abi;

interface TokenData {
  id?: number;
  tokenAddress: string;
  name: string;
  symbol: string;
  initialSupply: bigint;
  timestamp: bigint;
  tokenType: bigint;
  creator: string;
}

interface WagmiContractResult {
  status: "success" | "failure";
  result?: unknown;
  error?: Error;
}

interface LogEntry {
  data: `0x${string}`;
  topics: `0x${string}`[];
}

interface TransactionReceipt {
  logs: LogEntry[];
}

interface DecodedEventArgs {
  tokenId?: bigint;
  [key: string]: unknown;
}

const tokenTypes = [
  { value: 0, label: "ERC-20" },
  { value: 1, label: "ERC-721" },
  { value: 2, label: "ERC-1155" },
  { value: 3, label: "Memecoin" },
  { value: 4, label: "Stablecoin" },
];

const featureOptions: { [key: number]: { label: string; value: string }[] } = {
  0: [
    { label: "Mint", value: "mint" },
    { label: "Burn", value: "burn" },
    { label: "Pause", value: "pause" },
    { label: "Transfer", value: "transfer" },
    { label: "Approve", value: "approve" },
    { label: "Transfer From", value: "transferFrom" },
    { label: "Increase Allowance", value: "increaseAllowance" },
    { label: "Decrease Allowance", value: "decreaseAllowance" },
    { label: "Burn From", value: "burnFrom" },
    { label: "Permit", value: "permit" },
    { label: "Grant Role", value: "grantRole" },
    { label: "Revoke Role", value: "revokeRole" },
    { label: "Renounce Role", value: "renounceRole" },
    { label: "Transfer Ownership", value: "transferOwnership" },
    { label: "Renounce Ownership", value: "renounceOwnership" },
  ],
  1: [
    { label: "Mint", value: "mint" },
    { label: "Mint with URI", value: "mintWithURI" },
    { label: "Burn", value: "burn" },
    { label: "Pause", value: "pause" },
    { label: "Set Base URI", value: "setBaseURI" },
    { label: "Approve", value: "approve" },
    { label: "Safe Mint", value: "safeMint" },
    { label: "Safe Mint with URI", value: "safeMintWithURI" },
    { label: "Set Approval For All", value: "setApprovalForAll" },
    { label: "Transfer From", value: "transferFrom" },
    { label: "Safe Transfer From", value: "safeTransferFrom" },
    { label: "Safe Transfers From", value: "safeTransfersFrom" },
    { label: "Set Token URI", value: "setTokenURI" },
    { label: "Grant Role", value: "grantRole" },
    { label: "Revoke Role", value: "revokeRole" },
    { label: "Renounce Role", value: "renounceRole" },
    { label: "Transfer Ownership", value: "transferOwnership" },
    { label: "Renounce Ownership", value: "renounceOwnership" },
  ],
  2: [
    { label: "Mint", value: "mint" },
    { label: "Burn", value: "burn" },
    { label: "Pause", value: "pause" },
    { label: "Set URI", value: "setURI" },
    { label: "Set Token URI", value: "setTokenURI" },
    { label: "Safe Transfer From", value: "safeTransferFrom" },
    { label: "Set Approval For All", value: "setApprovalForAll" },
    { label: "Mint Batch", value: "mintBatch" },
    { label: "Burn Batch", value: "burnBatch" },
    { label: "Safe Batch Transfer From", value: "safeBatchTransferFrom" },
    { label: "Grant Role", value: "grantRole" },
    { label: "Revoke Role", value: "revokeRole" },
    { label: "Renounce Role", value: "renounceRole" },
    { label: "Transfer Ownership", value: "transferOwnership" },
    { label: "Renounce Ownership", value: "renounceOwnership" },
  ],
  3: [
    { label: "Mint", value: "mint" },
    { label: "Burn", value: "burn" },
    { label: "Pause", value: "pause" },
    { label: "Set Max Wallet Size", value: "setMaxWalletSize" },
    { label: "Set Max Transaction Amount", value: "setMaxTransactionAmount" },
    { label: "Exclude From Limits", value: "excludeFromLimits" },
    { label: "Transfer", value: "transfer" },
    { label: "Approve", value: "approve" },
    { label: "Transfer From", value: "transferFrom" },
    { label: "Increase Allowance", value: "increaseAllowance" },
    { label: "Decrease Allowance", value: "decreaseAllowance" },
    { label: "Burn From", value: "burnFrom" },
    { label: "Grant Role", value: "grantRole" },
    { label: "Revoke Role", value: "revokeRole" },
    { label: "Transfer Ownership", value: "transferOwnership" },
  ],
  4: [
    { label: "Mint", value: "mint" },
    { label: "Redeem", value: "redeem" },
    { label: "Burn", value: "burn" },
    { label: "Pause", value: "pause" },
    { label: "Set Collateral Ratio", value: "setCollateralRatio" },
    { label: "Set Fees", value: "setFees" },
    { label: "Set Treasury", value: "setTreasury" },
    { label: "Transfer", value: "transfer" },
    { label: "Approve", value: "approve" },
    { label: "Transfer From", value: "transferFrom" },
    { label: "Increase Allowance", value: "increaseAllowance" },
    { label: "Decrease Allowance", value: "decreaseAllowance" },
    { label: "Burn From", value: "burnFrom" },
    { label: "Grant Role", value: "grantRole" },
    { label: "Transfer Ownership", value: "transferOwnership" },
  ],
};

const CreateTokensPage = () => {
  const { address, isConnected } = useWallet();
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [tokensLoading, setTokensLoading] = useState(false);
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();
  const [isTxPending, setIsTxPending] = useState(false);
  const [formData, setFormData] = useState({
    tokenType: "",
    name: "",
    symbol: "",
    initialSupply: "",
    decimals: "18",
    uri: "",
    maxWalletSize: "",
    maxTransactionAmount: "",
    collateralToken: "",
    collateralRatio: "",
    treasury: "",
    features: [] as string[],
  });

  // Moralis hook for ETH price
  const {
    usdPrice: ethPrice,
    loading: ethPriceLoading,
    error: ethPriceError,
  } = useUsdEthPrice();

  // Wagmi hooks
  const {
    writeContract,
    error: writeError,
    isPending: isWritePending,
  } = useWriteContract();
  const {
    isLoading: isTxConfirming,
    isSuccess: isTxSuccess,
    data: txReceipt,
  } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // Fetch feature fee in USD
  const {
    data: featureFee,
    error: featureFeeError,
    isLoading: featureFeeLoading,
  } = useReadContract({
    address: ADMIN_CONTRACT_ADDRESS,
    abi: adminABI,
    functionName: "featureFeeUSD", // UPDATED: Fetching USD value directly as per the admin file pattern
    query: { enabled: isConnected, retry: 3, retryDelay: 1000 },
  });

  // Fetch total token count
  const {
    data: totalTokens,
    error: tokenCountError,
    isLoading: tokenCountLoading,
  } = useReadContract({
    address: FACTORY_CONTRACT_ADDRESS,
    abi: factoryABI,
    functionName: "getTotalTokenCount",
    query: { enabled: isConnected && !!address, retry: 3, retryDelay: 1000 },
  });

  // Fetch all tokens
  const tokenPromises = React.useMemo(() => {
    if (!isConnected || !address || !totalTokens) return [];
    const count = Number(totalTokens);
    return Array.from({ length: count }, (_, i) => ({
      address: FACTORY_CONTRACT_ADDRESS,
      abi: factoryABI,
      functionName: "getTokenById",
      args: [BigInt(i + 1)],
    }));
  }, [totalTokens, isConnected, address]);

  const { data: tokenData } = useReadContracts({
    contracts: tokenPromises,
    query: { enabled: tokenPromises.length > 0 },
  });

  const [createdTokens, setCreatedTokens] = useState<TokenData[]>([]);

  useEffect(() => {
    if (tokenData) {
      const tokens =
        tokenData
          ?.filter(
            (result: WagmiContractResult) =>
              result.status === "success" && result.result
          )
          .map((result: WagmiContractResult, index) => {
            const token = result.result as TokenData;
            return token.creator.toLowerCase() === address?.toLowerCase()
              ? { ...token, id: index + 1 }
              : null;
          })
          .filter(
            (token): token is NonNullable<typeof token> & { id: number } =>
              token !== null
          ) || [];
      setCreatedTokens(tokens);
      setTokensLoading(false);
      setLoading(false);
    } else if (!isConnected || !address || !totalTokens) {
      setTokensLoading(false);
      setLoading(false);
    } else {
      setTokensLoading(true);
    }
  }, [tokenData, isConnected, address, totalTokens]);

  // Handle errors
  useEffect(() => {
    const errors: string[] = [];
    if (featureFeeError) errors.push("Failed to load feature fee");
    if (ethPriceError) errors.push("Failed to load ETH/USD price"); // Moralis error handling
    if (tokenCountError) errors.push("Failed to load token count");
    if (writeError) {
      const errorMessage = writeError.message.includes("InvalidName")
        ? "Invalid token name"
        : writeError.message.includes("InvalidSymbol")
        ? "Invalid token symbol"
        : writeError.message.includes("InvalidSupply")
        ? "Initial supply must be greater than 0"
        : writeError.message.includes("InvalidURI")
        ? "Invalid URI"
        : writeError.message.includes("InvalidCollateralToken")
        ? "Invalid collateral token address"
        : writeError.message.includes("InvalidTreasury")
        ? "Invalid treasury address"
        : writeError.message.includes("InvalidDecimals")
        ? "Decimals must be 18 or less"
        : writeError.message.includes("InvalidRatio")
        ? "Collateral ratio must be at least 10000"
        : writeError.message.includes("InsufficientPayment")
        ? "Insufficient ETH payment for features"
        : writeError.message.includes("FeatureNotEnabled")
        ? "Selected feature not enabled"
        : writeError.message.includes("ExceedsMaxTransaction")
        ? "Transaction amount exceeds max limit"
        : writeError.message.includes("ExceedsMaxWalletSize")
        ? "Wallet size exceeds max limit"
        : writeError.message.includes("InvalidCollateralAmount")
        ? "Invalid collateral amount"
        : writeError.message.includes("InsufficientCollateral")
        ? "Insufficient collateral deposited"
        : writeError.message.includes("InvalidFees")
        ? "Invalid mint or redeem fees"
        : writeError.message.includes("AlreadyInitialized")
        ? "Token already initialized"
        : "Transaction failed";
      errors.push(errorMessage);
    }
    setError(errors.join(", "));
    if (
      !featureFeeLoading &&
      !ethPriceLoading && // Moralis loading state
      !tokenCountLoading &&
      !isTxConfirming
    ) {
      setLoading(false);
      setIsTxPending(false);
    }
  }, [
    featureFeeError,
    ethPriceError, // Moralis error handling
    tokenCountError,
    writeError,
    featureFeeLoading,
    ethPriceLoading, // Moralis loading state
    tokenCountLoading,
    isTxConfirming,
  ]);

  // Handle transaction success
  useEffect(() => {
    if (isTxSuccess && txHash && txReceipt) {
      const receipt = txReceipt as TransactionReceipt;
      const tokenCreatedEvent = receipt.logs
        .map((log: LogEntry) => {
          try {
            const decoded = decodeEventLog({
              abi: factoryABI,
              data: log.data,
              topics: [...log.topics] as [`0x${string}`, ...`0x${string}`[]],
            });
            return decoded.args as unknown as DecodedEventArgs;
          } catch {
            return null;
          }
        })
        .find((event: DecodedEventArgs | null) => event && event.tokenId);

      if (tokenCreatedEvent && tokenCreatedEvent.tokenId) {
        router.push(
          `/dashboard/token-creator/create-tokens/manage-token/${tokenCreatedEvent.tokenId}`
        );
      }

      setTxHash(undefined);
      setIsTxPending(false);
      setFormData({
        tokenType: "",
        name: "",
        symbol: "",
        initialSupply: "",
        decimals: "18",
        uri: "",
        maxWalletSize: "",
        maxTransactionAmount: "",
        collateralToken: "",
        collateralRatio: "",
        treasury: "",
        features: [],
      });
    }
  }, [isTxSuccess, txHash, txReceipt, router]);

  // Form input handler
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (e.target.name === "tokenType") {
      setFormData({
        tokenType: e.target.value,
        name: "",
        symbol: "",
        initialSupply: "",
        decimals: e.target.value === "4" ? "6" : "18", // Stablecoin fixed at 6 decimals
        uri: "",
        maxWalletSize: "",
        maxTransactionAmount: "",
        collateralToken: "",
        collateralRatio: "",
        treasury: "",
        features: [],
      });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  // Feature selection handler
  const handleFeatureChange = (feature: string) => {
    setFormData((prev) => {
      const features = prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature];
      return { ...prev, features };
    });
  };

  // Convert USD to ETH with buffer for gas fees (Using Moralis price)
  const usdToEthWithBuffer = (usdAmount: bigint, featureCount: number) => {
    if (!ethPrice) return { display: "N/A", value: BigInt(0) };
    const usd = (Number(usdAmount) / 1e8) * featureCount; // Fees are in 8 decimals
    const ethAmount = usd / ethPrice;
    // Add 10% buffer for gas fees and price fluctuations
    const ethWithBuffer = ethAmount * 1.1;
    const ethWei = BigInt(Math.ceil(ethWithBuffer * 1e18)); // Convert to Wei
    return { display: ethAmount.toFixed(6), value: ethWei };
  };

  // Format feature fee
  const formatFeatureFee = (
    feeUSD: bigint | undefined,
    featureCount: number
  ) => {
    if (!feeUSD) return { usd: "0", eth: "N/A" };
    try {
      const usd = ((Number(feeUSD) / 1e8) * featureCount).toFixed(2);
      const ethDetails = usdToEthWithBuffer(feeUSD, featureCount);
      return { usd, eth: ethDetails.display };
    } catch (error) {
      console.error("Error formatting feature fee:", error);
      return { usd: "0", eth: "N/A" };
    }
  };

  // Create token
  const handleCreateToken = () => {
    const {
      tokenType,
      name,
      symbol,
      initialSupply,
      decimals,
      uri,
      maxWalletSize,
      maxTransactionAmount,
      collateralToken,
      collateralRatio,
      treasury,
      features,
    } = formData;
    if (!tokenType) {
      setError("Token type is required");
      return;
    }
    if (!address) {
      setError("Wallet not connected");
      return;
    }

    const tokenTypeNum = Number(tokenType);
    let functionName: string = "";
    let args: (string | bigint | number | boolean[])[] = [];
    let validationError: string | null = null;

    // Map features to boolean array based on token type
    const availableFeatures = featureOptions[tokenTypeNum] || [];
    const featureArray = availableFeatures.map((opt) =>
      features.includes(opt.value)
    );

    // Check if at least one feature is selected
    if (!featureArray.some(Boolean)) {
      setError("At least one feature must be selected");
      return;
    }

    // Calculate required payment with buffer
    const featureCount = featureArray.filter(Boolean).length;
    const ethDetails = usdToEthWithBuffer(featureFee as bigint, featureCount);

    if (tokenTypeNum === 0) {
      // ERC20
      if (!name || !symbol || !initialSupply || !decimals)
        validationError =
          "Name, symbol, initial supply, and decimals are required";
      if (Number(initialSupply) <= 0)
        validationError = "Initial supply must be greater than 0";
      if (Number(decimals) > 18)
        validationError = "Decimals must be 18 or less";
      functionName = "createERC20";
      args = [
        name,
        symbol,
        BigInt(initialSupply),
        Number(decimals),
        featureArray,
      ];
    } else if (tokenTypeNum === 1) {
      // ERC721
      if (!name || !symbol) validationError = "Name and symbol are required";
      functionName = "createERC721";
      args = [name, symbol, featureArray];
    } else if (tokenTypeNum === 2) {
      // ERC1155
      if (!uri) validationError = "URI is required";
      functionName = "createERC1155";
      args = [uri, featureArray];
    } else if (tokenTypeNum === 3) {
      // Memecoin
      if (
        !name ||
        !symbol ||
        !initialSupply ||
        !decimals ||
        !maxWalletSize ||
        !maxTransactionAmount
      )
        validationError =
          "Name, symbol, initial supply, decimals, max wallet size, and max transaction amount are required";
      if (Number(initialSupply) <= 0)
        validationError = "Initial supply must be greater than 0";
      if (Number(decimals) > 18)
        validationError = "Decimals must be 18 or less";
      if (Number(maxWalletSize) <= 0 || Number(maxTransactionAmount) <= 0)
        validationError =
          "Max wallet size and transaction amount must be greater than 0";
      functionName = "createMemecoin";
      args = [
        name,
        symbol,
        BigInt(initialSupply),
        Number(decimals),
        BigInt(maxWalletSize),
        BigInt(maxTransactionAmount),
        featureArray,
      ];
    } else if (tokenTypeNum === 4) {
      // Stablecoin
      if (!name || !symbol || !collateralToken || !collateralRatio || !treasury)
        validationError =
          "Name, symbol, collateral token, collateral ratio, and treasury are required";
      if (!isAddress(collateralToken))
        validationError = "Invalid collateral token address";
      if (!isAddress(treasury)) validationError = "Invalid treasury address";
      if (Number(collateralRatio) < 10000)
        validationError = "Collateral ratio must be at least 10000";
      functionName = "createStablecoin";
      args = [
        name,
        symbol,
        collateralToken,
        BigInt(collateralRatio),
        treasury,
        featureArray,
      ];
    } else {
      validationError = "Invalid token type";
    }

    if (validationError) {
      setError(validationError);
      return;
    }

    console.log("Transaction args:", {
      functionName,
      args,
      featureCount: featureArray.length,
      value: ethDetails.value.toString(),
    });

    setIsTxPending(true);
    writeContract(
      {
        address: FACTORY_CONTRACT_ADDRESS,
        abi: factoryABI,
        functionName,
        args,
        value: ethDetails.value,
      },
      {
        onSuccess: (hash: `0x${string}`) => {
          setTxHash(hash);
          localStorage.setItem(
            `tokenFeatures_${tokenTypeNum}`,
            JSON.stringify(featureArray)
          );
        },
        onError: (err) => {
          console.error("Write contract error:", err);
          setError(err.message || "Transaction failed");
          setIsTxPending(false);
        },
      }
    );
  };

  // Background Shapes
  const BackgroundShapes = () => (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute top-20 left-10 w-32 h-32 border border-purple-500/10 rounded-full"></div>
      <div className="absolute top-40 right-20 w-24 h-24 border border-blue-500/10 rotate-45"></div>
      <div className="absolute bottom-32 left-20 w-40 h-40 border border-purple-400/8 rounded-2xl rotate-12"></div>
      <div className="absolute top-1/3 left-1/4 w-16 h-16 border border-cyan-500/10 rotate-45"></div>
      <div className="absolute bottom-1/4 right-1/3 w-28 h-28 border border-purple-300/8 rounded-full"></div>
      <div className="absolute top-10 right-1/3 w-64 h-64 bg-gradient-to-br from-purple-500/3 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-gradient-to-tr from-blue-500/3 to-transparent rounded-full blur-3xl"></div>
    </div>
  );

  // Loading Spinner
  const LoadingSpinner = () => (
    <div className="flex items-center justify-center min-h-screen bg-[#1A0D23] relative">
      <BackgroundShapes />
      <div className="text-center relative z-10">
        <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white text-lg">Loading...</p>
        {error && (
          <p className="text-red-400 text-sm mt-2 max-w-md mx-auto">{error}</p>
        )}
      </div>
    </div>
  );

  // Wallet Connection
  const WalletConnection = () => (
    <div className="min-h-screen bg-[#1A0D23] flex items-center justify-center p-4 relative">
      <BackgroundShapes />
      <div className="bg-[#1E1425]/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-purple-500/20 p-8 text-center relative z-10">
        <h2 className="text-2xl font-bold text-white mb-2">
          Connect Your Wallet
        </h2>
        <p className="text-gray-300 mb-6">
          Connect your wallet to create tokens
        </p>
        <button
          onClick={() => {
            const button = document.querySelector(
              "appkit-button"
            ) as HTMLElement;
            button?.click();
          }}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-xl hover:opacity-90 transition"
        >
          Connect Wallet
        </button>
      </div>
    </div>
  );

  if (!isConnected) return <WalletConnection />;
  if (loading) return <LoadingSpinner />;

  const availableFeatures = featureOptions[Number(formData.tokenType)] || [];

  return (
    <DashboardLayout>
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
            Create Tokens <span className="text-purple-400">🚀</span>
          </h1>
          <p className="font-vietnam font-normal text-base leading-[170%] tracking-[1%] text-[hsl(var(--foreground)/0.7)]">
            Deploy your own tokens with StrataForge
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
            Create a New Token
          </h2>
          <div className="bg-[#1E1425]/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-purple-500/10">
            {/* Feature Fee Info */}
            <div className="mb-6 p-4 bg-[#16091D]/60 rounded-xl">
              <h3 className="text-lg font-semibold text-white mb-2">
                Feature Cost
              </h3>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">
                  Feature Fee (per feature):
                </span>
                <span className="font-mono text-gray-300">
                  ${formatFeatureFee(featureFee as bigint, 1).usd} (
                  {formatFeatureFee(featureFee as bigint, 1).eth} ETH)
                </span>
              </div>
              {formData.features.length > 0 && (
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-gray-400">
                    Total for {formData.features.length} Features:
                  </span>
                  <span className="font-mono text-orange-400">
                    $
                    {
                      formatFeatureFee(
                        featureFee as bigint,
                        formData.features.length
                      ).usd
                    }{" "}
                    (
                    {
                      formatFeatureFee(
                        featureFee as bigint,
                        formData.features.length
                      ).eth
                    }{" "}
                    ETH)
                  </span>
                </div>
              )}
            </div>

            {/* Token Type and Create Button Row */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <label className="text-gray-300 text-sm block mb-2">
                  Token Type
                </label>
                <select
                  name="tokenType"
                  value={formData.tokenType}
                  onChange={handleInputChange}
                  className="w-full h-12 p-3 bg-[#2A1B35] text-white rounded-lg border border-purple-500/20 focus:outline-none focus:border-purple-500"
                >
                  <option value="">Select Token Type</option>
                  {tokenTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleCreateToken}
                  disabled={isWritePending || isTxPending || isTxConfirming}
                  className={`h-12 px-6 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 whitespace-nowrap ${
                    isWritePending || isTxPending || isTxConfirming
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-gradient-to-r from-purple-500 to-blue-600 hover:shadow-xl hover:scale-105"
                  }`}
                >
                  {isWritePending || isTxPending || isTxConfirming
                    ? "Creating Token..."
                    : "Create Token"}
                </button>
              </div>
            </div>

            {/* Features Selection */}
            {formData.tokenType !== "" && (
              <div className="mb-6">
                <label className="text-gray-300 text-sm block mb-2">
                  Features
                </label>
                <div className="flex flex-wrap gap-4">
                  {availableFeatures.map((feature) => (
                    <label
                      key={feature.value}
                      className="flex items-center space-x-2"
                    >
                      <input
                        type="checkbox"
                        checked={formData.features.includes(feature.value)}
                        onChange={() => handleFeatureChange(feature.value)}
                        className="h-4 w-4 text-purple-500 bg-[#2A1B35] border border-purple-500/20 rounded focus:ring-purple-500"
                      />
                      <span className="text-gray-300">{feature.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Form Fields */}
            {formData.tokenType !== "" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[0, 1, 3, 4].includes(Number(formData.tokenType)) && (
                  <>
                    <div>
                      <label className="text-gray-300 text-sm">
                        Token Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full p-3 bg-[#2A1B35] text-white rounded-lg border border-purple-500/10 focus:outline-none focus:border-purple-500 transition"
                        placeholder="My Token"
                      />
                    </div>
                    <div>
                      <label className="text-gray-300 text-sm">
                        Token Symbol
                      </label>
                      <input
                        type="text"
                        name="symbol"
                        value={formData.symbol}
                        onChange={handleInputChange}
                        className="w-full p-3 bg-[#2A1B35] text-white rounded-lg border border-purple-500/10 focus:outline-none focus:border-purple-500 transition"
                        placeholder="MTK"
                      />
                    </div>
                  </>
                )}
                {[0, 3].includes(Number(formData.tokenType)) && (
                  <>
                    <div>
                      <label className="text-gray-300 text-sm">
                        Initial Supply
                      </label>
                      <input
                        type="number"
                        name="initialSupply"
                        value={formData.initialSupply}
                        onChange={handleInputChange}
                        className="w-full p-3 bg-[#2A1B35] text-white rounded-lg border border-purple-500/10 focus:outline-none focus:border-purple-500 transition"
                        placeholder="1000000"
                      />
                    </div>
                    <div>
                      <label className="text-gray-300 text-sm">Decimals</label>
                      <input
                        type="number"
                        name="decimals"
                        value={formData.decimals}
                        onChange={handleInputChange}
                        className="w-full p-3 bg-[#2A1B35] text-white rounded-lg border border-purple-500/10 focus:outline-none focus:border-purple-500 transition"
                        placeholder="18"
                        disabled={Number(formData.tokenType) === 4}
                      />
                    </div>
                  </>
                )}
                {Number(formData.tokenType) === 2 && (
                  <div>
                    <label className="text-gray-300 text-sm">URI</label>
                    <input
                      type="text"
                      name="uri"
                      value={formData.uri}
                      onChange={handleInputChange}
                      className="w-full p-3 bg-[#2A1B35] text-white rounded-lg border border-purple-500/10 focus:outline-none focus:border-purple-500 transition"
                      placeholder="https://example.com/metadata/{id}.json"
                    />
                  </div>
                )}
                {Number(formData.tokenType) === 3 && (
                  <>
                    <div>
                      <label className="text-gray-300 text-sm">
                        Max Wallet Size
                      </label>
                      <input
                        type="number"
                        name="maxWalletSize"
                        value={formData.maxWalletSize}
                        onChange={handleInputChange}
                        className="w-full p-3 bg-[#2A1B35] text-white rounded-lg border border-purple-500/10 focus:outline-none focus:border-purple-500 transition"
                        placeholder="1000000"
                      />
                    </div>
                    <div>
                      <label className="text-gray-300 text-sm">
                        Max Transaction Amount
                      </label>
                      <input
                        type="number"
                        name="maxTransactionAmount"
                        value={formData.maxTransactionAmount}
                        onChange={handleInputChange}
                        className="w-full p-3 bg-[#2A1B35] text-white rounded-lg border border-purple-500/10 focus:outline-none focus:border-purple-500 transition"
                        placeholder="100000"
                      />
                    </div>
                  </>
                )}
                {Number(formData.tokenType) === 4 && (
                  <>
                    <div>
                      <label className="text-gray-300 text-sm">
                        Collateral Token Address
                      </label>
                      <input
                        type="text"
                        name="collateralToken"
                        value={formData.collateralToken}
                        onChange={handleInputChange}
                        className="w-full p-3 bg-[#2A1B35] text-white rounded-lg border border-purple-500/10 focus:outline-none focus:border-purple-500 transition"
                        placeholder="0x..."
                      />
                    </div>
                    <div>
                      <label className="text-gray-300 text-sm">
                        Collateral Ratio
                      </label>
                      <input
                        type="number"
                        name="collateralRatio"
                        value={formData.collateralRatio}
                        onChange={handleInputChange}
                        className="w-full p-3 bg-[#2A1B35] text-white rounded-lg border border-purple-500/10 focus:outline-none focus:border-purple-500 transition"
                        placeholder="10000"
                      />
                    </div>
                    <div>
                      <label className="text-gray-300 text-sm">Treasury</label>
                      <input
                        type="text"
                        name="treasury"
                        value={formData.treasury}
                        onChange={handleInputChange}
                        className="w-full p-3 bg-[#2A1B35] text-white rounded-lg border border-purple-500/10 focus:outline-none focus:border-purple-500 transition"
                        placeholder="0x..."
                      />
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mb-10 relative z-10">
          <h2 className="font-poppins font-semibold text-xl md:text-2xl mb-6">
            Your Created Tokens
          </h2>
          {tokensLoading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400">Loading tokens...</p>
            </div>
          ) : createdTokens.length === 0 ? (
            <p className="text-gray-400">No tokens created yet.</p>
          ) : (
            <div className="flex flex-wrap gap-6">
              {createdTokens.map((token, index) => (
                <div
                  key={index}
                  className="backdrop-blur-sm bg-white/10 rounded-xl p-6 shadow-lg border border-purple-500/20 hover:bg-white/15 transition-all duration-300 min-w-[250px] max-w-[350px] w-full"
                >
                  <div className="flex flex-col space-y-4">
                    <div className="truncate">
                      <p
                        className="text-white font-semibold text-lg"
                        title={token.name}
                      >
                        {token.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">
                        Symbol:{" "}
                        <span className="text-white font-medium">
                          {token.symbol}
                        </span>
                      </p>
                    </div>
                    <div className="truncate">
                      <p className="text-gray-400 text-sm">
                        Address:{" "}
                        <span
                          className="text-white font-mono text-xs"
                          title={token.tokenAddress}
                        >
                          {token.tokenAddress}
                        </span>
                      </p>
                    </div>
                    <div className="pt-2">
                      <span className="inline-flex px-4 py-1 bg-blue-500/20 text-blue-400 text-xs font-medium rounded-full truncate max-w-[100px] mb-4">
                        {tokenTypes.find(
                          (t) => t.value === Number(token.tokenType)
                        )?.label || "Unknown"}
                      </span>
                      <div className="w-full">
                        <button
                          className="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
                          onClick={() => {
                            router.push(
                              `/dashboard/token-creator/create-tokens/manage-token/${token.id}`
                            );
                          }}
                        >
                          Manage Token
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {isTxPending && txHash && (
          <p className="text-yellow-400 text-sm relative z-10">
            Transaction pending:{" "}
            <a
              href={`https://sepolia.basescan.org/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              {txHash}
            </a>
          </p>
        )}
        {isTxSuccess && (
          <p className="text-green-400 text-sm relative z-10">
            Token created successfully!
          </p>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CreateTokensPage;
