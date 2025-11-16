
export const formatTimeAgo = (createdAt: string | null | undefined): string => {
  if (!createdAt) return 'Vừa xong';
  const now = new Date();
  const postDate = new Date(createdAt);
  if (isNaN(postDate.getTime())) return 'Vừa xong';
  const diffInMinutes = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60));

  if (diffInMinutes < 1) {
    return 'Vừa xong';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} phút trước`;
  } else if (diffInMinutes < 1440) {
    const hours = Math.floor(diffInMinutes / 60);
    return `${hours} giờ trước`;
  } else if (diffInMinutes < 10080) { // Less than 7 days
    const days = Math.floor(diffInMinutes / 1440);
    return `${days} ngày trước`;
  } else if (diffInMinutes < 43200) { // Less than 30 days
    const weeks = Math.floor(diffInMinutes / 10080);
    return `${weeks} tuần trước`;
  } else if (diffInMinutes < 525600) { // Less than 365 days
    const months = Math.floor(diffInMinutes / 43200);
    return `${months} tháng trước`;
  } else {
    const years = Math.floor(diffInMinutes / 525600);
    return `${years} năm trước`;
  }
};

export const formatPrivacy = (privacy: string | null | undefined): string => {
  if (!privacy) return 'Công khai';
  
  const privacyMap: { [key: string]: string } = {
    'PUBLIC': 'Công khai',
    'FRIEND': 'Bạn bè',
    'FRIENDS': 'Bạn bè',
    'PRIVATE': 'Chỉ mình tôi',
    'only_me': 'Chỉ mình tôi',
    'Công khai': 'Công khai',
    'Bạn bè': 'Bạn bè',
    'Chỉ mình tôi': 'Chỉ mình tôi'
  };
  
  return privacyMap[privacy] || privacy;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return "Hôm nay";
  if (diffInDays === 1) return "1 ngày trước";
  if (diffInDays < 7) return `${diffInDays} ngày trước`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} tuần trước`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} tháng trước`;
  return `${Math.floor(diffInDays / 365)} năm trước`;
};