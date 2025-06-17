import { useEffect, useMemo, useRef, useState } from "react";
import AddProduct from "../addProduct/AddProduct";
import { createProduct } from "../../types/product";
import axios from "axios";
import { app } from "../../firebase/firebase";
import { getDownloadURL, uploadBytes, ref, getStorage } from "firebase/storage";
import { useNavigate, useParams } from "react-router-dom";

const UpdateProductContainer = () => {
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
  const { productId } = useParams();

  useEffect(() => {
    axios
      .get(`/api/product/${productId}`)
      .then((res) => {
        console.log(res.data);
        setData(normalize(res.data));
        setRegion(res.data.saleRegion);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const normalize = (raw: any): createProduct => ({
    name: raw.name,
    category: raw.category,
    saleRegion: raw.saleRegion,
    price: raw.price,
    description: raw.description,
    images: raw.images || [],
  });

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

  const removeImage = (target: File | string) => {
    if (typeof target === "string") {
      setData((prev) => ({
        ...prev,
        images: (prev.images || []).filter((img) => img !== target),
      }));
    } else {
      setImagesFiles((prev) => prev.filter((file) => file !== target));
    }
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

  const updateProduct = async () => {
    setLoading(true);
    try {
      const BASE_URL = import.meta.env.VITE_SOCKET_SERVER_URI;
      //firebase에 파일 업로드
      const urls = await uploadFileAndGetUrls(imagesFiles);
      console.log("업로드 된 URL:", urls);

      const postData: createProduct = {
        ...data,
        images: [...(data.images || []), ...urls],
        saleRegion: region,
        price: Number(data.price),
      };

      console.log(postData);

      await axios
        .put(`/api/product/edit/${productId}`, postData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(async (res) => {
          console.log(res.data);
          await axios
            .put(`${BASE_URL}/api/edit/vectorize`, { _id: res.data._id })
            .then((vectorRes) => {
              console.log("벡터화 성공:", vectorRes.data);
              alert("상품 수정이 완료되었습니다.");
              navigate(`/products/${productId}`); // 모든 작업 완료 후 이동
            })
            .catch((err) => {
              console.error("벡터화 실패:", err);
            });
        })
        .catch((err) => {
          console.log(err);
          alert("상품 수정에 실패했습니다.");
          setLoading(false);
        });
    } catch (err) {
      console.error("상품 수정 실패:", err);
      alert("상품 수정에 실패했습니다.");
      setLoading(false);
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

  if (!data) {
    return <div>상품을 가져오는 중....</div>;
  }
  return (
    <AddProduct
      modal={modal}
      region={region}
      data={data}
      mode="edit"
      loading={loading}
      fileInputRef={fileInputRef}
      imagePreview={imagePreview}
      setRegion={setRegion}
      modalHandler={modalHandler}
      onChangeValue={onChangeValue}
      onClickSubmit={updateProduct}
      removeImage={removeImage}
      handleCameraClick={handleCameraClick}
      handleImageChange={handleImageChange}
    />
  );
};

export default UpdateProductContainer;
