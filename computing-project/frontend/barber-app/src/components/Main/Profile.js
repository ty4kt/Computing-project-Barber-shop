import React, { useState, useEffect } from "react";
import Logo from "../Logo";
import Bar from "./Bar";
import { fetchBarberMedia } from "../../utils/barber";

const Profile = ({ barber, onClose, onLike, onSkip, showActions = true }) => {
  const [barberMedia, setBarberMedia] = useState([]);
  const [enlargedImage, setEnlargedImage] = useState(null);

  useEffect(() => {
    const loadBarberMedia = async () => {
      const mediaItems = await fetchBarberMedia(barber._id);
      if (mediaItems) {
        // Assuming each media item has an 'imageUrl' property
        const imageUrls = mediaItems.map((item) => item.imageUrl);
        setBarberMedia(imageUrls);
      } else {
        // Fallback or default images in case of an error or no media items
        setBarberMedia(Array(3).fill("images/bob-marley.jpg"));
      }
    };

    if (barber._id) {
      loadBarberMedia();
    }
  }, [barber._id]);
  const services = barber?.profile?.services ?? barber.services ?? null;

  return (
    <div className="absolute min-h-screen flex flex-col justify-between z-[120]">
      <div className="absolute inset-0 bg-black bg-cover bg-center" />
      <div className="relative z-10 p-6">
        <img
          src={barber?.profile?.profile_picture}
          alt="Profile"
          className="w-24 h-24 mx-auto rounded-full mt-4"
        />
        <button
          className="bg-[#121212] absolute -mt-24 w-16 h-16 rounded-full"
          onClick={onClose}
        >
          <i class="fa-solid fa-x text-white  "></i>
        </button>
        <h1 className="text-4xl text-white font-bold text-center mt-4">
          {barber.full_name}
        </h1>
        <div className="flex flex-wrap mt-4 mx-auto justify-center">
          {services.map((service, index) => (
            <span
              key={index}
              className="bg-[#292929]/50 text-white py-1 px-3 rounded-lg text-sm font-semibold m-1"
            >
              {service}
            </span>
          ))}
        </div>
        <p className="text-white max-w-sm text-sm mt-4 text-center justify-center mx-auto">
          {barber.bio}
        </p>

        <p className="text-white max-w-sm text-sm mt-4 text-center justify-center mx-auto">
          {barber.location.postcode.split(" ")[0]}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 px-8 py-4 relative z-[121]">
        {(barberMedia.length > 0
          ? barberMedia
          : Array(3).fill("images/bob-marley.jpg")
        ).map((img, index) => (
          <div
            key={index}
            className="cursor-pointer"
            onClick={() => setEnlargedImage(img)}
          >
            <img
              src={img}
              alt={`Barber work ${index + 1}`}
              className="w-full h-28 object-cover rounded-lg hover:opacity-75 transition-opacity duration-300"
            />
          </div>
        ))}
      </div>

      {/* Enlarged Image View */}
      {enlargedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[190] flex justify-center items-center"
          onClick={() => setEnlargedImage(null)}
        >
          <img
            src={enlargedImage}
            alt="Enlarged view"
            className="max-w-full max-h-full p-4"
            onClick={(e) => e.stopPropagation()} // Prevent click from bubbling to the backdrop
          />
        </div>
      )}

      <div className="relative z-10 p-6 ">
        {showActions && (
          <div className="flex items-center justify-center space-x-4 mt-6">
            <button
              className="bg-[#2C2C2C] hover:bg-[#131313] transition w-64 py-4 rounded-2xl text-white"
              onClick={() => onSkip(barber)}
            >
              <i class="fa-solid fa-x"></i>
            </button>
            <button
              className="bg-[#497CFF] hover:bg-[#499eff] transition w-64 py-4 rounded-2xl text-white"
              onClick={() => onLike(barber)}
            >
              <i class="fa-solid fa-thumbs-up"></i>
            </button>
          </div>
        )}
        ;
      </div>
    </div>
  );
};

export default Profile;
