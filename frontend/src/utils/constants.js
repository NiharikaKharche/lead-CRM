export const LEAD_STATUSES = ['New', 'Contacted', 'Qualified', 'Converted', 'Lost'];

export const LEAD_SOURCES = [
  'Website',
  'Referral',
  'Cold Call',
  'Social Media',
  'Email',
  'Other',
];

export const STATUS_CONFIG = {
  New: { color: '#3B82F6', bg: '#EFF6FF', text: '#1D4ED8', dot: '#3B82F6' },
  Contacted: { color: '#F59E0B', bg: '#FFFBEB', text: '#92400E', dot: '#F59E0B' },
  Qualified: { color: '#8B5CF6', bg: '#F5F3FF', text: '#5B21B6', dot: '#8B5CF6' },
  Converted: { color: '#10B981', bg: '#ECFDF5', text: '#064E3B', dot: '#10B981' },
  Lost: { color: '#EF4444', bg: '#FEF2F2', text: '#991B1B', dot: '#EF4444' },
};

export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const formatPhone = (phone) => {
  if (!phone) return '—';
  return phone;
};
