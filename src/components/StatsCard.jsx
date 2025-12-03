import React from 'react';

const StatsCard = ({ title, value, icon: Icon, color }) => {
    return (
        <div className="p-6 bg-gray-800 rounded-lg shadow-lg flex items-center space-x-4 border border-gray-700">
            <div className={`p-3 rounded-full ${color} text-white shadow-inner`}>
                <Icon size={24} />
            </div>
            <div>
                <p className="text-gray-400 text-sm font-medium">{title}</p>
                <h3 className="text-2xl font-bold text-white">{value}</h3>
            </div>
        </div>
    );
};

export default StatsCard;