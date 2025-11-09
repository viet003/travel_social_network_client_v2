import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { TravelButton } from '../../../components/ui/customize';
import { useNavigate } from 'react-router-dom';
import { path } from '../../../utilities/path';
import { Outlet } from 'react-router-dom';
import VideoCreateModal from '../../../components/modal/video/VideoCreateModal';

const WatchPage: React.FC = () => {
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreateSuccess = () => {
    // Navigate to my videos page after creating video
    navigate(`${path.MY_VIDEOS}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Video Create Modal */}
      <VideoCreateModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      {/* Header Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Icon icon="fluent:play-24-filled" className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Watch</h1>
            </div>
            <div className="flex items-center space-x-3">
              <TravelButton 
                type="default"
                className="flex items-center space-x-2"
                onClick={() => navigate(`${path.MY_VIDEOS}`)}
              >
                <Icon icon="fluent:video-person-24-filled" className="h-5 w-5" />
                <span>Video của bạn</span>
              </TravelButton>
              <TravelButton 
                type="primary"
                className="flex items-center space-x-2"
                onClick={() => setIsCreateModalOpen(true)}
              >
                <Icon icon="fluent:add-24-filled" className="h-5 w-5" />
                <span>Tạo video</span>
              </TravelButton>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Outlet for nested routes */}
      <Outlet />
    </div>
  );
};

export default WatchPage;
