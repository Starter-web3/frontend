interface PropertyDetailsProps {
  price: string;
  ethPrice?: string;
  usdPrice?: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  zone: string;
}

export default function PropertyDetails({
  // price,
  ethPrice,
  usdPrice,
  location,
  bedrooms,
  bathrooms,
  area,
  zone,
}: PropertyDetailsProps) {
  return (
    <div className='bg-[#2a1a3e] rounded-lg p-4 text-white'>
      <h2 className='text-xl font-semibold mb-4'>Property Details</h2>

      {ethPrice && usdPrice && (
        <div className='mb-4'>
          <p className='text-gray-300 mb-1'>PRICE</p>
          <p className='text-xl font-bold text-blue-400'>
            {ethPrice} / {usdPrice}
          </p>
        </div>
      )}

      <div className='space-y-3'>
        <div className='flex items-center gap-2'>
          <span className='w-6 h-6 flex items-center justify-center bg-[#3a2a4e] rounded-full'>
            🏠
          </span>
          <span>2 Bedroom Apartment</span>
        </div>

        <div className='flex items-center gap-2'>
          <span className='w-6 h-6 flex items-center justify-center bg-[#3a2a4e] rounded-full'>
            📍
          </span>
          <span>Apartment</span>
        </div>

        <div className='flex items-center gap-2'>
          <span className='w-6 h-6 flex items-center justify-center bg-[#3a2a4e] rounded-full'>
            🛏️
          </span>
          <span>{bedrooms}</span>
        </div>

        <div className='flex items-center gap-2'>
          <span className='w-6 h-6 flex items-center justify-center bg-[#3a2a4e] rounded-full'>
            🚿
          </span>
          <span>{bathrooms}</span>
        </div>

        <div className='flex items-center gap-2'>
          <span className='w-6 h-6 flex items-center justify-center bg-[#3a2a4e] rounded-full'>
            📏
          </span>
          <span>{area}</span>
        </div>

        <div className='flex items-center gap-2'>
          <span className='w-6 h-6 flex items-center justify-center bg-[#3a2a4e] rounded-full'>
            🏙️
          </span>
          <span>{zone}</span>
        </div>

        <div className='flex items-center gap-2'>
          <span className='w-6 h-6 flex items-center justify-center bg-[#3a2a4e] rounded-full'>
            📍
          </span>
          <span>{location}</span>
        </div>
      </div>
    </div>
  );
}
