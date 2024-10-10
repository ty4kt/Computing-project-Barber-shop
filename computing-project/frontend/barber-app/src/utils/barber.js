const fetchBarbersNearby = async (
  longitude,
  latitude,
  maxDistanceInMeters,
  signal
) => {
  let authorization = localStorage.getItem("authToken");

  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_BASE_URL}/api/barbers/nearby?longitude=${longitude}&latitude=${latitude}&maxDistanceInMeters=${maxDistanceInMeters}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authorization}`,
        },
        signal,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Request failed");
    }

    const data = await response.json();
    console.log(data);
    return data;
  } catch (err) {
    console.log(err);
  }
};

const likeBarber = async (barberId) => {
  let authorization = localStorage.getItem("authToken");

  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_BASE_URL}/api/barbers/like`,
      {
        method: "POST",
        body: JSON.stringify({ barberId: barberId }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authorization}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Request failed");
    }

    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
  }
};

const fetchBarberWork = async (userId) => {
  try {
    const response = await fetch(`/api/media/${userId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch images.");
    }
    const { media } = await response.json();

    return media;
  } catch (error) {
    console.error("Error fetching barber work:", error);
  }
};

const fetchBarberMedia = async (barberId) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_BASE_URL}/api/barber-media/${barberId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch barber media");
    }

    const mediaItems = await response.json();
    return mediaItems;
  } catch (error) {
    console.error("Error fetching barber's media:", error);
    return null; // or handle the error as you see fit
  }
};

export { fetchBarbersNearby, likeBarber, fetchBarberWork, fetchBarberMedia };
