import { IMAGE_UPLOAD_ENDPOINT } from "../axios.config";

export const upload_api = {
  uploadFile: (formData: FormData) => {
    return IMAGE_UPLOAD_ENDPOINT.post("/single", formData);
  },
};
