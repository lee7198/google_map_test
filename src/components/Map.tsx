import React, { type ReactElement, useEffect, useState } from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';

import axios from 'axios';
import { type Position, type Coordinates } from '../data/interface';

function Map(): ReactElement {
  const [myPosition, setMyPosition] = useState<Coordinates | undefined>({
    latitude: 0,
    longitude: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);

  const mapApiKey = import.meta.env.VITE_MAP_API_KEY as string;
  const goApiKey = import.meta.env.VITE_DATA_GO_API_KEY as string;

  const containerStyle = {
    width: '100%',
    height: '400px',
  };

  const getCurrentLocation = async (): Promise<Coordinates> =>
    new Promise<Coordinates>((resolve, reject): void => {
      if (navigator.geolocation == undefined) {
        reject(new Error('Geolocation is not supported by this browser.'));
      }
      navigator.geolocation.getCurrentPosition(
        (position: Position) => {
          const { latitude, longitude } = position.coords;
          resolve({ latitude, longitude });
          setLoading(false);
        },
        (error) => {
          reject(error);
        }
      );
    });

  const getWalk = async (): Promise<void> => {
    try {
      const response = await axios.get(
        'http://apis.data.go.kr/6270000/dgInParkwalk/getDgWalkItem?',
        {
          params: {
            serviceKey: goApiKey,
            type: 'json',
            id: '1',
          },
        }
      );
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect((): void => {
    getCurrentLocation().then(async (res): Promise<void> => {
      console.log(res);
      setMyPosition(res);
      getWalk();
    });
  }, []);

  return (
    <div>
      {!loading ? (
        <LoadScript googleMapsApiKey={mapApiKey}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={{
              lat: myPosition!.latitude,
              lng: myPosition!.longitude,
            }}
            zoom={10}
          >
            {/* 마커, 폴리곤 등 구현 */}
          </GoogleMap>
        </LoadScript>
      ) : (
        'loading!!!'
      )}
    </div>
  );
}

export default Map;
