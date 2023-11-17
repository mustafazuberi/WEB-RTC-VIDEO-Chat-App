import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import { SocketProvider } from "./providers/Socket";
import Room from "./pages/Room";
import { PeerProvider } from "./providers/Peer";

function App() {
  return (
    <SocketProvider>
      <PeerProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/room/:roomId" element={<Room />} />
          </Routes>
        </Router>
      </PeerProvider>
    </SocketProvider>
  );
}

export default App;
