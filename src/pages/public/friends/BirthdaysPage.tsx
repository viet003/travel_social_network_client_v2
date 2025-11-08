import React, { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { apiGetFriendsBirthdays } from '../../../services/friendshipService';
import type { UserResponse } from '../../../types/friendship.types';
import { toast } from 'react-toastify';
import { useLoading } from '../../../hooks/useLoading';
import avatardf from '../../../assets/images/avatar_default.png';

interface BirthdayFriend extends UserResponse {
  isToday?: boolean;
  daysUntil?: number;
  formattedDate?: string;
  age?: number;
}

const BirthdaysPage: React.FC = () => {
  const [birthdays, setBirthdays] = useState<BirthdayFriend[]>([]);
  const { isLoading, showLoading, hideLoading } = useLoading(true);

  const fetchBirthdays = async () => {
    try {
      showLoading();
      const response = await apiGetFriendsBirthdays();
      if (response.success && response.data) {
        const processedBirthdays = processBirthdays(response.data);
        setBirthdays(processedBirthdays);
      }
    } catch (error) {
      console.error('Error fetching birthdays:', error);
      toast.error('Không thể tải danh sách sinh nhật');
    } finally {
      hideLoading();
    }
  };

  useEffect(() => {
    fetchBirthdays();
  }, []);

  const processBirthdays = (friends: UserResponse[]): BirthdayFriend[] => {
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentDay = today.getDate();
    const currentYear = today.getFullYear();

    return friends.map(friend => {
      if (!friend.userProfile.dateOfBirth) {
        return friend;
      }

      const birthDate = new Date(friend.userProfile.dateOfBirth);
      const birthMonth = birthDate.getMonth() + 1;
      const birthDay = birthDate.getDate();
      const birthYear = birthDate.getFullYear();

      let age = currentYear - birthYear;
      if (currentMonth < birthMonth || (currentMonth === birthMonth && currentDay < birthDay)) {
        age--;
      }

      const isToday = currentMonth === birthMonth && currentDay === birthDay;

      let nextBirthday = new Date(currentYear, birthMonth - 1, birthDay);
      if (nextBirthday < today) {
        nextBirthday = new Date(currentYear + 1, birthMonth - 1, birthDay);
      }
      const daysUntil = Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      const monthNames = ['tháng 1', 'tháng 2', 'tháng 3', 'tháng 4', 'tháng 5', 'tháng 6',
                          'tháng 7', 'tháng 8', 'tháng 9', 'tháng 10', 'tháng 11', 'tháng 12'];
      const formattedDate = `${birthDay} ${monthNames[birthMonth - 1]}`;

      return {
        ...friend,
        isToday,
        daysUntil,
        formattedDate,
        age
      };
    });
  };

  const todayBirthdays = birthdays.filter(b => b.isToday);
  const upcomingBirthdays = birthdays
    .filter(b => !b.isToday && b.daysUntil !== undefined && b.daysUntil <= 30)
    .sort((a, b) => (a.daysUntil || 0) - (b.daysUntil || 0))
    .slice(0, 10);

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Icon icon="eos-icons:loading" className="h-12 w-12 mx-auto mb-4" style={{ color: 'var(--travel-primary-500)' }} />
          <p className="text-gray-600">Đang tải danh sách sinh nhật...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-black mb-2">Sinh nhật</h2>
        <p className="text-gray-600 text-sm">Theo dõi và gửi lời chúc mừng sinh nhật đến bạn bè</p>
      </div>

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
              <div key={person.userId} className="bg-white border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex items-center space-x-4">
                  <img
                    src={person.avatarImg || avatardf}
                    alt={person.userProfile.fullName || person.userName}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h4 
                      className="text-gray-900 font-medium transition-colors cursor-pointer"
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--travel-primary-500)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = ''}
                      onClick={() => console.log('View profile', person.userId)}
                    >
                      {person.userProfile.fullName || person.userName}
                    </h4>
                    <p className="text-gray-600 text-sm">
                      <Icon icon="fluent:balloon-24-regular" className="inline h-4 w-4 mr-1" />
                      {person.age} tuổi hôm nay
                    </p>
                  </div>
                  <button 
                    className="text-white px-4 py-2 rounded-lg transition-colors text-sm cursor-pointer"
                    style={{ backgroundColor: 'var(--travel-primary-500)' }}
                    onClick={() => {}}
                  >
                    Chúc mừng sinh nhật
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {upcomingBirthdays.length > 0 && (
        <div>
          <div className="flex items-center mb-4">
            <Icon icon="fluent:calendar-24-regular" className="h-6 w-6 text-gray-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Sắp tới</h3>
          </div>

          <div className="space-y-3">
            {upcomingBirthdays.map((person) => (
              <div key={person.userId} className="bg-white border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex items-center space-x-4">
                  <img
                    src={person.avatarImg || avatardf}
                    alt={person.userProfile.fullName || person.userName}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h4 
                      className="text-gray-900 font-medium transition-colors cursor-pointer"
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--travel-primary-500)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = ''}
                      onClick={() => console.log('View profile', person.userId)}
                    >
                      {person.userProfile.fullName || person.userName}
                    </h4>
                    <p className="text-gray-600 text-sm">
                      {person.formattedDate}
                      {person.daysUntil !== undefined && person.daysUntil > 0 && (
                        <span className="ml-2 text-xs text-gray-500">
                          (còn {person.daysUntil} ngày)
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {todayBirthdays.length === 0 && upcomingBirthdays.length === 0 && (
        <div className="text-center py-12">
          <Icon icon="fluent:gift-24-regular" className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Không có sinh nhật nào trong thời gian tới</p>
          <p className="text-gray-500 text-sm mt-2">Sinh nhật của bạn bè sẽ hiển thị ở đây</p>
        </div>
      )}
    </div>
  );
};

export default BirthdaysPage;
