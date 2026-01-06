# 📚 Library Management System

A modern, feature-rich Library Management System built with React, TypeScript, and Tailwind CSS. This application provides a complete solution for managing library operations including book inventory, borrowing/returning, reservations, fines, and user management.

## ✨ Features

### 🔐 Authentication & User Management
- Role-based access control (Admin, Librarian, Student)
- Secure login system with JWT-based authentication
- User profile management
- Protected routes based on user roles

### 📖 Book Management
- Add, edit, and delete books
- Track multiple copies of each book
- Book metadata (ISBN, author, category, publisher, etc.)
- Rack/shelf location tracking
- Advanced search and filtering

### 📚 Borrowing & Returning
- Issue books to users
- Return books with automatic fine calculation
- Renew books (with configurable renewal limits)
- Track active borrows and overdue books
- Automatic due date calculation

### 📅 Reservations
- Reserve unavailable books
- Notification system for available books
- Track reservation status

### 💰 Fine Management
- Automatic fine calculation for overdue books
- Multiple payment methods (Cash, Card, Online)
- Payment history tracking
- Pending and paid fine management

### 📊 Dashboard & Analytics
- Real-time statistics
- Weekly activity charts
- Category-wise book distribution
- Overdue books tracking
- Today's issues and returns

### ⚙️ Settings
- Configurable borrowing rules
- Fine rates management
- Library hours configuration
- Max books per user settings

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository or navigate to the project directory:
```bash
cd "D:\Ashok\FED project"
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🔑 Demo Accounts

The application comes with pre-configured demo accounts:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@library.com | password |
| Librarian | librarian@library.com | password |
| Student | student@library.com | password |

## 🛠️ Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **React Router** - Routing
- **Recharts** - Data visualization
- **Lucide React** - Icons
- **date-fns** - Date utilities

## 📁 Project Structure

```
src/
├── components/
│   ├── auth/
│   │   └── ProtectedRoute.tsx
│   └── layout/
│       ├── DashboardLayout.tsx
│       ├── Sidebar.tsx
│       └── TopNav.tsx
├── pages/
│   ├── Dashboard.tsx
│   ├── Login.tsx
│   ├── Books.tsx
│   ├── Borrow.tsx
│   ├── Reservations.tsx
│   ├── Fines.tsx
│   ├── Users.tsx
│   └── Settings.tsx
├── store/
│   ├── authStore.ts
│   └── libraryStore.ts
├── services/
│   └── mockData.ts
├── types/
│   └── index.ts
├── App.tsx
├── main.tsx
└── index.css
```

## 🎨 Design System

The application follows a modern, minimal SaaS design with:
- **Primary Color**: Green (#6BAA6F, #79C081)
- **Neutral Colors**: Light grays for backgrounds and borders
- **Typography**: Inter/Poppins font family
- **Spacing**: Generous padding and margins for readability
- **Components**: Card-based layout with soft shadows

## 📝 Key Features in Detail

### Search & Filter
- Global search across titles, authors, and ISBNs
- Category-based filtering
- Real-time search results

### Book Copies Tracking
- Individual copy management
- Copy status (available, borrowed, reserved, maintenance)
- Copy condition tracking

### Automatic Fine Calculation
- Calculates fines based on overdue days
- Configurable fine rate per day
- Automatic fine generation on return

### Role-Based Permissions
- **Admin**: Full system access
- **Librarian**: Can manage books, issue/return, view reports
- **Student**: Can view books, borrow, reserve, view own fines

## 🔄 State Management

The application uses Zustand for state management with:
- Persistent storage for authentication
- Centralized library data management
- Reactive updates across components

## 🚧 Future Enhancements

- [ ] QR Code/Barcode scanning
- [ ] Email notifications
- [ ] Activity log tracking
- [ ] CSV/Excel import/export
- [ ] Dark mode
- [ ] Advanced reporting
- [ ] Multi-library support

## 📄 License

This project is open source and available for educational purposes.

## 👨‍💻 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

---

Built with ❤️ using React and TypeScript
