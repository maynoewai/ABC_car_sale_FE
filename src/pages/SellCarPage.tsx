import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { carService } from '../api/car';
import { useState } from 'react';

interface CarFormData {
  // Basic Information (required)
  title: string;
  make: string;
  model: string;
  location: string;
  year: number;
  price: number;
  description: string;
  images: FileList;
  // Additional Details (optional)
  mileage?: number;
  mileage_unit?: string;
  fuel_type?: string;
  transmission?: string;
  owner_number?: string;
  color?: string;
  body_type?: string;
  registration_year?: number;
  insurance_validity?: string; // Date string
  engine_cc?: string;
  variant?: string;
  // Features (optional booleans)
  power_windows?: boolean;
  abs?: boolean;
  airbags?: boolean;
  sunroof?: boolean;
  navigation?: boolean;
  rear_camera?: boolean;
  leather_seats?: boolean;
}

export default function SellCarPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CarFormData>();
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const createCarMutation = useMutation(carService.createCar, {
    onSuccess: () => {
      alert('Car listed successfully!');
      window.location.href = '/dashboard';
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to list car');
    },
  });

  // Clean the form data so that optional fields are omitted if empty
  const cleanData = (data: any) =>
    Object.fromEntries(
      Object.entries(data).filter(([key, value]) => {
        if (key === 'images') return true; // Do not filter images
        // Remove empty strings, undefined or null
        return value !== undefined && value !== null && value !== '';
      })
    );

  const onSubmit = handleSubmit((data) => {
    const images = Array.from(data.images);
    console.log(data,"ayo")
    const cleanedData = cleanData(data);
    console.log(cleanedData,"ayo")
    createCarMutation.mutate({ ...cleanedData, images });
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const previews = files.map((file) => URL.createObjectURL(file));
      setPreviewImages(previews);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => currentYear - i);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Sell Your Car</h1>
      <form onSubmit={onSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                {...register('title', { required: 'Title is required' })}
                placeholder="Enter car title"
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              />
              {errors.title && <span className="text-red-500 text-sm">{errors.title.message}</span>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Make <span className="text-red-500">*</span>
              </label>
              <input
                {...register('make', { required: 'Make is required' })}
                placeholder="Enter car make"
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              />
              {errors.make && <span className="text-red-500 text-sm">{errors.make.message}</span>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Model <span className="text-red-500">*</span>
              </label>
              <input
                {...register('model', { required: 'Model is required' })}
                placeholder="Enter car model"
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              />
              {errors.model && <span className="text-red-500 text-sm">{errors.model.message}</span>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                {...register('location', { required: 'Location is required' })}
                placeholder="Enter car location"
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              />
              {errors.location && <span className="text-red-500 text-sm">{errors.location.message}</span>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Year <span className="text-red-500">*</span>
              </label>
              <select
                {...register('year', { required: 'Year is required' })}
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              >
                <option value="">Select Year</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              {errors.year && <span className="text-red-500 text-sm">{errors.year.message}</span>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Price ($) <span className="text-red-500">*</span>
              </label>
              <input
                {...register('price', {
                  required: 'Price is required',
                  min: { value: 0, message: 'Price cannot be negative' },
                })}
                type="number"
                placeholder="Enter price"
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              />
              {errors.price && <span className="text-red-500 text-sm">{errors.price.message}</span>}
            </div>
          </div>
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register('description', { required: 'Description is required' })}
              placeholder="Enter car description"
              rows={4}
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            />
            {errors.description && <span className="text-red-500 text-sm">{errors.description.message}</span>}
          </div>
        </div>

        {/* Additional Details */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Additional Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mileage (km)
              </label>
              <input
                {...register('mileage')}
                type="number"
                placeholder="Enter mileage"
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mileage Unit
              </label>
              <input
                {...register('mileage_unit')}
                type="text"
                placeholder="e.g., kmpl, kmpkg"
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Fuel Type
              </label>
              <input
                {...register('fuel_type')}
                type="text"
                placeholder="e.g., Petrol, Diesel, Electric"
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Transmission
              </label>
              <input
                {...register('transmission')}
                type="text"
                placeholder="Manual or Automatic"
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Owner Number
              </label>
              <input
                {...register('owner_number')}
                type="text"
                placeholder="e.g., First, Second"
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Color
              </label>
              <input
                {...register('color')}
                type="text"
                placeholder="e.g., Red, Black"
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Body Type
              </label>
              <input
                {...register('body_type')}
                type="text"
                placeholder="e.g., Sedan, SUV"
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Registration Year
              </label>
              <input
                {...register('registration_year')}
                type="number"
                placeholder="Enter registration year"
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Insurance Validity
              </label>
              <input
                {...register('insurance_validity')}
                type="date"
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Engine CC
              </label>
              <input
                {...register('engine_cc')}
                type="text"
                placeholder="e.g., 2000cc"
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Variant
              </label>
              <input
                {...register('variant')}
                type="text"
                placeholder="Enter car variant"
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Car Features</h2>
          <p className="mb-4 text-sm text-gray-600">Select all that apply.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                {...register('power_windows')}
                className="form-checkbox text-blue-600"
              />
              <span className="ml-2 text-gray-700">Power Windows</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                {...register('abs')}
                className="form-checkbox text-blue-600"
              />
              <span className="ml-2 text-gray-700">ABS</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                {...register('airbags')}
                className="form-checkbox text-blue-600"
              />
              <span className="ml-2 text-gray-700">Airbags</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                {...register('sunroof')}
                className="form-checkbox text-blue-600"
              />
              <span className="ml-2 text-gray-700">Sunroof</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                {...register('navigation')}
                className="form-checkbox text-blue-600"
              />
              <span className="ml-2 text-gray-700">Navigation</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                {...register('rear_camera')}
                className="form-checkbox text-blue-600"
              />
              <span className="ml-2 text-gray-700">Rear Camera</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                {...register('leather_seats')}
                className="form-checkbox text-blue-600"
              />
              <span className="ml-2 text-gray-700">Leather Seats</span>
            </label>
          </div>
        </div>

        {/* Image Upload */}
        <div className="bg-white p-6 rounded-lg shadow">
          <label className="block text-sm font-medium text-gray-700">
            Upload Images (Max 5) <span className="text-red-500">*</span>
          </label>
          <div className="mt-1">
            <input
              {...register('images', { 
                required: 'At least one image is required',
                validate: (files) => files.length <= 5 || 'Maximum 5 images allowed',
              })}
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
            />
          </div>
          {errors.images && (
            <span className="text-red-500 text-sm">{errors.images.message}</span>
          )}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {previewImages.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`Preview ${index + 1}`}
                className="w-full h-32 object-cover rounded"
              />
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={createCarMutation.isLoading}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow focus:outline-none focus:ring"
        >
          {createCarMutation.isLoading ? 'Listing Car...' : 'List Car for Sale'}
        </button>
      </form>
    </div>
  );
}
