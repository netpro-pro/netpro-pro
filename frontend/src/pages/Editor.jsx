import React from 'react';
import { useEditor } from '../hooks/useEditor';
import EditorHeader from '../components/editor/EditorHeader';
import NodeConfigForm from '../components/editor/NodeConfigForm';
import VLSMCalculator from '../components/editor/VLSMCalculator';
import { styles } from '../components/editor/Editor.styles';

export default function Editor() {
  const { state, actions } = useEditor();
  const { 
    userName, 
    editingNode, 
    config, 
    vlsmInputs, 
    vlsmResult, 
    vlsmError, 
    transferError, 
    validation, 
    canTransfer 
  } = state;

  return (
    <div style={styles.container}>
      <EditorHeader 
        userName={userName}
        editingNode={editingNode}
        exitEditor={actions.exitEditor}
        handleApply={actions.handleApply}
        canTransfer={canTransfer}
        validationError={validation.error}
      />

      <main style={styles.main}>
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Propiedades del Nodo</h2>

          {(transferError || !validation.ok) && (
            <div style={styles.alert(!!transferError)}>
              {transferError
                ? `❌ ${transferError}`
                : `⚠️ Pre-requisito: ${validation.error}`}
            </div>
          )}

          <div style={styles.contentGrid}>
            <NodeConfigForm 
              config={config}
              setConfig={actions.setConfig}
              nodeType={editingNode?.type}
              onUseSubnet={actions.handleUseSubnet}
              vlsmResult={vlsmResult}
            />
            
            <VLSMCalculator 
              inputs={vlsmInputs}
              setInputs={actions.setVlsmInputs}
              onCalculate={actions.handleCalculate}
              result={vlsmResult}
              error={vlsmError}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

