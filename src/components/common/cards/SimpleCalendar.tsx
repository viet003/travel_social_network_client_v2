import React, { useState, useEffect } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/vi';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SimpleCalendarProps {
  events?: Record<string, boolean>; // { '2025-11-18': true }
  onDateClick?: (date: Dayjs) => void;
  eventColor?: string;
}

const SimpleCalendar: React.FC<SimpleCalendarProps> = ({ 
  events = {}, 
  onDateClick,
  eventColor = '#1890ff'
}) => {
  const [currentDate, setCurrentDate] = useState(dayjs().locale('vi'));

  useEffect(() => {
    dayjs.locale('vi');
  }, []);

  const firstDayOfMonth = currentDate.startOf('month').day(); // 0 (Sun) to 6 (Sat)
  
  // Generate calendar grid
  const generateCalendarDays = () => {
    const days: Dayjs[] = [];
    const startOfGrid = currentDate.startOf('month').subtract(firstDayOfMonth, 'day');
    
    // 6 weeks * 7 days = 42 cells to ensure consistent height
    for (let i = 0; i < 42; i++) {
      days.push(startOfGrid.add(i, 'day'));
    }
    return days;
  };

  const calendarDays = generateCalendarDays();
  const weekDays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

  const handlePrevMonth = () => setCurrentDate(currentDate.subtract(1, 'month'));
  const handleNextMonth = () => setCurrentDate(currentDate.add(1, 'month'));
  const handleToday = () => setCurrentDate(dayjs().locale('vi'));

  return (
    <div 
      className="bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 w-full select-none"
    >
       {/* Header */}
       <div className="flex items-center justify-between mb-6">
          <button 
            onClick={handlePrevMonth}
            className="p-2 hover:bg-gray-50 rounded-full transition-colors text-gray-400 hover:text-gray-800"
            type="button"
          >
            <ChevronLeft size={20} strokeWidth={2} />
          </button>
          
          <div 
            className="font-bold text-gray-800 text-lg cursor-pointer hover:text-blue-600 transition-colors capitalize" 
            onClick={handleToday}
            title="Quay về hôm nay"
          >
            {currentDate.format('MMMM YYYY')}
          </div>

          <button 
            onClick={handleNextMonth}
            className="p-2 hover:bg-gray-50 rounded-full transition-colors text-gray-400 hover:text-gray-800"
            type="button"
          >
            <ChevronRight size={20} strokeWidth={2} />
          </button>
       </div>

       {/* Week days */}
       <div className="grid grid-cols-7 mb-4">
          {weekDays.map(day => (
            <div key={day} className="text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {day}
            </div>
          ))}
       </div>

       {/* Days grid */}
       <div className="grid grid-cols-7 gap-y-2 gap-x-1">
          {calendarDays.map((date, index) => {
            const isCurrentMonth = date.month() === currentDate.month();
            const isToday = date.isSame(dayjs(), 'day');
            const dateStr = date.format('YYYY-MM-DD');
            const hasEvent = !!events[dateStr];
            
            return (
              <div 
                key={index}
                className="flex flex-col items-center justify-center aspect-square"
              >
                <div
                  className={`
                    relative flex items-center justify-center w-9 h-9 rounded-full cursor-pointer transition-all duration-200
                    ${!isCurrentMonth ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-50'}
                    ${isToday ? 'bg-blue-500 text-white shadow-md shadow-blue-200 hover:bg-blue-600 hover:text-white' : ''}
                  `}
                  style={
                    hasEvent && !isToday 
                      ? { 
                          backgroundColor: `${eventColor}1A`, // 10% opacity
                          color: eventColor,
                          fontWeight: 600
                        } 
                      : {}
                  }
                  onClick={() => onDateClick?.(date)}
                >
                  <span className={`text-sm ${isToday ? 'font-medium' : 'font-normal'}`}>
                    {date.date()}
                  </span>
                  
                  {/* Event Dot */}
                  {hasEvent && (
                    <div 
                      className={`absolute -bottom-1 w-1 h-1 rounded-full ${isToday ? 'bg-white' : ''}`}
                      style={!isToday ? { backgroundColor: eventColor } : {}}
                    />
                  )}
                </div>
              </div>
            );
          })}
       </div>
    </div>
  );
};

export default SimpleCalendar;
