import ChatRoomList from "./ChatRoomList";
import { Socket } from "socket.io-client";

interface ChatRoomListContainerProps {}

const ChatRoomListContainer: React.FC<ChatRoomListContainerProps> = ({}) => {
  return <ChatRoomList />;
};

export default ChatRoomListContainer;
