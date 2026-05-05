import { products_api } from "@/api_factory/modules/products";

export const useFetchCategories = () => {
  const categories = ref([]);

  const fetchCategories = async () => {
    const res: any = await products_api.getCategories();
    if (res.type !== "ERROR") {
      categories.value = res.data;
    }
  };

  return { categories, fetchCategories };
};
