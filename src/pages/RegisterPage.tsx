import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { authService } from '../api/auth';
import { useMutation } from '@tanstack/react-query';
import { UserPlus } from 'lucide-react';

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export default function RegisterPage() {
  const { 
    register, 
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<RegisterForm>();

  const registerMutation = useMutation(authService.register, {
    onSuccess: () => {
      window.location.href = '/login';
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Registration failed');
    }
  });

  const onSubmit = handleSubmit((data) => {
    registerMutation.mutate(data);
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <UserPlus className="h-12 w-12 text-primary-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Create Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              sign in to your account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={onSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                {...register('name', { required: 'Name is required' })}
                className="input mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring focus:border-blue-300"
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                type="email"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                className="input mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring focus:border-blue-300"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                {...register('password', { 
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters'
                  }
                })}
                className="input mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring focus:border-blue-300"
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                id="password_confirmation"
                type="password"
                {...register('password_confirmation', {
                  validate: (value) => value === watch('password') || 'Passwords do not match'
                })}
                className="input mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring focus:border-blue-300"
                placeholder="Confirm your password"
              />
              {errors.password_confirmation && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password_confirmation.message}
                </p>
              )}
            </div>
          </div>
          <button
            type="submit"
            disabled={registerMutation.isLoading}
            className="btn-primary w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow focus:outline-none focus:ring"
          >
            {registerMutation.isLoading ? 'Registering...' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}
