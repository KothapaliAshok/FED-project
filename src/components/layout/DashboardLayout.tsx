import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-neutral-100">
      <Sidebar />
      <div className="flex-1 ml-20">
        <TopNav />
        <main className="pt-16 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

