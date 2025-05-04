'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWriteContract, useReadContract, useWatchContractEvent } from 'wagmi';
import { isAddress } from 'viem';
import { baseSepolia } from '../../../lib/wagmi-config'; // Adjust path as needed
import { useWallet } from '../../../contexts/WalletContext'; // Adjust path as needed

const FACTORY_ADDRESS = '0x9626EC0cCF742E47A2f46DF4D41a757Ad182AB14' as `0x${string}`;

// Toggle to bypass isPropertyActive check for testing
const BYPASS_ACTIVE_CHECK = true;

const PROPERTY_NFT_FACTORY_ABI = [
  {
    inputs: [
      { internalType: 'string', name: 'name', type: 'string' },
      { internalType: 'string', name: 'symbol', type: 'string' },
    ],
    name: 'createPropertyNFT',
    outputs: [{ internalType: 'contract PropertyNFT', name: '', type: 'address' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'property', type: 'address' }],
    name: 'isPropertyActive',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'propertyContract', type: 'address' },
      { indexed: true, internalType: 'address', name: 'owner', type: 'address' },
      { indexed: false, internalType: 'string', name: 'name', type: 'string' },
    ],
    name: 'PropertyCreated',
    type: 'event',
  },
];

interface FormData {
  name: string;
  symbol: string;
}

