import { useState } from 'react';
import { MdOutlineExplore } from 'react-icons/md';
import { LoginModal, SignUpModal, ForgotPasswordModal } from "../../components/index";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LandingPage = () => {
  const [currentForm, setCurrentForm] = useState<'none' | 'login' | 'signup' | 'forgot-password'>('none');

  const handleCloseForm = () => {
    setCurrentForm('none');
  };

  const switchToSignUp = () => {
    setCurrentForm('signup');
  };

  const switchToLogin = () => {
    setCurrentForm('login');
  };

  const switchToForgotPassword = () => {
    setCurrentForm('forgot-password');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-50 overflow-x-hidden">
      {/* Header */}
      <header className="w-full bg-white/80 backdrop-blur">
        <div className="flex items-center justify-between px-6 py-3 mx-auto max-w-7xl">
          <div className="flex items-center space-x-2">
            <a href="#" className="flex items-center text-2xl font-bold text-blue-600">
              <MdOutlineExplore className="text-blue-600 w-7 h-7" />
              <span className="ml-1">TravelNest</span>
            </a>
          </div>
          <nav className="hidden space-x-8 font-medium text-gray-700 md:flex">
            <a href="#" className="hover:text-blue-500">Discover</a>
            <a href="#" className="hover:text-blue-500">Community</a>
            <a href="#" className="hover:text-blue-500">Destinations</a>
            <a href="#" className="hover:text-blue-500">About</a>
          </nav>
          <div className="flex gap-2">
            <button onClick={() => setCurrentForm('login')} className="px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100">Log In</button>
            <button onClick={() => setCurrentForm('signup')} className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm">Sign Up</button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative w-full h-[420px] md:h-[480px] flex items-center justify-center">
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=80"
          alt="hero-bg"
          className="absolute inset-0 object-cover w-full h-full"
        />
        <div className="relative z-10 max-w-3xl px-6 mx-auto text-center text-white">
          <h1 className="mb-4 text-4xl font-extrabold drop-shadow md:text-6xl">Explore the World Together</h1>
          <p className="mb-8 text-lg font-medium drop-shadow md:text-2xl">Connect with fellow travelers, share your adventures, and create unforgettable memories together</p>
          <div className="flex justify-center gap-4">
            <button onClick={() => setCurrentForm('signup')} className="px-6 py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow">Sign Up</button>
            <button onClick={() => setCurrentForm('login')} className="px-6 py-3 font-semibold text-blue-600 bg-white rounded-lg hover:bg-gray-100 shadow">Log In</button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl px-6 py-16 mx-auto">
        <h2 className="mb-12 text-2xl font-bold text-center text-gray-800 md:text-4xl">Connect. Share. Explore.</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          {/* Feature 1 */}
          <div className="flex flex-col items-center p-6 bg-white shadow-sm rounded-2xl">
            <svg className="w-10 h-10 mb-3 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 8a3 3 0 11-6 0 3 3 0 016 0zM19.5 19.5a3.5 3.5 0 10-7 0m7 0a3.5 3.5 0 01-7 0m7 0V17a2 2 0 00-2-2h-3a2 2 0 00-2 2v2.5" />
            </svg>
            <h3 className="mb-1 text-lg font-semibold">Share Trips</h3>
            <p className="text-sm text-center text-gray-500">Document and share your journey with photos, stories, and tips</p>
          </div>
          
          {/* Feature 2 */}
          <div className="flex flex-col items-center p-6 bg-white shadow-sm rounded-2xl">
            <svg className="w-10 h-10 mb-3 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-4a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <h3 className="mb-1 text-lg font-semibold">Join Travel Groups</h3>
            <p className="text-sm text-center text-gray-500">Find like-minded travelers and plan adventures together</p>
          </div>
          
          {/* Feature 3 */}
          <div className="flex flex-col items-center p-6 bg-white shadow-sm rounded-2xl">
            <svg className="w-10 h-10 mb-3 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <h3 className="mb-1 text-lg font-semibold">Rate Destinations</h3>
            <p className="text-sm text-center text-gray-500">Help others discover hidden gems and must-visit spots</p>
          </div>
          
          {/* Feature 4 */}
          <div className="flex flex-col items-center p-6 bg-white shadow-sm rounded-2xl">
            <svg className="w-10 h-10 mb-3 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A2 2 0 013 15.382V5.618a2 2 0 011.553-1.894L9 2m0 18v-16m0 16l6-3m0 0V2m0 15l5.447 2.724A2 2 0 0021 18.382V8.618a2 2 0 00-1.553-1.894L15 4" />
            </svg>
            <h3 className="mb-1 text-lg font-semibold">Plan Together</h3>
            <p className="text-sm text-center text-gray-500">Create collaborative itineraries with fellow travelers</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-white border-[1px] border-gray-200">
        <div className="grid grid-cols-1 gap-8 px-4 py-10 mx-auto text-gray-700 max-w-7xl md:grid-cols-4">
          <div>
            <span className="flex items-center text-lg font-bold text-blue-500">
              <MdOutlineExplore className="text-blue-600 w-7 h-7" />
              TravelNest
            </span>
            <p className="mt-2 text-sm">Your global travel community</p>
            <div className="flex mt-4 space-x-3">
              {/* Social icons */}
              <a href="#" className="text-gray-500 hover:text-blue-500"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46 6c-.77.35-1.6.59-2.47.7a4.3 4.3 0 001.88-2.37 8.59 8.59 0 01-2.72 1.04A4.28 4.28 0 0016.11 4c-2.37 0-4.29 1.92-4.29 4.29 0 .34.04.67.11.99C7.69 9.13 4.07 7.38 1.64 4.7c-.37.64-.58 1.38-.58 2.17 0 1.5.76 2.82 1.92 3.6-.7-.02-1.36-.21-1.94-.53v.05c0 2.1 1.5 3.85 3.5 4.25-.36.1-.74.16-1.13.16-.28 0-.54-.03-.8-.08.54 1.7 2.1 2.94 3.95 2.97A8.6 8.6 0 012 19.54c-.29 0-.57-.02-.85-.05A12.13 12.13 0 006.29 21c7.55 0 11.68-6.26 11.68-11.68 0-.18-.01-.36-.02-.54A8.18 8.18 0 0024 4.59a8.36 8.36 0 01-2.54.7z" /></svg></a>
              <a href="#" className="text-gray-500 hover:text-blue-500"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.04c-5.5 0-9.96 4.46-9.96 9.96 0 4.41 3.6 8.07 8.19 8.93.6.11.82-.26.82-.58v-2.02c-3.34.73-4.04-1.61-4.04-1.61-.54-1.37-1.32-1.74-1.32-1.74-1.08-.74.08-.73.08-.73 1.2.08 1.83 1.23 1.83 1.23 1.06 1.82 2.78 1.3 3.46.99.11-.77.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.97 0-1.32.47-2.39 1.23-3.23-.12-.3-.53-1.52.12-3.17 0 0 1-.32 3.3 1.23a11.5 11.5 0 016 0c2.3-1.55 3.3-1.23 3.3-1.23.65 1.65.24 2.87.12 3.17.77.84 1.23 1.91 1.23 3.23 0 4.64-2.8 5.67-5.47 5.97.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58C18.36 20.07 22 16.41 22 12c0-5.5-4.46-9.96-9.96-9.96z" /></svg></a>
              <a href="#" className="text-gray-500 hover:text-blue-500"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M21.8 8.001c-.2-1.5-.8-2.7-2.1-3.5-1.2-.8-2.6-1-4.1-1.1-1.5-.1-6.1-.1-7.6 0-1.5.1-2.9.3-4.1 1.1-1.3.8-1.9 2-2.1 3.5-.2 1.5-.2 4.6-.2 4.6s0 3.1.2 4.6c.2 1.5.8 2.7 2.1 3.5 1.2.8 2.6 1 4.1 1.1 1.5.1 6.1.1 7.6 0 1.5-.1 2.9-.3 4.1-1.1 1.3-.8 1.9-2 2.1-3.5.2-1.5.2-4.6.2-4.6s0-3.1-.2-4.6zm-12.8 7.2v-6.4l6.4 3.2-6.4 3.2z" /></svg></a>
              <a href="#" className="text-gray-500 hover:text-blue-500"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.6 3.2H4.4C3.1 3.2 2 4.3 2 5.6v12.8c0 1.3 1.1 2.4 2.4 2.4h15.2c1.3 0 2.4-1.1 2.4-2.4V5.6c0-1.3-1.1-2.4-2.4-2.4zm-9.6 14.4V6.4l8 5.6-8 5.6z" /></svg></a>
            </div>
          </div>
          <div>
            <h4 className="mb-2 font-semibold">Company</h4>
            <ul className="space-y-1 text-sm">
              <li><a href="#" className="hover:text-blue-500">About Us</a></li>
              <li><a href="#" className="hover:text-blue-500">Careers</a></li>
              <li><a href="#" className="hover:text-blue-500">Press</a></li>
              <li><a href="#" className="hover:text-blue-500">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-2 font-semibold">Community</h4>
            <ul className="space-y-1 text-sm">
              <li><a href="#" className="hover:text-blue-500">Guidelines</a></li>
              <li><a href="#" className="hover:text-blue-500">Safety</a></li>
              <li><a href="#" className="hover:text-blue-500">Support</a></li>
              <li><a href="#" className="hover:text-blue-500">Blog</a></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-2 font-semibold">Legal</h4>
            <ul className="space-y-1 text-sm">
              <li><a href="#" className="hover:text-blue-500">Terms</a></li>
              <li><a href="#" className="hover:text-blue-500">Privacy</a></li>
              <li><a href="#" className="hover:text-blue-500">Cookies</a></li>
              <li><a href="#" className="hover:text-blue-500">Help Center</a></li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between px-4 py-4 mx-auto text-xs text-gray-400 border-t md:flex-row max-w-7xl">
          <span>© 2025 TravelNest. All rights reserved.</span>
          <span className="flex items-center mt-2 space-x-1 md:mt-0">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.95l-.71.71M21 12h-1M4 12H3m16.95 7.05l-.71-.71M4.05 4.05l-.71-.71" /></svg>
            <span>English (US)</span>
          </span>
        </div>
      </footer>

      {/* Forms - Direct Rendering */}
      {currentForm === 'login' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-lg p-6 w-md relative transform transition-all duration-300 scale-100">
            <button 
              onClick={handleCloseForm}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <LoginModal 
              modalType="login" 
              onSwitchToSignUp={switchToSignUp} 
              onSwitchToForgotPassword={switchToForgotPassword} 
            />
          </div>
        </div>
      )}
      
      {currentForm === 'signup' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-lg p-6 w-2xl relative transform transition-all duration-300 scale-100">
            <button 
              onClick={handleCloseForm}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            </button>
            <SignUpModal 
              modalType="signup" 
              onSwitchToLogin={switchToLogin} 
            />
          </div>
        </div>
      )}
      
      {currentForm === 'forgot-password' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-lg p-6 w-md relative transform transition-all duration-300 scale-100">
            <button 
              onClick={handleCloseForm}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <ForgotPasswordModal onSwitchToLogin={switchToLogin} />
          </div>
        </div>
      )}
      
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default LandingPage;
