import { AlertTriangle } from 'lucide-react';
import './ConfirmDialog.css';

export default function ConfirmDialog({ message, onConfirm, onCancel, loading }) {
  return (
    <div className="confirm-overlay" onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="confirm-modal animate-fade">
        <div className="confirm-icon">
          <AlertTriangle size={28} />
        </div>
        <h3 className="confirm-title">Confirm Delete</h3>
        <p className="confirm-message">{message || 'Are you sure you want to delete this lead? This cannot be undone.'}</p>
        <div className="confirm-actions">
          <button className="btn btn-ghost" onClick={onCancel} disabled={loading}>Cancel</button>
          <button className="btn btn-danger-solid" onClick={onConfirm} disabled={loading}>
            {loading ? <span className="btn-spinner" /> : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
