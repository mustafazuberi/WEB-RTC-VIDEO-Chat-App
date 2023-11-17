import { useSocket } from "../providers/Socket";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

interface RoomJoinedPayload {
  roomId: string;
}

const Home = () => {
  const navigate = useNavigate();
  const [inps, setInps] = useState({ email: "", roomId: "" });
  const socketContext = useSocket();

  if (!socketContext || !socketContext.socket) {
    return;
  }
  const { socket } = socketContext;

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("emitted");
    socket.emit("join-room", {
      emailId: inps.email,
      roomId: inps.roomId,
    });
  };

  const handleRoomJoined = useCallback(
    ({ roomId }: RoomJoinedPayload) => {
      navigate(`/room/${roomId}`);
    },
    [navigate]
  );

  useEffect(() => {
    socket.on("joined-room", handleRoomJoined);

    return () => {
      socket.off("joined-room", handleRoomJoined);
    };
  }, [socket]);

  return (
    <main className="flex justify-center items-center w-full h-screen">
      <section className="flex flex-col gap-y-6 max-w-md">
        <section
          className="flex flex-col gap-y-2 max-w-sm"
          onSubmit={handleJoinRoom}
        >
          <section>
            <input
              onChange={(e) =>
                setInps((prev) => ({ ...prev, email: e.target.value }))
              }
              type="email"
              className="outline-none border border-slate-500 p-2 w-full"
              placeholder="Enter your email here"
            />
          </section>
          <section>
            <input
              onChange={(e) =>
                setInps((prev) => ({ ...prev, roomId: e.target.value }))
              }
              type="text"
              className="outline-none border border-slate-500 p-2 w-full"
              placeholder="Enter Room code"
            />
          </section>
        </section>
        <section>
          <button
            className="bg-slate-900 text-gray-200 p-2 w-full"
            type="submit"
            onClick={handleJoinRoom}
          >
            Enter Room
          </button>
        </section>
      </section>
    </main>
  );
};

export default Home;
