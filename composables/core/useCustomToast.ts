export const useCustomToast = () => {
  const showToast = ({ title, message, toastType, duration = 3000 }: any) => {
    // For now, using a simple alert. In a real app, this would be a custom UI component.
    console.log(`[${toastType.toUpperCase()}] ${title}: ${message}`);
    // alert(`${title}: ${message}`);
  };

  return { showToast };
};
