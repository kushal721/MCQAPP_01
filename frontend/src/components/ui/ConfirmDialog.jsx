import React from "react";
import Modal from "./Modal";
import Spinner from "./Spinner";

const ConfirmDialog = ({
  open,
  title,
  message,
  confirmLabel = "Delete",
  busy,
  onConfirm,
  onClose,
}) => (
  <Modal
    open={open}
    onClose={busy ? () => {} : onClose}
    title={title}
    size="sm"
    footer={
      <>
        <button className="btn-secondary" onClick={onClose} disabled={busy}>
          Cancel
        </button>
        <button className="btn-danger" onClick={onConfirm} disabled={busy}>
          {busy && <Spinner className="h-4 w-4" />}
          {confirmLabel}
        </button>
      </>
    }
  >
    <p className="text-sm leading-relaxed text-ink-700">{message}</p>
  </Modal>
);

export default ConfirmDialog;
