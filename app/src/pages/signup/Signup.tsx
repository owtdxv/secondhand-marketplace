import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [passwordMatch, setPasswordMatch] = useState(true);
  const [emailCheckResult, setEmailCheckResult] = useState<null | boolean>(
    null
  );
  const [nameCheckResult, setNameCheckResult] = useState<null | boolean>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setPasswordMatch(password === value);
  };

  const checkEmailDuplicate = async () => {
    if (!email) return;
    try {
      const response = await axios.get(
        `/api/auth/check-email?email=${encodeURIComponent(email)}`
      );
      setEmailCheckResult(response.data.isDuplicate);
    } catch (error) {
      console.error("이메일 중복검사 실패", error);
      setEmailCheckResult(null);
    }
  };

  const checkNameDuplicate = async () => {
    if (!displayName) return;
    try {
      const response = await axios.get(
        `/api/auth/check-name?displayName=${encodeURIComponent(displayName)}`
      );
      setNameCheckResult(response.data.isDuplicate);
    } catch (error) {
      console.error("닉네임 중복검사 실패", error);
      setNameCheckResult(null);
    }
  };

  const handleSignup = async () => {
    setErrorMessage("");

    if (emailCheckResult !== false) {
      setErrorMessage("이메일 중복여부를 확인해 주세요.");
      return;
    }

    if (nameCheckResult !== false) {
      setErrorMessage("닉네임 중복여부를 확인해 주세요.");
      return;
    }

    if (!passwordMatch) {
      setErrorMessage("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const response = await axios.post("/api/auth/signup", {
        email,
        password,
        displayName,
      });

      if (response.status === 201 || response.status === 200) {
        navigate("/login");
      }
    } catch (error: any) {
      const status = error.response?.status;
      const message = error.response?.data?.message;

      if (status === 409) {
        setErrorMessage(message);
      } else {
        setErrorMessage("회원가입 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div>
      <div>
        <label>이메일:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailCheckResult(null);
          }}
        />
        <button type="button" onClick={checkEmailDuplicate}>
          중복검사
        </button>
        {emailCheckResult === true && (
          <p style={{ color: "red" }}>이미 사용 중인 이메일입니다.</p>
        )}
        {emailCheckResult === false && (
          <p style={{ color: "green" }}>사용 가능한 이메일입니다.</p>
        )}
      </div>

      <div>
        <label>닉네임:</label>
        <input
          type="text"
          value={displayName}
          onChange={(e) => {
            setDisplayName(e.target.value);
            setNameCheckResult(null);
          }}
        />
        <button type="button" onClick={checkNameDuplicate}>
          중복검사
        </button>
        {nameCheckResult === true && (
          <p style={{ color: "red" }}>이미 사용 중인 닉네임입니다.</p>
        )}
        {nameCheckResult === false && (
          <p style={{ color: "green" }}>사용 가능한 닉네임입니다.</p>
        )}
      </div>

      <div>
        <label>비밀번호:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setPasswordMatch(e.target.value === confirmPassword);
          }}
        />
      </div>

      <div>
        <label>비밀번호 확인:</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
        />
        {!passwordMatch && (
          <p style={{ color: "red" }}>비밀번호가 일치하지 않습니다.</p>
        )}
      </div>

      <div>
        <button type="button" onClick={handleSignup}>
          회원가입
        </button>
      </div>

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </div>
  );
};

export default Signup;
