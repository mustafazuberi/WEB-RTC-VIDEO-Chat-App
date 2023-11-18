import { useCallback, useEffect, useState, useRef } from "react";
import { useSocket } from "../providers/Socket";
import { usePeer } from "../providers/Peer";

const Room = () => {
  const [myStream, setMyStream] = useState<null | MediaStream>(null);
  const MyStreamRef = useRef<HTMLVideoElement>(null);
  const RemoteStreamRef = useRef<HTMLVideoElement>(null);

  const socketContext = useSocket();
  const peerContext = usePeer();

  if (
    !socketContext ||
    !socketContext.socket ||
    !peerContext ||
    !peerContext.createOffer ||
    !peerContext.peer
  ) {
    return null; // Return null or a loading component if dependencies are not ready
  }

  const { socket } = socketContext;
  const { peer, createOffer, createAnswer, sendStream, remoteStream } =
    peerContext;

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
      try {
        await peer.setRemoteDescription(ans);
        console.log("call accepter ", ans);
      } catch (error) {
        console.error("Error setting remote description: ", error);
      }
    },
    [peer]
  );

  const getUserMediaStream = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    sendStream(stream);
    setMyStream(stream);
  }, [sendStream]);

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

  useEffect(() => {
    getUserMediaStream();
  }, [getUserMediaStream]);

  useEffect(() => {
    if (MyStreamRef.current && myStream) {
      MyStreamRef.current.srcObject = myStream;
    }
  }, [myStream]);

  useEffect(() => {
    if (RemoteStreamRef.current && remoteStream) {
      RemoteStreamRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  return (
    <div>
      <h1 className="text-3xl">Hey there! You are in a room</h1>
      <video ref={MyStreamRef} autoPlay playsInline controls />
      <video ref={RemoteStreamRef} autoPlay playsInline controls />
    </div>
  );
};

export default Room;
