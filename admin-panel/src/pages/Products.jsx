import React, { useEffect, useState } from "react";
import {
  fetchProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../services/api";

import UpdateProductDrawer from "../components/UpdateProductDrawer";
import PictureSlider from "../components/PictureSlider"; // Import PictureSlider
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  Button,
  Modal,
} from "flowbite-react";

const Products = () => {
  const [products, setProducts] = useState([]); // Danh sách sản phẩm
  const [selectedProduct, setSelectedProduct] = useState(null); // Sản phẩm đang chỉnh sửa
  const [showDrawer, setShowDrawer] = useState(false); // Trạng thái hiển thị Drawer
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Hiển thị Modal xác nhận xóa
  const [productToDelete, setProductToDelete] = useState(null); // Sản phẩm cần xóa

  // **State cho Picture Slider**
  const [showSlider, setShowSlider] = useState(false);
  const [sliderImages, setSliderImages] = useState([]);
  const [sliderProductId, setSliderProductId] = useState(""); // ID của sản phẩm cần chỉnh sửa ảnh

  // **Load danh sách sản phẩm**
  const loadProducts = async () => {
    try {
      const { data } = await fetchProducts();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // **Mở Drawer chỉnh sửa sản phẩm**
  const handleOpenDrawer = (product) => {
    setSelectedProduct(product);
    setShowDrawer(true);
  };

  // **Đóng Drawer**
  const handleCloseDrawer = () => {
    setSelectedProduct(null);
    setShowDrawer(false);
  };

  // **Cập nhật sản phẩm**
  const handleUpdateProduct = async (id, updatedData) => {
    const formattedData = {
      ...updatedData,
      createdAt: new Date(updatedData.createdAt),
      updatedAt: new Date(),
    };

    console.log("Sending Data:", formattedData);

    try {
      await updateProduct(id, formattedData);
      loadProducts();
      handleCloseDrawer();
    } catch (error) {
      console.error(
        "Failed to update product:",
        error.response?.data || error.message
      );
    }
  };

  // **Mở Modal xác nhận xóa**
  const handleOpenDeleteModal = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  // **Đóng Modal xác nhận xóa**
  const handleCloseDeleteModal = () => {
    setProductToDelete(null);
    setShowDeleteModal(false);
  };

  // **Xác nhận xóa sản phẩm**
  const handleDeleteConfirmed = async () => {
    try {
      if (productToDelete) {
        await deleteProduct(productToDelete._id);
        loadProducts();
        handleCloseDeleteModal();
      }
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  // **Mở Slider**
  const handleOpenSlider = (selectedProduct) => {
    setSliderImages(selectedProduct.img); // Truyền danh sách ảnh
    setSliderProductId(selectedProduct._id); // Truyền đúng ID sản phẩm
    setShowSlider(true); // Hiển thị slider
  };

  // **Đóng Slider**
  const handleCloseSlider = () => {
    setSliderImages([]); // Xóa ảnh khỏi state khi đóng
    setShowSlider(false);
  };

  return (
    <div className="overflow-x-auto p-6">
      <h1 className="text-3xl font-bold mb-6">All Products</h1>
      <Table hoverable>
        <TableHead>
          <TableHeadCell className="font-bold">Name</TableHeadCell>
          <TableHeadCell className="font-bold">Category</TableHeadCell>
          <TableHeadCell className="font-bold">Gender</TableHeadCell>
          <TableHeadCell className="font-bold">Price</TableHeadCell>
          <TableHeadCell className="font-bold">Sizes</TableHeadCell>
          <TableHeadCell className="font-bold">Description</TableHeadCell>
          <TableHeadCell className="font-bold">Status</TableHeadCell>
          <TableHeadCell>
            <span className="sr-only">Actions</span>
          </TableHeadCell>
        </TableHead>
        <TableBody className="divide-y">
          {products.map((product) => (
            <TableRow
              key={product._id}
              className="bg-white dark:border-gray-700 dark:bg-gray-800"
            >
              <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {product.name}
              </TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>{product.gender}</TableCell>
              <TableCell>${product.price}</TableCell>
              <TableCell>{product.sizes.join(", ")}</TableCell>
              <TableCell>{product.desc}</TableCell>
              <TableCell>{product.status}</TableCell>
              <TableCell className="flex space-x-2">
                {/* Nút Update */}
                <button
                  className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                  onClick={() => handleOpenDrawer(product)}
                >
                  Update
                </button>
                {/* Nút Delete */}
                <button
                  className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
                  onClick={() => handleOpenDeleteModal(product)}
                >
                  Delete
                </button>
                {/* Nút Image */}
                <button
                  className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
                  onClick={() => handleOpenSlider(product)}
                >
                  Image
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Hiển thị Drawer cập nhật sản phẩm */}
      {showDrawer && selectedProduct && (
        <UpdateProductDrawer
          product={selectedProduct}
          onClose={handleCloseDrawer}
          onSave={(updatedData) =>
            handleUpdateProduct(selectedProduct._id, updatedData)
          }
        />
      )}

      {/* Modal xác nhận xóa */}
      <Modal show={showDeleteModal} onClose={handleCloseDeleteModal}>
        <Modal.Header>Confirm Deletion</Modal.Header>
        <Modal.Body>
          <p>
            Are you sure you want to delete the product{" "}
            <strong>{productToDelete?.name}</strong>?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button color="red" onClick={handleDeleteConfirmed}>
            Confirm
          </Button>
          <Button color="gray" onClick={handleCloseDeleteModal}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Picture Slider */}
      {showSlider && (
        <PictureSlider
        productId={sliderProductId} // Đảm bảo ID sản phẩm đúng
        images={sliderImages}
        onClose={handleCloseSlider}
      />
      )}
    </div>
  );
};

export default Products;
