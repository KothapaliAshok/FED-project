import { Book, BookCopy, BorrowRecord, Reservation, Fine } from '../types';

export function generateMockData() {
  const books: Book[] = [
    {
      id: 'book-1',
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      isbn: '978-0-7432-7356-5',
      category: 'Fiction',
      description: 'A classic American novel about the Jazz Age.',
      publisher: 'Scribner',
      edition: '1st',
      language: 'English',
      publicationYear: 1925,
      rackLocation: 'A-101',
      totalCopies: 5,
      availableCopies: 3,
      createdAt: '2024-01-15T10:00:00Z',
    },
    {
      id: 'book-2',
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      isbn: '978-0-06-112008-4',
      category: 'Fiction',
      description: 'A gripping tale of racial injustice and childhood innocence.',
      publisher: 'HarperCollins',
      edition: '50th Anniversary',
      language: 'English',
      publicationYear: 1960,
      rackLocation: 'A-102',
      totalCopies: 4,
      availableCopies: 2,
      createdAt: '2024-01-16T10:00:00Z',
    },
    {
      id: 'book-3',
      title: '1984',
      author: 'George Orwell',
      isbn: '978-0-452-28423-4',
      category: 'Dystopian Fiction',
      description: 'A dystopian social science fiction novel.',
      publisher: 'Signet Classic',
      edition: 'Reprint',
      language: 'English',
      publicationYear: 1949,
      rackLocation: 'B-201',
      totalCopies: 6,
      availableCopies: 4,
      createdAt: '2024-01-17T10:00:00Z',
    },
    {
      id: 'book-4',
      title: 'Pride and Prejudice',
      author: 'Jane Austen',
      isbn: '978-0-14-143951-8',
      category: 'Romance',
      description: 'A romantic novel of manners.',
      publisher: 'Penguin Classics',
      edition: 'Revised',
      language: 'English',
      publicationYear: 1813,
      rackLocation: 'A-103',
      totalCopies: 3,
      availableCopies: 1,
      createdAt: '2024-01-18T10:00:00Z',
    },
    {
      id: 'book-5',
      title: 'The Catcher in the Rye',
      author: 'J.D. Salinger',
      isbn: '978-0-316-76948-0',
      category: 'Fiction',
      description: 'A controversial novel about teenage rebellion.',
      publisher: 'Little, Brown and Company',
      edition: '1st',
      language: 'English',
      publicationYear: 1951,
      rackLocation: 'A-104',
      totalCopies: 4,
      availableCopies: 2,
      createdAt: '2024-01-19T10:00:00Z',
    },
    {
      id: 'book-6',
      title: 'Introduction to Algorithms',
      author: 'Thomas H. Cormen',
      isbn: '978-0-262-03384-8',
      category: 'Computer Science',
      description: 'Comprehensive guide to algorithms and data structures.',
      publisher: 'MIT Press',
      edition: '4th',
      language: 'English',
      publicationYear: 2022,
      rackLocation: 'C-301',
      totalCopies: 8,
      availableCopies: 5,
      createdAt: '2024-01-20T10:00:00Z',
    },
  ];

  const bookCopies: BookCopy[] = [];
  books.forEach((book) => {
    for (let i = 0; i < book.totalCopies; i++) {
      const isBorrowed = i >= book.availableCopies;
      bookCopies.push({
        id: `copy-${book.id}-${i}`,
        bookId: book.id,
        copyNumber: `COPY-${String(i + 1).padStart(3, '0')}`,
        status: isBorrowed ? 'borrowed' : 'available',
        condition: i % 4 === 0 ? 'excellent' : i % 4 === 1 ? 'good' : i % 4 === 2 ? 'fair' : 'poor',
        createdAt: book.createdAt,
      });
    }
  });

  const borrowRecords: BorrowRecord[] = [
    {
      id: 'borrow-1',
      userId: '3',
      bookCopyId: 'copy-book-1-0',
      bookId: 'book-1',
      issueDate: '2024-11-20T10:00:00Z',
      dueDate: '2024-12-04T10:00:00Z',
      status: 'active',
      fineAmount: 0,
      renewals: 0,
    },
    {
      id: 'borrow-2',
      userId: '3',
      bookCopyId: 'copy-book-2-0',
      bookId: 'book-2',
      issueDate: '2024-11-15T10:00:00Z',
      dueDate: '2024-11-29T10:00:00Z',
      status: 'overdue',
      fineAmount: 7.5,
      renewals: 1,
    },
  ];

  const reservations: Reservation[] = [
    {
      id: 'reservation-1',
      userId: '3',
      bookId: 'book-4',
      requestedDate: '2024-11-25T10:00:00Z',
      status: 'pending',
    },
  ];

  const fines: Fine[] = [
    {
      id: 'fine-1',
      userId: '3',
      borrowRecordId: 'borrow-2',
      amount: 7.5,
      reason: 'Overdue by 15 days',
      status: 'pending',
    },
  ];

  return {
    books,
    bookCopies,
    borrowRecords,
    reservations,
    fines,
  };
}

