import React from "react";

const ProductTable = ({ products, onDelete, onEdit }) => {
  return (
    <div className="overflow-x-auto shadow-md rounded-lg">
      <table className="min-w-full table-auto border-collapse border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-4 border text-left">Name</th>
            <th className="p-4 border text-left">Description</th>
            <th className="p-4 border text-left">Category</th>
            <th className="p-4 border text-left">Price</th>
            <th className="p-4 border text-left">Gender</th>
            <th className="p-4 border text-left">Sizes</th>
            <th className="p-4 border text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.map((product) => (
            <tr key={product._id} className="hover:bg-gray-50">
              {/* Name */}
              <td className="p-4 border text-left font-semibold">
                {product.name}
              </td>
              {/* Description */}
              <td className="p-4 border text-left text-gray-600">
                {product.desc}
              </td>
              {/* Category */}
              <td className="p-4 border text-left">{product.category}</td>
              {/* Price */}
              <td className="p-4 border text-left">${product.price}</td>
              {/* Gender */}
              <td className="p-4 border text-left">{product.gender}</td>
              {/* Sizes */}
              <td className="p-4 border text-left">
                {product.sizes.join(", ")}
              </td>
              {/* Actions */}
              <td className="p-4 border text-center space-x-2">
                <button
                  onClick={() => onEdit(product)}
                  className="px-3 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(product._id)}
                  className="px-3 py-2 text-white bg-red-500 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
