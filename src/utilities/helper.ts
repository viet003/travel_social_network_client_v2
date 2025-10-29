// Basic helper functions
export const formatLastActiveTime = (lastActiveAt: string | null | undefined): string => {
  if (!lastActiveAt) return 'Never';
  
  const date = new Date(lastActiveAt);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = diffInMs / (1000 * 60 * 60);
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

  if (diffInHours < 1) {
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    return diffInMinutes <= 1 ? 'Just now' : `${diffInMinutes}m ago`;
  } else if (diffInHours < 24) {
    return `${Math.floor(diffInHours)}h ago`;
  } else if (diffInDays < 7) {
    return `${Math.floor(diffInDays)}d ago`;
  } else {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  }
};

export const formatTimeAgo = (createdAt: string | null | undefined): string => {
  if (!createdAt) return 'Vừa xong';
  const now = new Date();
  const postDate = new Date(createdAt);
  if (isNaN(postDate.getTime())) return 'Vừa xong';
  const diffInMinutes = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60));

  if (diffInMinutes < 1) {
    return 'Vừa xong';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} phút`;
  } else if (diffInMinutes < 1440) {
    const hours = Math.floor(diffInMinutes / 60);
    return `${hours} giờ`;
  } else if (diffInMinutes < 10080) { // Less than 7 days
    const days = Math.floor(diffInMinutes / 1440);
    return `${days} ngày`;
  } else if (diffInMinutes < 43200) { // Less than 30 days
    const weeks = Math.floor(diffInMinutes / 10080);
    return `${weeks} tuần`;
  } else if (diffInMinutes < 525600) { // Less than 365 days
    const months = Math.floor(diffInMinutes / 43200);
    return `${months} tháng`;
  } else {
    const years = Math.floor(diffInMinutes / 525600);
    return `${years} năm`;
  }
};

export const formatPrivacy = (privacy: string | null | undefined): string => {
  if (!privacy) return 'Công khai';
  
  const privacyMap: { [key: string]: string } = {
    'public': 'Công khai',
    'friend': 'Bạn bè',
    'friends': 'Bạn bè',
    'private': 'Chỉ mình tôi',
    'only_me': 'Chỉ mình tôi',
    'Công khai': 'Công khai',
    'Bạn bè': 'Bạn bè',
    'Chỉ mình tôi': 'Chỉ mình tôi'
  };
  
  return privacyMap[privacy] || privacy;
};