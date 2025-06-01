import { Route, Routes } from "react-router-dom";
import MainContainer from "./pages/main";
import TopHeader from "./components/headers/TopHeader";
import BottomHeader from "./components/headers/BottomHeader";

function App() {
  return (
    <>
      <TopHeader />
      <BottomHeader />
      <Routes>
        <Route path="/" element={<MainContainer />} />
      </Routes>
    </>
  );
}

export default App;
