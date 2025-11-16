import { useState, useRef } from "react";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import { path } from "../../../utilities/path";
import { subLogo } from "../../../assets/images";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const TravelGuideStatic = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const swiperRef = useRef<SwiperType | null>(null);

  const sections = [
    { id: "overview", title: "Tổng quan", icon: "fluent:globe-24-filled" },
    { id: "planning", title: "Lên kế hoạch", icon: "fluent:calendar-24-filled" },
    { id: "budget", title: "Ngân sách", icon: "fluent:wallet-24-filled" },
    { id: "packing", title: "Hành lý", icon: "fluent:luggage-24-filled" },
    { id: "safety", title: "An toàn", icon: "fluent:shield-24-filled" },
    { id: "photography", title: "Nhiếp ảnh", icon: "fluent:camera-24-filled" },
    { id: "food", title: "Ẩm thực", icon: "fluent:food-24-filled" },
    { id: "culture", title: "Văn hóa", icon: "fluent:people-24-filled" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Cẩm nang Du lịch
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Hướng dẫn chi tiết từ A đến Z để bạn có chuyến du lịch hoàn hảo. Khám phá, lên kế hoạch và trải nghiệm những chuyến đi đáng nhớ.
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-gray-50 py-6 px-4 mb-12">
        <div className="max-w-7xl mx-auto relative px-20">
          <Swiper
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            modules={[Navigation, Pagination]}
            navigation={false}
            spaceBetween={12}
            slidesPerView="auto"
            className="guides-navigation-swiper"
          >
            {sections.map((section) => (
              <SwiperSlide key={section.id} style={{ width: 'auto' }}>
                <button
                  onClick={() => setActiveSection(section.id)}
                  className={`flex cursor-pointer items-center space-x-2 px-6 py-3 rounded-lg whitespace-nowrap transition-all font-medium ${
                    activeSection === section.id
                      ? "bg-gray-900 text-white shadow-lg"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  <Icon icon={section.icon} className="h-5 w-5" />
                  <span>{section.title}</span>
                </button>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons */}
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            className="absolute left-0 top-1/2 -translate-y-1/2 p-2 text-white transition-all duration-200 bg-gray-900 bg-opacity-80 rounded-full hover:bg-opacity-100 hover:scale-110 cursor-pointer active:scale-95 z-10 shadow-lg"
          >
            <Icon icon="fluent:chevron-left-20-filled" className="w-5 h-5" />
          </button>

          <button
            onClick={() => swiperRef.current?.slideNext()}
            className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-white transition-all duration-200 bg-gray-900 bg-opacity-80 rounded-full hover:bg-opacity-100 hover:scale-110 cursor-pointer active:scale-95 z-10 shadow-lg"
          >
            <Icon icon="fluent:chevron-right-20-filled" className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div>
        {/* Overview Section */}
        {activeSection === "overview" && (
          <div className="py-12 px-4">
            <div className="max-w-7xl mx-auto space-y-20">
              {/* First Content Block */}
              <div className="flex flex-col lg:flex-row items-center gap-12">
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-4">KHÁM PHÁ THẾ GIỚI</p>
                  <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                    Tại sao nên du lịch?
                  </h2>
                  <p className="text-md text-gray-700 leading-relaxed">
                    Du lịch không chỉ đơn thuần là việc di chuyển từ nơi này sang nơi khác, mà là một hành trình khám phá, trải nghiệm và học hỏi. Mỗi chuyến đi là một cơ hội để bạn mở rộng tầm nhìn, kết nối với văn hóa mới và tạo ra những kỷ niệm đáng nhớ.
                  </p>
                </div>
                <div className="flex-1 flex justify-center lg:justify-end w-full">
                  <img 
                    src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80" 
                    alt="Why Travel"
                    className="w-full max-w-md sm:max-w-lg lg:max-w-2xl h-auto rounded-2xl shadow-lg"
                  />
                </div>
              </div>

              {/* Second Content Block */}
              <div className="flex flex-col lg:flex-row items-center gap-12 bg-gray-50 rounded-3xl p-8 lg:p-12">
                <div className="flex-1 flex justify-center lg:justify-start order-2 lg:order-1 w-full">
                  <img 
                    src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80" 
                    alt="Travel Guide"
                    className="w-full max-w-md sm:max-w-lg lg:max-w-2xl h-auto rounded-2xl shadow-lg"
                  />
                </div>
                <div className="flex-1 order-1 lg:order-2">
                  <p className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-4">CẨM NANG TOÀN DIỆN</p>
                  <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                    Được biên soạn từ kinh nghiệm thực tế
                  </h2>
                  <p className="text-md text-gray-700 leading-relaxed">
                    Cẩm nang này được biên soạn dựa trên kinh nghiệm thực tế của hàng nghìn du khách, kết hợp với lời khuyên từ các chuyên gia du lịch. Chúng tôi hi vọng sẽ giúp bạn chuẩn bị tốt nhất cho chuyến đi của mình.
                  </p>
                </div>
              </div>

              {/* Stats Section */}
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-lg transition-shadow">
                  <Icon icon="fluent:globe-24-filled" className="h-16 w-16 mx-auto mb-4 text-gray-900" />
                  <h3 className="text-4xl font-bold text-gray-900 mb-2">195+</h3>
                  <p className="text-gray-600">Quốc gia để khám phá</p>
                </div>
                <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-lg transition-shadow">
                  <Icon icon="fluent:people-24-filled" className="h-16 w-16 mx-auto mb-4 text-gray-900" />
                  <h3 className="text-4xl font-bold text-gray-900 mb-2">1000+</h3>
                  <p className="text-gray-600">Kinh nghiệm chia sẻ</p>
                </div>
                <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-lg transition-shadow">
                  <Icon icon="fluent:star-24-filled" className="h-16 w-16 mx-auto mb-4 text-gray-900" />
                  <h3 className="text-4xl font-bold text-gray-900 mb-2">10K+</h3>
                  <p className="text-gray-600">Chuyến đi thành công</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Planning Section */}
        {activeSection === "planning" && (
          <div className="py-12 px-4">
            <div className="max-w-7xl mx-auto">
              {/* Section Header */}
              <div className="relative rounded-3xl overflow-hidden mb-16">
                <div className="absolute inset-0">
                  <img 
                    src="https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=1200&q=80" 
                    alt="Planning"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-gray-900/40"></div>
                </div>
                <div className="relative text-center py-20 px-4">
                  <p className="text-sm font-bold text-gray-200 uppercase tracking-wider mb-4">LÊN KẾ HOẠCH</p>
                  <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">Chuẩn bị chi tiết cho chuyến đi hoàn hảo</h2>
                  <p className="text-lg text-gray-200 max-w-3xl mx-auto">Lên kế hoạch kỹ lưỡng giúp bạn tận hưởng chuyến đi tốt nhất</p>
                </div>
              </div>

              <div className="space-y-20">
                {/* Step 1 */}
                <div className="flex flex-col lg:flex-row items-center gap-12">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">1. Chọn điểm đến</h3>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      Bước đầu tiên và quan trọng nhất là xác định nơi bạn muốn đến. Hãy cân nhắc các yếu tố như thời tiết, mùa du lịch, văn hóa địa phương.
                    </p>
                    <div className="bg-green-50 rounded-xl p-4">
                      <p className="text-sm text-gray-700">
                        <strong>Mẹo:</strong> Tránh mùa cao điểm để tiết kiệm chi phí. Tháng 4-5 và 9-10 thường là thời điểm tốt.
                      </p>
                    </div>
                  </div>
                  <div className="rounded-2xl overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&q=80" 
                      alt="Choose Destination"
                      className="w-full h-full object-cover"
                    />
                  </div>    
                </div>

                {/* Step 2 */}
                <div className="bg-gray-50 rounded-3xl p-8 lg:p-12">
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">2. Xác định thời gian và độ dài chuyến đi</h3>
                  <p className="text-md text-gray-700 leading-relaxed mb-6">
                    Quyết định bạn có bao nhiêu ngày cho chuyến đi. Đối với chuyến đi nội địa, 3-5 ngày là lý tưởng. Chuyến đi quốc tế nên dành ít nhất 7-10 ngày để có trải nghiệm trọn vẹn.
                  </p>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                      <h4 className="font-bold text-gray-900 mb-2">Cuối tuần (2-3 ngày)</h4>
                      <p className="text-sm text-gray-600">Thích hợp cho các điểm đến gần, nghỉ ngơi thư giãn</p>
                    </div>
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                      <h4 className="font-bold text-gray-900 mb-2">Tuần lễ (5-7 ngày)</h4>
                      <p className="text-sm text-gray-600">Khám phá một vùng miền, nhiều địa điểm</p>
                    </div>
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                      <h4 className="font-bold text-gray-900 mb-2">Dài ngày (10+ ngày)</h4>
                      <p className="text-sm text-gray-600">Du lịch nước ngoài, trải nghiệm sâu</p>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">3. Lập lịch trình chi tiết</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Tạo một lịch trình cơ bản cho mỗi ngày, nhưng vẫn giữ sự linh hoạt. Đừng lên kế hoạch quá chật chội - hãy để thời gian cho những trải nghiệm bất ngờ.
                  </p>
                  <div className="bg-purple-50 rounded-xl p-4 space-y-3">
                    <div className="flex items-start space-x-4">
                      <div className="bg-gray-900 text-white rounded-lg w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">1</div>
                      <div>
                        <p className="font-semibold text-gray-900 mb-1">Sáng (6:00-12:00)</p>
                        <p className="text-sm text-gray-600">Tham quan điểm đến chính, tận dụng ánh sáng đẹp</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="bg-gray-900 text-white rounded-lg w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">2</div>
                      <div>
                        <p className="font-semibold text-gray-900 mb-1">Trưa (12:00-14:00)</p>
                        <p className="text-sm text-gray-600">Thưởng thức ẩm thực địa phương, nghỉ ngơi</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="bg-gray-900 text-white rounded-lg w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">3</div>
                      <div>
                        <p className="font-semibold text-gray-900 mb-1">Chiều (14:00-18:00)</p>
                        <p className="text-sm text-gray-600">Khám phá địa điểm phụ, mua sắm, trải nghiệm</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="bg-gray-900 text-white rounded-lg w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">4</div>
                      <div>
                        <p className="font-semibold text-gray-900 mb-1">Tối (18:00-22:00)</p>
                        <p className="text-sm text-gray-600">Tận hưởng cuộc sống về đêm, văn hóa giải trí</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="bg-gray-50 rounded-3xl p-8 lg:p-12">
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">4. Đặt chỗ trước</h3>
                  <p className="text-md text-gray-700 leading-relaxed mb-6">
                    Đặt vé máy bay, khách sạn và các tour quan trọng trước ít nhất 2-3 tháng để có giá tốt nhất. Đối với mùa cao điểm, nên đặt trước 4-6 tháng.
                  </p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                      <div className="flex items-center mb-2">
                        <Icon icon="fluent:airplane-24-filled" className="h-6 w-6 text-gray-900 mr-2" />
                        <h4 className="font-bold text-gray-900">Vé máy bay</h4>
                      </div>
                      <p className="text-sm text-gray-600">Đặt trước 2-3 tháng, theo dõi giá vé qua ứng dụng</p>
                    </div>
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                      <div className="flex items-center mb-2">
                        <Icon icon="fluent:building-24-filled" className="h-6 w-6 text-gray-900 mr-2" />
                        <h4 className="font-bold text-gray-900">Khách sạn</h4>
                      </div>
                      <p className="text-sm text-gray-600">Đặt sớm để có vị trí đẹp, có chính sách hủy linh hoạt</p>
                    </div>
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                      <div className="flex items-center mb-2">
                        <Icon icon="fluent:ticket-24-filled" className="h-6 w-6 text-gray-900 mr-2" />
                        <h4 className="font-bold text-gray-900">Vé tham quan</h4>
                      </div>
                      <p className="text-sm text-gray-600">Mua online để tránh xếp hàng, thường rẻ hơn mua tại chỗ</p>
                    </div>
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                      <div className="flex items-center mb-2">
                        <Icon icon="fluent:vehicle-car-24-filled" className="h-6 w-6 text-gray-900 mr-2" />
                        <h4 className="font-bold text-gray-900">Phương tiện</h4>
                      </div>
                      <p className="text-sm text-gray-600">Thuê xe trước nếu cần, so sánh giá nhiều nhà cung cấp</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Budget Section */}
        {activeSection === "budget" && (
          <div className="py-12 px-4">
            <div className="max-w-7xl mx-auto">
              {/* Section Header */}
              <div className="relative rounded-3xl overflow-hidden mb-16">
                <div className="absolute inset-0">
                  <img 
                    src="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=1200&q=80" 
                    alt="Budget"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-gray-900/40"></div>
                </div>
                <div className="relative text-center py-20 px-4">
                  <p className="text-sm font-bold text-gray-200 uppercase tracking-wider mb-4">QUẢN LÝ NGÂN SÁCH</p>
                  <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">Tiết kiệm thông minh, trải nghiệm tối đa</h2>
                  <p className="text-lg text-gray-200 max-w-3xl mx-auto">Lập ngân sách hợp lý giúp bạn tận hưởng chuyến đi mà không lo về tài chính</p>
                </div>
              </div>

              <div className="space-y-20">
                {/* Budget Allocation */}
                <div className="bg-gray-50 rounded-3xl p-8 lg:p-12">
                  <div className="flex items-center mb-6">
                    <Icon icon="fluent:data-pie-24-filled" className="h-10 w-10 text-gray-900 mr-3" />
                    <h3 className="text-3xl font-bold text-gray-900">Phân bổ ngân sách hợp lý</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200">
                      <div className="flex items-center">
                        <Icon icon="fluent:airplane-24-filled" className="h-5 w-5 text-gray-900 mr-2" />
                        <span className="font-medium text-gray-900">Di chuyển (Vé, xe)</span>
                      </div>
                      <span className="font-bold text-gray-900">30-35%</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200">
                      <div className="flex items-center">
                        <Icon icon="fluent:building-24-filled" className="h-5 w-5 text-gray-900 mr-2" />
                        <span className="font-medium text-gray-900">Lưu trú (Khách sạn)</span>
                      </div>
                      <span className="font-bold text-gray-900">25-30%</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200">
                      <div className="flex items-center">
                        <Icon icon="fluent:food-24-filled" className="h-5 w-5 text-gray-900 mr-2" />
                        <span className="font-medium text-gray-900">Ăn uống</span>
                      </div>
                      <span className="font-bold text-gray-900">20-25%</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200">
                      <div className="flex items-center">
                        <Icon icon="fluent:ticket-24-filled" className="h-5 w-5 text-gray-900 mr-2" />
                        <span className="font-medium text-gray-900">Tham quan & Giải trí</span>
                      </div>
                      <span className="font-bold text-gray-900">15-20%</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200">
                      <div className="flex items-center">
                        <Icon icon="fluent:savings-24-filled" className="h-5 w-5 text-gray-900 mr-2" />
                        <span className="font-medium text-gray-900">Dự phòng</span>
                      </div>
                      <span className="font-bold text-gray-900">10-15%</span>
                    </div>
                  </div>
                </div>

                {/* Saving Tips */}
                <div>
                  <div className="flex items-center mb-6">
                    <Icon icon="fluent:money-hand-24-filled" className="h-10 w-10 text-gray-900 mr-3" />
                    <h3 className="text-3xl font-bold text-gray-900">10 Mẹo tiết kiệm chi phí</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-start space-x-3 p-4 bg-white rounded-xl border border-gray-200">
                      <div className="bg-gray-900 text-white rounded-lg w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">1</div>
                      <div>
                        <p className="font-semibold text-gray-900">Đặt vé máy bay vào thứ 3 hoặc thứ 4</p>
                        <p className="text-sm text-gray-600">Giá vé thường rẻ hơn 15-20% so với cuối tuần</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-4 bg-white rounded-xl border border-gray-200">
                      <div className="bg-gray-900 text-white rounded-lg w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">2</div>
                      <div>
                        <p className="font-semibold text-gray-900">Sử dụng thẻ tín dụng có hoàn tiền</p>
                        <p className="text-sm text-gray-600">Tích lũy điểm thưởng và nhận cashback 1-5%</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-4 bg-white rounded-xl border border-gray-200">
                      <div className="bg-gray-900 text-white rounded-lg w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">3</div>
                      <div>
                        <p className="font-semibold text-gray-900">Ăn tại quán ăn địa phương</p>
                        <p className="text-sm text-gray-600">Tiết kiệm 40-60% so với nhà hàng du lịch, món ăn ngon hơn</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-4 bg-white rounded-xl border border-gray-200">
                      <div className="bg-gray-900 text-white rounded-lg w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">4</div>
                      <div>
                        <p className="font-semibold text-gray-900">Mua vé tham quan combo</p>
                        <p className="text-sm text-gray-600">Tiết kiệm 20-30% khi mua gói nhiều điểm tham quan</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-4 bg-white rounded-xl border border-gray-200">
                      <div className="bg-gray-900 text-white rounded-lg w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">5</div>
                      <div>
                        <p className="font-semibold text-gray-900">Sử dụng phương tiện công cộng</p>
                        <p className="text-sm text-gray-600">Rẻ hơn taxi 70-80%, trải nghiệm như người địa phương</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-4 bg-white rounded-xl border border-gray-200">
                      <div className="bg-gray-900 text-white rounded-lg w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">6</div>
                      <div>
                        <p className="font-semibold text-gray-900">Đặt khách sạn có bữa sáng</p>
                        <p className="text-sm text-gray-600">Tiết kiệm chi phí ăn sáng, thường chất lượng tốt</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-4 bg-white rounded-xl border border-gray-200">
                      <div className="bg-gray-900 text-white rounded-lg w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">7</div>
                      <div>
                        <p className="font-semibold text-gray-900">Mang theo bình nước cá nhân</p>
                        <p className="text-sm text-gray-600">Tiết kiệm 5-10 USD/ngày, thân thiện môi trường</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-4 bg-white rounded-xl border border-gray-200">
                      <div className="bg-gray-900 text-white rounded-lg w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">8</div>
                      <div>
                        <p className="font-semibold text-gray-900">Tham gia free walking tour</p>
                        <p className="text-sm text-gray-600">Miễn phí hoặc tip tùy ý, hiểu sâu về văn hóa địa phương</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-4 bg-white rounded-xl border border-gray-200">
                      <div className="bg-gray-900 text-white rounded-lg w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">9</div>
                      <div>
                        <p className="font-semibold text-gray-900">Mua SIM du lịch hoặc eSIM</p>
                        <p className="text-sm text-gray-600">Rẻ hơn 90% so với roaming quốc tế</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-4 bg-white rounded-xl border border-gray-200">
                      <div className="bg-gray-900 text-white rounded-lg w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">10</div>
                      <div>
                        <p className="font-semibold text-gray-900">Du lịch theo nhóm</p>
                        <p className="text-sm text-gray-600">Chia sẻ chi phí xe, khách sạn, giảm 30-40%/người</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expert Advice */}
                <div className="flex flex-col lg:flex-row items-center gap-12 bg-gray-50 rounded-3xl p-8 lg:p-12">
                  <div className="flex-1 flex justify-center lg:justify-start order-2 lg:order-1 w-full">
                    <img 
                      src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80" 
                      alt="Travel Budget Planning"
                      className="w-full max-w-md sm:max-w-lg lg:max-w-2xl h-auto rounded-2xl shadow-lg"
                    />
                  </div>
                  <div className="flex-1 order-1 lg:order-2">
                    <div className="flex items-center mb-4">
                      <Icon icon="fluent:lightbulb-24-filled" className="h-10 w-10 text-gray-900 mr-3" />
                      <h3 className="text-3xl font-bold text-gray-900">Lời khuyên từ chuyên gia</h3>
                    </div>
                    <p className="text-md text-gray-700 leading-relaxed">
                      Hãy luôn dự trù thêm 15-20% ngân sách cho các chi phí phát sinh. Sử dụng app quản lý chi tiêu để theo dõi từng khoản chi. Đừng quá tiết kiệm đến mức làm giảm trải nghiệm - hãy cân bằng giữa tiết kiệm và tận hưởng chuyến đi!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Packing Section */}
        {activeSection === "packing" && (
          <div className="py-12 px-4">
            <div className="max-w-7xl mx-auto">
              {/* Section Header */}
              <div className="relative rounded-3xl overflow-hidden mb-16">
                <div className="absolute inset-0">
                  <img 
                    src="https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=1200&q=80" 
                    alt="Packing"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-gray-900/40"></div>
                </div>
                <div className="relative text-center py-20 px-4">
                  <p className="text-sm font-bold text-gray-200 uppercase tracking-wider mb-4">CHUẨN BỊ HÀNH LÝ</p>
                  <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">Đi nhẹ, về nhẹ - Quy tắc vàng</h2>
                  <p className="text-lg text-gray-200 max-w-3xl mx-auto">Xếp hành lý thông minh giúp bạn di chuyển dễ dàng hơn</p>
                </div>
              </div>

              <div className="space-y-20">
                {/* Golden Rule */}
                <div className="bg-gray-50 rounded-3xl p-8 lg:p-12">
                  <div className="flex items-center mb-6">
                    <Icon icon="fluent:luggage-24-filled" className="h-10 w-10 text-gray-900 mr-3" />
                    <h3 className="text-3xl font-bold text-gray-900">Nguyên tắc vàng: 5-4-3-2-1</h3>
                  </div>
                  <p className="text-md text-gray-700 leading-relaxed">
                    5 bộ đồ, 4 đôi giày dép, 3 đồ lót, 2 phụ kiện, 1 bộ đồ dự phòng. Mang theo những món đồ có thể mix-match linh hoạt để giảm khối lượng hành lý.
                  </p>
                </div>

                {/* Essential vs Avoid */}
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <div className="flex items-center mb-6">
                      <Icon icon="fluent:checkmark-circle-24-filled" className="h-8 w-8 text-gray-900 mr-3" />
                      <h3 className="text-2xl font-bold text-gray-900">Đồ cần thiết</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3 p-4 bg-white rounded-xl border border-gray-200">
                        <Icon icon="fluent:document-24-filled" className="h-6 w-6 text-gray-900 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-gray-900">Giấy tờ</p>
                          <p className="text-sm text-gray-600">Hộ chiếu, CMND, visa, bảo hiểm du lịch</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3 p-4 bg-white rounded-xl border border-gray-200">
                        <Icon icon="fluent:money-24-filled" className="h-6 w-6 text-gray-900 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-gray-900">Tiền bạc</p>
                          <p className="text-sm text-gray-600">Tiền mặt, thẻ tín dụng, ví điện tử</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3 p-4 bg-white rounded-xl border border-gray-200">
                        <Icon icon="fluent:phone-24-filled" className="h-6 w-6 text-gray-900 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-gray-900">Điện tử</p>
                          <p className="text-sm text-gray-600">Điện thoại, sạc dự phòng, adapter</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3 p-4 bg-white rounded-xl border border-gray-200">
                        <Icon icon="fluent:heart-pulse-24-filled" className="h-6 w-6 text-gray-900 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-gray-900">Y tế</p>
                          <p className="text-sm text-gray-600">Thuốc cá nhân, khẩu trang, băng cứu thương</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center mb-6">
                      <Icon icon="fluent:dismiss-circle-24-filled" className="h-8 w-8 text-gray-900 mr-3" />
                      <h3 className="text-2xl font-bold text-gray-900">Đồ nên tránh</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <Icon icon="fluent:warning-24-filled" className="h-6 w-6 text-gray-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-gray-900">Đồ trang sức quý</p>
                          <p className="text-sm text-gray-600">Dễ thất lạc, thu hút trộm cắp</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <Icon icon="fluent:warning-24-filled" className="h-6 w-6 text-gray-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-gray-900">Quần áo dự trữ quá nhiều</p>
                          <p className="text-sm text-gray-600">Có thể giặt hoặc mua thêm tại đích</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <Icon icon="fluent:warning-24-filled" className="h-6 w-6 text-gray-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-gray-900">Mỹ phẩm full size</p>
                          <p className="text-sm text-gray-600">Chiếm nhiều chỗ, dùng chai du lịch</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <Icon icon="fluent:warning-24-filled" className="h-6 w-6 text-gray-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-gray-900">Laptop nặng</p>
                          <p className="text-sm text-gray-600">Dùng tablet/điện thoại nếu không làm việc</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Packing Techniques */}
                <div>
                  <div className="flex items-center mb-6">
                    <Icon icon="fluent:box-24-filled" className="h-10 w-10 text-gray-900 mr-3" />
                    <h3 className="text-3xl font-bold text-gray-900">Kỹ thuật xếp hành lý</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-6 bg-white rounded-xl border border-gray-200">
                      <div className="flex items-center mb-3">
                        <div className="bg-gray-900 text-white rounded-lg w-8 h-8 flex items-center justify-center font-bold mr-3">1</div>
                        <h4 className="font-semibold text-gray-900">Phương pháp cuộn</h4>
                      </div>
                      <p className="text-sm text-gray-600">Cuộn quần áo thay vì gấp giúp tiết kiệm 30% không gian</p>
                    </div>
                    <div className="p-6 bg-white rounded-xl border border-gray-200">
                      <div className="flex items-center mb-3">
                        <div className="bg-gray-900 text-white rounded-lg w-8 h-8 flex items-center justify-center font-bold mr-3">2</div>
                        <h4 className="font-semibold text-gray-900">Túi nén chân không</h4>
                      </div>
                      <p className="text-sm text-gray-600">Giảm 50% thể tích quần áo dày, lý tưởng cho áo khoác</p>
                    </div>
                    <div className="p-6 bg-white rounded-xl border border-gray-200">
                      <div className="flex items-center mb-3">
                        <div className="bg-gray-900 text-white rounded-lg w-8 h-8 flex items-center justify-center font-bold mr-3">3</div>
                        <h4 className="font-semibold text-gray-900">Tận dụng không gian giày</h4>
                      </div>
                      <p className="text-sm text-gray-600">Nhồi vớ và đồ nhỏ vào giày để tiết kiệm chỗ</p>
                    </div>
                    <div className="p-6 bg-white rounded-xl border border-gray-200">
                      <div className="flex items-center mb-3">
                        <div className="bg-gray-900 text-white rounded-lg w-8 h-8 flex items-center justify-center font-bold mr-3">4</div>
                        <h4 className="font-semibold text-gray-900">Packing cubes</h4>
                      </div>
                      <p className="text-sm text-gray-600">Phân loại đồ theo ngày hoặc loại, dễ tìm kiếm</p>
                    </div>
                  </div>
                </div>

                {/* Pro Tips */}
                <div className="flex flex-col lg:flex-row items-center gap-12 bg-gray-50 rounded-3xl p-8 lg:p-12">
                  <div className="flex-1 flex justify-center lg:justify-start order-2 lg:order-1 w-full">
                    <img 
                      src="https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=800&q=80" 
                      alt="Packing Tips"
                      className="w-full max-w-md sm:max-w-lg lg:max-w-2xl h-auto rounded-2xl shadow-lg"
                    />
                  </div>
                  <div className="flex-1 order-1 lg:order-2">
                    <div className="flex items-center mb-4">
                      <Icon icon="fluent:lightbulb-24-filled" className="h-10 w-10 text-gray-900 mr-3" />
                      <h3 className="text-3xl font-bold text-gray-900">Mẹo từ chuyên gia</h3>
                    </div>
                    <div className="space-y-3 text-gray-700">
                      <p className="flex items-start">
                        <Icon icon="fluent:checkmark-24-filled" className="h-5 w-5 text-gray-900 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Chụp ảnh hành lý trước khi đóng gói</span>
                      </p>
                      <p className="flex items-start">
                        <Icon icon="fluent:checkmark-24-filled" className="h-5 w-5 text-gray-900 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Để bộ quần áo dự phòng trong hành lý xách tay</span>
                      </p>
                      <p className="flex items-start">
                        <Icon icon="fluent:checkmark-24-filled" className="h-5 w-5 text-gray-900 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Dùng túi zip đựng đồ lỏng</span>
                      </p>
                      <p className="flex items-start">
                        <Icon icon="fluent:checkmark-24-filled" className="h-5 w-5 text-gray-900 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Mang túi vải gấp gọn để mua sắm</span>
                      </p>
                      <p className="flex items-start">
                        <Icon icon="fluent:checkmark-24-filled" className="h-5 w-5 text-gray-900 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Gắn nhãn tên và SĐT trên va li</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Safety Section */}
        {activeSection === "safety" && (
          <div className="py-12 px-4">
            <div className="max-w-7xl mx-auto">
              {/* Section Header */}
              <div className="relative rounded-3xl overflow-hidden mb-16">
                <div className="absolute inset-0">
                  <img 
                    src="https://images.unsplash.com/photo-1527576539890-dfa815648363?w=1200&q=80" 
                    alt="Safety"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-gray-900/40"></div>
                </div>
                <div className="relative text-center py-20 px-4">
                  <p className="text-sm font-bold text-gray-200 uppercase tracking-wider mb-4">AN TOÀN KHI DU LỊCH</p>
                  <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">Ưu tiên hàng đầu của mọi chuyến đi</h2>
                  <p className="text-lg text-gray-200 max-w-3xl mx-auto">An toàn là điều quan trọng nhất. Luôn tin vào trực giác của bạn</p>
                </div>
              </div>

              <div className="space-y-20">
                {/* Priority Message */}
                <div className="bg-gray-50 rounded-3xl p-8 lg:p-12 border-l-4 border-gray-900">
                  <div className="flex items-center mb-4">
                    <Icon icon="fluent:shield-24-filled" className="h-10 w-10 text-gray-900 mr-3" />
                    <h3 className="text-3xl font-bold text-gray-900">Ưu tiên số 1: An toàn cá nhân</h3>
                  </div>
                  <p className="text-md text-gray-700 leading-relaxed">
                    Không có chuyến du lịch nào đáng để đánh đổi sức khỏe và sự an toàn của bạn. Luôn tin vào trực giác - nếu cảm thấy không an toàn, hãy rời khỏi ngay.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-white rounded-3xl p-8 border border-gray-200">
                    <div className="flex items-center mb-6">
                      <Icon icon="fluent:home-24-filled" className="h-8 w-8 text-gray-900 mr-3" />
                      <h3 className="text-2xl font-bold text-gray-900">An toàn lưu trú</h3>
                    </div>
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-start">
                        <Icon icon="fluent:checkmark-circle-24-filled" className="h-5 w-5 text-gray-900 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Đọc review trước khi đặt, chú ý các đánh giá về an ninh</span>
                      </li>
                      <li className="flex items-start">
                        <Icon icon="fluent:checkmark-circle-24-filled" className="h-5 w-5 text-gray-900 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Kiểm tra khóa cửa, cửa sổ ngay khi check-in</span>
                      </li>
                      <li className="flex items-start">
                        <Icon icon="fluent:checkmark-circle-24-filled" className="h-5 w-5 text-gray-900 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Sử dụng két sắt trong phòng cho đồ giá trị</span>
                      </li>
                      <li className="flex items-start">
                        <Icon icon="fluent:checkmark-circle-24-filled" className="h-5 w-5 text-gray-900 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Không mở cửa cho người lạ, xác nhận với lễ tân nếu nghi ngờ</span>
                      </li>
                      <li className="flex items-start">
                        <Icon icon="fluent:checkmark-circle-24-filled" className="h-5 w-5 text-gray-900 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Biết vị trí lối thoát hiểm và bình cứu hỏa</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-3xl p-8 border border-gray-200">
                    <div className="flex items-center mb-6">
                      <Icon icon="fluent:vehicle-car-24-filled" className="h-8 w-8 text-gray-900 mr-3" />
                      <h3 className="text-2xl font-bold text-gray-900">An toàn di chuyển</h3>
                    </div>
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-start">
                        <Icon icon="fluent:checkmark-circle-24-filled" className="h-5 w-5 text-gray-900 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Dùng taxi/xe từ app uy tín, tránh xe dù</span>
                      </li>
                      <li className="flex items-start">
                        <Icon icon="fluent:checkmark-circle-24-filled" className="h-5 w-5 text-gray-900 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Ngồi ghế sau khi đi taxi một mình</span>
                      </li>
                      <li className="flex items-start">
                        <Icon icon="fluent:checkmark-circle-24-filled" className="h-5 w-5 text-gray-900 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Chia sẻ vị trí realtime với người thân</span>
                      </li>
                      <li className="flex items-start">
                        <Icon icon="fluent:checkmark-circle-24-filled" className="h-5 w-5 text-gray-900 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Tránh di chuyển một mình vào ban đêm ở khu vực vắng</span>
                      </li>
                      <li className="flex items-start">
                        <Icon icon="fluent:checkmark-circle-24-filled" className="h-5 w-5 text-gray-900 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Luôn đeo dây an toàn, đội mũ bảo hiểm</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-3xl p-8 border border-gray-200">
                    <div className="flex items-center mb-6">
                      <Icon icon="fluent:wallet-24-filled" className="h-8 w-8 text-gray-900 mr-3" />
                      <h3 className="text-2xl font-bold text-gray-900">An toàn tài chính</h3>
                    </div>
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-start">
                        <Icon icon="fluent:checkmark-circle-24-filled" className="h-5 w-5 text-gray-900 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Chia tiền ra nhiều nơi, không mang hết tiền mặt cùng lúc</span>
                      </li>
                      <li className="flex items-start">
                        <Icon icon="fluent:checkmark-circle-24-filled" className="h-5 w-5 text-gray-900 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Dùng túi đeo chéo trước ngực ở khu vực đông người</span>
                      </li>
                      <li className="flex items-start">
                        <Icon icon="fluent:checkmark-circle-24-filled" className="h-5 w-5 text-gray-900 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Che mật khẩu khi rút tiền ATM</span>
                      </li>
                      <li className="flex items-start">
                        <Icon icon="fluent:checkmark-circle-24-filled" className="h-5 w-5 text-gray-900 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Bật thông báo giao dịch qua SMS/app</span>
                      </li>
                      <li className="flex items-start">
                        <Icon icon="fluent:checkmark-circle-24-filled" className="h-5 w-5 text-gray-900 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Lưu số hotline ngân hàng để khóa thẻ khẩn cấp</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-3xl p-8 border border-gray-200">
                    <div className="flex items-center mb-6">
                      <Icon icon="fluent:heart-pulse-24-filled" className="h-8 w-8 text-gray-900 mr-3" />
                      <h3 className="text-2xl font-bold text-gray-900">An toàn sức khỏe</h3>
                    </div>
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-start">
                        <Icon icon="fluent:checkmark-circle-24-filled" className="h-5 w-5 text-gray-900 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Mua bảo hiểm du lịch có bảo vệ y tế</span>
                      </li>
                      <li className="flex items-start">
                        <Icon icon="fluent:checkmark-circle-24-filled" className="h-5 w-5 text-gray-900 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Mang thuốc cá nhân và toa bác sĩ (nếu có)</span>
                      </li>
                      <li className="flex items-start">
                        <Icon icon="fluent:checkmark-circle-24-filled" className="h-5 w-5 text-gray-900 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Chỉ ăn uống tại nơi sạch sẽ, đông khách</span>
                      </li>
                      <li className="flex items-start">
                        <Icon icon="fluent:checkmark-circle-24-filled" className="h-5 w-5 text-gray-900 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Uống nước đóng chai, tránh đá lạnh ở nơi vệ sinh kém</span>
                      </li>
                      <li className="flex items-start">
                        <Icon icon="fluent:checkmark-circle-24-filled" className="h-5 w-5 text-gray-900 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Lưu số điện thoại bệnh viện và đại sứ quán</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-3xl p-8 lg:p-12">
                  <div className="flex items-center mb-6">
                    <Icon icon="fluent:shield-person-24-filled" className="h-10 w-10 text-gray-900 mr-3" />
                    <h3 className="text-3xl font-bold text-gray-900">Dành riêng cho nữ du khách đi một mình</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 text-gray-700">
                    <p className="flex items-start">
                      <span className="bg-gray-900 text-white rounded-full w-7 h-7 flex items-center justify-center font-bold mr-3 flex-shrink-0">1</span>
                      <span>Nghiên cứu kỹ về văn hóa, tập tục địa phương, đặc biệt về trang phục</span>
                    </p>
                    <p className="flex items-start">
                      <span className="bg-gray-900 text-white rounded-full w-7 h-7 flex items-center justify-center font-bold mr-3 flex-shrink-0">2</span>
                      <span>Tránh đi bộ một mình sau 22h, luôn dùng xe có đăng ký</span>
                    </p>
                    <p className="flex items-start">
                      <span className="bg-gray-900 text-white rounded-full w-7 h-7 flex items-center justify-center font-bold mr-3 flex-shrink-0">3</span>
                      <span>Đeo nhẫn cưới giả hoặc nói đang đợi bạn đồng hành để tránh quấy rối</span>
                    </p>
                    <p className="flex items-start">
                      <span className="bg-gray-900 text-white rounded-full w-7 h-7 flex items-center justify-center font-bold mr-3 flex-shrink-0">4</span>
                      <span>Kết nối với cộng đồng nữ du khách qua các group, forum</span>
                    </p>
                    <p className="flex items-start">
                      <span className="bg-gray-900 text-white rounded-full w-7 h-7 flex items-center justify-center font-bold mr-3 flex-shrink-0">5</span>
                      <span>Tin tưởng trực giác - từ chối lịch sự nếu cảm thấy không thoải mái</span>
                    </p>
                    <p className="flex items-start">
                      <span className="bg-gray-900 text-white rounded-full w-7 h-7 flex items-center justify-center font-bold mr-3 flex-shrink-0">6</span>
                      <span>Lưu số hotline khẩn cấp địa phương trên màn hình khóa</span>
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-8 border border-gray-200">
                  <div className="flex items-center mb-6">
                    <Icon icon="fluent:phone-24-filled" className="h-8 w-8 text-gray-900 mr-3" />
                    <h3 className="text-2xl font-bold text-gray-900">Số điện thoại khẩn cấp cần nhớ</h3>
                  </div>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-200">
                      <p className="text-4xl font-bold text-gray-900">113</p>
                      <p className="text-gray-600 mt-2">Công an</p>
                    </div>
                    <div className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-200">
                      <p className="text-4xl font-bold text-gray-900">114</p>
                      <p className="text-gray-600 mt-2">Cứu hỏa</p>
                    </div>
                    <div className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-200">
                      <p className="text-4xl font-bold text-gray-900">115</p>
                      <p className="text-gray-600 mt-2">Cấp cứu</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Photography Section */}
        {activeSection === "photography" && (
          <div className="py-12 px-4">
            <div className="max-w-7xl mx-auto">
              {/* Section Header */}
              <div className="relative rounded-3xl overflow-hidden mb-16">
                <div className="absolute inset-0">
                  <img 
                    src="https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=1200&q=80" 
                    alt="Photography"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-gray-900/40"></div>
                </div>
                <div className="relative text-center py-20 px-4">
                  <p className="text-sm font-bold text-gray-200 uppercase tracking-wider mb-4">NHIẾP ẢNH DU LỊCH</p>
                  <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">Ghi lại những khoảnh khắc đẹp</h2>
                  <p className="text-lg text-gray-200 max-w-3xl mx-auto">Mỗi chuyến đi là một câu chuyện đáng được kể</p>
                </div>
              </div>

              <div className="space-y-20">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div>
                    <div className="flex items-center mb-6">
                      <Icon icon="fluent:weather-sunny-24-filled" className="h-10 w-10 text-gray-900 mr-3" />
                      <h3 className="text-3xl font-bold text-gray-900">Golden Hour</h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                      Ánh sáng đẹp nhất cho nhiếp ảnh là 1 giờ sau bình minh và 1 giờ trước hoàng hôn. Ánh sáng mềm mại, ấm áp tạo nên những bức ảnh lung linh nhất.
                    </p>
                    <div className="space-y-4">
                      <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                        <div className="flex items-center mb-2">
                          <Icon icon="fluent:weather-partly-cloudy-day-24-filled" className="h-6 w-6 text-gray-900 mr-2" />
                          <p className="font-bold text-gray-900">Bình minh (5:30-6:30)</p>
                        </div>
                        <p className="text-gray-600">Ánh sáng vàng nhạt, không khí trong lành</p>
                      </div>
                      <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                        <div className="flex items-center mb-2">
                          <Icon icon="fluent:weather-sunset-24-filled" className="h-6 w-6 text-gray-900 mr-2" />
                          <p className="font-bold text-gray-900">Hoàng hôn (17:30-18:30)</p>
                        </div>
                        <p className="text-gray-600">Ánh sáng vàng đậm, màu trời đa dạng</p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-3xl overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=600&q=80" 
                      alt="Golden Hour Photography"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="bg-gray-50 rounded-3xl p-8 lg:p-12">
                  <div className="flex items-center mb-8">
                    <Icon icon="fluent:image-24-filled" className="h-10 w-10 text-gray-900 mr-3" />
                    <h3 className="text-3xl font-bold text-gray-900">Nguyên tắc tạo bố cục đẹp</h3>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl p-6 border border-gray-200">
                      <h4 className="font-bold text-xl text-gray-900 mb-3 flex items-center">
                        <span className="bg-gray-900 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm flex-shrink-0">1</span>
                        Quy tắc 1/3 (Rule of Thirds)
                      </h4>
                      <p className="text-gray-700 leading-relaxed">
                        Chia khung hình thành 9 ô bằng nhau (3x3). Đặt chủ thể chính tại các giao điểm hoặc dọc theo đường kẻ. Tránh đặt chủ thể giữa khung hình để tạo cảm giác cân bằng và chuyên nghiệp hơn.
                      </p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-gray-200">
                      <h4 className="font-bold text-xl text-gray-900 mb-3 flex items-center">
                        <span className="bg-gray-900 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm flex-shrink-0">2</span>
                        Đường dẫn (Leading Lines)
                      </h4>
                      <p className="text-gray-700 leading-relaxed">
                        Sử dụng đường đi, con đường, hàng rào, bờ sông để dẫn mắt người xem vào chủ thể chính. Đường dẫn tạo chiều sâu và kể câu chuyện cho bức ảnh.
                      </p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-gray-200">
                      <h4 className="font-bold text-xl text-gray-900 mb-3 flex items-center">
                        <span className="bg-gray-900 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm flex-shrink-0">3</span>
                        Khung trong khung (Framing)
                      </h4>
                      <p className="text-gray-700 leading-relaxed">
                        Dùng cửa sổ, cổng, cây cối để tạo khung tự nhiên xung quanh chủ thể. Kỹ thuật này tập trung sự chú ý và thêm chiều sâu cho ảnh.
                      </p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-gray-200">
                      <h4 className="font-bold text-xl text-gray-900 mb-3 flex items-center">
                        <span className="bg-gray-900 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm flex-shrink-0">4</span>
                        Đối xứng & Mẫu hình
                      </h4>
                      <p className="text-gray-700 leading-relaxed">
                        Tìm kiếm sự đối xứng trong kiến trúc, thiên nhiên. Hoặc phá vỡ mẫu hình lặp lại để tạo điểm nhấn thú vị.
                      </p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-gray-200 md:col-span-2">
                      <h4 className="font-bold text-xl text-gray-900 mb-3 flex items-center">
                        <span className="bg-gray-900 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm flex-shrink-0">5</span>
                        Góc chụp sáng tạo
                      </h4>
                      <p className="text-gray-700 leading-relaxed">
                        Thử nghiệm: chụp từ trên cao (bird's eye), từ thấp (worm's eye), hoặc nghiêng 45 độ. Thay đổi góc độ tạo nên những bức ảnh độc đáo.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-6">
                  <div className="flex items-center mb-4">
                    <Icon icon="fluent:phone-24-filled" className="h-8 w-8 text-gray-900 mr-3" />
                    <h3 className="text-xl font-bold text-gray-900">Cài đặt máy ảnh điện thoại</h3>
                  </div>
                  <div className="space-y-3 text-gray-700">
                    <p className="flex items-start">
                      <Icon icon="fluent:checkmark-circle-24-filled" className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span><strong>HDR On:</strong> Cân bằng vùng sáng tối, lý tưởng cho phong cảnh</span>
                    </p>
                    <p className="flex items-start">
                      <Icon icon="fluent:checkmark-circle-24-filled" className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span><strong>Grid lines:</strong> Bật lưới 3x3 để áp dụng quy tắc 1/3</span>
                    </p>
                    <p className="flex items-start">
                      <Icon icon="fluent:checkmark-circle-24-filled" className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span><strong>Portrait mode:</strong> Làm mờ nền, làm nổi bật chủ thể</span>
                    </p>
                    <p className="flex items-start">
                      <Icon icon="fluent:checkmark-circle-24-filled" className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span><strong>Night mode:</strong> Tự động bật ở môi trường thiếu sáng</span>
                    </p>
                    <p className="flex items-start">
                      <Icon icon="fluent:checkmark-circle-24-filled" className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span><strong>Tap to focus:</strong> Chạm vào chủ thể để lấy nét chính xác</span>
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-3xl p-8 lg:p-12">
                  <div className="flex items-center mb-8">
                    <Icon icon="fluent:camera-sparkles-24-filled" className="h-10 w-10 text-gray-900 mr-3" />
                    <h3 className="text-3xl font-bold text-gray-900">Mẹo chụp ảnh du lịch chuyên nghiệp</h3>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl p-6 border border-gray-200">
                      <div className="flex items-center mb-4">
                        <Icon icon="fluent:image-multiple-24-filled" className="h-7 w-7 text-gray-900 mr-2" />
                        <p className="font-bold text-xl text-gray-900">Phong cảnh</p>
                      </div>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start">
                          <Icon icon="fluent:checkmark-circle-24-filled" className="h-5 w-5 text-gray-900 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Chụp khi golden hour</span>
                        </li>
                        <li className="flex items-start">
                          <Icon icon="fluent:checkmark-circle-24-filled" className="h-5 w-5 text-gray-900 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Dùng chế độ panorama cho cảnh rộng</span>
                        </li>
                        <li className="flex items-start">
                          <Icon icon="fluent:checkmark-circle-24-filled" className="h-5 w-5 text-gray-900 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Có yếu tố tiền cảnh (foreground)</span>
                        </li>
                        <li className="flex items-start">
                          <Icon icon="fluent:checkmark-circle-24-filled" className="h-5 w-5 text-gray-900 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Đặt đường chân trời dọc theo 1/3 khung hình</span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-gray-200">
                      <div className="flex items-center mb-4">
                        <Icon icon="fluent:person-24-filled" className="h-7 w-7 text-gray-900 mr-2" />
                        <p className="font-bold text-xl text-gray-900">Chân dung</p>
                      </div>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start">
                          <Icon icon="fluent:checkmark-circle-24-filled" className="h-5 w-5 text-gray-900 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Chụp vào sáng sớm hoặc chiều muộn</span>
                        </li>
                        <li className="flex items-start">
                          <Icon icon="fluent:checkmark-circle-24-filled" className="h-5 w-5 text-gray-900 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Dùng portrait mode làm mờ nền</span>
                        </li>
                        <li className="flex items-start">
                          <Icon icon="fluent:checkmark-circle-24-filled" className="h-5 w-5 text-gray-900 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Chụp từ ngang mắt hoặc cao hơn</span>
                        </li>
                        <li className="flex items-start">
                          <Icon icon="fluent:checkmark-circle-24-filled" className="h-5 w-5 text-gray-900 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Để người mẫu nhìn sang một bên tự nhiên</span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-gray-200">
                      <div className="flex items-center mb-4">
                        <Icon icon="fluent:building-24-filled" className="h-7 w-7 text-gray-900 mr-2" />
                        <p className="font-bold text-xl text-gray-900">Kiến trúc</p>
                      </div>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start">
                          <Icon icon="fluent:checkmark-circle-24-filled" className="h-5 w-5 text-gray-900 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Tìm đường đối xứng</span>
                        </li>
                        <li className="flex items-start">
                          <Icon icon="fluent:checkmark-circle-24-filled" className="h-5 w-5 text-gray-900 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Chụp từ góc thấp để tòa nhà hùng vĩ</span>
                        </li>
                        <li className="flex items-start">
                          <Icon icon="fluent:checkmark-circle-24-filled" className="h-5 w-5 text-gray-900 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Chờ đến khi ít người qua lại</span>
                        </li>
                        <li className="flex items-start">
                          <Icon icon="fluent:checkmark-circle-24-filled" className="h-5 w-5 text-gray-900 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Chụp cả chi tiết nhỏ đặc sắc</span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-gray-200">
                      <div className="flex items-center mb-4">
                        <Icon icon="fluent:food-24-filled" className="h-7 w-7 text-gray-900 mr-2" />
                        <p className="font-bold text-xl text-gray-900">Ẩm thực</p>
                      </div>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start">
                          <Icon icon="fluent:checkmark-circle-24-filled" className="h-5 w-5 text-gray-900 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Chụp từ trên xuống (flat lay)</span>
                        </li>
                        <li className="flex items-start">
                          <Icon icon="fluent:checkmark-circle-24-filled" className="h-5 w-5 text-gray-900 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Ánh sáng tự nhiên từ cửa sổ</span>
                        </li>
                        <li className="flex items-start">
                          <Icon icon="fluent:checkmark-circle-24-filled" className="h-5 w-5 text-gray-900 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Sắp xếp món ăn đẹp mắt</span>
                        </li>
                        <li className="flex items-start">
                          <Icon icon="fluent:checkmark-circle-24-filled" className="h-5 w-5 text-gray-900 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Thêm tay người để tạo cảm giác chân thực</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-8 border border-gray-200">
                  <div className="flex items-center mb-6">
                    <Icon icon="fluent:color-24-filled" className="h-8 w-8 text-gray-900 mr-3" />
                    <h3 className="text-2xl font-bold text-gray-900">Chỉnh sửa ảnh cơ bản</h3>
                  </div>
                  <div className="space-y-6 text-gray-700">
                    <p className="text-lg"><strong>App khuyên dùng:</strong> Lightroom Mobile (miễn phí), VSCO, Snapseed</p>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
                        <p className="font-bold text-gray-900 mb-2">Exposure</p>
                        <p className="text-sm text-gray-600">Điều chỉnh độ sáng tổng thể</p>
                      </div>
                      <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
                        <p className="font-bold text-gray-900 mb-2">Contrast</p>
                        <p className="text-sm text-gray-600">Tăng độ tương phản vừa phải</p>
                      </div>
                      <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
                        <p className="font-bold text-gray-900 mb-2">Saturation</p>
                        <p className="text-sm text-gray-600">Tăng độ bão hòa màu +10-20</p>
                      </div>
                      <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
                        <p className="font-bold text-gray-900 mb-2">Highlights</p>
                        <p className="text-sm text-gray-600">Giảm vùng quá sáng</p>
                      </div>
                      <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
                        <p className="font-bold text-gray-900 mb-2">Shadows</p>
                        <p className="text-sm text-gray-600">Tăng để hiện chi tiết vùng tối</p>
                      </div>
                      <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
                        <p className="font-bold text-gray-900 mb-2">Sharpen</p>
                        <p className="text-sm text-gray-600">Tăng độ sắc nét vừa phải</p>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-2xl p-5 border-l-4 border-gray-900">
                      <p className="text-gray-700"><strong>Lưu ý:</strong> Chỉnh sửa tinh tế, giữ ảnh tự nhiên. Tránh filter quá đà!</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Food Section */}
        {activeSection === "food" && (
          <div className="py-12 px-4">
            <div className="max-w-7xl mx-auto">
              {/* Section Header */}
              <div className="relative rounded-3xl overflow-hidden mb-16">
                <div className="absolute inset-0">
                  <img 
                    src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80" 
                    alt="Food"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-gray-900/40"></div>
                </div>
                <div className="relative text-center py-20 px-4">
                  <p className="text-sm font-bold text-gray-200 uppercase tracking-wider mb-4">ẨM THỰC ĐỊA PHƯƠNG</p>
                  <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">Khám phá hương vị mới lạ</h2>
                  <p className="text-lg text-gray-200 max-w-3xl mx-auto">Ẩm thực là cửa ngõ để hiểu văn hóa</p>
                </div>
              </div>

              <div className="space-y-20">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div>
                    <div className="flex items-center mb-6">
                      <Icon icon="fluent:food-24-filled" className="h-10 w-10 text-gray-900 mr-3" />
                      <h3 className="text-3xl font-bold text-gray-900">Ăn như người địa phương</h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed text-lg">
                      Ẩm thực là một phần quan trọng của văn hóa. Đừng ngại thử những món ăn đường phố, ghé các quán ăn nơi người bản địa hay lui tới. Đó là cách tốt nhất để hiểu về một nền văn hóa.
                    </p>
                  </div>
                  <div className="rounded-3xl overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80" 
                      alt="Street Food"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="bg-gray-50 rounded-3xl p-8 lg:p-12">
                  <div className="flex items-center mb-8">
                    <Icon icon="fluent:search-24-filled" className="h-10 w-10 text-gray-900 mr-3" />
                    <h3 className="text-3xl font-bold text-gray-900">Tìm quán ăn ngon</h3>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl p-6 border border-gray-200">
                      <h4 className="font-bold text-xl text-gray-900 mb-3 flex items-center">
                        <Icon icon="fluent:people-community-24-filled" className="h-7 w-7 text-gray-900 mr-2" />
                        Đông người địa phương = Ngon
                      </h4>
                      <p className="text-gray-700 leading-relaxed">
                        Quán nào đông người Việt (hoặc người bản xứ), đó chính là quán ngon. Tránh các quán chỉ có khách du lịch, giá cao mà chất lượng kém.
                      </p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-gray-200">
                      <h4 className="font-bold text-xl text-gray-900 mb-3 flex items-center">
                        <Icon icon="fluent:clock-24-filled" className="h-7 w-7 text-gray-900 mr-2" />
                        Ăn đúng giờ địa phương
                      </h4>
                      <p className="text-gray-700 leading-relaxed">
                        Phở ăn sáng (6-8h), cơm trưa (11-13h), ăn vặt chiều (15-17h), món nướng tối (18-21h). Ăn đúng giờ món mới nấu, tươi ngon nhất.
                      </p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-gray-200">
                      <h4 className="font-bold text-xl text-gray-900 mb-3 flex items-center">
                        <Icon icon="fluent:location-24-filled" className="h-7 w-7 text-gray-900 mr-2" />
                        Tránh xa khu du lịch
                      </h4>
                      <p className="text-gray-700 leading-relaxed">
                        Đi sâu vào khu dân cư 2-3 con phố. Quán ăn ở đây giá rẻ hơn 40-60%, chất lượng tốt hơn nhiều.
                      </p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-gray-200">
                      <h4 className="font-bold text-xl text-gray-900 mb-3 flex items-center">
                        <Icon icon="fluent:star-24-filled" className="h-7 w-7 text-gray-900 mr-2" />
                        Hỏi ý kiến người địa phương
                      </h4>
                      <p className="text-gray-700 leading-relaxed">
                        Hỏi nhân viên khách sạn, tài xế, người bán hàng họ thường ăn ở đâu. Đây là cách tốt nhất để tìm quán ngon.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-8 border border-gray-200">
                  <div className="flex items-center mb-6">
                    <Icon icon="fluent:shield-checkmark-24-filled" className="h-8 w-8 text-gray-900 mr-3" />
                    <h3 className="text-2xl font-bold text-gray-900">An toàn vệ sinh thực phẩm</h3>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-bold text-gray-900 mb-4 text-lg flex items-center">
                        <Icon icon="fluent:checkmark-circle-24-filled" className="h-6 w-6 text-gray-900 mr-2" />
                        Nên làm
                      </h4>
                      <ul className="space-y-3 text-gray-700">
                        <li className="flex items-start">
                          <Icon icon="fluent:checkmark-24-filled" className="h-5 w-5 text-gray-900 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Ăn món nấu chín kỹ, nóng hổi</span>
                        </li>
                        <li className="flex items-start">
                          <Icon icon="fluent:checkmark-24-filled" className="h-5 w-5 text-gray-900 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Chọn quán sạch sẽ, đồ dùng gọn gàng</span>
                        </li>
                        <li className="flex items-start">
                          <Icon icon="fluent:checkmark-24-filled" className="h-5 w-5 text-gray-900 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Uống nước đóng chai có nguồn gốc</span>
                        </li>
                        <li className="flex items-start">
                          <Icon icon="fluent:checkmark-24-filled" className="h-5 w-5 text-gray-900 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Rửa tay trước khi ăn</span>
                        </li>
                        <li className="flex items-start">
                          <Icon icon="fluent:checkmark-24-filled" className="h-5 w-5 text-gray-900 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Gọi món đặc sản nổi tiếng của quán</span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-bold text-gray-900 mb-4 text-lg flex items-center">
                        <Icon icon="fluent:dismiss-circle-24-filled" className="h-6 w-6 text-gray-900 mr-2" />
                        Tránh
                      </h4>
                      <ul className="space-y-3 text-gray-700">
                        <li className="flex items-start">
                          <Icon icon="fluent:dismiss-24-filled" className="h-5 w-5 text-gray-900 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Đồ sống ở nơi vệ sinh kém</span>
                        </li>
                        <li className="flex items-start">
                          <Icon icon="fluent:dismiss-24-filled" className="h-5 w-5 text-gray-900 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Đá lạnh nước sinh hoạt không rõ nguồn</span>
                        </li>
                        <li className="flex items-start">
                          <Icon icon="fluent:dismiss-24-filled" className="h-5 w-5 text-gray-900 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Trái cây cắt sẵn bán ngoài đường</span>
                        </li>
                        <li className="flex items-start">
                          <Icon icon="fluent:dismiss-24-filled" className="h-5 w-5 text-gray-900 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Quán vắng khách, đồ ăn để lâu</span>
                        </li>
                        <li className="flex items-start">
                          <Icon icon="fluent:dismiss-24-filled" className="h-5 w-5 text-gray-900 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Ăn quá no khi đi xe, máy bay</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-3xl p-8 lg:p-12">
                  <div className="flex items-center mb-6">
                    <Icon icon="fluent:emoji-sparkle-24-filled" className="h-10 w-10 text-gray-900 mr-3" />
                    <h3 className="text-3xl font-bold text-gray-900">Thử món mới một cách thông minh</h3>
                  </div>
                  
                  <div className="space-y-4 text-gray-700">
                    <p className="flex items-start">
                      <span className="bg-gray-900 text-white rounded-full w-7 h-7 flex items-center justify-center mr-3 flex-shrink-0 font-bold text-sm">1</span>
                      <span><strong>Bắt đầu nhẹ nhàng:</strong> Thử món quen thuộc trước, sau đó dần dần thử món lạ hơn</span>
                    </p>
                    <p className="flex items-start">
                      <span className="bg-gray-900 text-white rounded-full w-7 h-7 flex items-center justify-center mr-3 flex-shrink-0 font-bold text-sm">2</span>
                      <span><strong>Hỏi về độ cay:</strong> Nếu không quen cay, hỏi "less spicy" hoặc "mild"</span>
                    </p>
                    <p className="flex items-start">
                      <span className="bg-gray-900 text-white rounded-full w-7 h-7 flex items-center justify-center mr-3 flex-shrink-0 font-bold text-sm">3</span>
                      <span><strong>Chia sẻ:</strong> Đi theo nhóm và gọi nhiều món khác nhau để thử</span>
                    </p>
                    <p className="flex items-start">
                      <span className="bg-gray-900 text-white rounded-full w-7 h-7 flex items-center justify-center mr-3 flex-shrink-0 font-bold text-sm">4</span>
                      <span><strong>Dị ứng:</strong> Nói rõ về dị ứng thực phẩm (seafood, nuts, dairy)</span>
                    </p>
                    <p className="flex items-start">
                      <span className="bg-gray-900 text-white rounded-full w-7 h-7 flex items-center justify-center mr-3 flex-shrink-0 font-bold text-sm">5</span>
                      <span><strong>Mang thuốc tiêu hóa:</strong> Phòng khi dạ dày không quen với món mới</span>
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-8 border border-gray-200">
                  <div className="flex items-center mb-4">
                    <Icon icon="fluent:notebook-24-filled" className="h-8 w-8 text-gray-900 mr-3" />
                    <h3 className="text-2xl font-bold text-gray-900">Ghi chú ẩm thực</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                    Tạo một danh sách note trên điện thoại với tên quán, địa chỉ, món ăn ngon và giá cả. Chụp ảnh menu và business card. Sau này bạn sẽ nhớ được những trải nghiệm ẩm thực tuyệt vời và có thể giới thiệu cho bạn bè!
                  </p>
                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                    <div className="flex items-center mb-3">
                      <Icon icon="fluent:document-text-24-filled" className="h-6 w-6 text-gray-900 mr-2" />
                      <p className="text-gray-900 font-bold">Mẫu ghi chú:</p>
                    </div>
                    <div className="font-mono text-gray-700 space-y-1">
                      <p>Tên quán: Phở Gia Truyền</p>
                      <p>Địa chỉ: 49 Bát Đàn, Hoàn Kiếm</p>
                      <p>Món: Phở bò tái - 60k</p>
                      <p>Đánh giá: ⭐⭐⭐⭐⭐</p>
                      <p>Note: Nước dùng ngọt đậm đà!</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Culture Section */}
        {activeSection === "culture" && (
          <div className="py-12 px-4">
            <div className="max-w-7xl mx-auto">
              {/* Section Header */}
              <div className="relative rounded-3xl overflow-hidden mb-16">
                <div className="absolute inset-0">
                  <img 
                    src="https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1200&q=80" 
                    alt="Culture"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-gray-900/40"></div>
                </div>
                <div className="relative text-center py-20 px-4">
                  <p className="text-sm font-bold text-gray-200 uppercase tracking-wider mb-4">VĂN HÓA ĐỊA PHƯƠNG</p>
                  <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">Tôn trọng và hòa nhập</h2>
                  <p className="text-lg text-gray-200 max-w-3xl mx-auto">Du lịch có trách nhiệm - Hãy đến như một người khách, không phải người xâm lược</p>
                </div>
              </div>

              <div className="space-y-20">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div className="rounded-3xl overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=600&q=80" 
                      alt="Responsible Travel"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center mb-6">
                      <Icon icon="fluent:earth-24-filled" className="h-10 w-10 text-gray-900 mr-3" />
                      <h3 className="text-3xl font-bold text-gray-900">Du lịch có trách nhiệm</h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed text-lg">
                      Là một du khách có văn hóa, chúng ta có trách nhiệm tôn trọng và bảo vệ văn hóa, môi trường của nơi mình đến. Hãy đến như một người khách, không phải người xâm lược.
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-white rounded-3xl p-8 border border-gray-200">
                    <div className="flex items-center mb-6">
                      <Icon icon="fluent:book-open-24-filled" className="h-8 w-8 text-gray-900 mr-3" />
                      <h3 className="text-2xl font-bold text-gray-900">Học hỏi trước khi đi</h3>
                    </div>
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-start">
                        <Icon icon="fluent:checkmark-circle-24-filled" className="h-5 w-5 text-gray-900 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Đọc về lịch sử, văn hóa, tôn giáo của địa phương</span>
                      </li>
                      <li className="flex items-start">
                        <Icon icon="fluent:checkmark-circle-24-filled" className="h-5 w-5 text-gray-900 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Học vài câu tiếng địa phương cơ bản</span>
                      </li>
                      <li className="flex items-start">
                        <Icon icon="fluent:checkmark-circle-24-filled" className="h-5 w-5 text-gray-900 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Hiểu về quy tắc ăn mặc phù hợp</span>
                      </li>
                      <li className="flex items-start">
                        <Icon icon="fluent:checkmark-circle-24-filled" className="h-5 w-5 text-gray-900 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Tìm hiểu về cử chỉ lịch sự và cấm kỵ</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-3xl p-8 border border-gray-200">
                    <div className="flex items-center mb-6">
                      <Icon icon="fluent:heart-24-filled" className="h-8 w-8 text-gray-900 mr-3" />
                      <h3 className="text-2xl font-bold text-gray-900">Tôn trọng và lịch sự</h3>
                    </div>
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-start">
                        <Icon icon="fluent:checkmark-circle-24-filled" className="h-5 w-5 text-gray-900 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Xin phép trước khi chụp ảnh người địa phương</span>
                      </li>
                      <li className="flex items-start">
                        <Icon icon="fluent:checkmark-circle-24-filled" className="h-5 w-5 text-gray-900 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Mặc đồ phù hợp khi vào đền chùa</span>
                      </li>
                      <li className="flex items-start">
                        <Icon icon="fluent:checkmark-circle-24-filled" className="h-5 w-5 text-gray-900 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Nói "xin chào", "cảm ơn" bằng tiếng địa phương</span>
                      </li>
                      <li className="flex items-start">
                        <Icon icon="fluent:checkmark-24-filled" className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Kiên nhẫn với rào cản ngôn ngữ</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-3xl p-8 lg:p-12">
                  <div className="flex items-center mb-8">
                    <Icon icon="fluent:warning-24-filled" className="h-10 w-10 text-gray-900 mr-3" />
                    <h3 className="text-3xl font-bold text-gray-900">Những điều tuyệt đối tránh</h3>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-2xl p-6 border border-gray-200">
                      <div className="flex items-start mb-2">
                        <Icon icon="fluent:dismiss-circle-24-filled" className="h-6 w-6 text-gray-900 mr-2 flex-shrink-0" />
                        <p className="font-bold text-gray-900">Chạm vào đầu người khác</p>
                      </div>
                      <p className="text-sm text-gray-700 ml-8">Ở nhiều nền văn hóa châu Á, đầu là phần thiêng liêng, không được chạm</p>
                    </div>
                    <div className="bg-white rounded-2xl p-6 border border-gray-200">
                      <div className="flex items-start mb-2">
                        <Icon icon="fluent:dismiss-circle-24-filled" className="h-6 w-6 text-gray-900 mr-2 flex-shrink-0" />
                        <p className="font-bold text-gray-900">Chỉ tay vào người khác</p>
                      </div>
                      <p className="text-sm text-gray-700 ml-8">Cử chỉ bất lịch sự, nên dùng bàn tay mở để chỉ hướng</p>
                    </div>
                    <div className="bg-white rounded-2xl p-6 border border-gray-200">
                      <div className="flex items-start mb-2">
                        <Icon icon="fluent:dismiss-circle-24-filled" className="h-6 w-6 text-gray-900 mr-2 flex-shrink-0" />
                        <p className="font-bold text-gray-900">Đi giày vào nhà/đền chùa</p>
                      </div>
                      <p className="text-sm text-gray-700 ml-8">Luôn cởi giày ở cửa khi vào nơi thiêng hoặc nhà riêng</p>
                    </div>
                    <div className="bg-white rounded-2xl p-6 border border-gray-200">
                      <div className="flex items-start mb-2">
                        <Icon icon="fluent:dismiss-circle-24-filled" className="h-6 w-6 text-gray-900 mr-2 flex-shrink-0" />
                        <p className="font-bold text-gray-900">Nói to, cư xử phản cảm nơi công cộng</p>
                      </div>
                      <p className="text-sm text-gray-700 ml-8">Giữ âm lượng vừa phải, tôn trọng không gian chung</p>
                    </div>
                    <div className="bg-white rounded-2xl p-6 border border-gray-200">
                      <div className="flex items-start mb-2">
                        <Icon icon="fluent:dismiss-circle-24-filled" className="h-6 w-6 text-gray-900 mr-2 flex-shrink-0" />
                        <p className="font-bold text-gray-900">So sánh tiêu cực với quê hương</p>
                      </div>
                      <p className="text-sm text-gray-700 ml-8">"Ở nước tôi tốt hơn nhiều" - câu nói làm tổn thương người địa phương</p>
                    </div>
                    <div className="bg-white rounded-2xl p-6 border border-gray-200">
                      <div className="flex items-start mb-2">
                        <Icon icon="fluent:dismiss-circle-24-filled" className="h-6 w-6 text-gray-900 mr-2 flex-shrink-0" />
                        <p className="font-bold text-gray-900">Mặc cả quá đáng</p>
                      </div>
                      <p className="text-sm text-gray-700 ml-8">Trả giá hợp lý, đừng mặc cả đến mức xúc phạm người bán</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-8 border border-gray-200">
                  <div className="flex items-center mb-6">
                    <Icon icon="fluent:chat-multiple-24-filled" className="h-8 w-8 text-gray-900 mr-3" />
                    <h3 className="text-2xl font-bold text-gray-900">Cụm từ hữu ích bằng tiếng địa phương</h3>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                      <p className="font-bold text-gray-900 mb-4 text-lg">Cơ bản</p>
                      <ul className="space-y-3 text-gray-700">
                        <li className="flex items-center">
                          <Icon icon="fluent:hand-wave-24-filled" className="h-5 w-5 text-gray-900 mr-2" />
                          <span>Xin chào / Hello</span>
                        </li>
                        <li className="flex items-center">
                          <Icon icon="fluent:heart-24-filled" className="h-5 w-5 text-gray-900 mr-2" />
                          <span>Cảm ơn / Thank you</span>
                        </li>
                        <li className="flex items-center">
                          <Icon icon="fluent:people-error-24-filled" className="h-5 w-5 text-gray-900 mr-2" />
                          <span>Xin lỗi / Sorry/Excuse me</span>
                        </li>
                        <li className="flex items-center">
                          <Icon icon="fluent:checkmark-24-filled" className="h-5 w-5 text-gray-900 mr-2" />
                          <span>Vâng / Yes</span>
                        </li>
                        <li className="flex items-center">
                          <Icon icon="fluent:dismiss-24-filled" className="h-5 w-5 text-gray-900 mr-2" />
                          <span>Không / No</span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                      <p className="font-bold text-gray-900 mb-4 text-lg">Hữu ích</p>
                      <ul className="space-y-3 text-gray-700">
                        <li className="flex items-center">
                          <Icon icon="fluent:money-24-filled" className="h-5 w-5 text-gray-900 mr-2" />
                          <span>Bao nhiêu tiền? / How much?</span>
                        </li>
                        <li className="flex items-center">
                          <Icon icon="fluent:location-24-filled" className="h-5 w-5 text-gray-900 mr-2" />
                          <span>Toilet ở đâu? / Where is toilet?</span>
                        </li>
                        <li className="flex items-center">
                          <Icon icon="fluent:vehicle-car-24-filled" className="h-5 w-5 text-gray-900 mr-2" />
                          <span>Đến ... / To ... (place)</span>
                        </li>
                        <li className="flex items-center">
                          <Icon icon="fluent:warning-24-filled" className="h-5 w-5 text-gray-900 mr-2" />
                          <span>Giúp tôi! / Help!</span>
                        </li>
                        <li className="flex items-center">
                          <Icon icon="fluent:heart-pulse-24-filled" className="h-5 w-5 text-gray-900 mr-2" />
                          <span>Tôi cần bác sĩ / I need doctor</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 bg-gray-50 rounded-2xl p-5 border-l-4 border-gray-900">
                    <div className="flex items-start">
                      <Icon icon="fluent:lightbulb-24-filled" className="h-6 w-6 text-gray-900 mr-2 flex-shrink-0" />
                      <p className="text-gray-700">Lưu các cụm từ này vào Notes hoặc tải app Google Translate với chế độ offline</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-3xl p-8 lg:p-12">
                  <div className="flex items-center mb-8">
                    <Icon icon="fluent:leaf-24-filled" className="h-10 w-10 text-gray-900 mr-3" />
                    <h3 className="text-3xl font-bold text-gray-900">Du lịch xanh & Bền vững</h3>
                  </div>
                  
                  <div className="space-y-5 text-gray-700">
                    <div className="flex items-start space-x-4">
                      <Icon icon="fluent:recycling-24-filled" className="h-8 w-8 text-gray-900 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-bold text-gray-900 text-lg mb-2">Giảm thiểu rác thải nhựa</p>
                        <p>Mang túi vải, bình nước, hộp đựng thức ăn. Từ chối ống hút nhựa và túi nilon.</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <Icon icon="fluent:building-shop-24-filled" className="h-8 w-8 text-gray-900 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-bold text-gray-900 text-lg mb-2">Ủng hộ doanh nghiệp địa phương</p>
                        <p>Mua sắm tại cửa hàng nhỏ, ăn tại quán gia đình, thuê hướng dẫn viên bản địa.</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <Icon icon="fluent:animal-paw-24-filled" className="h-8 w-8 text-gray-900 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-bold text-gray-900 text-lg mb-2">Tôn trọng động vật hoang dã</p>
                        <p>Không tham gia tour cưỡi voi, chụp ảnh với động vật bị nuôi nhốt. Quan sát từ xa.</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <Icon icon="fluent:building-24-filled" className="h-8 w-8 text-gray-900 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-bold text-gray-900 text-lg mb-2">Bảo vệ di tích lịch sử</p>
                        <p>Không chạm vào, trèo lên hoặc vẽ lên di tích. Chỉ chụp ảnh không flash trong bảo tàng.</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <Icon icon="fluent:water-24-filled" className="h-8 w-8 text-gray-900 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-bold text-gray-900 text-lg mb-2">Tiết kiệm tài nguyên</p>
                        <p>Tắt điện/điều hòa khi ra khỏi phòng. Tái sử dụng khăn tắm thay vì giặt mỗi ngày.</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <Icon icon="fluent:people-community-24-filled" className="h-8 w-8 text-gray-900 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-bold text-gray-900 text-lg mb-2">Tôn trọng cộng đồng</p>
                        <p>Không chụp ảnh trẻ em địa phương mà không xin phép. Mặc đồ lịch sự khi vào làng bản.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-8 border border-gray-200">
                  <div className="flex items-center mb-6">
                    <Icon icon="fluent:people-24-filled" className="h-8 w-8 text-gray-900 mr-3" />
                    <h3 className="text-2xl font-bold text-gray-900">Kết nối với người địa phương</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                    Những trải nghiệm đẹp nhất thường đến từ những cuộc trò chuyện với người địa phương. Hãy mở lòng, tươi cười, thể hiện sự quan tâm chân thành đến cuộc sống và văn hóa của họ. Đừng chỉ là khách du lịch, hãy là người bạn của nơi bạn đến!
                  </p>
                  <div className="bg-gray-50 rounded-2xl p-6 border-l-4 border-gray-900">
                    <p className="text-gray-700 italic">
                      "Du lịch không chỉ là đi đến những nơi mới, mà là nhìn mọi thứ bằng con mắt mới." - Marcel Proust
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white py-6 sm:py-8 mt-8">
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          <div className="flex flex-col lg:flex-row justify-between items-center text-xs sm:text-sm text-gray-900 space-y-4 lg:space-y-0">
            <div className="text-gray-900 order-3 lg:order-1">© TravelNest 2025</div>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8 order-2">
              {[
                { text: "Chính sách quyền riêng tư", to: null },
                { text: "Chính sách cookie", to: null },
                { text: "Điều khoản", to: null },
                { text: "Tiếng Việt ▼", to: null },
              ].map((item, i) => (
                <Link
                  key={i}
                  to={item?.to  || path.LANDING}
                  className="font-medium cursor-pointer transition-all duration-200 
                  hover:underline decoration-2 
                  decoration-[var(--travel-primary-600)] 
                  hover:underline-offset-4"
                >
                  {item.text}
                </Link>
              ))}
            </div>
            <div className="flex items-center space-x-2 text-gray-400 order-1 lg:order-3">
              <img
                src={subLogo}
                alt="TravelNest Sub Logo"
                className="w-[200px] object-contain"
              />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TravelGuideStatic;