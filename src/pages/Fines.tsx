import { useEffect, useState } from 'react';
import { DollarSign, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useLibraryStore } from '../store/libraryStore';
import { useAuthStore } from '../store/authStore';
import { format } from 'date-fns';

export default function Fines() {
  const { fines, borrowRecords, books, payFine, calculateFines, initialize } = useLibraryStore();
  const { user } = useAuthStore();
  const [paymentMethod, setPaymentMethod] = useState('cash');

  useEffect(() => {
    if (books.length === 0) {
      initialize();
    }
    calculateFines();
  }, [books.length, initialize, calculateFines]);

  const userFines = user?.role === 'student'
    ? fines.filter((f) => f.userId === user.id)
    : fines;

  const pendingFines = userFines.filter((f) => f.status === 'pending');
  const paidFines = userFines.filter((f) => f.status === 'paid');
  const totalPending = pendingFines.reduce((sum, f) => sum + f.amount, 0);
  const totalPaid = paidFines.reduce((sum, f) => sum + f.amount, 0);

  const handlePayFine = (fineId: string) => {
    payFine(fineId, paymentMethod);
    alert('Fine paid successfully!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-700 mb-2">Fine Management</h1>
        <p className="text-neutral-500">View and manage library fines</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-neutral-700">Pending Fines</h3>
            <Clock className="w-5 h-5 text-yellow-500" />
          </div>
          <p className="text-3xl font-bold text-neutral-700">${totalPending.toFixed(2)}</p>
          <p className="text-sm text-neutral-500 mt-2">{pendingFines.length} fines</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-neutral-700">Paid Fines</h3>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-neutral-700">${totalPaid.toFixed(2)}</p>
          <p className="text-sm text-neutral-500 mt-2">{paidFines.length} fines</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-neutral-700">Total Fines</h3>
            <DollarSign className="w-5 h-5 text-primary-500" />
          </div>
          <p className="text-3xl font-bold text-neutral-700">${(totalPending + totalPaid).toFixed(2)}</p>
          <p className="text-sm text-neutral-500 mt-2">All time</p>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold text-neutral-700 mb-4">Pending Fines</h2>
        {pendingFines.length === 0 ? (
          <p className="text-neutral-500 text-center py-8">No pending fines</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Book</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Reason</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Amount</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-neutral-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingFines.map((fine) => {
                  const record = borrowRecords.find((r) => r.id === fine.borrowRecordId);
                  const book = books.find((b) => b.id === record?.bookId);
                  
                  return (
                    <tr key={fine.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-neutral-700">{book?.title}</p>
                          <p className="text-sm text-neutral-500">{book?.author}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-neutral-600">{fine.reason}</td>
                      <td className="py-4 px-4">
                        <span className="text-lg font-semibold text-red-600">${fine.amount.toFixed(2)}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end gap-2">
                          {user?.role !== 'student' && (
                            <select
                              value={paymentMethod}
                              onChange={(e) => setPaymentMethod(e.target.value)}
                              className="input-field text-sm w-32"
                            >
                              <option value="cash">Cash</option>
                              <option value="card">Card</option>
                              <option value="online">Online</option>
                            </select>
                          )}
                          <button
                            onClick={() => handlePayFine(fine.id)}
                            className="btn-primary text-sm"
                          >
                            Pay Fine
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {paidFines.length > 0 && (
        <div className="card">
          <h2 className="text-lg font-semibold text-neutral-700 mb-4">Payment History</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Book</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Amount</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Payment Method</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Paid Date</th>
                </tr>
              </thead>
              <tbody>
                {paidFines.map((fine) => {
                  const record = borrowRecords.find((r) => r.id === fine.borrowRecordId);
                  const book = books.find((b) => b.id === record?.bookId);
                  
                  return (
                    <tr key={fine.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-neutral-700">{book?.title}</p>
                          <p className="text-sm text-neutral-500">{book?.author}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-semibold text-neutral-700">${fine.amount.toFixed(2)}</span>
                      </td>
                      <td className="py-4 px-4 text-neutral-600 capitalize">{fine.paymentMethod}</td>
                      <td className="py-4 px-4 text-neutral-600">
                        {fine.paidAt ? format(new Date(fine.paidAt), 'MMM dd, yyyy') : 'N/A'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

