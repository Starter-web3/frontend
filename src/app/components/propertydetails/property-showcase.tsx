import Image from "next/image"

export default function PropertyShowcase() {
  return (
    // <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-2 rounded-lg overflow-hidden bg-[#fff] h-[350px]">
    //   <div className="md:col-span-2 md:row-span-2 relative h-[350px] md:h-auto">
    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-2 rounded-lg overflow-hidden bg-[#fff] h-[350px]">
      <div className="md:col-span-2 md:row-span-2 relative h-[350px] md:h-auto">
        <Image
          src="/luxury4.jpeg"
          alt="Main property view"
          className="object-cover"
          fill
          priority
        />
      </div>
      <div className="relative h-[150px] md:h-auto">
        <Image src="/luxruy1.jpeg" alt="Interior view 1" className="object-cover" fill />
      </div>
      <div className="relative h-[150px] md:h-auto">
        <Image src="/luxury4.jpeg" alt="Interior view 2" className="object-cover" fill />
      </div>
    </div>
  )
}
