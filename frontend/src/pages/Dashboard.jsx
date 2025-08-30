import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Sidebar from '../components/dashboard/Sidebar';
import Header from '../components/dashboard/Header';
import StatsCards from '../components/dashboard/StatsCard';
import Filters from '../components/dashboard/FIlters';
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
    "Outdoor Adventure", "Concert"
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
      }
    } catch (error) {
      console.error('Error fetching outfits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOutfit = async (e) => {
    e.preventDefault();
    if (formData.items.length === 0) {
      alert('Please add at least one item to the outfit');
      return;
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
      const res = await fetch('/backend/outfit/create', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${currentUser.token}` },
        body: formDataToSend
      });
      const responseData = await res.json();
      if (res.ok) {
        setShowCreateModal(false);
        setFormData({
          category: '', section: '', items: [], rateLook: 0,
          type: 'Normal', tags: [], description: '', image: null
        });
        fetchOutfits();
        alert('Outfit created successfully!');
      } else {
        console.error('Server error:', responseData);
        alert(responseData.message || responseData.error || 'Error creating outfit');
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('Error creating outfit: ' + error.message);
    }
  };

  const handleUpdateOutfit = async (e) => {
    e.preventDefault();
    if (formData.items.length === 0) {
      alert('Please add at least one item to the outfit');
      return;
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
      if (res.ok) {
        setShowEditModal(false);
        setEditingOutfit(null);
        setFormData({
          category: '', section: '', items: [], rateLook: 0,
          type: 'Normal', tags: [], description: '', image: null
        });
        fetchOutfits();
        alert('Outfit updated successfully!');
      } else {
        console.error('Server error:', responseData);
        alert(responseData.message || responseData.error || 'Error updating outfit');
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('Error updating outfit: ' + error.message);
    }
  };

  const handleDeleteOutfit = async (outfitId) => {
    if (!confirm('Are you sure you want to delete this outfit?')) return;
    try {
      const res = await fetch(`/backend/outfit/delete/${outfitId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${currentUser.token}` }
      });
      if (res.ok) {
        fetchOutfits();
        alert('Outfit deleted successfully!');
      } else {
        const error = await res.json();
        alert(error.message || 'Error deleting outfit');
      }
    } catch (error) {
      alert('Error deleting outfit: ' + error.message);
    }
  };

  const handleToggleStatus = async (outfitId) => {
    try {
      const res = await fetch(`/backend/outfit/admin/togglestatus/${outfitId}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${currentUser.token}` }
      });
      if (res.ok) {
        fetchOutfits();
      }
    } catch (error) {
      alert('Error toggling status: ' + error.message);
    }
  };

  const handleEditClick = (outfit) => {
    setEditingOutfit(outfit);
    setFormData({
      category: outfit.category,
      section: outfit.section,
      items: outfit.items,
      rateLook: outfit.rateLook,
      type: outfit.type,
      tags: outfit.tags || [],
      description: outfit.description || '',
      image: null
    });
    setShowEditModal(true);
  };

  if (!currentUser?.isUserAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-600">Only administrators can access this dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} currentUser={currentUser} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} setShowCreateModal={setShowCreateModal} />
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