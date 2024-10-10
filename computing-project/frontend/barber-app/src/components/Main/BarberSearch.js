// components/Main/BarberSearch.js

import React, { useEffect, useState } from "react";
import { useUser } from "../../contexts/UserContext";
import { fetchBarbersNearby } from "../../utils/barber";

const BarberSearch = ({ setBarbers }) => {
  const { user } = useUser();
  const [maxDistanceInMeters, setMaxDistanceInMeters] = useState(10000000);

  useEffect(() => {
    if (user && user.location) {
      const [longitude, latitude] = user.location.location.coordinates;

      fetchBarbersNearby(longitude, latitude, maxDistanceInMeters)
        .then((data) => {
          setBarbers(data);
        })
        .catch((error) => {
          console.error("Error in BarberSearch:", error);
        });
    }
  }, [user, maxDistanceInMeters, setBarbers]);

  return null; // Assuming this component does not render anything by itself
};

export default BarberSearch;