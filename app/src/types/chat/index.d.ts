export interface ChatRoomInfo {
  _id: string;
  otherUser: {
    _id: string;
    displayName: string;
    profileImage: string;
  };
  productId: {
    _id: string;
    name: string;
    sellerId: string;
  };
  createdAt: string;
  updatedAt: string;
  lastMessage: {
    _id: string;
    chatRoomId: string;
    senderId: string;
    message: string;
    sentAt: string;
    read: boolean;
    __v?: number;
  };
}

export interface Message {
  _id: string;
  chatRoomId: string;
  senderId: {
    _id: string;
    displayName: string;
    profileImage: string | null;
  };
  message: string;
  sentAt: string;
  read: boolean;
  __v?: number;
}
