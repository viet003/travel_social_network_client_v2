import React, { useState, useEffect } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/vi';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { TripCalendar } from '../../../types/trip.types';

interface SimpleCalendarProps {
  events?: Record<string, boolean>; // { '2025-11-18': true } - deprecated, use trips instead
  trips?: TripCalendar[]; // Trip data grouped by date
  onDateClick?: (date: Dayjs, trips?: TripCalendar[]) => void;
  onTripHover?: (trip: TripCalendar, element: HTMLElement) => void;
  onTripLeave?: () => void;
  eventColor?: string;
}

const SimpleCalendar: React.FC<SimpleCalendarProps> = ({ 
  events = {}, 
  trips = [],
  onDateClick,
  onTripHover,
  onTripLeave,
  eventColor = '#1890ff'
}) => {
  const [currentDate, setCurrentDate] = useState(dayjs().locale('vi'));

  useEffect(() => {
    dayjs.locale('vi');
  }, []);

  const firstDayOfMonth = currentDate.startOf('month').day(); // 0 (Sun) to 6 (Sat)
  
  // Group trips by start date (show avatar on start date)
  const tripsByStartDate: Record<string, TripCalendar[]> = trips.reduce((acc, trip) => {
    const dateKey = dayjs(trip.startDate).format('YYYY-MM-DD');
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(trip);
    return acc;
  }, {} as Record<string, TripCalendar[]>);
  
  // Create a map of date ranges for highlighting
  const dateInTripRange = (date: Dayjs): TripCalendar | null => {
    for (const trip of trips) {
      const start = dayjs(trip.startDate);
      const end = dayjs(trip.endDate);
      // Check if date is between start and end (exclusive of start, inclusive of end)
      if (date.isAfter(start, 'day') && (date.isSame(end, 'day') || date.isBefore(end, 'day'))) {
        return trip;
      }
    }
    return null;
  };
  
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
            const dateTrips = tripsByStartDate[dateStr] || [];
            const hasTrips = dateTrips.length > 0;
            const tripInRange = dateInTripRange(date);
            const isInTripRange = !!tripInRange && !hasTrips; // Highlight if in range but not start date
            
            return (
              <div 
                key={index}
                className="flex flex-col items-center justify-center aspect-square"
              >
                {hasTrips ? (
                  // Show group avatar(s) when there are trips
                  <div
                    className={`
                      relative flex items-center justify-center w-9 h-9 rounded-full cursor-pointer transition-all duration-200
                      ${!isCurrentMonth ? 'opacity-40' : ''}
                      ${isToday ? 'ring-2 ring-blue-500 ring-offset-1' : ''}
                    `}
                    onClick={() => onDateClick?.(date, dateTrips)}
                  >
                    {dateTrips.length === 1 ? (
                      // Single trip - show full avatar
                      <img
                        src={dateTrips[0].conversationAvatar || 'https://via.placeholder.com/36'}
                        alt={dateTrips[0].conversationName || 'Group'}
                        className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-md cursor-pointer"
                        onMouseEnter={(e) => onTripHover?.(dateTrips[0], e.currentTarget)}
                        onMouseLeave={() => onTripLeave?.()}
                      />
                    ) : (
                      // Multiple trips - show stacked avatars
                      <div className="relative w-9 h-9">
                        {dateTrips.slice(0, 3).map((trip, idx) => (
                          <img
                            key={trip.tripId}
                            src={trip.conversationAvatar || 'https://via.placeholder.com/24'}
                            alt={trip.conversationName || 'Group'}
                            className={`
                              absolute w-6 h-6 rounded-full object-cover border-2 border-white shadow-md cursor-pointer
                              transition-transform hover:scale-110 hover:z-10
                            `}
                            style={{
                              left: `${idx * 6}px`,
                              top: `${idx * 3}px`,
                              zIndex: 3 - idx
                            }}
                            onMouseEnter={(e) => onTripHover?.(trip, e.currentTarget)}
                            onMouseLeave={() => onTripLeave?.()}
                          />
                        ))}
                        {dateTrips.length > 3 && (
                          <div 
                            className="absolute right-0 bottom-0 w-5 h-5 bg-blue-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-md"
                            style={{ zIndex: 4 }}
                          >
                            +{dateTrips.length - 3}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : isInTripRange ? (
                  // Date is within a trip's date range - show highlighted background
                  <div
                    className={`
                      relative flex items-center justify-center w-9 h-9 rounded-full cursor-pointer transition-all duration-200
                      ${!isCurrentMonth ? 'opacity-40' : ''}
                      ${isToday ? 'ring-2 ring-blue-500 ring-offset-1' : ''}
                      bg-blue-50 border-2 border-blue-200 hover:bg-blue-100
                    `}
                    onClick={() => onDateClick?.(date, [tripInRange])}
                    onMouseEnter={(e) => tripInRange && onTripHover?.(tripInRange, e.currentTarget)}
                    onMouseLeave={() => onTripLeave?.()}
                  >
                    <span className="text-sm font-medium text-blue-600">
                      {date.date()}
                    </span>
                  </div>
                ) : (
                  // No trips - show date number (original behavior)
                  <div
                    className={`
                      relative flex items-center justify-center w-9 h-9 rounded-full cursor-pointer transition-all duration-200
                      ${!isCurrentMonth ? 'text-gray-300' : isToday ? 'text-gray-700 hover:text-white' : 'text-gray-700 hover:bg-gray-50'}
                      ${isToday ? 'bg-blue-500 text-white shadow-md shadow-blue-200 hover:bg-blue-600' : ''}
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
                )}
              </div>
            );
          })}
       </div>
    </div>
  );
};

export default SimpleCalendar;
