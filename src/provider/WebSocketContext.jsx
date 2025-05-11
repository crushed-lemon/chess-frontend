// WebSocketContext.js
import React, { createContext, useContext, useRef } from "react";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const socketRef = useRef(null);

  const connect = (url) => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      socketRef.current = new WebSocket(url);
    }
    return socketRef.current;
  };

  return (
    <WebSocketContext.Provider value={{ socketRef, connect }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
