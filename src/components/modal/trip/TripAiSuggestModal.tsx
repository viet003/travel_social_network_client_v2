import React, { useState, useRef, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';
import { apiGenerateAiSuggestions, apiApplyAiSuggestions, AiRequestType, type DaySchedule } from '../../../services/tripAiService';
import TravelInput from '../../ui/customize/TravelInput';

interface TripAiSuggestModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripId: string;
  destination?: string;
  budget?: number;
  onSchedulesApplied?: () => void;
}

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  schedules?: DaySchedule[];
}

const TripAiSuggestModal: React.FC<TripAiSuggestModalProps> = ({ isOpen, onClose, tripId, destination, budget, onSchedulesApplied }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [applyingSchedules, setApplyingSchedules] = useState(false);
  const [showMentionMenu, setShowMentionMenu] = useState(false);
  const [selectedMentionType, setSelectedMentionType] = useState<AiRequestType | null>(null);
  const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set([1])); // Default expand day 1
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Generate dynamic sample prompts based on trip destination
  const samplePrompts = React.useMemo(() => {
    const dest = destination || 'địa điểm';
    return [
      { text: `@Lên lịch trình chi tiết khám phá ${dest}`, type: AiRequestType.GENERATE }, // Generate prompt with @
      { text: `Có quán ăn nào ngon và nổi tiếng tại ${dest}?`, type: null }, // Normal chat
      { text: `Địa điểm tham quan nào phù hợp cho gia đình?`, type: null }, // Normal chat
      { text: `Hoạt động gì thú vị vào buổi tối tại ${dest}?`, type: null } // Normal chat
    ];
  }, [destination]);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'ai',
      content: `Xin chào! Tôi là trợ lý AI du lịch. Tôi sẽ giúp bạn lên lịch trình chi tiết cho chuyến đi ${destination ? `tới ${destination}` : 'của bạn'}${budget ? ` với ngân sách ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(budget)}` : ''}. Bạn muốn trải nghiệm những gì?`
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPrompt(value);
    
    // Check if @ was just typed at the end
    if (value.endsWith('@')) {
      setShowMentionMenu(true);
    } else {
      setShowMentionMenu(false);
    }
  };

  const handleMentionSelect = (type: AiRequestType, label: string) => {
    // Remove the @ and add the mention
    const newPrompt = prompt.slice(0, -1) + `@${label} `;
    setPrompt(newPrompt);
    setSelectedMentionType(type);
    setShowMentionMenu(false);
    inputRef.current?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: prompt
    };

    setMessages(prev => [...prev, userMsg]);
    const currentPrompt = prompt;
    const currentType = selectedMentionType;
    setPrompt('');
    setSelectedMentionType(null);
    setLoading(true);

    try {
      const response = await apiGenerateAiSuggestions(tripId, currentPrompt, currentType || undefined);
      
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: response.data.message,
        schedules: response.data.schedules
      };
      
      setMessages(prev => [...prev, aiMsg]);
    } catch (error: any) {
      console.error('AI suggestion error:', error);
      toast.error(error?.message || 'Có lỗi xảy ra, vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleApplySchedules = async (schedules: DaySchedule[]) => {
    setApplyingSchedules(true);
    try {
      await apiApplyAiSuggestions(tripId, schedules);
      toast.success('Đã áp dụng lịch trình thành công!');
      onSchedulesApplied?.();
      onClose();
    } catch (error: any) {
      console.error('Apply schedules error:', error);
      toast.error(error?.message || 'Có lỗi xảy ra khi áp dụng lịch trình.');
    } finally {
      setApplyingSchedules(false);
    }
  };

  const toggleDay = (dayNumber: number) => {
    setExpandedDays(prev => {
      const newSet = new Set(prev);
      if (newSet.has(dayNumber)) {
        newSet.delete(dayNumber);
      } else {
        newSet.add(dayNumber);
      }
      return newSet;
    });
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
            className="p-2 hover:bg-blue-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
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
                  <div className="space-y-3 animate-fade-in">
                    {msg.schedules.map((day) => {
                      const isExpanded = expandedDays.has(day.day);
                      return (
                        <div key={day.day} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                          {/* Collapsible Header */}
                          <div 
                            onClick={() => toggleDay(day.day)}
                            className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3 flex justify-between items-center cursor-pointer hover:from-gray-100 hover:to-gray-200 transition-all"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-bold">
                                {day.day}
                              </div>
                              <div>
                                <h4 className="font-bold text-gray-900">{day.title}</h4>
                                <p className="text-xs text-gray-500">{day.activities.length} hoạt động</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleApplySchedules([day]);
                                }}
                                disabled={applyingSchedules}
                                className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Áp dụng
                              </button>
                              <Icon 
                                icon={isExpanded ? "fluent:chevron-up-24-regular" : "fluent:chevron-down-24-regular"} 
                                className="w-5 h-5 text-gray-400 transition-transform"
                              />
                            </div>
                          </div>
                          
                          {/* Collapsible Content */}
                          {isExpanded && (
                            <div className="p-4 space-y-4 animate-fade-in">
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
                                      {activity.estimatedCost && (
                                        <span className="text-xs px-1.5 py-0.5 rounded bg-green-50 text-green-600 font-medium">
                                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(activity.estimatedCost)}
                                        </span>
                                      )}
                                    </div>
                                    <h5 className="text-sm font-semibold text-gray-800">{activity.title}</h5>
                                    <p className="text-xs text-gray-500 mt-0.5">{activity.description}</p>
                                    {activity.location && (
                                      <div className="flex items-center gap-1 mt-1">
                                        <Icon icon="fluent:location-24-regular" className="w-3 h-3 text-gray-400" />
                                        <span className="text-xs text-gray-400">{activity.location}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => setExpandedDays(new Set(msg.schedules!.map(d => d.day)))}
                        className="px-3 py-2 text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        Mở tất cả
                      </button>
                      <button 
                        onClick={() => setExpandedDays(new Set())}
                        className="px-3 py-2 text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        Đóng tất cả
                      </button>
                       <button 
                         onClick={() => handleApplySchedules(msg.schedules!)}
                         disabled={applyingSchedules}
                         className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                       >
                         {applyingSchedules ? 'Đang áp dụng...' : 'Áp dụng toàn bộ'}
                       </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {/* Loading indicator with bouncing dots */}
          {loading && (
            <div className="flex gap-4 animate-fade-in">
              {/* AI Avatar */}
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-900 text-white">
                <Icon icon="fluent:bot-24-regular" className="w-5 h-5" />
              </div>
              
              {/* Bouncing dots */}
              <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-none shadow-sm p-4 flex items-center gap-1">
                <style>{`
                  @keyframes bounce-dot {
                    0%, 80%, 100% { transform: translateY(0); }
                    40% { transform: translateY(-8px); }
                  }
                  .dot {
                    width: 8px;
                    height: 8px;
                    background-color: #1f2937;
                    border-radius: 50%;
                    animation: bounce-dot 1.4s infinite ease-in-out;
                  }
                  .dot:nth-child(1) { animation-delay: -0.32s; }
                  .dot:nth-child(2) { animation-delay: -0.16s; }
                `}</style>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
            </div>
          )}
          
          {messages.length === 1 && !loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-12 animate-fade-in">
              {samplePrompts.map((sample, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setPrompt(sample.text);
                    if (sample.type) {
                      setSelectedMentionType(sample.type);
                    }
                  }}
                  className="text-left p-3 rounded-xl bg-white border border-gray-200 hover:border-gray-900 hover:shadow-sm transition-all text-sm text-gray-700 cursor-pointer"
                >
                  {sample.text}
                </button>
              ))}
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-100">
          <form onSubmit={handleSubmit} className="relative">
            {/* Mention Menu */}
            {showMentionMenu && (
              <div className="absolute bottom-full left-0 mb-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => handleMentionSelect(AiRequestType.GENERATE, `Lên lịch trình chi tiết khám phá ${destination || 'địa điểm'}`)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 cursor-pointer"
                >
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Icon icon="fluent:calendar-add-24-regular" className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Lên lịch trình</div>
                    <div className="text-xs text-gray-500">Tạo lịch trình chi tiết khám phá {destination || 'địa điểm'}</div>
                  </div>
                </button>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <TravelInput
                type="text"
                value={prompt as string}
                onChange={handleInputChange}
                placeholder="Nhập yêu cầu của bạn hoặc @ để gọi chức năng..."
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !prompt.trim()}
                className="flex-shrink-0 p-3 bg-gray-900 text-white rounded-full hover:bg-gray-800 disabled:opacity-50 disabled:hover:bg-gray-900 transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Icon icon="fluent:send-24-filled" className="w-5 h-5" />
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TripAiSuggestModal;
