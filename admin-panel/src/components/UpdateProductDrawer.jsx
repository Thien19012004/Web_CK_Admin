import React, { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline"; // Icon mới từ Heroicons
import { Button, Label, TextInput, Textarea, Select } from "flowbite-react";

const UpdateProductDrawer = ({ product, onClose, onSave }) => {
  const [formData, setFormData] = useState({ ...product });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    onSave(formData); // Gửi dữ liệu đã chỉnh sửa lên backend
    onClose(); // Đóng drawer sau khi lưu
  };

  return (
    <div>
      {/* Nền mờ */}
      <div className="backdrop-blur fixed inset-0 z-40" onClick={onClose}></div>

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-1/3 bg-white shadow-lg z-50 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Update Product</h2>

          {/* Nút đóng */}
          <button  onClick={onClose}>
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <form className="space-y-4">
          {/* Name */}
          <div>
            <Label value="Name" />
            <TextInput
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          {/* Price */}
          <div>
            <Label value="Price ($)" />
            <TextInput
              name="price"
              value={formData.price}
              onChange={handleChange}
            />
          </div>

          {/* Description */}
          <div>
            <Label value="Description" />
            <Textarea
              name="desc"
              value={formData.desc}
              onChange={handleChange}
              rows={4}
            />
          </div>

          {/* Gender */}
          <div>
            <Label value="Gender" />
            <Select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="MEN">MEN</option>
              <option value="WOMEN">WOMEN</option>
              <option value="KIDS">KIDS</option>
            </Select>
          </div>

          {/* Category */}
          <div>
            <Label value="Category" />
            <TextInput
              name="category"
              value={formData.category}
              onChange={handleChange}
            />
          </div>

          {/* Sizes */}
          <div>
            <Label value="Sizes (comma separated)" />
            <TextInput
              name="sizes"
              value={formData.sizes.join(", ")}
              onChange={handleChange}
            />
          </div>

          {/* Status */}
          <div>
            <Label value="Status" />
            <Select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="On Stock">On Stock</option>
              <option value="Out Of Stock">Out Of Stock</option>
              <option value="Suspend">Suspend</option>
            </Select>
          </div>

          {/* Nút lưu và xóa */}
          <div className="flex justify-end space-x-2">
            <Button color="blue" onClick={handleSubmit}>
              Update
            </Button>
            <Button color="red" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProductDrawer;
