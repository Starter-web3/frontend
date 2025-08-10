import { useState, useEffect } from "react";

interface MoralisTokenPrice {
  nativePrice: {
    value: string;
    decimals: number;
    name: string;
    symbol: string;
  };
  usdPrice: number;
  usdPriceFormatted: string;
  exchangeAddress?: string;
  exchangeName?: string;
  "24hrPercentChange": string;
  verified: boolean;
  pairAddress?: string;
  pairTotalLiquidity?: string;
}

interface MoralisNativePriceResponse {
  usdPrice: number;
  usdPriceFormatted: string;
  nativePrice: {
    value: string;
    decimals: number;
    name: string;
    symbol: string;
  };
  "24hrPercentChange": string;
  verified: boolean;
}

class MoralisPriceService {
  private baseUrl = "https://deep-index.moralis.io/api/v2.2";
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async makeRequest(endpoint: string): Promise<unknown> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        "X-API-Key": this.apiKey,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Moralis API error: ${response.status} ${response.statusText}. ${errorText}`
      );
    }

    return response.json();
  }

  // Get ETH price in USD - Fixed endpoint
  async getEthPrice(): Promise<{
    usdPrice: number;
    loading: boolean;
    error: string | null;
  }> {
    try {
      // Use the correct endpoint for native token price
      const data = (await this.makeRequest(
        "/erc20/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/price?chain=eth&include=percent_change"
      )) as MoralisNativePriceResponse;

      return {
        usdPrice: Number(data.usdPrice),
        loading: false,
        error: null,
      };
    } catch (error) {
      console.error("Error fetching ETH price:", error);
      return {
        usdPrice: 0,
        loading: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // Alternative method using native token endpoint
  async getEthPriceNative(): Promise<{
    usdPrice: number;
    loading: boolean;
    error: string | null;
  }> {
    try {
      // Use native token endpoint
      const data = (await this.makeRequest(
        "/market-data/erc20s/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/price?chain=eth"
      )) as MoralisNativePriceResponse;

      return {
        usdPrice: Number(data.usdPrice),
        loading: false,
        error: null,
      };
    } catch (error) {
      console.error("Error fetching ETH price (native):", error);
      // Fallback to the other method
      return this.getEthPrice();
    }
  }

  // Get token price for any ERC20 token
  async getTokenPrice(
    tokenAddress: string,
    chain: string = "eth"
  ): Promise<MoralisTokenPrice | null> {
    try {
      const data = (await this.makeRequest(
        `/erc20/${tokenAddress}/price?chain=${chain}&include=percent_change`
      )) as MoralisTokenPrice;
      return data;
    } catch (error) {
      console.error("Error fetching token price:", error);
      return null;
    }
  }

  // Get native token price for specific chain - Fixed
  async getNativeTokenPrice(
    chain: string
  ): Promise<{ usdPrice: number; error: string | null }> {
    try {
      let endpoint = "";

      // Use correct addresses for different chains
      switch (chain.toLowerCase()) {
        case "eth":
        case "ethereum":
          endpoint =
            "/erc20/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/price?chain=eth&include=percent_change";
          break;
        case "bsc":
        case "binance":
          endpoint =
            "/erc20/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c/price?chain=bsc&include=percent_change";
          break;
        case "polygon":
          endpoint =
            "/erc20/0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270/price?chain=polygon&include=percent_change";
          break;
        case "avalanche":
          endpoint =
            "/erc20/0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7/price?chain=avalanche&include=percent_change";
          break;
        default:
          throw new Error(`Unsupported chain: ${chain}`);
      }

      const data = (await this.makeRequest(endpoint)) as { usdPrice: number };

      return {
        usdPrice: Number(data.usdPrice),
        error: null,
      };
    } catch (error) {
      console.error("Error fetching native token price:", error);
      return {
        usdPrice: 0,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // Batch get multiple token prices
  async getMultipleTokenPrices(
    tokens: Array<{ address: string; chain?: string }>
  ): Promise<Array<MoralisTokenPrice | null>> {
    const promises = tokens.map((token) =>
      this.getTokenPrice(token.address, token.chain || "eth")
    );

    return Promise.all(promises);
  }
}

// Export singleton instance
export const moralisService = new MoralisPriceService(
  process.env.NEXT_PUBLIC_MORALIS_API_KEY || ""
);

// Hook for React components
export function useMoralisPrice() {
  const [prices, setPrices] = useState<{
    ethPrice: number;
    loading: boolean;
    error: string | null;
  }>({
    ethPrice: 0,
    loading: true,
    error: null,
  });

  const fetchPrices = async () => {
    setPrices((prev) => ({ ...prev, loading: true }));

    const ethData = await moralisService.getEthPrice();

    setPrices({
      ethPrice: ethData.usdPrice,
      loading: false,
      error: ethData.error,
    });
  };

  useEffect(() => {
    fetchPrices();

    // Set up periodic price updates (every 30 seconds)
    const interval = setInterval(fetchPrices, 30000);

    return () => clearInterval(interval);
  }, []);

  return {
    ...prices,
    refetch: fetchPrices,
  };
}
