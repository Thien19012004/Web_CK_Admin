import React, { useState, useEffect } from "react";

const ProductForm = ({ onSubmit, initialData, onClose }) => {
  const [product, setProduct] = useState(
    initialData || {
      name: "",
      img: [],
      price: "",
      desc: "",
      gender: "MEN",
      category: "",
      sizes: [],
    }
  );

  useEffect(() => {
    if (initialData) {
      setProduct(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: name === "sizes" ? value.split(",") : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(product);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 bg-white rounded-lg shadow-md w-full"
    >
      <h2 className="text-2xl font-semibold mb-4">
        {initialData ? "Edit Product" : "Add Product"}
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 border text-left w-40">Name</th>
              <th className="p-4 border text-left w-60">Image URLs</th>
              <th className="p-4 border text-left w-20">Price</th>
              <th className="p-4 border text-left w-80">Description</th>
              <th className="p-4 border text-left w-20">Gender</th>
              <th className="p-4 border text-left w-40">Category</th>
              <th className="p-4 border text-left w-40">Sizes</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              {/* Name */}
              <td className="p-4 border">
                <input
                  type="text"
                  name="name"
                  value={product.name}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                />
              </td>
              {/* Image URLs */}
              <td className="p-4 border">
                <input
                  type="text"
                  name="img"
                  value={product.img.join(",")}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                />
              </td>
              {/* Price */}
              <td className="p-4 border">
                <input
                  type="number"
                  name="price"
                  value={product.price}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                />
              </td>
              {/* Description */}
              <td className="p-4 border">
                <textarea
                  name="desc"
                  value={product.desc}
                  onChange={handleChange}
                  rows="2"
                  className="border p-2 rounded w-full resize-none"
                ></textarea>
              </td>
              {/* Gender */}
              <td className="p-4 border">
                <select
                  name="gender"
                  value={product.gender}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                >
                  <option value="MEN">MEN</option>
                  <option value="WOMEN">WOMEN</option>
                  <option value="KIDS">KIDS</option>
                </select>
              </td>
              {/* Category */}
              <td className="p-4 border">
                <input
                  type="text"
                  name="category"
                  value={product.category}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                />
              </td>
              {/* Sizes */}
              <td className="p-4 border">
                <input
                  type="text"
                  name="sizes"
                  value={product.sizes.join(",")}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="flex justify-end space-x-4 mt-4">
        <button
          type="submit"
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-gray-500 border rounded hover:bg-gray-100"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
