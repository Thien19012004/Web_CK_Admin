import React, { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline"; // Icon mới từ Heroicons
import { Button, Label, TextInput, Textarea, Select } from "flowbite-react";

const UpdateProductDrawer = ({ product, onClose, onSave }) => {
  const [formData, setFormData] = useState({ ...product });
  const [formErrors, setFormErrors] = useState({}); // Khai báo state lưu lỗi

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    const errors = {}; // Kiểm tra dữ liệu đầu vào
  
    if (!formData.name || formData.name.trim() === "") {
      errors.name = "Product name is required";
    }
    if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0) {
      errors.price = "Price must be a positive number";
    }
    if (!formData.desc || formData.desc.trim() === "") {
      errors.desc = "Description is required";
    }
    if (!formData.gender || !["MEN", "WOMEN", "KIDS"].includes(formData.gender)) {
      errors.gender = "Invalid gender selected";
    }
    if (!formData.category || formData.category.trim() === "") {
      errors.category = "Category is required";
    }
    // Kiểm tra size
    const sizeArray = Array.isArray(formData.sizes) // Kiểm tra nếu là mảng
  ? formData.sizes // Giữ nguyên nếu đã là mảng
  : formData.sizes
      .split(",") // Nếu là chuỗi thì tách ra mảng
      .map((size) => size.trim()) // Loại bỏ khoảng trắng
      .filter((size) => size); // Xóa phần tử rỗng

    if (
      !sizeArray.length ||
      sizeArray.some((size) => !["40", "41", "42", "43", "44"].includes(size))
    ) {
      errors.sizes = "Invalid sizes selected";
    }
  
    if (
      !formData.status ||
      !["On Stock", "Out Of Stock", "Suspend"].includes(formData.status)
    ) {
      errors.status = "Invalid status selected";
    }
  
    // Nếu có lỗi, hiển thị lỗi và không đóng modal
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors); // Truyền lỗi ra giao diện
      return;
    }
  
    // Nếu không có lỗi, lưu dữ liệu
    try {
      await onSave({ ...formData, sizes: sizeArray });
      onClose(); // Chỉ đóng modal nếu thành công
    } catch (error) {
      setFormErrors({ server: "Failed to update product. Please try again." });
    }
  };
  
  const handleCancel = () => {
    setFormData({ ...product }); // Reset về dữ liệu ban đầu
    onClose(); // Đóng modal
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

         {/* <div className="text-red-500 mb-4">
          {formErrors &&
            Object.entries(formErrors).map(([key, error]) => (
              <p key={key}>{error}</p>
            ))}
        </div>  */}

        <form className="space-y-4">
          {/* Name */}
<div>
  <Label value="Name" />
  <TextInput
    name="name"
    value={formData.name}
    onChange={handleChange}
  />
  {formErrors?.name && (
    <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
  )}
</div>

{/* Price */}
<div>
  <Label value="Price ($)" />
  <TextInput
    name="price"
    value={formData.price}
    onChange={handleChange}
  />
  {formErrors?.price && (
    <p className="text-red-500 text-sm mt-1">{formErrors.price}</p>
  )}
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
  {formErrors?.desc && (
    <p className="text-red-500 text-sm mt-1">{formErrors.desc}</p>
  )}
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
  {formErrors?.gender && (
    <p className="text-red-500 text-sm mt-1">{formErrors.gender}</p>
  )}
</div>

{/* Category */}
<div>
  <Label value="Category" />
  <Select
    name="category"
    value={formData.category}
    onChange={handleChange}
  >
    <option value="Soccer">Soccer</option>
    <option value="Basketball">Basketball</option>
    <option value="Running">Running</option>
    <option value="Lifestyle">Lifestyle</option>
  </Select>
  {formErrors?.category && (
    <p className="text-red-500 text-sm mt-1">{formErrors.category}</p>
  )}
</div>

{/* Sizes */}
<div>
  <Label value="Sizes" />
  <div className="flex flex-wrap gap-2">
    {["40", "41", "42", "43", "44"].map((size) => (
      <label key={size} className="flex items-center space-x-2">
        <input
          type="checkbox"
          value={size}
          checked={formData.sizes.includes(size)}
          onChange={() => {
            const updatedSizes = formData.sizes.includes(size)
              ? formData.sizes.filter((s) => s !== size)
              : [...formData.sizes, size];
            setFormData({ ...formData, sizes: updatedSizes });
          }}
        />
        <span>{size}</span>
      </label>
    ))}
  </div>
  {formErrors?.sizes && (
    <p className="text-red-500 text-sm mt-1">{formErrors.sizes}</p>
  )}
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
  {formErrors?.status && (
    <p className="text-red-500 text-sm mt-1">{formErrors.status}</p>
  )}
</div>

          {/* Nút lưu và xóa */}
          <div className="flex justify-end space-x-2">
            <Button color="blue" onClick={handleSubmit}>
              Update
            </Button>
            <Button 
                className="bg-red-500 text-black hover:bg-red-600 !important" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProductDrawer;
