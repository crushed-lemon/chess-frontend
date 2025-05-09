import React from "react";
import './App.css';
import Home from './pages/Home';
import Game from './pages/Game';
import NoPage from './pages/NoPage';
import {SubmitUserName} from './api/Api';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (

      <BrowserRouter basename = "/apps/chess">
        <Routes>
            <Route index element={<Home submitUserName = {SubmitUserName}/>} />
            <Route path="/game/:gameId" element={<Game />} />
            <Route path="*" element={<NoPage />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;
