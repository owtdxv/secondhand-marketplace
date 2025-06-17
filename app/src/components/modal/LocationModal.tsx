import styles from "@/styles/components/locationModal.module.css";
import {
  Region,
  RegionGu,
} from "../../dummy-data/korea-administrative-district";
import { useState } from "react";

interface PropsType {
  setRegion: (region: string) => void;
  modalHandler: () => void;
}
const LocationModal = ({ setRegion, modalHandler }: PropsType) => {
  const [location, setLocation] = useState<number>(0);

  return (
    <div className={styles.wrap}>
      <button className={styles.getLocation}>현재 위치 가져오기</button>
      <div className={styles.wrapLocation}>
        <div className={styles.RegionGu}>
          {RegionGu.map((item: string, index: number) => (
            <div
              className={styles.RegionGuDetail}
              style={
                index === location
                  ? { borderLeft: "3px solid #61a872", paddingRight: "3px" }
                  : { border: "none" }
              }
              key={index}
              onClick={() => {
                setLocation(index);
              }}
            >
              {item}
            </div>
          ))}
        </div>
        <div className={styles.Region}>
          {Region[location].map((item: string) => (
            <div
              onClick={() => {
                setRegion(item);
                console.log(item);
                modalHandler();
              }}
              className={styles.RegionDetail}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LocationModal;
