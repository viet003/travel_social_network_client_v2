import { useState } from 'react';
import { MdOutlineExplore } from "react-icons/md";
import { toast } from 'react-toastify';
import { LoadingSpinner } from '../../index';
import { useDispatch } from 'react-redux';
import { authAction } from '../../../stores/actions';
import { useNavigate } from 'react-router-dom';
import { path } from '../../../utilities/path';

type LoginModalProps = {
  modalType: string;
  onSwitchToSignUp: () => void;
  onSwitchToForgotPassword: () => void;
};

const LoginModal = ({ modalType: _modalType, onSwitchToSignUp, onSwitchToForgotPassword }: LoginModalProps) => {
  const [form, setForm] = useState({
    email: '',
    password: '',
    remember: false,
  });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      toast.error("Please enter both email and password.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await dispatch(authAction.login({
        email: form.email.toLowerCase().trim(),
        password: form.password.trim()
      }) as any); 

      console.log("Login response:", res);
      if (!res?.success) {
        toast.error(res?.data?.message || "Login failed");
        console.log("Login failed:", res?.data);
      }
      else {
        toast.success("Login successful");
        navigate(path.CHAT);
      }

    } catch (err: any) {
      toast.error(err?.message || "Something went wrong. Please try again");
      console.log("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center w-full max-w-md p-4 mx-auto">
      <div className="flex flex-col items-start mb-6">
        <span className="flex items-center mb-2 text-2xl font-bold text-blue-600">
          <MdOutlineExplore className="text-blue-600 w-7 h-7" />
          TravelNest
        </span>
        <h2 className="text-2xl font-bold text-gray-800">Welcome back</h2>
        <p className="text-sm text-gray-500">Sign in to your account</p>
      </div>

      <form className="space-y-4" onSubmit={handleLogin}>
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 12H8m8 0a4 4 0 11-8 0 4 4 0 018 0zm0 0v1a4 4 0 01-8 0v-1" /></svg>
            </span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full py-2 pl-10 pr-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 text-base"
              autoComplete="email"
            />
          </div>
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Password</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m0-6a2 2 0 012 2v2a2 2 0 01-2 2m0-6a2 2 0 00-2 2v2a2 2 0 002 2m0-6V7a2 2 0 114 0v2m-4 0V7a2 2 0 10-4 0v2" /></svg>
            </span>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full py-2 pl-10 pr-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 text-base"
              autoComplete="current-password"
            />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              type="checkbox"
              name="remember"
              checked={form.remember}
              onChange={handleChange}
              className="mr-2 text-blue-500 rounded form-checkbox"
            />
            <span className="text-sm text-gray-700">Remember me</span>
          </div>
          <button onClick={onSwitchToForgotPassword} className="text-sm text-blue-500 hover:underline">Forgot password?</button>
        </div>
        <button
          type="submit"
          className="w-full py-2 mt-2 font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 text-base"
          disabled={loading}
        >
          {loading ? <LoadingSpinner size={20}/> : "Sign In"}
        </button>
      </form>
      <div className="mt-6 text-sm text-center text-gray-500">
        Don't have an account? <button onClick={onSwitchToSignUp} className="text-blue-500 hover:underline">Sign up</button>
      </div>
    </div>
  );
};

export default LoginModal;