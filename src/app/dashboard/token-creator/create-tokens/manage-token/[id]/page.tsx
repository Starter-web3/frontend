"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  useReadContract,
  // --- UPDATE: useReadContracts is no longer needed for fetching features
  useWriteContract,
  useAccount,
  useChainId,
} from "wagmi";
// --- UPDATE: keccak256 and toBytes are no longer needed on the frontend
import { Abi, isAddress, keccak256, toBytes } from "viem";
import DashboardLayout from "../../../DashboardLayout";
import StrataForgeERC20ImplementationABI from "../../../../../components/ABIs/StrataForgeERC20ImplementationABI.json";
import StrataForgeERC721ImplementationABI from "../../../../../components/ABIs/StrataForgeERC721ImplementationABI.json";
import StrataForgeERC1155ImplementationABI from "../../../../../components/ABIs/StrataForgeERC1155ImplementationABI.json";
import StrataForgeMemecoinImplementationABI from "../../../../../components/ABIs/StrataForgeMemecoinImplementationABI.json";
import StrataForgeStablecoinImplementationABI from "../../../../../components/ABIs/StrataForgeStablecoinImplementationABI.json";
import StrataForgeFactoryABI from "../../../../../components/ABIs/StrataForgeFactoryABI.json";

// Standard ERC-20 ABI for collateral approval
const ERC20_ABI = [
  {
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
];

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

interface TokenDetails {
  name: string;
  symbol: string;
  decimals?: number;
}

interface TokenInfo {
  tokenAddress: string;
  name: string;
  symbol: string;
  tokenType: bigint;
}

// const FACTORY_CONTRACT_ADDRESS =
//   "0xCa8Ba517fb2517575B853647EB304F59a935725f" as const;
// const BASE_SEPOLIA_CHAIN_ID = 84532;

const FACTORY_CONTRACT_ADDRESS =
  "0x676EA6F52b4f27a164DaC428247e3458b74754b9" as const;
const LISK_SEPOLIA_CHAIN_ID = 84532;

const ManageToken = () => {
  const { id: tokenId } = useParams<{ id: string }>();
  const { address: account } = useAccount();
  const chainId = useChainId();
  const [tokenType, setTokenType] = useState<
    "erc20" | "erc721" | "erc1155" | "meme" | "stable" | null
  >(null);
  const [tokenDetails, setTokenDetails] = useState<TokenDetails | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<string | null>(null);
  const [formInputs, setFormInputs] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [inputErrors, setInputErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const { writeContract, isPending, error: writeError } = useWriteContract();

  // Validate numeric input
  const validateNumber = (
    value: string,
    allowZero: boolean = true,
    field: string = ""
  ): string | null => {
    if (value === "") return allowZero ? null : "Value cannot be empty";
    const num = Number(value);
    if (isNaN(num)) return "Must be a valid number";
    if (num < 0) return "Number cannot be negative";
    if (!allowZero && num === 0) return "Number cannot be zero";
    if (field === "collateralRatio" && num < 10000)
      return "Collateral ratio must be at least 10000";
    if ((field === "mintFee" || field === "redeemFee") && num > 500)
      return "Fee cannot exceed 500";
    return null;
  };

  // Handle modal form input changes
  const handleInputChange = (
    key: string,
    value: string,
    isNumber: boolean = false,
    field: string = ""
  ) => {
    setFormInputs((prev) => ({
      ...prev,
      [key]: value,
    }));

    if (isNumber) {
      const error = validateNumber(value, true, field);
      setInputErrors((prev) => ({
        ...prev,
        [key]: error || "",
      }));
    } else {
      setInputErrors((prev) => ({
        ...prev,
        [key]:
          (key.includes("address") ||
            key.includes("Address") ||
            key.includes("treasury") ||
            key.includes("newOwner")) &&
          (!isAddress(value) ||
            value === "0x0000000000000000000000000000000000000000")
            ? "Invalid address"
            : "",
      }));
    }
  };

  // Approve collateral token for stablecoin mint
  const handleApproveCollateral = async (
    collateralToken: string,
    amount: bigint
  ) => {
    try {
      await writeContract({
        address: collateralToken as `0x${string}`,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [tokenAddress, amount],
        account: account as `0x${string}`,
      });
      return true;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to approve collateral"
      );
      return false;
    }
  };

  // Fetch TokenInfo from factory
  const {
    data: tokenInfo,
    error: tokenInfoError,
    isLoading: tokenInfoLoading,
  } = useReadContract({
    address: FACTORY_CONTRACT_ADDRESS,
    abi: StrataForgeFactoryABI as Abi,
    functionName: "getTokenById",
    args: [BigInt(tokenId || "0")],
    query: { enabled: !!tokenId && !isNaN(Number(tokenId)) },
  });

  // Extract tokenAddress and type
  const tokenAddress = tokenInfo ? (tokenInfo as TokenInfo).tokenAddress : null;
  const factoryTokenType = tokenInfo
    ? Number((tokenInfo as TokenInfo).tokenType)
    : null;

  // Map factory token type
  useEffect(() => {
    if (factoryTokenType !== null) {
      const typeMap: {
        [key: number]: "erc20" | "erc721" | "erc1155" | "meme" | "stable";
      } = {
        0: "erc20",
        1: "erc721",
        2: "erc1155",
        3: "meme",
        4: "stable",
      };
      setTokenType(typeMap[factoryTokenType] || null);
    }
  }, [factoryTokenType]);

  // ABIs for different token types
  const tokenABIs: Record<string, Abi> = {
    erc20: StrataForgeERC20ImplementationABI as Abi,
    erc721: StrataForgeERC721ImplementationABI as Abi,
    erc1155: StrataForgeERC1155ImplementationABI as Abi,
    meme: StrataForgeMemecoinImplementationABI as Abi,
    stable: StrataForgeStablecoinImplementationABI as Abi,
  };

  // --- REMOVED: Inefficient fetching of each feature one by one ---
  // const featureChecks = ...
  // const { data: enabledFeaturesFromMultipleCalls } = useReadContracts(...)

  // +++ ADDED: Single, efficient call to get the bool[] of features +++
  const { data: enabledFeatures, isLoading: featuresLoading } = useReadContract(
    {
      address: tokenAddress as `0x${string}`,
      // Provide a fallback ABI to prevent wagmi error before tokenType is set
      abi: tokenType
        ? tokenABIs[tokenType]
        : (StrataForgeERC20ImplementationABI as Abi),
      functionName: "getEnabledFeatures",
      query: { enabled: !!tokenAddress && !!tokenType },
    }
  );

  // Fetch collateral token for stablecoin
  const { data: collateralToken } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: tokenABIs.stable,
    functionName: "collateralToken",
    query: {
      enabled:
        !!tokenAddress && isAddress(tokenAddress) && tokenType === "stable",
    },
  });

  const featureOptionsMap: Record<
    number,
    { functionName: string; signature: string }[]
  > = {
    0: [
      { functionName: "mint", signature: "mint(address,uint256)" },
      { functionName: "burn", signature: "burn(uint256)" },
      { functionName: "pause", signature: "pause()" },
      { functionName: "transfer", signature: "transfer(address,uint256)" },
      { functionName: "approve", signature: "approve(address,uint256)" },
      {
        functionName: "transferFrom",
        signature: "transferFrom(address,address,uint256)",
      },
      {
        functionName: "increaseAllowance",
        signature: "increaseAllowance(address,uint256)",
      },
      {
        functionName: "decreaseAllowance",
        signature: "decreaseAllowance(address,uint256)",
      },
      { functionName: "burnFrom", signature: "burnFrom(address,uint256)" },
      {
        functionName: "permit",
        signature:
          "permit(address,address,uint256,uint256,uint8,bytes32,bytes32)",
      },
      { functionName: "grantRole", signature: "grantRole(bytes32,address)" },
      { functionName: "revokeRole", signature: "revokeRole(bytes32,address)" },
      {
        functionName: "renounceRole",
        signature: "renounceRole(bytes32,address)",
      },
      {
        functionName: "transferOwnership",
        signature: "transferOwnership(address)",
      },
      { functionName: "renounceOwnership", signature: "renounceOwnership()" },
    ],
    1: [
      { functionName: "mint", signature: "mint(address)" },
      { functionName: "mintWithURI", signature: "mintWithURI(address,string)" },
      { functionName: "burn", signature: "burn(uint256)" },
      { functionName: "pause", signature: "pause()" },
      { functionName: "setBaseURI", signature: "setBaseURI(string)" },
      { functionName: "approve", signature: "approve(address,uint256)" },
      { functionName: "safeMint", signature: "safeMint(address)" },
      {
        functionName: "safeMintWithURI",
        signature: "safeMintWithURI(address,string)",
      },
      {
        functionName: "setApprovalForAll",
        signature: "setApprovalForAll(address,bool)",
      },
      {
        functionName: "transferFrom",
        signature: "transferFrom(address,address,uint256)",
      },
      {
        functionName: "safeTransferFrom",
        signature: "safeTransferFrom(address,address,uint256)",
      },
      {
        functionName: "safeTransfersFrom",
        signature: "safeTransfersFrom(address,address,uint256,bytes)",
      },
      { functionName: "setTokenURI", signature: "setTokenURI(uint256,string)" },
      { functionName: "grantRole", signature: "grantRole(bytes32,address)" },
      { functionName: "revokeRole", signature: "revokeRole(bytes32,address)" },
      {
        functionName: "renounceRole",
        signature: "renounceRole(bytes32,address)",
      },
      {
        functionName: "transferOwnership",
        signature: "transferOwnership(address)",
      },
      { functionName: "renounceOwnership", signature: "renounceOwnership()" },
    ],
    2: [
      {
        functionName: "mint",
        signature: "mint(address,uint256,uint256,bytes)",
      },
      { functionName: "burn", signature: "burn(address,uint256,uint256)" },
      { functionName: "pause", signature: "pause()" },
      { functionName: "setURI", signature: "setURI(string)" },
      { functionName: "setTokenURI", signature: "setTokenURI(uint256,string)" },
      {
        functionName: "setApprovalForAll",
        signature: "setApprovalForAll(address,bool)",
      },
      {
        functionName: "safeTransferFrom",
        signature: "safeTransferFrom(address,address,uint256,uint256,bytes)",
      },
      {
        functionName: "mintBatch",
        signature: "mintBatch(address,uint256[],uint256[],bytes)",
      },
      {
        functionName: "burnBatch",
        signature: "burnBatch(address,uint256[],uint256[])",
      },
      {
        functionName: "safeBatchTransferFrom",
        signature:
          "safeBatchTransferFrom(address,address,uint256[],uint256[],bytes)",
      },
      { functionName: "grantRole", signature: "grantRole(bytes32,address)" },
      { functionName: "revokeRole", signature: "revokeRole(bytes32,address)" },
      {
        functionName: "renounceRole",
        signature: "renounceRole(bytes32,address)",
      },
      {
        functionName: "transferOwnership",
        signature: "transferOwnership(address)",
      },
      { functionName: "renounceOwnership", signature: "renounceOwnership()" },
    ],
    3: [
      { functionName: "mint", signature: "mint(address,uint256)" },
      { functionName: "burn", signature: "burn(uint256)" },
      { functionName: "pause", signature: "pause()" },
      {
        functionName: "setMaxWalletSize",
        signature: "setMaxWalletSize(uint96)",
      },
      {
        functionName: "setMaxTransactionAmount",
        signature: "setMaxTransactionAmount(uint96)",
      },
      {
        functionName: "excludeFromLimits",
        signature: "excludeFromLimits(address,bool)",
      },
      { functionName: "transfer", signature: "transfer(address,uint256)" },
      { functionName: "approve", signature: "approve(address,uint256)" },
      {
        functionName: "transferFrom",
        signature: "transferFrom(address,address,uint256)",
      },
      {
        functionName: "increaseAllowance",
        signature: "increaseAllowance(address,uint256)",
      },
      {
        functionName: "decreaseAllowance",
        signature: "decreaseAllowance(address,uint256)",
      },
      { functionName: "burnFrom", signature: "burnFrom(address,uint256)" },
      { functionName: "grantRole", signature: "grantRole(bytes32,address)" },
      { functionName: "revokeRole", signature: "revokeRole(bytes32,address)" },
      {
        functionName: "transferOwnership",
        signature: "transferOwnership(address)",
      },
    ],
    4: [
      { functionName: "mint", signature: "mint(uint256)" },
      { functionName: "redeem", signature: "redeem(uint256)" },
      { functionName: "burn", signature: "burn(uint256)" },
      { functionName: "pause", signature: "pause()" },
      {
        functionName: "setCollateralRatio",
        signature: "setCollateralRatio(uint96)",
      },
      { functionName: "setFees", signature: "setFees(uint32,uint32)" },
      { functionName: "setTreasury", signature: "setTreasury(address)" },
      { functionName: "transfer", signature: "transfer(address,uint256)" },
      { functionName: "approve", signature: "approve(address,uint256)" },
      {
        functionName: "transferFrom",
        signature: "transferFrom(address,address,uint256)",
      },
      {
        functionName: "increaseAllowance",
        signature: "increaseAllowance(address,uint256)",
      },
      {
        functionName: "decreaseAllowance",
        signature: "decreaseAllowance(address,uint256)",
      },
      { functionName: "burnFrom", signature: "burnFrom(address,uint256)" },
      { functionName: "grantRole", signature: "grantRole(bytes32,address)" },
      {
        functionName: "transferOwnership",
        signature: "transferOwnership(address)",
      },
    ],
  };

  // Fetch token details and owner
  const nameQuery = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: tokenType ? tokenABIs[tokenType] : tokenABIs.erc20,
    functionName: "name",
    query: {
      enabled:
        !!tokenType &&
        !!tokenAddress &&
        isAddress(tokenAddress) &&
        tokenType !== "erc1155",
    },
  });

  const symbolQuery = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: tokenType ? tokenABIs[tokenType] : tokenABIs.erc20,
    functionName: "symbol",
    query: {
      enabled:
        !!tokenType &&
        !!tokenAddress &&
        isAddress(tokenAddress) &&
        tokenType !== "erc1155",
    },
  });

  const decimalsQuery = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: tokenType ? tokenABIs[tokenType] : tokenABIs.erc20,
    functionName: "decimals",
    query: {
      enabled:
        !!tokenType &&
        !!tokenAddress &&
        isAddress(tokenAddress) &&
        (tokenType === "erc20" ||
          tokenType === "meme" ||
          tokenType === "stable"),
    },
  });

  const ownerQuery = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: tokenType ? tokenABIs[tokenType] : tokenABIs.erc20,
    functionName: "owner",
    query: {
      enabled: !!tokenType && !!tokenAddress && isAddress(tokenAddress),
    },
  });

  // Set token details and owner status
  useEffect(() => {
    if (!tokenType || !tokenAddress || !isAddress(tokenAddress) || !tokenInfo)
      return;

    const owner = ownerQuery.data as string;

    if (tokenType === "erc1155") {
      const factoryName = (tokenInfo as TokenInfo).name;
      const factorySymbol = (tokenInfo as TokenInfo).symbol;
      if (factoryName && factorySymbol) {
        setTokenDetails({ name: factoryName, symbol: factorySymbol });
      }
    } else {
      const name = nameQuery.data as string;
      const symbol = symbolQuery.data as string;
      const decimals = decimalsQuery.data as number | undefined;
      if (name && symbol) {
        setTokenDetails({ name, symbol, decimals });
      }
    }

    setIsOwner(
      Boolean(owner && account && owner.toLowerCase() === account.toLowerCase())
    );
    setLoading(false);
  }, [
    tokenType,
    tokenAddress,
    account,
    tokenInfo,
    nameQuery.data,
    symbolQuery.data,
    decimalsQuery.data,
    ownerQuery.data,
  ]);

  // Handle errors
  useEffect(() => {
    if (tokenInfoError) {
      setError("Invalid token ID or token not found");
      setLoading(false);
    }
    if (tokenId && isNaN(Number(tokenId))) {
      setError("Invalid token ID format");
      setLoading(false);
    }
  }, [tokenInfoError, tokenId]);

  // Static read functions
  const staticReadFunctions: Record<
    string,
    { name: string; label: string; args?: unknown[] }[]
  > = {
    erc20: [
      { name: "name", label: "Name" },
      { name: "symbol", label: "Symbol" },
      { name: "decimals", label: "Decimals" },
      { name: "totalSupply", label: "Total Supply" },
      { name: "balanceOf", label: "Your Balance", args: [account] },
      { name: "paused", label: "Paused" },
      { name: "owner", label: "Owner" },
    ],
    erc721: [
      { name: "name", label: "Name" },
      { name: "symbol", label: "Symbol" },
      { name: "balanceOf", label: "Your Balance", args: [account] },
      { name: "paused", label: "Paused" },
      { name: "owner", label: "Owner" },
    ],
    erc1155: [
      { name: "uri", label: "URI", args: [BigInt(0)] },
      { name: "paused", label: "Paused" },
      { name: "owner", label: "Owner" },
    ],
    meme: [
      { name: "name", label: "Name" },
      { name: "symbol", label: "Symbol" },
      { name: "decimals", label: "Decimals" },
      { name: "totalSupply", label: "Total Supply" },
      { name: "balanceOf", label: "Your Balance", args: [account] },
      { name: "maxWalletSize", label: "Max Wallet Size" },
      { name: "maxTransactionAmount", label: "Max Transaction Amount" },
      {
        name: "isExcludedFromLimits",
        label: "Excluded from Limits",
        args: [account],
      },
      { name: "paused", label: "Paused" },
      { name: "owner", label: "Owner" },
    ],
    stable: [
      { name: "name", label: "Name" },
      { name: "symbol", label: "Symbol" },
      { name: "decimals", label: "Decimals" },
      { name: "totalSupply", label: "Total Supply" },
      { name: "balanceOf", label: "Your Balance", args: [account] },
      { name: "collateralToken", label: "Collateral Token" },
      { name: "collateralRatio", label: "Collateral Ratio" },
      { name: "treasury", label: "Treasury" },
      { name: "mintFee", label: "Mint Fee" },
      { name: "redeemFee", label: "Redeem Fee" },
      {
        name: "collateralDeposited",
        label: "Your Collateral Deposited",
        args: [account],
      },
      { name: "paused", label: "Paused" },
      { name: "owner", label: "Owner" },
    ],
  };

  // Query read functions
  const queryReadFunctions: Record<
    string,
    { name: string; label: string; inputLabels: string[] }[]
  > = {
    erc20: [
      {
        name: "allowance",
        label: "Allowance for Spender",
        inputLabels: ["Owner Address", "Spender Address"],
      },
    ],
    erc721: [
      {
        name: "ownerOf",
        label: "Owner of Token ID",
        inputLabels: ["Token ID"],
      },
      {
        name: "tokenURI",
        label: "Token URI",
        inputLabels: ["Token ID"],
      },
      {
        name: "getApproved",
        label: "Approved Address for Token ID",
        inputLabels: ["Token ID"],
      },
      {
        name: "isApprovedForAll",
        label: "Operator Approval",
        inputLabels: ["Owner Address", "Operator Address"],
      },
    ],
    erc1155: [
      {
        name: "balanceOf",
        label: "Balance of Token ID",
        inputLabels: ["Account Address", "Token ID"],
      },
      {
        name: "uri",
        label: "URI for Token ID",
        inputLabels: ["Token ID"],
      },
      {
        name: "isApprovedForAll",
        label: "Operator Approval",
        inputLabels: ["Owner Address", "Operator Address"],
      },
    ],
    meme: [
      {
        name: "allowance",
        label: "Allowance for Spender",
        inputLabels: ["Owner Address", "Spender Address"],
      },
    ],
    stable: [
      {
        name: "allowance",
        label: "Allowance for Spender",
        inputLabels: ["Owner Address", "Spender Address"],
      },
    ],
  };

  // Write functions (with signatures for feature filtering)
  const writeFunctions: Record<
    string,
    {
      name: string;
      args: string[];
      inputs: { label: string; type: string; default?: string }[];
      ownerOnly?: boolean;
      signature: string;
    }[]
  > = {
    erc20: [
      {
        name: "transfer",
        args: ["to", "amount"],
        inputs: [
          { label: "To Address", type: "address" },
          { label: "Amount", type: "number" },
        ],
        signature: "transfer(address,uint256)",
      },
      {
        name: "approve",
        args: ["spender", "amount"],
        inputs: [
          { label: "Spender Address", type: "address" },
          { label: "Amount", type: "number" },
        ],
        signature: "approve(address,uint256)",
      },
      {
        name: "transferFrom",
        args: ["from", "to", "amount"],
        inputs: [
          { label: "From Address", type: "address" },
          { label: "To Address", type: "address" },
          { label: "Amount", type: "number" },
        ],
        signature: "transferFrom(address,address,uint256)",
      },
      {
        name: "increaseAllowance",
        args: ["spender", "addedValue"],
        inputs: [
          { label: "Spender Address", type: "address" },
          { label: "Added Value", type: "number" },
        ],
        signature: "increaseAllowance(address,uint256)",
      },
      {
        name: "decreaseAllowance",
        args: ["spender", "subtractedValue"],
        inputs: [
          { label: "Spender Address", type: "address" },
          { label: "Subtracted Value", type: "number" },
        ],
        signature: "decreaseAllowance(address,uint256)",
      },
      {
        name: "mint",
        args: ["to", "amount"],
        inputs: [
          { label: "To Address", type: "address" },
          { label: "Amount", type: "number" },
        ],
        ownerOnly: true,
        signature: "mint(address,uint256)",
      },
      {
        name: "burn",
        args: ["amount"],
        inputs: [{ label: "Amount", type: "number" }],
        signature: "burn(uint256)",
      },
      {
        name: "burnFrom",
        args: ["account", "amount"],
        inputs: [
          { label: "Account Address", type: "address" },
          { label: "Amount", type: "number" },
        ],
        signature: "burnFrom(address,uint256)",
      },
      {
        name: "pause",
        args: [],
        inputs: [],
        ownerOnly: true,
        signature: "pause()",
      },
      {
        name: "unpause",
        args: [],
        inputs: [],
        ownerOnly: true,
        signature: "pause()",
      },
      {
        name: "grantRole",
        args: ["role", "account"],
        inputs: [
          { label: "Role (bytes32)", type: "text" },
          { label: "Account Address", type: "address" },
        ],
        ownerOnly: true,
        signature: "grantRole(bytes32,address)",
      },
      {
        name: "revokeRole",
        args: ["role", "account"],
        inputs: [
          { label: "Role (bytes32)", type: "text" },
          { label: "Account Address", type: "address" },
        ],
        ownerOnly: true,
        signature: "revokeRole(bytes32,address)",
      },
      {
        name: "renounceRole",
        args: ["role", "account"],
        inputs: [
          { label: "Role (bytes32)", type: "text" },
          { label: "Account Address", type: "address" },
        ],
        ownerOnly: true,
        signature: "renounceRole(bytes32,address)",
      },
      {
        name: "transferOwnership",
        args: ["newOwner"],
        inputs: [{ label: "New Owner Address", type: "address" }],
        ownerOnly: true,
        signature: "transferOwnership(address)",
      },
      {
        name: "renounceOwnership",
        args: [],
        inputs: [],
        ownerOnly: true,
        signature: "renounceOwnership()",
      },
    ],
    erc721: [
      {
        name: "mint",
        args: ["to"],
        inputs: [{ label: "To Address", type: "address" }],
        ownerOnly: true,
        signature: "mint(address)",
      },
      {
        name: "mintWithURI",
        args: ["to", "uri"],
        inputs: [
          { label: "To Address", type: "address" },
          { label: "Token URI", type: "text" },
        ],
        ownerOnly: true,
        signature: "mintWithURI(address,string)",
      },
      {
        name: "safeMint",
        args: ["to"],
        inputs: [{ label: "To Address", type: "address" }],
        ownerOnly: true,
        signature: "safeMint(address)",
      },
      {
        name: "safeMintWithURI",
        args: ["to", "uri"],
        inputs: [
          { label: "To Address", type: "address" },
          { label: "Token URI", type: "text" },
        ],
        ownerOnly: true,
        signature: "safeMintWithURI(address,string)",
      },
      {
        name: "setBaseURI",
        args: ["baseURI"],
        inputs: [{ label: "Base URI", type: "text" }],
        ownerOnly: true,
        signature: "setBaseURI(string)",
      },
      {
        name: "setTokenURI",
        args: ["tokenId", "uri"],
        inputs: [
          { label: "Token ID", type: "number" },
          { label: "Token URI", type: "text" },
        ],
        ownerOnly: true,
        signature: "setTokenURI(uint256,string)",
      },
      {
        name: "approve",
        args: ["to", "tokenId"],
        inputs: [
          { label: "To Address", type: "address" },
          { label: "Token ID", type: "number" },
        ],
        signature: "approve(address,uint256)",
      },
      {
        name: "setApprovalForAll",
        args: ["operator", "approved"],
        inputs: [
          { label: "Operator Address", type: "address" },
          { label: "Approved", type: "checkbox" },
        ],
        signature: "setApprovalForAll(address,bool)",
      },
      {
        name: "transferFrom",
        args: ["from", "to", "tokenId"],
        inputs: [
          { label: "From Address", type: "address" },
          { label: "To Address", type: "address" },
          { label: "Token ID", type: "number" },
        ],
        signature: "transferFrom(address,address,uint256)",
      },
      {
        name: "safeTransferFrom",
        args: ["from", "to", "tokenId"],
        inputs: [
          { label: "From Address", type: "address" },
          { label: "To Address", type: "address" },
          { label: "Token ID", type: "number" },
        ],
        signature: "safeTransferFrom(address,address,uint256)",
      },
      {
        name: "safeTransfersFrom",
        args: ["from", "to", "tokenId", "data"],
        inputs: [
          { label: "From Address", type: "address" },
          { label: "To Address", type: "address" },
          { label: "Token ID", type: "number" },
          { label: "Data", type: "text", default: "0x" },
        ],
        signature: "safeTransfersFrom(address,address,uint256,bytes)",
      },
      {
        name: "burn",
        args: ["tokenId"],
        inputs: [{ label: "Token ID", type: "number" }],
        signature: "burn(uint256)",
      },
      {
        name: "pause",
        args: [],
        inputs: [],
        ownerOnly: true,
        signature: "pause()",
      },
      {
        name: "unpause",
        args: [],
        inputs: [],
        ownerOnly: true,
        signature: "pause()",
      },
      {
        name: "grantRole",
        args: ["role", "account"],
        inputs: [
          { label: "Role (bytes32)", type: "text" },
          { label: "Account Address", type: "address" },
        ],
        ownerOnly: true,
        signature: "grantRole(bytes32,address)",
      },
      {
        name: "revokeRole",
        args: ["role", "account"],
        inputs: [
          { label: "Role (bytes32)", type: "text" },
          { label: "Account Address", type: "address" },
        ],
        ownerOnly: true,
        signature: "revokeRole(bytes32,address)",
      },
      {
        name: "renounceRole",
        args: ["role", "account"],
        inputs: [
          { label: "Role (bytes32)", type: "text" },
          { label: "Account Address", type: "address" },
        ],
        ownerOnly: true,
        signature: "renounceRole(bytes32,address)",
      },
      {
        name: "transferOwnership",
        args: ["newOwner"],
        inputs: [{ label: "New Owner Address", type: "address" }],
        ownerOnly: true,
        signature: "transferOwnership(address)",
      },
      {
        name: "renounceOwnership",
        args: [],
        inputs: [],
        ownerOnly: true,
        signature: "renounceOwnership()",
      },
    ],
    erc1155: [
      {
        name: "mint",
        args: ["to", "id", "amount", "data"],
        inputs: [
          { label: "To Address", type: "address" },
          { label: "Token ID", type: "number" },
          { label: "Amount", type: "number" },
          { label: "Data", type: "text", default: "0x" },
        ],
        ownerOnly: true,
        signature: "mint(address,uint256,uint256,bytes)",
      },
      {
        name: "mintBatch",
        args: ["to", "ids", "amounts", "data"],
        inputs: [
          { label: "To Address", type: "address" },
          { label: "Token IDs (comma-separated)", type: "text" },
          { label: "Amounts (comma-separated)", type: "text" },
          { label: "Data", type: "text", default: "0x" },
        ],
        ownerOnly: true,
        signature: "mintBatch(address,uint256[],uint256[],bytes)",
      },
      {
        name: "burn",
        args: ["account", "id", "amount"],
        inputs: [
          { label: "Account Address", type: "address" },
          { label: "Token ID", type: "number" },
          { label: "Amount", type: "number" },
        ],
        signature: "burn(address,uint256,uint256)",
      },
      {
        name: "burnBatch",
        args: ["account", "ids", "amounts"],
        inputs: [
          { label: "Account Address", type: "address" },
          { label: "Token IDs (comma-separated)", type: "text" },
          { label: "Amounts (comma-separated)", type: "text" },
        ],
        signature: "burnBatch(address,uint256[],uint256[])",
      },
      {
        name: "setURI",
        args: ["newuri"],
        inputs: [{ label: "New URI", type: "text" }],
        ownerOnly: true,
        signature: "setURI(string)",
      },
      {
        name: "setTokenURI",
        args: ["id", "tokenURI"],
        inputs: [
          { label: "Token ID", type: "number" },
          { label: "Token URI", type: "text" },
        ],
        ownerOnly: true,
        signature: "setTokenURI(uint256,string)",
      },
      {
        name: "setApprovalForAll",
        args: ["operator", "approved"],
        inputs: [
          { label: "Operator Address", type: "address" },
          { label: "Approved", type: "checkbox" },
        ],
        signature: "setApprovalForAll(address,bool)",
      },
      {
        name: "safeTransferFrom",
        args: ["from", "to", "id", "amount", "data"],
        inputs: [
          { label: "From Address", type: "address" },
          { label: "To Address", type: "address" },
          { label: "Token ID", type: "number" },
          { label: "Amount", type: "number" },
          { label: "Data", type: "text", default: "0x" },
        ],
        signature: "safeTransferFrom(address,address,uint256,uint256,bytes)",
      },
      {
        name: "safeBatchTransferFrom",
        args: ["from", "to", "ids", "amounts", "data"],
        inputs: [
          { label: "From Address", type: "address" },
          { label: "To Address", type: "address" },
          { label: "Token IDs (comma-separated)", type: "text" },
          { label: "Amounts (comma-separated)", type: "text" },
          { label: "Data", type: "text", default: "0x" },
        ],
        signature:
          "safeBatchTransferFrom(address,address,uint256[],uint256[],bytes)",
      },
      {
        name: "pause",
        args: [],
        inputs: [],
        ownerOnly: true,
        signature: "pause()",
      },
      {
        name: "unpause",
        args: [],
        inputs: [],
        ownerOnly: true,
        signature: "pause()",
      },
      {
        name: "grantRole",
        args: ["role", "account"],
        inputs: [
          { label: "Role (bytes32)", type: "text" },
          { label: "Account Address", type: "address" },
        ],
        ownerOnly: true,
        signature: "grantRole(bytes32,address)",
      },
      {
        name: "revokeRole",
        args: ["role", "account"],
        inputs: [
          { label: "Role (bytes32)", type: "text" },
          { label: "Account Address", type: "address" },
        ],
        ownerOnly: true,
        signature: "revokeRole(bytes32,address)",
      },
      {
        name: "renounceRole",
        args: ["role", "account"],
        inputs: [
          { label: "Role (bytes32)", type: "text" },
          { label: "Account Address", type: "address" },
        ],
        ownerOnly: true,
        signature: "renounceRole(bytes32,address)",
      },
      {
        name: "transferOwnership",
        args: ["newOwner"],
        inputs: [{ label: "New Owner Address", type: "address" }],
        ownerOnly: true,
        signature: "transferOwnership(address)",
      },
      {
        name: "renounceOwnership",
        args: [],
        inputs: [],
        ownerOnly: true,
        signature: "renounceOwnership()",
      },
    ],
    meme: [
      {
        name: "transfer",
        args: ["to", "amount"],
        inputs: [
          { label: "To Address", type: "address" },
          { label: "Amount", type: "number" },
        ],
        signature: "transfer(address,uint256)",
      },
      {
        name: "approve",
        args: ["spender", "amount"],
        inputs: [
          { label: "Spender Address", type: "address" },
          { label: "Amount", type: "number" },
        ],
        signature: "approve(address,uint256)",
      },
      {
        name: "transferFrom",
        args: ["from", "to", "amount"],
        inputs: [
          { label: "From Address", type: "address" },
          { label: "To Address", type: "address" },
          { label: "Amount", type: "number" },
        ],
        signature: "transferFrom(address,address,uint256)",
      },
      {
        name: "increaseAllowance",
        args: ["spender", "addedValue"],
        inputs: [
          { label: "Spender Address", type: "address" },
          { label: "Added Value", type: "number" },
        ],
        signature: "increaseAllowance(address,uint256)",
      },
      {
        name: "decreaseAllowance",
        args: ["spender", "subtractedValue"],
        inputs: [
          { label: "Spender Address", type: "address" },
          { label: "Subtracted Value", type: "number" },
        ],
        signature: "decreaseAllowance(address,uint256)",
      },
      {
        name: "mint",
        args: ["to", "amount"],
        inputs: [
          { label: "To Address", type: "address" },
          { label: "Amount", type: "number" },
        ],
        ownerOnly: true,
        signature: "mint(address,uint256)",
      },
      {
        name: "burn",
        args: ["amount"],
        inputs: [{ label: "Amount", type: "number" }],
        signature: "burn(uint256)",
      },
      {
        name: "burnFrom",
        args: ["account", "amount"],
        inputs: [
          { label: "Account Address", type: "address" },
          { label: "Amount", type: "number" },
        ],
        signature: "burnFrom(address,uint256)",
      },
      {
        name: "setMaxWalletSize",
        args: ["amount"],
        inputs: [{ label: "Max Wallet Size", type: "number" }],
        ownerOnly: true,
        signature: "setMaxWalletSize(uint96)",
      },
      {
        name: "setMaxTransactionAmount",
        args: ["amount"],
        inputs: [{ label: "Max Transaction Amount", type: "number" }],
        ownerOnly: true,
        signature: "setMaxTransactionAmount(uint96)",
      },
      {
        name: "excludeFromLimits",
        args: ["account", "excluded"],
        inputs: [
          { label: "Account Address", type: "address" },
          { label: "Excluded", type: "checkbox" },
        ],
        ownerOnly: true,
        signature: "excludeFromLimits(address,bool)",
      },
      {
        name: "pause",
        args: [],
        inputs: [],
        ownerOnly: true,
        signature: "pause()",
      },
      {
        name: "unpause",
        args: [],
        inputs: [],
        ownerOnly: true,
        signature: "pause()",
      },
      {
        name: "grantRole",
        args: ["role", "account"],
        inputs: [
          { label: "Role (bytes32)", type: "text" },
          { label: "Account Address", type: "address" },
        ],
        ownerOnly: true,
        signature: "grantRole(bytes32,address)",
      },
      {
        name: "revokeRole",
        args: ["role", "account"],
        inputs: [
          { label: "Role (bytes32)", type: "text" },
          { label: "Account Address", type: "address" },
        ],
        ownerOnly: true,
        signature: "revokeRole(bytes32,address)",
      },
      {
        name: "transferOwnership",
        args: ["newOwner"],
        inputs: [{ label: "New Owner Address", type: "address" }],
        ownerOnly: true,
        signature: "transferOwnership(address)",
      },
    ],
    stable: [
      {
        name: "transfer",
        args: ["to", "amount"],
        inputs: [
          { label: "To Address", type: "address" },
          { label: "Amount", type: "number" },
        ],
        signature: "transfer(address,uint256)",
      },
      {
        name: "approve",
        args: ["spender", "amount"],
        inputs: [
          { label: "Spender Address", type: "address" },
          { label: "Amount", type: "number" },
        ],
        signature: "approve(address,uint256)",
      },
      {
        name: "transferFrom",
        args: ["from", "to", "amount"],
        inputs: [
          { label: "From Address", type: "address" },
          { label: "To Address", type: "address" },
          { label: "Amount", type: "number" },
        ],
        signature: "transferFrom(address,address,uint256)",
      },
      {
        name: "increaseAllowance",
        args: ["spender", "addedValue"],
        inputs: [
          { label: "Spender Address", type: "address" },
          { label: "Added Value", type: "number" },
        ],
        signature: "increaseAllowance(address,uint256)",
      },
      {
        name: "decreaseAllowance",
        args: ["spender", "subtractedValue"],
        inputs: [
          { label: "Spender Address", type: "address" },
          { label: "Subtracted Value", type: "number" },
        ],
        signature: "decreaseAllowance(address,uint256)",
      },
      {
        name: "mint",
        args: ["collateralAmount"],
        inputs: [{ label: "Collateral Amount", type: "number" }],
        signature: "mint(uint256)",
      },
      {
        name: "redeem",
        args: ["tokenAmount"],
        inputs: [{ label: "Token Amount", type: "number" }],
        signature: "redeem(uint256)",
      },
      {
        name: "burn",
        args: ["amount"],
        inputs: [{ label: "Amount", type: "number" }],
        signature: "burn(uint256)",
      },
      {
        name: "burnFrom",
        args: ["account", "amount"],
        inputs: [
          { label: "Account Address", type: "address" },
          { label: "Amount", type: "number" },
        ],
        signature: "burnFrom(address,uint256)",
      },
      {
        name: "setCollateralRatio",
        args: ["_collateralRatio"],
        inputs: [{ label: "Collateral Ratio", type: "number" }],
        ownerOnly: true,
        signature: "setCollateralRatio(uint96)",
      },
      {
        name: "setFees",
        args: ["_mintFee", "_redeemFee"],
        inputs: [
          { label: "Mint Fee", type: "number" },
          { label: "Redeem Fee", type: "number" },
        ],
        ownerOnly: true,
        signature: "setFees(uint32,uint32)",
      },
      {
        name: "setTreasury",
        args: ["_treasury"],
        inputs: [{ label: "Treasury Address", type: "address" }],
        ownerOnly: true,
        signature: "setTreasury(address)",
      },
      {
        name: "pause",
        args: [],
        inputs: [],
        ownerOnly: true,
        signature: "pause()",
      },
      {
        name: "unpause",
        args: [],
        inputs: [],
        ownerOnly: true,
        signature: "pause()",
      },
      {
        name: "grantRole",
        args: ["role", "account"],
        inputs: [
          { label: "Role (bytes32)", type: "text" },
          { label: "Account Address", type: "address" },
        ],
        ownerOnly: true,
        signature: "grantRole(bytes32,address)",
      },
      {
        name: "transferOwnership",
        args: ["newOwner"],
        inputs: [{ label: "New Owner Address", type: "address" }],
        ownerOnly: true,
        signature: "transferOwnership(address)",
      },
    ],
  };

  // --- UPDATED AND CORRECTED: Filter write functions based on enabled features ---
  // This is the new, fully corrected block
  const filteredWriteFunctions = (() => {
    // This explicit guard makes the code much safer and satisfies TypeScript
    if (!tokenType || !enabledFeatures || factoryTokenType === null) {
      return [];
    }

    // Add this check to ensure enabledFeatures is an array
    if (!Array.isArray(enabledFeatures)) {
      return [];
    }

    return writeFunctions[tokenType].filter((action) => {
      const featureIndex = featureOptionsMap[factoryTokenType].findIndex(
        (f) => f.signature === action.signature
      );

      if (featureIndex === -1) {
        return false;
      }

      const isFeatureEnabled = enabledFeatures[featureIndex] as boolean;

      return isFeatureEnabled && (!action.ownerOnly || isOwner);
    });
  })();

  // Execute write function
  const handleWrite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalAction || !tokenType || !tokenAddress || !account) {
      setError("Missing required parameters");
      return;
    }

    // if (chainId !== BASE_SEPOLIA_CHAIN_ID) {
    //   setError("Please connect to Base Sepolia network");
    //   return;
    // }
    if (chainId !== LISK_SEPOLIA_CHAIN_ID) {
      setError("Please connect to Lisk Sepolia network");
      return;
    }

    const action = writeFunctions[tokenType].find(
      (f) => f.name === modalAction
    );
    if (!action) {
      setError("Invalid action");
      return;
    }

    try {
      const args = action.args.map((arg, index) => {
        const input = action.inputs[index];
        const value = formInputs[input.label];
        if (value === undefined && input.type !== "checkbox")
          throw new Error(`Missing ${arg}`);
        if (
          arg.includes("address") ||
          arg.includes("to") ||
          arg.includes("from") ||
          arg.includes("spender") ||
          arg.includes("operator") ||
          arg.includes("account") ||
          arg.includes("treasury") ||
          arg.includes("newOwner")
        ) {
          if (
            !isAddress(value) ||
            value === "0x0000000000000000000000000000000000000000"
          ) {
            throw new Error(`Invalid address for ${arg}`);
          }
          return value;
        }
        if (
          arg.includes("amount") ||
          arg.includes("id") ||
          arg.includes("tokenId") ||
          arg.includes("fee") ||
          arg.includes("ratio") ||
          arg.includes("addedValue") ||
          arg.includes("subtractedValue") ||
          arg.includes("collateralAmount") ||
          arg.includes("tokenAmount")
        ) {
          if (value === "") throw new Error(`Value for ${arg} cannot be empty`);
          const num = Number(value);
          if (isNaN(num)) throw new Error(`Invalid number for ${arg}`);
          if (num < 0) throw new Error(`Number cannot be negative for ${arg}`);
          if (arg === "_collateralRatio" && num < 10000)
            throw new Error("Collateral ratio must be at least 10000");
          if ((arg === "_mintFee" || arg === "_redeemFee") && num > 500)
            throw new Error("Fee cannot exceed 500");
          if (
            (arg.includes("amount") ||
              arg.includes("collateralAmount") ||
              arg.includes("tokenAmount")) &&
            num === 0
          ) {
            throw new Error(`Amount for ${arg} must be greater than 0`);
          }
          return BigInt(value.toString().replace(/,/g, ""));
        }
        if (arg === "ids" || arg === "amounts") {
          const values = value.split(",").map((v) => {
            const num = Number(v.trim());
            if (isNaN(num)) throw new Error(`Invalid number in ${arg}`);
            if (num <= 0) throw new Error(`Numbers in ${arg} must be positive`);
            return BigInt(num);
          });
          return values;
        }
        if (arg === "approved" || arg === "excluded") {
          // Handles checkbox which might not be in formInputs if unchecked
          return formInputs[input.label] === "true";
        }
        if (arg === "role") {
          // Convert role string to bytes32
          return keccak256(toBytes(value));
        }
        return value;
      });

      // For stablecoin mint, approve collateral token
      if (tokenType === "stable" && modalAction === "mint" && collateralToken) {
        const collateralAmount = args[0] as bigint;
        const approved = await handleApproveCollateral(
          collateralToken as string,
          collateralAmount
        );
        if (!approved) return;
      }

      await writeContract({
        address: tokenAddress as `0x${string}`,
        abi: tokenABIs[tokenType],
        functionName: modalAction,
        args,
        account: account as `0x${string}`,
      });

      setModalOpen(false);
      setFormInputs({});
      setInputErrors({});
      setError(null);
    } catch (err: unknown) {
      const errorMap: Record<string, string> = {
        InvalidDecimals: "Decimals must be 18 or less",
        InvalidAmount: "Amount must be greater than 0",
        FeatureNotEnabled: "This feature is not enabled for the token",
        ExceedsMaxTransaction: "Transaction amount exceeds max limit",
        ExceedsMaxWalletSize: "Wallet size exceeds max limit",
        InvalidCollateralAmount: "Collateral amount must be greater than 0",
        InsufficientBalance: "Insufficient token balance",
        InsufficientCollateral: "Insufficient collateral deposited",
        InvalidFees: "Mint or redeem fees must be 500 or less",
        InvalidTreasury: "Invalid treasury address",
        TransferFailed: "Token transfer failed",
        AlreadyInitialized: "Token already initialized",
      };
      const errorMessage =
        err instanceof Error
          ? Object.keys(errorMap).find((key) => err.message.includes(key))
            ? errorMap[
                Object.keys(errorMap).find((key) => err.message.includes(key))!
              ]
            : err.message
          : "Transaction failed";
      setError(errorMessage);
    }
  };

  // Open modal for write action
  const openModal = (action: string) => {
    setModalAction(action);
    setModalOpen(true);
    setFormInputs({});
    setInputErrors({});
  };

  // Render read function result
  const ReadCard = ({
    func,
    isQuery = false,
    inputLabels = [],
  }: {
    func: { name: string; label: string; args?: unknown[] };
    isQuery?: boolean;
    inputLabels?: string[];
  }) => {
    const [isQueryTriggered, setIsQueryTriggered] = useState(false);

    const dynamicArgs = (func.args || []).map((arg: unknown, index: number) => {
      if (typeof arg === "string" && arg === "" && isQuery) {
        const value = formInputs[`${func.name}_${inputLabels[index]}`] || "";
        return inputLabels[index].includes("ID") ? BigInt(value || 0) : value;
      }
      return arg;
    });

    useEffect(() => {
      if (isQuery) {
        setIsQueryTriggered(false);
      }
    }, [dynamicArgs, isQuery]);

    const {
      data,
      error: readError,
      isLoading,
    } = useReadContract({
      address: tokenAddress as `0x${string}`,
      abi: tokenABIs[tokenType!],
      functionName: func.name,
      args: dynamicArgs,
      query: {
        enabled:
          !!tokenType &&
          !!tokenAddress &&
          (!isQuery ||
            (isQueryTriggered &&
              dynamicArgs.every((arg: unknown) => arg !== ""))),
      },
    });

    return (
      <div className="bg-[#1E1425]/80 backdrop-blur-sm rounded-xl p-4 border border-purple-500/20">
        <p className="text-gray-300 text-sm font-medium">{func.label}</p>
        {isQuery && (
          <div className="mt-2 space-y-2">
            {inputLabels.map((label, index) => (
              <div key={index}>
                <input
                  type="text"
                  inputMode={label.includes("ID") ? "numeric" : "text"}
                  pattern={label.includes("ID") ? "[0-9]*" : undefined}
                  placeholder={`Enter ${label}`}
                  value={formInputs[`${func.name}_${label}`] || ""}
                  onChange={(e) =>
                    handleInputChange(
                      `${func.name}_${label}`,
                      e.target.value,
                      label.includes("ID"),
                      label
                    )
                  }
                  className={`w-full p-2 bg-[#2A1F36] border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    inputErrors[`${func.name}_${label}`] ? "border-red-500" : ""
                  }`}
                />
                {inputErrors[`${func.name}_${label}`] && (
                  <p className="text-red-300 text-sm mt-1">
                    {inputErrors[`${func.name}_${label}`]}
                  </p>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => setIsQueryTriggered(true)}
              disabled={dynamicArgs.some(
                (arg: unknown, idx: number) =>
                  arg === "" || inputErrors[`${func.name}_${inputLabels[idx]}`]
              )}
              className="w-full px-3 py-2 bg-gradient-to-r from-purple-500 to-blue-600 text-white font-medium rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              Query
            </button>
          </div>
        )}
        <p className="text-white text-lg mt-2 truncate">
          {readError
            ? "Error fetching data"
            : isLoading
            ? "Loading..."
            : data?.toString() || "No data"}
        </p>
      </div>
    );
  };

  // Modal for write actions
  const WriteModal = () => {
    if (!modalOpen || !modalAction || !tokenType) return null;

    const action = writeFunctions[tokenType].find(
      (f) => f.name === modalAction
    );
    if (!action) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-[#1E1425]/80 backdrop-blur-sm p-6 rounded-xl max-w-md w-full border border-purple-500/20 shadow-2xl">
          <h3 className="text-xl text-white font-semibold mb-4">
            {action.name}
          </h3>
          <form onSubmit={handleWrite}>
            {action.inputs.map((input, index) => (
              <div key={index} className="mb-4">
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  {input.label}
                </label>
                {input.type === "checkbox" ? (
                  <input
                    type="checkbox"
                    checked={formInputs[input.label] === "true"}
                    onChange={(e) =>
                      handleInputChange(
                        input.label,
                        e.target.checked.toString()
                      )
                    }
                    className="mt-1 rounded border-gray-600 text-purple-600 focus:ring-purple-500"
                  />
                ) : (
                  <div>
                    <input
                      type="text"
                      inputMode={input.type === "number" ? "numeric" : "text"}
                      pattern={input.type === "number" ? "[0-9]*" : undefined}
                      value={formInputs[input.label] || input.default || ""}
                      onChange={(e) =>
                        handleInputChange(
                          input.label,
                          e.target.value,
                          input.type === "number",
                          input.label
                        )
                      }
                      placeholder={input.label}
                      className={`w-full p-2 bg-[#2A1F36] border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        inputErrors[input.label] ? "border-red-500" : ""
                      }`}
                    />
                    {inputErrors[input.label] && (
                      <p className="text-red-300 text-sm mt-1">
                        {inputErrors[input.label]}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
            {error && <p className="text-red-300 text-sm mb-2">{error}</p>}
            {writeError && (
              <p className="text-red-300 text-sm mb-2">
                {writeError.message || "Transaction error"}
              </p>
            )}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => {
                  setModalOpen(false);
                  setModalAction(null);
                  setError(null);
                  setInputErrors({});
                }}
                className="px-4 py-2 bg-gray-600 text-gray-300 rounded-xl hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={
                  isPending ||
                  Object.values(inputErrors).some((err) => err !== "")
                }
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? "Processing..." : "Execute"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  if (loading || tokenInfoLoading || featuresLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#1A0D23] to-[#2A1F36] relative">
          <BackgroundShapes />
          <div className="w-16 h-16 border-4 border-gray-200 border-t-purple-600 rounded-full animate-spin relative z-10"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !tokenType || !tokenDetails || !tokenAddress) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gradient-to-br from-[#1A0D23] to-[#2A1F36] p-4 md:p-8 relative">
          <BackgroundShapes />
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center space-x-3 relative z-10">
            <p className="text-red-300 font-medium">
              {error || "Failed to load token data"}
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="relative min-h-screen">
        <div
          className={`transition-all duration-300 ${
            modalOpen ? "blur-md" : ""
          }`}
        >
          <BackgroundShapes />
          <div className="p-6 md:p-10 bg-gradient-to-br from-[#1A0D23] to-[#2A1F36]">
            {/* Token Header */}
            <div className="mb-12 relative z-10 max-w-4xl mx-auto">
              <h1 className="font-poppins font-bold text-4xl md:text-5xl text-white mb-4">
                {tokenDetails.name} ({tokenDetails.symbol})
              </h1>
              <div className="bg-[#2A1F36]/50 p-4 rounded-xl">
                <p className="text-gray-300 text-lg">Token ID: {tokenId}</p>
                <p className="text-gray-300 text-lg">Address: {tokenAddress}</p>
                <p className="text-gray-300 text-lg">
                  Type: {tokenType.toUpperCase()}
                </p>
              </div>
            </div>

            {/* Token Information Section */}
            <div className="mb-12 relative z-10 max-w-6xl mx-auto">
              <h2 className="font-poppins font-semibold text-2xl md:text-3xl text-white mb-6">
                Token Information
              </h2>
              <div className="bg-[#1E1425]/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-500/20">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {staticReadFunctions[tokenType].map((func) => (
                    <ReadCard key={func.name} func={func} />
                  ))}
                </div>
              </div>
            </div>

            {/* Token Actions Section */}
            <div className="mb-12 relative z-10 max-w-6xl mx-auto">
              <h2 className="font-poppins font-semibold text-2xl md:text-3xl text-white mb-6">
                Token Actions
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredWriteFunctions.map((action) => (
                  <button
                    key={action.name}
                    onClick={() => openModal(action.name)}
                    disabled={isPending}
                    className="p-4 bg-[#1E1425]/80 border border-purple-500/20 rounded-xl text-white text-lg font-medium hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-blue-600/20 hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {action.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Query Token Data Section */}
            <div className="mb-12 relative z-10 max-w-6xl mx-auto">
              <h2 className="font-poppins font-semibold text-2xl md:text-3xl text-white mb-6">
                Query Token Data
              </h2>
              <div className="bg-[#1E1425]/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-500/20">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {queryReadFunctions[tokenType].map((func) => (
                    <ReadCard
                      key={func.name}
                      func={{
                        name: func.name,
                        label: func.label,
                        args: func.inputLabels.map(() => ""),
                      }}
                      isQuery={true}
                      inputLabels={func.inputLabels}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <WriteModal />
      </div>
    </DashboardLayout>
  );
};

export default ManageToken;