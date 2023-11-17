import { useEffect } from "react";
import { useSocket } from "../providers/Socket";

const Room = () => {
  const socketContext = useSocket();
  if (!socketContext || !socketContext.socket) {
    return;
  }
  const { socket } = socketContext;

  const handleNewUserJoined = ({ emailId }: { emailId: string }) => {
    console.log(`new user : ${emailId} joined!`);
  };

  useEffect(() => {
    socket.on("user-joined", handleNewUserJoined);
  }, [socket]);

  return (
    <div>
      <h1 className="text-3xl">Hey there You are in room</h1>
    </div>
  );
};

export default Room;
