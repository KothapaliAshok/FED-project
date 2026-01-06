export type UserRole = 'admin' | 'librarian' | 'student';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  address?: string;
  createdAt: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  description?: string;
  publisher?: string;
  edition?: string;
  language: string;
  publicationYear?: number;
  rackLocation?: string;
  totalCopies: number;
  availableCopies: number;
  createdAt: string;
}

export interface BookCopy {
  id: string;
  bookId: string;
  copyNumber: string;
  status: 'available' | 'borrowed' | 'reserved' | 'maintenance';
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  createdAt: string;
}

export interface BorrowRecord {
  id: string;
  userId: string;
  bookCopyId: string;
  bookId: string;
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'active' | 'returned' | 'overdue';
  fineAmount: number;
  renewals: number;
}

export interface Reservation {
  id: string;
  userId: string;
  bookId: string;
  requestedDate: string;
  status: 'pending' | 'available' | 'fulfilled' | 'cancelled';
  notifiedAt?: string;
}

export interface Fine {
  id: string;
  userId: string;
  borrowRecordId: string;
  amount: number;
  reason: string;
  status: 'pending' | 'paid';
  paidAt?: string;
  paymentMethod?: string;
}

export interface LibrarySettings {
  maxBooksPerUser: number;
  borrowingDurationDays: number;
  finePerDay: number;
  maxRenewals: number;
  openingHours: string;
  closingHours: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  entityType: 'book' | 'user' | 'borrow' | 'reservation';
  entityId: string;
  timestamp: string;
  details?: string;
}

