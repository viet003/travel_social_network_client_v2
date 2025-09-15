import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { 
  Zap, 
  Shield, 
  Monitor, 
  Code, 
  HelpCircle, 
  ChevronRight 
} from 'lucide-react';
import background from '../../assets/images/background.png';

const LandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollTop = window.scrollY;
          setIsScrolled(scrollTop > 50);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Disable scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 w-full ${isScrolled
        ? 'backdrop-blur-lg bg-white/95 border-b border-gray-200'
        : 'bg-transparent'
        }`}>
        <nav className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-travel-gradient rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 sm:w-7 sm:h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
            {/* <span className="text-xl font-bold text-gray-900">Social Network</span> */}
          </div>
          <div className="hidden md:flex items-center space-x-8 text-base text-gray-700">
            {[
              "Tính năng ▼",
              "Quyền riêng tư và an toàn",
              "Ứng dụng dành cho máy tính",
              "Dành cho nhà phát triển",
              "Trung tâm trợ giúp",
            ].map((text, i) => (
              <a
                key={i}
                href="#"
                className="font-medium cursor-pointer transition-all duration-200 
                 hover:underline decoration-2 
                 decoration-[var(--travel-primary-600)] 
                 hover:underline-offset-4"
              >
                {text}
              </a>
            ))}
          </div>
          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-gray-700 hover:text-travel-primary-600 cursor-pointer transition-colors duration-200"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </nav>
      </header>

      {/* Mobile Menu Overlay - Outside header */}
      <div className={`md:hidden fixed inset-0 z-50 transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>

        {/* Side Menu */}
        <div className={`absolute left-0 top-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-travel-primary-50 to-travel-secondary-50">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-travel-gradient rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">TravelNest</h2>
                <p className="text-xs text-gray-500">Kết nối du lịch</p>
              </div>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 text-gray-400 hover:text-travel-primary-600 hover:bg-travel-primary-50 rounded-full cursor-pointer transition-all duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation Menu */}
          <div className="px-6 py-6 flex-1">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Menu</h3>
            <div className="space-y-1">
              {[
                { text: "Tính năng", icon: Zap, hasSubmenu: true },
                { text: "Quyền riêng tư và an toàn", icon: Shield },
                { text: "Ứng dụng dành cho máy tính", icon: Monitor },
                { text: "Dành cho nhà phát triển", icon: Code },
                { text: "Trung tâm trợ giúp", icon: HelpCircle },
              ].map((item, i) => {
                const IconComponent = item.icon;
                return (
                  <a
                    key={i}
                    href="#"
                    className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-travel-primary-600 hover:bg-travel-primary-50 rounded-lg cursor-pointer transition-all duration-200 group"
                  >
                    <IconComponent className="w-5 h-5 text-gray-600 group-hover:text-travel-primary-600 transition-colors duration-200" />
                    <span className="flex-1 font-medium cursor-pointer transition-all duration-200 
                    hover:underline decoration-2 
                    decoration-[var(--travel-primary-600)] 
                    hover:underline-offset-4">{item.text}</span>
                    {item.hasSubmenu && (
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-travel-primary-600 transition-colors duration-200" />
                    )}
                  </a>
                );
              })}
            </div>
          </div>
          
          {/* Footer Info */}
          <div className="px-6 py-4 border-t border-gray-100 mt-auto">
            <div className="text-center">
              <p className="text-xs text-gray-400 mb-2">© TravelNest Network 2025</p>
              <div className="flex justify-center space-x-4 text-xs">
                {[
                  "Chính sách",
                  "Điều khoản", 
                  "Hỗ trợ",
                ].map((text, i) => (
                  <a
                    key={i}
                    href="#"
                    className="font-medium
                    text-gray-400
                    cursor-pointer transition-all duration-200 
                    hover:underline decoration-2 
                    decoration-[var(--travel-primary-600)] 
                    hover:underline-offset-4"
                  >
                    {text}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="mt-20 flex items-center justify-center px-2 sm:px-4 py-8 sm:py-12 lg:py-16 min-h-screen">
        <div className="w-full max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center min-h-[60vh]">
            {/* Left Side - Content */}
            <Outlet />

            {/* Right Side - Background Image */}
            <div className="relative h-full order-first lg:order-last w-full flex justify-center">
              <div className="relative z-10 rounded-3xl overflow-hidden w-full max-w-sm sm:max-w-md lg:max-w-lg">
                <img
                  src={background}
                  alt="Social Network"
                  className="w-full h-auto rounded-3xl object-cover"
                />
              </div>

              {/* Background Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-pink-400 rounded-full opacity-20"></div>
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-yellow-400 rounded-full opacity-20"></div>
              <div className="absolute top-1/2 -right-12 w-16 h-16 bg-purple-400 rounded-full opacity-30"></div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white py-6 sm:py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          <div className="flex flex-col lg:flex-row justify-between items-center text-xs sm:text-sm text-gray-600 space-y-4 lg:space-y-0">
            <div className="text-gray-400 order-3 lg:order-1">© TravelNest 2025</div>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8 order-2">
              {[
                "Chính sách quyền riêng tư",
                "Chính sách cookie",
                "Điều khoản",
                "Tiếng Việt ▼",
              ].map((text, i) => (
                <a
                  key={i}
                  href="#"
                  className="font-medium cursor-pointer transition-all duration-200 
                  hover:underline decoration-2 
                  decoration-[var(--travel-primary-600)] 
                  hover:underline-offset-4"
                >
                  {text}
                </a>
              ))}
            </div>
            <div className="flex items-center space-x-2 text-gray-400 order-1 lg:order-3">
              <span>Made with</span>
              <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              <span>for travelers</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;