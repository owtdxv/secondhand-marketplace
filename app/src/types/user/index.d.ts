export interface UserInfo {
  id: string;
}

export interface User {
  _id: string;
  email: string;
  displayName: string;
  profileImage: string | null;
  provider: string;
  active: string;
  createdAt: string;
  updatedAt: string;
  socialId: string | null;
}
