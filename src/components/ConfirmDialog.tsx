"use client";

import { useEffect, useRef } from "react";

type Props = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  busy?: boolean;
  error?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

// Uses the native <dialog> element: it handles focus, the backdrop and the Escape key for us.
export default function ConfirmDialog({ open, title, message, confirmLabel = "Delete", busy, error, onConfirm, onCancel }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onCancel={(e) => {
        e.preventDefault();
        if (!busy) onCancel();
      }}
      className="m-auto w-[min(90vw,24rem)] rounded-2xl border border-edge bg-(--glass-pop) p-0 text-fg shadow-2xl backdrop-blur-2xl backdrop:bg-black/40 backdrop:backdrop-blur-sm"
    >
      <div className="space-y-4 p-6">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-fg-2">{message}</p>
        {error && <p role="alert" className="text-sm text-danger">{error}</p>}
        <div className="flex justify-end gap-2">
          <button className="btn" onClick={onCancel} disabled={busy}>Cancel</button>
          <button className="btn-danger" onClick={onConfirm} disabled={busy}>
            {busy ? "Deleting…" : confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
}
