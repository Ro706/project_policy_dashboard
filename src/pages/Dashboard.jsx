import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import StatsCard from '../components/StatsCard';
import AddAdminModal from '../components/AddAdminModal';
import { Users, MessageSquare, Star, UserPlus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
    const [stats, setStats] = useState({ userCount: 0, feedbackCount: 0, totalRevenue: 0, avgRating: 0 });
    const [payments, setPayments] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            const statsRes = await axios.get('http://localhost:3560/api/admin/stats', { headers });
            const paymentsRes = await axios.get('http://localhost:3560/api/admin/payments', { headers });
            const feedbacksRes = await axios.get('http://localhost:3560/api/admin/feedbacks', { headers });
            const usersRes = await axios.get('http://localhost:3560/api/admin/users', { headers });

            setStats(statsRes.data);
            setPayments(paymentsRes.data);
            setFeedbacks(feedbacksRes.data);
            setUsers(usersRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAdminAdded = () => {
        alert("Admin added successfully!");
    };

    if (loading) return <div className="flex items-center justify-center h-screen bg-gray-900 text-white">Loading...</div>;

    // Prepare chart data for Feedback Distribution
    const feedbackData = [
        { name: 'Excellent', value: feedbacks.filter(f => f.experience === 'Excellent').length },
        { name: 'Good', value: feedbacks.filter(f => f.experience === 'Good').length },
        { name: 'Average', value: feedbacks.filter(f => f.experience === 'Average').length },
        { name: 'Poor', value: feedbacks.filter(f => f.experience === 'Poor').length },
        { name: 'Bad', value: feedbacks.filter(f => f.experience === 'Bad').length },
    ].filter(d => d.value > 0);

    return (
        <div className="flex min-h-screen bg-gray-900 text-gray-100">
            <Sidebar />
            <div className="flex-1 ml-64 p-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors shadow-lg shadow-blue-900/20"
                    >
                        <UserPlus size={20} />
                        <span>Add Admin</span>
                    </button>
                </div>

                <AddAdminModal 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)} 
                    onSuccess={handleAdminAdded} 
                />

                {/* Stats Grid (Revenue Removed) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <StatsCard title="Total Users" value={stats.userCount} icon={Users} color="bg-blue-600" />
                    <StatsCard title="Feedbacks" value={stats.feedbackCount} icon={MessageSquare} color="bg-purple-600" />
                    <StatsCard title="Avg Experience" value={stats.avgRating} icon={Star} color="bg-yellow-600" />
                </div>

                {/* Feedback Chart */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
                        <h3 className="text-lg font-bold text-white mb-4">Feedback Experience Distribution</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={feedbackData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                    <XAxis dataKey="name" stroke="#9CA3AF" />
                                    <YAxis stroke="#9CA3AF" />
                                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F3F4F6' }} itemStyle={{ color: '#F3F4F6' }} />
                                    <Bar dataKey="value" fill="#8884d8" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                <div id="users" className="bg-gray-800 rounded-lg shadow-lg mb-8 overflow-hidden border border-gray-700">
                    <div className="p-6 border-b border-gray-700">
                        <h3 className="text-lg font-bold text-white">Registered Users</h3>
                    </div>
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-700 text-gray-300 uppercase text-sm leading-normal">
                                <th className="py-3 px-6">Name</th>
                                <th className="py-3 px-6">Email</th>
                                <th className="py-3 px-6">Phone</th>
                                <th className="py-3 px-6">Joined Date</th>
                                <th className="py-3 px-6">Verified</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-300 text-sm font-light">
                            {users.map((user) => (
                                <tr key={user._id} className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors">
                                    <td className="py-3 px-6 font-medium text-white">{user.name}</td>
                                    <td className="py-3 px-6">{user.email}</td>
                                    <td className="py-3 px-6">{user.phone || '-'}</td>
                                    <td className="py-3 px-6">{new Date(user.date).toLocaleDateString()}</td>
                                    <td className="py-3 px-6">
                                        <span className={`py-1 px-3 rounded-full text-xs font-medium 
                                            ${user.isVerified ? 'bg-green-900/30 text-green-400 border border-green-900' : 'bg-gray-700 text-gray-400 border border-gray-600'}`}>
                                            {user.isVerified ? 'Yes' : 'No'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="py-4 text-center text-gray-500">No users found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Payments Table */}
                <div id="payments" className="bg-gray-800 rounded-lg shadow-lg mb-8 overflow-hidden border border-gray-700">
                    <div className="p-6 border-b border-gray-700">
                        <h3 className="text-lg font-bold text-white">Recent Payments</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-700 text-gray-300 uppercase text-sm leading-normal">
                                    <th className="py-3 px-6">User</th>
                                    <th className="py-3 px-6">Order ID</th>
                                    <th className="py-3 px-6">Payment ID</th>
                                    <th className="py-3 px-6">Amount</th>
                                    <th className="py-3 px-6">Status</th>
                                    <th className="py-3 px-6">Date</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-300 text-sm font-light">
                                {payments.map((payment) => (
                                    <tr key={payment._id} className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors">
                                        <td className="py-3 px-6 font-medium text-white">
                                            <div>{payment.user?.name || 'Unknown'}</div>
                                            <div className="text-xs text-gray-400">{payment.user?.email}</div>
                                        </td>
                                        <td className="py-3 px-6 font-mono text-xs text-gray-400">{payment.razorpay_order_id}</td>
                                        <td className="py-3 px-6 font-mono text-xs text-gray-400">{payment.razorpay_payment_id}</td>
                                        <td className="py-3 px-6 font-medium text-white">
                                            {payment.currency} {payment.amount}
                                        </td>
                                        <td className="py-3 px-6">
                                            <span className={`py-1 px-3 rounded-full text-xs font-medium border
                                                ${payment.status === 'captured' ? 'bg-green-900/30 text-green-400 border-green-900' : 
                                                payment.status === 'created' ? 'bg-yellow-900/30 text-yellow-400 border-yellow-900' : 'bg-red-900/30 text-red-400 border-red-900'}`}>
                                                {payment.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-6">{new Date(payment.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                                {payments.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="py-4 text-center text-gray-500">No payments found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Feedbacks Table */}
                <div id="feedbacks" className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700">
                    <div className="p-6 border-b border-gray-700">
                        <h3 className="text-lg font-bold text-white">User Feedback</h3>
                    </div>
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-700 text-gray-300 uppercase text-sm leading-normal">
                                <th className="py-3 px-6">User</th>
                                <th className="py-3 px-6">Experience</th>
                                <th className="py-3 px-6">Feedback</th>
                                <th className="py-3 px-6">Suggestion</th>
                                <th className="py-3 px-6">Date</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-300 text-sm font-light">
                            {feedbacks.map((feedback) => (
                                <tr key={feedback._id} className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors">
                                    <td className="py-3 px-6 font-medium text-white">
                                        <div>{feedback.user?.name || 'Unknown'}</div>
                                        <div className="text-xs text-gray-400">{feedback.user?.email}</div>
                                    </td>
                                    <td className="py-3 px-6">
                                        <span className={`py-1 px-3 rounded-full text-xs font-medium border
                                            ${feedback.experience === 'Excellent' ? 'bg-green-900/30 text-green-400 border-green-900' : 
                                              feedback.experience === 'Average' ? 'bg-yellow-900/30 text-yellow-400 border-yellow-900' : 'bg-red-900/30 text-red-400 border-red-900'}`}>
                                            {feedback.experience}
                                        </span>
                                    </td>
                                    <td className="py-3 px-6 max-w-xs truncate text-gray-300" title={feedback.feedback}>{feedback.feedback}</td>
                                    <td className="py-3 px-6 max-w-xs truncate text-gray-400" title={feedback.suggestion}>{feedback.suggestion || '-'}</td>
                                    <td className="py-3 px-6 text-gray-400">{new Date(feedback.date).toLocaleDateString()}</td>
                                </tr>
                            ))}
                            {feedbacks.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="py-4 text-center text-gray-500">No feedback found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;