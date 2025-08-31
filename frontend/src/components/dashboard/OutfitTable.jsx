import React, { useState } from 'react';
import { 
  Package, Star, Heart, MessageSquare, Edit, Trash2, Eye, EyeOff,
  ChevronLeft, ChevronRight, X, Check, AlertTriangle
} from 'lucide-react';

// Toast notification component
const Toast = ({ message, type, onClose }) => {
  const icons = {
    success: <Check size={20} className="text-green-600" />,
    error: <X size={20} className="text-red-600" />,
    warning: <AlertTriangle size={20} className="text-yellow-600" />
  };

  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800'
  };

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-sm w-full border-l-4 p-4 rounded-lg shadow-lg transition-all duration-300 ${colors[type]}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {icons[type]}
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

// Confirmation Modal component
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText, type = 'danger' }) => {
  if (!isOpen) return null;

  const buttonColors = {
    danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    success: 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
        <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full mx-auto transform transition-all">
          <div className="p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${type === 'danger' ? 'bg-red-100' : 'bg-green-100'}`}>
                {type === 'danger' ? (
                  <AlertTriangle size={20} className="text-red-600" />
                ) : (
                  <Check size={20} className="text-green-600" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              </div>
            </div>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="flex space-x-3 justify-end">
              <button
                onClick={onClose}
                className="cursor-pointer px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={`cursor-pointer px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${buttonColors[type]}`}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function OutfitTable({
  loading, 
  filteredOutfits = [], 
  currentPage, 
  setCurrentPage, 
  itemsPerPage = 10,
  handleEditClick, 
  handleToggleStatus, 
  handleDeleteOutfit
}) {
  const [toast, setToast] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false });

  // Show toast notification
  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 4000);
  };

  // Handle actions with notifications
  const handleEdit = (outfit) => {
    handleEditClick(outfit);
    showToast('Opening outfit editor...', 'success');
  };

  const handleToggle = (outfitId) => {
    const outfit = filteredOutfits.find(o => o._id === outfitId);
    setConfirmModal({
      isOpen: true,
      title: `${outfit?.isActive ? 'Deactivate' : 'Activate'} Outfit`,
      message: `Are you sure you want to ${outfit?.isActive ? 'deactivate' : 'activate'} this outfit?`,
      confirmText: outfit?.isActive ? 'Deactivate' : 'Activate',
      type: outfit?.isActive ? 'danger' : 'success',
      onConfirm: () => {
        handleToggleStatus(outfitId);
        showToast(`Outfit ${outfit?.isActive ? 'deactivated' : 'activated'} successfully!`);
      }
    });
  };

  const handleDelete = (outfitId) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Outfit',
      message: 'Are you sure you want to delete this outfit? This action cannot be undone.',
      confirmText: 'Delete',
      type: 'danger',
      onConfirm: () => {
        handleDeleteOutfit(outfitId);
        showToast('Outfit deleted successfully!', 'success');
      }
    });
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOutfits = filteredOutfits.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOutfits.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        {loading ? (
          <div className="p-16 text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-600 mx-auto"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Package size={24} className="text-blue-600" />
              </div>
            </div>
            <p className="mt-6 text-gray-600 font-medium">Loading your outfits...</p>
            <p className="text-sm text-gray-400">This won't take long</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Outfit</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider hidden md:table-cell">Category</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider hidden lg:table-cell">Section</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider hidden sm:table-cell">Items</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Rating</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider hidden md:table-cell">Engagement</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentOutfits.map((outfit, index) => (
                    <tr 
                      key={outfit._id} 
                      className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-4">
                          <div className="relative flex-shrink-0">
                            <img 
                              className="h-14 w-14 rounded-xl object-cover shadow-md group-hover:shadow-lg transition-all duration-200" 
                              src={outfit.image} 
                              alt="Outfit" 
                            />
                            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm">
                              <div className={`w-3 h-3 rounded-full ${outfit.isActive ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                            </div>
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-semibold text-gray-900 truncate">{outfit.category}</div>
                            <div className="text-sm text-gray-500 truncate">{outfit.type}</div>
                            <div className="md:hidden mt-1">
                              <span className="text-xs text-gray-400">{outfit.section}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <span className="inline-flex px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          {outfit.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <span className="text-sm text-gray-700 font-medium">{outfit.section}</span>
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell">
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-lg">
                            <Package size={16} className="text-purple-600" />
                          </div>
                          <span className="text-sm font-medium text-gray-900">{outfit.numberOfItems}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center justify-center w-8 h-8 bg-yellow-100 rounded-lg">
                            <Star size={16} className="text-yellow-600 fill-current" />
                          </div>
                          <span className="text-sm font-bold text-gray-900">{outfit.rateLook}/5</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <div className="flex items-center justify-center w-7 h-7 bg-red-100 rounded-lg">
                              <Heart size={14} className="text-red-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-700">{outfit.numberOfLikes || 0}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <div className="flex items-center justify-center w-7 h-7 bg-blue-100 rounded-lg">
                              <MessageSquare size={14} className="text-blue-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-700">{outfit.numberOfComments || 0}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${
                          outfit.isActive 
                            ? 'bg-green-100 text-green-800 ring-1 ring-green-200' 
                            : 'bg-red-100 text-red-800 ring-1 ring-red-200'
                        }`}>
                          {outfit.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => handleEdit(outfit)}
                            className="cursor-pointer group/btn p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded-lg transition-all duration-200 relative"
                            title="Edit Outfit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleToggle(outfit._id)}
                            className={`cursor-pointer group/btn p-2 rounded-lg transition-all duration-200 ${
                              outfit.isActive 
                                ? 'text-red-600 hover:text-red-700 hover:bg-red-100' 
                                : 'text-green-600 hover:text-green-700 hover:bg-green-100'
                            }`}
                            title={outfit.isActive ? 'Deactivate' : 'Activate'}
                          >
                            {outfit.isActive ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                          <button
                            onClick={() => handleDelete(outfit._id)}
                            className="cursor-pointer group/btn p-2 text-red-600 hover:text-red-700 hover:bg-red-100 rounded-lg transition-all duration-200"
                            title="Delete Outfit"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-600">
                    <span>
                      Showing <span className="font-semibold text-gray-900">{indexOfFirstItem + 1}</span> to{' '}
                      <span className="font-semibold text-gray-900">{Math.min(indexOfLastItem, filteredOutfits.length)}</span> of{' '}
                      <span className="font-semibold text-gray-900">{filteredOutfits.length}</span> results
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="cursor-pointer flex items-center px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      <ChevronLeft size={16} className="mr-1" />
                      <span className="hidden sm:inline">Previous</span>
                    </button>
                    
                    <div className="hidden md:flex items-center space-x-1">
                      {[...Array(totalPages)].map((_, index) => {
                        const pageNumber = index + 1;
                        if (
                          pageNumber === 1 ||
                          pageNumber === totalPages ||
                          (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={pageNumber}
                              onClick={() => paginate(pageNumber)}
                              className={`cursor-pointer px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                                pageNumber === currentPage 
                                  ? 'bg-blue-600 text-white shadow-md' 
                                  : 'text-gray-600 bg-white border border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              {pageNumber}
                            </button>
                          );
                        } else if (
                          pageNumber === currentPage - 2 ||
                          pageNumber === currentPage + 2
                        ) {
                          return (
                            <span key={pageNumber} className="px-2 py-2 text-gray-400">
                              ...
                            </span>
                          );
                        }
                        return null;
                      })}
                    </div>

                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="cursor-pointer flex items-center px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      <span className="hidden sm:inline">Next</span>
                      <ChevronRight size={16} className="ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Empty State */}
            {filteredOutfits.length === 0 && !loading && (
              <div className="text-center py-16">
                <div className="relative inline-block">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Package size={32} className="text-blue-600" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                    <Star size={12} className="text-white fill-current" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No outfits found</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  It looks like there are no outfits matching your current filters. Try adjusting your search criteria or add some new outfits to get started.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Toast Notification */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal 
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false })}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        type={confirmModal.type}
      />
    </>
  );
}