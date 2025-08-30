import { Menu, Plus } from 'lucide-react';

export default function Header({ setSidebarOpen, setShowCreateModal }) {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="flex items-center justify-between px-4 sm:px-6 py-4">
        <div className="flex items-center">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden mr-4"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Outfit Management</h1>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          <span className="hidden sm:inline">Create Outfit</span>
        </button>
      </div>
    </header>
  );
}