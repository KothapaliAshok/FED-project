import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, BookOpen, Filter, Calendar } from 'lucide-react';
import { useLibraryStore } from '../store/libraryStore';
import type { Book } from '../types';
import { useAuthStore } from '../store/authStore';

export default function Books() {
  const { books, deleteBook, initialize, createReservation, reservations } = useLibraryStore();
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  useEffect(() => {
    if (books.length === 0) {
      initialize();
    }
  }, [books.length, initialize]);

  const categories = ['all', ...Array.from(new Set(books.map((b) => b.category)))];

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const canManage = user?.role === 'admin' || user?.role === 'librarian';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-700 mb-2">
            {user?.role === 'student' ? 'Browse Books' : 'Book Inventory'}
          </h1>
          <p className="text-neutral-500">
            {user?.role === 'student' 
              ? 'Search and explore our library collection' 
              : 'Manage your library collection'}
          </p>
        </div>
        {canManage && (
          <button onClick={() => setShowAddModal(true)} className="btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add Book
          </button>
        )}
      </div>

      <div className="card">
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, author, or ISBN..."
              className="input-field pl-10"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400 pointer-events-none" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-field pl-10 pr-8 appearance-none"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Title</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Author</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">ISBN</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Category</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Copies</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Available</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Location</th>
                {canManage && (
                  <th className="text-right py-3 px-4 text-sm font-semibold text-neutral-700">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredBooks.length === 0 ? (
                <tr>
                  <td colSpan={canManage ? 8 : 7} className="text-center py-12 text-neutral-500">
                    No books found
                  </td>
                </tr>
              ) : (
                filteredBooks.map((book) => (
                  <tr key={book.id} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                          <p className="font-medium text-neutral-700">{book.title}</p>
                          {book.edition && (
                            <p className="text-xs text-neutral-500">{book.edition} Edition</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-neutral-600">{book.author}</td>
                    <td className="py-4 px-4 text-neutral-600 font-mono text-sm">{book.isbn}</td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-1 bg-primary-50 text-primary-700 rounded text-xs font-medium">
                        {book.category}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-neutral-600">{book.totalCopies}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          book.availableCopies > 0
                            ? 'bg-green-50 text-green-700'
                            : 'bg-red-50 text-red-700'
                        }`}
                      >
                        {book.availableCopies}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-neutral-600 text-sm">{book.rackLocation || 'N/A'}</td>
                    {canManage ? (
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setEditingBook(book)}
                            className="p-2 text-neutral-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Are you sure you want to delete this book?')) {
                                deleteBook(book.id);
                              }
                            }}
                            className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    ) : (
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end gap-2">
                          {book.availableCopies === 0 && user?.role === 'student' && (
                            <button
                              onClick={() => {
                                if (user && !reservations.some(r => r.bookId === book.id && r.userId === user.id && r.status === 'pending')) {
                                  createReservation(user.id, book.id);
                                  alert('Book reserved! You will be notified when it becomes available.');
                                } else {
                                  alert('You already have a reservation for this book.');
                                }
                              }}
                              className="btn-primary text-sm flex items-center gap-2"
                            >
                              <Calendar className="w-4 h-4" />
                              Reserve
                            </button>
                          )}
                          {book.availableCopies > 0 && user?.role === 'student' && (
                            <span className="text-sm text-green-600 font-medium">Available</span>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {(showAddModal || editingBook) && (
        <BookModal
          book={editingBook}
          onClose={() => {
            setShowAddModal(false);
            setEditingBook(null);
          }}
        />
      )}
    </div>
  );
}

function BookModal({ book, onClose }: { book: Book | null; onClose: () => void }) {
  const { addBook, updateBook } = useLibraryStore();
  const [formData, setFormData] = useState({
    title: book?.title || '',
    author: book?.author || '',
    isbn: book?.isbn || '',
    category: book?.category || '',
    description: book?.description || '',
    publisher: book?.publisher || '',
    edition: book?.edition || '',
    language: book?.language || 'English',
    publicationYear: book?.publicationYear?.toString() || '',
    rackLocation: book?.rackLocation || '',
    totalCopies: book?.totalCopies?.toString() || '1',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const bookData = {
      ...formData,
      publicationYear: formData.publicationYear ? parseInt(formData.publicationYear) : undefined,
      totalCopies: parseInt(formData.totalCopies) || 1,
      availableCopies: book
        ? book.availableCopies
        : parseInt(formData.totalCopies) || 1,
    };

    if (book) {
      updateBook(book.id, bookData);
    } else {
      addBook(bookData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-neutral-200">
          <h2 className="text-xl font-bold text-neutral-700">
            {book ? 'Edit Book' : 'Add New Book'}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Author *</label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="input-field"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">ISBN *</label>
              <input
                type="text"
                value={formData.isbn}
                onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Category *</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="input-field"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-field"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Publisher</label>
              <input
                type="text"
                value={formData.publisher}
                onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Edition</label>
              <input
                type="text"
                value={formData.edition}
                onChange={(e) => setFormData({ ...formData, edition: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Year</label>
              <input
                type="number"
                value={formData.publicationYear}
                onChange={(e) => setFormData({ ...formData, publicationYear: e.target.value })}
                className="input-field"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Language</label>
              <input
                type="text"
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Rack Location</label>
              <input
                type="text"
                value={formData.rackLocation}
                onChange={(e) => setFormData({ ...formData, rackLocation: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Total Copies *</label>
              <input
                type="number"
                value={formData.totalCopies}
                onChange={(e) => setFormData({ ...formData, totalCopies: e.target.value })}
                className="input-field"
                min="1"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {book ? 'Update' : 'Add'} Book
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

