import React, { useState, useEffect  } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import { uploadImage, updateProductImages } from "../services/api";
import "../styles/PictureSlider.css";

const PictureSlider = ({ productId, images = [], onClose }) => {
  const [imageList, setImageList] = useState(images); // Danh sách ảnh
  const [loading, setLoading] = useState(false); // Trạng thái loading
  const [activeIndex, setActiveIndex] = useState(0); // Index ảnh hiện tại


  // **Tải danh sách ảnh mới từ backend để đồng bộ sau khi cập nhật**
  const fetchUpdatedImages = async () => {
    try {
      console.log("Product ID:", productId); // Log ID sản phẩm
  
      const response = await fetch(`/api/products/${productId}`); // Gọi API qua proxy
  
      // Kiểm tra nếu phản hồi không hợp lệ
      if (!response.ok) {
        throw new Error(`API Error (${response.status}): ${await response.text()}`);
      }
  
      const data = await response.json(); // Chuyển đổi dữ liệu JSON
      console.log("Fetched data:", data); // Log dữ liệu JSON
      setImageList(data.img || []); // Cập nhật danh sách ảnh
    } catch (error) {
      console.error("Failed to fetch updated images:", error.message); // Log lỗi
    }
  };
  
  useEffect(() => {
    fetchUpdatedImages();
  }, [productId]);

  // **Upload hoặc thay thế ảnh mới**
  const handleUpload = async (event) => {
    const files = event.target.files; // Lấy tất cả các file đã chọn
    const formDataList = []; // Danh sách FormData cho từng ảnh
  
    setLoading(true); // Bật trạng thái loading
    try {
      // Duyệt qua tất cả các file đã chọn
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append("image", files[i]);
        formDataList.push(formData); // Đưa vào danh sách
      }
  
      const uploadedUrls = [];
  
      // Upload từng ảnh và lưu URL
      for (let i = 0; i < formDataList.length; i++) {
        const response = await uploadImage(formDataList[i]);
        const uploadedImageUrl = response.data.imageUrl;
  
        console.log(`Uploaded image ${i + 1}:`, uploadedImageUrl); // Log URL ảnh
        uploadedUrls.push(uploadedImageUrl); // Lưu URL vào danh sách
      }
  
      // Cập nhật danh sách ảnh hiện tại với ảnh mới
      const updatedImages = [...imageList, ...uploadedUrls];
      console.log("Sending updated images:", updatedImages); // Log dữ liệu gửi lên server
  
      // Gửi danh sách ảnh mới lên backend
      const res = await fetch(`/api/products/${productId}/update-images`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ images: updatedImages }),
      });
  
      if (!res.ok) {
        throw new Error(`API Error (${res.status}): ${await res.text()}`);
      }
  
      const data = await res.json();
      //console.log("Updated product:", data); // Log dữ liệu từ backend
  
      // Cập nhật giao diện với ảnh mới
      setImageList(data.img || []);
    } catch (error) {
      console.error("Failed to upload images:", error.message);
    } finally {
      setLoading(false); // Tắt trạng thái loading
    }
  };
  
  
  const handleEditImage = async (event, index) => {
    const file = event.target.files[0]; // Lấy file mới từ input
    if (!file) return;
  
    const formData = new FormData();
    formData.append("image", file); // Chuẩn bị file để upload
  
    setLoading(true); // Bật trạng thái loading
    try {
      // Upload ảnh mới lên Cloudinary
      const response = await uploadImage(formData);
      const newImageUrl = response.data.imageUrl; // URL ảnh mới
  
      console.log(`Uploaded new image: ${newImageUrl}`); // Log ảnh mới
  
      // Thay thế ảnh tại vị trí được chỉ định
      const updatedImages = [...imageList];
      updatedImages[index] = newImageUrl; // Thay thế ảnh cũ bằng ảnh mới
  
      console.log("Updated images for editing:", updatedImages); // Log danh sách ảnh mới
  
      // Gửi danh sách ảnh cập nhật lên backend
      const res = await fetch(`/api/products/${productId}/update-images`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ images: updatedImages }),
      });
  
      if (!res.ok) {
        throw new Error(`API Error (${res.status}): ${await res.text()}`);
      }
  
      const data = await res.json(); // Nhận dữ liệu mới từ backend
      console.log("Product after editing image:", data);
  
      // Cập nhật giao diện
      setImageList(data.img || []);
    } catch (error) {
      console.error("Failed to edit image:", error.message);
    } finally {
      setLoading(false); // Tắt trạng thái loading
    }
  };
  

  // **Xóa ảnh khỏi danh sách**
  const handleDeleteImage = async (index) => {
    // Tạo danh sách ảnh mới bằng cách loại bỏ ảnh tại vị trí index
    const updatedImages = imageList.filter((_, i) => i !== index);
  
    try {
      console.log("Sending updated images:", updatedImages);
  
      // Gửi danh sách ảnh mới lên backend
      const response = await fetch(`/api/products/${productId}/update-images`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ images: updatedImages }), // Gửi ảnh đã xóa lên server
      });
  
      if (!response.ok) {
        throw new Error(`API Error (${response.status}): ${await response.text()}`);
      }
  
      const data = await response.json(); // Nhận dữ liệu cập nhật từ backend
      console.log("Updated product:", data);
  
      // Cập nhật UI với danh sách ảnh mới
      setImageList(data.img || []); // Cập nhật state UI
    } catch (error) {
      console.error("Failed to delete image:", error.message);
    }
  };
  
  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full relative slider-container">
        {/* Nút đóng slider */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-red-500 text-xl font-bold close-btn"
        >
          ✕
        </button>

        {/* Slider ảnh */}
        <Swiper
            onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)} // Cập nhật index ảnh hiện tại
            navigation={true}
            pagination={{ clickable: true }}
            modules={[Navigation, Pagination]}
            className="mySwiper mb-4 relative"
          >
            {imageList.map((img, index) => (
              <SwiperSlide key={index} className="flex justify-center items-center h-[400px]">
              <img
                src={img}
                alt={`Slide ${index + 1}`}
                className="object-contain max-w-full max-h-[400px] rounded-lg"
              />
            </SwiperSlide>
            
              ))}
            </Swiper>
          
          {/* Nút cố định bên dưới slider */}
            <div className="flex justify-center gap-4 mt-4">
              {/* Nút Chỉnh sửa */}
              <label
                htmlFor="edit-image"
                className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600"
              >
                Chỉnh sửa
              </label>
              <input
                id="edit-image"
                type="file"
                className="hidden"
                onChange={(e) => handleEditImage(e, activeIndex)} // Chỉnh sửa ảnh ở index hiện tại
              />

              {/* Nút Xóa */}
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={() => handleDeleteImage(activeIndex)} // Xóa ảnh ở index hiện tại
              >
                Xóa
              </button>
            </div>


        {/* Input thêm ảnh mới */}
        <input
          type="file"
          multiple // Cho phép chọn nhiều ảnh
          onChange={handleUpload}
          className="mt-4"
        />

        {loading && <p>Uploading...</p>}
      </div>
    </div>
  );
};

export default PictureSlider;
