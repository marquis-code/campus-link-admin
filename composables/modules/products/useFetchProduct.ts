import { products_api } from "@/api_factory/modules/products";
import { useLoader } from "@/composables/core/useLoader";

export const useFetchProduct = () => {
  const loading = ref(false);
  const { startLoading, stopLoading } = useLoader();

  const fetchProduct = async (id: string) => {
    loading.value = true;
    startLoading("Loading product...");
    try {
      const res: any = await products_api.getProduct(id);
      if (res.type !== "ERROR") {
        return res.data;
      }
    } finally {
      loading.value = false;
      stopLoading();
    }
  };

  return { loading, fetchProduct };
};
