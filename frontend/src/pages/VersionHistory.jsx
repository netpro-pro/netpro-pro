import { useNetProStore } from '../store/useNetProStore'
import { VIEWS } from '../store/constants'
import { useVersionHistory } from '../hooks/useVersionHistory'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import SkeletonRow from '../components/ui/SkeletonRow'
import SectionTitle from '../components/ui/SectionTitle'
import VersionRow from '../components/admin/VersionRow'
import ComparisonTable from '../components/admin/ComparisonTable'
import VersionInspectionModal from '../components/admin/VersionInspectionModal'
import VersionHistoryHeader from '../components/admin/VersionHistoryHeader'
import VersionTableHeaders from '../components/admin/VersionTableHeaders'
import VersionErrorAlert from '../components/admin/VersionErrorAlert'

export default function VersionHistory() {
  const { state, actions } = useVersionHistory()
  const {
    versionHistory,
    selectedVersions,
    versionComparison,
    isLoading,
    error,
    inspectedVersion,
    canCompare,
  } = state

  const {
    toggleVersionSelection,
    handleCompare,
    handleViewDetail,
    closeInspection,
    clearError,
    navigateTo,
  } = actions

  return (
    <div className="np-theme-admin" style={{ minHeight: '100vh', background: 'var(--np-bg)' }}>
      <VersionHistoryHeader />

      <main style={{ padding: '28px', maxWidth: '1100px', margin: '0 auto' }}>
        <VersionErrorAlert error={error} onClose={clearError} />

        <Card className="mb-6 overflow-hidden">
          <div style={{
            padding: '14px 20px',
            borderBottom: '1px solid var(--np-border-strong)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <SectionTitle>Historial de Eventos Técnicos</SectionTitle>
            <Button 
              onClick={handleCompare} 
              disabled={!canCompare} 
              variant={canCompare ? "primary" : "ghost"}
            >
              Comparar Versiones Seleccionadas
            </Button>
          </div>

          <div>
            <VersionTableHeaders />

            {isLoading ? (
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[1, 2, 3].map(i => <SkeletonRow key={i} />)}
              </div>
            ) : versionHistory.length === 0 ? (
              <div style={{
                padding: '36px', textAlign: 'center',
                color: 'var(--np-text-muted)', fontSize: '0.85rem',
              }}>
                No hay versiones registradas en este proyecto.
              </div>
            ) : (
              versionHistory.map((ver) => {
                const id = ver.id_version
                const isSelected = selectedVersions.includes(id)
                const label = ver.numero_version ?? `v${id}`
                return (
                  <VersionRow
                    key={id}
                    label={label}
                    isSelected={isSelected}
                    onToggle={() => toggleVersionSelection(id)}
                    onViewDetail={() => handleViewDetail(ver)}
                  />
                )
              })
            )}
          </div>
        </Card>

        <Card className="overflow-hidden">
          <div style={{
            padding: '14px 20px',
            borderBottom: '1px solid var(--np-border-strong)',
          }}>
            <SectionTitle>Comparativo de Versiones y Reportes</SectionTitle>
          </div>

          {versionComparison ? (
            <ComparisonTable comparison={versionComparison} />
          ) : (
            <div style={{
              padding: '32px', textAlign: 'center',
              color: 'var(--np-text-muted)', fontSize: '0.85rem',
            }}>
              Selecciona exactamente 2 versiones y pulsa «Comparar Versiones Seleccionadas».
            </div>
          )}
        </Card>

        <div style={{ marginTop: '28px' }}>
          <Button 
            onClick={() => navigateTo(VIEWS.PROJECT_MANAGEMENT)}
            variant="ghost"
            className="bg-np-overlay text-white hover:bg-[#2d2d2d]"
          >
            Volver
          </Button>
        </div>
      </main>

      <VersionInspectionModal
        version={inspectedVersion}
        onClose={closeInspection}
      />
    </div>
  )
}
