
import { useCallback, useEffect, useState } from "react";
import { useWebSocket } from "../provider/WebSocketContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const domain = process.env.REACT_APP_BACKEND_DOMAIN;

const Home = () => {

    const { connect, send, onMessage, onConnectionStateChange } = useWebSocket();
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [savedUsername, setSavedUsername] = useState(null);
    const [ongoingLobbyRequest, setOngoingLobbyRequest] = useState(false);
    const [ongoingGameInfo, setOngoingGameInfo] = useState(null);
    const [nameSubmitted, setNameSubmitted] = useState(false);

    const handleDisconnect = useCallback(() => {
        document.getElementById("connectionInfo").innerHTML = "Disconnected, attempting again";
    }, []);

    const handleConnect = useCallback(() => {
        document.getElementById("connectionInfo").innerHTML = "Connected";

        if(ongoingLobbyRequest === true) {
            return;
        }

        send(JSON.stringify({
            "userName": userName,
            "action": "requestGame",
            "gamePreferences": {
                "gameDuration": "TEN_MINUTES",
                "incrementPerMove": "ONE_SECOND",
                "playAs": "ANY"
            }
        }));

        setOngoingLobbyRequest(true);
    }, [send, userName, ongoingLobbyRequest]);

    const handleMessage = useCallback((message) => {
        const data = JSON.parse(message.data);
        if (data.action && data.action === "gameStarted") {
            const gameId = data.gameId;
            const color = data.color;
            navigate(`/game/${gameId}&userName=${userName}&color=${color}`);
        }
    }, [navigate, userName]);

    useEffect(() => {
        if(ongoingGameInfo !== null) {
            navigate(`/game/${ongoingGameInfo.gameId}&userName=${ongoingGameInfo.username}&color=${ongoingGameInfo.color}`);
        }
    }, [ongoingGameInfo, navigate]);

    useEffect(() => {
        if(ongoingLobbyRequest === true) {
            connect("wss://wec2i3hiw3.execute-api.eu-north-1.amazonaws.com/production/?userName=" + savedUsername);
        }
    }, [ongoingLobbyRequest, savedUsername, connect]);

    useEffect(() => {
        // initial effect
        console.log("initial effect is running");
        const sUn = localStorage.getItem("chess.username");
        if(sUn === null || sUn === '') {
            return;
        }

        console.log("savbed name was read as " + sUn);

        setSavedUsername(sUn);

        axios.get(domain + "/ongoing-lobby")
            .then((response) => {
                if(response.data === null || response.data.lobby === false) {
                    return;
                }
                setOngoingLobbyRequest(true);
            });

        axios.get(domain + "/ongoing-game-id")
            .then((response) => {
                if(response.data === null) {
                    return;
                }
                setOngoingGameInfo({
                    gameId : response.data.gameId,
                    color : response.data.color,
                    username : response.data.username
                });
            });
    }, []);

    useEffect(() => {
        console.log("After Name Submitted Effect is running");
        if(nameSubmitted === false && ongoingLobbyRequest === false) {
            console.log("Namesubmitted was false, no ongoing lobby request");
            return;
        }
        console.log("Subscribed to messages and statechanges");
        const unsubscribeMessages = onMessage(handleMessage);
        const unsubscribeStateChanges = onConnectionStateChange((state) => {
            if(state === "CONNECTED") {
                handleConnect();
            }
            if(state === "DISCONNECTED") {
                handleDisconnect();
            }
        });

        return () => {
            unsubscribeMessages();
            unsubscribeStateChanges();
        };
    }, [ongoingLobbyRequest, nameSubmitted, handleConnect, handleDisconnect, handleMessage, onMessage, onConnectionStateChange]);

    const submitForm = (e) => {
        e.preventDefault();
        document.getElementById("waitingMessage").innerHTML = "Pairing you with the best possible rival";
        
        setNameSubmitted(true);
        localStorage.setItem("chess.username", userName);
        setSavedUsername(userName);
        
        connect("wss://wec2i3hiw3.execute-api.eu-north-1.amazonaws.com/production/?userName=" + userName);
    }

    return (
            <header className="App-header">
                
                <div id="connectionInfo"></div>

                <h2> Enter your username and start playing! This will be changed to a login-based system soon. </h2>

                <form onSubmit={submitForm}>
                    {
                        savedUsername !== null
                        ?
                        <>
                            Welcome {savedUsername}
                        </>
                        :
                        <>
                            <p>Enter username : </p>
                            <input type="text"
                            value = {userName}
                            onChange = {(e) => setUserName(e.target.value)}
                            />
                        </>
                    }
                    {
                        ongoingLobbyRequest === false
                        ?
                        <button type  = "submit">Enter!</button>
                        :
                        <div>Finding you a partner</div>
                    }
                </form>
                <div id="waitingMessage"></div>
            </header>
    )
}

export default Home