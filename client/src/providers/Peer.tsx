import React, { useMemo, ReactNode, createContext, FC } from "react";

interface PeerProviderProps {
  children: ReactNode;
}

export interface PeerContextProps {
  peer: RTCPeerConnection;
  createOffer: () => Promise<RTCSessionDescriptionInit>;
  createAnswer: (
    offer: RTCSessionDescriptionInit
  ) => Promise<RTCSessionDescriptionInit>;
}

const PeerContext = createContext<PeerContextProps | null>(null);

export const usePeer = () => React.useContext(PeerContext);

export const PeerProvider: FC<PeerProviderProps> = ({ children }) => {
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

  return (
    <PeerContext.Provider value={{ peer, createOffer, createAnswer }}>
      {children}
    </PeerContext.Provider>
  );
};
