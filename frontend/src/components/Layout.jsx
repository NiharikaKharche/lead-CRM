import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, PlusCircle, BarChart3, Zap } from 'lucide-react';
import './Layout.css';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/leads', icon: Users, label: 'All Leads' },
  { to: '/leads/new', icon: PlusCircle, label: 'Add Lead' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
];

export default function Layout({ children }) {
  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <Zap size={22} className="logo-icon" />
          <div>
            <span className="logo-text">LeadCRM</span>
            <span className="logo-sub">Pro</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-version">v1.0.0</div>
        </div>
      </aside>

      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
