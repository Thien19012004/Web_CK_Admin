import React, { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa"; // Import icon chỉnh sửa
import { FaTrash } from "react-icons/fa"; // Icon thùng rác
import { FaImages } from "react-icons/fa"; // Icon cho hình ảnh

import {
  fetchProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  fetchFilteredProducts,
  fetchSortedProducts,
  fetchPagedProducts,
} from "../services/api";

import UpdateProductDrawer from "../components/UpdateProductDrawer";
import PictureSlider from "../components/PictureSlider"; // Import PictureSlider
import AddProductModal from "../components/AddProductModal"; // Import modal thêm sản phẩm

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
  const [showAddModal, setShowAddModal] = useState(false); // Trạng thái mở modal thêm sản phẩm
  const [formErrors, setFormErrors] = useState({}); // Trạng thái lỗi


  // **State cho Picture Slider**
  const [showSlider, setShowSlider] = useState(false);
  const [sliderImages, setSliderImages] = useState([]);
  const [sliderProductId, setSliderProductId] = useState(""); // ID của sản phẩm cần chỉnh sửa ảnh

  // **State cho bộ lọc**
  const [filters, setFilters] = useState({
    size: "",
    category: "",
    gender: "",
  });

  // Trạng thái sort
  const [sort, setSort] = useState({
    sortBy: "", // Mặc định là "No Sort"
    order: "",  // Không sắp xếp
  });
   

  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [totalPages, setTotalPages] = useState(1); // Tổng số trang
  const [loading, setLoading] = useState(false); // Trạng thái loading

  // Load sản phẩm theo trang
  const loadPagedProducts = async (page = 1) => {
    setLoading(true);
    try {
      // Tạo query string
      const query = new URLSearchParams({
        page,
        limit: 4,
        ...(sort.sortBy && { sortBy: sort.sortBy }), // Chỉ thêm nếu có sortBy
        ...(sort.order && { order: sort.order }),   // Chỉ thêm nếu có order
        ...(filters.size && { size: filters.size }),
        ...(filters.category && { category: filters.category }),
        ...(filters.gender && { gender: filters.gender }),
      }).toString();
  
      // Gọi API
      const { data } = await fetchPagedProducts(query);
      setProducts(data.data);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };
  
  
  
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      loadPagedProducts(page); // Giữ nguyên trạng thái Filter và Sort
    }
  };
  

