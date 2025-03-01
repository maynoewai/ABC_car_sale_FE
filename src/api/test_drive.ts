import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Create an Axios instance to be used throughout your app.
const apiClient = axios.create({
  baseURL: API_URL,
});


export const testDriveService = {
    bookTestDrive: async (carId: number, scheduled_time: Date) => {
      // Note: The backend expects a field named scheduled_time.
      return apiClient.post('/test-drives', { car_id: carId, scheduled_time });
    },
  
    // Additional test drive API methods can be added here...
  };