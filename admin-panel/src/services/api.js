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

export default api;
