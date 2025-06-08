import { useState } from "react";
import AddProduct from "./AddProduct";

const AddProductContainer = () => {
  const [modal, setModal] = useState<boolean>(false);

  const modalHandler = () => {
    setModal(!modal);
  };
  return <AddProduct modal={modal} modalHandler={modalHandler} />;
};

export default AddProductContainer;
