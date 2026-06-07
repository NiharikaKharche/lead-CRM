import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, TrendingUp, Target, XCircle, ArrowRight, Plus } from 'lucide-react';
import { leadsAPI } from '../utils/api';
import { formatDate, STATUS_CONFIG } from '../utils/constants';
import StatusBadge from '../components/StatusBadge';
import './Dashboard.css';

function StatCard({ icon: Icon, label, value, color, sub }) {
  return (
    <div className="stat-card" style={{ '--card-color': color }}>
      <div className="stat-icon"><Icon size={20} /></div>
      <div className="stat-info">
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
        {sub && <div className="stat-sub">{sub}</div>}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    leadsAPI.getStats()
      .then((res) => setStats(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="page-container">
        <div className="skeleton-header" />
        <div className="stat-grid">
          {[1,2,3,4].map(i => <div key={i} className="skeleton-card" />)}
        </div>
      </div>
    );
  }

  const statusOrder = ['New', 'Contacted', 'Qualified', 'Converted', 'Lost'];

  return (
    <div className="page-container animate-fade">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-sub">Overview of your lead pipeline</p>
        </div>
        <Link to="/leads/new" className="btn btn-primary">
          <Plus size={16} /> Add Lead
        </Link>
      </div>

      <div className="stat-grid">
        <StatCard icon={Users} label="Total Leads" value={stats?.total || 0} color="#6C63FF" />
        <StatCard icon={TrendingUp} label="Qualified" value={stats?.byStatus?.Qualified || 0} color="#8B5CF6" />
        <StatCard icon={Target} label="Converted" value={stats?.byStatus?.Converted || 0} color="#10B981" sub={`${stats?.conversionRate}% rate`} />
        <StatCard icon={XCircle} label="Lost" value={stats?.byStatus?.Lost || 0} color="#EF4444" />
      </div>

      <div className="dash-grid">
        {/* Status Breakdown */}
        <div className="dash-card">
          <div className="dash-card-header">
            <h2 className="dash-card-title">Pipeline Status</h2>
          </div>
          <div className="status-breakdown">
            {statusOrder.map((status) => {
              const count = stats?.byStatus?.[status] || 0;
              const total = stats?.total || 1;
              const pct = Math.round((count / total) * 100);
              const cfg = STATUS_CONFIG[status];
              return (
                <div key={status} className="status-row">
                  <div className="status-row-label">
                    <span className="status-dot" style={{ background: cfg.dot }} />
                    <span>{status}</span>
                  </div>
                  <div className="status-bar-wrap">
                    <div className="status-bar" style={{ width: `${pct}%`, background: cfg.color }} />
                  </div>
                  <span className="status-count">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Leads */}
        <div className="dash-card">
          <div className="dash-card-header">
            <h2 className="dash-card-title">Recent Leads</h2>
            <Link to="/leads" className="dash-link">View all <ArrowRight size={13} /></Link>
          </div>
          <div className="recent-leads">
            {stats?.recentLeads?.length === 0 ? (
              <div className="empty-state-small">No leads yet. <Link to="/leads/new">Add one!</Link></div>
            ) : (
              stats?.recentLeads?.map((lead) => (
                <div key={lead._id} className="recent-lead-row">
                  <div className="recent-lead-avatar">{lead.name?.[0]?.toUpperCase()}</div>
                  <div className="recent-lead-info">
                    <div className="recent-lead-name">{lead.name}</div>
                    <div className="recent-lead-company">{lead.company} · {formatDate(lead.createdAt)}</div>
                  </div>
                  <StatusBadge status={lead.status} size="sm" />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
