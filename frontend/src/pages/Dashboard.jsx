import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  Plus, Edit, Trash2, Eye, Image, Star, Heart, MessageSquare, Package,
  LayoutDashboard, Users, Settings, BarChart3, Menu, X, Search,
  Filter, Download, MoreHorizontal, ChevronLeft, ChevronRight, Home
} from 'lucide-react';
import { Link } from 'react-router-dom';

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

    const sidebarItems = [
        { id: 'home', label: 'Home', icon: Home, active: false, isLink: true, href: '/' },
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, active: true },
        { id: 'users', label: 'Users', icon: Users, active: false },
        { id: 'analytics', label: 'Analytics', icon: BarChart3, active: false },
        { id: 'settings', label: 'Settings', icon: Settings, active: false },
    ];

    useEffect(() => {
        if (currentUser?.isUserAdmin) {
            fetchOutfits();
        }
    }, [currentUser]);

    useEffect(() => {
        filterOutfits();
    }, [outfits, searchTerm, filterCategory, filterStatus]);

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
                headers: {
                    'Authorization': `Bearer ${currentUser.token}`
                }
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
                headers: {
                    'Authorization': `Bearer ${currentUser.token}`
                },
                body: formDataToSend
            });

            const responseData = await res.json();
            
            if (res.ok) {
                setShowCreateModal(false);
                resetForm();
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
                headers: {
                    'Authorization': `Bearer ${currentUser.token}`
                },
                body: formDataToSend
            });

            const responseData = await res.json();

            if (res.ok) {
                setShowEditModal(false);
                setEditingOutfit(null);
                resetForm();
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
                headers: {
                    'Authorization': `Bearer ${currentUser.token}`
                }
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
                headers: {
                    'Authorization': `Bearer ${currentUser.token}`
                }
            });

            if (res.ok) {
                fetchOutfits();
            }
        } catch (error) {
            alert('Error toggling status: ' + error.message);
        }
    };

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

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentOutfits = filteredOutfits.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredOutfits.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-0`}>
                <div className="flex items-center justify-between h-16 px-6 bg-blue-600 text-white">
                    <h1 className="text-xl font-bold">Admin Panel</h1>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden"
                    >
                        <X size={24} />
                    </button>
                </div>
                
                <nav className="mt-8">
                    {sidebarItems.map((item) => (
                        item.isLink ? (
                            <Link
                                key={item.id}
                                to={item.href}
                                className={`flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors ${
                                    item.active ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : ''
                                }`}
                            >
                                <item.icon size={20} className="mr-3" />
                                {item.label}
                            </Link>
                        ) : (
                              <a
                                key={item.id}
                                href="#"
                                className={`flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors ${
                                    item.active ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : ''
                                }`}
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

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
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

                {/* Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
                    <div className="p-4 sm:p-6 max-w-full">
                        {/* Stats Cards */}
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

                        {/* Filters */}
                        <div className="bg-white rounded-lg shadow mb-6">
                            <div className="p-4 sm:p-6">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="flex-1">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                            <input
                                                type="text"
                                                placeholder="Search outfits..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                    
                                    <select
                                        value={filterCategory}
                                        onChange={(e) => setFilterCategory(e.target.value)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="">All Categories</option>
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                    
                                    <select
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="">All Status</option>
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                    
                                    <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center gap-2 transition-colors">
                                        <Download size={16} />
                                        <span className="hidden sm:inline">Export</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            {loading ? (
                                <div className="p-12 text-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                                    <p className="mt-4 text-gray-600">Loading outfits...</p>
                                </div>
                            ) : (
                                <>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Outfit
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Category
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Section
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Items
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Rating
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Engagement
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Status
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {currentOutfits.map((outfit) => (
                                                    <tr key={outfit._id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <div className="flex-shrink-0 h-12 w-12">
                                                                    <img
                                                                        className="h-12 w-12 rounded-lg object-cover"
                                                                        src={outfit.image}
                                                                        alt="Outfit"
                                                                    />
                                                                </div>
                                                                <div className="ml-4">
                                                                    <div className="text-sm font-medium text-gray-900">
                                                                        {outfit.category}
                                                                    </div>
                                                                    <div className="text-sm text-gray-500">
                                                                        {outfit.type}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {outfit.category}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {outfit.section}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            <div className="flex items-center">
                                                                <Package size={16} className="mr-1" />
                                                                {outfit.numberOfItems}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            <div className="flex items-center">
                                                                <Star size={16} className="mr-1 text-yellow-400" />
                                                                {outfit.rateLook}/5
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            <div className="flex items-center space-x-4">
                                                                <div className="flex items-center">
                                                                    <Heart size={16} className="mr-1 text-red-400" />
                                                                    {outfit.numberOfLikes || 0}
                                                                </div>
                                                                <div className="flex items-center">
                                                                    <MessageSquare size={16} className="mr-1 text-blue-400" />
                                                                    {outfit.numberOfComments || 0}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                                outfit.isActive 
                                                                    ? 'bg-green-100 text-green-800' 
                                                                    : 'bg-red-100 text-red-800'
                                                            }`}>
                                                                {outfit.isActive ? 'Active' : 'Inactive'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                            <div className="flex items-center space-x-2">
                                                                <button
                                                                    onClick={() => handleEditClick(outfit)}
                                                                    className="text-blue-600 hover:text-blue-900 p-1 rounded-lg hover:bg-blue-50"
                                                                    title="Edit"
                                                                >
                                                                    <Edit size={16} />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleToggleStatus(outfit._id)}
                                                                    className={`p-1 rounded-lg ${
                                                                        outfit.isActive 
                                                                            ? 'text-red-600 hover:text-red-900 hover:bg-red-50' 
                                                                            : 'text-green-600 hover:text-green-900 hover:bg-green-50'
                                                                    }`}
                                                                    title={outfit.isActive ? 'Deactivate' : 'Activate'}
                                                                >
                                                                    <Eye size={16} />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteOutfit(outfit._id)}
                                                                    className="text-red-600 hover:text-red-900 p-1 rounded-lg hover:bg-red-50"
                                                                    title="Delete"
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
                                        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                                            <div className="flex-1 flex justify-between sm:hidden">
                                                <button
                                                    onClick={() => paginate(currentPage - 1)}
                                                    disabled={currentPage === 1}
                                                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                                                >
                                                    Previous
                                                </button>
                                                <button
                                                    onClick={() => paginate(currentPage + 1)}
                                                    disabled={currentPage === totalPages}
                                                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                                                >
                                                    Next
                                                </button>
                                            </div>
                                            
                                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                                <div>
                                                    <p className="text-sm text-gray-700">
                                                        Showing{' '}
                                                        <span className="font-medium">{indexOfFirstItem + 1}</span>
                                                        {' '}to{' '}
                                                        <span className="font-medium">
                                                            {Math.min(indexOfLastItem, filteredOutfits.length)}
                                                        </span>
                                                        {' '}of{' '}
                                                        <span className="font-medium">{filteredOutfits.length}</span>
                                                        {' '}results
                                                    </p>
                                                </div>
                                                <div>
                                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                                        <button
                                                            onClick={() => paginate(currentPage - 1)}
                                                            disabled={currentPage === 1}
                                                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                                                        >
                                                            <ChevronLeft size={20} />
                                                        </button>
                                                        
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
                                                                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                                            pageNumber === currentPage
                                                                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
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
                                                                    <span
                                                                        key={pageNumber}
                                                                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                                                                    >
                                                                        ...
                                                                    </span>
                                                                );
                                                            }
                                                            return null;
                                                        })}
                                                        
                                                        <button
                                                            onClick={() => paginate(currentPage + 1)}
                                                            disabled={currentPage === totalPages}
                                                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                                                        >
                                                            <ChevronRight size={20} />
                                                        </button>
                                                    </nav>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {filteredOutfits.length === 0 && !loading && (
                                        <div className="text-center py-12">
                                            <Package size={48} className="mx-auto text-gray-400 mb-4" />
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">No outfits found</h3>
                                            <p className="text-gray-500 mb-4">
                                                {searchTerm || filterCategory || filterStatus 
                                                    ? 'Try adjusting your search or filters'
                                                    : 'Get started by creating your first outfit'
                                                }
                                            </p>
                                            {!searchTerm && !filterCategory && !filterStatus && (
                                                <button
                                                    onClick={() => setShowCreateModal(true)}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                                                >
                                                    Create Your First Outfit
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </main>
            </div>

            {/* Create/Edit Modal */}
            {(showCreateModal || showEditModal) && (
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
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Category *
                                    </label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData(prev => ({...prev, category: e.target.value}))}
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
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Section *
                                    </label>
                                    <select
                                        value={formData.section}
                                        onChange={(e) => setFormData(prev => ({...prev, section: e.target.value}))}
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
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Rating (0-5) *
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="5"
                                        step="0.1"
                                        value={formData.rateLook}
                                        onChange={(e) => setFormData(prev => ({...prev, rateLook: parseFloat(e.target.value) || 0}))}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Type
                                    </label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData(prev => ({...prev, type: e.target.value}))}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        {types.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Outfit Image {showCreateModal && '*'}
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setFormData(prev => ({...prev, image: e.target.files[0]}))}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required={showCreateModal}
                                    />
                                    {showEditModal && (
                                        <p className="text-sm text-gray-500 mt-1">
                                            Leave empty to keep the current image
                                        </p>
                                    )}
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        rows="3"
                                        maxLength="500"
                                        placeholder="Optional description..."
                                    />
                                    <p className="text-sm text-gray-500 mt-1">
                                        {formData.description.length}/500 characters
                                    </p>
                                </div>
                            </div>

                            {/* Items Section */}
                            <div className="border-t pt-8">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Outfit Items ({formData.items.length})
                                    </h3>
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
                                        <p className="text-sm text-gray-400">
                                            Click "Add Item" to start building your outfit
                                        </p>
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
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Source Name *
                                                </label>
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
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Item Name *
                                                </label>
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
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Price ($) *
                                                </label>
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
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Item Link *
                                                </label>
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
            )}
        </div>
    );
}