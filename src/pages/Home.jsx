
import { useState } from "react";
import { useWebSocket } from "../provider/WebSocketContext";
import { useNavigate } from "react-router-dom";

const Home = () => {

    const { socketRef, connect } = useWebSocket();
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');

    const submitForm = (e) => {
        e.preventDefault();

        const socket = connect("wss://wec2i3hiw3.execute-api.eu-north-1.amazonaws.com/production/?userName=" + userName);

        document.getElementById("waitingMessage").innerHTML = "Please wait as we find a partner";

        socket.onopen = () => {
          console.log("Connected!");
          socket.send(JSON.stringify(
              {
                  "userName": userName,
                  "action": "requestGame",
                  "gamePreferences": {
                      "gameDuration": "TEN_MINUTES",
                      "incrementPerMove": "ONE_SECOND",
                      "playAs": "ANY"
                  }
              }));
        };

        socket.onmessage = (event) => {
          const data = JSON.parse(event.data);
          if (data.action && data.action == "gameStarted") {
            const gameId = data.gameId;
            const color = data.color;
            navigate(`/game/${gameId}&userName=${userName}&color=${color}`);
          }
        };
    }

    return (
            <header className="App-header">

                <h2> Enter your username and start playing! This will be changed to a login-based system soon. </h2>

                <form onSubmit={submitForm}>
                    <p>Enter username : </p>
                    <input type="text"
                    value = {userName}
                     onChange = {(e) => setUserName(e.target.value)}
                     />
                    <button type  = "submit">Enter!</button>
                </form>
                <div id="waitingMessage"></div>
            </header>
    )
}

export default Home