import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import BarberSearch from "../components/Main/BarberSearch";
import BarberCard from "../components/Main/BarberCard";
import BottomBar from "../components/BottomBar";
import Profile from "../components/Main/Profile";
import { useUser } from "../contexts/UserContext";
import { likeBarber, fetchBarbersNearby, fetchBarberMedia } from "../utils/barber";

const Main = () => {
  const [barbers, setBarbers] = useState([]);
  const [currentBarberIndex, setCurrentBarberIndex] = useState(0);
  const [isProfileVisible, setIsProfileVisible] = useState(false);
  const [showMatch, setShowMatch] = useState(false);
  const [maxDistanceInMeters, setMaxDistanceInMeters] = useState(10000000);
  const [backgroundImage, setBackgroundImage] = useState(
    "/images/default-bg.png"
  );

  const { user } = useUser();

  const fetchMoreBarbers = async () => {
    try {
      const [longitude, latitude] = user.location.location.coordinates;
      const newBarbers = await fetchBarbersNearby(
        longitude,
        latitude,
        maxDistanceInMeters
      );
      if (newBarbers && newBarbers.length > 0) {
        setBarbers(newBarbers);
        setCurrentBarberIndex(0);
      } else {
        // Handle the case when no more barbers are available
        console.log("No more barbers to fetch");
      }
    } catch (error) {
      console.error("Error fetching more barbers:", error);
    }
  };

  const handleLikeBarber = () => {
    console.log("Liked barber:", barbers[currentBarberIndex]._id);
    likeBarber(barbers[currentBarberIndex]._id);
    setShowMatch(true);
    setTimeout(() => {
      setShowMatch(false);
      goToNextBarber();
    }, 3000);
    handleCloseProfile();
  };

  const handleSkipBarber = () => {
    console.log("Skipped barber:", barbers[currentBarberIndex]._id);
    goToNextBarber(); // Immediately move to the next barber
  };

  const handleShowProfile = () => {
    setIsProfileVisible(true);
  };

  const handleCloseProfile = () => {
    setIsProfileVisible(false);
  };

  const goToNextBarber = () => {
    setCurrentBarberIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;
      if (nextIndex >= barbers.length) {
        fetchMoreBarbers();
      }
      return nextIndex % barbers.length;
    });
  };

  useEffect(() => {
    if (barbers.length > 0 && currentBarberIndex < barbers.length) {
      const currentBarber = barbers[currentBarberIndex];
      fetchBarberMedia(currentBarber._id).then((mediaItems) => {
        if (mediaItems && mediaItems.length > 0) {
          const randomIndex = Math.floor(Math.random() * mediaItems.length);
          const randomMedia = mediaItems[randomIndex];
          setBackgroundImage(randomMedia.imageUrl);
        }
      });
    }
  }, [barbers, currentBarberIndex]);

  return (
    <Layout backgroundImage={backgroundImage} centerContent={true}>
      <BarberSearch setBarbers={setBarbers} />

      {showMatch && (
        <div className="fixed inset-0 flex items-center justify-center z-[200] max-w-xl mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-90 animate-pulse"></div>
          <div className="flex flex-col items-center">
            <i className="fa-solid fa-comments text-white text-6xl animate-bounce"></i>
            <p className="mt-4 text-white text-xl animate-pulse">
              Start a conversation!
            </p>
            <p className="mt-2 text-white text-md animate-pulse">
              You are now able to message this person!
            </p>
          </div>
        </div>
      )}

      {isProfileVisible && (
        <Profile
          barber={barbers[currentBarberIndex]}
          onLike={handleLikeBarber}
          onSkip={handleSkipBarber}
          onClose={handleCloseProfile}
        />
      )}
      {barbers.length > 0 ? (
        <BarberCard
          barber={barbers[currentBarberIndex]}
          onLike={handleLikeBarber}
          onSkip={handleSkipBarber}
          onShowProfile={handleShowProfile}
        />
      ) : (
        <div className="text-center mt-[400px]">
          <p className="text-center text-6xl">🧑‍🦲</p>
          <p className="text-lg text-white mt-4">
            Sorry, no barbers are available at the moment.
          </p>
        </div>
      )}

      <BottomBar />
    </Layout>
  );
};

export default Main;
