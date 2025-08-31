import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Sidebar from '../components/dashboard/Sidebar';
import Header from '../components/dashboard/Header';
import StatsCards from '../components/dashboard/StatsCard';
import Filters from '../components/dashboard/Filters';
import OutfitTable from '../components/dashboard/OutfitTable';
import OutfitFormModal from '../components/dashboard/OutfitFormModal';

export default function Dashboard() {
  const { currentUser } = useSelector(state => state.user);
  const [outfits, setOutfits] = useState([]);
  const [filteredOutfits, setFilteredOutfits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingOutfit, setEditingOutfit] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterSection, setFilterSection] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [formData, setFormData] = useState({
    category: '',
    section: '',
    items: [],
    rateLook: 0,
    type: 'Normal',
    tags: [],
    description: '',
    image: null
  });

  const categories = [
    "Couple", "Wedding", "Traditional", "Party", "Trip/Travel",
    "Dinner", "Date", "Birthday", "Formal", "Casual", "Festival",
    "Workout", "Maternity", "Prom and Graduation", "Vacation",
    "Winter", "Summer Beachwear", "Concert and Music Festival",
    "Outdoor Adventure", "Job Interview"
  ];

  const sections = ["Men", "Women", "Kids"];
  const types = ["Normal", "Sponsored", "Promoted"];

  useEffect(() => {
    if (currentUser?.isUserAdmin) {
      fetchOutfits();
    }
  }, [currentUser]);

  useEffect(() => {
    filterOutfits();
  }, [outfits, searchTerm, filterCategory, filterSection, filterStatus]);

  const filterOutfits = () => {
    let filtered = [...outfits];
    if (searchTerm) {
      filtered = filtered.filter(outfit =>
        outfit.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        outfit.section.toLowerCase().includes(searchTerm.toLowerCase()) ||
        outfit.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filterCategory) {
      filtered = filtered.filter(outfit => outfit.category === filterCategory);
    }
    if (filterSection) {
        filtered = filtered.filter(outfit => outfit.section === filterSection);
    }
    if (filterStatus) {
      filtered = filtered.filter(outfit =>
        filterStatus === 'active' ? outfit.isActive : !outfit.isActive
      );
    }
    setFilteredOutfits(filtered);
    setCurrentPage(1);
  };

  const fetchOutfits = async () => {
    try {
      setLoading(true);
      const res = await fetch('/backend/outfit/admin/getalloutfits', {
        headers: { 'Authorization': `Bearer ${currentUser.token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setOutfits(data.outfits || []);
      } else {
        throw new Error(data.message || 'Failed to fetch outfits');
      }
    } catch (error) {
      console.error('Error fetching outfits:', error);
      // You could add a toast notification here if you have a notification system
    } finally {
      setLoading(false);
    }
  };

  const resetFormAndModals = () => {
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
    setShowCreateModal(false);
    setShowEditModal(false);
    setEditingOutfit(null);
  };

  const handleCreateOutfit = async (e) => {
    e.preventDefault();
    
    // Validation is now handled in the modal component
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('category', formData.category);
      formDataToSend.append('section', formData.section);
      formDataToSend.append('numberOfItems', formData.items.length);
      formDataToSend.append('items', JSON.stringify(formData.items));
      formDataToSend.append('rateLook', formData.rateLook);
      formDataToSend.append('type', formData.type);
      formDataToSend.append('tags', JSON.stringify(formData.tags));
      formDataToSend.append('description', formData.description);
      
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }
      
      const res = await fetch('/backend/outfit/create', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${currentUser.token}` },
        body: formDataToSend
      });
      
      const responseData = await res.json();
      
      if (!res.ok) {
        // Throw error with server message for the modal to catch
        throw new Error(responseData.message || responseData.error || 'Failed to create outfit');
      }
      
      // Success - refresh data and close modal
      resetFormAndModals();
      await fetchOutfits();
      
    } catch (error) {
      console.error('Create outfit error:', error);
      // Re-throw the error so the modal can handle it
      throw error;
    }
  };

  const handleUpdateOutfit = async (e) => {
    e.preventDefault();
    
    if (!editingOutfit?._id) {
      throw new Error('No outfit selected for editing');
    }
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('category', formData.category);
      formDataToSend.append('section', formData.section);
      formDataToSend.append('numberOfItems', formData.items.length);
      formDataToSend.append('items', JSON.stringify(formData.items));
      formDataToSend.append('rateLook', formData.rateLook);
      formDataToSend.append('type', formData.type);
      formDataToSend.append('tags', JSON.stringify(formData.tags));
      formDataToSend.append('description', formData.description);
      
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }
      
      const res = await fetch(`/backend/outfit/update/${editingOutfit._id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${currentUser.token}` },
        body: formDataToSend
      });
      
      const responseData = await res.json();
      
      if (!res.ok) {
        // Throw error with server message for the modal to catch
        throw new Error(responseData.message || responseData.error || 'Failed to update outfit');
      }
      
      // Success - refresh data and close modal
      resetFormAndModals();
      await fetchOutfits();
      
    } catch (error) {
      console.error('Update outfit error:', error);
      // Re-throw the error so the modal can handle it
      throw error;
    }
  };

  const handleDeleteOutfit = async (outfitId) => {
    // Show confirmation dialog
    const isConfirmed = window.confirm('Are you sure you want to delete this outfit? This action cannot be undone.');
    if (!isConfirmed) return;
    
    try {
      const res = await fetch(`/backend/outfit/delete/${outfitId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${currentUser.token}` }
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to delete outfit');
      }
      
      // Success - refresh the outfits list
      await fetchOutfits();
      
      // You could add a success notification here
      console.log('Outfit deleted successfully');
      
    } catch (error) {
      console.error('Delete outfit error:', error);
      
      // Show error to user - you could replace this with a toast notification
      alert(`Error deleting outfit: ${error.message}`);
    }
  };

  const handleToggleStatus = async (outfitId) => {
    try {
      const res = await fetch(`/backend/outfit/admin/togglestatus/${outfitId}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${currentUser.token}` }
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to toggle outfit status');
      }
      
      // Success - refresh the outfits list
      await fetchOutfits();
      
    } catch (error) {
      console.error('Toggle status error:', error);
      
      // Show error to user - you could replace this with a toast notification
      alert(`Error toggling outfit status: ${error.message}`);
    }
  };

  const handleEditClick = (outfit) => {
    setEditingOutfit(outfit);
    setFormData({
      category: outfit.category,
      section: outfit.section,
      items: outfit.items || [],
      rateLook: outfit.rateLook || 0,
      type: outfit.type || 'Normal',
      tags: outfit.tags || [],
      description: outfit.description || '',
      image: null // Always null for editing - user can choose to upload new image
    });
    setShowEditModal(true);
  };

  const handleCreateClick = () => {
    // Reset form data when creating new outfit
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
    setEditingOutfit(null);
    setShowCreateModal(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    resetFormAndModals();
  };

  if (!currentUser?.isUserAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg border border-gray-200">
          <div className="mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">Only administrators can access this dashboard.</p>
          <p className="text-sm text-gray-500">Please contact your system administrator if you believe you should have access.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} currentUser={currentUser} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          setSidebarOpen={setSidebarOpen} 
          setShowCreateModal={handleCreateClick}
        />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="p-4 sm:p-6 max-w-full">
            <StatsCards outfits={outfits} />
            
            <Filters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filterCategory={filterCategory}
              setFilterCategory={setFilterCategory}
              filterSection={filterSection}
              setFilterSection={setFilterSection}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              categories={categories}
              sections={sections}
            />
            
            <OutfitTable
              loading={loading}
              filteredOutfits={filteredOutfits}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              itemsPerPage={itemsPerPage}
              handleEditClick={handleEditClick}
              handleToggleStatus={handleToggleStatus}
              handleDeleteOutfit={handleDeleteOutfit}
            />
          </div>
        </main>
      </div>
      
      <OutfitFormModal
        showCreateModal={showCreateModal}
        showEditModal={showEditModal}
        setShowCreateModal={setShowCreateModal}
        setShowEditModal={setShowEditModal}
        formData={formData}
        setFormData={setFormData}
        editingOutfit={editingOutfit}
        setEditingOutfit={setEditingOutfit}
        handleCreateOutfit={handleCreateOutfit}
        handleUpdateOutfit={handleUpdateOutfit}
        categories={categories}
        sections={sections}
        types={types}
      />
    </div>
  );
}