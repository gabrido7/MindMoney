import { useState } from "react";
import Modal from "./Modal";
import Button from "./Button";

export default function ConfirmDialog({
  title,
  message,
  confirmLabel = "Confirmar",
  error,
  onConfirm,
  onCancel,
}: {
  title: string;
  message: string;
  confirmLabel?: string;
  error?: string | null;
  onConfirm: () => Promise<void> | void;
  onCancel: () => void;
}) {
  const [confirming, setConfirming] = useState(false);

  const handleConfirm = async () => {
    setConfirming(true);
    try {
      await onConfirm();
    } finally {
      setConfirming(false);
    }
  };

  return (
    <Modal title={title} onClose={onCancel} size="sm">
      <p className="text-gray-600 dark:text-gray-300 mb-4">{message}</p>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={onCancel} disabled={confirming}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={handleConfirm} disabled={confirming}>
          {confirming ? "Excluindo..." : confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
