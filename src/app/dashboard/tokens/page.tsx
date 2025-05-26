'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useReadContract, useWriteContract, useAccount } from 'wagmi';
import { Abi, isAddress } from 'viem';
import DashBoardLayout from '../../../../src/app/dashboard/token-creator/DashboardLayout';
import StrataForgeERC20ImplementationABI from '../../../app/components/ABIs/StrataForgeERC20ImplementationABI.json';
import StrataForgeERC721ImplementationABI from '../../../app/components/ABIs/StrataForgeERC721ImplementationABI.json';
import StrataForgeERC1155ImplementationABI from '../../../app/components/ABIs/StrataForgeERC1155ImplementationABI.json';
import StrataForgeMemecoinImplementationABI from '../../../app/components/ABIs/StrataForgeMemecoinImplementationABI.json';
import StrataForgeStablecoinImplementationABI from '../../../app/components/ABIs/StrataForgeStablecoinImplementationABI.json';

// Background Shapes Component
const BackgroundShapes = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
    <div className="absolute top-20 left-10 w-32 h-32 border border-purple-500/10 rounded-full"></div>
    <div className="absolute top-40 right-20 w-24 h-24 border border-blue-500/10 rotate-45"></div>
    <div className="absolute bottom-32 left-20 w-40 h-40 border border-purple-400/8 rounded-2xl rotate-12"></div>
    <div className="absolute top-1/3 left-1/4 w-16 h-16 border border-cyan-500/10 rotate-45"></div>
    <div className="absolute bottom-1/4 right-1/3 w-28 h-28 border border-purple-300/8 rounded-full"></div>
    <div className="absolute top-10 right-1/3 w-64 h-64 bg-gradient-to-br from-purple-500/3 to-transparent rounded-full blur-3xl"></div>
    <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-gradient-to-tr from-blue-500/3 to-transparent rounded-full blur-2xl"></div>
    <div className="absolute top-1/2 right-10 w-48 h-48 bg-gradient-to-bl from-cyan-500/2 to-transparent rounded-full blur-2xl"></div>
  </div>
);

interface TokenDetails {
  name: string;
  symbol: string;
  decimals?: number;
}

