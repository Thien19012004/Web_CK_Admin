import React, { useState } from "react";
import { uploadImage, addProduct } from "../services/api";

const AddProductModal = ({ onClose, onProductAdded }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [desc, setDesc] = useState("");
  const [gender, setGender] = useState("");
  const [category, setCategory] = useState("");
  const [sizes, setSizes] = useState([]);
  const [status, setStatus] = useState("In Stock"); // Thêm trường trạng thái
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  // **Danh mục và Size**
  const categoryOptions = ["Running", "Casual", "Sports", "Formal"];
  const sizeOptions = ["40", "41", "42", "43", "44"];
  const statusOptions = ["In Stock", "Out Of Stock"]; // Trạng thái sản phẩm

  // **Xử lý chọn size**
  const handleSizeChange = (size) => {
    setSizes((prevSizes) =>
      prevSizes.includes(size)
        ? prevSizes.filter((s) => s !== size)
        : [...prevSizes, size]
    );
  };

  // **Upload ảnh**
  const handleFileUpload = async (event) => {
    const files = event.target.files;
    setLoading(true);
    try {
      const uploadedImages = [];
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append("image", files[i]);
        const response = await uploadImage(formData); // Gửi ảnh lên server
        uploadedImages.push(response.data.imageUrl); // Nhận URL ảnh
      }
      setImages([...images, ...uploadedImages]); // Cập nhật danh sách ảnh
    } catch (error) {
      console.error("Failed to upload image:", error);
      alert("Failed to upload image!");
    } finally {
      setLoading(false);
    }
  };
  

  // **Lưu sản phẩm**
  const handleSave = async () => {
    if (!name || !price || !desc || !gender || !category || !sizes.length || !status) {
      alert("Please fill all fields!");
      return;
    }
  
    // Chuẩn bị dữ liệu JSON
    const productData = {
      name,
      price: Number(price),
      desc,
      gender,
      category,
      sizes: JSON.stringify(sizes), // Chuyển mảng thành JSON
      status,
      img: images, // URL ảnh đã upload trước đó
    };
  
    try {
      await addProduct(productData); // Gọi API để thêm sản phẩm
      alert("Product added successfully!");
      onProductAdded(); // Làm mới danh sách sản phẩm
      onClose(); // Đóng modal
    } catch (error) {
      console.error("Failed to add product:", error);
      alert("Failed to add product!");
    }
  };
  

  return (
    <div className="backdrop-blur fixed inset-0 z-40" >
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-y-auto">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
        {/* Nút đóng modal */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-red-500 text-xl font-bold hover:text-red-700"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-4">Add Product</h2>

        {/* Nội dung modal */}
        <div className="space-y-4 overflow-y-auto max-h-[400px] p-2">
          {/* Tên sản phẩm */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 p-2 w-full border rounded-md"
              placeholder="Enter product name"
            />
          </div>

          {/* Giá */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Price
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="mt-1 p-2 w-full border rounded-md"
              placeholder="Enter price"
            />
          </div>

          {/* Mô tả */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="mt-1 p-2 w-full border rounded-md"
              rows="3"
              placeholder="Enter description"
            />
          </div>

          {/* Giới tính */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Gender
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="mt-1 p-2 w-full border rounded-md"
            >
              <option value="">Select gender</option>
              <option value="MEN">Men</option>
              <option value="WOMEN">Women</option>
            </select>
          </div>

          {/* Danh mục */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 p-2 w-full border rounded-md"
            >
              <option value="">Select category</option>
              {categoryOptions.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Size */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Sizes
            </label>
            <div className="flex flex-wrap gap-2 mt-2">
              {sizeOptions.map((size) => (
                <label key={size} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={size}
                    checked={sizes.includes(size)}
                    onChange={() => handleSizeChange(size)}
                  />
                  <span>{size}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Trạng thái */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-1 p-2 w-full border rounded-md"
            >
              {statusOptions.map((stat) => (
                <option key={stat} value={stat}>
                  {stat}
                </option>
              ))}
            </select>
          </div>

          {/* Upload ảnh */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Images
            </label>
            <input type="file" multiple onChange={handleFileUpload} />
            {loading && <p>Uploading...</p>}
          </div>
        </div>

        {/* Nút Save và Cancel */}
        <div className="flex justify-end gap-4 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default AddProductModal;
