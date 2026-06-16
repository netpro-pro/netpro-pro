import Button from './Button'
import Modal from './Modal'

export default function ConfirmModal({
  open,
  title = '¿Confirmar acción?',
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  destructive = false,
  onConfirm,
  onCancel,
}) {
  return (
    <Modal
      open={open}
      title={title}
      onClose={onCancel}
      destructive={destructive}
      footer={
        <>
          <Button variant="ghost" size="md" onClick={onCancel} className="flex-1">
            {cancelText}
          </Button>
          <Button
            variant={destructive ? 'danger' : 'primary'}
            size="md"
            onClick={onConfirm}
            className="flex-1"
          >
            {confirmText}
          </Button>
        </>
      }
    >
      <p className="text-sm text-np-text-dim leading-relaxed">{message}</p>
    </Modal>
  )
}
