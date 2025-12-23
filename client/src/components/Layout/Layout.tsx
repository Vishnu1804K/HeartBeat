import React, { useState, FC } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
    FiHome,
    FiUser,
    FiTarget,
    FiActivity,
    FiHeart,
    FiLogOut,
    FiMenu,
    FiX,
    FiUsers,
    FiBookOpen
} from 'react-icons/fi';
import { IconType } from 'react-icons';
import { useAuth } from '../../context/AuthContext';
import './Layout.css';

interface NavItem {
    path: string;
    icon: IconType;
    label: string;
}

const Layout: FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

    const handleLogout = (): void => {
        logout();
        navigate('/login');
    };

    const navItems: NavItem[] = [
        { path: '/dashboard', icon: FiHome, label: 'Dashboard' },
        { path: '/profile', icon: FiUser, label: 'Profile' },
        { path: '/fitness-goals', icon: FiTarget, label: 'Fitness Goals' },
        { path: '/activities', icon: FiActivity, label: 'Activities' },
        { path: '/vital-signs', icon: FiHeart, label: 'Vital Signs' },
        { path: '/healthcare', icon: FiUsers, label: 'Healthcare' },
        { path: '/resources', icon: FiBookOpen, label: 'Resources' }
    ];

    return (
        <div className="layout">
            <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <div className="logo">
                        <span className="logo-icon">💚</span>
                        <span className="logo-text">HeartBeat</span>
                    </div>
                    <button className="close-sidebar" onClick={() => setSidebarOpen(false)}>
                        <FiX />
                    </button>
                </div>

                <nav className="sidebar-nav">
                    {navItems.map(({ path, icon: Icon, label }) => (
                        <NavLink
                            key={path}
                            to={path}
                            className={({ isActive }: { isActive: boolean }) => `nav-link ${isActive ? 'active' : ''}`}
                            onClick={() => setSidebarOpen(false)}
                        >
                            <Icon className="nav-icon" />
                            <span>{label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <div className="user-info">
                        <div className="user-avatar">
                            {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div className="user-details">
                            <span className="user-name">{user?.name || 'User'}</span>
                            <span className="user-email">{user?.email}</span>
                        </div>
                    </div>
                    <button className="logout-btn" onClick={handleLogout}>
                        <FiLogOut />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            <div className="main-wrapper">
                <header className="topbar">
                    <button className="menu-toggle" onClick={() => setSidebarOpen(true)}>
                        <FiMenu />
                    </button>
                    <div className="topbar-title">
                        <h1>HeartBeat</h1>
                    </div>
                </header>

                <main className="main-content">
                    <Outlet />
                </main>
            </div>

            {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
        </div>
    );
};

export default Layout;
