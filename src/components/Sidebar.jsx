import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, DollarSign, MessageSquare, LogOut } from 'lucide-react';

const Sidebar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="flex flex-col h-screen w-64 bg-black text-gray-300 fixed left-0 top-0 border-r border-gray-800">
            <div className="p-6 text-2xl font-bold text-white border-b border-gray-800 tracking-wider">
                AdminPanel
            </div>
            <nav className="flex-1 p-4 space-y-2">
                <Link to="/dashboard" className="flex items-center p-3 space-x-3 rounded-md hover:bg-gray-900 hover:text-white transition-colors">
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                </Link>
                <a href="#users" className="flex items-center p-3 space-x-3 rounded-md hover:bg-gray-900 hover:text-white transition-colors">
                    <UsersIcon size={20} />
                    <span>Users</span>
                </a>
                <a href="#payments" className="flex items-center p-3 space-x-3 rounded-md hover:bg-gray-900 hover:text-white transition-colors">
                    <DollarSign size={20} />
                    <span>Payments</span>
                </a>
                <a href="#feedbacks" className="flex items-center p-3 space-x-3 rounded-md hover:bg-gray-900 hover:text-white transition-colors">
                    <MessageSquare size={20} />
                    <span>Feedbacks</span>
                </a>
            </nav>
            <div className="p-4 border-t border-gray-800">
                <button onClick={handleLogout} className="flex items-center w-full p-3 space-x-3 text-red-400 hover:bg-gray-900 hover:text-red-300 rounded-md transition-colors">
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

// Simple helper for the Users icon inside this file to avoid extra imports if not needed, 
// but standard practice is to import. I'll just add the import.
import { Users as UsersIcon } from 'lucide-react';

export default Sidebar;