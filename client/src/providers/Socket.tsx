import React, { useMemo, ReactNode } from "react";
import { io, Socket } from "socket.io-client";

interface SocketProviderProps {
  children: ReactNode;
}

export interface SocketContextProps {
  socket: Socket;
}

const SocketContext = React.createContext<SocketContextProps | null>(null);

export const useSocket = (): SocketContextProps | null => {
  return React.useContext(SocketContext);
};

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const socket = useMemo(() => io("http://localhost:8001"), []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
