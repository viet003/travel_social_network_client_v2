import { useState, useRef } from 'react';
import { Icon } from '@iconify/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { Link } from 'react-router-dom';
import { path } from '../../../utilities/path';
import { subLogo } from '../../../assets/images';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const SeasonalTravelGuidePage = () => {
  const [activeTab, setActiveTab] = useState('spring');
  const swiperRef = useRef<SwiperType | null>(null);

  const seasons = {
    spring: {
      id: 'spring',
      name: 'Mùa Xuân',
      icon: 'fluent:leaf-24-filled',
      color: 'emerald',
      gradient: 'from-emerald-400 to-teal-500',
      months: 'Tháng 3 - Tháng 5',
      temp: '15-25°C',
      emoji: '🌸',
      galleryImages: [
        'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800',
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800',
        'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800',
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
        'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800',
        'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800',
        'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800',
        'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800'
      ],
      featuredImage: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1200',
      inspirationImages: [
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600',
        'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=600',
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600',
        'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600'
      ],
      weather: {
        temperature: 'Khí hậu ôn hòa, mát mẻ',
        humidity: 'Độ ẩm: 65-75%',
        conditions: 'Nắng ấm, thỉnh thoảng có mưa nhỏ'
      },
      characteristics: [
        'Thời tiết dễ chịu, không quá nóng hay lạnh',
        'Hoa nở rộ khắp nơi, thiên nhiên tươi mới',
        'Không khí trong lành, tầm nhìn xa tốt',
        'Ít có bão và thiên tai',
        'Độ ẩm vừa phải, không quá ẩm ướt'
      ],
      destinations: [
        {
          name: 'Những vùng có hoa nở',
          description: 'Các công viên hoa, đồi chè, vườn hoa tulip, anh đào',
          activities: ['Ngắm hoa', 'Chụp ảnh', 'Dã ngoại']
        },
        {
          name: 'Vùng cao nguyên',
          description: 'Khí hậu mát mẻ, cảnh đẹp núi non hùng vĩ',
          activities: ['Trekking', 'Cắm trại', 'Leo núi']
        },
        {
          name: 'Thành phố văn hóa',
          description: 'Khám phá di sản, bảo tàng, lễ hội mùa xuân',
          activities: ['Tham quan', 'Ẩm thực', 'Mua sắm']
        }
      ],
      packing: {
        clothing: [
          'Áo khoác nhẹ hoặc cardigan',
          'Áo phông, áo sơ mi cotton',
          'Quần jean, quần kaki',
          'Váy hoặc đầm nhẹ nhàng',
          'Trang phục nhiều lớp linh hoạt'
        ],
        accessories: [
          'Mũ rộng vành hoặc nón',
          'Kính râm',
          'Khăn choàng mỏng',
          'Ô dù nhỏ gọn',
          'Túi đeo chéo tiện lợi'
        ],
        essentials: [
          'Kem chống nắng SPF 30-50',
          'Son dưỡng môi',
          'Thuốc dị ứng (do phấn hoa)',
          'Khăn giấy ướt',
          'Pin sạc dự phòng'
        ]
      },
      tips: [
        'Đặt chỗ trước vì đây là mùa cao điểm du lịch',
        'Mang theo thuốc dị ứng nếu bạn nhạy cảm với phấn hoa',
        'Thời tiết có thể thay đổi đột ngột, luôn chuẩn bị áo mưa',
        'Tránh du lịch vào các ngày lễ lớn để tránh đông đúc',
        'Đặt tour tham quan hoa sớm để có vị trí đẹp'
      ],
      activities: [
        'Ngắm hoa và chụp ảnh phong cảnh',
        'Đi xe đạp qua các con đường hoa',
        'Tham gia lễ hội mùa xuân địa phương',
        'Dã ngoại và picnic ở công viên',
        'Trekking nhẹ nhàng trên núi'
      ],
      budget: {
        accommodation: 'Trung bình - Cao (do mùa cao điểm)',
        food: 'Trung bình',
        transport: 'Trung bình',
        note: 'Giá tăng 20-30% so với mùa thấp điểm'
      }
    },
    summer: {
      id: 'summer',
      name: 'Mùa Hè',
      icon: 'fluent:weather-sunny-24-filled',
      color: 'amber',
      gradient: 'from-amber-400 to-orange-500',
      months: 'Tháng 6 - Tháng 8',
      temp: '28-38°C',
      emoji: '☀️',
      galleryImages: [
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
        'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
        'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800',
        'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800',
        'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800',
        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
        'https://images.unsplash.com/photo-1455218873509-8097305ee378?w=800',
        'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800'
      ],
      featuredImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200',
      inspirationImages: [
        'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600',
        'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=600',
        'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600',
        'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=600'
      ],
      weather: {
        temperature: 'Nóng bức, nhiệt độ cao',
        humidity: 'Độ ẩm: 75-90%',
        conditions: 'Nắng gắt, có mưa dông về chiều'
      },
      characteristics: [
        'Nhiệt độ cao, nắng gắt đặc biệt giữa trưa',
        'Thời gian ban ngày dài, hoạt động nhiều',
        'Mùa du lịch biển và các hoạt động nước',
        'Trái cây nhiệt đới phong phú',
        'Có thể có bão ở một số khu vực ven biển'
      ],
      destinations: [
        {
          name: 'Bãi biển và đảo',
          description: 'Nước biển trong xanh, cát trắng, rạn san hô',
          activities: ['Bơi lội', 'Lặn biển', 'Lướt sóng']
        },
        {
          name: 'Vùng núi cao',
          description: 'Trốn nóng ở độ cao, khí hậu mát mẻ quanh năm',
          activities: ['Nghỉ dưỡng', 'Trekking', 'Ngắm cảnh']
        },
        {
          name: 'Công viên giải trí',
          description: 'Công viên nước, khu vui chơi trong nhà có điều hòa',
          activities: ['Trò chơi', 'Giải trí', 'Ẩm thực']
        }
      ],
      packing: {
        clothing: [
          'Áo phông cotton thoáng mát',
          'Quần short, váy ngắn',
          'Đồ bơi (bikini, áo tắm)',
          'Áo khoác mỏng chống nắng',
          'Dép sandal, dép xỏ ngón'
        ],
        accessories: [
          'Mũ rộng vành bảo vệ',
          'Kính râm UV400',
          'Khăn tắm biển',
          'Túi chống nước',
          'Giày thể thao thoáng khí'
        ],
        essentials: [
          'Kem chống nắng SPF 50+ (chống nước)',
          'Gel dưỡng ẩm sau khi phơi nắng',
          'Thuốc chống say sóng',
          'Nước muối sinh lý rửa mắt',
          'Mũ bảo hiểm khi đi xe máy'
        ]
      },
      tips: [
        'Tránh hoạt động ngoài trời từ 11h-15h khi nắng gắt nhất',
        'Uống nhiều nước, bổ sung điện giải thường xuyên',
        'Thoa kem chống nắng mỗi 2 tiếng một lần',
        'Kiểm tra dự báo thời tiết hàng ngày (bão, mưa dông)',
        'Đặt phòng có điều hòa hoặc gần bãi biển'
      ],
      activities: [
        'Bơi lội, lặn ngắm san hô',
        'Lướt sóng, chèo thuyền kayak',
        'BBQ trên bãi biển',
        'Tham quan các hang động mát mẻ',
        'Nghỉ dưỡng tại resort có bể bơi'
      ],
      budget: {
        accommodation: 'Cao (mùa cao điểm du lịch biển)',
        food: 'Trung bình - Cao',
        transport: 'Cao',
        note: 'Đặt trước để có giá tốt, giá tăng 30-50% vào cuối tuần'
      }
    },
    autumn: {
      id: 'autumn',
      name: 'Mùa Thu',
      icon: 'fluent:weather-partly-cloudy-day-24-filled',
      color: 'orange',
      gradient: 'from-orange-400 to-red-500',
      months: 'Tháng 9 - Tháng 11',
      temp: '18-28°C',
      emoji: '🍂',
      galleryImages: [
        'https://images.unsplash.com/photo-1445452916036-9022dfd33aa8?w=800',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
        'https://images.unsplash.com/photo-1474534297112-b9dbdfa44e8d?w=800',
        'https://images.unsplash.com/photo-1509937528035-ad76254b0356?w=800',
        'https://images.unsplash.com/photo-1476820865390-c52aeebb9891?w=800',
        'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800',
        'https://images.unsplash.com/photo-1511497584788-876760111969?w=800',
        'https://images.unsplash.com/photo-1478098711619-5ab0b478d6e6?w=800'
      ],
      featuredImage: 'https://images.unsplash.com/photo-1445452916036-9022dfd33aa8?w=1200',
      inspirationImages: [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600',
        'https://images.unsplash.com/photo-1474534297112-b9dbdfa44e8d?w=600',
        'https://images.unsplash.com/photo-1509937528035-ad76254b0356?w=600',
        'https://images.unsplash.com/photo-1476820865390-c52aeebb9891?w=600'
      ],
      weather: {
        temperature: 'Mát mẻ, dịu nhẹ',
        humidity: 'Độ ẩm: 60-70%',
        conditions: 'Nắng vàng, trời quang đãng'
      },
      characteristics: [
        'Thời tiết đẹp nhất trong năm ở nhiều vùng',
        'Lá cây chuyển màu vàng, đỏ rực rỡ',
        'Không khí trong lành, se lạnh dễ chịu',
        'Mùa thu hoạch, trái cây chín',
        'Bầu trời xanh ngắt, ít mưa'
      ],
      destinations: [
        {
          name: 'Vùng ôn đới có lá vàng',
          description: 'Rừng lá phong, công viên lá vàng, đường hầm cây',
          activities: ['Ngắm lá vàng', 'Chụp ảnh', 'Đi bộ']
        },
        {
          name: 'Vùng nông nghiệp',
          description: 'Ruộng lúa chín, vườn nho, đồi chè',
          activities: ['Thu hoạch', 'Tham quan', 'Trải nghiệm']
        },
        {
          name: 'Thành phố cổ kính',
          description: 'Kiến trúc cổ điển, phố đi bộ, bảo tàng',
          activities: ['Dạo phố', 'Ẩm thực', 'Văn hóa']
        }
      ],
      packing: {
        clothing: [
          'Áo len nhẹ, cardigan',
          'Áo khoác dài (denim, kaki)',
          'Quần jean, quần dài',
          'Áo sơ mi dài tay',
          'Boots hoặc giày thể thao'
        ],
        accessories: [
          'Khăn quàng cổ len',
          'Mũ len hoặc mũ nồi',
          'Găng tay mỏng (nếu đi vùng lạnh)',
          'Balo hoặc túi xách da',
          'Kính râm (nắng vẫn chói)'
        ],
        essentials: [
          'Kem dưỡng ẩm (da dễ khô)',
          'Son dưỡng môi có SPF',
          'Kem chống nắng SPF 30',
          'Nhiệt kế mini',
          'Thuốc cảm lạnh'
        ]
      },
      tips: [
        'Thời điểm tốt nhất để chụp ảnh với ánh sáng vàng',
        'Đặt tour ngắm lá vàng trước 1-2 tháng',
        'Mang theo áo ấm cho buổi sáng và tối',
        'Kiểm tra lịch lễ hội thu hoạch địa phương',
        'Thời tiết chuyển mùa, chuẩn bị thuốc cảm'
      ],
      activities: [
        'Ngắm lá vàng và chụp ảnh phong cảnh',
        'Tham gia lễ hội thu hoạch',
        'Đi xe đạp qua cánh đồng lúa chín',
        'Trekking leo núi ngắm toàn cảnh',
        'Thưởng thức đặc sản mùa thu'
      ],
      budget: {
        accommodation: 'Trung bình',
        food: 'Trung bình',
        transport: 'Trung bình',
        note: 'Giá hợp lý, có nhiều khuyến mãi sau mùa cao điểm'
      }
    },
    winter: {
      id: 'winter',
      name: 'Mùa Đông',
      icon: 'fluent:weather-snowflake-24-filled',
      color: 'blue',
      gradient: 'from-blue-400 to-cyan-500',
      months: 'Tháng 12 - Tháng 2',
      temp: '5-15°C',
      emoji: '❄️',
      galleryImages: [
        'https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?w=800',
        'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800',
        'https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=800',
        'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=800',
        'https://images.unsplash.com/photo-1421789497144-f50500b5fcf0?w=800',
        'https://images.unsplash.com/photo-1551582045-6ec9c11d8697?w=800',
        'https://images.unsplash.com/photo-1519944159858-806d435dc86f?w=800',
        'https://images.unsplash.com/photo-1484960055659-a39d25adcb3c?w=800'
      ],
      featuredImage: 'https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?w=1200',
      inspirationImages: [
        'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=600',
        'https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=600',
        'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=600',
        'https://images.unsplash.com/photo-1421789497144-f50500b5fcf0?w=600'
      ],
      weather: {
        temperature: 'Lạnh, có thể có băng tuyết',
        humidity: 'Độ ẩm: 65-80%',
        conditions: 'Trời âm u, sương mù dày'
      },
      characteristics: [
        'Nhiệt độ thấp, có thể xuống dưới 0°C ở vùng ôn đới',
        'Tuyết rơi tại các vùng cao và cực Bắc',
        'Ngày ngắn, đêm dài',
        'Mùa lễ hội cuối năm, không khí ấm cúng',
        'Có thể có sương mù dày đặc'
      ],
      destinations: [
        {
          name: 'Khu trượt tuyết',
          description: 'Núi tuyết, resort trượt tuyết, làng tuyết',
          activities: ['Trượt tuyết', 'Đánh tuyết', 'Ngắm tuyết']
        },
        {
          name: 'Thành phố Giáng sinh',
          description: 'Chợ Giáng sinh, trang trí đèn lộng lẫy, nhà thờ cổ',
          activities: ['Mua sắm', 'Lễ hội', 'Đếm ngược']
        },
        {
          name: 'Vùng nhiệt đới',
          description: 'Trốn lạnh, tìm đến vùng ấm áp có nắng',
          activities: ['Biển', 'Nghỉ dưỡng', 'Thư giãn']
        }
      ],
      packing: {
        clothing: [
          'Áo khoác dày, áo phao lông vũ',
          'Áo len dày, áo nỉ ấm',
          'Quần dài dày, quần bông',
          'Áo giữ nhiệt (thermal)',
          'Boots chống thấm, giày da'
        ],
        accessories: [
          'Mũ len dày',
          'Khăn quàng cổ dày',
          'Găng tay lông',
          'Tất len dày',
          'Khẩu trang giữ ấm'
        ],
        essentials: [
          'Kem dưỡng ẩm đặc trị',
          'Son dưỡng chống nứt',
          'Thuốc cảm cúm',
          'Túi chườm nóng',
          'Bình giữ nhiệt'
        ]
      },
      tips: [
        'Mặc nhiều lớp quần áo để dễ điều chỉnh nhiệt độ',
        'Bôi kem dưỡng ẩm thường xuyên vì da dễ khô',
        'Kiểm tra dự báo tuyết trước khi di chuyển',
        'Đặt phòng có sưởi ấm đầy đủ',
        'Đi giày có đế chống trượt trên băng tuyết'
      ],
      activities: [
        'Trượt tuyết, trượt băng',
        'Ngắm tuyết rơi và chụp ảnh',
        'Tham gia lễ hội Giáng sinh, Năm mới',
        'Tắm onsen (suối nước nóng)',
        'Thưởng thức món ăn ấm nóng truyền thống'
      ],
      budget: {
        accommodation: 'Cao (mùa lễ hội cuối năm)',
        food: 'Cao',
        transport: 'Cao',
        note: 'Giá cao nhất năm từ 20/12 đến 5/1, đặt trước 3-4 tháng'
      }
    }
  };

  const currentSeason = seasons[activeTab];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Cẩm Nang Du Lịch Theo Mùa
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Khám phá thế giới trong từng mùa - Lựa chọn thời điểm hoàn hảo cho chuyến đi của bạn
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
            {Object.values(seasons).map((season) => (
              <SwiperSlide key={season.id} style={{ width: 'auto' }}>
                <button
                  onClick={() => setActiveTab(season.id)}
                  className={`flex cursor-pointer items-center space-x-2 px-6 py-3 rounded-lg whitespace-nowrap transition-all font-medium ${
                    activeTab === season.id
                      ? "bg-gray-900 text-white shadow-lg"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  <Icon icon={season.icon} className="h-5 w-5" />
                  <span>{season.name}</span>
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Season Overview */}
        <div className="bg-white rounded-3xl border border-gray-200 p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center">
                <Icon icon={currentSeason.icon} className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">{currentSeason.name}</h2>
                <p className="text-gray-600">{currentSeason.months}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2 text-2xl font-bold text-gray-900">
                <Icon icon="fluent:temperature-24-filled" className="w-6 h-6 text-gray-900" />
                <span>{currentSeason.temp}</span>
              </div>
            </div>
          </div>

          {/* Weather Info */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <Icon icon="fluent:temperature-24-filled" className="w-5 h-5 text-gray-900" />
              <div>
                <p className="text-sm text-gray-600">Nhiệt độ</p>
                <p className="font-semibold text-gray-900">{currentSeason.weather.temperature}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <Icon icon="fluent:weather-rain-24-filled" className="w-5 h-5 text-gray-900" />
              <div>
                <p className="text-sm text-gray-600">Độ ẩm</p>
                <p className="font-semibold text-gray-900">{currentSeason.weather.humidity}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <Icon icon="fluent:weather-cloudy-24-filled" className="w-5 h-5 text-gray-900" />
              <div>
                <p className="text-sm text-gray-600">Điều kiện</p>
                <p className="font-semibold text-gray-900">{currentSeason.weather.conditions}</p>
              </div>
            </div>
          </div>

          {/* Characteristics */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <Icon icon="fluent:checkmark-circle-24-filled" className="w-6 h-6 mr-2 text-gray-900" />
              <h3 className="text-xl font-bold text-gray-900">Đặc điểm khí hậu</h3>
            </div>
            <ul className="grid md:grid-cols-2 gap-3">
              {currentSeason.characteristics.map((char, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-gray-900 rounded-full mt-2"></span>
                  <span className="text-gray-700">{char}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Season Photo Gallery */}
        <div className="bg-white rounded-3xl border border-gray-200 p-8 mb-8">
          <div className="flex items-center mb-6">
            <Icon icon="fluent:image-24-filled" className="w-6 h-6 mr-2 text-gray-900" />
            <h3 className="text-2xl font-bold text-gray-900">Thư viện ảnh {currentSeason.name}</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {currentSeason.galleryImages.map((imgUrl, index) => (
              <div key={index} className="overflow-hidden rounded-xl border border-gray-200">
                <img 
                  src={imgUrl} 
                  alt={`${currentSeason.name} ${index + 1}`}
                  className="w-full h-full object-cover aspect-square"
                />
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-4 text-center">Nhấn vào ảnh để xem kích thước lớn hơn</p>
        </div>

        {/* Destinations */}
        <div className="bg-white rounded-3xl border border-gray-200 p-8 mb-8">
          <div className="flex items-center mb-6">
            <Icon icon="fluent:location-24-filled" className="w-6 h-6 mr-2 text-gray-900" />
            <h3 className="text-2xl font-bold text-gray-900">Điểm đến lý tưởng</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {currentSeason.destinations.map((dest, index) => (
              <div key={index} className="rounded-xl border border-gray-200 hover:shadow-lg transition-all overflow-hidden">
                {/* Destination Image */}
                <div className="relative aspect-video overflow-hidden">
                  <img 
                    src={currentSeason.galleryImages[index] || currentSeason.galleryImages[0]} 
                    alt={dest.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-white bg-opacity-90 px-3 py-1 rounded-full">
                    <span className="text-xs font-bold text-gray-900">#{index + 1}</span>
                  </div>
                </div>
                {/* Destination Content */}
                <div className="p-6">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{dest.name}</h4>
                  <p className="text-gray-600 mb-4">{dest.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {dest.activities.map((activity, idx) => (
                      <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-900 rounded-full text-sm font-medium">
                        {activity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Packing List */}
        <div className="bg-white rounded-3xl border border-gray-200 p-8 mb-8">
          <div className="flex items-center mb-6">
            <Icon icon="fluent:luggage-24-filled" className="w-6 h-6 mr-2 text-gray-900" />
            <h3 className="text-2xl font-bold text-gray-900">Chuẩn bị hành lý</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="flex items-center mb-4">
                <Icon icon="fluent:shirt-24-filled" className="h-6 w-6 text-gray-900 mr-2" />
                <h4 className="text-lg font-bold text-gray-900">Quần áo</h4>
              </div>
              <ul className="space-y-2">
                {currentSeason.packing.clothing.map((item, index) => (
                  <li key={index} className="flex items-center space-x-2 text-gray-700">
                    <Icon icon="fluent:checkmark-circle-24-filled" className="w-4 h-4 text-gray-900" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="flex items-center mb-4">
                <Icon icon="fluent:backpack-24-filled" className="h-6 w-6 text-gray-900 mr-2" />
                <h4 className="text-lg font-bold text-gray-900">Phụ kiện</h4>
              </div>
              <ul className="space-y-2">
                {currentSeason.packing.accessories.map((item, index) => (
                  <li key={index} className="flex items-center space-x-2 text-gray-700">
                    <Icon icon="fluent:checkmark-circle-24-filled" className="w-4 h-4 text-gray-900" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="flex items-center mb-4">
                <Icon icon="fluent:heart-pulse-24-filled" className="h-6 w-6 text-gray-900 mr-2" />
                <h4 className="text-lg font-bold text-gray-900">Đồ cần thiết</h4>
              </div>
              <ul className="space-y-2">
                {currentSeason.packing.essentials.map((item, index) => (
                  <li key={index} className="flex items-center space-x-2 text-gray-700">
                    <Icon icon="fluent:checkmark-circle-24-filled" className="w-4 h-4 text-gray-900" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Tips & Budget */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Tips */}
          <div className="bg-white rounded-3xl border border-gray-200 p-8">
            <div className="flex items-center mb-6">
              <Icon icon="fluent:warning-24-filled" className="w-6 h-6 mr-2 text-gray-900" />
              <h3 className="text-2xl font-bold text-gray-900">Lưu ý quan trọng</h3>
            </div>
            <ul className="space-y-2">
              {currentSeason.tips.map((tip, index) => (
                <li key={index} className="flex items-start space-x-3 p-2 bg-gray-50 rounded-lg">
                  <span className="font-bold text-gray-900 mt-0.5">#{index + 1}</span>
                  <span className="text-gray-700 leading-snug">{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Budget & Activities */}
          <div className="space-y-8">
            <div className="bg-white rounded-3xl border border-gray-200 p-8">
              <div className="flex items-center mb-6">
                <Icon icon="fluent:wallet-24-filled" className="w-6 h-6 mr-2 text-gray-900" />
                <h3 className="text-2xl font-bold text-gray-900">Ngân sách tham khảo</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                  <span className="font-semibold text-gray-700">Chỗ ở</span>
                  <span className="text-gray-900 font-bold">{currentSeason.budget.accommodation}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                  <span className="font-semibold text-gray-700">Ăn uống</span>
                  <span className="text-gray-900 font-bold">{currentSeason.budget.food}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                  <span className="font-semibold text-gray-700">Di chuyển</span>
                  <span className="text-gray-900 font-bold">{currentSeason.budget.transport}</span>
                </div>
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-700">
                    <strong className="text-gray-900">Lưu ý:</strong> {currentSeason.budget.note}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-200 p-8">
              <div className="flex items-center mb-6">
                <Icon icon="fluent:star-24-filled" className="w-6 h-6 mr-2 text-gray-900" />
                <h3 className="text-2xl font-bold text-gray-900">Hoạt động nổi bật</h3>
              </div>
              <ul className="space-y-2">
                {currentSeason.activities.map((activity, index) => (
                  <li key={index} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                    <span className="w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </span>
                    <span className="text-gray-700 leading-snug">{activity}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* General Tips Section */}
        <div className="mt-8 bg-gray-50 rounded-3xl border border-gray-200 p-8">
          <div className="flex items-center mb-6">
            <Icon icon="fluent:globe-24-filled" className="w-6 h-6 mr-2 text-gray-900" />
            <h3 className="text-2xl font-bold text-gray-900">Lời khuyên chung cho mọi chuyến đi</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold text-lg mb-3 text-gray-900">Trước chuyến đi</h4>
              <ul className="space-y-2 text-gray-700">
                <li>• Kiểm tra visa và hộ chiếu (còn hạn ít nhất 6 tháng)</li>
                <li>• Mua bảo hiểm du lịch toàn diện</li>
                <li>• Đặt vé máy bay và khách sạn trước 2-3 tháng</li>
                <li>• Nghiên cứu văn hóa và phong tục địa phương</li>
                <li>• Chuẩn bị bản sao các giấy tờ quan trọng</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-3 text-gray-900">Trong chuyến đi</h4>
              <ul className="space-y-2 text-gray-700">
                <li>• Luôn mang theo bản đồ và số điện thoại khẩn cấp</li>
                <li>• Giữ tiền và giấy tờ ở nơi an toàn</li>
                <li>• Uống nước đóng chai, tránh đồ ăn đường phố lạ</li>
                <li>• Tôn trọng văn hóa và con người địa phương</li>
                <li>• Chụp ảnh các địa điểm để dễ tìm đường về</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Health & Safety */}
        <div className="mt-8 bg-white rounded-3xl border border-gray-200 p-8">
          <div className="flex items-center mb-6">
            <Icon icon="fluent:shield-24-filled" className="w-6 h-6 mr-2 text-gray-900" />
            <h3 className="text-2xl font-bold text-gray-900">Sức khỏe & An toàn</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
              <h4 className="font-bold text-lg text-gray-900 mb-3">Sức khỏe</h4>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>✓ Tiêm phòng đầy đủ trước khi đi</li>
                <li>✓ Mang thuốc cá nhân đầy đủ</li>
                <li>✓ Biết cách xử lý cấp cứu cơ bản</li>
                <li>✓ Lưu số điện thoại bệnh viện gần nhất</li>
                <li>✓ Tránh làm việc quá sức trong ngày đầu</li>
              </ul>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
              <h4 className="font-bold text-lg text-gray-900 mb-3">An toàn</h4>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>✓ Không để lộ đồ giá trị ra ngoài</li>
                <li>✓ Tránh đi lại vào ban đêm ở nơi vắng</li>
                <li>✓ Sử dụng két sắt khách sạn</li>
                <li>✓ Cẩn thận với người lạ quá thân thiện</li>
                <li>✓ Đăng ký thông tin với đại sứ quán</li>
              </ul>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
              <h4 className="font-bold text-lg text-gray-900 mb-3">Môi trường</h4>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>✓ Không vứt rác bừa bãi</li>
                <li>✓ Sử dụng túi tái chế</li>
                <li>✓ Hạn chế sử dụng nhựa dùng một lần</li>
                <li>✓ Tôn trọng động vật hoang dã</li>
                <li>✓ Hỗ trợ doanh nghiệp địa phương</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Communication Tips */}
        <div className="mt-8 bg-white rounded-3xl border border-gray-200 p-8">
          <div className="flex items-center mb-6">
            <Icon icon="fluent:phone-24-filled" className="w-6 h-6 mr-2 text-gray-900" />
            <h3 className="text-2xl font-bold text-gray-900">Giao tiếp & Kết nối</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold text-lg text-gray-900 mb-4">Chuẩn bị trước</h4>
              <div className="space-y-3">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h5 className="font-semibold text-gray-900 mb-2">Internet & Điện thoại</h5>
                  <p className="text-sm text-gray-700">Mua SIM du lịch hoặc thuê bộ phát wifi di động. Tải ứng dụng dịch thuật offline (Google Translate, iTranslate).</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h5 className="font-semibold text-gray-900 mb-2">Ứng dụng cần thiết</h5>
                  <p className="text-sm text-gray-700">Maps.me (bản đồ offline), XE Currency (quy đổi tiền), TripAdvisor (đánh giá địa điểm).</p>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-lg text-gray-900 mb-4">Ngôn ngữ cơ bản</h4>
              <div className="space-y-3">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h5 className="font-semibold text-gray-900 mb-2">Cụm từ hữu ích</h5>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Xin chào / Tạm biệt</li>
                    <li>• Cảm ơn / Xin lỗi</li>
                    <li>• Cái này giá bao nhiêu?</li>
                    <li>• Nhà vệ sinh ở đâu?</li>
                    <li>• Tôi cần giúp đỡ</li>
                  </ul>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h5 className="font-semibold text-gray-900 mb-2">Giao tiếp phi ngôn ngữ</h5>
                  <p className="text-sm text-gray-700">Sử dụng ngôn ngữ cơ thể, nụ cười và cử chỉ lịch sự. Mang theo ảnh minh họa cho các nhu cầu cơ bản.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Money Management */}
        <div className="mt-8 bg-white rounded-3xl border border-gray-200 p-8">
          <div className="flex items-center mb-6">
            <Icon icon="fluent:wallet-24-filled" className="w-6 h-6 mr-2 text-gray-900" />
            <h3 className="text-2xl font-bold text-gray-900">Quản lý tài chính</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-5 border-l-4 border-primary bg-gray-50 rounded-r-lg">
                <h4 className="font-bold text-gray-900 mb-2">Tiền mặt</h4>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• Đổi tiền tại ngân hàng hoặc sân bay (tỷ giá tốt hơn)</li>
                  <li>• Mang theo tiền USD hoặc EUR để dự phòng</li>
                  <li>• Cất tiền ở nhiều nơi khác nhau</li>
                  <li>• Giữ lại biên lai đổi tiền</li>
                </ul>
              </div>
              <div className="p-5 border-l-4 border-primary bg-gray-50 rounded-r-lg">
                <h4 className="font-bold text-gray-900 mb-2">Thẻ ngân hàng</h4>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• Thông báo ngân hàng về kế hoạch du lịch</li>
                  <li>• Mang theo 2 loại thẻ (Visa, Mastercard)</li>
                  <li>• Biết số hotline của ngân hàng</li>
                  <li>• Kiểm tra phí giao dịch quốc tế</li>
                </ul>
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-5 border-l-4 border-primary bg-gray-50 rounded-r-lg">
                <h4 className="font-bold text-gray-900 mb-2">Mẹo tiết kiệm</h4>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• Đặt vé máy bay vào thứ 3, 4 (giá rẻ hơn)</li>
                  <li>• Ở hostel hoặc homestay thay vì khách sạn</li>
                  <li>• Ăn tại quán địa phương, tránh khu du lịch</li>
                  <li>• Sử dụng phương tiện công cộng</li>
                  <li>• Mua vé combo để được giảm giá</li>
                </ul>
              </div>
              <div className="p-5 border-l-4 border-primary bg-gray-50 rounded-r-lg">
                <h4 className="font-bold text-gray-900 mb-2">Ngân sách dự phòng</h4>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• Dự trù thêm 20-30% tổng ngân sách</li>
                  <li>• Chuẩn bị cho các trường hợp khẩn cấp</li>
                  <li>• Mua bảo hiểm hủy chuyến bay</li>
                  <li>• Theo dõi chi tiêu hàng ngày</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Travel Inspiration Gallery */}
        <div className="mt-8 bg-white rounded-3xl border border-gray-200 overflow-hidden">
          <div className="flex items-center bg-primary px-8 py-4">
            <Icon icon="fluent:image-sparkle-24-filled" className="w-6 h-6 mr-2 text-white" />
            <h3 className="text-2xl font-bold text-white">Cảm hứng du lịch {currentSeason.name}</h3>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Large Featured Image */}
              <div className="md:col-span-2 md:row-span-2">
                <div className="relative h-full min-h-[400px] overflow-hidden rounded-2xl border border-gray-200">
                  <img 
                    src={currentSeason.featuredImage} 
                    alt={`Featured ${currentSeason.name}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none">
                    <div className="absolute bottom-6 left-6">
                      <p className="text-2xl font-bold text-white mb-2 drop-shadow-lg">{currentSeason.emoji} Ảnh nổi bật</p>
                      <p className="text-sm text-white/90 drop-shadow">Khung cảnh đẹp nhất mùa {currentSeason.name.toLowerCase()}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Small Images Grid */}
              {currentSeason.inspirationImages.map((imgUrl, index) => (
                <div key={index} className="aspect-square overflow-hidden rounded-xl border border-gray-200">
                  <img 
                    src={imgUrl} 
                    alt={`Inspiration ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-start space-x-3">
                <Icon icon="fluent:lightbulb-24-filled" className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-1">Mẹo chụp ảnh đẹp</p>
                  <p className="text-sm text-gray-700">
                    Tham khảo các bức ảnh này để lên ý tưởng cho chuyến đi của bạn. Đừng quên ghé thăm các địa điểm vào golden hour để có ánh sáng đẹp nhất!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Photography Tips */}
        <div className="mt-8 bg-gray-50 rounded-3xl border border-gray-200 p-8">
          <div className="flex items-center mb-6">
            <Icon icon="fluent:camera-24-filled" className="w-6 h-6 mr-2 text-gray-900" />
            <h3 className="text-2xl font-bold text-gray-900">Bí quyết chụp ảnh du lịch đẹp</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-xl border border-gray-200">
              <h4 className="font-bold text-lg mb-3 text-gray-900">Thời gian vàng</h4>
              <p className="text-sm text-gray-700 mb-2">
                Chụp vào golden hour (1 giờ sau bình minh hoặc trước hoàng hôn) để có ánh sáng đẹp nhất.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Bình minh: 5h30 - 7h00</li>
                <li>• Hoàng hôn: 17h00 - 18h30</li>
              </ul>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-200">
              <h4 className="font-bold text-lg mb-3 text-gray-900">Góc chụp</h4>
              <p className="text-sm text-gray-700">
                Thử nghiệm nhiều góc độ khác nhau: chụp từ trên cao, từ thấp lên, góc nghiêng, đối xứng.
              </p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-200">
              <h4 className="font-bold text-lg mb-3 text-gray-900">Chuẩn bị</h4>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Sạc đầy pin và mang pin dự phòng</li>
                <li>• Thẻ nhớ dung lượng cao</li>
                <li>• Lens đa dụng (24-70mm)</li>
                <li>• Tripod gấp gọn nếu cần</li>
              </ul>
            </div>
          </div>
        </div>

      </div>

      {/* Footer */}
      <footer className="bg-white py-6 sm:py-8 mt-auto">
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
                  to={item?.to || path.LANDING}
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

export default SeasonalTravelGuidePage;