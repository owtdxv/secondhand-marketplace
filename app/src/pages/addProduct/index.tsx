import { useState } from "react";
import AddProduct from "./AddProduct";
import { createProduct } from "../../types/product";
import axios from "axios";

const AddProductContainer = () => {
  const [modal, setModal] = useState<boolean>(false);
  const [data, setData] = useState<createProduct>({
    price: 0,
  });
  const [region, setRegion] = useState<string>("지역 선택");
  const token = sessionStorage.getItem("token");

  const onChangeValue = (e: any) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const createProduct = () => {
    const postData = {
      ...data,
      price: Number(data.price),
      saleRegion: region,
      images: [
        "https://image.msscdn.net/thumbnails/images/goods_img/20250408/5002420/5002420_17477061031169_big.png?w=1200",
      ],
    };

    console.log(postData);

    axios
      .post("/api/product/new", postData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const modalHandler = () => {
    setModal(!modal);
  };
  return (
    <AddProduct
      modal={modal}
      region={region}
      setRegion={setRegion}
      modalHandler={modalHandler}
      onChangeValue={onChangeValue}
      createProduct={createProduct}
    />
  );
};

export default AddProductContainer;
