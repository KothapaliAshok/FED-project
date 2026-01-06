import { Link } from 'react-router-dom';
import { BookOpen, Search, Calendar, Bell, ArrowRight, Library } from 'lucide-react';

export default function HomePage() {
  const features = [
    {
      icon: Search,
      title: 'Instant Search',
      description: 'Find books quickly with our powerful search and filter system',
    },
    {
      icon: Calendar,
      title: 'Smart Tracking',
      description: 'Track your borrowed books and get reminders for due dates',
    },
    {
      icon: Bell,
      title: 'Notifications',
      description: 'Stay updated with real-time alerts and availability notifications',
    },
    {
      icon: BookOpen,
      title: 'Digital Catalog',
      description: 'Access thousands of books with detailed information and availability',
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col">
      {/* Navbar */}
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-neutral-700">Library Management</h1>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-neutral-600 hover:text-primary-600 font-medium transition-colors"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="btn-primary"
            >
              Create Account
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Section */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-5xl font-bold text-neutral-700 leading-tight">
                  Welcome to the{' '}
                  <span className="text-primary-600">Smart Library</span>
                  <br />
                  Management System
                </h2>
                <p className="text-xl text-neutral-500 leading-relaxed">
                  Manage, explore, and borrow books effortlessly. A modern digital library
                  experience designed for students, librarians, and administrators.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link to="/login" className="btn-primary text-center flex items-center justify-center gap-2">
                  Get Started
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/signup"
                  className="btn-secondary text-center"
                >
                  Create Account
                </Link>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-neutral-200">
                <div>
                  <p className="text-3xl font-bold text-primary-600">1000+</p>
                  <p className="text-sm text-neutral-500 mt-1">Books</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary-600">500+</p>
                  <p className="text-sm text-neutral-500 mt-1">Active Users</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary-600">24/7</p>
                  <p className="text-sm text-neutral-500 mt-1">Access</p>
                </div>
              </div>
            </div>

            {/* Right Section - Illustration */}
            <div className="hidden lg:block">
              <div className="relative">
                <div className="w-full h-96 bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl flex items-center justify-center p-12">
                  <div className="text-center space-y-6">
                    <div className="w-32 h-32 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                      <Library className="w-16 h-16 text-white" />
                    </div>
                    <div className="space-y-2">
                      <div className="w-64 h-4 bg-white/60 rounded-full mx-auto"></div>
                      <div className="w-56 h-4 bg-white/40 rounded-full mx-auto"></div>
                      <div className="w-48 h-4 bg-white/30 rounded-full mx-auto"></div>
                    </div>
                  </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary-200 rounded-full opacity-50 blur-2xl"></div>
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary-300 rounded-full opacity-30 blur-3xl"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white border-t border-neutral-200 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-neutral-700 mb-3">
                Everything You Need
              </h3>
              <p className="text-lg text-neutral-500">
                Powerful features to enhance your library experience
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="card hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-neutral-700 mb-2">
                      {feature.title}
                    </h4>
                    <p className="text-neutral-500 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-primary-50 py-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h3 className="text-3xl font-bold text-neutral-700 mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-lg text-neutral-600 mb-8">
              Join our library community and start exploring thousands of books today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" className="btn-primary">
                Create Free Account
              </Link>
              <Link to="/login" className="btn-secondary">
                Already have an account? Login
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-neutral-200 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <p className="text-neutral-600 text-sm">
                Library Management System © {new Date().getFullYear()}
              </p>
            </div>
            <div className="flex gap-6 text-sm text-neutral-500">
              <a href="#" className="hover:text-primary-600 transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-primary-600 transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-primary-600 transition-colors">
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

