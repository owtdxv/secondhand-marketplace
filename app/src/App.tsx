import { Route, Routes } from "react-router-dom";
import MainContainer from "./pages/main";
import TopHeader from "./components/headers/TopHeader";
import BottomHeader from "./components/headers/BottomHeader";
import LoginContainer from "./pages/login";

function App() {
  return (
    <>
      <TopHeader />
      <BottomHeader />
      <Routes>
        <Route path="/" element={<MainContainer />} />
        <Route path="/login" element={<LoginContainer />} />
      </Routes>
    </>
  );
}

export default App;
