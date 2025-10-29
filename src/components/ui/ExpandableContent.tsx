import React, { useEffect, useRef, useState } from 'react';
import '../../styles/expandable-content.css';

interface ExpandableContentProps {
  content: string;
  maxLines?: number;
  className?: string;
}

const ExpandableContent: React.FC<ExpandableContentProps> = ({
  content,
  maxLines = 3,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [needsExpansion, setNeedsExpansion] = useState<boolean>(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Check if content needs "See more" button
  useEffect(() => {
    if (contentRef.current) {
      const lineHeight = parseInt(window.getComputedStyle(contentRef.current).lineHeight);
      const maxHeight = lineHeight * maxLines;
      setNeedsExpansion(contentRef.current.scrollHeight > maxHeight);
    }
  }, [content, maxLines]);

  return (
    <div className={`mb-3 ${className}`}>
      <div 
        ref={contentRef}
        className={`expandable-content text-gray-700 transition-all duration-300 overflow-hidden ${
          !isExpanded && needsExpansion ? `line-clamp-${maxLines}` : ''
        }`}
        dangerouslySetInnerHTML={{ __html: content }}
        style={{
          wordBreak: 'break-word',
          whiteSpace: 'pre-wrap',
          ...((!isExpanded && needsExpansion) ? {
            display: '-webkit-box',
            WebkitLineClamp: maxLines,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          } : {})
        }}
      />
      {needsExpansion && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-1 cursor-pointer hover:underline text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors focus:outline-none"
        >
          {isExpanded ? 'Thu gọn' : 'Xem thêm'}
        </button>
      )}
    </div>
  );
};

export default ExpandableContent;
