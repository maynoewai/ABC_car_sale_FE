import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Slider } from '@mui/material';
import { List, Grid, Inbox, Car } from 'lucide-react';

interface Car {
  id: number;
  title: string;
  make: string;
  model: string;
  year: number;
  price: number;
  transmission: string;
  fuel_type: string;
  color: string;
  body_type: string;
  owner_number: string;
  features: string[];
  images: { url: string }[];
}

interface ApiResponse {
  data: Car[];
  meta: {
    current_page: number;
    last_page: number;
    total: number;
  };
}

export default function CarListingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // State for filters
  const [filters, setFilters] = useState({
    make: searchParams.get('make') || '',
    model: searchParams.get('model') || '',
    minPrice: Number(searchParams.get('minPrice')) || 0,
    maxPrice: Number(searchParams.get('maxPrice')) || 100000,
    minYear: Number(searchParams.get('minYear')) || 2000,
    maxYear: Number(searchParams.get('maxYear')) || new Date().getFullYear(),
    transmission: searchParams.get('transmission') || '',
    fuelType: searchParams.get('fuelType') || '',
    color: searchParams.get('color') || '',
    bodyType: searchParams.get('bodyType') || '',
    ownerNumber: searchParams.get('ownerNumber') || '',
    features: searchParams.get('features') ? searchParams.get('features')!.split(',') : [] as string[],
    page: Number(searchParams.get('page')) || 1,
  });

  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch cars from API with filters
  const { data, isLoading, isError } = useQuery<ApiResponse>(
    ['cars', filters],
    async () => {
      const params = new URLSearchParams({
        page: filters.page.toString(),
        make: filters.make,
        model: filters.model,
        min_price: filters.minPrice.toString(),
        max_price: filters.maxPrice.toString(),
        min_year: filters.minYear.toString(),
        max_year: filters.maxYear.toString(),
        transmission: filters.transmission,
        fuel_type: filters.fuelType,
        color: filters.color,
        body_type: filters.bodyType,
        owner_number: filters.ownerNumber,
        features: filters.features.join(','),
      });
      const response = await fetch(`${API_URL}/cars?${params}`, {
        // Optionally add headers if needed
      });
      if (!response.ok) {
        throw new Error('Failed to fetch car data');
      }
      const apiResponse = await response.json();
      return {
        meta: {
          current_page: apiResponse.current_page,
          last_page: apiResponse.last_page,
          total: apiResponse.total,
        },
        data: apiResponse.data,
      };
    }
  );

  // Handle filter changes
  const handleFilterChange = (name: string, value: string | number | string[]) => {
    const newFilters = { ...filters, [name]: value, page: 1 };
    setFilters(newFilters);
    // Convert all filter values to strings for URL search params.
    const params: Record<string, string> = {};
    Object.entries(newFilters).forEach(([key, val]) => {
      params[key] = Array.isArray(val) ? val.join(',') : val.toString();
    });
    setSearchParams(params);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading cars</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="w-full lg:w-64 space-y-6">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold mb-4">Filters</h3>

            {/* Price Range Slider */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Price Range (${filters.minPrice} - ${filters.maxPrice})
              </label>
              <Slider
                value={[filters.minPrice, filters.maxPrice]}
                onChange={(_, newValue) => {
                  handleFilterChange('minPrice', newValue[0]);
                  handleFilterChange('maxPrice', newValue[1]);
                }}
                valueLabelDisplay="auto"
                min={0}
                max={100000}
                step={1000}
              />
            </div>

            {/* Year Range Slider */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Year Range ({filters.minYear} - {filters.maxYear})
              </label>
              <Slider
                value={[filters.minYear, filters.maxYear]}
                onChange={(_, newValue) => {
                  handleFilterChange('minYear', newValue[0]);
                  handleFilterChange('maxYear', newValue[1]);
                }}
                valueLabelDisplay="auto"
                min={2000}
                max={new Date().getFullYear()}
              />
            </div>

            {/* Make Dropdown */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Make</label>
              <select
                className="w-full p-2 border rounded"
                value={filters.make}
                onChange={(e) => handleFilterChange('make', e.target.value)}
              >
                <option value="">All Makes</option>
                {/* Populate from API if available */}
                <option value="mercedes">Mercedes-Benz</option>
                <option value="bmw">BMW</option>
              </select>
            </div>

            {/* Transmission Filter */}
            <div className="mb-4">
              <label className="block text-sm font-medium">Transmission</label>
              <select
                className="w-full p-2 border rounded"
                value={filters.transmission}
                onChange={(e) => handleFilterChange('transmission', e.target.value)}
              >
                <option value="">All</option>
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
                <option value="Electric">Electric</option>
              </select>
            </div>

            {/* Fuel Type Dropdown */}
            <div className="mb-4">
              <label className="block text-sm font-medium">Fuel Type</label>
              <select
                className="w-full p-2 border rounded"
                value={filters.fuelType}
                onChange={(e) => handleFilterChange('fuelType', e.target.value)}
              >
                <option value="">All</option>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option>
              </select>
            </div>

            {/* Color Picker */}
            <div className="mb-4">
              <label className="block text-sm font-medium">Color</label>
              <select
                className="w-full p-2 border rounded"
                value={filters.color}
                onChange={(e) => handleFilterChange('color', e.target.value)}
              >
                <option value="">All</option>
                <option value="Red">Red</option>
                <option value="Blue">Blue</option>
                <option value="Black">Black</option>
              </select>
            </div>

            {/* Body Type Dropdown */}
            <div className="mb-4">
              <label className="block text-sm font-medium">Body Type</label>
              <select
                className="w-full p-2 border rounded"
                value={filters.bodyType}
                onChange={(e) => handleFilterChange('bodyType', e.target.value)}
              >
                <option value="">All</option>
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Hatchback">Hatchback</option>
              </select>
            </div>

            {/* Ownership Filter */}
            <div className="mb-4">
              <label className="block text-sm font-medium">Ownership</label>
              <select
                className="w-full p-2 border rounded"
                value={filters.ownerNumber}
                onChange={(e) => handleFilterChange('ownerNumber', e.target.value)}
              >
                <option value="">All</option>
                <option value="1">1st Owner</option>
                <option value="2">2nd Owner</option>
                <option value="3">3rd Owner</option>
              </select>
            </div>

            {/* Features Checkboxes */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Features</label>
              {['ABS', 'Airbags', 'Sunroof', 'Navigation'].map((feature) => (
                <label key={feature} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.features.includes(feature)}
                    onChange={(e) => {
                      const updatedFeatures = e.target.checked
                        ? [...filters.features, feature]
                        : filters.features.filter((f) => f !== feature);
                      handleFilterChange('features', updatedFeatures);
                    }}
                  />
                  <span>{feature}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100' : ''}`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100' : ''}`}
              >
                <List size={20} />
              </button>
              <span>{data?.meta.total} results found</span>
            </div>
          </div>

          {/* Car List */}
          {data?.data.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Inbox className="h-16 w-16 text-gray-400" />
              <p className="mt-4 text-gray-500">No listings found.</p>
            </div>
          ) : (
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-6'
            }>
              {data?.data.map((car) => (
                <div
                  key={car.id}
                  className={`bg-white rounded-lg shadow-sm overflow-hidden ${
                    viewMode === 'grid' ? 'h-full' : 'flex'
                  }`}
                >
                  <img
                    src={car.images[0].url}
                    alt={car.title}
                    className={`${viewMode === 'grid' 
                      ? 'w-full h-48 object-cover'
                      : 'w-64 h-48 object-cover'
                    }`}
                  />
                  <div className="p-4 flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold">{car.title}</h3>
                      <span className="text-primary-600 font-bold">
                        ${car.price.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                      <span>{car.year}</span>
                      <span>•</span>
                      <span>{car.transmission}</span>
                      <span>•</span>
                      <span>{car.fuel_type}</span>
                    </div>
                    <Link
                      to={`/cars/${car.id}`}
                      className="btn-outline mt-4 inline-block"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="mt-8 flex justify-center space-x-2">
            {Array.from({ length: data?.meta.last_page || 1 }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => handleFilterChange('page', i + 1)}
                className={`px-3 py-1 rounded ${
                  filters.page === i + 1
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
