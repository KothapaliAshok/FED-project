import { useState, useEffect } from 'react';
import { BookOpen, User, Calendar, RotateCcw, CheckCircle } from 'lucide-react';
import { useLibraryStore } from '../store/libraryStore';
import { useAuthStore } from '../store/authStore';
import { format } from 'date-fns';

export default function Borrow() {
  const { books, borrowRecords, bookCopies, issueBook, returnBook, renewBook, initialize } = useLibraryStore();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'issue' | 'return' | 'active'>('issue');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedBookId, setSelectedBookId] = useState('');
  const [selectedCopyId, setSelectedCopyId] = useState('');

  useEffect(() => {
    if (books.length === 0) {
      initialize();
    }
  }, [books.length, initialize]);

  const availableBooks = books.filter((book) => book.availableCopies > 0);
  const availableCopies = bookCopies.filter(
    (copy) => copy.bookId === selectedBookId && copy.status === 'available'
  );

  const activeBorrows = borrowRecords.filter((r) => r.status === 'active' || r.status === 'overdue');
  const userActiveBorrows = user?.role === 'student'
    ? activeBorrows.filter((r) => r.userId === user.id)
    : activeBorrows;

  const handleIssue = () => {
    if (selectedUserId && selectedCopyId && selectedBookId) {
      issueBook(selectedUserId, selectedCopyId, selectedBookId);
      setSelectedBookId('');
      setSelectedCopyId('');
      alert('Book issued successfully!');
    }
  };

  const handleReturn = (borrowId: string) => {
    returnBook(borrowId);
    alert('Book returned successfully!');
  };

  const handleRenew = (borrowId: string) => {
    renewBook(borrowId);
    alert('Book renewed successfully!');
  };

  // Mock users for demo
  const mockUsers = [
    { id: '1', name: 'Admin User', email: 'admin@library.com' },
    { id: '2', name: 'Librarian User', email: 'librarian@library.com' },
    { id: '3', name: 'Student User', email: 'student@library.com' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-700 mb-2">
          {user?.role === 'student' ? 'My Borrows' : 'Borrow & Return'}
        </h1>
        <p className="text-neutral-500">
          {user?.role === 'student' 
            ? 'View and manage your borrowed books' 
            : 'Manage book transactions'}
        </p>
      </div>

      {(user?.role === 'admin' || user?.role === 'librarian') && (
        <div className="flex gap-2 border-b border-neutral-200">
          <button
            onClick={() => setActiveTab('issue')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'issue'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-neutral-500 hover:text-neutral-700'
            }`}
          >
            Issue Book
          </button>
          <button
            onClick={() => setActiveTab('return')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'return'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-neutral-500 hover:text-neutral-700'
            }`}
          >
            Return Book
          </button>
          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'active'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-neutral-500 hover:text-neutral-700'
            }`}
          >
            Active Borrows
          </button>
        </div>
      )}
      
      {user?.role === 'student' && (
        <div className="flex gap-2 border-b border-neutral-200">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'active'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-neutral-500 hover:text-neutral-700'
            }`}
          >
            My Borrows
          </button>
        </div>
      )}

      {(user?.role === 'admin' || user?.role === 'librarian') && activeTab === 'issue' && (
        <div className="card">
          <h2 className="text-lg font-semibold text-neutral-700 mb-4">Issue New Book</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Select User
              </label>
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="input-field"
              >
                <option value="">Choose a user...</option>
                {mockUsers.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.email})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Select Book
              </label>
              <select
                value={selectedBookId}
                onChange={(e) => {
                  setSelectedBookId(e.target.value);
                  setSelectedCopyId('');
                }}
                className="input-field"
              >
                <option value="">Choose a book...</option>
                {availableBooks.map((book) => (
                  <option key={book.id} value={book.id}>
                    {book.title} by {book.author} ({book.availableCopies} available)
                  </option>
                ))}
              </select>
            </div>

            {selectedBookId && availableCopies.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Select Copy
                </label>
                <select
                  value={selectedCopyId}
                  onChange={(e) => setSelectedCopyId(e.target.value)}
                  className="input-field"
                >
                  <option value="">Choose a copy...</option>
                  {availableCopies.map((copy) => (
                    <option key={copy.id} value={copy.id}>
                      {copy.copyNumber} - {copy.condition}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              onClick={handleIssue}
              disabled={!selectedUserId || !selectedCopyId}
              className="btn-primary"
            >
              Issue Book
            </button>
          </div>
        </div>
      )}

      {(user?.role === 'admin' || user?.role === 'librarian') && activeTab === 'return' && (
        <div className="card">
          <h2 className="text-lg font-semibold text-neutral-700 mb-4">Return Book</h2>
          <div className="space-y-4">
            {userActiveBorrows.length === 0 ? (
              <p className="text-neutral-500">No active borrows to return</p>
            ) : (
              <div className="space-y-3">
                {userActiveBorrows.map((record) => {
                  const book = books.find((b) => b.id === record.bookId);
                  const isOverdue = new Date(record.dueDate) < new Date() && record.status === 'active';
                  
                  return (
                    <div
                      key={record.id}
                      className="border border-neutral-200 rounded-lg p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
                          <BookOpen className="w-6 h-6 text-primary-600" />
                        </div>
                        <div>
                          <p className="font-medium text-neutral-700">{book?.title}</p>
                          <p className="text-sm text-neutral-500">Due: {format(new Date(record.dueDate), 'MMM dd, yyyy')}</p>
                          {isOverdue && (
                            <p className="text-sm text-red-600 font-medium">Overdue!</p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleReturn(record.id)}
                        className="btn-primary flex items-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Return
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'active' && (
        <div className="card">
          <h2 className="text-lg font-semibold text-neutral-700 mb-4">Active Borrows</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Book</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Issued Date</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Due Date</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Renewals</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-neutral-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {userActiveBorrows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-neutral-500">
                      No active borrows
                    </td>
                  </tr>
                ) : (
                  userActiveBorrows.map((record) => {
                    const book = books.find((b) => b.id === record.bookId);
                    const isOverdue = new Date(record.dueDate) < new Date() && record.status === 'active';
                    
                    return (
                      <tr key={record.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-medium text-neutral-700">{book?.title}</p>
                            <p className="text-sm text-neutral-500">{book?.author}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-neutral-600">
                          {format(new Date(record.issueDate), 'MMM dd, yyyy')}
                        </td>
                        <td className="py-4 px-4">
                          <span className={isOverdue ? 'text-red-600 font-medium' : 'text-neutral-600'}>
                            {format(new Date(record.dueDate), 'MMM dd, yyyy')}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              record.status === 'overdue' || isOverdue
                                ? 'bg-red-50 text-red-700'
                                : 'bg-green-50 text-green-700'
                            }`}
                          >
                            {record.status === 'overdue' || isOverdue ? 'Overdue' : 'Active'}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-neutral-600">{record.renewals}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-end gap-2">
                            {record.renewals < 2 && (
                              <button
                                onClick={() => handleRenew(record.id)}
                                className="p-2 text-neutral-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                title="Renew"
                              >
                                <RotateCcw className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => handleReturn(record.id)}
                              className="btn-primary text-sm"
                            >
                              Return
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

