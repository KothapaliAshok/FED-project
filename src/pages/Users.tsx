import { useState } from 'react';
import { Users, UserPlus, Edit, Trash2, Shield, BookOpen } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { User, UserRole } from '../types';

export default function Users() {
  const { user: currentUser } = useAuthStore();
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      email: 'admin@library.com',
      name: 'Admin User',
      role: 'admin',
      phone: '+1234567890',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      email: 'librarian@library.com',
      name: 'Librarian User',
      role: 'librarian',
      phone: '+1234567891',
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      email: 'student@library.com',
      name: 'Student User',
      role: 'student',
      phone: '+1234567892',
      createdAt: new Date().toISOString(),
    },
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const canManage = currentUser?.role === 'admin';

  const handleDelete = (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter((u) => u.id !== userId));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-700 mb-2">User Management</h1>
          <p className="text-neutral-500">Manage library users and permissions</p>
        </div>
        {canManage && (
          <button onClick={() => setShowAddModal(true)} className="btn-primary flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Add User
          </button>
        )}
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">User</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Email</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Role</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Phone</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Joined</th>
                {canManage && (
                  <th className="text-right py-3 px-4 text-sm font-semibold text-neutral-700">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-primary-600 font-semibold">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-neutral-700">{user.name}</p>
                        {user.id === currentUser?.id && (
                          <p className="text-xs text-primary-600">You</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-neutral-600">{user.email}</td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        user.role === 'admin'
                          ? 'bg-purple-50 text-purple-700'
                          : user.role === 'librarian'
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-green-50 text-green-700'
                      }`}
                    >
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-neutral-600">{user.phone || 'N/A'}</td>
                  <td className="py-4 px-4 text-neutral-600 text-sm">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  {canManage && (
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingUser(user)}
                          className="p-2 text-neutral-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        {user.id !== currentUser?.id && (
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {(showAddModal || editingUser) && (
        <UserModal
          user={editingUser}
          onClose={() => {
            setShowAddModal(false);
            setEditingUser(null);
          }}
          onSave={(userData) => {
            if (editingUser) {
              setUsers(users.map((u) => (u.id === editingUser.id ? { ...u, ...userData } : u)));
            } else {
              setUsers([
                ...users,
                {
                  ...userData,
                  id: `user-${Date.now()}`,
                  createdAt: new Date().toISOString(),
                },
              ]);
            }
            setShowAddModal(false);
            setEditingUser(null);
          }}
        />
      )}
    </div>
  );
}

function UserModal({
  user,
  onClose,
  onSave,
}: {
  user: User | null;
  onClose: () => void;
  onSave: (userData: Partial<User>) => void;
}) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: (user?.role || 'student') as UserRole,
    phone: user?.phone || '',
    address: user?.address || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6 border-b border-neutral-200">
          <h2 className="text-xl font-bold text-neutral-700">
            {user ? 'Edit User' : 'Add New User'}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Role *</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
              className="input-field"
              required
            >
              <option value="student">Student</option>
              <option value="librarian">Librarian</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Address</label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="input-field"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {user ? 'Update' : 'Add'} User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

