import React from 'react';
import { Tooltip } from 'antd';
import type { TooltipProps } from 'antd';

interface TravelTooltipProps extends Omit<TooltipProps, 'overlayClassName'> {
  title: string;
  children: React.ReactNode;
}

const TravelTooltip: React.FC<TravelTooltipProps> = ({ title, children, ...props }) => {
  return (
    <Tooltip
      title={title}
      overlayClassName="travel-tooltip"
      overlayStyle={{
        fontSize: '12px',
        borderRadius: '8px',
        padding: '4px 8px',
        maxWidth: '200px'
      }}
      {...props}
    >
      {children}
    </Tooltip>
  );
};

export default TravelTooltip;
