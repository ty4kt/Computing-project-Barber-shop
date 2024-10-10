import Input from "../Input";
import { getCoordinatesForPostcode, getLocationForCoordinates} from "../../utils/geocoding";
import Button from "./../Button";
import Logo from "./../Logo";
import { accountSetupRequest } from "../../utils/account";

const PostcodeStep = ({ postcode, setPostcode, nextStep }) => {
  const handleLocationAccess = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          console.log("Latitude: " + position.coords.latitude);
          console.log("Longitude: " + position.coords.longitude);

          let getLocationFromCoords = await getLocationForCoordinates(position.coords.latitude, position.coords.longitude);

          if (!getLocationFromCoords || getLocationFromCoords.length < 2) {
            console.error("Location not found");
            alert("Location not found");
            return;
          }
          
          let city = getLocationFromCoords[1].long_name;
          let country = getLocationFromCoords[4].long_name;
          let postcode = getLocationFromCoords[5].long_name;

          if (getLocationFromCoords[0].types.includes("street_number")) {
            city = getLocationFromCoords[2].long_name ?? null;
            country = getLocationFromCoords[5].long_name ?? null;
            postcode = getLocationFromCoords[6].long_name ?? null;
          }
          
          try {
            let req = await accountSetupRequest({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              city,
              country,
              timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
              postcode
            }, "locationStep")

            nextStep();
          } catch (error) {
            // error updating location
            console.error("Error updating location:", error);
            alert("Error updating location: " + error.message);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Error getting location: " + error.message);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser");
      alert("Geolocation is not supported by this browser, please enter your postcode manually.");
    }
  };

  const handleContinue = async () => {
    try {
      const coordinates = await getCoordinatesForPostcode(postcode);
      const getLocationFromCoords = await getLocationForCoordinates(coordinates.lat, coordinates.lng);

      if (!getLocationFromCoords || getLocationFromCoords.length < 2) {
        console.error("Location not found");
        alert("Location not found");
        return;
      }

      let city = getLocationFromCoords[1].long_name;
      let country = getLocationFromCoords[4].long_name;

      if (getLocationFromCoords[0].types.includes("street_number")) {
        city = getLocationFromCoords[2].long_name ?? null;
        country = getLocationFromCoords[5].long_name ?? null;
      }

      try {
        let req = await accountSetupRequest({
          latitude: coordinates.lat,
          longitude: coordinates.lng,
          city,
          country,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        }, "locationStep")
        
        nextStep();
      } catch (error) {
        console.error("Error updating location:", error);
        alert("Error updating location: " + error.message);
      }

    } catch (error) {
      console.error("Error getting location:", error);
      alert("Error getting location: " + error.message);
    }
  };


  return (
    <div className="text-white space-y-4 p-4 sm:p-6 lg:p-8">
      <Logo />

      <h2 className="text-xl font-bold mb-3">Where do you live?</h2>
      <p>Activating location service will get us an approximate location</p>

      <Input
        placeholder="Post Code / Zip Code"
        value={postcode}
        onChange={(e) => setPostcode(e.target.value)}
        modifyClass={"mt-5"}
      />
      <br />
      <div className="space-x-2">
        <Button
          onClick={handleContinue}
          text={`Continue`}
          modifyClass={`bg-barber-blue hover:bg-blue-700 transition text-white font-bold py-4 px-12 rounded-full mt-4`}
        ></Button>
        <Button
          onClick={handleLocationAccess}
          text={`Use My Location`}
          modifyClass={`px-6 py-4 hover:bg-white hover:text-black transition text-white rounded-full mt-4`}
        ></Button>
      </div>
    </div>
  );
};

export default PostcodeStep;
