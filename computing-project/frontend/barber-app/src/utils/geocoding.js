const getCoordinatesForPostcode = async (postcode) => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${postcode}&key=${process.env.REACT_APP_GEOCODE_API_KEY}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch coordinates");
    }

    const data = await response.json();

    return {
      lat: data.results[0].geometry.location.lat,
      lng: data.results[0].geometry.location.lng,
      formattedAddress: data.results[0].formatted_address,
      postcode
    };
  } catch (error) {
    console.error("Error getting coordinates:", error);
    throw error;
  }
};

const getLocationForCoordinates = async (lat, lng) => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.REACT_APP_GEOCODE_API_KEY}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch location");
    }

    const data = await response.json();

    return data.results[0].address_components ?? null;
  } catch (error) {
    console.error("Error getting location:", error);
    throw error;
  }
}

export { getCoordinatesForPostcode, getLocationForCoordinates };
