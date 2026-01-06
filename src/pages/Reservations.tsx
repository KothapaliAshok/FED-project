import { useState, useEffect } from 'react';
import { Calendar, BookOpen, Bell, CheckCircle, XCircle } from 'lucide-react';
import { useLibraryStore } from '../store/libraryStore';
import { useAuthStore } from '../store/authStore';
import { format } from 'date-fns';

export default function Reservations() {
  const { books, reservations, createReservation, fulfillReservation, initialize } = useLibraryStore();
  const { user } = useAuthStore();
  const [selectedBookId, setSelectedBookId] = useState('');

  useEffect(() => {
    if (books.length === 0) {
      initialize();
    }
  }, [books.length, initialize]);

  const unavailableBooks = books.filter((book) => book.availableCopies === 0);
  const userReservations = user?.role === 'student'
    ? reservations.filter((r) => r.userId === user.id)
    : reservations;

  const handleReserve = () => {
    if (selectedBookId && user) {
      createReservation(user.id, selectedBookId);
      setSelectedBookId('');
      alert('Reservation created successfully!');
    }
  };

  const handleFulfill = (reservationId: string) => {
    fulfillReservation(reservationId);
    alert('Reservation fulfilled!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-700 mb-2">Reservations</h1>
        <p className="text-neutral-500">Manage book reservations and holds</p>
      </div>

      {user?.role === 'student' && (
        <div className="card">
          <h2 className="text-lg font-semibold text-neutral-700 mb-4">Create New Reservation</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Select Unavailable Book
              </label>
              <select
                value={selectedBookId}
                onChange={(e) => setSelectedBookId(e.target.value)}
                className="input-field"
              >
                <option value="">Choose a book...</option>
                {unavailableBooks.map((book) => (
                  <option key={book.id} value={book.id}>
                    {book.title} by {book.author}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handleReserve}
              disabled={!selectedBookId}
              className="btn-primary"
            >
              Reserve Book
            </button>
          </div>
        </div>
      )}

      <div className="card">
        <h2 className="text-lg font-semibold text-neutral-700 mb-4">
          {user?.role === 'student' ? 'My Reservations' : 'All Reservations'}
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Book</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Requested Date</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Status</th>
                {user?.role !== 'student' && (
                  <th className="text-right py-3 px-4 text-sm font-semibold text-neutral-700">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {userReservations.length === 0 ? (
                <tr>
                  <td colSpan={user?.role !== 'student' ? 4 : 3} className="text-center py-12 text-neutral-500">
                    No reservations found
                  </td>
                </tr>
              ) : (
                userReservations.map((reservation) => {
                  const book = books.find((b) => b.id === reservation.bookId);
                  
                  return (
                    <tr key={reservation.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-primary-600" />
                          </div>
                          <div>
                            <p className="font-medium text-neutral-700">{book?.title}</p>
                            <p className="text-sm text-neutral-500">{book?.author}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-neutral-600">
                        {format(new Date(reservation.requestedDate), 'MMM dd, yyyy')}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            reservation.status === 'fulfilled'
                              ? 'bg-green-50 text-green-700'
                              : reservation.status === 'available'
                              ? 'bg-blue-50 text-blue-700'
                              : 'bg-yellow-50 text-yellow-700'
                          }`}
                        >
                          {reservation.status === 'fulfilled' && <CheckCircle className="w-3 h-3 inline mr-1" />}
                          {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                        </span>
                      </td>
                      {user?.role !== 'student' && (
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-end gap-2">
                            {reservation.status === 'available' && (
                              <button
                                onClick={() => handleFulfill(reservation.id)}
                                className="btn-primary text-sm"
                              >
                                Fulfill
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

