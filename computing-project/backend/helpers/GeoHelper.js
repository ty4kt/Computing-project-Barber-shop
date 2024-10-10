// Haversine formula, which is used to calculate the great-circle distance between two points on a sphere given their longitudes and latitudes

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const earthRadiusKm = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180); // Convert degrees to radians
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  // Calculate the haversine of the central angle
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  // Calculate the central angle
  const centralAngle = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Calculate distance
  const distance = earthRadiusKm * centralAngle;

  return distance;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

module.exports = { getDistanceFromLatLonInKm, deg2rad };
