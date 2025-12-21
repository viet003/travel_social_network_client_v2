import React from "react";
import { Icon } from "@iconify/react";
import { SimpleCalendar } from "../cards";

const RightSidebar: React.FC = () => {
  // Contact list
  const contacts = [
    {
      name: "Dinh Hong Son",
      avatar:
        "https://i.pinimg.com/736x/bc/bd/8c/bcbd8c3b68d48ee9774adb71e78b270d.jpg",
      status: "online",
    },
    {
      name: "Phong Vũ",
      avatar:
        "https://i.pinimg.com/736x/cc/73/4e/cc734e8dfce2b03614a7be2dc6934d54.jpg",
      status: "online",
    },
    {
      name: "Nguyễn Đức Minh",
      avatar:
        "https://i.pinimg.com/1200x/9f/2b/f9/9f2bf9418bf23ddafd13c3698043c05d.jpg",
      status: "online",
    },
    {
      name: "Huyền Nguyễn",
      avatar:
        "https://i.pinimg.com/736x/b8/0f/c3/b80fc30e2f5cfe684accd5aa80a5ff51.jpg",
      status: "offline",
    },
    {
      name: "Mạnh Nguyễn",
      avatar:
        "https://i.pinimg.com/736x/a9/73/a8/a973a8e11e9aa1f1be679ed1cb262140.jpg",
      lastSeen: "32 phút",
    },
    {
      name: "Trần Trung Kiên",
      avatar:
        "https://i.pinimg.com/564x/e3/9b/6d/e39b6d8f5b3e8f5a7c8e3c8f5b3e8f.jpg",
      lastSeen: "37 phút",
    },
    {
      name: "Thế Hiếu",
      avatar:
        "https://i.pinimg.com/564x/f4/a2/8c/f4a28c8f5b3e8f5a7c8e3c8f5b3e8f.jpg",
      status: "offline",
    },
    {
      name: "Nguyễn Quang Hệ",
      avatar:
        "https://i.pinimg.com/564x/b5/8e/3d/b58e3d8f5b3e8f5a7c8e3c8f5b3e8f.jpg",
      lastSeen: "1 giờ",
    },
    {
      name: "Văn Tuấn",
      avatar:
        "https://i.pinimg.com/564x/d6/c1/5f/d6c15f8f5b3e8f5a7c8e3c8f5b3e8f.jpg",
      status: "offline",
    },
  ];

  // Groups list
  const groups = [
    {
      name: "Travel Enthusiasts",
      avatar:
        "https://i.pinimg.com/564x/9e/2f/7a/9e2f7a5c8d3e4f6a7b8c9d0e1f2a3b4c.jpg",
      memberCount: "2.1k",
      isActive: true,
    },
    {
      name: "Food Lovers",
      avatar:
        "https://i.pinimg.com/564x/1a/3c/5e/1a3c5e7f9b2d4a6c8e0f1b3d5a7c9e2f.jpg",
      memberCount: "1.8k",
      isActive: false,
    },
    {
      name: "Tech Community",
      avatar:
        "https://i.pinimg.com/564x/2b/4d/6f/2b4d6f8a1c3e5a7c9e0f1b3d5a7c9e2f.jpg",
      memberCount: "3.2k",
      isActive: false,
    },
    {
      name: "Photography Club",
      avatar:
        "https://i.pinimg.com/564x/3c/5e/7f/3c5e7f9a1b3d5a7c9e0f1b3d5a7c9e2f.jpg",
      memberCount: "1.5k",
      isActive: false,
    },
    {
      name: "Fitness Group",
      avatar:
        "https://i.pinimg.com/564x/4d/6f/8a/4d6f8a1b2c3d4e5f6a7b8c9d0e1f2a3b.jpg",
      memberCount: "2.7k",
      isActive: false,
    },
    {
      name: "Book Club",
      avatar:
        "https://i.pinimg.com/564x/5e/7f/9a/5e7f9a1b2c3d4e5f6a7b8c9d0e1f2a3b.jpg",
      memberCount: "890",
      isActive: false,
    },
    {
      name: "Music Lovers",
      avatar:
        "https://i.pinimg.com/564x/6f/8a/1b/6f8a1b2c3d4e5f6a7b8c9d0e1f2a3b4c.jpg",
      memberCount: "4.1k",
      isActive: false,
    },
    {
      name: "Gaming Squad",
      avatar:
        "https://i.pinimg.com/564x/7a/9b/2c/7a9b2c3d4e5f6a7b8c9d0e1f2a3b4c5d.jpg",
      memberCount: "2.3k",
      isActive: false,
    },
  ];

  return (
    <div className="w-80 bg-white p-4 sticky top-0 h-[calc(100vh-60px)] overflow-y-auto">
      {/* Calendar Section */}
      <div className="mb-6">
        <h3 className="font-bold text-black mb-4">Lịch trình của bạn</h3>
        <SimpleCalendar
          events={{
            "2025-11-18": true,
            "2025-11-20": true,
            "2025-11-25": true,
          }}
          onDateClick={(date) => console.log(date.format("YYYY-MM-DD"))}
          eventColor="#1890ff"
        />
      </div>

      {/* Contacts Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-black">Người liên hệ</h3>
          <div className="flex items-center space-x-2">
            <button className="p-1 hover:bg-gray-100 rounded cursor-pointer">
              <Icon
                icon="fluent:search-24-filled"
                className="w-5 h-5 text-black"
              />
            </button>
            <button className="p-1 hover:bg-gray-100 rounded cursor-pointer">
              <Icon
                icon="fluent:more-vertical-24-filled"
                className="w-5 h-5 text-black"
              />
            </button>
          </div>
        </div>

        {/* Contact List */}
        <div className="space-y-1">
          {contacts.map((contact, index) => (
            <div
              key={index}
              className="flex items-center p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                  <img
                    src={contact.avatar}
                    alt={contact.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `<span class="text-white font-semibold text-sm bg-blue-500 w-full h-full flex items-center justify-center">${contact.name.charAt(
                          0
                        )}</span>`;
                      }
                    }}
                  />
                </div>
                {contact.status === "online" && (
                  <div className="absolute -bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center">
                  <span className="text-sm font-semibold text-black">
                    {contact.name}
                  </span>
                  {/* {contact.hasCheck && (
                    <span className="ml-1 text-blue-500 text-xs">✓</span>
                  )} */}
                </div>
                {contact.lastSeen && (
                  <span className="text-xs text-gray-500">
                    {contact.lastSeen}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Groups Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-black">Nhóm</h3>
          <div className="flex items-center space-x-2">
            <button className="p-1 hover:bg-gray-100 rounded cursor-pointer">
              <Icon
                icon="fluent:search-24-filled"
                className="w-5 h-5 text-black"
              />
            </button>
            <button className="p-1 hover:bg-gray-100 rounded cursor-pointer">
              <Icon
                icon="fluent:more-vertical-24-filled"
                className="w-5 h-5 text-black"
              />
            </button>
          </div>
        </div>

        {/* Groups List */}
        <div className="space-y-1">
          {groups.map((group, index) => (
            <div
              key={index}
              className={`flex items-center p-2 rounded-lg cursor-pointer transition-colors ${
                group.isActive ? "bg-blue-50" : "hover:bg-gray-100"
              }`}
            >
              <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                <img
                  src={group.avatar}
                  alt={group.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `<span class="text-white font-semibold text-xs bg-blue-500 w-full h-full flex items-center justify-center">${group.name.charAt(
                        0
                      )}</span>`;
                    }
                  }}
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-sm font-medium ${
                      group.isActive ? "text-blue-600" : "text-black"
                    }`}
                  >
                    {group.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {group.memberCount}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Action Button */}
      <button className="fixed bottom-4 right-4 w-12 h-12 bg-white hover:bg-gray-100 text-black shadow-lg hover:shadow-2xl rounded-full flex items-center justify-center transition-all duration-300 z-50 cursor-pointer border border-gray-200">
        <Icon
          icon="fluent:magic-wand-16-filled"
          className="w-6 h-6 text-black"
        />
      </button>
    </div>
  );
};

export default RightSidebar;
