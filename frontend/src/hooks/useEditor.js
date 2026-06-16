import { useState, useEffect } from 'react';
import { useNetProStore } from '../store/useNetProStore';
import { validateNodeConfig } from '../utils/netpro-validation';
import { calculateVLSM } from '../utils/network';

export function useEditor() {
  const userName = useNetProStore(s => s.userName);
  const editingNode = useNetProStore(s => s.editingNode);
  const applyChanges = useNetProStore(s => s.applyNodeChanges);
  const exitEditor = useNetProStore(s => s.exitEditor);

  // Node configuration state
  const [config, setConfig] = useState({
    deviceName: editingNode?.id ?? '',
    label: editingNode?.label ?? '',
    ip: editingNode?.ip ?? '',
    mask: editingNode?.mask ?? '',
    dhcp: editingNode?.dhcp === true,
  });

  useEffect(() => {
    if (editingNode) {
      setConfig({
        deviceName: editingNode.id ?? '',
        label: editingNode.label ?? '',
        ip: editingNode.ip ?? '',
        mask: editingNode.mask ?? '',
        dhcp: editingNode.dhcp === true,
      });
    }
  }, [editingNode]);

  // VLSM state
  const [vlsmInputs, setVlsmInputs] = useState({
    hosts: '',
    baseIp: '192.168.1.0',
  });
  const [vlsmResult, setVlsmResult] = useState(null);
  const [vlsmError, setVlsmError] = useState('');
  const [transferError, setTransferError] = useState('');


  const handleCalculate = () => {
    setVlsmError('');
    setVlsmResult(null);
    try {
      const result = calculateVLSM(vlsmInputs.hosts, vlsmInputs.baseIp);
      setVlsmResult(result);
    } catch (e) {
      setVlsmError(e.message);
    }
  };

  const validation = validateNodeConfig({ 
    ip: config.ip, 
    mask: config.mask, 
    dhcp: config.dhcp 
  });

  const handleApply = () => {
    setTransferError('');
    const changes = {
      name: config.deviceName,
      label: config.label,
      ip: config.ip,
      mask: config.mask,
      dhcp: config.dhcp,
    };
    const res = applyChanges(changes);
    if (res && res.ok === false) {
      setTransferError(res.error || 'No se pudo aplicar la configuración.');
    }
  };

  const handleUseSubnet = () => {
    if (!vlsmResult) return;
    setConfig(prev => ({
      ...prev,
      mask: vlsmResult.mask,
      ip: prev.ip || vlsmResult.start,
    }));
  };

  return {
    state: {
      userName,
      editingNode,
      config,
      vlsmInputs,
      vlsmResult,
      vlsmError,
      transferError,
      validation,
      canTransfer: validation.ok,
    },
    actions: {
      setConfig,
      setVlsmInputs,
      handleCalculate,
      handleApply,
      handleUseSubnet,
      exitEditor,
    }
  };
}
