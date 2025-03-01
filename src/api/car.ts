import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export interface CarData {
  // Basic Information (required)
  title: string;
  make: string;
  model: string;
  location : string;
  year: number;
  price: number;
  description: string;
  images: File[]; // Using File[] instead of FileList for easier iteration
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

export const carService = {
  createCar: async (data: CarData) => {
    const formData = new FormData();
    // Basic fields
    formData.append('title', data.title);
    formData.append('make', data.make);
    formData.append('model', data.model);
    formData.append('year', data.year.toString());
    formData.append('price', data.price.toString());
    formData.append('description', data.description);
    formData.append('location', data.location);

    // Additional optional fields - only if provided
    if (data.mileage !== undefined) formData.append('mileage', data.mileage.toString());
    if (data.mileage_unit) formData.append('mileage_unit', data.mileage_unit);
    if (data.fuel_type) formData.append('fuel_type', data.fuel_type);
    if (data.transmission) formData.append('transmission', data.transmission);
    if (data.owner_number) formData.append('owner_number', data.owner_number);
    if (data.color) formData.append('color', data.color);
    if (data.body_type) formData.append('body_type', data.body_type);
    if (data.registration_year !== undefined)
      formData.append('registration_year', data.registration_year.toString());
    if (data.insurance_validity) formData.append('insurance_validity', data.insurance_validity);
    if (data.engine_cc) formData.append('engine_cc', data.engine_cc);
    if (data.variant) formData.append('variant', data.variant);

    // Features - send as '1' (true) or '0' (false)
    if (data.power_windows !== undefined)
      formData.append('power_windows', data.power_windows ? '1' : '0');
    if (data.abs !== undefined) formData.append('abs', data.abs ? '1' : '0');
    if (data.airbags !== undefined) formData.append('airbags', data.airbags ? '1' : '0');
    if (data.sunroof !== undefined) formData.append('sunroof', data.sunroof ? '1' : '0');
    if (data.navigation !== undefined)
      formData.append('navigation', data.navigation ? '1' : '0');
    if (data.rear_camera !== undefined)
      formData.append('rear_camera', data.rear_camera ? '1' : '0');
    if (data.leather_seats !== undefined)
      formData.append('leather_seats', data.leather_seats ? '1' : '0');

    // Append images array
    data.images.forEach((image) => {
      formData.append('images[]', image);
    });

    return axios.post(`${API_URL}/cars`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
  },
};
