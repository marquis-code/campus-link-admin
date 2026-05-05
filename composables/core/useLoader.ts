export const useLoader = () => {
  const loadingState = useState('loadingState', () => ({
    isLoading: false,
    message: ''
  }));

  const startLoading = (message = 'Loading...') => {
    loadingState.value = { isLoading: true, message };
  };

  const stopLoading = () => {
    loadingState.value = { isLoading: false, message: '' };
  };

  return {
    loadingState,
    startLoading,
    stopLoading
  };
};
