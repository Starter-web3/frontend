'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useWriteContract, useReadContract } from 'wagmi';
import { isAddress } from 'viem';
import { baseSepolia } from '../../../lib/wagmi-config'; // Adjust path as needed
import { useWallet } from '../../../contexts/WalletContext'; // Import our context

// The rest of your imports and constant definitions remain the same
// ABI for PropertyNFT contract
const PROPERTY_NFT_ABI = [
  // View functions
  {
    inputs: [],
    name: 'isInitialized',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getProperty',
    outputs: [
      { internalType: 'string', name: 'metadataURI', type: 'string' },
      { internalType: 'string', name: 'title', type: 'string' },
      { internalType: 'string', name: 'description', type: 'string' },
      { internalType: 'string', name: 'addressProp', type: 'string' },
      { internalType: 'uint16', name: 'unitsAvailable', type: 'uint16' },
      { internalType: 'uint256', name: 'totalCost', type: 'uint256' },
      { internalType: 'bool', name: 'verified', type: 'bool' },
      { internalType: 'uint8', name: 'transactionType', type: 'uint8' },
      { internalType: 'uint40', name: 'timestamp', type: 'uint40' },
      { internalType: 'uint16', name: 'nextTokenId', type: 'uint16' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'isVerified',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'isBurned',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  // Write functions
  {
    inputs: [
      { internalType: 'string', name: 'metadataURI', type: 'string' },
      { internalType: 'string', name: 'title', type: 'string' },
      { internalType: 'string', name: 'description', type: 'string' },
      { internalType: 'string', name: 'addressProp', type: 'string' },
      { internalType: 'uint16', name: 'unitsAvailable', type: 'uint16' },
      { internalType: 'uint256', name: 'totalCost', type: 'uint256' },
      { internalType: 'uint8', name: 'transactionType', type: 'uint8' },
    ],
    name: 'initializeProperty',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'to', type: 'address' }],
    name: 'mintPropertyNFT',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'burn',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'pause',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'unpause',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

// Transaction Type enum mapping
const transactionTypes = ['Sale', 'Rent', 'Lease', 'Booking', 'Investment'];

// Property form interface
interface PropertyFormData {
  metadataURI: string;
  title: string;
  description: string;
  addressProp: string;
  unitsAvailable: number;
  totalCost: string; // Use string for input, convert to bigint when sending
  transactionType: number;
}

// Property detail interface based on contract return
interface PropertyDetails {
  metadataURI: string;
  title: string;
  description: string;
  addressProp: string;
  unitsAvailable: number;
  totalCost: bigint;
  verified: boolean;
  transactionType: number;
  timestamp: number;
  nextTokenId: number;
}

// Mint form interface
interface MintFormData {
  recipient: string;
}

const PropertyNFTDashboard = () => {
  const searchParams = useSearchParams();
  const [propertyAddress, setPropertyAddress] = useState<`0x${string}` | null>(null);
  // Use our global wallet context
  const { address: account, isConnected } = useWallet();
  const { writeContractAsync, data: txHash, error: writeError, isPending } = useWriteContract();

  // The rest of your component code remains the same
  // Only the wallet connection parts are updated

  // State for property detail
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [propertyDetails, setPropertyDetails] = useState<PropertyDetails | null>(null);
  const [isPropertyInitialized, setIsPropertyInitialized] = useState<boolean>(false);
  const [isPropertyBurned, setIsPropertyBurned] = useState<boolean>(false);
  const [initFormData, setInitFormData] = useState<PropertyFormData>({
    metadataURI: '',
    title: '',
    description: '',
    addressProp: '',
    unitsAvailable: 1,
    totalCost: '0',
    transactionType: 0,
  });
  const [mintFormData, setMintFormData] = useState<MintFormData>({
    recipient: '',
  });

  // UI state
  const [activeTab, setActiveTab] = useState<'details' | 'initialize' | 'mint' | 'manage'>(
    'details',
  );
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Initialize from URL parameter
  useEffect(() => {
    const address = searchParams.get('address');
    if (address && isAddress(address)) {
      setPropertyAddress(address as `0x${string}`);
    }
  }, [searchParams]);

  // Fetch property owner
  const { data: ownerAddress, refetch: refetchOwner } = useReadContract({
    address: propertyAddress ?? undefined,
    abi: PROPERTY_NFT_ABI,
    functionName: 'owner',
    chainId: baseSepolia.id,
    query: { enabled: !!propertyAddress },
  });

  // Check if property is initialized
  const { data: initialized, refetch: refetchInitialized } = useReadContract({
    address: propertyAddress ?? undefined,
    abi: PROPERTY_NFT_ABI,
    functionName: 'isInitialized',
    chainId: baseSepolia.id,
    query: { enabled: !!propertyAddress },
  });

  // Check if property is burned
  const { data: burned, refetch: refetchBurned } = useReadContract({
    address: propertyAddress ?? undefined,
    abi: PROPERTY_NFT_ABI,
    functionName: 'isBurned',
    chainId: baseSepolia.id,
    query: { enabled: !!propertyAddress },
  });

  // Fetch property details if initialized
  const { data: property, refetch: refetchProperty } = useReadContract({
    address: propertyAddress ?? undefined,
    abi: PROPERTY_NFT_ABI,
    functionName: 'getProperty',
    chainId: baseSepolia.id,
    query: { enabled: !!propertyAddress && !!initialized },
  });

  // Update local state based on contract data
  useEffect(() => {
    if (ownerAddress && account) {
      setIsOwner(
        typeof ownerAddress === 'string' &&
          typeof account === 'string' &&
          ownerAddress.toLowerCase() === account.toLowerCase(),
      );
    }

    if (initialized !== undefined) {
      setIsPropertyInitialized(!!initialized);
    }

    if (burned !== undefined) {
      setIsPropertyBurned(!!burned);
    }

    if (property && Array.isArray(property)) {
      setPropertyDetails({
        metadataURI: property[0] as string,
        title: property[1] as string,
        description: property[2] as string,
        addressProp: property[3] as string,
        unitsAvailable: Number(property[4]),
        totalCost: property[5] as bigint,
        verified: property[6] as boolean,
        transactionType: Number(property[7]),
        timestamp: Number(property[8]),
        nextTokenId: Number(property[9]),
      });
    }
  }, [ownerAddress, account, initialized, burned, property]);

  // Handle transaction confirmation and refresh data
  useEffect(() => {
    if (!txHash || loading) return;

    const waitForConfirmation = async () => {
      setLoading(true);
      try {
        // Wait a bit for transaction to be included
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Refetch all data
        await refetchOwner();
        await refetchInitialized();
        await refetchBurned();
        if (isPropertyInitialized) {
          await refetchProperty();
        }

        setSuccessMessage('Transaction confirmed successfully');
        // Reset form states after successful transaction
        if (activeTab === 'initialize') {
          setActiveTab('details');
        }
      } catch (err: any) {
        console.error('Error refreshing data:', err);
        setError(err.message || 'Failed to refresh property data');
      } finally {
        setLoading(false);
      }
    };

    waitForConfirmation();
  }, [
    txHash,
    refetchOwner,
    refetchInitialized,
    refetchBurned,
    refetchProperty,
    isPropertyInitialized,
    activeTab,
    loading,
  ]);

  // Handle write errors
  useEffect(() => {
    if (writeError) {
      setLoading(false);
      let errorMessage = 'Transaction failed';

      if (writeError.message) {
        errorMessage = writeError.message;
      }

      setError(errorMessage);
    }
  }, [writeError]);

  // Handle form changes
  const handleInitFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    if (name === 'unitsAvailable') {
      const numValue = parseInt(value);
      if (!isNaN(numValue) && numValue > 0 && numValue <= 65535) {
        setInitFormData({ ...initFormData, [name]: numValue });
      }
    } else if (name === 'transactionType') {
      setInitFormData({ ...initFormData, [name]: parseInt(value) });
    } else {
      setInitFormData({ ...initFormData, [name]: value });
    }
  };

  const handleMintFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMintFormData({ ...mintFormData, [e.target.name]: e.target.value });
  };

  // Validate initialize form
  const validateInitForm = (): boolean => {
    if (!initFormData.metadataURI) {
      setError('Metadata URI is required');
      return false;
    }

    if (!initFormData.title || initFormData.title.length > 100) {
      setError('Title is required and must be 100 characters or less');
      return false;
    }

    if (!initFormData.description || initFormData.description.length > 500) {
      setError('Description is required and must be 500 characters or less');
      return false;
    }

    if (!initFormData.addressProp) {
      setError('Property address is required');
      return false;
    }

    if (initFormData.unitsAvailable <= 0 || initFormData.unitsAvailable > 65535) {
      setError('Units available must be between 1 and 65535');
      return false;
    }

    const costBigInt = BigInt(initFormData.totalCost);
    if (costBigInt <= BigInt(0)) {
      setError('Total cost must be greater than 0');
      return false;
    }

    return true;
  };

  // Validate mint form
  const validateMintForm = (): boolean => {
    if (!mintFormData.recipient || !isAddress(mintFormData.recipient)) {
      setError('Valid recipient address is required');
      return false;
    }
    return true;
  };

  // Handle initialize property submission
  const handleInitializeProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      if (!account) {
        setError('Wallet not connected');
        setLoading(false);
        return;
      }

      if (!propertyAddress) {
        setError('No property address found');
        setLoading(false);
        return;
      }

      if (!validateInitForm()) {
        setLoading(false);
        return;
      }

      await writeContractAsync({
        address: propertyAddress,
        abi: PROPERTY_NFT_ABI,
        functionName: 'initializeProperty',
        args: [
          initFormData.metadataURI,
          initFormData.title,
          initFormData.description,
          initFormData.addressProp,
          initFormData.unitsAvailable,
          BigInt(initFormData.totalCost),
          initFormData.transactionType,
        ],
      });

      console.log('Initialize transaction submitted');
    } catch (err: any) {
      console.error('Error submitting initialize transaction:', err);
      setError(err.message || 'Failed to initialize property');
      setLoading(false);
    }
  };

  // Handle mint NFT submission
  const handleMintNFT = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      if (!account) {
        setError('Wallet not connected');
        setLoading(false);
        return;
      }

      if (!propertyAddress) {
        setError('No property address found');
        setLoading(false);
        return;
      }

      if (!validateMintForm()) {
        setLoading(false);
        return;
      }

      await writeContractAsync({
        address: propertyAddress,
        abi: PROPERTY_NFT_ABI,
        functionName: 'mintPropertyNFT',
        args: [mintFormData.recipient],
      });

      console.log('Mint transaction submitted');
    } catch (err: any) {
      console.error('Error submitting mint transaction:', err);
      setError(err.message || 'Failed to mint NFT');
      setLoading(false);
    }
  };

  // Handle burn property
  const handleBurnProperty = async () => {
    if (
      !window.confirm('Are you sure you want to burn this property? This action cannot be undone.')
    ) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      if (!account) {
        setError('Wallet not connected');
        setLoading(false);
        return;
      }

      if (!propertyAddress) {
        setError('No property address found');
        setLoading(false);
        return;
      }

      await writeContractAsync({
        address: propertyAddress,
        abi: PROPERTY_NFT_ABI,
        functionName: 'burn',
      });

      console.log('Burn transaction submitted');
    } catch (err: any) {
      console.error('Error submitting burn transaction:', err);
      setError(err.message || 'Failed to burn property');
      setLoading(false);
    }
  };

  // Handle pause/unpause property
  const handleTogglePause = async (pause: boolean) => {
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      if (!account) {
        setError('Wallet not connected');
        setLoading(false);
        return;
      }

      if (!propertyAddress) {
        setError('No property address found');
        setLoading(false);
        return;
      }

      await writeContractAsync({
        address: propertyAddress,
        abi: PROPERTY_NFT_ABI,
        functionName: pause ? 'pause' : 'unpause',
      });

      console.log(`${pause ? 'Pause' : 'Unpause'} transaction submitted`);
    } catch (err: any) {
      console.error(`Error submitting ${pause ? 'pause' : 'unpause'} transaction:`, err);
      setError(err.message || `Failed to ${pause ? 'pause' : 'unpause'} property`);
      setLoading(false);
    }
  };

  // Format timestamp to readable date
  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  // Format totalCost to ETH
  const formatTotalCost = (wei: bigint) => {
    return Number(wei) / 1e18;
  };

  return (
    <div className='max-w-6xl mx-auto px-4 py-8 font-inter text-white'>
      <h1 className='text-2xl font-semibold mb-8'>Property NFT Dashboard</h1>

      {error && (
        <div className='bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6'>
          <p className='text-red-300'>{error}</p>
        </div>
      )}

      {successMessage && (
        <div className='bg-green-500/20 border border-green-500/50 rounded-lg p-4 mb-6'>
          <p className='text-green-300'>{successMessage}</p>
        </div>
      )}

      {!isConnected ? (
        <div className='text-center py-12 bg-[#1D0E2E] rounded-lg'>
          <p className='text-white/70 mb-4'>Connect your wallet to manage properties</p>
        </div>
      ) : !propertyAddress ? (
        <div className='text-center py-12 bg-[#1D0E2E] rounded-lg'>
          <p className='text-white/70 mb-4'>No property address found. Create a property first.</p>
        </div>
      ) : (
        <div className='bg-[#1D0E2E] rounded-lg p-6 border border-white/10'>
          <div className='mb-6 flex justify-between items-center'>
            <h2 className='text-xl font-medium'>
              Property NFT: {propertyAddress.slice(0, 6)}...{propertyAddress.slice(-4)}
            </h2>
            <div className='flex space-x-2'>
              {isPropertyBurned ? (
                <span className='px-3 py-1 text-sm bg-red-500/20 text-red-300 rounded-md'>
                  Burned
                </span>
              ) : isPropertyInitialized ? (
                <span className='px-3 py-1 text-sm bg-green-500/20 text-green-300 rounded-md'>
                  Initialized
                </span>
              ) : (
                <span className='px-3 py-1 text-sm bg-yellow-500/20 text-yellow-300 rounded-md'>
                  Not Initialized
                </span>
              )}
              {isOwner && (
                <span className='px-3 py-1 text-sm bg-blue-500/20 text-blue-300 rounded-md'>
                  You are owner
                </span>
              )}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className='border-b border-white/10 mb-6'>
            <nav className='flex space-x-6'>
              <button
                onClick={() => setActiveTab('details')}
                className={`pb-3 px-1 ${
                  activeTab === 'details'
                    ? 'border-b-2 border-teal-400 text-teal-400'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                Details
              </button>
              {isOwner && !isPropertyInitialized && !isPropertyBurned && (
                <button
                  onClick={() => setActiveTab('initialize')}
                  className={`pb-3 px-1 ${
                    activeTab === 'initialize'
                      ? 'border-b-2 border-teal-400 text-teal-400'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  Initialize
                </button>
              )}
              {isOwner && isPropertyInitialized && !isPropertyBurned && (
                <>
                  <button
                    onClick={() => setActiveTab('mint')}
                    className={`pb-3 px-1 ${
                      activeTab === 'mint'
                        ? 'border-b-2 border-teal-400 text-teal-400'
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    Mint NFT
                  </button>
                  <button
                    onClick={() => setActiveTab('manage')}
                    className={`pb-3 px-1 ${
                      activeTab === 'manage'
                        ? 'border-b-2 border-teal-400 text-teal-400'
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    Manage
                  </button>
                </>
              )}
            </nav>
          </div>

          {/* Details Tab */}
          {activeTab === 'details' && (
            <div className='space-y-6'>
              {!isPropertyInitialized ? (
                <div className='text-center py-8'>
                  <p className='text-white/70'>This property has not been initialized yet.</p>
                  {isOwner && (
                    <button
                      onClick={() => setActiveTab('initialize')}
                      className='mt-4 px-4 py-2 bg-gradient-to-r from-teal-500 to-purple-500 rounded-lg font-medium'
                    >
                      Initialize Property
                    </button>
                  )}
                </div>
              ) : isPropertyBurned ? (
                <div className='text-center py-8'>
                  <p className='text-white/70'>
                    This property has been burned and is no longer active.
                  </p>
                </div>
              ) : propertyDetails ? (
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div className='space-y-4'>
                    <div>
                      <h3 className='text-sm text-white/50 mb-1'>Title</h3>
                      <p className='text-white font-medium'>{propertyDetails.title}</p>
                    </div>
                    <div>
                      <h3 className='text-sm text-white/50 mb-1'>Description</h3>
                      <p className='text-white'>{propertyDetails.description}</p>
                    </div>
                    <div>
                      <h3 className='text-sm text-white/50 mb-1'>Property Address</h3>
                      <p className='text-white'>{propertyDetails.addressProp}</p>
                    </div>
                    <div>
                      <h3 className='text-sm text-white/50 mb-1'>Metadata URI</h3>
                      <p className='text-white break-all'>{propertyDetails.metadataURI}</p>
                    </div>
                  </div>
                  <div className='space-y-4'>
                    <div>
                      <h3 className='text-sm text-white/50 mb-1'>Transaction Type</h3>
                      <p className='text-white'>
                        {transactionTypes[propertyDetails.transactionType] || 'Unknown'}
                      </p>
                    </div>
                    <div>
                      <h3 className='text-sm text-white/50 mb-1'>Total Cost</h3>
                      <p className='text-white'>{formatTotalCost(propertyDetails.totalCost)} ETH</p>
                    </div>
                    <div>
                      <h3 className='text-sm text-white/50 mb-1'>Units</h3>
                      <p className='text-white'>
                        {propertyDetails.nextTokenId} / {propertyDetails.unitsAvailable} minted
                      </p>
                    </div>
                    <div>
                      <h3 className='text-sm text-white/50 mb-1'>Status</h3>
                      <div className='flex items-center space-x-2'>
                        <span
                          className={`inline-block w-3 h-3 rounded-full ${
                            propertyDetails.verified ? 'bg-green-400' : 'bg-yellow-400'
                          }`}
                        ></span>
                        <span>{propertyDetails.verified ? 'Verified' : 'Not Verified'}</span>
                      </div>
                    </div>
                    <div>
                      <h3 className='text-sm text-white/50 mb-1'>Last Updated</h3>
                      <p className='text-white'>{formatTimestamp(propertyDetails.timestamp)}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className='text-center py-8 text-white/70'>Loading property details...</p>
              )}
            </div>
          )}

          {/* Initialize Tab */}
          {activeTab === 'initialize' && isOwner && !isPropertyInitialized && !isPropertyBurned && (
            <form onSubmit={handleInitializeProperty} className='space-y-4'>
              <div>
                <label htmlFor='metadataURI' className='block mb-2 text-sm'>
                  Metadata URI <span className='text-red-400'>*</span>
                </label>
                <input
                  type='text'
                  id='metadataURI'
                  name='metadataURI'
                  value={initFormData.metadataURI}
                  onChange={handleInitFormChange}
                  placeholder='ipfs://...'
                  className='w-full px-4 py-3 rounded-lg bg-[#2D1E3E] border border-white/10 focus:outline-none focus:ring-1 focus:ring-teal-400'
                  required
                />
              </div>
              <div>
                <label htmlFor='title' className='block mb-2 text-sm'>
                  Title <span className='text-red-400'>*</span>
                </label>
                <input
                  type='text'
                  id='title'
                  name='title'
                  value={initFormData.title}
                  onChange={handleInitFormChange}
                  placeholder='Property title (max 100 characters)'
                  maxLength={100}
                  className='w-full px-4 py-3 rounded-lg bg-[#2D1E3E] border border-white/10 focus:outline-none focus:ring-1 focus:ring-teal-400'
                  required
                />
              </div>
              <div>
                <label htmlFor='description' className='block mb-2 text-sm'>
                  Description <span className='text-red-400'>*</span>
                </label>
                <textarea
                  id='description'
                  name='description'
                  value={initFormData.description}
                  onChange={handleInitFormChange}
                  placeholder='Property description (max 500 characters)'
                  maxLength={500}
                  rows={4}
                  className='w-full px-4 py-3 rounded-lg bg-[#2D1E3E] border border-white/10 focus:outline-none focus:ring-1 focus:ring-teal-400'
                  required
                />
              </div>
              <div>
                <label htmlFor='addressProp' className='block mb-2 text-sm'>
                  Property Address <span className='text-red-400'>*</span>
                </label>
                <input
                  type='text'
                  id='addressProp'
                  name='addressProp'
                  value={initFormData.addressProp}
                  onChange={handleInitFormChange}
                  placeholder='Physical property address'
                  className='w-full px-4 py-3 rounded-lg bg-[#2D1E3E] border border-white/10 focus:outline-none focus:ring-1 focus:ring-teal-400'
                  required
                />
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label htmlFor='unitsAvailable' className='block mb-2 text-sm'>
                    Units Available <span className='text-red-400'>*</span>
                  </label>
                  <input
                    type='number'
                    id='unitsAvailable'
                    name='unitsAvailable'
                    value={initFormData.unitsAvailable}
                    onChange={handleInitFormChange}
                    min={1}
                    max={65535}
                    className='w-full px-4 py-3 rounded-lg bg-[#2D1E3E] border border-white/10 focus:outline-none focus:ring-1 focus:ring-teal-400'
                    required
                  />
                </div>
                <div>
                  <label htmlFor='totalCost' className='block mb-2 text-sm'>
                    Total Cost (ETH) <span className='text-red-400'>*</span>
                  </label>
                  <input
                    type='text'
                    id='totalCost'
                    name='totalCost'
                    value={initFormData.totalCost}
                    onChange={handleInitFormChange}
                    placeholder='0.0'
                    className='w-full px-4 py-3 rounded-lg bg-[#2D1E3E] border border-white/10 focus:outline-none focus:ring-1 focus:ring-teal-400'
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor='transactionType' className='block mb-2 text-sm'>
                  Transaction Type <span className='text-red-400'>*</span>
                </label>
                <select
                  id='transactionType'
                  name='transactionType'
                  value={initFormData.transactionType}
                  onChange={handleInitFormChange}
                  className='w-full px-4 py-3 rounded-lg bg-[#2D1E3E] border border-white/10 focus:outline-none focus:ring-1 focus:ring-teal-400'
                  required
                >
                  {transactionTypes.map((type, index) => (
                    <option key={index} value={index}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type='submit'
                disabled={loading || isPending}
                className='w-full py-4 mt-4 rounded-lg bg-gradient-to-r from-teal-500 to-purple-500 text-white font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {loading || isPending ? 'Initializing...' : 'Initialize Property'}
              </button>
            </form>
          )}

          {/* Mint Tab */}
          {activeTab === 'mint' && isOwner && isPropertyInitialized && !isPropertyBurned && (
            <div className='space-y-6'>
              <div className='bg-[#2D1E3E]/50 p-4 rounded-lg'>
                <p className='text-sm text-white/70'>
                  Units Minted: {propertyDetails?.nextTokenId || 0} of{' '}
                  {propertyDetails?.unitsAvailable || 0}
                </p>
                <div className='h-2 bg-[#1D0E2E] rounded-full mt-2'>
                  <div
                    className='h-2 bg-gradient-to-r from-teal-500 to-purple-500 rounded-full'
                    style={{
                      width: `${
                        propertyDetails
                          ? (propertyDetails.nextTokenId / propertyDetails.unitsAvailable) * 100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              <form onSubmit={handleMintNFT} className='space-y-4'>
                <div>
                  <label htmlFor='recipient' className='block mb-2 text-sm'>
                    Recipient Address <span className='text-red-400'>*</span>
                  </label>
                  <input
                    type='text'
                    id='recipient'
                    name='recipient'
                    value={mintFormData.recipient}
                    onChange={handleMintFormChange}
                    placeholder='0x...'
                    className='w-full px-4 py-3 rounded-lg bg-[#2D1E3E] border border-white/10 focus:outline-none focus:ring-1 focus:ring-teal-400'
                    required
                  />
                  <p className='text-sm text-white/50 mt-1'>
                    Address that will receive the NFT token
                  </p>
                </div>
                <button
                  type='submit'
                  disabled={
                    loading ||
                    isPending ||
                    (propertyDetails?.nextTokenId !== undefined &&
                      propertyDetails.nextTokenId >= (propertyDetails.unitsAvailable ?? 0))
                  }
                  className='w-full py-4 mt-4 rounded-lg bg-gradient-to-r from-teal-500 to-purple-500 text-white font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {loading || isPending
                    ? 'Minting...'
                    : propertyDetails &&
                      propertyDetails.nextTokenId >= propertyDetails.unitsAvailable
                    ? 'All Units Minted'
                    : 'Mint Property NFT'}
                </button>
              </form>
            </div>
          )}

          {/* Manage Tab */}
          {activeTab === 'manage' && isOwner && isPropertyInitialized && !isPropertyBurned && (
            <div className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='p-4 bg-[#2D1E3E]/50 rounded-lg'>
                  <h3 className='font-medium mb-2'>Pause Operations</h3>
                  <p className='text-sm text-white/70 mb-4'>
                    Temporarily pause all operations on this property
                  </p>
                  <div className='grid grid-cols-2 gap-3'>
                    <button
                      onClick={() => handleTogglePause(true)}
                      disabled={loading || isPending}
                      className='py-2 px-4 bg-orange-500/20 text-orange-300 border border-orange-500/30 rounded-lg hover:bg-orange-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                      Pause
                    </button>
                    <button
                      onClick={() => handleTogglePause(false)}
                      disabled={loading || isPending}
                      className='py-2 px-4 bg-green-500/20 text-green-300 border border-green-500/30 rounded-lg hover:bg-green-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                      Unpause
                    </button>
                  </div>
                </div>
                <div className='p-4 bg-[#2D1E3E]/50 rounded-lg'>
                  <h3 className='font-medium mb-2'>Danger Zone</h3>
                  <p className='text-sm text-white/70 mb-4'>
                    Permanently disable this property contract
                  </p>
                  <button
                    onClick={handleBurnProperty}
                    disabled={loading || isPending}
                    className='w-full py-2 px-4 bg-red-500/20 text-red-300 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    Burn Property
                  </button>
                </div>
              </div>
              <div className='p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg'>
                <p className='text-sm text-yellow-300'>
                  <strong>Note:</strong> Burning a property is permanent and cannot be undone. All
                  NFTs belonging to the owner will be burned.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PropertyNFTDashboard;
