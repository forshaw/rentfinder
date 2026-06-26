import { type ReactElement } from "react";

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
}

export default function ConfirmDialog(
  props: ConfirmDialogProps
): ReactElement | null {
  const {
    open,
    title,
    message,
    onConfirm,
    onCancel,
    confirmText = "Confirm",
  } = props;

  if (!open) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          padding: 24,
          width: 400,
          borderRadius: 6,
        }}
      >
        <h3>{title}</h3>
        <p>{message}</p>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 8,
            marginTop: 16,
          }}
        >
          <button type="button" onClick={onCancel}>
            Cancel
          </button>

          <button type="button" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
