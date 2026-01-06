import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Book, BookCopy, BorrowRecord, Reservation, Fine, LibrarySettings } from '../types';
import { generateMockData } from '../services/mockData';

interface LibraryState {
  books: Book[];
  bookCopies: BookCopy[];
  borrowRecords: BorrowRecord[];
  reservations: Reservation[];
  fines: Fine[];
  settings: LibrarySettings;
  
  // Book actions
  addBook: (book: Omit<Book, 'id' | 'createdAt'>) => void;
  updateBook: (id: string, updates: Partial<Book>) => void;
  deleteBook: (id: string) => void;
  
  // Borrow actions
  issueBook: (userId: string, bookCopyId: string, bookId: string) => void;
  returnBook: (borrowRecordId: string) => void;
  renewBook: (borrowRecordId: string) => void;
  
  // Reservation actions
  createReservation: (userId: string, bookId: string) => void;
  fulfillReservation: (reservationId: string) => void;
  
  // Fine actions
  calculateFines: () => void;
  payFine: (fineId: string, paymentMethod: string) => void;
  
  // Initialize with mock data
  initialize: () => void;
}

export const useLibraryStore = create<LibraryState>()(
  persist(
    (set, get) => ({
  books: [],
  bookCopies: [],
  borrowRecords: [],
  reservations: [],
  fines: [],
  settings: {
    maxBooksPerUser: 5,
    borrowingDurationDays: 14,
    finePerDay: 0.50,
    maxRenewals: 2,
    openingHours: '09:00',
    closingHours: '18:00',
  },
  
  initialize: () => {
    const mockData = generateMockData();
    set({
      books: mockData.books,
      bookCopies: mockData.bookCopies,
      borrowRecords: mockData.borrowRecords,
      reservations: mockData.reservations,
      fines: mockData.fines,
    });
  },
  
  addBook: (bookData) => {
    const newBook: Book = {
      ...bookData,
      id: `book-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    set((state) => ({ books: [...state.books, newBook] }));
    
    // Create initial copies
    const copies: BookCopy[] = Array.from({ length: bookData.totalCopies }, (_, i) => ({
      id: `copy-${Date.now()}-${i}`,
      bookId: newBook.id,
      copyNumber: `COPY-${String(i + 1).padStart(3, '0')}`,
      status: 'available',
      condition: 'good',
      createdAt: new Date().toISOString(),
    }));
    set((state) => ({ bookCopies: [...state.bookCopies, ...copies] }));
  },
  
  updateBook: (id, updates) => {
    set((state) => ({
      books: state.books.map((book) =>
        book.id === id ? { ...book, ...updates } : book
      ),
    }));
  },
  
  deleteBook: (id) => {
    set((state) => ({
      books: state.books.filter((book) => book.id !== id),
      bookCopies: state.bookCopies.filter((copy) => copy.bookId !== id),
    }));
  },
  
  issueBook: (userId, bookCopyId, bookId) => {
    const { settings } = get();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + settings.borrowingDurationDays);
    
    const newRecord: BorrowRecord = {
      id: `borrow-${Date.now()}`,
      userId,
      bookCopyId,
      bookId,
      issueDate: new Date().toISOString(),
      dueDate: dueDate.toISOString(),
      status: 'active',
      fineAmount: 0,
      renewals: 0,
    };
    
    set((state) => ({
      borrowRecords: [...state.borrowRecords, newRecord],
      bookCopies: state.bookCopies.map((copy) =>
        copy.id === bookCopyId ? { ...copy, status: 'borrowed' } : copy
      ),
      books: state.books.map((book) =>
        book.id === bookId
          ? { ...book, availableCopies: book.availableCopies - 1 }
          : book
      ),
    }));
  },
  
  returnBook: (borrowRecordId) => {
    const record = get().borrowRecords.find((r) => r.id === borrowRecordId);
    if (!record) return;
    
    const returnDate = new Date();
    const dueDate = new Date(record.dueDate);
    const isOverdue = returnDate > dueDate;
    const overdueDays = isOverdue
      ? Math.floor((returnDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24))
      : 0;
    
    const fineAmount = overdueDays * get().settings.finePerDay;
    
    set((state) => ({
      borrowRecords: state.borrowRecords.map((r) =>
        r.id === borrowRecordId
          ? {
              ...r,
              returnDate: returnDate.toISOString(),
              status: 'returned',
              fineAmount,
            }
          : r
      ),
      bookCopies: state.bookCopies.map((copy) =>
        copy.id === record.bookCopyId ? { ...copy, status: 'available' } : copy
      ),
      books: state.books.map((book) =>
        book.id === record.bookId
          ? { ...book, availableCopies: book.availableCopies + 1 }
          : book
      ),
      fines:
        fineAmount > 0
          ? [
              ...state.fines,
              {
                id: `fine-${Date.now()}`,
                userId: record.userId,
                borrowRecordId: record.id,
                amount: fineAmount,
                reason: `Overdue by ${overdueDays} days`,
                status: 'pending',
              },
            ]
          : state.fines,
    }));
  },
  
  renewBook: (borrowRecordId) => {
    const record = get().borrowRecords.find((r) => r.id === borrowRecordId);
    if (!record || record.renewals >= get().settings.maxRenewals) return;
    
    const newDueDate = new Date(record.dueDate);
    newDueDate.setDate(newDueDate.getDate() + get().settings.borrowingDurationDays);
    
    set((state) => ({
      borrowRecords: state.borrowRecords.map((r) =>
        r.id === borrowRecordId
          ? {
              ...r,
              dueDate: newDueDate.toISOString(),
              renewals: r.renewals + 1,
            }
          : r
      ),
    }));
  },
  
  createReservation: (userId, bookId) => {
    const newReservation: Reservation = {
      id: `reservation-${Date.now()}`,
      userId,
      bookId,
      requestedDate: new Date().toISOString(),
      status: 'pending',
    };
    set((state) => ({ reservations: [...state.reservations, newReservation] }));
  },
  
  fulfillReservation: (reservationId) => {
    set((state) => ({
      reservations: state.reservations.map((r) =>
        r.id === reservationId
          ? { ...r, status: 'fulfilled', notifiedAt: new Date().toISOString() }
          : r
      ),
    }));
  },
  
  calculateFines: () => {
    const { borrowRecords, settings } = get();
    const today = new Date();
    
    const overdueRecords = borrowRecords.filter(
      (r) => r.status === 'active' && new Date(r.dueDate) < today
    );
    
    const newFines = overdueRecords
      .filter((r) => !get().fines.some((f) => f.borrowRecordId === r.id && f.status === 'pending'))
      .map((r) => {
        const overdueDays = Math.floor(
          (today.getTime() - new Date(r.dueDate).getTime()) / (1000 * 60 * 60 * 24)
        );
        return {
          id: `fine-${Date.now()}-${r.id}`,
          userId: r.userId,
          borrowRecordId: r.id,
          amount: overdueDays * settings.finePerDay,
          reason: `Overdue by ${overdueDays} days`,
          status: 'pending' as const,
        };
      });
    
    set((state) => ({ fines: [...state.fines, ...newFines] }));
  },
  
  payFine: (fineId, paymentMethod) => {
    set((state) => ({
      fines: state.fines.map((f) =>
        f.id === fineId
          ? {
              ...f,
              status: 'paid',
              paidAt: new Date().toISOString(),
              paymentMethod,
            }
          : f
      ),
    }));
  },
    }),
    {
      name: 'library-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

