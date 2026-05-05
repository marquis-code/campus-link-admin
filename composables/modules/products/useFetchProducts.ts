import { products_api } from "@/api_factory/modules/products";
import { useLoader } from "@/composables/core/useLoader";

export const useFetchProducts = () => {
  const loading = ref(false);
  const products = ref([]);
  const { startLoading, stopLoading } = useLoader();

  const fetchProducts = async (params: any = {}) => {
    loading.value = true;
    startLoading("Fetching products...");
    try {
      const res: any = await products_api.getProducts(params);
      if (res.type !== "ERROR") {
        products.value = res.data.products;
        return res.data;
      }
    } finally {
      loading.value = false;
      stopLoading();
    }
  };

  return { loading, products, fetchProducts };
};