const ManageToken = () => {
  const { address: tokenAddress } = useParams<{ address: string }>();
  const { address: account } = useAccount();
  const [tokenType, setTokenType] = useState<'erc20' | 'erc721' | 'erc1155' | 'meme' | 'stable' | null>(null);
  const [tokenDetails, setTokenDetails] = useState<TokenDetails | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<string | null>(null);
  const [formInputs, setFormInputs] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { writeContract, isPending, error: writeError } = useWriteContract();

  // ABIs for different token types
  const tokenABIs: Record<string, Abi> = {
    erc20: StrataForgeERC20ImplementationABI as Abi,
    erc721: StrataForgeERC721ImplementationABI as Abi,
    erc1155: StrataForgeERC1155ImplementationABI as Abi,
    meme: StrataForgeMemecoinImplementationABI as Abi,
    stable: StrataForgeStablecoinImplementationABI as Abi,
  };

  // Hook calls for token type detection
  const erc721InterfaceCheck = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: tokenABIs.erc721,
    functionName: 'supportsInterface',
    args: ['0x80ac58cd'],
    query: { enabled: !!tokenAddress && isAddress(tokenAddress) },
  });

  const erc1155InterfaceCheck = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: tokenABIs.erc1155,
    functionName: 'supportsInterface',
    args: ['0xd9b67a26'],
    query: { enabled: !!tokenAddress && isAddress(tokenAddress) },
  });

  const memeMaxWalletCheck = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: tokenABIs.meme,
    functionName: 'maxWalletSize',
    query: { enabled: !!tokenAddress && isAddress(tokenAddress) },
  });

  const stableCollateralCheck = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: tokenABIs.stable,
    functionName: 'collateralToken',
    query: { enabled: !!tokenAddress && isAddress(tokenAddress) },
  });

  const erc20DecimalsCheck = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: tokenABIs.erc20,
    functionName: 'decimals',
    query: { enabled: !!tokenAddress && isAddress(tokenAddress) },
  });

  // Detect token type
  useEffect(() => {
    if (!tokenAddress || !isAddress(tokenAddress)) {
      setError('Invalid token address');
      setLoading(false);
      return;
    }

    const detectTokenType = () => {
      try {
        if (erc721InterfaceCheck.data) {
          setTokenType('erc721');
          return;
        }

        if (erc1155InterfaceCheck.data) {
          setTokenType('erc1155');
          return;
        }

        if (memeMaxWalletCheck.data !== undefined && !memeMaxWalletCheck.error) {
          setTokenType('meme');
          return;
        }

        if (stableCollateralCheck.data !== undefined && !stableCollateralCheck.error) {
          setTokenType('stable');
          return;
        }

        if (erc20DecimalsCheck.data !== undefined && !erc20DecimalsCheck.error) {
          setTokenType('erc20');
          return;
        }

        if (
          erc721InterfaceCheck.isLoading ||
          erc1155InterfaceCheck.isLoading ||
          memeMaxWalletCheck.isLoading ||
          stableCollateralCheck.isLoading ||
          erc20DecimalsCheck.isLoading
        ) {
          return; // Still loading
        }

        setError('Unknown token type');
      } catch (err) {
        setError('Failed to detect token type');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    detectTokenType();
  }, [
    tokenAddress,
    erc721InterfaceCheck.data,
    erc721InterfaceCheck.isLoading,
    erc1155InterfaceCheck.data,
    erc1155InterfaceCheck.isLoading,
    memeMaxWalletCheck.data,
    memeMaxWalletCheck.error,
    memeMaxWalletCheck.isLoading,
    stableCollateralCheck.data,
    stableCollateralCheck.error,
    stableCollateralCheck.isLoading,
    erc20DecimalsCheck.data,
    erc20DecimalsCheck.error,
    erc20DecimalsCheck.isLoading,
  ]);

  // Hook calls for token details
  const nameQuery = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: tokenType ? tokenABIs[tokenType] : tokenABIs.erc20,
    functionName: 'name',
    query: { enabled: !!tokenType && !!tokenAddress && isAddress(tokenAddress) },
  });

  const symbolQuery = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: tokenType ? tokenABIs[tokenType] : tokenABIs.erc20,
    functionName: 'symbol',
    query: { enabled: !!tokenType && !!tokenAddress && isAddress(tokenAddress) },
  });

  const decimalsQuery = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: tokenType ? tokenABIs[tokenType] : tokenABIs.erc20,
    functionName: 'decimals',
    query: {
      enabled:
        !!tokenType &&
        !!tokenAddress &&
        isAddress(tokenAddress) &&
        (tokenType === 'erc20' || tokenType === 'meme' || tokenType === 'stable'),
    },
  });

  const ownerQuery = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: tokenType ? tokenABIs[tokenType] : tokenABIs.erc20,
    functionName: 'owner',
    query: { enabled: !!tokenType && !!tokenAddress && isAddress(tokenAddress) },
  });

  // Fetch token details and owner status
  useEffect(() => {
    if (!tokenType || !tokenAddress || !isAddress(tokenAddress)) return;

    const name = nameQuery.data as string;
    const symbol = symbolQuery.data as string;
    const decimals = decimalsQuery.data as number | undefined;
    const owner = ownerQuery.data as string;

    if (name && symbol) {
      setTokenDetails({ name, symbol, decimals });
    }

    setIsOwner(Boolean(owner && account && owner.toLowerCase() === account.toLowerCase()));
  }, [
    tokenType,
    tokenAddress,
    account,
    nameQuery.data,
    symbolQuery.data,
    decimalsQuery.data,
    ownerQuery.data,
  ]);

  // Read functions to display
  const readFunctions: Record<string, { name: string; label: string; args?: unknown[] }[]> = {
    erc20: [
      { name: 'name', label: 'Name' },
      { name: 'symbol', label: 'Symbol' },
      { name: 'decimals', label: 'Decimals' },
      { name: 'totalSupply', label: 'Total Supply' },
      { name: 'balanceOf', label: 'Your Balance', args: [account] },
      { name: 'paused', label: 'Paused' },
    ],
    erc721: [
      { name: 'name', label: 'Name' },
      { name: 'symbol', label: 'Symbol' },
      { name: 'balanceOf', label: 'Your Balance', args: [account] },
      { name: 'paused', label: 'Paused' },
    ],
    erc1155: [
      { name: 'balanceOf', label: 'Balance Of Token ID 1', args: [account, '1'] },
      { name: 'paused', label: 'Paused' },
    ],
    meme: [
      { name: 'name', label: 'Name' },
      { name: 'symbol', label: 'Symbol' },
      { name: 'decimals', label: 'Decimals' },
      { name: 'totalSupply', label: 'Total Supply' },
      { name: 'balanceOf', label: 'Your Balance', args: [account] },
      { name: 'maxWalletSize', label: 'Max Wallet Size' },
      { name: 'maxTransactionAmount', label: 'Max Transaction Amount' },
      { name: 'paused', label: 'Paused' },
    ],
    stable: [
      { name: 'name', label: 'Name' },
      { name: 'symbol', label: 'Symbol' },
      { name: 'decimals', label: 'Decimals' },
      { name: 'totalSupply', label: 'Total Supply' },
      { name: 'balanceOf', label: 'Your Balance', args: [account] },
      { name: 'collateralToken', label: 'Collateral Token' },
      { name: 'collateralRatio', label: 'Collateral Ratio' },
      { name: 'collateralDeposited', label: 'Your Collateral Deposited', args: [account] },
      { name: 'paused', label: 'Paused' },
    ],
  };

  // Write functions with input requirements
  const writeFunctions: Record<
    string,
    { name: string; args: string[]; inputs: { label: string; type: string; default?: string }[]; ownerOnly?: boolean }[]
  > = {
    erc20: [
      {
        name: 'transfer',
        args: ['to', 'amount'],
        inputs: [
          { label: 'To Address', type: 'address' },
          { label: 'Amount', type: 'number' },
        ],
      },
      {
        name: 'approve',
        args: ['spender', 'amount'],
        inputs: [
          { label: 'Spender Address', type: 'address' },
          { label: 'Amount', type: 'number' },
        ],
      },
      {
        name: 'mint',
        args: ['to', 'amount'],
        inputs: [
          { label: 'To Address', type: 'address' },
          { label: 'Amount', type: 'number' },
        ],
        ownerOnly: true,
      },
      { name: 'burn', args: ['amount'], inputs: [{ label: 'Amount', type: 'number' }] },
      { name: 'pause', args: [], inputs: [], ownerOnly: true },
      { name: 'unpause', args: [], inputs: [], ownerOnly: true },
    ],
    erc721: [
      {
        name: 'mint',
        args: ['to'],
        inputs: [{ label: 'To Address', type: 'address' }],
        ownerOnly: true,
      },
      {
        name: 'mintWithURI',
        args: ['to', 'uri'],
        inputs: [
          { label: 'To Address', type: 'address' },
          { label: 'Token URI', type: 'text' },
        ],
        ownerOnly: true,
      },
      {
        name: 'setBaseURI',
        args: ['baseURI'],
        inputs: [{ label: 'Base URI', type: 'text' }],
        ownerOnly: true,
      },
      {
        name: 'safeTransferFrom',
        args: ['from', 'to', 'tokenId'],
        inputs: [
          { label: 'From Address', type: 'address' },
          { label: 'To Address', type: 'address' },
          { label: 'Token ID', type: 'number' },
        ],
      },
      { name: 'pause', args: [], inputs: [], ownerOnly: true },
      { name: 'unpause', args: [], inputs: [], ownerOnly: true },
    ],
    erc1155: [
      {
        name: 'mint',
        args: ['to', 'id', 'amount', 'data'],
        inputs: [
          { label: 'To Address', type: 'address' },
          { label: 'Token ID', type: 'number' },
          { label: 'Amount', type: 'number' },
          { label: 'Data', type: 'text', default: '0x' },
        ],
        ownerOnly: true,
      },
      {
        name: 'setURI',
        args: ['newuri'],
        inputs: [{ label: 'URI', type: 'text' }],
        ownerOnly: true,
      },
      {
        name: 'setTokenURI',
        args: ['id', 'tokenURI'],
        inputs: [
          { label: 'Token ID', type: 'number' },
          { label: 'Token URI', type: 'text' },
        ],
        ownerOnly: true,
      },
      {
        name: 'safeTransferFrom',
        args: ['from', 'to', 'id', 'amount', 'data'],
        inputs: [
          { label: 'From Address', type: 'address' },
          { label: 'To Address', type: 'address' },
          { label: 'Token ID', type: 'number' },
          { label: 'Amount', type: 'number' },
          { label: 'Data', type: 'text', default: '0x' },
        ],
      },
      { name: 'pause', args: [], inputs: [], ownerOnly: true },
      { name: 'unpause', args: [], inputs: [], ownerOnly: true },
    ],
    meme: [
      {
        name: 'transfer',
        args: ['to', 'amount'],
        inputs: [
          { label: 'To Address', type: 'address' },
          { label: 'Amount', type: 'number' },
        ],
      },
      {
        name: 'approve',
        args: ['spender', 'amount'],
        inputs: [
          { label: 'Spender Address', type: 'address' },
          { label: 'Amount', type: 'number' },
        ],
      },
      {
        name: 'mint',
        args: ['to', 'amount'],
        inputs: [
          { label: 'To Address', type: 'address' },
          { label: 'Amount', type: 'number' },
        ],
        ownerOnly: true,
      },
      { name: 'burn', args: ['amount'], inputs: [{ label: 'Amount', type: 'number' }] },
      {
        name: 'setMaxWalletSize',
        args: ['amount'],
        inputs: [{ label: 'Max Wallet Size', type: 'number' }],
        ownerOnly: true,
      },
      {
        name: 'setMaxTransactionAmount',
        args: ['amount'],
        inputs: [{ label: 'Max Transaction Amount', type: 'number' }],
        ownerOnly: true,
      },
      {
        name: 'excludeFromLimits',
        args: ['account', 'excluded'],
        inputs: [
          { label: 'Account Address', type: 'address' },
          { label: 'Excluded', type: 'checkbox' },
        ],
        ownerOnly: true,
      },
      { name: 'pause', args: [], inputs: [], ownerOnly: true },
      { name: 'unpause', args: [], inputs: [], ownerOnly: true },
    ],
    stable: [
      {
        name: 'transfer',
        args: ['to', 'amount'],
        inputs: [
          { label: 'To Address', type: 'address' },
          { label: 'Amount', type: 'number' },
        ],
      },
      {
        name: 'approve',
        args: ['spender', 'amount'],
        inputs: [
          { label: 'Spender Address', type: 'address' },
          { label: 'Amount', type: 'number' },
        ],
      },
      {
        name: 'mint',
        args: ['collateralAmount'],
        inputs: [{ label: 'Collateral Amount', type: 'number' }],
      },
      {
        name: 'redeem',
        args: ['tokenAmount'],
        inputs: [{ label: 'Token Amount', type: 'number' }],
      },
      { name: 'burn', args: ['amount'], inputs: [{ label: 'Amount', type: 'number' }] },
      {
        name: 'setCollateralRatio',
        args: ['_collateralRatio'],
        inputs: [{ label: 'Collateral Ratio', type: 'number' }],
        ownerOnly: true,
      },
      {
        name: 'setFees',
        args: ['_mintFee', '_redeemFee'],
        inputs: [
          { label: 'Mint Fee', type: 'number' },
          { label: 'Redeem Fee', type: 'number' },
        ],
        ownerOnly: true,
      },
      {
        name: 'setTreasury',
        args: ['_treasury'],
        inputs: [{ label: 'Treasury Address', type: 'address' }],
        ownerOnly: true,
      },
      { name: 'pause', args: [], inputs: [], ownerOnly: true },
      { name: 'unpause', args: [], inputs: [], ownerOnly: true },
    ],
  };

  // Handle modal form input changes
  const handleInputChange = (key: string, value: string | boolean) => {
    setFormInputs(prev => ({
      ...prev,
      [key]: typeof value === 'boolean' ? value.toString() : value,
    }));
  };

  // Execute write function
  const handleWrite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalAction || !tokenType || !tokenAddress || !account) return;

    const action = writeFunctions[tokenType].find((f: { name: string }) => f.name === modalAction);
    if (!action) return;

    try {
      const args = action.args.map((arg: string) => {
        const value = formInputs[arg];
        if (value === undefined) throw new Error(`Missing ${arg}`);
        if (arg.includes('address') && !isAddress(value)) throw new Error(`Invalid address for ${arg}`);
        if (
          arg.includes('amount') ||
          arg.includes('id') ||
          arg.includes('fee') ||
          arg.includes('ratio') ||
          arg.includes('tokenId')
        ) {
          const num = Number(value);
          if (isNaN(num) || num <= 0) throw new Error(`Invalid number for ${arg}`);
          return BigInt(num);
        }
        if (arg === 'excluded') return value === 'true';
        return value;
      });

      await writeContract({
        address: tokenAddress as `0x${string}`,
        abi: tokenABIs[tokenType],
        functionName: modalAction,
        args,
        account: account as `0x${string}`,
      });

      setModalOpen(false);
      setFormInputs({});
      setError(null);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Transaction failed';
      setError(errorMessage);
    }
  };

  // Open modal for write action
  const openModal = (action: string) => {
    setModalAction(action);
    setModalOpen(true);
    setFormInputs({});
  };

  // Render read function result
  const ReadCard = ({ func }: { func: { name: string; label: string; args?: unknown[] } }) => {
    const { data, error: readError } = useReadContract({
      address: tokenAddress as `0x${string}`,
      abi: tokenABIs[tokenType!],
      functionName: func.name,
      args: func.args,
      query: { enabled: !!tokenType && !!tokenAddress },
    });

    return (
      <div className="bg-[#1E1425]/80 rounded-xl p-4 border border-purple-500/20">
        <p className="text-gray-700 text-sm font-medium">{func.label}</p>
        <p className="text-white text-lg mt-1 truncate">
          {readError ? 'Error fetching data' : data?.toString() || 'Loading...'}
        </p>
      </div>
    );
  };

  // Modal for write actions
  const WriteModal = () => {
    if (!modalOpen || !modalAction || !tokenType) return null;

    const action = writeFunctions[tokenType].find((f: { name: string }) => f.name === modalAction);
    if (!action) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-[#1E1425] p-6 rounded-xl max-w-md w-full border border-purple-500/20">
          <h3 className="text-xl text-white font-semibold mb-4">{action.name}</h3>
          <form onSubmit={handleWrite}>
            {action.inputs.map((input: { label: string; type: string; default?: string }, index: number) => (
              <div key={index} className="mb-4">
                <label className="block text-sm font-medium text-gray-400 mb-1">{input.label}</label>
                {input.type === 'checkbox' ? (
                  <input
                    type="checkbox"
                    checked={formInputs[input.label] === 'true'}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(input.label, e.target.checked)}
                    className="mt-1 rounded border-gray-600 text-purple-600 focus:ring-purple-500"
                  />
                ) : (
                  <input
                    type={input.type === 'number' ? 'number' : 'text'}
                    value={formInputs[input.label] || input.default || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(input.label, e.target.value)}
                    placeholder={input.label}
                    className="w-full p-2 bg-[#2A1F36] border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                )}
              </div>
            ))}
            {error && <p className="text-red-300 text-sm mb-2">{error}</p>}
            {writeError && <p className="text-red-300 text-sm mb-2">{writeError.message || 'Transaction error'}</p>}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => {
                  setModalOpen(false);
                  setModalAction(null);
                  setError(null);
                }}
                className="px-4 py-2 bg-gray-600 text-gray-300 rounded-xl hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? 'Processing...' : 'Execute'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <DashBoardLayout>
        <div className="flex items-center justify-center min-h-screen bg-[#1A0D23] relative">
          <BackgroundShapes />
          <div className="w-16 h-16 border-4 border-gray-200 border-t-purple-600 rounded-full animate-spin relative z-10"></div>
        </div>
      </DashBoardLayout>
    );
  }

  if (error || !tokenType || !tokenDetails) {
    return (
      <DashBoardLayout>
        <div className="min-h-screen bg-[#1A0D23] p-4 md:p-8 relative">
          <BackgroundShapes />
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center space-x-3 relative z-10">
            <p className="text-red-300 font-medium">{error || 'Failed to load token data'}</p>
          </div>
        </div>
      </DashBoardLayout>
    );
  }

  return (
    <DashBoardLayout>
      <div className="min-h-screen bg-[#1A0D23] p-4 md:p-8 relative">
        <BackgroundShapes />
        <div className="mb-8 relative z-10">
          <h1 className="font-poppins font-semibold text-3xl md:text-4xl text-white mb-2">
            Manage Token: {tokenDetails.name} ({tokenDetails.symbol})
          </h1>
          <p className="text-gray-400">Address: {tokenAddress}</p>
          <p className="text-gray-400">Type: {tokenType.toUpperCase()}</p>
        </div>

        <div className="mb-10 relative z-10">
          <h2 className="font-poppins font-semibold text-xl md:text-2xl mb-6 text-white">Token Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {readFunctions[tokenType].map(func => (
              <ReadCard key={func.name} func={func} />
            ))}
          </div>
        </div>

        <div className="mb-10 relative z-10">
          <h2 className="font-poppins font-semibold text-xl md:text-2xl mb-6 text-white">Token Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {writeFunctions[tokenType]
              .filter(action => !action.ownerOnly || isOwner)
              .map(action => (
                <button
                  key={action.name}
                  onClick={() => openModal(action.name)}
                  disabled={isPending}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-xl hover:opacity-90 transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {action.name}
                </button>
              ))}
          </div>
        </div>
        <WriteModal />
      </div>
    </DashBoardLayout>
  );
};

export default ManageToken;