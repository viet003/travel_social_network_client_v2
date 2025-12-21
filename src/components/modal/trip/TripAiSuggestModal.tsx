import React, { useState, useRef, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';

interface TripAiSuggestModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripId: string;
}

interface Activity {
  time: string;
  title: string;
  description: string;
  type: 'VISIT' | 'MEAL' | 'TRANSPORT' | 'ACCOMMODATION';
}

interface DaySchedule {
  day: number;
  title: string;
  activities: Activity[];
}

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  schedules?: DaySchedule[];
}

const mockSchedules: DaySchedule[] = [
  {
    day: 1,
    title: "Khám phá Văn hóa & Ẩm thực",
    activities: [
      { time: "08:00", title: "Ăn sáng tại Phở Thìn", description: "Thưởng thức phở bò tái lăn nổi tiếng", type: "MEAL" },
      { time: "09:30", title: "Tham quan Văn Miếu", description: "Tìm hiểu về trường đại học đầu tiên của VN", type: "VISIT" },
      { time: "12:00", title: "Ăn trưa Bún Chả", description: "Bún chả Hương Liên (Obama)", type: "MEAL" },
      { time: "14:00", title: "Cafe Giảng", description: "Thưởng thức cafe trứng đặc sản", type: "MEAL" },
      { time: "15:30", title: "Dạo quanh Hồ Gươm", description: "Tham quan đền Ngọc Sơn, cầu Thê Húc", type: "VISIT" },
    ]
  },
  {
    day: 2,
    title: "Nghệ thuật & Mua sắm",
    activities: [
      { time: "09:00", title: "Bảo tàng Dân tộc học", description: "Khám phá văn hóa 54 dân tộc", type: "VISIT" },
      { time: "12:00", title: "Ăn trưa Bánh Cuốn", description: "Bánh cuốn Thanh Trì", type: "MEAL" },
      { time: "14:00", title: "Mua sắm tại Phố Cổ", description: "Mua quà lưu niệm, đồ thủ công", type: "VISIT" },
      { time: "18:00", title: "Xem Múa Rối Nước", description: "Nhà hát múa rối Thăng Long", type: "VISIT" },
    ]
  }
];

const samplePrompts = [
  "Lên lịch trình 2 ngày khám phá Hà Nội",
  "Tìm quán ăn ngon và địa điểm văn hóa",
  "Gợi ý lịch trình tham quan phố cổ",
  "Kế hoạch đi chơi cuối tuần cho gia đình"
];

const TripAiSuggestModal: React.FC<TripAiSuggestModalProps> = ({ isOpen, onClose, tripId }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'ai',
      content: 'Xin chào! Tôi là trợ lý AI du lịch. Bạn muốn đi đâu và thích trải nghiệm những gì? Tôi sẽ giúp bạn lên lịch trình chi tiết.'
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: prompt
    };

    setMessages(prev => [...prev, userMsg]);
    setPrompt('');
    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: 'Dựa trên mong muốn của bạn, tôi xin gợi ý lịch trình 2 ngày khám phá như sau:',
        schedules: mockSchedules
      };
      
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      toast.error('Có lỗi xảy ra, vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'VISIT': return 'fluent:camera-24-regular';
      case 'MEAL': return 'fluent:food-24-regular';
      case 'TRANSPORT': return 'fluent:vehicle-bus-24-regular';
      case 'ACCOMMODATION': return 'fluent:bed-24-regular';
      default: return 'fluent:star-24-regular';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-5xl h-[85vh] shadow-2xl overflow-hidden flex flex-col animate-scale-in">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-900 text-white rounded-lg">
               <Icon icon="fluent:sparkle-24-filled" className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900">AI Gợi ý lịch trình</h3>
              <p className="text-xs text-gray-500">Powered by AI</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-blue-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Icon icon="fluent:dismiss-24-regular" className="w-6 h-6" />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50 space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'ai' ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-600'}`}>
                <Icon icon={msg.role === 'ai' ? "fluent:bot-24-regular" : "fluent:person-24-regular"} className="w-5 h-5" />
              </div>

              {/* Message Content */}
              <div className={`max-w-[80%] space-y-4`}>
                <div className={`p-4 rounded-2xl ${msg.role === 'user' ? 'bg-gray-900 text-white rounded-tr-none' : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-sm'}`}>
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                </div>

                {/* Itinerary Suggestions */}
                {msg.schedules && (
                  <div className="space-y-4 animate-fade-in">
                    {msg.schedules.map((day) => (
                      <div key={day.day} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                          <h4 className="font-bold text-gray-900">Ngày {day.day}: {day.title}</h4>
                          <button className="text-xs font-medium text-blue-600 hover:underline">Áp dụng ngày này</button>
                        </div>
                        <div className="p-4 space-y-4">
                          {day.activities.map((activity, idx) => (
                            <div key={idx} className="flex gap-3 relative">
                              {/* Timeline line */}
                              {idx !== day.activities.length - 1 && (
                                <div className="absolute left-[11px] top-8 bottom-[-16px] w-0.5 bg-gray-100"></div>
                              )}
                              
                              <div className="mt-1 relative z-10">
                                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 border border-gray-200">
                                  <Icon icon={getActivityIcon(activity.type)} className="w-3.5 h-3.5" />
                                </div>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-0.5">
                                  <span className="text-xs font-bold text-gray-900">{activity.time}</span>
                                  <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 font-medium">{activity.type}</span>
                                </div>
                                <h5 className="text-sm font-semibold text-gray-800">{activity.title}</h5>
                                <p className="text-xs text-gray-500 mt-0.5">{activity.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-end">
                       <button className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors shadow-sm">
                         Áp dụng toàn bộ lịch trình
                       </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {messages.length === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-12 animate-fade-in">
              {samplePrompts.map((text, index) => (
                <button
                  key={index}
                  onClick={() => setPrompt(text)}
                  className="text-left p-3 rounded-xl bg-white border border-gray-200 hover:border-gray-900 hover:shadow-sm transition-all text-sm text-gray-700"
                >
                  {text}
                </button>
              ))}
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-100">
          <form onSubmit={handleSubmit} className="relative">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Nhập yêu cầu của bạn (VD: Lịch trình 2 ngày Đà Lạt cho cặp đôi...)"
              className="w-full pl-4 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none transition-all text-gray-800 placeholder:text-gray-400"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 disabled:opacity-50 disabled:hover:bg-gray-900 transition-colors"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Icon icon="fluent:send-24-filled" className="w-5 h-5" />
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TripAiSuggestModal;
