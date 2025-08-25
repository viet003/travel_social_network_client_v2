import { useState } from 'react';
import { MdOutlineExplore } from "react-icons/md";
import { LoadingSpinner } from '../../index';
import { apiForgotPassWordService } from '../../../services/authService';
import { toast } from 'react-toastify';

type ForgotPasswordModalProps = {
  onSwitchToLogin: () => void;
};

const ForgotPasswordModal = ({ onSwitchToLogin }: ForgotPasswordModalProps) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted with email:', email); // Debug log

    if (!email) {
      console.log('Error: Email is empty'); // Replaced toast.error
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Error: Invalid email format'); // Replaced toast.error
      return;
    }
       setLoading(true);
    try {
      const res = await apiForgotPassWordService(email);
      if (res?.success) {
        toast.success(res?.message || "Password reset link sent!");
        setEmail("");
      } else {
        toast.error(res?.message || "Failed to send reset link.");
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to send reset link.");
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
        <h2 className="text-2xl font-bold text-gray-800">Reset your password</h2>
        <p className="text-sm text-gray-500">Enter your email to receive a reset link</p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 12H8m8 0a4 4 0 11-8 0 4 4 0 018 0zm0 0v1a4 4 0 01-8 0v-1" /></svg>
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full py-2 pl-10 pr-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 text-base"
              autoComplete="email"
            />
          </div>
        </div>
        
        <button
          type="submit"
          className="w-full py-2 mt-2 font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 text-base"
          disabled={loading}
        >
          {loading ? <LoadingSpinner size={20}/> : "Send Reset Link"}
        </button>
      </form>
      
      <div className="mt-6 text-sm text-center text-gray-500">
        Remember your password? <button onClick={onSwitchToLogin} className="text-blue-500 hover:underline">Sign in</button>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
