import { useState, useEffect } from 'react';
import { X, User, Mail, Phone, Building2, FileText, Tag, Antenna } from 'lucide-react';
import { LEAD_STATUSES, LEAD_SOURCES } from '../utils/constants';
import './LeadForm.css';

const EMPTY = { name: '', email: '', phone: '', company: '', status: 'New', notes: '', source: 'Other' };

export default function LeadForm({ lead, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (lead) {
      setForm({
        name: lead.name || '',
        email: lead.email || '',
        phone: lead.phone || '',
        company: lead.company || '',
        status: lead.status || 'New',
        notes: lead.notes || '',
        source: lead.source || 'Other',
      });
    } else {
      setForm(EMPTY);
    }
    setErrors({});
  }, [lead]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Invalid email format';
    if (!form.phone.trim()) e.phone = 'Phone is required';
    if (!form.company.trim()) e.company = 'Company is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((err) => ({ ...err, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) onSubmit(form);
  };

  const fields = [
    { name: 'name', label: 'Full Name', icon: User, type: 'text', placeholder: 'John Doe' },
    { name: 'email', label: 'Email Address', icon: Mail, type: 'email', placeholder: 'john@company.com' },
    { name: 'phone', label: 'Phone Number', icon: Phone, type: 'tel', placeholder: '+91 98765 43210' },
    { name: 'company', label: 'Company Name', icon: Building2, type: 'text', placeholder: 'Acme Inc.' },
  ];

  return (
    <div className="form-overlay" onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="form-modal animate-fade">
        <div className="form-header">
          <div>
            <h2 className="form-title">{lead ? 'Edit Lead' : 'Add New Lead'}</h2>
            <p className="form-subtitle">{lead ? 'Update lead information' : 'Fill in the details below'}</p>
          </div>
          <button className="form-close" onClick={onCancel}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="form-body" noValidate>
          <div className="form-grid">
            {fields.map(({ name, label, icon: Icon, type, placeholder }) => (
              <div key={name} className={`form-group ${errors[name] ? 'has-error' : ''}`}>
                <label htmlFor={name} className="form-label">
                  <Icon size={13} /> {label}
                </label>
                <input
                  id={name}
                  name={name}
                  type={type}
                  value={form[name]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  className="form-input"
                  disabled={loading}
                />
                {errors[name] && <span className="form-error">{errors[name]}</span>}
              </div>
            ))}

            <div className="form-group">
              <label htmlFor="status" className="form-label">
                <Tag size={13} /> Status
              </label>
              <select id="status" name="status" value={form.status} onChange={handleChange} className="form-input" disabled={loading}>
                {LEAD_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="source" className="form-label">
                <Antenna size={13} /> Lead Source
              </label>
              <select id="source" name="source" value={form.source} onChange={handleChange} className="form-input" disabled={loading}>
                {LEAD_SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="form-group form-full">
              <label htmlFor="notes" className="form-label">
                <FileText size={13} /> Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Any additional notes about this lead..."
                className="form-input form-textarea"
                rows={3}
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <span className="btn-spinner" />
              ) : (
                lead ? 'Save Changes' : 'Create Lead'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
