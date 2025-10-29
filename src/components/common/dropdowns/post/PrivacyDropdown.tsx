import React, { useState, useRef, useEffect } from 'react';
import { Icon } from '@iconify/react';

interface PrivacyOption {
  value: string;
  label: string;
  icon: () => React.ReactElement;
  description: string;
}

interface PrivacyDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: PrivacyOption[];
}

const PrivacyDropdown: React.FC<PrivacyDropdownProps> = ({
  value,
  onChange,
  options
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currentOption = options.find(opt => opt.value === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };
  
  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2 sm:px-3 py-1.5 pr-6 sm:pr-8 text-xs sm:text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-full cursor-pointer hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      >
        <span className="flex items-center gap-1.5">
          {currentOption?.icon && (
            <span className="flex-shrink-0">
              {currentOption.icon()}
            </span>
          )}
          <span>{currentOption?.label}</span>
        </span>
      </button>

      {/* Dropdown Icon */}
      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
        <Icon 
          icon={isOpen ? "mingcute:up-line" : "mingcute:down-line"} 
          className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 transition-transform" 
        />
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-start gap-3 ${
                value === option.value ? 'bg-blue-50' : ''
              }`}
            >
              {/* Icon */}
              <div className="flex-shrink-0 mt-0.5">
                {option.icon()}
              </div>
              
              {/* Label and Description */}
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-medium ${
                  value === option.value ? 'text-blue-600' : 'text-gray-900'
                }`}>
                  {option.label}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {option.description}
                </div>
              </div>

              {/* Checkmark for selected item */}
              {value === option.value && (
                <div className="flex-shrink-0">
                  <Icon icon="mingcute:check-fill" className="w-5 h-5 text-blue-600" />
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PrivacyDropdown;
