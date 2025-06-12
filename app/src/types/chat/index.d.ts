export interface ChatRoomInfo {
  _id: string;
  otherUser: {
    _id: string;
    displayName: string;
    profileImage: string;
  };
  isNewChatRoom: boolean;
  createdAt: string;
  updatedAt: string;
  lastMessage: {
    _id: string;
    chatRoomId: string;
    senderId: string;
    message: string;
    sentAt: string;
    read: { [userId: string]: boolean }; // Map 타입 반영
    __v?: number;
  } | null;
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
  read: { [userId: string]: boolean }; // Map 타입 반영
  __v?: number;
}
