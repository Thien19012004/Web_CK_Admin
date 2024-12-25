import React, { useState } from "react";

const EditableTable = ({ products, onSave, onDelete }) => {
  const [editProducts, setEditProducts] = useState(products); // Dữ liệu chỉnh sửa

  // Xử lý thay đổi giá trị trong ô nhập liệu
  const handleChange = (index, name, value) => {
    const updatedProducts = [...editProducts];
    updatedProducts[index][name] =
      name === "sizes" ? value.split(",") : value; // Tách sizes thành mảng
    setEditProducts(updatedProducts);
  };

  // Lưu tất cả thay đổi
  const handleSave = () => {
    editProducts.forEach(async (product) => {
      await onSave(product); // Lưu từng sản phẩm đã chỉnh sửa
    });
  };

  return (
    <div className="overflow-x-auto shadow-md rounded-lg">
      <table className="min-w-full table-auto border-collapse border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-4 border">Name</th>
            <th className="p-4 border">Image URLs</th>
            <th className="p-4 border">Price</th>
            <th className="p-4 border">Description</th>
            <th className="p-4 border">Gender</th>
            <th className="p-4 border">Category</th>
            <th className="p-4 border">Sizes</th>
            <th className="p-4 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {editProducts.map((product, index) => (
            <tr key={product._id}>
              <td className="p-4 border">
                <input
                  type="text"
                  value={product.name}
                  onChange={(e) =>
                    handleChange(index, "name", e.target.value)
                  }
                  className="border p-2 rounded w-full"
                />
              </td>
              <td className="p-4 border">
                <input
                  type="text"
                  value={product.img.join(",")}
                  onChange={(e) =>
                    handleChange(index, "img", e.target.value)
                  }
                  className="border p-2 rounded w-full"
                />
              </td>
              <td className="p-4 border">
                <input
                  type="number"
                  value={product.price}
                  onChange={(e) =>
                    handleChange(index, "price", e.target.value)
                  }
                  className="border p-2 rounded w-full"
                />
              </td>
              <td className="p-4 border">
                <input
                  type="text"
                  value={product.desc}
                  onChange={(e) =>
                    handleChange(index, "desc", e.target.value)
                  }
                  className="border p-2 rounded w-full"
                />
              </td>
              <td className="p-4 border">
                <select
                  value={product.gender}
                  onChange={(e) =>
                    handleChange(index, "gender", e.target.value)
                  }
                  className="border p-2 rounded w-full"
                >
                  <option value="MEN">MEN</option>
                  <option value="WOMEN">WOMEN</option>
                  <option value="KIDS">KIDS</option>
                </select>
              </td>
              <td className="p-4 border">
                <input
                  type="text"
                  value={product.category}
                  onChange={(e) =>
                    handleChange(index, "category", e.target.value)
                  }
                  className="border p-2 rounded w-full"
                />
              </td>
              <td className="p-4 border">
                <input
                  type="text"
                  value={product.sizes.join(",")}
                  onChange={(e) =>
                    handleChange(index, "sizes", e.target.value)
                  }
                  className="border p-2 rounded w-full"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-end space-x-4 mt-4">
        <button onClick={handleSave} className="bg-blue-500 p-2 text-white rounded">
          Save All
        </button>
      </div>
    </div>
  );
};

export default EditableTable;
