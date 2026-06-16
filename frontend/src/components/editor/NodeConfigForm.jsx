import React from 'react';
import Input from '../ui/Input';
import SectionTitle from '../ui/SectionTitle';
import { styles } from './Editor.styles';

export default function NodeConfigForm({ 
  config, 
  setConfig, 
  nodeType,
  onUseSubnet,
  vlsmResult 
}) {
  return (
    <div style={styles.column}>
      <SectionTitle>CONFIGURACION GENERAL</SectionTitle>

      <div style={styles.formGroup}>
        <Input 
          label="Nombre del dispositivo"
          value={config.deviceName}
          onChange={e => setConfig(prev => ({ ...prev, deviceName: e.target.value }))}
          placeholder="Ej: R1, SW1, PC_Finanzas"
        />

        <Input 
          label="Tipo de dispositivo"
          disabled
          value={nodeType ?? 'pc'}
          className="capitalize"
        />

        <Input 
          label="Etiqueta (Label)"
          value={config.label}
          onChange={e => setConfig(prev => ({ ...prev, label: e.target.value }))}
          placeholder='Ej: "Gateway_Principal"'
        />

        <Input 
          label="Dirección IP Asignada *"
          value={config.ip}
          onChange={e => setConfig(prev => ({ ...prev, ip: e.target.value }))}
          placeholder="Ej: 192.168.1.1"
        />

        <Input 
          label="Mascara de Red *"
          value={config.mask}
          onChange={e => setConfig(prev => ({ ...prev, mask: e.target.value }))}
          placeholder="Ej: 255.255.255.0"
        />

        <div style={styles.checkboxGroup}>
          <label style={{ color: 'var(--np-cyan)', fontSize: '0.78rem', fontWeight: '500' }}>DHCP</label>
          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={config.dhcp}
              onChange={e => setConfig(prev => ({ ...prev, dhcp: e.target.checked }))}
              style={{ width: 16, height: 16, cursor: 'pointer' }}
            />
            <span>
              {config.dhcp
                ? '⚠️ DHCP ACTIVADO — desactívalo para transferir'
                : 'DHCP desactivado (configuración manual)'}
            </span>
          </label>
        </div>

        {vlsmResult && (
          <button
            onClick={onUseSubnet}
            style={styles.useSubnetBtn}
          >
            ← Usar subred calculada ({vlsmResult.mask})
          </button>
        )}
      </div>
    </div>
  );
}
