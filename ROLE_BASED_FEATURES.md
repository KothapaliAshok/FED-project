# 🎭 Role-Based Access Control (RBAC) Implementation

This document outlines how different user roles interact with the Library Management System.

## 📋 Role Overview

### 👑 Admin
- **Full system access** - Can manage everything
- **All features enabled** - Complete control over the system
- **Analytics & Reports** - Full visibility into all metrics
- **User Management** - Can add/edit/delete all users
- **System Settings** - Configure library rules and policies

### 📚 Librarian
- **Operational access** - Day-to-day library operations
- **Book Management** - Can add/edit/delete books
- **Issue/Return** - Handle book transactions
- **Reservations** - Process reservation requests
- **Limited Analytics** - View operational metrics
- **No User Management** - Cannot manage users
- **No Settings** - Cannot change system settings

### 🎓 Student
- **Consumer access** - Personal library experience
- **Browse Books** - Search and view available books
- **Reserve Books** - Reserve unavailable books
- **View Own Data** - See only their borrows, fines, reservations
- **No Management** - Cannot manage books or users
- **Personal Dashboard** - Simplified, personalized view

---

## 🎨 UI Differences by Role

### Sidebar Navigation

#### Admin Sidebar
- ✅ Dashboard
- ✅ Books
- ✅ Borrow/Return
- ✅ Reservations
- ✅ Users (Admin only)
- ✅ Fines
- ✅ Settings (Admin only)

#### Librarian Sidebar
- ✅ Dashboard
- ✅ Books
- ✅ Borrow/Return
- ✅ Reservations
- ❌ Users (Hidden)
- ✅ Fines
- ❌ Settings (Hidden)

#### Student Sidebar
- ✅ Dashboard
- ✅ Books
- ❌ Borrow/Return (Hidden - they use "My Borrows" in dashboard)
- ✅ Reservations
- ❌ Users (Hidden)
- ✅ Fines (Only their own)
- ❌ Settings (Hidden)

---

## 📊 Dashboard Views

### Admin Dashboard
**Full Analytics View:**
- Total Books
- Active Borrows
- Overdue Books
- Today's Issues (with trend indicators)
- Weekly Activity Chart
- Books by Category Chart
- Reservations Overview
- Fines Overview
- Availability Status
- Today's Returns
- System Health

### Librarian Dashboard
**Operational View:**
- Total Books
- Active Borrows
- Overdue Books
- Today's Issues
- Weekly Activity Chart
- Books by Category Chart
- Reservations Overview
- Fines Overview
- Availability Status
- ❌ No "Today's Returns" widget
- ❌ No "System Health" widget

### Student Dashboard
**Personal View:**
- My Borrows
- Overdue Books
- Due Soon (within 3 days)
- My Reservations
- My Fines
- My Borrowed Books List (with due dates)
- ❌ No analytics charts
- ❌ No system-wide statistics

---

## 🔐 Feature Permissions Matrix

| Feature | Admin | Librarian | Student |
|---------|-------|-----------|---------|
| **View All Books** | ✅ | ✅ | ✅ |
| **Add/Edit/Delete Books** | ✅ | ✅ | ❌ |
| **Issue Books** | ✅ | ✅ | ❌ |
| **Return Books** | ✅ | ✅ | ❌ |
| **Renew Books** | ✅ | ✅ | ✅ (Own only) |
| **Reserve Books** | ✅ | ✅ | ✅ |
| **View All Borrows** | ✅ | ✅ | ❌ |
| **View Own Borrows** | ✅ | ✅ | ✅ |
| **View All Fines** | ✅ | ✅ | ❌ |
| **View Own Fines** | ✅ | ✅ | ✅ |
| **Pay Fines** | ✅ | ✅ | ✅ |
| **Manage Users** | ✅ | ❌ | ❌ |
| **View Analytics** | ✅ | ✅ (Limited) | ❌ |
| **System Settings** | ✅ | ❌ | ❌ |
| **Activity Logs** | ✅ | ✅ (Limited) | ❌ |

---

## 🎯 Page-Specific Role Behavior

### Books Page
- **Admin/Librarian**: Full CRUD operations, see all books
- **Student**: Browse only, can reserve unavailable books

### Borrow/Return Page
- **Admin/Librarian**: 
  - Issue Book tab
  - Return Book tab
  - Active Borrows tab (all users)
- **Student**: 
  - Only "My Borrows" tab
  - Can renew own books
  - Can return own books

### Reservations Page
- **Admin/Librarian**: View all reservations, fulfill requests
- **Student**: View own reservations, create new reservations

### Fines Page
- **Admin/Librarian**: View all fines, process payments
- **Student**: View only own fines, pay own fines

### Users Page
- **Admin Only**: Full user management
- **Librarian/Student**: Route protected, redirects to dashboard

### Settings Page
- **Admin Only**: Configure library rules
- **Librarian/Student**: Route protected, redirects to dashboard

---

## 🎨 Visual Role Indicators

### Top Navigation Bar
- **Role Badge**: Shows role with emoji
  - 👑 Admin (Purple badge)
  - 📚 Librarian (Blue badge)
  - 🎓 Student (Green badge)
- **User Avatar**: Color-coded by role

### Sidebar
- **Menu Items**: Dynamically filtered based on role
- **Active State**: Highlights current page

---

## 🔄 Dynamic UI Adaptation

The application uses **conditional rendering** throughout:

```typescript
// Example: Role-based menu filtering
const menuItems = allMenuItems.filter((item) => 
  item.roles.includes(user?.role || 'student')
);

// Example: Role-based content
{user?.role === 'admin' && <AdminAnalytics />}
{user?.role === 'librarian' && <LibrarianTools />}
{user?.role === 'student' && <StudentDashboard />}
```

---

## ✅ Implementation Checklist

- [x] Role-based sidebar navigation
- [x] Role-specific dashboard views
- [x] Protected routes (Users, Settings)
- [x] Conditional feature visibility
- [x] Role-based data filtering
- [x] Visual role indicators
- [x] Student reservation feature
- [x] Role-based page headers and descriptions
- [x] Admin-only analytics widgets
- [x] Student personal dashboard

---

## 🚀 Testing Different Roles

### Test as Admin
1. Login: `admin@library.com` / `password`
2. You should see: All menu items, full analytics, user management, settings

### Test as Librarian
1. Login: `librarian@library.com` / `password`
2. You should see: Books, Borrow/Return, Reservations, Fines (no Users/Settings)

### Test as Student
1. Login: `student@library.com` / `password`
2. You should see: Personal dashboard, browse books, my borrows, reservations

---

## 📝 Notes

- All roles use the **same layout structure** for consistency
- **Design language** remains uniform across roles
- **Permissions** are enforced both in UI and routing
- **Data filtering** happens at the component level
- **Role checks** are performed using Zustand store

