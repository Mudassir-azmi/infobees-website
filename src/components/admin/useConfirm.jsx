import { useCallback, useRef, useState } from "react";
import ConfirmDialog from "./ConfirmDialog";

/**
 * Promise-based confirm dialog.
 *
 *   const [confirm, confirmDialog] = useConfirm();
 *   if (await confirm({ title, message, confirmLabel })) { ... }
 *   return <>{confirmDialog}...</>;
 */
export function useConfirm() {
  const [options, setOptions] = useState(null);
  const resolverRef = useRef(null);

  const confirm = useCallback(
    (opts) =>
      new Promise((resolve) => {
        resolverRef.current = resolve;
        setOptions(opts);
      }),
    []
  );

  const close = useCallback((result) => {
    resolverRef.current?.(result);
    resolverRef.current = null;
    setOptions(null);
  }, []);

  const dialog = options ? <ConfirmDialog {...options} onClose={close} /> : null;
  return [confirm, dialog];
}
