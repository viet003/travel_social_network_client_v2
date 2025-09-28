import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LeftSidebar, RightSidebar } from '../../components/common';
import { authAction } from '../../stores/actions';
import { path } from '../../utilities/path';

const HomePage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: any) => state.auth);

  const handleLogout = () => {
    dispatch(authAction.logout());
    navigate(path.LANDING);
  };

  return (
    <div className="flex">
      {/* Left Sidebar - Hidden on mobile and tablet */}
      <div className="hidden lg:block">
        <LeftSidebar user={user} onLogout={handleLogout} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-white max-w-2xl mx-auto lg:max-w-2xl xl:max-w-3xl">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-semibold text-black mb-4">Main Content Area</h2>
            <p className="text-gray-500 mb-8 text-sm sm:text-base">This is where the main content will be displayed</p>

            {/* Sample content to demonstrate scrolling */}
            <div className="space-y-4 sm:space-y-6">
              {Array.from({ length: 20 }, (_, i) => (
                <div key={i} className="bg-gray-50 p-4 sm:p-6 rounded-lg">
                  <h3 className="text-base sm:text-lg font-medium text-black mb-2">Content Block {i + 1}</h3>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Hidden on mobile and tablet */}
      <div className="hidden lg:block">
        <RightSidebar />
      </div>
    </div>
  );
};

export default HomePage;