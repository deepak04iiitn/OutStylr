import { Menu, Plus } from 'lucide-react';

export default function Header({ setSidebarOpen, setShowCreateModal }) {
  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-all duration-200 ease-in-out hover:scale-105"
              aria-label="Open sidebar"
            >
              <Menu size={20} className="stroke-2" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">OM</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Outfit Management
              </h1>
            </div>
          </div>
          
          <button
            onClick={() => setShowCreateModal(true)}
            className="cursor-pointer group relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 sm:px-6 py-2.5 rounded-xl font-medium transition-all duration-200 ease-in-out transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500/30"
          >
            <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            <div className="relative flex items-center gap-2">
              <Plus size={18} className="stroke-2" />
              <span className="hidden sm:inline text-sm font-semibold">Create Outfit</span>
              <span className="sm:hidden text-sm font-semibold">Create</span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
