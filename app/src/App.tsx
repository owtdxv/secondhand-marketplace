import { Route, Routes } from "react-router-dom";
import MainContainer from "./pages/main";
import TopHeader from "./components/headers/TopHeader";
import BottomHeader from "./components/headers/BottomHeader";
import LoginContainer from "./pages/login";
import SignupContainer from "./pages/signup";
import SignupComplete from "./components/auth/SignupComplete";

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
      </Routes>
    </>
  );
}

export default App;
