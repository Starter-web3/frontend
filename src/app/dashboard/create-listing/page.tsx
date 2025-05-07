'use client';

import { useState, useRef, ChangeEvent, DragEvent, FormEvent } from 'react';
import { ChevronDown, Upload, X } from 'lucide-react';
import DashboardLayout from '../DashboardLayout'; // Adjust path as needed

// Define types
interface ImageFile {
  file: File;
  preview: string;
  name: string;
}

interface FormData {
  title: string;
  description: string;
  type: string;
  status: string;
  fees: {
    price?: number;
    currency?: string;
    agencyFee?: number;
    legalFee?: number;
    cautionFee?: number;
    serviceCharge?: number;
  };
  location: {
    city: string;
    country: string;
  };
  investment: {
    isInvestment: boolean;
  };
  isVerified: boolean;
  verifiedBy: string;
  verificationDate: string;
}

const PropertyListingForm = () => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    type: '',
    status: '',
    fees: {},
    location: { city: '', country: 'Nigeria' },
    investment: { isInvestment: false },
    isVerified: false,
    verifiedBy: '',
    verificationDate: '',
  });
  const [images, setImages] = useState<ImageFile[]>([]);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [formErrors, setFormErrors] = useState<Partial<FormData>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Calculate total cost for display
  const totalCost = (
    (formData.fees.price || 0) +
    (formData.fees.agencyFee || 0) +
    (formData.fees.legalFee || 0) +
    (formData.fees.cautionFee || 0) +
    (formData.fees.serviceCharge || 0)
  ).toLocaleString();

  const handleDrag = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateFiles = (files: FileList): File[] => {
    const validFiles: File[] = [];
    setError('');
    if (images.length + files.length > 10) {
      setError('You can only upload up to 10 images');
      return [];
    }
    Array.from(files).forEach((file) => {
      const fileType = file.type;
      if (fileType === 'image/jpeg' || fileType === 'image/jpg' || fileType === 'image/png') {
        validFiles.push(file);
      } else {
        setError('Only JPG, JPEG, and PNG files are allowed');
      }
    });
    return validFiles;
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = e.dataTransfer.files;
    const validFiles = validateFiles(files);
    if (validFiles.length > 0) {
      handleFiles(validFiles);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (!e.target.files) return;
    const files = e.target.files;
    const validFiles = validateFiles(files);
    if (validFiles.length > 0) {
      handleFiles(validFiles);
    }
  };

  const handleFiles = (files: File[]): void => {
    const newImages: ImageFile[] = [...images];
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          newImages.push({
            file,
            preview: e.target.result.toString(),
            name: file.name,
          });
          setImages([...newImages]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number): void => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    setError('');
  };

  const handleButtonClick = (): void => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    field: keyof FormData,
    nestedField?: string,
  ): void => {
    const { value } = e.target;

    setFormData((prev) => {
      if (nestedField) {
        if (field === 'fees') {
          const numericFields = ['price', 'agencyFee', 'legalFee', 'cautionFee', 'serviceCharge'];
          const newValue = numericFields.includes(nestedField)
            ? value === ''
              ? undefined
              : Number(value)
            : value;
          return {
            ...prev,
            fees: {
              ...prev.fees,
              [nestedField]: newValue,
            },
          };
        }
        if (field === 'location') {
          return {
            ...prev,
            location: {
              ...prev.location,
              [nestedField]: value || (nestedField === 'country' ? 'Nigeria' : ''),
            },
          };
        }
        if (field === 'investment') {
          return {
            ...prev,
            investment: {
              ...prev.investment,
              [nestedField]: value === 'true' || value === 'false' ? value === 'true' : value,
            },
          };
        }
      }
      return {
        ...prev,
        [field]: value,
      };
    });

    setFormErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleCheckboxChange = (field: keyof FormData, nestedField?: string): void => {
    setFormData((prev) => {
      if (nestedField && field === 'investment') {
        return {
          ...prev,
          investment: {
            ...prev.investment,
            isInvestment: !prev.investment.isInvestment,
          },
        };
      }
      return {
        ...prev,
        [field]: !(prev[field] as boolean),
      };
    });
  };

  const validateForm = (): boolean => {
    const errors: Partial<FormData> = {};
    if (!formData.title) errors.title = 'Title is required';
    if (!formData.description || formData.description.length < 50)
      errors.description = 'Description is required and must be at least 50 characters';
    if (!formData.type) errors.type = 'Type is required';
    if (!formData.status) errors.status = 'Status is required';
    if (formData.fees.price === undefined)
      errors.fees = { ...errors.fees, price: 'Base price is required' };
    if (!formData.fees.currency) errors.fees = { ...errors.fees, currency: 'Currency is required' };
    if (!formData.location.city) errors.location = { ...errors.location, city: 'City is required' };
    if (images.length === 0) setError('At least one image is required');
    setFormErrors(errors);
    return Object.keys(errors).length === 0 && images.length > 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!validateForm()) return;

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('type', formData.type);
    formDataToSend.append('status', formData.status);
    formDataToSend.append('fees[price]', String(formData.fees.price || ''));
    formDataToSend.append('fees[currency]', formData.fees.currency || '');
    formDataToSend.append('fees[agencyFee]', String(formData.fees.agencyFee || ''));
    formDataToSend.append('fees[legalFee]', String(formData.fees.legalFee || ''));
    formDataToSend.append('fees[cautionFee]', String(formData.fees.cautionFee || ''));
    formDataToSend.append('fees[serviceCharge]', String(formData.fees.serviceCharge || ''));
    formDataToSend.append('location[city]', formData.location.city);
    formDataToSend.append('location[country]', formData.location.country);
    formDataToSend.append('investment[isInvestment]', String(formData.investment.isInvestment));
    formDataToSend.append('isVerified', String(formData.isVerified));
    formDataToSend.append('verifiedBy', formData.verifiedBy);
    formDataToSend.append('verificationDate', formData.verificationDate);
    images.forEach((image) => {
      formDataToSend.append('images', image.file);
    });

    try {
      const response = await fetch('/api/properties', {
        method: 'POST',
        body: formDataToSend,
      });
      const result = await response.json();
      if (result.success) {
        alert('Property created successfully!');
        setFormData({
          title: '',
          description: '',
          type: '',
          status: '',
          fees: {},
          location: { city: '', country: 'Nigeria' },
          investment: { isInvestment: false },
          isVerified: false,
          verifiedBy: '',
          verificationDate: '',
        });
        setImages([]);
      } else {
        setError(result.message || 'Failed to create property');
      }
    } catch (err) {
      setError('An error occurred while creating the property');
    }
  };

  return (
    <DashboardLayout>
      <div className='max-w-6xl mx-auto px-4 py-8 font-inter text-white'>
        <div className='mb-8'>
          <h1 className='text-2xl text-center font-semibold flex items-center gap-2 text-white font-poppins'>
            <span className='text-teal-400'>🏠</span> Create New Property Listing
          </h1>
        </div>

        <form className='space-y-6' onSubmit={handleSubmit}>
          {/* Property Details Section */}
          <div className='space-y-4'>
            <h2 className='text-xl font-vietnam font-medium'>Property Details</h2>

            <div>
              <label htmlFor='title' className='block mb-2 text-sm'>
                Title
              </label>
              <input
                type='text'
                id='title'
                value={formData.title}
                onChange={(e) => handleInputChange(e, 'title')}
                placeholder='e.g., Bedroom Penthouse in Banana Island'
                className={`w-full px-4 py-3 rounded-lg bg-[#1D0E2E] border ${
                  formErrors.title ? 'border-red-500' : 'border-white/10'
                } focus:outline-none focus:ring-1 focus:ring-teal-400`}
              />
              {formErrors.title && <p className='text-red-500 text-sm mt-1'>{formErrors.title}</p>}
            </div>

            <div>
              <label htmlFor='description' className='block mb-2 text-sm'>
                Description
              </label>
              <textarea
                id='description'
                rows={5}
                value={formData.description}
                onChange={(e) => handleInputChange(e, 'description')}
                placeholder='Full description...minimum 50 characters'
                className={`w-full px-4 py-3 rounded-lg bg-[#1D0E2E] border ${
                  formErrors.description ? 'border-red-500' : 'border-white/10'
                } focus:outline-none focus:ring-1 focus:ring-teal-400 resize-none`}
              />
              {formErrors.description && (
                <p className='text-red-500 text-sm mt-1'>{formErrors.description}</p>
              )}
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label htmlFor='type' className='block mb-2 text-sm'>
                  Type
                </label>
                <div className='relative'>
                  <select
                    id='type'
                    value={formData.type}
                    onChange={(e) => handleInputChange(e, 'type')}
                    className={`w-full px-4 py-3 rounded-lg bg-[#1D0E2E] border ${
                      formErrors.type ? 'border-red-500' : 'border-white/10'
                    } focus:outline-none focus:ring-1 focus:ring-teal-400 appearance-none`}
                  >
                    <option value=''>Select Type</option>
                    <option value='apartment'>Apartment</option>
                    <option value='house'>House</option>
                    <option value='villa'>Villa</option>
                    <option value='land'>Land</option>
                  </select>
                  <ChevronDown className='absolute right-3 top-1/2 -translate-y-1/2 text-white/70 pointer-events-none w-5 h-5' />
                  {formErrors.type && (
                    <p className='text-red-500 text-sm mt-1'>{formErrors.type}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor='status' className='block mb-2 text-sm'>
                  Status
                </label>
                <div className='relative'>
                  <select
                    id='status'
                    value={formData.status}
                    onChange={(e) => handleInputChange(e, 'status')}
                    className={`w-full px-4 py-3 rounded-lg bg-[#1D0E2E] border ${
                      formErrors.status ? 'border-red-500' : 'border-white/10'
                    } focus:outline-none focus:ring-1 focus:ring-teal-400 appearance-none`}
                  >
                    <option value=''>Select Status</option>
                    <option value='for-sale'>For Sale</option>
                    <option value='for-rent'>For Rent</option>
                    <option value='sold'>Sold</option>
                  </select>
                  <ChevronDown className='absolute right-3 top-1/2 -translate-y-1/2 text-white/70 pointer-events-none w-5 h-5' />
                  {formErrors.status && (
                    <p className='text-red-500 text-sm mt-1'>{formErrors.status}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Owner Information Section */}
          <div className='bg-[#00B5F54D] rounded-lg p-4 py-5 border-[0.23px] border-[#FFFFFF] border-opacity-25 shadow-[inset_1px_1px_10px_0px_#FFFFFF40]'>
            <h2 className='text-xl font-vietnam font-medium mb-2'>Owner Information</h2>
            <p className='text-sm'>
              <span className='font-semibold'>Note:</span> You must have an{' '}
              <span className='text-teal-400'>Owner</span> or{' '}
              <span className='text-fuchsia-400'>Agent</span> role to create listings. Ownership
              will be automatically linked to your wallet/account.
            </p>
          </div>

          {/* Property Pricing Section */}
          <div className='space-y-4'>
            <h2 className='text-xl font-vietnam font-medium'>Property Pricing</h2>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div>
                <label htmlFor='currency' className='block mb-2 text-sm'>
                  Currency
                </label>
                <div className='relative'>
                  <select
                    id='currency'
                    value={formData.fees.currency || ''}
                    onChange={(e) => handleInputChange(e, 'fees', 'currency')}
                    className={`w-full px-4 py-3 rounded-lg bg-[#1D0E2E] border ${
                      formErrors.fees?.currency ? 'border-red-500' : 'border-white/10'
                    } focus:outline-none focus:ring-1 focus:ring-teal-400 appearance-none`}
                  >
                    <option value=''>Select Currency</option>
                    <option value='ngn'>Naira (₦)</option>
                    <option value='usd'>US Dollar ($)</option>
                  </select>
                  <ChevronDown className='absolute right-3 top-1/2 -translate-y-1/2 text-white/70 pointer-events-none w-5 h-5' />
                  {formErrors.fees?.currency && (
                    <p className='text-red-500 text-sm mt-1'>{formErrors.fees.currency}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor='basePrice' className='block mb-2 text-sm'>
                  Base Price
                </label>
                <input
                  type='number'
                  id='basePrice'
                  value={formData.fees.price !== undefined ? formData.fees.price : ''}
                  onChange={(e) => handleInputChange(e, 'fees', 'price')}
                  placeholder='Enter base price'
                  className={`w-full px-4 py-3 rounded-lg bg-[#1D0E2E] border ${
                    formErrors.fees?.price ? 'border-red-500' : 'border-white/10'
                  } focus:outline-none focus:ring-1 focus:ring-teal-400`}
                />
                {formErrors.fees?.price && (
                  <p className='text-red-500 text-sm mt-1'>{formErrors.fees.price}</p>
                )}
              </div>

              <div>
                <label htmlFor='agencyFee' className='block mb-2 text-sm'>
                  Agency Fee
                </label>
                <input
                  type='number'
                  id='agencyFee'
                  value={formData.fees.agencyFee !== undefined ? formData.fees.agencyFee : ''}
                  onChange={(e) => handleInputChange(e, 'fees', 'agencyFee')}
                  placeholder='Optional'
                  className='w-full px-4 py-3 rounded-lg bg-[#1D0E2E] border border-white/10 focus:outline-none focus:ring-1 focus:ring-teal-400'
                />
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div>
                <label htmlFor='legalFee' className='block mb-2 text-sm'>
                  Legal Fee
                </label>
                <input
                  type='number'
                  id='legalFee'
                  value={formData.fees.legalFee !== undefined ? formData.fees.legalFee : ''}
                  onChange={(e) => handleInputChange(e, 'fees', 'legalFee')}
                  placeholder='Optional'
                  className='w-full px-4 py-3 rounded-lg bg-[#1D0E2E] border border-white/10 focus:outline-none focus:ring-1 focus:ring-teal-400'
                />
              </div>

              <div>
                <label htmlFor='cautionFee' className='block mb-2 text-sm'>
                  Caution Fee
                </label>
                <input
                  type='number'
                  id='cautionFee'
                  value={formData.fees.cautionFee !== undefined ? formData.fees.cautionFee : ''}
                  onChange={(e) => handleInputChange(e, 'fees', 'cautionFee')}
                  placeholder='Optional'
                  className='w-full px-4 py-3 rounded-lg bg-[#1D0E2E] border border-white/10 focus:outline-none focus:ring-1 focus:ring-teal-400'
                />
              </div>

              <div>
                <label htmlFor='serviceCharge' className='block mb-2 text-sm'>
                  Service Charge
                </label>
                <input
                  type='number'
                  id='serviceCharge'
                  value={
                    formData.fees.serviceCharge !== undefined ? formData.fees.serviceCharge : ''
                  }
                  onChange={(e) => handleInputChange(e, 'fees', 'serviceCharge')}
                  placeholder='Optional'
                  className='w-full px-4 py-3 rounded-lg bg-[#1D0E2E] border border-white/10 focus:outline-none focus:ring-1 focus:ring-teal-400'
                />
              </div>
            </div>

            <div>
              <label htmlFor='totalCost' className='block mb-2 text-sm'>
                Total Cost
              </label>
              <input
                type='text'
                id='totalCost'
                value={totalCost}
                disabled
                className='w-full px-4 py-3 rounded-lg bg-[#1D0E2E] border border-white/10 text-white/70'
              />
            </div>
          </div>

          {/* Location Section */}
          <div className='space-y-4'>
            <h2 className='text-xl font-vietnam font-medium'>Location</h2>
            broadcom
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label htmlFor='city' className='block mb-2 text-sm'>
                  City
                </label>
                <div className='relative'>
                  <select
                    id='city'
                    value={formData.location.city}
                    onChange={(e) => handleInputChange(e, 'location', 'city')}
                    className={`w-full px-4 py-3 rounded-lg bg-[#1D0E2E] border ${
                      formErrors.location?.city ? 'border-red-500' : 'border-white/10'
                    } focus:outline-none focus:ring-1 focus:ring-teal-400 appearance-none`}
                  >
                    <option value=''>Select City</option>
                    <option value='Ikeja'>Ikeja</option>
                    <option value='Lekki'>Lekki</option>
                    <option value='Victoria Island'>Victoria Island</option>
                    <option value='Lagos Island'>Lagos Island</option>
                    <option value='Ikoyi'>Ikoyi</option>
                    <option value='Surulere'>Surulere</option>
                    <option value='Yaba'>Yaba</option>
                    <option value='Apapa'>Apapa</option>
                    <option value='Oshodi'>Oshodi</option>
                    <option value='Mushin'>Mushin</option>
                    <option value='Agege'>Agege</option>
                    <option value='Ikorodu'>Ikorodu</option>
                    <option value='Egbeda'>Egbeda</option>
                    <option value='Ojuelegba'>Ojuelegba</option>
                    <option value='Somolu'>Somolu</option>
                    <option value='Ajegunle'>Ajegunle</option>
                    <option value='Alimosho'>Alimosho</option>
                    <option value='Ketu'>Ketu</option>
                    <option value='Ojo'>Ojo</option>
                  </select>
                  <ChevronDown className='absolute right-3 top-1/2 -translate-y-1/2 text-white/70 pointer-events-none w-5 h-5' />
                  {formErrors.location?.city && (
                    <p className='text-red-500 text-sm mt-1'>{formErrors.location.city}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor='country' className='block mb-2 text-sm'>
                  Country
                </label>
                <div className='relative'>
                  <input
                    type='text'
                    id='country'
                    value={formData.location.country}
                    readOnly
                    className='w-full px-4 py-3 rounded-lg bg-[#1D0E2E] border border-white/10 focus:outline-none focus:ring-1 focus:ring-teal-400'
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Property Features Section */}
          <div className='space-y-4'>
            <h2 className='text-xl font-vietnam font-medium'>Property Features</h2>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label htmlFor='verificationDate' className='block mb-2 text-sm'>
                  Verification Date
                </label>
                <input
                  type='text'
                  id='verificationDate'
                  value={formData.verificationDate}
                  onChange={(e) => handleInputChange(e, 'verificationDate')}
                  placeholder='dd/mm/yyyy'
                  className='w-full px-4 py-3 rounded-lg bg-[#1D0E2E] border border-white/10 focus:outline-none focus:ring-1 focus:ring-teal-400'
                />
              </div>

              <div>
                <label htmlFor='verifiedBy' className='block mb-2 text-sm'>
                  Verified By (Wallet Address)
                </label>
                <input
                  type='text'
                  id='verifiedBy'
                  value={formData.verifiedBy}
                  onChange={(e) => handleInputChange(e, 'verifiedBy')}
                  placeholder='Enter wallet address'
                  className='w-full px-4 py-3 rounded-lg bg-[#1D0E2E] border border-white/10 focus:outline-none focus:ring-1 focus:ring-teal-400'
                />
              </div>
            </div>

            <div className='flex flex-col sm:flex-row gap-6'>
              <div className='flex items-center gap-2'>
                <input
                  type='checkbox'
                  id='investment'
                  className='w-4 h-4 rounded border-white/30 text-teal-500 focus:ring-0 focus:ring-offset-0 bg-[#1D0E2E]'
                  checked={formData.investment.isInvestment}
                  onChange={() => handleCheckboxChange('investment', 'isInvestment')}
                />
                <label htmlFor='investment' className='text-sm'>
                  Is this an Investment Property?
                </label>
              </div>

              <div className='flex items-center gap-2'>
                <input
                  type='checkbox'
                  id='isVerified'
                  className='w-4 h-4 rounded border-white/30 text-teal-500 focus:ring-0 focus:ring-offset-0 bg-[#1D0E2E]'
                  checked={formData.isVerified}
                  onChange={() => handleCheckboxChange('isVerified')}
                />
                <label htmlFor='isVerified' className='text-sm'>
                  Is Verified (Only verifiers can check this)
                </label>
              </div>
            </div>
          </div>

          {/* Property Images Section */}
          <div className='space-y-4'>
            <h2 className='text-xl font-vietnam font-medium'>Property Images</h2>

            <div
              className={`border border-dashed ${
                dragActive ? 'border-teal-400' : 'border-white/20'
              } rounded-lg p-8 flex flex-col items-center justify-center bg-[#1D0E2E]/50 relative`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type='file'
                id='images'
                multiple
                accept='.jpg,.jpeg,.png'
                className='hidden'
                onChange={handleChange}
              />

              {images.length === 0 ? (
                <>
                  <Upload className='w-8 h-8 text-white/50 mb-2' />
                  <p className='text-white/70 text-center'>
                    Drop your image here or{' '}
                    <span className='text-purple-400 cursor-pointer' onClick={handleButtonClick}>
                      Browse
                    </span>
                  </p>
                  <p className='text-white/50 text-xs mt-2'>
                    Supports JPG, JPEG, PNG (&lt;= 10 images)
                  </p>
                </>
              ) : (
                <div className='w-full'>
                  <div className='flex justify-between items-center mb-4'>
                    <p className='text-white/70'>
                      {images.length} {images.length === 1 ? 'image' : 'images'} selected
                    </p>
                    <button
                      type='button'
                      className='text-purple-400 text-sm'
                      onClick={handleButtonClick}
                    >
                      Add More
                    </button>
                  </div>

                  <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3'>
                    {images.map((image, index) => (
                      <div key={index} className='relative group'>
                        <img
                          src={image.preview}
                          alt={`Preview ${index}`}
                          className='w-full h-24 object-cover rounded-lg'
                        />
                        <button
                          type='button'
                          className='absolute top-1 right-1 bg-black/70 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity'
                          onClick={() => removeImage(index)}
                        >
                          <X className='w-4 h-4 text-white' />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {error && <p className='text-red-500 text-sm mt-2'>{error}</p>}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type='submit'
            className='w-full py-4 rounded-full gradient-button text-white font-medium shadow-lg'
          >
            Submit Listing
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default PropertyListingForm;