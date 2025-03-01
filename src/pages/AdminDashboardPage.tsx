import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  LineChart,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  Bar,
} from 'recharts';
import {
  Pencil,
  Trash,
  CheckCircle,
  XCircle,
  Users,
  Car,
  Activity,
  Gauge,
  Calendar,
  List,
  Grid,
  Inbox,
  Gavel
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

interface CarListing {
  id: number;
  title: string;
  make: string;
  model: string;
  year: number;
  price: number;
  created_at: string;
  images: { url: string }[];
  transmission: string;
  fuel_type: string;
}

interface TestDrive {
  id: number;
  scheduled_time: string;
  status: string; // e.g., 'pending', 'accepted', 'rejected'
  car: {
    title: string;
  };
}

interface Bid {
  id: number;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  car: {
    title: string;
  };
  created_at: string;
}

interface UserProfile {
  name: string;
  email: string;
  password?: string;
}

interface Analytics {
  monthlyTrend: { month: string; users: number; cars: number; testDrives: number }[];
  popularCars: { car: string; bookings: number }[];
}

// Fake analytics data (fallback)
const fakeAnalytics: Analytics = {
  monthlyTrend: [
    { month: 'Jan', users: 40, cars: 65, testDrives: 35 },
    { month: 'Feb', users: 55, cars: 80, testDrives: 45 },
    { month: 'Mar', users: 30, cars: 45, testDrives: 25 },
    { month: 'Apr', users: 70, cars: 95, testDrives: 60 },
    { month: 'May', users: 60, cars: 75, testDrives: 50 },
  ],
  popularCars: [
    { car: 'Model X', bookings: 80 },
    { car: 'Model Y', bookings: 65 },
    { car: 'Model Z', bookings: 50 },
    { car: 'Classic A', bookings: 45 },
  ],
};

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  };
};

