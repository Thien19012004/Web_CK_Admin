import { GridApiContext } from "@mui/x-data-grid";
import axios from "axios";
import { getBaseUrl } from "../utils/getBaseUrl";

// Tạo instance axios
const api = axios.create({
  baseURL: `${getBaseUrl()}/api`, // Đổi lại nếu backend chạy ở port khác
});

// Các API
export const fetchProducts = () => api.get("/products");

// API thêm sản phẩm
export const addProduct = async (productData) => {
  try {
    const response = await api.post("/products", productData, {
      headers: { "Content-Type": "application/json" },
    });
    return response;
  } catch (error) {
    console.error("Failed to add product:", error);
    throw error;
  }
};




export const updateProduct = (id, product) => api.put(`/products/${id}`, product);
export const deleteProduct = (id) => api.delete(`/products/${id}`);

// Tải ảnh lên
export const uploadImage = (formData) =>
  api.post("/products/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// API mới dành riêng cho việc upload ảnh sản phẩm
export const uploadProductImage = async (formData) => {
  try {
    const response = await api.post("/products/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to upload product image:", error);
    throw error;
  }
};



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
  return await api.get(`/products/filter?${query}`); // Gọi API
};

export const fetchSortedProducts = async (sort) => {
  const query = new URLSearchParams(sort).toString(); // Chuyển object sort thành query string
  return await api.get(`/products/sort?${query}`); // Gọi API backend
};

// Gọi API phân trang sản phẩm
export const fetchPagedProducts = async (query) => {
  return await api.get(`/products/paging?${query}`);
};

export const fetchUsers = async (query) => {
  return await api.get(`/users?${query}`);
};
export const deleteUser = (id) => api.delete(`/users/${id}`);
// export const updateUserStatus = (id, status) =>
//   api.put(`/users/${id}/status`, status);

export const updateUserStatus = async (id, status) => {
  return await api.put(`/users/${id}/status`, {status} ); // Sử dụng đúng URL và body JSON
};

export const fetchUserInfo = async (token) => {
  if (token) {
    try {
      // Sử dụng `api` thay vì axios.get trực tiếp
      const res = await api.get("/profile", {
        headers: {
          Authorization: `Bearer ${token}`, // Đính kèm token vào header
        },
      });
      return res;
    } catch (error) {
      console.error("Error fetching user info:", error);
      throw error;
    }
  } else {
    throw new Error("No token provided");
  }
};

export const loginUser = async (email, password) => {
  return await api.post("/auth/login", {
    email,
    password,
  });
};


export default api;
