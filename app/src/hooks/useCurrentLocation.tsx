import { useState } from "react";

interface Location {
  lat: number;
  lng: number;
  region1: string; // 시/도
  region2: string; // 시/구
}

export const useCurrentLocation = () => {
  const [loc, setLoc] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getAddressFromCoords = async (lat: number, lng: number) => {
    const res = await fetch(
      `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${lng}&y=${lat}`,
      {
        headers: {
          Authorization: `KakaoAK 95a80b59f6e816205ed40dd6f1a4df9b`,
        },
      }
    );

    const data = await res.json();
    if (!data.documents || data.documents.length === 0) {
      throw new Error("주소 정보가 없습니다.");
    }

    const region = data.documents[0];
    return {
      region1: region.region_1depth_name,
      region2: region.region_2depth_name,
    };
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError("이 브라우저는 위치 정보를 지원하지 않습니다.");
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        try {
          const { region1, region2 } = await getAddressFromCoords(lat, lng);
          setLoc({ lat, lng, region1, region2 });
          setError(null);
        } catch (err) {
          console.error("주소 변환 실패:", err);
          setError("주소 정보를 가져오는 데 실패했습니다.");
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.error("위치 정보 오류:", err);
        setError("위치 정보를 가져오는 데 실패했습니다.");
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return { loc, error, loading, getLocation };
};
