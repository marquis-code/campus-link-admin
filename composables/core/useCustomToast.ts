interface Toast {
  id: number;
  title: string;
  message: string;
  toastType: "success" | "error" | "warning" | "info";
  duration: number;
}

const toasts = ref<Toast[]>([]);
let toastId = 0;

export const useCustomToast = () => {
  const showToast = ({
    title,
    message,
    toastType = "info",
    duration = 3500,
  }: {
    title: string;
    message: string;
    toastType?: "success" | "error" | "warning" | "info";
    duration?: number;
  }) => {
    const id = ++toastId;
    toasts.value.push({ id, title, message, toastType, duration });

    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id: number) => {
    toasts.value = toasts.value.filter((t) => t.id !== id);
  };

  return { toasts, showToast, removeToast };
};
