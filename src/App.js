
import React from "react";
import './App.css';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Game from './pages/Game';
import NoPage from './pages/NoPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WebSocketProvider } from "./provider/WebSocketContext";

function App() {
  return (
    <WebSocketProvider>
      <BrowserRouter basename = "/apps/chess">
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="/game/:gameId" element={<Game />} />
            <Route path="*" element={<NoPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </WebSocketProvider>
  );
}

export default App;
