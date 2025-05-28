'use client';
import React, { useState, useEffect } from 'react';
import { useWallet } from '../../../../contexts/WalletContext';
import { useReadContract, useReadContracts, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { Abi, isAddress } from 'viem';
import StrataForgeAdminABI from '../../../../app/components/ABIs/StrataForgeAdminABI.json';
import StrataForgeFactoryABI from '../../../../app/components/ABIs/StrataForgeFactoryABI.json';
import DashboardLayout from '../DashboardLayout';
import { useRouter } from 'next/navigation';

const ADMIN_CONTRACT_ADDRESS = '0x7e8541Ba29253C1722d366e3d08975B03f3Cc839' as const;
const FACTORY_CONTRACT_ADDRESS = '0x59F42c3eEcf829b34d8Ca846Dfc83D3cDC105C3F' as const;
const adminABI = StrataForgeAdminABI as Abi;
const factoryABI = StrataForgeFactoryABI as Abi;

// Type definitions
interface TokenData {
  tokenAddress: string;
  name: string;
  symbol: string;
  totalSupply: bigint;
  createdAt: bigint;
  tokenType: bigint;
  creator: string;
}

interface WagmiContractResult {
  status: 'success' | 'failure';
  result?: unknown;
  error?: Error;
}

const tokenTypes = [
  { value: 0, label: 'ERC-20', tiers: ['Free', 'Classic', 'Pro', 'Premium'] },
  { value: 1, label: 'ERC-721', tiers: ['Free', 'Classic', 'Pro', 'Premium'] },
  { value: 2, label: 'ERC-1155', tiers: ['Pro', 'Premium'] },
  { value: 3, label: 'Memecoin', tiers: ['Premium'] },
  { value: 4, label: 'Stablecoin', tiers: ['Premium'] },
];

const CreateTokensPage = () => {
  const { address, isConnected } = useWallet();
  const router = useRouter();
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [tokensLoading, setTokensLoading] = useState(false);
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();
  const [isTxPending, setIsTxPending] = useState(false);
  const [formData, setFormData] = useState({
    tokenType: '',
    name: '',
    symbol: '',
    initialSupply: '',
    decimals: '18',
    uri: '',
    maxWalletSize: '',
    maxTransactionAmount: '',
    collateralToken: '',
    collateralRatio: '',
    treasury: '',
  });
  const [createdTokens, setCreatedTokens] = useState<TokenData[]>([]);

  // Wagmi hooks
  const { writeContract, error: writeError, isPending: isWritePending } = useWriteContract();
  const { isLoading: isTxConfirming, isSuccess: isTxSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // Fetch subscription status
  const {
    data: subData,
    error: subError,
    isLoading: subLoading,
  } = useReadContract({
    address: ADMIN_CONTRACT_ADDRESS,
    abi: adminABI,
    functionName: 'getSubscription',
    args: [address],
    query: { enabled: isConnected && !!address, retry: 3, retryDelay: 1000 },
  });

  // Fetch total token count
  const {
    data: totalTokens,
    error: tokenCountError,
    isLoading: tokenCountLoading,
  } = useReadContract({
    address: FACTORY_CONTRACT_ADDRESS,
    abi: factoryABI,
    functionName: 'getTotalTokenCount',
    query: { enabled: isConnected && !!address, retry: 3, retryDelay: 1000 },
  });

  // Fetch all tokens
  const tokenPromises = React.useMemo(() => {
    if (!isConnected || !address || !totalTokens) return [];
    
    const count = Number(totalTokens);
    const promises = [];
    for (let i = 1; i <= count; i++) {
      promises.push({
        address: FACTORY_CONTRACT_ADDRESS,
        abi: factoryABI,
        functionName: 'getTokenById',
        args: [BigInt(i)],
      });
    }
    return promises;
  }, [totalTokens, isConnected, address]);

  const { data: tokenData } = useReadContracts({
    contracts: tokenPromises,
    query: { enabled: tokenPromises.length > 0 },
  });

  useEffect(() => {
    if (tokenData) {
      const tokens = tokenData
        ?.filter((result: WagmiContractResult) => result.status === 'success' && result.result)
        .map((result: WagmiContractResult) => {
          const token = result.result as TokenData;
          return token.creator.toLowerCase() === address?.toLowerCase() ? token : null;
        })
        .filter((token): token is NonNullable<typeof token> => token !== null) || [];
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

  // Subscription data
  const [subscription, setSubscription] = useState<{
    plan: string;
    tokensRemaining: number;
  } | null>(null);

  useEffect(() => {
    if (subData) {
      const planNames = ['Free', 'Classic', 'Pro', 'Premium'] as const;
      const [tierIndex, , tokensThisMonth] = subData as [bigint, bigint, bigint];
      const planName = planNames[Number(tierIndex)] || 'Free';
      const tokenLimits: Record<string, number> = { Free: 2, Classic: 5, Pro: 10, Premium: Infinity };
      const remainingTokens = Math.max(0, tokenLimits[planName] - Number(tokensThisMonth));

      setSubscription({
        plan: planName,
        tokensRemaining: remainingTokens,
      });
    }
  }, [subData]);

  // Handle errors
  useEffect(() => {
    const errors: string[] = [];
    if (subError) errors.push('Failed to load subscription data');
    if (tokenCountError) errors.push('Failed to load token count');
    if (writeError) {
      console.error('Write error:', writeError);
      const errorMessage = writeError.message.includes('InvalidName') ? 'Invalid token name' :
                          writeError.message.includes('InvalidSymbol') ? 'Invalid token symbol' :
                          writeError.message.includes('InvalidSupply') ? 'Invalid initial supply' :
                          writeError.message.includes('InvalidURI') ? 'Invalid URI' :
                          writeError.message.includes('InvalidCollateralToken') ? 'Invalid collateral token address' :
                          writeError.message.includes('InvalidTreasury') ? 'Invalid treasury address' :
                          writeError.message.includes('SubscriptionLimitExceeded') ? 'Token creation limit exceeded' :
                          writeError.message.includes('InvalidTokenType') ? 'Token type not allowed for your plan' :
                          'Transaction failed';
      errors.push(errorMessage);
    }
    setError(errors.join(', '));
    if (!subLoading && !tokenCountLoading && !isTxConfirming) {
      setLoading(false);
      setIsTxPending(false);
    }
  }, [subError, tokenCountError, writeError, subLoading, tokenCountLoading, isTxConfirming]);

  // Handle transaction success
  useEffect(() => {
    if (isTxSuccess && txHash) {
      setTxHash(undefined);
      setIsTxPending(false);
      setFormData({
        tokenType: '',
        name: '',
        symbol: '',
        initialSupply: '',
        decimals: '18',
        uri: '',
        maxWalletSize: '',
        maxTransactionAmount: '',
        collateralToken: '',
        collateralRatio: '',
        treasury: '',
      });
    }
  }, [isTxSuccess, txHash]);

  // Form input handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (e.target.name === 'tokenType') {
      setFormData({
        tokenType: e.target.value,
        name: '',
        symbol: '',
        initialSupply: '',
        decimals: '18',
        uri: '',
        maxWalletSize: '',
        maxTransactionAmount: '',
        collateralToken: '',
        collateralRatio: '',
        treasury: '',
      });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  // Create token
  const handleCreateToken = () => {
    const { tokenType, name, symbol, initialSupply, decimals, uri, maxWalletSize, maxTransactionAmount, collateralToken, collateralRatio, treasury } = formData;
    if (!tokenType) {
      setError('Token type is required');
      return;
    }

    const tokenTypeNum = Number(tokenType);
    let functionName: string = '';
    let args: (string | bigint | number)[] = [];
    let validationError: string | null = null;

    if (tokenTypeNum === 0) { // ERC20
      if (!name || !symbol || !initialSupply || !decimals) validationError = 'Name, symbol, initial supply, and decimals are required';
      if (Number(initialSupply) <= 0) validationError = 'Initial supply must be greater than 0';
      if (Number(decimals) > 18) validationError = 'Decimals must be 18 or less';
      functionName = 'createERC20';
      args = [name, symbol, BigInt(initialSupply), Number(decimals)];
    } else if (tokenTypeNum === 1) { // ERC721
      if (!name || !symbol) validationError = 'Name and symbol are required';
      functionName = 'createERC721';
      args = [name, symbol];
    } else if (tokenTypeNum === 2) { // ERC1155
      if (!uri) validationError = 'URI is required';
      functionName = 'createERC1155';
      args = [uri];
    } else if (tokenTypeNum === 3) { // Memecoin
      if (!name || !symbol || !initialSupply || !decimals || !maxWalletSize || !maxTransactionAmount) 
        validationError = 'Name, symbol, initial supply, decimals, max wallet size, and max transaction amount are required';
      if (Number(initialSupply) <= 0) validationError = 'Initial supply must be greater than 0';
      if (Number(decimals) > 18) validationError = 'Decimals must be 18 or less';
      if (Number(maxWalletSize) <= 0 || Number(maxTransactionAmount) <= 0) validationError = 'Max wallet size and transaction amount must be greater than 0';
      functionName = 'createMemecoin';
      args = [name, symbol, BigInt(initialSupply), Number(decimals), BigInt(maxWalletSize), BigInt(maxTransactionAmount)];
    } else if (tokenTypeNum === 4) { // Stablecoin
      if (!name || !symbol || !collateralToken || !collateralRatio || !treasury) 
        validationError = 'Name, symbol, collateral token, collateral ratio, and treasury are required';
      if (!isAddress(collateralToken)) validationError = 'Invalid collateral token address';
      if (!isAddress(treasury)) validationError = 'Invalid treasury address';
      if (Number(collateralRatio) < 10000) validationError = 'Collateral ratio must be at least 10000';
      functionName = 'createStablecoin';
      args = [name, symbol, collateralToken, BigInt(collateralRatio), treasury];
    } else {
      validationError = 'Invalid token type';
    }

    if (validationError) {
      setError(validationError);
      return;
    }

    setIsTxPending(true);
    writeContract({
      address: FACTORY_CONTRACT_ADDRESS,
      abi: factoryABI,
      functionName,
      args,
    }, {
      onSuccess: (hash: `0x${string}`) => setTxHash(hash),
      onError: () => setIsTxPending(false),
    });
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
        {error && <p className="text-red-400 text-sm mt-2 max-w-md mx-auto">{error}</p>}
      </div>
    </div>
  );

  // Wallet Connection
  const WalletConnection = () => (
    <div className="min-h-screen bg-[#1A0D23] flex items-center justify-center p-4 relative">
      <BackgroundShapes />
      <div className="bg-[#1E1425]/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-purple-500/20 p-8 text-center relative z-10">
        <h2 className="text-2xl font-bold text-white mb-2">Connect Your Wallet</h2>
        <p className="text-gray-300 mb-6">Connect your wallet to create tokens</p>
        <button
          onClick={() => {
            const button = document.querySelector('appkit-button') as HTMLElement;
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

  const allowedTokenTypes = tokenTypes.filter((type) =>
    type.tiers.includes(subscription?.plan || 'Free')
  );

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#1A0D23] p-4 md:p-8 relative">
        <BackgroundShapes />
        <div
          className="welcome-section text-center mb-8 rounded-lg p-6 relative z-10"
          style={{
            background:
              'radial-gradient(50% 206.8% at 50% 50%, rgba(10, 88, 116, 0.7) 0%, rgba(32, 23, 38, 0.7) 56.91%)',
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
            <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <h2 className="font-poppins font-semibold text-xl md:text-2xl mb-6">Create a New Token</h2>
          <div className="bg-[#1E1425]/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-purple-500/10">
            {/* Token Type and Create Button Row */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <label className="text-gray-300 text-sm block mb-2">Token Type</label>
                <select
                  name="tokenType"
                  value={formData.tokenType}
                  onChange={handleInputChange}
                  className="w-full h-12 p-3 bg-[#2A1B35] text-white rounded-lg border border-purple-500/20 focus:outline-none focus:border-purple-500"
                >
                  <option value="">Select Token Type</option>
                  {allowedTokenTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleCreateToken}
                  disabled={isWritePending || isTxPending || isTxConfirming || !subscription?.tokensRemaining}
                  className={`h-12 px-6 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 whitespace-nowrap ${isWritePending || isTxPending || isTxConfirming || !subscription?.tokensRemaining ? 'bg-gray-600 cursor-not-allowed' : 'bg-gradient-to-r from-purple-500 to-blue-600 hover:shadow-xl hover:scale-105'}`}
                >
                  {isWritePending || isTxPending || isTxConfirming
                    ? 'Creating Token...'
                    : !subscription?.tokensRemaining
                    ? 'Token Limit Reached'
                    : 'Create Token'}
                </button>
              </div>
            </div>

            {/* Additional Form Fields */}
            {formData.tokenType !== '' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[0, 1, 3, 4].includes(Number(formData.tokenType)) && (
                  <>
                    <div>
                      <label className="text-gray-300 text-sm">Token Name</label>
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
                      <label className="text-gray-300 text-sm">Token Symbol</label>
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
                      <label className="text-gray-300 text-sm">Initial Supply</label>
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
                      <label className="text-gray-300 text-sm">Max Wallet Size</label>
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
                      <label className="text-gray-300 text-sm">Max Transaction Amount</label>
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
                      <label className="text-gray-300 text-sm">Collateral Token Address</label>
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
                      <label className="text-gray-300 text-sm">Collateral Ratio</label>
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
                      <label className="text-gray-300 text-sm">Treasury Address</label>
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
          <h2 className="font-poppins font-semibold text-xl md:text-2xl mb-6">Your Created Tokens</h2>
          {tokensLoading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400">Loading tokens...</p>
            </div>
          ) : createdTokens.length === 0 ? (
            <p className="text-gray-400">No tokens created yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {createdTokens.map((token, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-purple-500/30 transition-all duration-300 min-w-[250px] max-w-[350px] w-full"
                >
                  <div className="flex flex-col space-y-4">
                    {/* Token Name */}
                    <div className="truncate">
                      <p className="text-white font-semibold text-lg" title={token.name}>{token.name}</p>
                    </div>
                    {/* Token Symbol */}
                    <div>
                      <p className="text-gray-400 text-sm">
                        Symbol: <span className="text-white font-medium">{token.symbol}</span>
                      </p>
                    </div>
                    {/* Token Address */}
                    <div className="truncate">
                      <p className="text-gray-400 text-sm">
                        Address: <span className="text-white font-mono text-xs" title={token.tokenAddress}>{token.tokenAddress}</span>
                      </p>
                    </div>
                    {/* Token Type and Button */}
                    <div className="flex items-center justify-between pt-2 gap-2">
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full border border-green-500/30 truncate max-w-[100px]">
                        {tokenTypes.find(t => t.value === Number(token.tokenType))?.label || 'Unknown'}
                      </span>
                      <button
                        className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-600 text-white text-sm font-semibold rounded-lg hover:opacity-90 transition duration-300 whitespace-nowrap"
                        onClick={() => {
                          router.push(`/dashboard/token-creator/create-tokens/manage-token/${token.tokenAddress}`); // Updated path
                        }}
                      >
                        Manage Token
                      </button>
                      {/* Alternative using Link (commented out):
                      <Link
                        href={`/dashboard/token-creator/manage-token/${token.tokenAddress}`}
                        className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-600 text-white text-sm font-semibold rounded-lg hover:opacity-90 transition duration-300 whitespace-nowrap"
                      >
                        Manage Token
                      </Link>
                      */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {isTxPending && txHash && (
          <p className="text-yellow-400 text-sm relative z-10">
            Transaction pending:{' '}
            <a
              href={`https://etherscan.io/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              {txHash}
            </a>
          </p>
        )}
        {isTxSuccess && (
          <p className="text-green-400 text-sm relative z-10">Token created successfully!</p>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CreateTokensPage;