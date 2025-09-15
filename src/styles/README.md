# Travel Social Network - Custom Color System

## Tổng quan
Hệ thống màu tùy chỉnh cho Travel Social Network được thiết kế để tạo ra một bản sắc thương hiệu nhất quán và dễ quản lý.

## Cấu trúc màu

### 1. Primary Colors (Màu chính - Hồng)
- `travel-primary-50` đến `travel-primary-950`
- Màu chủ đạo cho logo, buttons, links
- Sử dụng: `text-travel-primary-600`, `bg-travel-primary-500`

### 2. Secondary Colors (Màu phụ - Đỏ)
- `travel-secondary-50` đến `travel-secondary-950`
- Màu bổ trợ cho primary
- Sử dụng: `text-travel-secondary-600`, `bg-travel-secondary-500`

### 3. Accent Colors (Màu nhấn - Rose)
- `travel-accent-50` đến `travel-accent-950`
- Màu nhấn cho các element đặc biệt
- Sử dụng: `text-travel-accent-600`, `bg-travel-accent-500`

## Gradient Classes

### Background Gradients
- `bg-travel-gradient`: Gradient chính (primary → secondary)
- `bg-travel-gradient-light`: Gradient nhẹ (100 → 100)
- `bg-travel-gradient-dark`: Gradient đậm (700 → 700)

### Text Gradients
- `text-travel-gradient`: Text với gradient chính

## Cách sử dụng

### Trong Tailwind Classes
```jsx
// Background colors
<div className="bg-travel-primary-500">
<div className="bg-travel-secondary-600">

// Text colors
<h1 className="text-travel-primary-600">
<p className="text-travel-secondary-700">

// Gradients
<button className="bg-travel-gradient">
<h1 className="text-travel-gradient">

// Hover states
<a className="hover:text-travel-primary-600">
<button className="hover:bg-travel-gradient-dark">
```

### Trong CSS Custom Properties
```css
.custom-element {
  background: var(--travel-gradient);
  color: var(--travel-primary-600);
  border-color: var(--travel-secondary-500);
}
```

## Cấu hình

### Tailwind Config (tailwind.config.js)
```javascript
theme: {
  extend: {
    colors: {
      'travel': {
        'primary': { /* 50-950 scale */ },
        'secondary': { /* 50-950 scale */ },
        'accent': { /* 50-950 scale */ }
      }
    }
  }
}
```

### CSS Variables (travel-colors.css)
Tất cả màu sắc được định nghĩa dưới dạng CSS custom properties trong `:root` để dễ dàng thay đổi theme.

## Lưu ý
- Luôn sử dụng các class utility có sẵn thay vì hardcode màu
- Kiểm tra contrast ratio khi kết hợp màu
- Sử dụng gradient cho các element quan trọng (buttons, headings)
- Test trên cả light và dark mode nếu có
