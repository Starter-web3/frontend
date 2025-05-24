import Header from './header';
import PropertyShowcase from './property-showcase';
import PropertyDetails from './property-details';
import PropertyDescription from './property-description';
import PropertyOverview from './property-overview';
import OwnerInformation from './owner-information';
import OwnershipDetails from './ownership-details';
import ContactForm from './contact-form';
import ActionButtons from './action-buttons';
import BrowseMore from './browse-more';
// import Footer from "./footer"
import Footer from '../layout/Footer';

export default function PropertyListing() {
  return (
    <div className='flex flex-col min-h-screen bg-[#201726]'>
      <Header />
      <div className='container mx-auto px-4 max-w-6xl'>
        <PropertyShowcase />

        {/* Property Details and Description side by side */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6'>
          <div className='lg:col-span-2'>
            <h1 className='text-2xl font-bold'>2 Bedroom Apartment - Ikeja</h1>
            <PropertyDescription />
          </div>
          <div className='lg:col-span-1'>
            <PropertyDetails
              price={''}
              location={''}
              bedrooms={0}
              bathrooms={0}
              area={''}
              zone={''}
            />
          </div>
        </div>

        <PropertyOverview />

        {/* Owner Information and Contact Form side by side */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8'>
          <div>
            <OwnerInformation />
            <OwnershipDetails />
          </div>
          <div>
            <ContactForm />
          </div>
        </div>

        <ActionButtons />
        <BrowseMore />
      </div>
      <Footer />
    </div>
  );
}

// import { useRouter } from 'next/router';
// import Header from "./header";
// import PropertyShowcase from "./property-showcase";
// import PropertyDetails from "./property-details";
// import PropertyDescription from "./property-description";
// import PropertyOverview from "./property-overview";
// import OwnerInformation from "./owner-information";
// import OwnershipDetails from "./ownership-details";
// import ContactForm from "./contact-form";
// import ActionButtons from "./action-buttons";
// import BrowseMore from "./browse-more";
// import Footer from "../layout/Footer";
// import { properties } from './data'; // Assuming you have property data

// export default function PropertyListing() {
//     const router = useRouter();
//     const { id } = router.query;

//     // Find the property based on the ID
//     const property = properties.find(property => property.id === id);

//     if (!property) {
//         return <div>Property not found</div>; // Or handle the error as you see fit
//     }

//     return (
//         <div className="flex flex-col min-h-screen bg-[#201726]">
//             <Header />
//             <div className="container mx-auto px-4 max-w-6xl">
//                 <PropertyShowcase />
//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
//                     <div className="lg:col-span-2">
//                         <h1 className="text-2xl font-bold">{property.title}</h1>
//                         <PropertyDescription description={property.description} /> {/* Pass the description prop */}
//                     </div>
//                     <div className="lg:col-span-1">
//                         <PropertyDetails property={property} /> {/* Pass the property object */}
//                     </div>
//                 </div>
//                 <PropertyOverview />
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
//                     <div>
//                         <OwnerInformation />
//                         <OwnershipDetails />
//                     </div>
//                     <div>
//                         <ContactForm />
//                     </div>
//                 </div>
//                 <ActionButtons />
//                 <BrowseMore />
//             </div>
//             <Footer />
//         </div>
//     );
// }
