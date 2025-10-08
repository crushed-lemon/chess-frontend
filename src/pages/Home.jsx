
import { useCallback, useEffect, useState } from "react";
import { useWebSocket } from "../provider/WebSocketContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Terminal from "../components/Terminal";

const domain = process.env.REACT_APP_BACKEND_DOMAIN;

const Home = () => {

    const { connectionStatus, connect, send, onMessage, onConnectionStateChange } = useWebSocket();
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [savedUsername, setSavedUsername] = useState(null);
    const [ongoingLobbyRequest, setOngoingLobbyRequest] = useState(false);
    const [ongoingGameInfo, setOngoingGameInfo] = useState(null);
    const [nameSubmitted, setNameSubmitted] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(false);

    const [terminalLines, setTerminalLines] = useState([]);

    const handleDisconnect = useCallback(() => {
    }, []);

    const handleConnect = useCallback(() => {
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
            navigate(`/game/${gameId}`);
        }
    }, [navigate]);

    useEffect(() => {
        console.log(ongoingGameInfo);
        if(!ongoingGameInfo || !ongoingGameInfo.gameId) {
        } else {
            navigate(`/game/${ongoingGameInfo.gameId}`);
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

        axios.get(domain + "/ongoing-lobby?username="+sUn)
            .then((response) => {
                console.log(response);
                console.log(response.data);
                console.log(response.data.lobby);
                if(!response.data || !response.data.lobby) {
                    return;
                }
                setOngoingLobbyRequest(true);
            });

        axios.get(domain + "/ongoing-game-id?username="+sUn)
            .then((response) => {
                if(response.data.gameId === null || response.data.gameId === undefined) {
                    return;
                }
                setOngoingGameInfo({
                    gameId : response.data.gameId
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

    useEffect(() => {
        setTerminalLines([
            "Connection : " + connectionStatus.current,
            "Ping : ------ ms"
        ])
    }, [connectionStatus]);

    const submitForm = (e) => {
        e.preventDefault();
        setButtonDisabled(true);

        setNameSubmitted(true);
        localStorage.setItem("chess.username", userName);
        setSavedUsername(userName);
        
        connect("wss://wec2i3hiw3.execute-api.eu-north-1.amazonaws.com/production/?userName=" + userName);
    }

    function signInRedirect() {
        window.location.href = "https://eu-north-1m7qbd8uy1.auth.eu-north-1.amazoncognito.com/login?response_type=code&client_id=127nttui414onihc7vrt9dbf8i&redirect_uri=http://localhost:3000/apps/chess/login-callback";
    }

    return (
            <div className="flex flex-col md:flex-row bg-gray-900">

                {/* Left Panel: Game info / technical info */}
                <div className="md:w-2/5 w-full p-6 border-r md:border-r border-gray-700 flex flex-col space-y-6">
                    <Terminal ps1="$" lines={terminalLines} />
                </div>

                {/* Right Panel: Main content (login/cards/forms) */}
                <div className="md:w-3/5 w-full flex flex-col items-center justify-center p-8">

                    <div className="flex flex-col items-center space-y-6 mt-8">

                        {/* Top Login Card */}
                        <div className="w-96 p-6 bg-gray-800 rounded-2xl shadow-2xl flex flex-col items-center text-center">
                            <p className="text-amber-200 mb-6 font-light">
                                To enjoy the full experience, please log in. It only takes a moment!
                            </p>
                            <button
                                onClick={() => signInRedirect()}
                                className="bg-amber-900 text-amber-100 font-light px-8 py-3 rounded-full shadow-lg hover:bg-amber-700 transition-all text-lg"
                            >
                                Sign In
                            </button>
                        </div>

                        {/* OR Connector */}
                        <div className="relative flex flex-col items-center justify-center">
                            <div className="w-1 bg-amber-700 h-12 mb-6"></div> {/* vertical line above circle */}
                            <div 
                                className="absolute top-1/2 transform -translate-y-1/2 bg-gray-900 border-2 border-amber-700 w-12 h-12 rounded-full flex items-center justify-center text-amber-100"
                                style={{ fontFamily: "'Dancing Script', cursive" }}
                            >
                                OR
                            </div>
                            <div className="w-1 bg-amber-700 h-12 mt-6"></div> {/* vertical line below circle */}
                        </div>

                        {/* Main Form Card */}
                        <form 
                            onSubmit={submitForm}
                            className="w-96 bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col items-center"
                        >
                            {
                                savedUsername !== null
                                ? <h2 className="text-2xl text-amber-100 font-thin mb-4" style={{ fontFamily: "'Dancing Script', cursive" }}>
                                        Welcome {savedUsername}
                                    </h2>
                                : <>
                                    <p className="mb-4 text-amber-200 font-light text-center">
                                        If you don't like signing in, no worries, play as a guest! Let us know what we should call you:
                                    </p>
                                    <input 
                                        type="text"
                                        value={userName}
                                        onChange={(e) => setUserName(e.target.value)}
                                        className="w-full px-4 py-2 mb-4 rounded-lg bg-gray-700 text-amber-100 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-600 font-light"
                                        placeholder="Your name..."
                                    />
                                </>
                            }

                            {
                                ongoingLobbyRequest === false
                                ? <button 
                                        type="submit"
                                        disabled={buttonDisabled}
                                        className={`w-full bg-amber-900 text-amber-100 font-light px-6 py-3 rounded-full shadow-lg 
                                                    hover:bg-amber-700 transition-all text-lg 
                                                    ${buttonDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                                    >
                                        Enter!
                                    </button>
                                : <div className="text-amber-200 italic mt-2 text-center">Pairing you with the best possible rival...</div>
                            }
                        </form>
                    </div>

                </div>
            </div>


    )
}

export default Home