import React from 'react';
import { Calendar } from 'antd';
import type { Dayjs } from 'dayjs';

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
  const cellRender = (current: Dayjs, info: { type: string; originNode: React.ReactNode }) => {
    if (info.type !== 'date') return info.originNode;
    
    const dateStr = current.format('YYYY-MM-DD');
    const hasEvent = !!events[dateStr];
    
    return (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          background: hasEvent ? eventColor : 'transparent',
          color: hasEvent ? '#fff' : '#222',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto',
          fontWeight: 500,
          transition: 'background 0.2s',
          cursor: onDateClick ? 'pointer' : 'default',
        }}
        onClick={() => onDateClick?.(current)}
      >
        {current.date()}
      </div>
    );
  };

  return (
    <div className="simple-calendar-container">
      <Calendar 
        fullscreen={false} 
        cellRender={cellRender}
      />
    </div>
  );
};

export default SimpleCalendar;