export default function AdminDashboard() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'users' | 'cars' | 'testdrives' | 'bids'>('users');

  // Fetch current admin profile
  const { data: user } = useQuery<UserProfile>(['user'], async () => {
    const res = await fetch(`${API_URL}/user`, getAuthHeaders());
    return res.json();
  });

  // Fetch all users
  const { data: users } = useQuery<User[]>(['users'], async () => {
    const res = await fetch(`${API_URL}/admin/users`, getAuthHeaders());
    const json = await res.json();
    return json.data;
  });

  // Fetch all car listings
  const { data: cars } = useQuery<CarListing[]>(['cars'], async () => {
    const res = await fetch(`${API_URL}/admin/cars`, getAuthHeaders());
    const json = await res.json();
    return json.data;
  });

  // Fetch all test drives
  const { data: testDrives } = useQuery<TestDrive[]>(['testdrives'], async () => {
    const res = await fetch(`${API_URL}/admin/test-drives`, getAuthHeaders());
    const json = await res.json();
    return json.data;
  });

  // Fetch all bids
  const { data: bids } = useQuery<Bid[]>(['bids'], async () => {
    const res = await fetch(`${API_URL}/admin/bids`, getAuthHeaders());
    const json = await res.json();
    return json.data;
  });

  // Mutations
  const updateUserRole = useMutation(
    ({ userId, role }: { userId: number; role: string }) =>
      fetch(`${API_URL}/admin/users/${userId}`, {
        method: 'PUT',
        ...getAuthHeaders(),
        body: JSON.stringify({ role }),
      }),
    { onSuccess: () => queryClient.invalidateQueries(['users']) }
  );

  const deleteUser = useMutation(
    (userId: number) =>
      fetch(`${API_URL}/admin/users/${userId}`, {
        method: 'DELETE',
        ...getAuthHeaders(),
      }),
    { onSuccess: () => queryClient.invalidateQueries(['users']) }
  );

  const deleteCar = useMutation(
    (carId: number) =>
      fetch(`${API_URL}/admin/cars/${carId}`, {
        method: 'DELETE',
        ...getAuthHeaders(),
      }),
    { onSuccess: () => queryClient.invalidateQueries(['cars']) }
  );

  const updateTestDriveStatus = useMutation(
    ({ testDriveId, status }: { testDriveId: number; status: string }) =>
      fetch(`${API_URL}/admin/test-drives/${testDriveId}`, {
        method: 'PUT',
        ...getAuthHeaders(),
        body: JSON.stringify({ status }),
      }),
    { onSuccess: () => queryClient.invalidateQueries(['testdrives']) }
  );

  const deleteTestDrive = useMutation(
    (testDriveId: number) =>
      fetch(`${API_URL}/admin/test-drives/${testDriveId}`, {
        method: 'DELETE',
        ...getAuthHeaders(),
      }),
    { onSuccess: () => queryClient.invalidateQueries(['testdrives']) }
  );

  // Mutation: Update bid status (approve/reject)
  const updateBidStatus = useMutation(
    ({ bidId, status }: { bidId: number; status: string }) =>
      fetch(`${API_URL}/admin/bids/${bidId}`, {
        method: 'PUT',
        ...getAuthHeaders(),
        body: JSON.stringify({ status }),
      }),
    { onSuccess: () => queryClient.invalidateQueries(['bids']) }
  );

  const deleteBid = useMutation(
    (bidId: number) =>
      fetch(`${API_URL}/admin/bids/${bidId}`, {
        method: 'DELETE',
        ...getAuthHeaders(),
      }),
    { onSuccess: () => queryClient.invalidateQueries(['bids']) }
  );

  // Metrics
  const userCount = users?.length || 0;
  const carCount = cars?.length || 0;
  const testDriveCount = testDrives?.length || 0;
  const bidCount = bids?.length || 0;

  return (
    <div className="max-w-7xl mx-auto p-4 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-3 text-gray-800">
        <Gauge className="w-8 h-8 text-blue-600" />
        Admin Dashboard
      </h1>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{userCount}</p>
              <p className="text-sm text-gray-600">Total Users</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Car className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{carCount}</p>
              <p className="text-sm text-gray-600">Total Listings</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{testDriveCount}</p>
              <p className="text-sm text-gray-600">Test Drives</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Gavel className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{bidCount}</p>
              <p className="text-sm text-gray-600">Total Bids</p>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            Monthly Trend
          </h3>
          <LineChart width={500} height={300} data={fakeAnalytics.monthlyTrend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" stroke="#4B5563" />
            <YAxis stroke="#4B5563" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="users" stroke="#3b82f6" />
            <Line type="monotone" dataKey="cars" stroke="#10b981" />
            <Line type="monotone" dataKey="testDrives" stroke="#8b5cf6" />
          </LineChart>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Car className="w-5 h-5 text-green-600" />
            Popular Models
          </h3>
          <BarChart width={500} height={300} data={fakeAnalytics.popularCars}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="car" stroke="#4B5563" />
            <YAxis stroke="#4B5563" />
            <Tooltip />
            <Legend />
            <Bar dataKey="bookings" fill="#10b981" />
          </BarChart>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex space-x-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-t-lg ${
            activeTab === 'users'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Users
        </button>
        <button
          onClick={() => setActiveTab('cars')}
          className={`px-4 py-2 rounded-t-lg ${
            activeTab === 'cars'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Cars
        </button>
        <button
          onClick={() => setActiveTab('testdrives')}
          className={`px-4 py-2 rounded-t-lg ${
            activeTab === 'testdrives'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Test Drives
        </button>
        <button
          onClick={() => setActiveTab('bids')}
          className={`px-4 py-2 rounded-t-lg ${
            activeTab === 'bids'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Bids
        </button>
      </div>

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <table className="min-w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((u: User) => (
                <tr key={u.id} className="border-b">
                  <td className="px-4 py-2">{u.name}</td>
                  <td className="px-4 py-2">{u.email}</td>
                  <td className="px-4 py-2">
                    <select
                      value={u.role}
                      onChange={(e) => updateUserRole.mutate({ userId: u.id, role: e.target.value })}
                      className="border p-1 rounded"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-4 py-2 flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button onClick={() => deleteUser.mutate(u.id)} className="text-red-600 hover:text-red-800">
                      <Trash className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Cars Tab */}
      {activeTab === 'cars' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <table className="min-w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Make</th>
                <th className="px-4 py-2">Model</th>
                <th className="px-4 py-2">Year</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Listed Date</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cars?.map((c: CarListing) => (
                <tr key={c.id} className="border-b">
                  <td className="px-4 py-2">{c.title}</td>
                  <td className="px-4 py-2">{c.make}</td>
                  <td className="px-4 py-2">{c.model}</td>
                  <td className="px-4 py-2">{c.year}</td>
                  <td className="px-4 py-2">${Number(c.price).toLocaleString()}</td>
                  <td className="px-4 py-2">{new Date(c.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-2 flex space-x-2">
                    <button onClick={() => deleteCar.mutate(c.id)} className="text-red-600 hover:text-red-800">
                      <Trash className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Test Drives Tab */}
      {activeTab === 'testdrives' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <table className="min-w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">Car</th>
                <th className="px-4 py-2">Scheduled Time</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {testDrives?.map((td: TestDrive) => (
                <tr key={td.id} className="border-b">
                  <td className="px-4 py-2">{td.car.title}</td>
                  <td className="px-4 py-2">{new Date(td.scheduled_time).toLocaleString()}</td>
                  <td className="px-4 py-2">{td.status}</td>
                  <td className="px-4 py-2 flex space-x-2">
                    <button
                      onClick={() => updateTestDriveStatus.mutate({ testDriveId: td.id, status: 'approved' })}
                      className="text-green-600 hover:text-green-800"
                    >
                      <CheckCircle className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => updateTestDriveStatus.mutate({ testDriveId: td.id, status: 'rejected' })}
                      className="text-green-600 hover:text-green-800"
                    >
                      <XCircle className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => deleteTestDrive.mutate(td.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Bids Tab */}
      {activeTab === 'bids' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {(!bids || bids.length === 0) ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Inbox className="h-16 w-16 text-gray-400" />
              <p className="mt-4 text-gray-500">No bids found.</p>
            </div>
          ) : (
            <table className="min-w-full text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2">Car</th>
                  <th className="px-4 py-2">Bid Amount</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Bid Date</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bids?.map((bid: Bid) => (
                  <tr key={bid.id} className="border-b">
                    <td className="px-4 py-2">{bid.car.title}</td>
                    <td className="px-4 py-2">${Number(bid.amount).toLocaleString()}</td>
                    <td className="px-4 py-2">{bid.status}</td>
                    <td className="px-4 py-2">{new Date(bid.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-2 flex space-x-2">
                      <button
                        onClick={() => updateBidStatus.mutate({ bidId: bid.id, status: 'approved' })}
                        className="text-green-600 hover:text-green-800"
                      >
                        <CheckCircle className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => updateBidStatus.mutate({ bidId: bid.id, status: 'rejected' })}
                        className="text-red-600 hover:text-red-800"
                      >
                        <XCircle className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => deleteBid.mutate(bid.id)}
                        className="text-gray-600 hover:text-gray-800"
                      >
                        <Trash className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
