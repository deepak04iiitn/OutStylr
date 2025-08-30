import { Link } from 'react-router-dom';
import {
  Home, LayoutDashboard, Users, BarChart3, Settings, X
} from 'lucide-react';

export default function Sidebar({ isOpen, setIsOpen, currentUser }) {
  const sidebarItems = [
    { id: 'home', label: 'Home', icon: Home, active: false, isLink: true, href: '/' },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, active: true },
    { id: 'users', label: 'Users', icon: Users, active: false },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, active: false },
    { id: 'settings', label: 'Settings', icon: Settings, active: false },
  ];

  return (
    <>
      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 bg-blue-600 text-white">
          <h1 className="text-xl font-bold">Admin Panel</h1>
          <button onClick={() => setIsOpen(false)} className="lg:hidden">
            <X size={24} />
          </button>
        </div>
        <nav className="mt-8">
          {sidebarItems.map((item) => (
            item.isLink ? (
              <Link
                key={item.id}
                to={item.href}
                className={`flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors ${item.active ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : ''}`}
              >
                <item.icon size={20} className="mr-3" />
                {item.label}
              </Link>
            ) : (
              <a
                key={item.id}
                href="#"
                className={`flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors ${item.active ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : ''}`}
              >
                <item.icon size={20} className="mr-3" />
                {item.label}
              </a>
            )
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="bg-gray-100 rounded-lg p-4">
            <p className="text-sm text-gray-600">Welcome back,</p>
            <p className="font-medium text-gray-900">{currentUser?.username}</p>
          </div>
        </div>
      </div>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
}