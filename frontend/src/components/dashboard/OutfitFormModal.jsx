import { Plus, Edit, Trash2, X, Package, Sparkles, ShoppingBag, Star } from 'lucide-react';

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

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={16}
        className={i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
      />
    ));
  };

  if (!showCreateModal && !showEditModal) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full my-4 overflow-hidden border border-gray-100">
        {/* Header with gradient */}
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white p-4 sm:p-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              {showCreateModal ? <Sparkles size={24} /> : <Edit size={24} />}
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">
                {showCreateModal ? 'Create New Outfit' : 'Edit Outfit'}
              </h2>
              <p className="text-sm opacity-90 hidden sm:block">
                {showCreateModal ? 'Design your perfect look' : 'Update your outfit details'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setShowCreateModal(false);
              setShowEditModal(false);
              setEditingOutfit(null);
              resetForm();
            }}
            className="cursor-pointer p-2 hover:bg-white/20 rounded-xl transition-all duration-200 hover:rotate-90"
          >
            <X size={24} />
          </button>
        </div>

        <div className="max-h-[calc(100vh-120px)] overflow-y-auto">
          <div className="p-4 sm:p-8">
            {/* Basic Information Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <div className="w-2 h-6 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full"></div>
                Basic Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 bg-gray-50/50 hover:bg-white"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Section *</label>
                  <select
                    value={formData.section}
                    onChange={(e) => setFormData(prev => ({ ...prev, section: e.target.value }))}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 bg-gray-50/50 hover:bg-white"
                    required
                  >
                    <option value="">Select Section</option>
                    {sections.map(section => (
                      <option key={section} value={section}>{section}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Rating (0-5) *</label>
                  <input
                    type="text"
                    value={formData.rateLook}
                    onChange={(e) => setFormData(prev => ({ ...prev, rateLook: parseFloat(e.target.value) || 0 }))}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 bg-gray-50/50 hover:bg-white"
                    placeholder="Enter rating (0-5)"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 bg-gray-50/50 hover:bg-white"
                  >
                    {types.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2 space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Outfit Image {showCreateModal && <span className="text-red-500">*</span>}
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.files[0] }))}
                      className="cursor-pointer w-full p-4 border-2 border-dashed border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 bg-gray-50/50 hover:bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                      required={showCreateModal}
                    />
                  </div>
                  {showEditModal && (
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Sparkles size={12} />
                      Leave empty to keep the current image
                    </p>
                  )}
                </div>
                <div className="sm:col-span-2 space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 bg-gray-50/50 hover:bg-white resize-none"
                    rows="4"
                    maxLength="500"
                    placeholder="Tell us about your outfit inspiration..."
                  />
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-500">Optional description for your outfit</p>
                    <p className="text-xs text-gray-500">{formData.description.length}/500</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Items Section */}
            <div className="border-t-2 border-gray-100 pt-8">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <div className="w-2 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                  Outfit Items
                  <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {formData.items.length}
                  </span>
                </h3>
                <button
                  type="button"
                  onClick={addItem}
                  className="cursor-pointer bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 sm:px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold"
                >
                  <Plus size={16} />
                  Add Item
                </button>
              </div>
              
              {formData.items.length === 0 && (
                <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100">
                  <div className="mb-4 relative">
                    <Package size={64} className="mx-auto text-gray-400" />
                    <ShoppingBag size={24} className="absolute top-0 right-1/2 translate-x-8 text-gray-300" />
                  </div>
                  <h4 className="text-gray-600 mb-2 font-medium text-lg">No items added yet</h4>
                  <p className="text-gray-500 text-sm">Click "Add Item" to start building your perfect outfit</p>
                </div>
              )}
              
              <div className="space-y-6">
                {formData.items.map((item, index) => (
                  <div key={index} className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200">
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <h4 className="font-semibold text-gray-900">Item {index + 1}</h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="cursor-pointer text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-all duration-200 transform hover:scale-110"
                        title="Remove item"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Source Name *</label>
                        <input
                          type="text"
                          placeholder="e.g., Zara, H&M, Nike"
                          value={item.sourceName}
                          onChange={(e) => updateItem(index, 'sourceName', e.target.value)}
                          className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 bg-white"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Item Name *</label>
                        <input
                          type="text"
                          placeholder="e.g., Blue Denim Jacket"
                          value={item.itemName}
                          onChange={(e) => updateItem(index, 'itemName', e.target.value)}
                          className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 bg-white"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Price (Rs) *</label>
                        <input
                          type="text"
                          placeholder="0.00"
                          value={item.itemPrice}
                          onChange={(e) => updateItem(index, 'itemPrice', parseFloat(e.target.value) || 0)}
                          className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 bg-white"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Item Link *</label>
                        <input
                          type="url"
                          placeholder="https://..."
                          value={item.itemLink}
                          onChange={(e) => updateItem(index, 'itemLink', e.target.value)}
                          className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 bg-white"
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-8 border-t-2 border-gray-100">
              <button
                type="button"
                onClick={showCreateModal ? handleCreateOutfit : handleUpdateOutfit}
                disabled={formData.items.length === 0}
                className="cursor-pointer flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white px-6 py-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 shadow-lg hover:shadow-xl disabled:shadow-none flex items-center justify-center gap-2"
              >
                {showCreateModal ? (
                  <>
                    <Sparkles size={18} />
                    Create Outfit
                  </>
                ) : (
                  <>
                    <Edit size={18} />
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
                className="cursor-pointer flex-1 sm:flex-none bg-gray-600 hover:bg-gray-700 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}