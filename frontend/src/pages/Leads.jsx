import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Search, Plus, Edit2, Trash2, ChevronUp, ChevronDown, ChevronsUpDown,
  Mail, Phone, Building2, ChevronLeft, ChevronRight, Filter, X
} from 'lucide-react';
import toast from 'react-hot-toast';
import { leadsAPI } from '../utils/api';
import { LEAD_STATUSES, LEAD_SOURCES, formatDate } from '../utils/constants';
import StatusBadge from '../components/StatusBadge';
import LeadForm from '../components/LeadForm';
import ConfirmDialog from '../components/ConfirmDialog';
import './Leads.css';

const SORT_FIELDS = [
  { key: 'createdAt', label: 'Date' },
  { key: 'name', label: 'Name' },
  { key: 'company', label: 'Company' },
  { key: 'status', label: 'Status' },
];

function SortIcon({ field, current, order }) {
  if (current !== field) return <ChevronsUpDown size={13} className="sort-icon-dim" />;
  return order === 'asc' ? <ChevronUp size={13} /> : <ChevronDown size={13} />;
}

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1, limit: 10 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editLead, setEditLead] = useState(null);
  const [deleteLead, setDeleteLead] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const searchTimer = useRef(null);

  const fetchLeads = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const res = await leadsAPI.getAll({
        search: params.search ?? search,
        status: params.status ?? statusFilter,
        sortBy: params.sortBy ?? sortBy,
        sortOrder: params.sortOrder ?? sortOrder,
        page: params.page ?? page,
        limit: 10,
      });
      setLeads(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, sortBy, sortOrder, page]);

  useEffect(() => { fetchLeads(); }, [statusFilter, sortBy, sortOrder, page]);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    setPage(1);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      fetchLeads({ search: val, page: 1 });
    }, 400);
  };

  const handleSort = (field) => {
    const newOrder = sortBy === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortBy(field);
    setSortOrder(newOrder);
  };

  const handleCreate = async (data) => {
    setFormLoading(true);
    try {
      await leadsAPI.create(data);
      toast.success('Lead created!');
      setShowForm(false);
      fetchLeads({ page: 1 });
      setPage(1);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdate = async (data) => {
    setFormLoading(true);
    try {
      await leadsAPI.update(editLead._id, data);
      toast.success('Lead updated!');
      setEditLead(null);
      fetchLeads();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await leadsAPI.delete(deleteLead._id);
      toast.success('Lead deleted');
      setDeleteLead(null);
      fetchLeads();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('All');
    setSortBy('createdAt');
    setSortOrder('desc');
    setPage(1);
  };

  const hasFilters = search || statusFilter !== 'All';

  return (
    <div className="page-container animate-fade">
      <div className="page-header">
        <div>
          <h1 className="page-title">All Leads</h1>
          <p className="page-sub">{pagination.total} total leads</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <Plus size={16} /> Add Lead
        </button>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="search-wrap">
          <Search size={15} className="search-icon" />
          <input
            className="search-input"
            placeholder="Search name, email, company..."
            value={search}
            onChange={handleSearchChange}
          />
          {search && (
            <button className="search-clear" onClick={() => { setSearch(''); fetchLeads({ search: '', page: 1 }); }}>
              <X size={14} />
            </button>
          )}
        </div>

        <div className="filter-group">
          <Filter size={14} className="filter-icon" />
          <select className="filter-select" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
            <option value="All">All Statuses</option>
            {LEAD_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {hasFilters && (
          <button className="btn-clear-filters" onClick={clearFilters}>
            <X size={13} /> Clear
          </button>
        )}
      </div>

      {/* Table */}
      <div className="table-wrap">
        <table className="leads-table">
          <thead>
            <tr>
              <th className="th-name" onClick={() => handleSort('name')}>
                <span>Name</span><SortIcon field="name" current={sortBy} order={sortOrder} />
              </th>
              <th>Contact</th>
              <th onClick={() => handleSort('company')}>
                <span>Company</span><SortIcon field="company" current={sortBy} order={sortOrder} />
              </th>
              <th onClick={() => handleSort('status')}>
                <span>Status</span><SortIcon field="status" current={sortBy} order={sortOrder} />
              </th>
              <th onClick={() => handleSort('createdAt')}>
                <span>Created</span><SortIcon field="createdAt" current={sortBy} order={sortOrder} />
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="skeleton-row">
                  {[...Array(6)].map((_, j) => <td key={j}><div className="skeleton-cell" /></td>)}
                </tr>
              ))
            ) : leads.length === 0 ? (
              <tr>
                <td colSpan={6} className="empty-row">
                  <div className="empty-state">
                    <div className="empty-icon">🔍</div>
                    <div className="empty-title">No leads found</div>
                    <div className="empty-sub">
                      {hasFilters ? 'Try adjusting your filters.' : 'Add your first lead to get started.'}
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              leads.map((lead, i) => (
                <tr key={lead._id} className="lead-row" style={{ animationDelay: `${i * 30}ms` }}>
                  <td>
                    <div className="lead-name-cell">
                      <div className="lead-avatar">{lead.name?.[0]?.toUpperCase()}</div>
                      <div>
                        <div className="lead-name">{lead.name}</div>
                        {lead.notes && <div className="lead-notes-preview" title={lead.notes}>{lead.notes.slice(0, 40)}{lead.notes.length > 40 ? '…' : ''}</div>}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="contact-cell">
                      <a href={`mailto:${lead.email}`} className="contact-link"><Mail size={12} />{lead.email}</a>
                      <a href={`tel:${lead.phone}`} className="contact-link"><Phone size={12} />{lead.phone}</a>
                    </div>
                  </td>
                  <td>
                    <div className="company-cell"><Building2 size={13} />{lead.company}</div>
                  </td>
                  <td><StatusBadge status={lead.status} /></td>
                  <td className="date-cell">{formatDate(lead.createdAt)}</td>
                  <td>
                    <div className="actions-cell">
                      <button className="action-btn edit" onClick={() => setEditLead(lead)} title="Edit">
                        <Edit2 size={14} />
                      </button>
                      <button className="action-btn delete" onClick={() => setDeleteLead(lead)} title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="pagination">
          <span className="pagination-info">
            {(page - 1) * 10 + 1}–{Math.min(page * 10, pagination.total)} of {pagination.total}
          </span>
          <div className="pagination-controls">
            <button className="page-btn" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
              <ChevronLeft size={15} />
            </button>
            {[...Array(pagination.pages)].map((_, i) => {
              const p = i + 1;
              if (p === 1 || p === pagination.pages || (p >= page - 1 && p <= page + 1)) {
                return (
                  <button key={p} className={`page-btn ${p === page ? 'active' : ''}`} onClick={() => setPage(p)}>
                    {p}
                  </button>
                );
              }
              if (p === page - 2 || p === page + 2) return <span key={p} className="page-dots">…</span>;
              return null;
            })}
            <button className="page-btn" disabled={page >= pagination.pages} onClick={() => setPage(p => p + 1)}>
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      {showForm && (
        <LeadForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} loading={formLoading} />
      )}
      {editLead && (
        <LeadForm lead={editLead} onSubmit={handleUpdate} onCancel={() => setEditLead(null)} loading={formLoading} />
      )}
      {deleteLead && (
        <ConfirmDialog
          message={`Delete "${deleteLead.name}"? This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteLead(null)}
          loading={deleteLoading}
        />
      )}
    </div>
  );
}
