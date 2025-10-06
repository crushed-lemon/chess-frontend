import React, { createContext, useContext, useRef } from "react";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {

  const socketRef = useRef(null);
  const pendingMessages = useRef([]);
  const onMessageHandlers = useRef(new Set());
  const onConnectionStateChangeHandlers = useRef(new Set());
  const MAX_QUEUE_SIZE = 1000;
  const connectionStatus = useRef("DISCONNECTED");

  const disconnect = () => {
    console.log("Disconnecting!");
    socketRef.current.close();
  }

  const connect = (url) => {
    if (!isConnected()) {
      console.log("Attempting connection...");
      connectionStatus.current = "CONNECTING";
      notifyConnectionChange(connectionStatus.current);
      
      socketRef.current = new WebSocket(url);

      socketRef.current.onopen = () => {
        console.log("Attemp successful, we are connected!");
        flushPendingMessages(socketRef.current);
        connectionStatus.current = "CONNECTED";
        notifyConnectionChange(connectionStatus.current);
      };

      socketRef.current.onclose = (event) => {
        connectionStatus.current = "DISCONNECTED";
        notifyConnectionChange(connectionStatus.current);
        setTimeout(() => connect(url), 1000);
      };

      socketRef.current.onmessage = (message) => {
        notifyMessage(message);
      }
    } else {
      console.log("Already connected, not attempting connection again!");
    }
  };

  const send = (message) => {
    if(!isConnected()) {
      console.log("Not connected, addin to queue");
      if(pendingMessages.length >= MAX_QUEUE_SIZE) {
        console.log("MESSAGE BUFFER FULL, MESSAGE DROPPED");
        return;
      }
      pendingMessages.current.push(message);
    } else {
      console.log("Sending message");
      socketRef.current.send(message);
    }
  }

  const onMessage = (callback) => {
    onMessageHandlers.current.add(callback);
    return () => onMessageHandlers.current.delete(callback);
  }

  const onConnectionStateChange = (callback) => {
    console.log("SOme on just subscribed to connection events");
    onConnectionStateChangeHandlers.current.add(callback);
    return () => onConnectionStateChangeHandlers.current.delete(callback);
  }

  const isConnected = () => {
    console.log("CHECKING ISCONNECTED ====");
    console.log(socketRef.current);
    if(socketRef.current) {
      console.log(socketRef.current.readyState);
    }
    console.log("CHECKING ISCONNECTED DONE ====");
    return (socketRef.current !== null && socketRef.current.readyState === WebSocket.OPEN);
  }

  const notifyConnectionChange = (state) => {
    console.log("Will notify " + onConnectionStateChangeHandlers.current.size + " subscribers");
      for(const cb of onConnectionStateChangeHandlers.current) {
        console.log("Notifying someone");
        cb(state);
      }
  }

  const notifyMessage = (message) => {
      for(const cb of onMessageHandlers.current) {
        cb(message);
      }
  }

  const flushPendingMessages = (socket) => {
    while(pendingMessages.current.length !== 0) {
      const message = pendingMessages.current.shift();
      socket.send(message);
    } 
  }

  return (
    <WebSocketContext.Provider value={{ connectionStatus, connect, disconnect, send, onMessage, onConnectionStateChange }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
