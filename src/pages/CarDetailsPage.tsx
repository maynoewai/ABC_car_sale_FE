import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useState, ReactNode } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Clock, Gavel, Fuel, Settings, Calendar, MapPin } from 'lucide-react';

interface CarDetails {
  id: number;
  title: string;
  make: string;
  model: string;
  year: number;
  price: number;
  fuelType: string;
  transmission: string;
  description: string;
  images: Array<{ url: string }>;
  location: string;
  currentBid: number;
  status: string; // e.g. "pending", "sold"
  bids: Array<{
    id: number;
    amount: number;
    user: { name: string };
    created_at: string;
  }>;
}

interface BidFormData {
  amount: number;
}

export default function CarDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm<BidFormData>();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Grab API_URL from environment variables
  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch car details
  const { data: car } = useQuery<CarDetails>(['car', id], async () => {
    const res = await fetch(`${API_URL}/cars/${id}`);
    if (!res.ok) {
      throw new Error('Error fetching car details');
    }
    return res.json();
  });

  // Place bid mutation
  const placeBid = useMutation(
    async (amount: number) => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        navigate('/login');
        return Promise.reject('Not authenticated');
      }
      const response = await fetch(`${API_URL}/cars/${id}/bids`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message);
        throw new Error(errorData.message || 'Failed to place bid');
      }
      return response.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['car', id]);
        reset();
      },
    }
  );

  // Book test drive mutation
  const bookTestDrive = useMutation(
    async (datetime: Date) => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        navigate('/login');
        return Promise.reject('Not authenticated');
      }
      const response = await fetch(`${API_URL}/test-drives`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        // The backend expects a field named scheduled_time and car_id
        body: JSON.stringify({ car_id: id, scheduled_time: datetime }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message || errorData?.error);
        throw new Error(errorData.message || 'Failed to book test drive');
      }
      return response.json();
    },
    {
      onSuccess: () => {
        setSelectedDate(null);
        alert('Test drive booked successfully!');
      },
    }
  );

  if (!car) return <div>Loading...</div>;

  // Handle bid form submission
  const onBidSubmit = (data: BidFormData) => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
      return;
    }
    // Validate that the bid amount is at least equal to the car price
    if (data.amount <= car.price) {
      alert(`Bid amount must be at least $${car.price}`);
      return;
    }
    // Only allow bidding if the car is not sold
    if (car.status === 'sold') {
      alert('This car is sold. Bidding is disabled.');
      return;
    }
    placeBid.mutate(data.amount);
  };

  // Handle test drive booking
  const handleTestDriveBooking = () => {
    if (!selectedDate) return;
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
      return;
    }
    // Only allow test drive booking if the car is not sold
    if (car.status === 'sold') {
      alert('This car is sold. Test drive booking is disabled.');
      return;
    }
    bookTestDrive.mutate(selectedDate);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          <Carousel showThumbs={false} infiniteLoop useKeyboardArrows autoPlay>
            {car.images.map((img, index) => (
              <div key={index} className="relative h-96">
                <img
                  src={img.url}
                  alt={`${car.title} - ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            ))}
          </Carousel>
          <div className="grid grid-cols-4 gap-2">
            {car.images.map((img, index) => (
              <img
                key={index}
                src={img.url}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-20 object-cover rounded cursor-pointer"
              />
            ))}
          </div>
        </div>

        {/* Car Details */}
        <div className="space-y-6">
          {/* Title and Price */}
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-bold">{car.title}</h1>
            {car.status === 'sold' && (
              <span className="px-3 py-1 text-xs font-semibold text-white bg-red-600 rounded-full">
                SOLD
              </span>
            )}
          </div>
          <p className="text-2xl font-semibold text-primary-600 mt-2">
            ${Number(car.price).toLocaleString()}
          </p>

          {/* Specifications */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Specifications</h2>
            <div className="grid grid-cols-2 gap-4">
              <DetailItem icon={<Fuel size={20} />} label="Fuel Type" value={car.fuelType} />
              <DetailItem icon={<Settings size={20} />} label="Transmission" value={car.transmission} />
              <DetailItem icon={<Calendar size={20} />} label="Year" value={car.year} />
              <DetailItem icon={<MapPin size={20} />} label="Location" value={car.location} />
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-600">{car.description}</p>
          </div>

          {/* Bidding Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Gavel size={20} /> Bidding
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Current Bid:</span>
                <span className="text-lg font-semibold">
                  ${Number(car.currentBid).toLocaleString()}
                </span>
              </div>
              {car.status === 'sold' ? (
                <p className="text-gray-500">This car is sold. Bidding is disabled.</p>
              ) : (
                <form onSubmit={handleSubmit(onBidSubmit)}>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      {...register('amount', {
                        required: true,
                        min: car.price,
                      })}
                      className="flex-1 p-2 border rounded"
                      placeholder={`Enter bid (min $${car.price})`}
                    />
                    <button
                      type="submit"
                      className="btn-primary"
                      disabled={placeBid.isLoading}
                    >
                      {placeBid.isLoading ? 'Placing Bid...' : 'Place Bid'}
                    </button>
                  </div>
                </form>
              )}

              {/* Bid History */}
              <div className="mt-4">
                <h3 className="font-medium mb-2">Bid History</h3>
                <div className="space-y-2">
                  {car.bids.map((bid) => (
                    <div
                      key={bid.id}
                      className="flex justify-between items-center p-2 bg-white rounded"
                    >
                      <div>
                        <p className="font-medium">{bid?.user?.name}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(bid.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="text-primary-600 font-semibold">
                        ${bid.amount.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Test Drive Booking */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Clock size={20} /> Book Test Drive
            </h2>
            {car.status === 'sold' ? (
              <p className="text-gray-500">This car is sold. Test drive booking is disabled.</p>
            ) : (
              <div className="flex flex-col md:flex-row gap-4 items-start">
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  showTimeSelect
                  minDate={new Date()}
                  dateFormat="MMMM d, yyyy h:mm aa"
                  className="p-2 border rounded w-full"
                  placeholderText="Select date and time"
                />
                <button
                  onClick={handleTestDriveBooking}
                  disabled={!selectedDate || bookTestDrive.isLoading}
                  className="btn-primary w-full md:w-auto"
                >
                  {bookTestDrive.isLoading ? 'Booking...' : 'Book Now'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable Detail Item Component
function DetailItem({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-gray-500">{icon}</span>
      <div>
        <p className="text-sm text-gray-600">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}
