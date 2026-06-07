import { useState, useEffect } from 'react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, LineChart, Line, CartesianGrid, Legend
} from 'recharts';
import { leadsAPI } from '../utils/api';
import { STATUS_CONFIG } from '../utils/constants';
import './Analytics.css';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <div className="tooltip-label">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="tooltip-item" style={{ color: p.color || p.fill }}>
          {p.name}: <strong>{p.value}</strong>
        </div>
      ))}
    </div>
  );
};

export default function Analytics() {
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
        <div className="analytics-grid">
          {[1,2,3].map(i => <div key={i} className="skeleton-card" style={{ height: 300 }} />)}
        </div>
      </div>
    );
  }

  const statusData = Object.entries(stats?.byStatus || {}).map(([name, value]) => ({
    name, value, color: STATUS_CONFIG[name]?.color || '#888'
  }));

  const sourceData = (stats?.bySource || []).map(s => ({
    name: s._id || 'Unknown', count: s.count
  }));

  const monthlyData = (stats?.monthlyLeads || []).map(m => ({
    month: MONTHS[(m._id.month || 1) - 1],
    leads: m.count,
  }));

  return (
    <div className="page-container animate-fade">
      <div className="page-header">
        <div>
          <h1 className="page-title">Analytics</h1>
          <p className="page-sub">Insights into your lead pipeline</p>
        </div>
      </div>

      {/* KPI row */}
      <div className="kpi-row">
        {[
          { label: 'Total Leads', value: stats?.total || 0 },
          { label: 'Converted', value: stats?.byStatus?.Converted || 0 },
          { label: 'In Progress', value: (stats?.byStatus?.Contacted || 0) + (stats?.byStatus?.Qualified || 0) },
          { label: 'Conversion Rate', value: `${stats?.conversionRate || 0}%` },
        ].map(({ label, value }) => (
          <div key={label} className="kpi-card">
            <div className="kpi-value">{value}</div>
            <div className="kpi-label">{label}</div>
          </div>
        ))}
      </div>

      <div className="analytics-grid">
        {/* Status Pie */}
        <div className="chart-card">
          <h2 className="chart-title">Lead Status Distribution</h2>
          {statusData.length === 0 ? (
            <div className="chart-empty">No data</div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {statusData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="pie-legend">
                {statusData.map(({ name, value, color }) => (
                  <div key={name} className="legend-item">
                    <span className="legend-dot" style={{ background: color }} />
                    <span className="legend-name">{name}</span>
                    <span className="legend-val">{value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Source Bar */}
        <div className="chart-card">
          <h2 className="chart-title">Leads by Source</h2>
          {sourceData.length === 0 ? (
            <div className="chart-empty">No data</div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={sourceData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: '#8888A0', fontSize: 11 }} angle={-20} textAnchor="end" />
                <YAxis tick={{ fill: '#8888A0', fontSize: 11 }} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="#6C63FF" radius={[4, 4, 0, 0]} name="Leads" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Monthly trend */}
        <div className="chart-card chart-full">
          <h2 className="chart-title">Monthly Lead Trend (Last 6 months)</h2>
          {monthlyData.length === 0 ? (
            <div className="chart-empty">Not enough data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={monthlyData} margin={{ top: 10, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fill: '#8888A0', fontSize: 12 }} />
                <YAxis tick={{ fill: '#8888A0', fontSize: 12 }} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="leads"
                  stroke="#6C63FF"
                  strokeWidth={2.5}
                  dot={{ fill: '#6C63FF', r: 4 }}
                  activeDot={{ r: 6, fill: '#8B85FF' }}
                  name="New Leads"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
