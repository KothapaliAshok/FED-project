import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  FileText,
  Calendar,
  Settings,
  LogOut,
  Search,
  UserCircle,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { UserRole } from '../../types';

interface MenuItem {
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  roles: UserRole[];
}

const allMenuItems: MenuItem[] = [
  { path: '/app/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['admin', 'librarian', 'student'] },
  { path: '/app/books', icon: BookOpen, label: 'Books', roles: ['admin', 'librarian', 'student'] },
  { path: '/app/borrow', icon: FileText, label: 'Borrow/Return', roles: ['admin', 'librarian'] },
  { path: '/app/reservations', icon: Calendar, label: 'Reservations', roles: ['admin', 'librarian', 'student'] },
  { path: '/app/users', icon: Users, label: 'Users', roles: ['admin'] },
  { path: '/app/fines', icon: FileText, label: 'Fines', roles: ['admin', 'librarian', 'student'] },
  { path: '/app/settings', icon: Settings, label: 'Settings', roles: ['admin'] },
];

export default function Sidebar() {
  const { user, logout } = useAuthStore();
  
  // Filter menu items based on user role
  const menuItems = allMenuItems.filter((item) => 
    item.roles.includes(user?.role || 'student')
  );

  return (
    <div className="w-20 bg-white border-r border-neutral-200 flex flex-col items-center py-6 h-screen fixed left-0 top-0">
      <div className="mb-8">
        <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center">
          <BookOpen className="w-6 h-6 text-white" />
        </div>
      </div>

      <nav className="flex-1 flex flex-col gap-2 w-full px-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `w-full h-14 flex items-center justify-center rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-neutral-400 hover:bg-neutral-50 hover:text-neutral-600'
                }`
              }
              title={item.label}
            >
              <Icon className="w-5 h-5" />
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-auto">
        <button
          onClick={logout}
          className="w-14 h-14 flex items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-50 hover:text-red-500 transition-all duration-200"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
        <div className="mt-4 w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mx-auto">
          <span className="text-primary-600 text-sm font-semibold">
            {user?.name.charAt(0).toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
}

