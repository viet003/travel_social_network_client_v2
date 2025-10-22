import React from 'react';
import { Icon } from '@iconify/react';

const BirthdaysPage: React.FC = () => {
  // Mock data for birthdays
  const todayBirthdays = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop&crop=face",
      age: 28
    },
    {
      id: 2,
      name: "Mai Phương",
      avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop&crop=face",
      age: 25
    }
  ];

  const upcomingBirthdays = [
    {
      id: 3,
      name: "Hoàng Tuấn",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
      date: "15 tháng 11"
    },
    {
      id: 4,
      name: "Linh Chi",
      avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
      date: "18 tháng 11"
    },
    {
      id: 5,
      name: "Minh Đức",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      date: "22 tháng 11"
    }
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-black mb-2">Sinh nhật</h2>
        <p className="text-gray-600 text-sm">Theo dõi và gửi lời chúc mừng sinh nhật đến bạn bè</p>
      </div>

      {/* Today's Birthdays */}
      {todayBirthdays.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Icon 
              icon="fluent:gift-24-filled" 
              className="h-6 w-6 mr-2"
              style={{ color: 'var(--travel-primary-500)' }}
            />
            <h3 className="text-lg font-semibold text-gray-900">Hôm nay</h3>
          </div>

          <div className="space-y-3">
            {todayBirthdays.map((person) => (
              <div key={person.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex items-center space-x-4">
                  <img
                    src={person.avatar}
                    alt={person.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h4 
                      className="text-gray-900 font-medium transition-colors cursor-pointer"
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--travel-primary-500)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = ''}
                    >
                      {person.name}
                    </h4>
                    <p className="text-gray-600 text-sm">
                      <Icon icon="fluent:balloon-24-regular" className="inline h-4 w-4 mr-1" />
                      {person.age} tuổi hôm nay
                    </p>
                  </div>
                  <button 
                    className="text-white px-4 py-2 rounded-lg transition-colors text-sm cursor-pointer"
                    style={{ backgroundColor: 'var(--travel-primary-500)' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--travel-primary-500)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--travel-primary-500)'}
                  >
                    Chúc mừng sinh nhật
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Birthdays */}
      <div>
        <div className="flex items-center mb-4">
          <Icon icon="fluent:calendar-24-regular" className="h-6 w-6 text-gray-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Sắp tới</h3>
        </div>

        <div className="space-y-3">
          {upcomingBirthdays.map((person) => (
            <div key={person.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="flex items-center space-x-4">
                <img
                  src={person.avatar}
                  alt={person.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h4 
                    className="text-gray-900 font-medium transition-colors cursor-pointer"
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--travel-primary-500)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = ''}
                  >
                    {person.name}
                  </h4>
                  <p className="text-gray-600 text-sm">{person.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {todayBirthdays.length === 0 && upcomingBirthdays.length === 0 && (
        <div className="text-center py-12">
          <Icon icon="fluent:gift-24-regular" className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Không có sinh nhật nào trong thời gian tới</p>
        </div>
      )}
    </div>
  );
};

export default BirthdaysPage;
