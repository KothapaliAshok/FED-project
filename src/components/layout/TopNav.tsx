import { Bell, Search, User } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export default function TopNav() {
  const { user } = useAuthStore();

  return (
    <div className="h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-8 fixed top-0 left-20 right-0 z-10">
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            type="text"
            placeholder="Search books, authors, ISBN..."
            className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-neutral-500">
          <span>{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
          <span className="text-neutral-300">|</span>
          <span>{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>

        <button className="relative p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-neutral-200">
          <div className="text-right">
            <p className="text-sm font-medium text-neutral-700">{user?.name}</p>
            <p className="text-xs text-neutral-500 capitalize">
              {user?.role === 'admin' && '👑 Admin'}
              {user?.role === 'librarian' && '📚 Librarian'}
              {user?.role === 'student' && '🎓 Student'}
            </p>
          </div>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            user?.role === 'admin' ? 'bg-purple-100' :
            user?.role === 'librarian' ? 'bg-blue-100' :
            'bg-primary-100'
          }`}>
            <span className={`text-sm font-semibold ${
              user?.role === 'admin' ? 'text-purple-600' :
              user?.role === 'librarian' ? 'text-blue-600' :
              'text-primary-600'
            }`}>
              {user?.name.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

