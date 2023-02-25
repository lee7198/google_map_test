import { GoogleMap, LoadScript } from "@react-google-maps/api";

export const Map = () => {
  const api_key = import.meta.env.VITE_MAP_API_KEY;

  const containerStyle = {
    width: "100%",
    height: "400px",
  };

  const center = {
    lat: 37.5665,
    lng: 126.978,
  };

  console.log(api_key);
  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_MAP_API_KEY}>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10}>
        {/* 마커, 폴리곤 등 구현 */}
      </GoogleMap>
    </LoadScript>
  );
};
