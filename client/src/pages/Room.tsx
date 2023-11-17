import { useCallback, useEffect } from "react";
import { useSocket } from "../providers/Socket";
import { usePeer } from "../providers/Peer";

const Room = () => {
  const socketContext = useSocket();
  const peerContext = usePeer();
  if (
    !socketContext ||
    !socketContext.socket ||
    !peerContext ||
    !peerContext.createOffer ||
    !peerContext.peer
  ) {
    return;
  }
  const { socket } = socketContext;
  const { peer, createOffer, createAnswer } = peerContext;

  const handleNewUserJoined = useCallback(
    async ({ emailId }: { emailId: string }) => {
      console.log(`new user : ${emailId} joined!`);
      const offer = await createOffer();
      socket.emit("call-user", { emailId, offer });
    },
    [createOffer, socket]
  );

  const handleIncommingCall = useCallback(
    async ({
      from,
      offer,
    }: {
      from: string;
      offer: RTCSessionDescriptionInit;
    }) => {
      console.log("Incomming call from ", from, offer);
      const ans = await createAnswer(offer);
      socket.emit("call-accepted", { emailId: from, ans });
    },
    [socket]
  );

  const handleOnCallAccept = useCallback(
    async ({ ans }: { ans: RTCSessionDescriptionInit }) => {
      await peer.setRemoteDescription(ans);
      console.log("call accepter ", ans);
    },
    [socket]
  );

  useEffect(() => {
    socket.on("user-joined", handleNewUserJoined);
    socket.on("incoming-call", handleIncommingCall);
    socket.on("call-accepted", handleOnCallAccept);

    return () => {
      socket.off("user-joined");
      socket.off("incoming-call");
      socket.off("call-accepted");
    };
  }, [handleNewUserJoined, socket]);

  return (
    <div>
      <h1 className="text-3xl">Hey there You are in room</h1>
    </div>
  );
};

export default Room;
