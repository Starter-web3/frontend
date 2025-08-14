// hooks/useUsdEthPrice.ts
import { useState, useEffect, useMemo } from "react";
import { moralisService } from "../lib/moralis-price-service";

// Drop-in replacement for your existing useUsdEthPrice hook
export const useUsdEthPrice = () => {
  const [usdPrice, setUsdPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        setLoading(true);
        setError(null);

        // Try the primary method first
        let result = await moralisService.getEthPrice();

        // If primary method fails, try the alternative method
        if (result.error) {
          console.log("Primary method failed, trying alternative...");
          result = await moralisService.getEthPriceNative();
        }

        if (result.error) {
          setError(result.error);
          setUsdPrice(null);
        } else {
          setUsdPrice(result.usdPrice);
          setError(null);
        }
      } catch (err) {
        console.error("Error fetching ETH price:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
        setUsdPrice(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPrice();

    // Set up periodic updates every 30 seconds
    const interval = setInterval(fetchPrice, 30000);

    return () => clearInterval(interval);
  }, []);

  return { usdPrice, loading, error };
};

// Enhanced hook with more features
export const useEnhancedUsdEthPrice = () => {
  const [usdPrice, setUsdPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchPrice = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try the primary method first
      let result = await moralisService.getEthPrice();

      // If primary method fails, try the alternative method
      if (result.error) {
        console.log("Primary method failed, trying alternative...");
        result = await moralisService.getEthPriceNative();
      }

      if (result.error) {
        setError(result.error);
        setUsdPrice(null);
      } else {
        setUsdPrice(result.usdPrice);
        setError(null);
        setLastUpdated(new Date());
      }
    } catch (err) {
      console.error("Error fetching ETH price:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
      setUsdPrice(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrice();

    // Set up periodic updates every 30 seconds
    const interval = setInterval(fetchPrice, 30000);

    return () => clearInterval(interval);
  }, []);

  return {
    usdPrice,
    loading,
    error,
    lastUpdated,
    refetch: fetchPrice,
  };
};

// Hook for airdrop price data with history tracking
export const useAirdropPriceData = () => {
  const {
    usdPrice: ethPrice,
    loading: ethLoading,
    error: ethError,
  } = useUsdEthPrice();
  const [priceHistory, setPriceHistory] = useState<
    Array<{ timestamp: Date; price: number }>
  >([]);

  // Track price changes for analytics
  useEffect(() => {
    if (ethPrice && ethPrice > 0) {
      setPriceHistory((prev) => [
        ...prev.slice(-10), // Keep last 10 price points
        { timestamp: new Date(), price: ethPrice },
      ]);
    }
  }, [ethPrice]);

  // Calculate price change percentage
  const getPriceChangePercentage = () => {
    if (priceHistory.length < 2) return 0;

    const current = priceHistory[priceHistory.length - 1].price;
    const previous = priceHistory[priceHistory.length - 2].price;

    return ((current - previous) / previous) * 100;
  };

  return {
    ethPrice,
    ethLoading,
    ethError,
    priceHistory,
    priceChangePercentage: getPriceChangePercentage(),
  };
};

// Hook for enhanced fee calculation with USD conversion
type FileType = { count: number; [key: string]: unknown };
type AdminContractType = {
  getAirdropFeeUSD: (totalRecipients: number) => Promise<number | string>;
  getAirdropFeeETH: (totalRecipients: number) => Promise<number | string>;
  [key: string]: unknown;
};

export const useAirdropFeesWithUSD = (
  files: FileType[],
  adminContract: AdminContractType
) => {
  const [airdropFeeUSD, setAirdropFeeUSD] = useState<string | null>(null);
  const [airdropFeeETH, setAirdropFeeETH] = useState<string | null>(null);
  const [feeLoading, setFeeLoading] = useState(false);
  const { usdPrice: ethPrice } = useUsdEthPrice();

  useEffect(() => {
    const fetchAirdropFees = async () => {
      if (!adminContract || files.length === 0) return;
      setFeeLoading(true);

      try {
        const totalRecipients = files.reduce(
          (sum: number, file: FileType) => sum + file.count,
          0
        );

        // Fetch USD fee from contract
        const feeUSD = await adminContract.getAirdropFeeUSD(totalRecipients);
        const formattedFeeUSD = feeUSD.toString();
        setAirdropFeeUSD(formattedFeeUSD);

        // Fetch ETH fee from contract
        const feeETH = await adminContract.getAirdropFeeETH(totalRecipients);
        const formattedFeeETH = feeETH.toString();
        setAirdropFeeETH(formattedFeeETH);
      } catch (err) {
        console.error("Error fetching airdrop fees:", err);
      } finally {
        setFeeLoading(false);
      }
    };

    fetchAirdropFees();
  }, [files, adminContract]);

  // Calculate USD equivalent of ETH fee using current price
  const ethFeeInUSD = useMemo(() => {
    if (!airdropFeeETH || !ethPrice) return null;
    return (parseFloat(airdropFeeETH) * ethPrice).toFixed(2);
  }, [airdropFeeETH, ethPrice]);

  return {
    airdropFeeUSD,
    airdropFeeETH,
    ethFeeInUSD,
    feeLoading,
    ethPrice,
  };
};
