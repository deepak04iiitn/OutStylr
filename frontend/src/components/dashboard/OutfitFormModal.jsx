import { Plus, Edit, Trash2, X, Package } from 'lucide-react';

export default function OutfitFormModal({
  showCreateModal, showEditModal, setShowCreateModal, setShowEditModal,
  formData, setFormData, editingOutfit, setEditingOutfit, handleCreateOutfit,
  handleUpdateOutfit, categories, sections, types
}) {
  const resetForm = () => {
    setFormData({
      category: '',
      section: '',
      items: [],
      rateLook: 0,
      type: 'Normal',
      tags: [],
      description: '',
      image: null
    });
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, {
        sourceName: '',
        itemName: '',
        itemPrice: 0,
        itemLink: ''
      }]
    }));
  };

  const updateItem = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeItem = (index) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  return (
    (showCreateModal || showEditModal) && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              {showCreateModal ? 'Create New Outfit' : 'Edit Outfit'}
            </h2>
            <button
              onClick={() => {
                setShowCreateModal(false);
                setShowEditModal(false);
                setEditingOutfit(null);
                resetForm();
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>
          <form onSubmit={showCreateModal ? handleCreateOutfit : handleUpdateOutfit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Section *</label>
                <select
                  value={formData.section}
                  onChange={(e) => setFormData(prev => ({ ...prev, section: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Section</option>
                  {sections.map(section => (
                    <option key={section} value={section}>{section}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating (0-5) *</label>
                <input
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={formData.rateLook}
                  onChange={(e) => setFormData(prev => ({ ...prev, rateLook: parseFloat(e.target.value) || 0 }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {types.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Outfit Image {showCreateModal && '*'}</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.files[0] }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required={showCreateModal}
                />
                {showEditModal && (
                  <p className="text-sm text-gray-500 mt-1">Leave empty to keep the current image</p>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                  maxLength="500"
                  placeholder="Optional description..."
                />
                <p className="text-sm text-gray-500 mt-1">{formData.description.length}/500 characters</p>
              </div>
            </div>
            <div className="border-t pt-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Outfit Items ({formData.items.length})</h3>
                <button
                  type="button"
                  onClick={addItem}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Plus size={16} />
                  Add Item
                </button>
              </div>
              {formData.items.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                  <Package size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500 mb-4">No items added yet</p>
                  <p className="text-sm text-gray-400">Click "Add Item" to start building your outfit</p>
                </div>
              )}
              {formData.items.map((item, index) => (
                <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium text-gray-900">Item {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Source Name *</label>
                      <input
                        type="text"
                        placeholder="e.g., Zara, H&M, Nike"
                        value={item.sourceName}
                        onChange={(e) => updateItem(index, 'sourceName', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Item Name *</label>
                      <input
                        type="text"
                        placeholder="e.g., Blue Denim Jacket"
                        value={item.itemName}
                        onChange={(e) => updateItem(index, 'itemName', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price ($) *</label>
                      <input
                        type="number"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        value={item.itemPrice}
                        onChange={(e) => updateItem(index, 'itemPrice', parseFloat(e.target.value) || 0)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Item Link *</label>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={item.itemLink}
                        onChange={(e) => updateItem(index, 'itemLink', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-4 mt-8 pt-6 border-t">
              <button
                type="submit"
                disabled={formData.items.length === 0}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                {showCreateModal ? (
                  <>
                    <Plus size={16} />
                    Create Outfit
                  </>
                ) : (
                  <>
                    <Edit size={16} />
                    Update Outfit
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateModal(false);
                  setShowEditModal(false);
                  setEditingOutfit(null);
                  resetForm();
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
}