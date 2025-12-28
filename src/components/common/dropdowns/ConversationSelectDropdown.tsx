import React, { useState, useRef, useEffect } from 'react';
import { Icon } from '@iconify/react';
import avatarDefault from '../../../assets/images/avatar_default.png';
import { formatTimeAgo } from '../../../utilities/helper';

interface ConversationOption {
  conversationId: string;
  conversationName: string;
  conversationAvatar: string | null;
  lastActive?: string;
}

interface ConversationSelectDropdownProps {
  value: string;
  onChange: (conversationId: string) => void;
  options: ConversationOption[];
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  loading?: boolean;
}

const ConversationSelectDropdown: React.FC<ConversationSelectDropdownProps> = ({
  value,
  onChange,
  options,
  placeholder = 'Chọn nhóm chat',
  disabled = false,
  error = false,
  loading = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedConversation = options.find(opt => opt.conversationId === value);

  // Filter options based on search query
  const filteredOptions = options.filter(option =>
    option.conversationName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Focus search input when dropdown opens
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (conversationId: string) => {
    onChange(conversationId);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div ref={dropdownRef} className="relative w-full">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => !disabled && !loading && setIsOpen(!isOpen)}
        disabled={disabled || loading}
        className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-left flex items-center justify-between transition-colors ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${
          disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : 'hover:border-gray-400 cursor-pointer'
        } ${isOpen ? 'border-blue-500 ring-2 ring-blue-200' : ''}`}
      >
        {loading ? (
          <div className="flex items-center gap-2 text-gray-500">
            <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
            <span className="text-sm">Đang tải...</span>
          </div>
        ) : selectedConversation ? (
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <img
              src={selectedConversation.conversationAvatar || avatarDefault}
              alt={selectedConversation.conversationName}
              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {selectedConversation.conversationName}
              </p>
              {selectedConversation.lastActive && (
                <p className="text-xs text-gray-500">
                  Hoạt động {formatTimeAgo(selectedConversation.lastActive)}
                </p>
              )}
            </div>
          </div>
        ) : (
          <span className="text-sm text-gray-500">{placeholder}</span>
        )}
        
        <Icon
          icon={isOpen ? "fluent:chevron-up-24-filled" : "fluent:chevron-down-24-filled"}
          className={`w-5 h-5 text-gray-500 flex-shrink-0 ml-2 transition-transform ${
            disabled ? 'opacity-50' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && !disabled && !loading && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-80 overflow-hidden flex flex-col">
          {/* Search Input */}
          <div className="p-3 border-b border-gray-200 sticky top-0 bg-white">
            <div className="relative">
              <Icon
                icon="fluent:search-24-regular"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm nhóm chat..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onClick={(e) => e.stopPropagation()}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <Icon icon="fluent:dismiss-circle-24-filled" className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Options List */}
          <div className="overflow-y-auto flex-1">
            {filteredOptions.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                {searchQuery ? (
                  <>
                    <Icon icon="fluent:search-info-24-regular" className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p>Không tìm thấy nhóm "{searchQuery}"</p>
                  </>
                ) : (
                  <>
                    <Icon icon="fluent:chat-empty-24-regular" className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p>Không có nhóm chat nào</p>
                  </>
                )}
              </div>
            ) : (
              <div className="py-1">
                {filteredOptions.map((option) => (
                  <button
                    key={option.conversationId}
                    type="button"
                    onClick={() => handleSelect(option.conversationId)}
                    className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors cursor-pointer ${
                      value === option.conversationId ? 'bg-blue-50' : ''
                    }`}
                  >
                    <img
                      src={option.conversationAvatar || avatarDefault}
                      alt={option.conversationName}
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0 text-left">
                      <p className={`text-sm font-medium truncate ${
                        value === option.conversationId ? 'text-blue-600' : 'text-gray-900'
                      }`}>
                        {option.conversationName}
                      </p>
                      {option.lastActive && (
                        <p className="text-xs text-gray-500">
                          Hoạt động {formatTimeAgo(option.lastActive)}
                        </p>
                      )}
                    </div>
                    {value === option.conversationId && (
                      <Icon
                        icon="fluent:checkmark-circle-24-filled"
                        className="w-5 h-5 text-blue-600 flex-shrink-0"
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversationSelectDropdown;
