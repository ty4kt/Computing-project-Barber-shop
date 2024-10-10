import React, { useState } from "react";

const PortfolioUploader = ({nextStep}) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const newPreviewUrls = files.map((file) => URL.createObjectURL(file));

    setSelectedFiles(files);
    setPreviewUrls(newPreviewUrls);
  };

  const handleUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      alert("Please select images to upload.");
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("images", file); // 'images' is the field name expected by the server
    });

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/portfolio-image`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to upload images");
      }

      const result = await response.json();
      alert("Images uploaded successfully!");

      setSelectedFiles([]);
      setPreviewUrls([]);

      nextStep();
    } catch (error) {
      console.error("Error uploading images:", error);
      alert(error.message || "An error occurred while uploading images.");
    }
  };

  return (
    <div className="portfolio-uploader bg-gray-800 p-6 rounded-lg shadow-lg">
      <div className="preview-section grid grid-cols-3 gap-4 mb-6">
        {previewUrls.map((url, index) => (
          <div
            key={index}
            className="preview-container overflow-hidden rounded-md"
          >
            <img
              src={url}
              alt={`Preview ${index + 1}`}
              className="preview-image object-cover w-full h-full"
            />
          </div>
        ))}
      </div>
      <div className="file-input-container text-center mb-4">
        <label className="file-input-label inline-block cursor-pointer bg-blue-500 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-600 transition-colors">
          <span>Select Images</span>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="file-input hidden"
          />
        </label>
      </div>
      <div className="upload-button-container text-center">
        <button
          onClick={handleUpload}
          className="upload-button bg-green-500 text-white py-2 px-6 rounded-lg shadow hover:bg-green-600 transition-colors"
        >
          Upload Images
        </button>
      </div>
    </div>
  );
};

export default PortfolioUploader;