useEffect(() => {
  loadPagedProducts(1); // Tải lại từ trang 1 khi Filter hoặc Sort thay đổi
}, [filters, sort]);


  // **Thêm sản phẩm**
  const handleAddProduct = async (formData) => {
    try {
      setLoading(true); // Hiển thị loading
      const response = await addProduct(formData); // Gọi API thêm sản phẩm
      setProducts((prev) => [...prev, response.data]); // Thêm sản phẩm mới vào danh sách
      setShowAddModal(false); // Đóng modal
    } catch (error) {
      console.error("Failed to add product:", error);
    } finally {
      setLoading(false); // Tắt loading
    }
  };
  

  //**Load danh sách sản phẩm**
  const loadProducts = async () => {
    try {
      const { data } = await fetchProducts();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  // useEffect(() => {
  //   loadProducts();
  // }, []);


  // **Lọc sản phẩm**
  // const handleFilter = async () => {
  //   try {
  //     const { data } = await fetchFilteredProducts(filters); // Gọi API lọc
  //     setProducts(data);
  //   } catch (error) {
  //     console.error("Failed to filter products:", error);
  //   }
  // };

  // useEffect(() => {
  //   loadPagedProducts(1);
  // }, []);

  // Sắp xếp sản phẩm
  // const handleSort = async () => {
  //   try {
  //     const { data } = await fetchSortedProducts(sort); // Gọi API sắp xếp
  //     setProducts(data);
  //   } catch (error) {
  //     console.error("Failed to sort products:", error);
  //   }
  // };

  // useEffect(() => {
  //   loadPagedProducts(1);
  // }, []);


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

  const validateProductInput = (data) => {
    const errors = {}; // Khởi tạo object chứa lỗi
  
    // Kiểm tra tên sản phẩm
    if (!data.name || data.name.trim() === "") {
      errors.name = "Product name is required.";
    }
  
    // Kiểm tra giá sản phẩm
    if (!data.price || isNaN(data.price) || Number(data.price) <= 0) {
      errors.price = "Price must be a positive number.";
    }
  
    // Kiểm tra mô tả sản phẩm
    if (!data.desc || data.desc.trim() === "") {
      errors.desc = "Description is required.";
    }
  
    // Kiểm tra giới tính
    const validGenders = ["MEN", "WOMEN"];
    if (!data.gender || !validGenders.includes(data.gender)) {
      errors.gender = "Gender must be 'MEN' or 'WOMEN'.";
    }
  
    // Kiểm tra danh mục sản phẩm
    const validCategories = ["Running", "Casual", "Sports", "Formal"];
    if (!data.category || !validCategories.includes(data.category)) {
      errors.category = "Category is invalid.";
    }
  
    // Kiểm tra sizes
    const validSizes = ["40", "41", "42", "43", "44"];
    if (
      !data.sizes ||
      !Array.isArray(data.sizes) ||
      data.sizes.some((size) => !validSizes.includes(size))
    ) {
      errors.sizes = "Sizes must be valid options: 40, 41, 42, 43, 44.";
    }
  
    // Kiểm tra trạng thái
    const validStatuses = ["In Stock", "Out Of Stock"];
    if (!data.status || !validStatuses.includes(data.status)) {
      errors.status = "Status must be 'In Stock' or 'Out Of Stock'.";
    }
  
    return errors; // Trả về danh sách lỗi
  };
  
  // **Cập nhật sản phẩm**
  const handleUpdateProduct = async (id, updatedData) => {
    const errors = {};
  
    // **Kiểm tra dữ liệu đầu vào**
    if (!updatedData.name || updatedData.name.trim() === "") {
      errors.name = "Product name is required";
    }
    if (!updatedData.price || isNaN(updatedData.price) || updatedData.price <= 0) {
      errors.price = "Price must be a positive number";
    }
    if (!updatedData.desc || updatedData.desc.trim() === "") {
      errors.desc = "Description is required";
    }
    if (!updatedData.gender || !["MEN", "WOMEN"].includes(updatedData.gender)) {
      errors.gender = "Gender must be 'MEN' or 'WOMEN'";
    }
    if (!updatedData.category || updatedData.category.trim() === "") {
      errors.category = "Category is required";
    }
    if (
      !updatedData.sizes ||
      !Array.isArray(updatedData.sizes) ||
      updatedData.sizes.some((size) => !["40", "41", "42", "43", "44"].includes(size))
    ) {
      errors.sizes = "Invalid sizes selected";
    }
    if (
      !updatedData.status ||
      !["On Stock", "Out Of Stock", "Suspend"].includes(updatedData.status)
    ) {
      errors.status = "Status must be 'In Stock' or 'Out Of Stock'";
    }
  
    // **Kiểm tra có lỗi hay không**
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors); // Hiển thị lỗi trên modal
      return; // Không đóng modal
    }
  
    // Nếu không có lỗi, tiến hành cập nhật
    try {
      await updateProduct(id, updatedData); // Gọi API cập nhật
      loadPagedProducts(currentPage); // Tải lại dữ liệu
      handleCloseDrawer(); // Đóng modal chỉ khi cập nhật thành công
    } catch (error) {
      console.error("Failed to update product:", error);
      setFormErrors({ server: "Failed to update product. Please try again." });
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

      {/* Container cho nút và các bộ lọc */}
<div className="flex justify-between items-center mb-4">
  {/* Nút mở modal thêm sản phẩm */}
  <button
    className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
    onClick={() => setShowAddModal(true)} // Hiển thị modal thêm sản phẩm
  >
    + Add Product
  </button>

  {/* Bộ lọc sản phẩm */}
  <div className="flex items-center space-x-4">
    {/* Label cho Filter */}
    <label className="text-sm font-medium text-gray-700">Filter by:</label>
    <select
      value={filters.category}
      onChange={(e) =>
        setFilters({ ...filters, category: e.target.value })
      }
      className="border p-2 rounded"
    >
      <option value="">All Categories</option>
      <option value="Running">Running</option>
      <option value="Casual">Casual</option>
      <option value="Sports">Sports</option>
    </select>
  </div>

  {/* Bộ sắp xếp */}
  <div className="flex items-center space-x-4">
    {/* Label cho Sort */}
    <label className="text-sm font-medium text-gray-700">Sort by:</label>
    {/* Sort Field */}
    <select
      value={sort.sortBy}
      onChange={(e) =>
        setSort({
          ...sort,
          sortBy: e.target.value || "", // Không chọn gì thì set về ""
        })
      }
      className="border p-2 rounded"
    >
      <option value="">No Sort</option> {/* Mặc định */}
      <option value="createdAt">Creation Time</option>
      <option value="price">Price</option>
    </select>

    {/* Order Field */}
    <select
      value={sort.order}
      onChange={(e) =>
        setSort({
          ...sort,
          order: e.target.value || "", // Không chọn gì thì set về ""
        })
      }
      className="border p-2 rounded"
      disabled={!sort.sortBy} // Vô hiệu hóa nếu chưa chọn trường sắp xếp
    >
      <option value="asc">Ascending</option>
      <option value="desc">Descending</option>
    </select>
  </div>
</div>





      {/* Danh sách sản phẩm */}
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
                  className="flex items-center justify-center px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                  onClick={() => handleOpenDrawer(product)}
                >
                  <FaEdit className="mr-2" />
                  <span>Update</span>
                </button>
                {/* Nút Delete */}
                <button
                  className="flex items-center justify-center px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
                  onClick={() => handleOpenDeleteModal(product)}
                >
                    <FaTrash className="mr-2" />
                  Delete
                </button>
                {/* Nút Image */}
                <button
                  className="flex items-center justify-center px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
                  onClick={() => handleOpenSlider(product)}
                >
                  <FaImages className="mr-2" />
                  Image
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
          {/* Phân trang */}
          <div className="flex justify-center mt-6">
  <button
    onClick={() => handlePageChange(currentPage - 1)}
    disabled={currentPage === 1 || loading}
    className="px-4 py-2 mx-1 bg-gray-300 rounded disabled:opacity-50"
  >
    Prev
  </button>
  {Array.from({ length: totalPages }, (_, index) => (
    <button
      key={index}
      onClick={() => handlePageChange(index + 1)}
      className={`px-4 py-2 mx-1 ${
        currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-300"
      } rounded`}
    >
      {index + 1}
    </button>
  ))}
  <button
    onClick={() => handlePageChange(currentPage + 1)}
    disabled={currentPage === totalPages || loading}
    className="px-4 py-2 mx-1 bg-gray-300 rounded disabled:opacity-50"
  >
    Next
  </button>
</div>

{/* Modal thêm sản phẩm */}
{showAddModal && (
        <AddProductModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onProductAdded={loadPagedProducts}
          onSave={handleAddProduct}
        />
      )}

      {/* Hiển thị Drawer cập nhật sản phẩm */}
      {showDrawer && selectedProduct && (
  <UpdateProductDrawer
    product={selectedProduct}
    onClose={handleCloseDrawer}
    onSave={(updatedData) =>
      handleUpdateProduct(selectedProduct._id, updatedData)
    }
    formErrors={formErrors} // Truyền lỗi vào drawer
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
