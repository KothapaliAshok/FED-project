import { useState } from 'react';
import { Settings as SettingsIcon, Save, BookOpen, Clock, DollarSign, Users } from 'lucide-react';
import { useLibraryStore } from '../store/libraryStore';

export default function Settings() {
  const { settings, initialize } = useLibraryStore();
  const [formData, setFormData] = useState({
    maxBooksPerUser: settings.maxBooksPerUser,
    borrowingDurationDays: settings.borrowingDurationDays,
    finePerDay: settings.finePerDay,
    maxRenewals: settings.maxRenewals,
    openingHours: settings.openingHours,
    closingHours: settings.closingHours,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would update the settings in the store
    alert('Settings saved successfully!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-700 mb-2">Settings</h1>
        <p className="text-neutral-500">Configure library management settings</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg font-semibold text-neutral-700">Borrowing Rules</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Max Books Per User
              </label>
              <input
                type="number"
                value={formData.maxBooksPerUser}
                onChange={(e) =>
                  setFormData({ ...formData, maxBooksPerUser: parseInt(e.target.value) || 0 })
                }
                className="input-field"
                min="1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Borrowing Duration (Days)
              </label>
              <input
                type="number"
                value={formData.borrowingDurationDays}
                onChange={(e) =>
                  setFormData({ ...formData, borrowingDurationDays: parseInt(e.target.value) || 0 })
                }
                className="input-field"
                min="1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Max Renewals
              </label>
              <input
                type="number"
                value={formData.maxRenewals}
                onChange={(e) =>
                  setFormData({ ...formData, maxRenewals: parseInt(e.target.value) || 0 })
                }
                className="input-field"
                min="0"
                required
              />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <DollarSign className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg font-semibold text-neutral-700">Fine Management</h2>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Fine Per Day ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.finePerDay}
              onChange={(e) =>
                setFormData({ ...formData, finePerDay: parseFloat(e.target.value) || 0 })
              }
              className="input-field"
              min="0"
              required
            />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <Clock className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg font-semibold text-neutral-700">Library Hours</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Opening Hours
              </label>
              <input
                type="time"
                value={formData.openingHours}
                onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Closing Hours
              </label>
              <input
                type="time"
                value={formData.closingHours}
                onChange={(e) => setFormData({ ...formData, closingHours: e.target.value })}
                className="input-field"
                required
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" className="btn-primary flex items-center gap-2">
            <Save className="w-5 h-5" />
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}

