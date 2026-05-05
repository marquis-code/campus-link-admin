import { products_api } from "@/api_factory/modules/products";

export const useFetchCampuses = () => {
  const campuses = ref([]);

  const fetchCampuses = async () => {
    const res: any = await products_api.getCampuses();
    if (res.type !== "ERROR") {
      campuses.value = res.data;
    }
  };

  return { campuses, fetchCampuses };
};
