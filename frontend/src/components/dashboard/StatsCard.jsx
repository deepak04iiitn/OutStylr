import { Package, Eye, Star, Heart } from 'lucide-react';

export default function StatsCards({ outfits }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Package className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Outfits</p>
            <p className="text-2xl font-bold text-gray-900">{outfits.length}</p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-2 bg-green-100 rounded-lg">
            <Eye className="h-6 w-6 text-green-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Active Outfits</p>
            <p className="text-2xl font-bold text-gray-900">
              {outfits.filter(o => o.isActive).length}
            </p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <Star className="h-6 w-6 text-yellow-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Avg Rating</p>
            <p className="text-2xl font-bold text-gray-900">
              {outfits.length > 0 ? (outfits.reduce((acc, o) => acc + o.rateLook, 0) / outfits.length).toFixed(1) : '0.0'}
            </p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-2 bg-red-100 rounded-lg">
            <Heart className="h-6 w-6 text-red-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Likes</p>
            <p className="text-2xl font-bold text-gray-900">
              {outfits.reduce((acc, o) => acc + (o.numberOfLikes || 0), 0)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}