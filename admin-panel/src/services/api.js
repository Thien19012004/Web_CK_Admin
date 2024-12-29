import axios from "axios";

// Tạo instance axios
const api = axios.create({
  baseURL: "http://localhost:5000/api", // Đổi lại nếu backend chạy ở port khác
});

// Các API
export const fetchProducts = () => api.get("/products");
export const addProduct = (product) => api.post("/products", product);
export const updateProduct = (id, product) => api.put(`/products/${id}`, product);
export const deleteProduct = (id) => api.delete(`/products/${id}`);

// Tải ảnh lên
export const uploadImage = (formData) =>
  api.post("/products/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// Cập nhật ảnh
export const updateProductImages = (id, images) => {
  console.log("Updating product images with:", images); // Log dữ liệu gửi lên
  return api.put(`/products/${id}/update-images`, {
    images: JSON.stringify(images), // Chuyển thành JSON hợp lệ
  });
};


// Lấy ảnh của sản phẩm
export const getProductImages = (id) => api.get(`/products/${id}/images`);

// Lọc sản phẩm
export const fetchFilteredProducts = async (filters) => {
  const query = new URLSearchParams(filters).toString(); // Chuyển object thành query string
  return await axios.get(`/api/products/filter?${query}`); // Gọi API
};

export const fetchSortedProducts = async (sort) => {
  const query = new URLSearchParams(sort).toString(); // Chuyển object sort thành query string
  return await axios.get(`/api/products/sort?${query}`); // Gọi API backend
};

// Gọi API phân trang sản phẩm
export const fetchPagedProducts = async (query) => {
  return await axios.get(`/api/products/paging?${query}`);
};
export default api;
