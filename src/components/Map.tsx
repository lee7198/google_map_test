import { GoogleMap, LoadScript } from "@react-google-maps/api";
import axios from "axios";
import { useEffect, useState } from "react";

export const Map = () => {
  const [myPosition, setMyPosition] = useState<Coordinates | undefined>({
    latitude: 0,
    longitude: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);

  const map_api_key = import.meta.env.VITE_MAP_API_KEY;
  const go_api_key = import.meta.env.VITE_DATA_GO_API_KEY;

  const containerStyle = {
    width: "100%",
    height: "400px",
  };

  interface Coordinates {
    latitude: number;
    longitude: number;
  }
  interface Position {
    coords: Coordinates;
  }

  const getCurrentLocation = async (): Promise<Coordinates> => {
    return new Promise<Coordinates>((resolve, reject) => {
      if (!navigator.geolocation) {
        reject("Geolocation is not supported by this browser.");
      }
      navigator.geolocation.getCurrentPosition(
        (position: Position) => {
          const { latitude, longitude } = position.coords;
          resolve({ latitude, longitude });
          setLoading(false);
        },
        (error) => reject(error)
      );
    });
  };

  const getWalk = async () => {
    try {
      const response = await axios.get(
        "http://apis.data.go.kr/6270000/dgInParkwalk/getDgWalkItem?",
        {
          params: {
            serviceKey: go_api_key,
            type: "json",
            id: "1",
          },
        }
      );
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getCurrentLocation().then((res) => {
      console.log(res);
      setMyPosition(res);
      getWalk();
    });
  }, []);

  return (
    <>
      {!loading ? (
        <LoadScript googleMapsApiKey={map_api_key}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={{ lat: myPosition!.latitude, lng: myPosition!.longitude }}
            zoom={10}
          >
            {/* 마커, 폴리곤 등 구현 */}
          </GoogleMap>
        </LoadScript>
      ) : (
        "loading!!!"
      )}
    </>
  );
};
