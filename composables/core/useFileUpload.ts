import { upload_api } from "@/api_factory/modules/upload";
import { useLoader } from "@/composables/core/useLoader";

export const useFileUpload = () => {
  const loading = ref(false);
  const { startLoading, stopLoading } = useLoader();

  const uploadFile = async (file: File) => {
    loading.value = true;
    startLoading("Uploading file...");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res: any = await upload_api.uploadFile(formData);
      if (res.type !== "ERROR") {
        return res.data;
      }
      return null;
    } finally {
      loading.value = false;
      stopLoading();
    }
  };

  return { loading, uploadFile };
};
