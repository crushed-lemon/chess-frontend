import React from "react";
import logo from './logo.svg';
import './App.css';
import Home from './pages/Home';
import {SubmitUserName} from './api/Api';

function App() {
  return (
    <div className="App">
        <Home submitUserName = {SubmitUserName}/>
    </div>
  );
}

export default App;
