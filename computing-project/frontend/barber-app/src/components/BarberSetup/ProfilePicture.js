import React, { useState } from "react";
import Button from "../Button";
import Logo from "../Logo";
import { barberAccountSetup, uploadProfilePicture } from "../../utils/account";

const ProfilePicture = ({ nextStep }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleContinue = async () => {
    if (!selectedFile) {
      alert("Please select a file to continue.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/profile-picture`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: formData,
        }
      );

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(
          responseData.message || "Failed to upload profile picture"
        );
      }

      alert("Profile picture updated successfully");
      nextStep();
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      alert(error.message);
    }
  };

  const skip = async () => {
    nextStep()
  }

  return (
    <div className="text-white space-y-4 p-4 sm:p-6 lg:p-8">
      <Logo />

      <h2 className="text-xl font-bold mb-3">Set your profile picture</h2>

      <div className="flex flex-col items-center justify-center">
        <label
          htmlFor="file-input"
          className="w-24 h-24 bg-barber-blue rounded-full cursor-pointer overflow-hidden"
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <i className="fas fa-plus text-white text-4xl"></i>
          )}
        </label>
        <p className="mt-2">Select a profile picture</p>
        <input
          id="file-input"
          type="file"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      <div className="space-x-2 text-center">
        <Button
          onClick={handleContinue}
          text={`Continue`}
          modifyClass={`bg-barber-blue hover:bg-blue-700 transition text-white font-bold py-4 px-12 rounded-full mt-4`}
        />
        <p onClick={skip} className="mt-5">Skip</p>
      </div>
    </div>
  );
};

export default ProfilePicture;
