import React, {
  useMemo,
  ReactNode,
  createContext,
  FC,
  useState,
  useEffect,
  useCallback,
} from "react";

interface PeerProviderProps {
  children: ReactNode;
}

export interface PeerContextProps {
  peer: RTCPeerConnection;
  createOffer: () => Promise<RTCSessionDescriptionInit>;
  createAnswer: (
    offer: RTCSessionDescriptionInit
  ) => Promise<RTCSessionDescriptionInit>;
  sendStream: (stream: MediaStream) => void;
  remoteStream: null | MediaStream;
}

const PeerContext = createContext<PeerContextProps | null>(null);

export const usePeer = () => React.useContext(PeerContext);

export const PeerProvider: FC<PeerProviderProps> = ({ children }) => {
  const [remoteStream, setRemoteStream] = useState<null | MediaStream>(null);

  const peer = useMemo(
    () =>
      new RTCPeerConnection({
        iceServers: [
          {
            urls: [
              "stun:stun.l.google.com:19302",
              "stun:global.stun.twilio.com:3478",
            ],
          },
        ],
      }),
    []
  );

  const createOffer = async () => {
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    return offer;
  };

  const createAnswer = async (offer: RTCSessionDescriptionInit) => {
    await peer.setRemoteDescription(offer);
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    return answer;
  };

  const sendStream = (stream: MediaStream) => {
    const tracks = stream.getTracks();
    for (const track of tracks) {
      peer.addTrack(track, stream);
    }
  };

  const handleTrackEv = useCallback((ev: RTCTrackEvent) => {
    const streams = ev.streams[0];
    console.log("strams", streams);
    setRemoteStream(streams);
  }, []);

  useEffect(() => {
    peer.addEventListener("track", handleTrackEv);

    return () => peer.removeEventListener("track", handleTrackEv);
  }, [peer]);

  return (
    <PeerContext.Provider
      value={{ peer, createOffer, createAnswer, sendStream, remoteStream }}
    >
      {children}
    </PeerContext.Provider>
  );
};
