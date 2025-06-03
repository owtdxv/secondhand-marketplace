import { Route, Routes } from "react-router-dom";
import MainContainer from "./pages/main";
import TopHeader from "./components/headers/TopHeader";
import BottomHeader from "./components/headers/BottomHeader";
import LoginContainer from "./pages/login";
import SignupContainer from "./pages/signup";
import SignupComplete from "./components/auth/SignupComplete";
import ProductListContainer from "./pages/productListPage";
import ProductDetailPageContainer from "./pages/productDetailPage";

function App() {
  return (
    <>
      <TopHeader />
      <BottomHeader />
      <Routes>
        <Route path="/" element={<MainContainer />} />
        <Route path="/login" element={<LoginContainer />} />
        <Route path="/signup" element={<SignupContainer />} />
        <Route path="/signup-complete" element={<SignupComplete />} />
        <Route path="/products" element={<ProductListContainer />} />
        <Route
          path="/products/:productId"
          element={<ProductDetailPageContainer />}
        />
      </Routes>
    </>
  );
}

export default App;