const PropertyNFTFactoryDashboard = () => {
  const router = useRouter();
  const { address: account, isConnected } = useWallet(); // Use our context instead
  const { writeContractAsync, data: txHash, isPending, error: writeError } = useWriteContract();

  const [formData, setFormData] = useState<FormData>({
    name: '',
    symbol: '',
  });
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [newPropertyAddress, setNewPropertyAddress] = useState<`0x${string}` | null>(null);

  // Read isPropertyActive for the new property address
  const { data: isPropertyActive, error: readError } = useReadContract({
    address: FACTORY_ADDRESS,
    abi: PROPERTY_NFT_FACTORY_ABI,
    functionName: 'isPropertyActive',
    args: [newPropertyAddress],
    chainId: baseSepolia.id,
    query: {
      enabled: !!newPropertyAddress && isAddress(newPropertyAddress),
      retry: 5,
      retryDelay: 2000,
    },
  });

  // Watch for PropertyCreated event
  useWatchContractEvent({
    address: FACTORY_ADDRESS,
    abi: PROPERTY_NFT_FACTORY_ABI,
    eventName: 'PropertyCreated',
    onLogs(logs) {
      if (!account || !txHash) return;

      const log = logs[0];
      if (log && 'args' in log) {
        const { propertyContract, owner } = (
          log as { args: { propertyContract: string; owner: string } }
        ).args;
        if (
          propertyContract &&
          isAddress(propertyContract) &&
          owner &&
          owner.toLowerCase() === account.toLowerCase()
        ) {
          console.log('PropertyCreated event received:', propertyContract);
          setNewPropertyAddress(propertyContract as `0x${string}`);
        }
      }
    },
    onError(err) {
      console.error('Error watching PropertyCreated event:', err);
      setError('Failed to detect new property creation. Please try again or check network status.');
      setLoading(false);
    },
    poll: true,
    pollingInterval: 5000,
  });

  // Handle new property address confirmation and redirection
  useEffect(() => {
    if (!newPropertyAddress || !account) return;

    const confirmProperty = async () => {
      console.log('Confirming property for address:', newPropertyAddress);
      setLoading(true);
      try {
        if (readError) {
          throw new Error('Failed to verify property status: ' + readError.message);
        }

        console.log('Property active status:', isPropertyActive);
        if (!BYPASS_ACTIVE_CHECK && !isPropertyActive) {
          console.warn('Property not marked as active. Contract may have a bug.');
          throw new Error('Property created but not marked as active in the factory');
        }

        console.log('New PropertyNFT address confirmed:', newPropertyAddress);
        setSuccessMessage(`PropertyNFT created at ${newPropertyAddress}`);

        // Reset form
        setFormData({
          name: '',
          symbol: '',
        });

        // Navigate to the property detail page
        console.log('Navigating to:', `/dashboard/propertynft?address=${newPropertyAddress}`);
        router.replace(`/dashboard/propertynft?address=${newPropertyAddress}`, { scroll: false });
      } catch (err: any) {
        console.error('Error confirming property:', err);
        setError(err.message || 'Failed to confirm PropertyNFT creation');
      } finally {
        console.log('Resetting loading and newPropertyAddress states');
        setLoading(false);
        setNewPropertyAddress(null);
      }
    };

    confirmProperty();
  }, [newPropertyAddress, account, router, isPropertyActive, readError]);

  // Fallback to reset loading state if transaction takes too long
  useEffect(() => {
    if (txHash && !newPropertyAddress) {
      const timeout = setTimeout(() => {
        if (loading) {
          console.warn('Transaction processing timed out');
          setError('Transaction took too long to process. Please check the property status.');
          setLoading(false);
        }
      }, 45000);
      return () => clearTimeout(timeout);
    }
  }, [txHash, newPropertyAddress, loading]);

  // Handle write errors
  useEffect(() => {
    if (writeError) {
      console.error('Write contract error:', writeError);
      setLoading(false);
      setError(writeError.message || 'Failed to create PropertyNFT');
    }
  }, [writeError]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = (): boolean => {
    if (!formData.name || formData.name.length > 32) {
      setError('Name is required and must be 32 characters or less');
      return false;
    }
    if (!formData.symbol || formData.symbol.length > 10) {
      setError('Symbol is required and must be 10 characters or less');
      return false;
    }
    return true;
  };

  const handleCreatePropertyNFT = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');
    setNewPropertyAddress(null);

    try {
      if (!account) {
        setError('Wallet not connected');
        setLoading(false);
        return;
      }

      if (!validateForm()) {
        setLoading(false);
        return;
      }

      const tx = await writeContractAsync({
        address: FACTORY_ADDRESS,
        abi: PROPERTY_NFT_FACTORY_ABI,
        functionName: 'createPropertyNFT',
        args: [formData.name, formData.symbol],
      });

      console.log('Transaction submitted with hash:', tx);
    } catch (err: any) {
      console.error('Error submitting transaction:', err);
      setError(err.message || 'Failed to create PropertyNFT');
      setLoading(false);
    }
  };

  // Display recently created properties (stub, unchanged)
  const renderRecentProperties = () => {
    return (
      <div className='text-center py-6'>
        <p className='text-white/50'>No recent properties available</p>
      </div>
    );
  };

  return (
    <div className='max-w-6xl mx-auto px-4 py-8 font-inter text-white'>
      <h1 className='text-2xl font-semibold mb-8'>Property NFT Factory Dashboard</h1>

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
          <p className='text-white/70 mb-4'>Connect your wallet to create properties</p>
        </div>
      ) : (
        <div className='space-y-8'>
          <div className='bg-[#1D0E2E] rounded-lg p-6 border border-white/10'>
            <h2 className='text-xl font-medium mb-6'>Create Property NFT</h2>
            <form onSubmit={handleCreatePropertyNFT} className='space-y-4'>
              <div>
                <label htmlFor='name' className='block mb-2 text-sm'>
                  Name
                </label>
                <input
                  type='text'
                  id='name'
                  name='name'
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder='Property name (max 32 characters)'
                  className='w-full px-4 py-3 rounded-lg bg-[#2D1E3E] border border-white/10 focus:outline-none focus:ring-1 focus:ring-teal-400'
                />
              </div>
              <div>
                <label htmlFor='symbol' className='block mb-2 text-sm'>
                  Symbol
                </label>
                <input
                  type='text'
                  id='symbol'
                  name='symbol'
                  value={formData.symbol}
                  onChange={handleInputChange}
                  placeholder='Property symbol (max 10 characters)'
                  className='w-full px-4 py-3 rounded-lg bg-[#2D1E3E] border border-white/10 focus:outline-none focus:ring-1 focus:ring-teal-400'
                />
              </div>
              <button
                type='submit'
                disabled={loading || isPending}
                className='w-full py-4 rounded-lg bg-gradient-to-r from-teal-500 to-purple-500 text-white font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {loading || isPending ? 'Creating...' : 'Create Property NFT'}
              </button>
            </form>
          </div>

          <div className='bg-[#1D0E2E] rounded-lg p-6 border border-white/10'>
            <h2 className='text-xl font-medium mb-6'>Recent Properties</h2>
            {renderRecentProperties()}
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyNFTFactoryDashboard;
