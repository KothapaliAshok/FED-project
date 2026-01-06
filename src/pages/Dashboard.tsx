import { useEffect } from 'react';
import { BookOpen, Users, FileText, AlertCircle, TrendingUp, Calendar } from 'lucide-react';
import { useLibraryStore } from '../store/libraryStore';
import { useAuthStore } from '../store/authStore';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const { books, borrowRecords, reservations, fines, initialize, calculateFines } = useLibraryStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (books.length === 0) {
      initialize();
    }
    calculateFines();
  }, [books.length, initialize, calculateFines]);

  // Role-based data filtering
  const userBorrowRecords = user?.role === 'student' 
    ? borrowRecords.filter((r) => r.userId === user.id)
    : borrowRecords;
  
  const userFines = user?.role === 'student'
    ? fines.filter((f) => f.userId === user.id)
    : fines;

  const userReservations = user?.role === 'student'
    ? reservations.filter((r) => r.userId === user.id)
    : reservations;

  // Admin & Librarian Stats
  const adminStats = {
    totalBooks: books.length,
    totalCopies: books.reduce((sum, book) => sum + book.totalCopies, 0),
    availableCopies: books.reduce((sum, book) => sum + book.availableCopies, 0),
    activeBorrows: borrowRecords.filter((r) => r.status === 'active').length,
    overdueBooks: borrowRecords.filter((r) => r.status === 'overdue' || (r.status === 'active' && new Date(r.dueDate) < new Date())).length,
    pendingReservations: reservations.filter((r) => r.status === 'pending').length,
    totalFines: fines.filter((f) => f.status === 'pending').reduce((sum, f) => sum + f.amount, 0),
    todayIssues: borrowRecords.filter((r) => {
      const issueDate = new Date(r.issueDate);
      const today = new Date();
      return issueDate.toDateString() === today.toDateString();
    }).length,
    todayReturns: borrowRecords.filter((r) => {
      if (!r.returnDate) return false;
      const returnDate = new Date(r.returnDate);
      const today = new Date();
      return returnDate.toDateString() === today.toDateString();
    }).length,
  };

  // Student Stats
  const studentStats = {
    myBorrows: userBorrowRecords.filter((r) => r.status === 'active').length,
    overdueBooks: userBorrowRecords.filter((r) => {
      if (r.status !== 'active') return false;
      return new Date(r.dueDate) < new Date();
    }).length,
    myFines: userFines.filter((f) => f.status === 'pending').reduce((sum, f) => sum + f.amount, 0),
    myReservations: userReservations.filter((r) => r.status === 'pending' || r.status === 'available').length,
    dueSoon: userBorrowRecords.filter((r) => {
      if (r.status !== 'active') return false;
      const dueDate = new Date(r.dueDate);
      const today = new Date();
      const daysUntilDue = Math.floor((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return daysUntilDue <= 3 && daysUntilDue >= 0;
    }).length,
  };

  const stats = user?.role === 'student' ? studentStats : adminStats;

  const chartData = [
    { name: 'Mon', issues: 12, returns: 8 },
    { name: 'Tue', issues: 15, returns: 10 },
    { name: 'Wed', issues: 18, returns: 12 },
    { name: 'Thu', issues: 14, returns: 11 },
    { name: 'Fri', issues: 16, returns: 13 },
    { name: 'Sat', issues: 10, returns: 9 },
    { name: 'Sun', issues: 8, returns: 6 },
  ];

  const categoryData = books.reduce((acc, book) => {
    acc[book.category] = (acc[book.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoryChartData = Object.entries(categoryData).map(([name, value]) => ({
    name,
    books: value,
  }));

  const StatCard = ({ icon: Icon, label, value, trend, color = 'primary' }: any) => {
    const bgColorClass = color === 'red' ? 'bg-red-50' : 'bg-primary-50';
    const iconColorClass = color === 'red' ? 'text-red-600' : 'text-primary-600';
    
    return (
      <div className="card">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-neutral-500 mb-1">{label}</p>
            <p className="text-3xl font-bold text-neutral-700">{value}</p>
            {trend && (
              <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span>{trend}</span>
              </div>
            )}
          </div>
          <div className={`w-12 h-12 rounded-lg ${bgColorClass} flex items-center justify-center`}>
            <Icon className={`w-6 h-6 ${iconColorClass}`} />
          </div>
        </div>
      </div>
    );
  };

  // Student Dashboard View
  if (user?.role === 'student') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-700 mb-2">My Dashboard</h1>
          <p className="text-neutral-500">Welcome back, {user?.name}!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={BookOpen}
            label="My Borrows"
            value={stats.myBorrows}
            color="primary"
          />
          <StatCard
            icon={AlertCircle}
            label="Overdue"
            value={stats.overdueBooks}
            color="red"
          />
          <StatCard
            icon={Calendar}
            label="Due Soon"
            value={stats.dueSoon}
            color="red"
          />
          <StatCard
            icon={FileText}
            label="My Reservations"
            value={stats.myReservations}
            color="primary"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-neutral-700">My Fines</h3>
              <AlertCircle className="w-5 h-5 text-red-500" />
            </div>
            <p className="text-3xl font-bold text-neutral-700">${stats.myFines.toFixed(2)}</p>
            <p className="text-sm text-neutral-500 mt-2">Pending payments</p>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-neutral-700">My Reservations</h3>
              <Calendar className="w-5 h-5 text-primary-500" />
            </div>
            <p className="text-3xl font-bold text-neutral-700">{stats.myReservations}</p>
            <p className="text-sm text-neutral-500 mt-2">Active reservations</p>
          </div>
        </div>

        {/* Student's Borrowed Books List */}
        <div className="card">
          <h3 className="text-lg font-semibold text-neutral-700 mb-4">My Borrowed Books</h3>
          {userBorrowRecords.filter((r) => r.status === 'active').length === 0 ? (
            <p className="text-neutral-500 text-center py-8">No active borrows</p>
          ) : (
            <div className="space-y-3">
              {userBorrowRecords
                .filter((r) => r.status === 'active')
                .map((record) => {
                  const book = books.find((b) => b.id === record.bookId);
                  const isOverdue = new Date(record.dueDate) < new Date();
                  const daysUntilDue = Math.floor(
                    (new Date(record.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                  );
                  
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
                          <p className="text-sm text-neutral-500">
                            Due: {new Date(record.dueDate).toLocaleDateString()}
                            {isOverdue && <span className="text-red-600 ml-2">(Overdue)</span>}
                            {!isOverdue && daysUntilDue <= 3 && (
                              <span className="text-yellow-600 ml-2">({daysUntilDue} days left)</span>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Admin & Librarian Dashboard View
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-700 mb-2">Dashboard</h1>
        <p className="text-neutral-500">
          Welcome back, {user?.name}! {user?.role === 'admin' && 'Full system access'}
          {user?.role === 'librarian' && 'Operational dashboard'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={BookOpen}
          label="Total Books"
          value={stats.totalBooks}
          trend={user?.role === 'admin' ? '+12%' : undefined}
          color="primary"
        />
        <StatCard
          icon={FileText}
          label="Active Borrows"
          value={stats.activeBorrows}
          color="primary"
        />
        <StatCard
          icon={AlertCircle}
          label="Overdue Books"
          value={stats.overdueBooks}
          color="red"
        />
        <StatCard
          icon={Calendar}
          label="Today's Issues"
          value={stats.todayIssues}
          trend={user?.role === 'admin' ? '+5%' : undefined}
          color="primary"
        />
      </div>

      {/* Analytics Charts - Admin & Librarian Only */}
      {(user?.role === 'admin' || user?.role === 'librarian') && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-neutral-700 mb-4">Weekly Activity</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e6e6e6" />
                <XAxis dataKey="name" stroke="#9a9a9a" />
                <YAxis stroke="#9a9a9a" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e6e6e6',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="issues"
                  stroke="#6BAA6F"
                  strokeWidth={2}
                  name="Issues"
                />
                <Line
                  type="monotone"
                  dataKey="returns"
                  stroke="#79C081"
                  strokeWidth={2}
                  name="Returns"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-neutral-700 mb-4">Books by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e6e6e6" />
                <XAxis dataKey="name" stroke="#9a9a9a" />
                <YAxis stroke="#9a9a9a" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e6e6e6',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="books" fill="#6BAA6F" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-neutral-700">Reservations</h3>
            <Calendar className="w-5 h-5 text-primary-500" />
          </div>
          <p className="text-3xl font-bold text-neutral-700">{stats.pendingReservations}</p>
          <p className="text-sm text-neutral-500 mt-2">Pending requests</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-neutral-700">Fines</h3>
            <AlertCircle className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-3xl font-bold text-neutral-700">${stats.totalFines.toFixed(2)}</p>
          <p className="text-sm text-neutral-500 mt-2">Pending payments</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-neutral-700">Availability</h3>
            <BookOpen className="w-5 h-5 text-primary-500" />
          </div>
          <p className="text-3xl font-bold text-neutral-700">
            {stats.availableCopies}/{stats.totalCopies}
          </p>
          <p className="text-sm text-neutral-500 mt-2">Available copies</p>
        </div>
      </div>

      {/* Admin-only additional stats */}
      {user?.role === 'admin' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-neutral-700">Today's Returns</h3>
              <FileText className="w-5 h-5 text-primary-500" />
            </div>
            <p className="text-3xl font-bold text-neutral-700">{stats.todayReturns}</p>
            <p className="text-sm text-neutral-500 mt-2">Books returned today</p>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-neutral-700">System Health</h3>
              <Users className="w-5 h-5 text-primary-500" />
            </div>
            <p className="text-3xl font-bold text-green-600">98%</p>
            <p className="text-sm text-neutral-500 mt-2">All systems operational</p>
          </div>
        </div>
      )}
    </div>
  );
}

