import React from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import SectionTitle from '../ui/SectionTitle';
import VLSMResult from './VLSMResult';
import { styles } from './Editor.styles';

export default function VLSMCalculator({ 
  inputs, 
  setInputs, 
  onCalculate, 
  result, 
  error 
}) {
  return (
    <div style={styles.column}>
      <SectionTitle>CALCULADORA VLSM</SectionTitle>

      <div style={styles.vlsmGroup}>
        <Input 
          label="Dirección de red base"
          value={inputs.baseIp}
          onChange={e => setInputs(prev => ({ ...prev, baseIp: e.target.value }))}
          placeholder="192.168.1.0"
        />

        <div style={styles.checkboxGroup}>
          <label style={{ color: 'var(--np-cyan)', fontSize: '0.78rem', fontWeight: '500' }}>Host Requeridos</label>
          <div style={styles.vlsmInputGroup}>
            <Input
              value={inputs.hosts}
              onChange={e => setInputs(prev => ({ ...prev, hosts: e.target.value }))}
              onKeyDown={e => e.key === 'Enter' && onCalculate()}
              placeholder="Ej: 50"
              type="number"
              min="1"
              style={{ flex: 1 }}
            />
            <Button
              variant="ghost"
              onClick={onCalculate}
              style={{ height: '40px' }}
            >
              Calcular
            </Button>
          </div>
        </div>

        <div style={styles.vlsmResultBox}>
          {error && (
            <div style={{ color: 'var(--np-danger)', fontSize: '0.78rem', marginBottom: '8px' }}>
              ⚠️ {error}
            </div>
          )}
          {result ? (
            <VLSMResult result={result} />
          ) : (
            <div style={{ color: 'var(--np-text-muted)', fontSize: '0.78rem', fontFamily: 'JetBrains Mono, monospace' }}>
              Ingresa el número de hosts y presiona Calcular.
            </div>
          )}
        </div>

        {result && (
          <div style={styles.vlsmEfficiency}>
            Eficiencia: {Math.round((result.requiredHosts / result.usableHosts) * 100)}%
            {' '}({result.usableHosts - result.requiredHosts} dirs. de margen)
          </div>
        )}
      </div>
    </div>
  );
}
