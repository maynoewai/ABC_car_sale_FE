import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Create an Axios instance to be used throughout your app.
const apiClient = axios.create({
  baseURL: API_URL,
  headers : {
    "Accept": "application/json"
  }
});


export const bidService = {
    placeBid: async (carId: number, amount: number) => {
      // API call for placing a bid on a car.
      return apiClient.post(`/cars/${carId}/bids`, { amount });
    },
  
    // Additional bid-related API methods can be added here...
  };