import React from 'react';
import { styles } from './Editor.styles';

export default function VLSMResult({ result }) {
  const rows = [
    { label: 'Hosts requeridos',     value: result.requiredHosts },
    { label: 'Hosts usables',        value: result.usableHosts },
    { label: 'Total de direcciones', value: result.totalAddresses },
    { label: 'Prefijo CIDR',         value: `/${result.prefix}` },
    { label: 'Máscara de subred',    value: result.mask },
    { label: 'Dirección de red',     value: result.network },
    { label: 'Rango inicio',         value: result.start },
    { label: 'Rango fin',            value: result.end },
    { label: 'Broadcast',            value: result.broadcast },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
      {rows.map(row => (
        <div key={row.label} style={styles.vlsmRow}>
          <span style={styles.vlsmLabel}>{row.label}</span>
          <span style={styles.vlsmValue}>
            {String(row.value)}
          </span>
        </div>
      ))}
    </div>
  );
}
