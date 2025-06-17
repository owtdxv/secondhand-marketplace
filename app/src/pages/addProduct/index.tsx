import { useMemo, useRef, useState } from "react";
import AddProduct from "./AddProduct";
import { createProduct } from "../../types/product";
import axios from "axios";
import { app } from "../../firebase/firebase";
import { getDownloadURL, uploadBytes, ref, getStorage } from "firebase/storage";
import { useNavigate } from "react-router-dom";

const AddProductContainer = () => {
  const [modal, setModal] = useState<boolean>(false);
  const [data, setData] = useState<createProduct>({
    images: [],
  });
  const [imagesFiles, setImagesFiles] = useState<File[]>([]);
  const [region, setRegion] = useState<string>("지역 선택");
  const [loading, setLoading] = useState<boolean>(false);
  const token = sessionStorage.getItem("token");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const storage = getStorage(app);
  const navigate = useNavigate();

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    e.target.value = "";

    if (imagesFiles.length >= 2) {
      alert("이미지는 최대 2개까지 등록 가능합니다.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagesFiles((prev) => [...prev, file]);
    };
    reader.readAsDataURL(file);
  };

  const onChangeValue = (e: any) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const removeImage = (targetFile: File | string) => {
    setImagesFiles((prev) => prev.filter((file) => file !== targetFile));
  };

  //여러개 파일 firebase에 업로드 해주는 코드
  const uploadFileAndGetUrls = async (files: File[]) => {
    try {
      //단일로 진행 시 map 부분 제외하고 코딩 const storageRef ... 부터 작성하면 됨
      const uploadPromises = files.map(async (file) => {
        const fileName = `${Date.now()}_${file.name}`;
        const storageRef = ref(storage, `productImages/${fileName}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        return url;
      });

      const urls = await Promise.all(uploadPromises);
      return urls;
    } catch (error) {
      console.error("파일 업로드 실패:", error);
      throw error;
    }
  };

  const createProduct = async () => {
    setLoading(true);
    try {
      //firebase에 파일 업로드
      const urls = await uploadFileAndGetUrls(imagesFiles);
      const BASE_URL = import.meta.env.VITE_SOCKET_SERVER_URI;
      console.log("업로드 된 URL:", urls);

      const postData = {
        ...data,
        images: urls,
        saleRegion: region,
        price: Number(data.price),
      };

      console.log(postData);

      await axios
        .post("/api/product/new", postData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(async (res) => {
          console.log("상품 등록 응답:", res.data);

          const productId = res.data._id;

          // 상품 벡터화 API 호출
          await axios
            .post(
              `${BASE_URL}/api/vectorize`,
              { _id: productId },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            )
            .then((vectorRes) => {
              console.log("벡터화 성공:", vectorRes.data);
              navigate("/"); // 모든 작업 완료 후 이동
            })
            .catch((err) => {
              console.error("벡터화 실패:", err);
              // navigate는 필요 시 여기서도 호출 가능
            });
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.error("상품 등록 실패:", err);
    }
  };

  const modalHandler = () => {
    setModal(!modal);
  };

  const imagePreview = useMemo(() => {
    return imagesFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
  }, [imagesFiles]);

  return (
    <AddProduct
      modal={modal}
      region={region}
      data={data}
      mode="new"
      fileInputRef={fileInputRef}
      imagePreview={imagePreview}
      loading={loading}
      setRegion={setRegion}
      modalHandler={modalHandler}
      onChangeValue={onChangeValue}
      onClickSubmit={createProduct}
      removeImage={removeImage}
      handleCameraClick={handleCameraClick}
      handleImageChange={handleImageChange}
    />
  );
};

export default AddProductContainer;
