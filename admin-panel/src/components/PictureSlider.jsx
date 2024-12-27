import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation"; // CSS cho nút điều hướng
import "swiper/css/pagination"; // CSS cho dấu chấm tròn
import { Navigation, Pagination } from "swiper/modules"; // Import cả Pagination
import { uploadImage, updateProductImages } from "../services/api";
import "./PictureSlider.css"; // CSS tùy chỉnh

const PictureSlider = ({ productId, images = [], onClose }) => {
  const [imageList, setImageList] = useState(images); // Quản lý danh sách ảnh
  const [loading, setLoading] = useState(false); // Trạng thái loading

  // Upload ảnh mới
  const handleUpload = async (event) => {
    const files = event.target.files;
    const formData = new FormData();
    formData.append("image", files[0]);

    setLoading(true);
    try {
      // Bước 1: Upload ảnh lên Cloudinary
      const response = await uploadImage(formData);
      const uploadedImageUrl = response.data.imageUrl;

      console.log("Uploaded image URL:", uploadedImageUrl);

      // Bước 2: Cập nhật ảnh mới vào backend
      await updateProductImages(productId, [uploadedImageUrl]);

      // Bước 3: Cập nhật state UI
      setImageList((prevImages) => [...prevImages, uploadedImageUrl]);
    } catch (error) {
      console.error("Failed to upload image:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full relative ">
        {/* Nút đóng slider */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-red-500 text-xl font-bold close-btn"
        >
          ✕
        </button>

        {/* Slider ảnh */}
        <Swiper
          navigation={true} // Bật nút điều hướng
          pagination={{ clickable: true }} // Bật dấu chấm tròn
          modules={[Navigation, Pagination]} // Thêm Pagination vào modules
          className="mySwiper mb-4"
        >
          {imageList.map((img, index) => (
            <SwiperSlide key={index} className="flex justify-center items-center h-96">
            <img
              src={img}
              alt={`Slide ${index + 1}`}
              className="object-contain max-w-full max-h-80 rounded-lg"
            />
          </SwiperSlide>
          ))}
        </Swiper>

        {/* Input upload ảnh mới */}
        <input type="file" onChange={handleUpload} className="mt-4" />
        {loading && <p>Uploading...</p>}
      </div>
    </div>
  );
};

export default PictureSlider;
