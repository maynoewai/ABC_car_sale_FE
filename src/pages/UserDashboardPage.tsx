import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Formik, Form, Field } from 'formik';
import { Pencil, Trash, CheckCircle, XCircle, Gavel, Car, Inbox, Clock } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

interface Listing {
  id: number;
  title: string;
  price: number;
  year: string;
  description: string;
  model: string;
  created_at: string;
  make: string;
}

interface Bid {
  id: number;
  amount: number;
  status: 'winning' | 'outbid' | 'pending' | 'approved' | 'rejected';
  car: {
    title: string;
  };
  created_at: string;
}

interface TestDrive {
  id: number;
  scheduled_time: string;
  status: 'pending' | 'confirmed';
  car: {
    title: string;
  };
}

interface UserProfile {
  name: string;
  email: string;
  password?: string;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
};

export default function UserDashboardPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'listings' | 'bids' | 'testDrives' | 'profile'>('listings');
  const [editingListing, setEditingListing] = useState<Listing | null>(null);

  // Fetch user data, listings, bids, and test drives
  const { data: user } = useQuery<UserProfile>(['user'], async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/user`, { headers: getAuthHeaders() });
    return res.json();
  });
  const { data: listings } = useQuery<Listing[]>(['listings'], async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/user/listings`, { headers: getAuthHeaders() });
    return res.json();
  });
  const { data: bids } = useQuery<Bid[]>(['bids'], async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/user/bids`, { headers: getAuthHeaders() });
    return res.json();
  });
  const { data: testDrives } = useQuery<TestDrive[]>(['testDrives'], async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/user/test-drives`, { headers: getAuthHeaders() });
    return res.json();
  });

  // Delete listing mutation
  const deleteListing = useMutation(
    (id: number) =>
      fetch(`${import.meta.env.VITE_API_URL}/cars/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      }),
    {
      onSuccess: () => queryClient.invalidateQueries(['listings']),
    }
  );

  // Edit listing mutation
  const editListing = useMutation(
    ({ id, data }: { id: number; data: Partial<Listing> }) =>
      fetch(`${import.meta.env.VITE_API_URL}/cars/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      }).then((res) => res.json()),
    {
      onSuccess: (updatedListing) => {
        queryClient.setQueryData<Listing[]>(['listings'], (oldListings = []) =>
          oldListings.map((listing) =>
            listing.id === updatedListing.id ? updatedListing : listing
          )
        );
        setEditingListing(null);
      },
    }
  );

  // Update profile mutation
  const updateProfile = useMutation(
    (values: UserProfile) =>
      fetch(`${import.meta.env.VITE_API_URL}/user`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(values),
      }),
    {
      onSuccess: () => queryClient.invalidateQueries(['user']),
    }
  );

  return ( 
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8">Hi, {localStorage.getItem('user_name') || 'user'}</h1>
      <div className="grid gap-8 md:grid-cols-4">
        {/* Navigation Sidebar */}
        <nav className="md:col-span-1 space-y-2">
          <button onClick={() => setActiveTab('listings')} className="dashboard-tab">
            My Listings
          </button>
          <button onClick={() => setActiveTab('bids')} className="dashboard-tab">
            Bidding History
          </button>
          <button onClick={() => setActiveTab('testDrives')} className="dashboard-tab">
            Test Drives
          </button>
          <button onClick={() => setActiveTab('profile')} className="dashboard-tab">
            Profile Settings
          </button>
        </nav>

        {/* Main Content */}
        <div className="md:col-span-3">
          {/* Listings Tab */}
          {activeTab === 'listings' && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Car className="h-5 w-5" /> My Listings
              </h2>
              {(!listings || listings.length === 0) ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <Inbox className="h-16 w-16 text-gray-400" />
                  <p className="mt-4 text-gray-500">No listings found.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Car Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Make
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Model
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Year
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Car Link
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Listed Date
                        </th>
                        <th className="relative px-6 py-3">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {listings?.map((listing) =>
                        editingListing && editingListing.id === listing.id ? (
                          <tr key={listing.id}>
                            <td colSpan={8} className="px-6 py-4">
                              <Formik
                                initialValues={{
                                  title: listing.title,
                                  make: listing.make,
                                  model: listing.model,
                                  year: listing.year,
                                  price: listing.price,
                                  description: listing.description,
                                }}
                                onSubmit={(values) => {
                                  editListing.mutate({ id: listing.id, data: values });
                                }}
                              >
                                {({ handleSubmit, isSubmitting }) => (
                                  <Form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                          Title
                                        </label>
                                        <Field name="title" type="text" className="form-input mt-1 block w-full" />
                                      </div>
                                      <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                          Make
                                        </label>
                                        <Field name="make" type="text" className="form-input mt-1 block w-full" />
                                      </div>
                                      <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                          Model
                                        </label>
                                        <Field name="model" type="text" className="form-input mt-1 block w-full" />
                                      </div>
                                      <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                          Year
                                        </label>
                                        <Field name="year" type="number" className="form-input mt-1 block w-full" />
                                      </div>
                                      <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                          Price
                                        </label>
                                        <Field name="price" type="number" className="form-input mt-1 block w-full" />
                                      </div>
                                      <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                          Description
                                        </label>
                                        <Field
                                          name="description"
                                          as="textarea"
                                          className="form-input mt-1 block w-full"
                                        />
                                      </div>
                                    </div>
                                    <div className="flex justify-end gap-2">
                                      <button
                                        type="button"
                                        onClick={() => setEditingListing(null)}
                                        className="btn-secondary px-4 py-2"
                                      >
                                        Cancel
                                      </button>
                                      <button
                                        type="submit"
                                        className="btn-primary px-4 py-2"
                                        disabled={isSubmitting}
                                      >
                                        Save Changes
                                      </button>
                                    </div>
                                  </Form>
                                )}
                              </Formik>
                            </td>
                          </tr>
                        ) : (
                          <tr key={listing.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {listing.title}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {listing.make}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {listing.model}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {listing.year}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              ${Number(listing.price).toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <Link to={`/cars/${listing.id}`} className="text-blue-600 hover:underline">
                                View Details
                              </Link>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(listing.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                className="text-indigo-600 hover:text-indigo-900 mr-2"
                                onClick={() => setEditingListing(listing)}
                              >
                                <Pencil className="h-5 w-5 inline" />
                              </button>
                              <button
                                onClick={() => deleteListing.mutate(listing.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash className="h-5 w-5 inline" />
                              </button>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Bids Tab */}
          {activeTab === 'bids' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Gavel className="h-5 w-5" /> Bidding History
              </h2>
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
                      <th className="px-4 py-2">Page Link</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bids.map((bid: Bid) => (
                      <tr key={bid.id} className="border-b">
                        <td className="px-4 py-2">{bid.car.title}</td>
                        <td className="px-4 py-2">${Number(bid.amount).toLocaleString()}</td>
                        <td className="px-4 py-2">{bid.status}</td>
                        <td className="px-4 py-2">{new Date(bid.created_at).toLocaleDateString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <Link to={`/cars/${bid.car.id}`} className="text-blue-600 hover:underline">
                            View Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* Test Drives Tab */}
          {activeTab === 'testDrives' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5" /> Test Drives
              </h2>
              {(!testDrives || testDrives.length === 0) ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <Inbox className="h-16 w-16 text-gray-400" />
                  <p className="mt-4 text-gray-500">No test drives scheduled.</p>
                </div>
              ) : (
                <table className="min-w-full text-left">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2">Car</th>
                      <th className="px-4 py-2">Scheduled Time</th>
                      <th className="px-4 py-2">Status</th>
                      <th className="px-4 py-2">Page Link</th>
                    </tr>
                  </thead>
                  <tbody>
                    {testDrives.map((td: TestDrive) => (
                      <tr key={td.id} className="border-b">
                        <td className="px-4 py-2">{td.car.title}</td>
                        <td className="px-4 py-2">{new Date(td.scheduled_time).toLocaleString()}</td>
                        <td className="px-4 py-2">{td.status}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <Link to={`/cars/${td.car.id}`} className="text-blue-600 hover:underline">
                            View Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
              <Formik
                initialValues={{
                  name: user?.name || '',
                  email: user?.email || '',
                }}
                enableReinitialize={true}
                onSubmit={(values, { setSubmitting }) => {
                  updateProfile.mutate(values, {
                    onSettled: () => {
                      setSubmitting(false);
                    },
                  });
                }}
              >
                {({ isSubmitting }) => (
                  <Form className="max-w-md space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Name
                      </label>
                      <Field
                        name="name"
                        type="text"
                        className="form-input mt-1 block w-full border border-gray-300 rounded-md p-2"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <Field
                        name="email"
                        type="email"
                        className="form-input mt-1 block w-full border border-gray-300 rounded-md p-2"
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn-primary px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                      disabled={isSubmitting || updateProfile.isLoading}
                    >
                      {updateProfile.isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </Form>
                )}
              </Formik>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
