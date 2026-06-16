import React from 'react';
import Button from '../ui/Button';
import { styles } from './Editor.styles';

export default function EditorHeader({ 
  userName, 
  editingNode, 
  exitEditor, 
  handleApply, 
  canTransfer, 
  validationError 
}) {
  return (
    <header style={styles.header}>
      <div style={styles.headerLeft}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--np-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="2" y1="12" x2="22" y2="12"/>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
        <span style={{ color: 'var(--np-text)', fontWeight: '700', fontSize: '0.88rem', letterSpacing: '0.04em' }}>NETPRO</span>
        <span style={{ color: 'var(--np-text-muted)', fontSize: '0.78rem' }}>
          | Editor{editingNode ? ` — ${editingNode.id}` : ''} | {userName ? `Ing. ${userName}` : ''}
        </span>
      </div>

      <div style={styles.headerRight}>
        <Button variant="ghost" onClick={exitEditor}>
          Volver
        </Button>
        <Button
          variant={canTransfer ? 'primary' : 'ghost'}
          onClick={handleApply}
          disabled={!canTransfer}
          title={canTransfer ? 'Transferir configuración al nodo' : validationError}
        >
          Aplicar Configuración
        </Button>
      </div>
    </header>
  );
}
