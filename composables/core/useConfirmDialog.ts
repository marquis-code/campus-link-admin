interface ConfirmState {
  visible: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  variant: "danger" | "warning" | "info";
  resolve: ((value: boolean) => void) | null;
}

const state = reactive<ConfirmState>({
  visible: false,
  title: "",
  message: "",
  confirmText: "Confirm",
  cancelText: "Cancel",
  variant: "danger",
  resolve: null,
});

export const useConfirmDialog = () => {
  const confirm = (options: {
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "danger" | "warning" | "info";
  }): Promise<boolean> => {
    return new Promise((resolve) => {
      state.visible = true;
      state.title = options.title || "Are you sure?";
      state.message = options.message;
      state.confirmText = options.confirmText || "Confirm";
      state.cancelText = options.cancelText || "Cancel";
      state.variant = options.variant || "danger";
      state.resolve = resolve;
    });
  };

  const handleConfirm = () => {
    state.resolve?.(true);
    state.visible = false;
    state.resolve = null;
  };

  const handleCancel = () => {
    state.resolve?.(false);
    state.visible = false;
    state.resolve = null;
  };

  return { state, confirm, handleConfirm, handleCancel };
};
