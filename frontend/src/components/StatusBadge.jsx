import { STATUS_CONFIG } from '../utils/constants';

export default function StatusBadge({ status, size = 'md' }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG['New'];
  const sizes = { sm: '0.7rem', md: '0.78rem', lg: '0.85rem' };
  const padding = { sm: '2px 8px', md: '3px 10px', lg: '4px 12px' };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        background: config.bg + '22',
        color: config.text,
        border: `1px solid ${config.color}33`,
        borderRadius: '20px',
        fontSize: sizes[size],
        fontWeight: 600,
        padding: padding[size],
        whiteSpace: 'nowrap',
        letterSpacing: '0.02em',
        fontFamily: 'var(--font-display)',
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: config.dot,
          flexShrink: 0,
          boxShadow: `0 0 4px ${config.dot}`,
        }}
      />
      {status}
    </span>
  );
}
