import React from 'react';
import AdminStatCard from '../shared/AdminStatCard';

const DashboardTab = ({ stats }) => {
    return (
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, i) => (
                <AdminStatCard key={i} {...stat} colorClass={stat.color} />
            ))}
        </section>
    );
};

export default DashboardTab;
