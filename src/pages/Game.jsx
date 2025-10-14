import { useParams } from 'react-router-dom';
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import Square from "../components/Square";
import './Game.css';
import { useWebSocket } from "../provider/WebSocketContext";
import { useEffect } from 'react';
import axios from 'axios';
import Terminal from '../components/Terminal';

const domain = process.env.REACT_APP_BACKEND_DOMAIN;

function Game() {
  const { gameId } = useParams();
  const [ username, setUsername ] = useState(null);
  const [ board, setBoard ] = useState('RNBQKBNRPPPPPPPPXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXpppppppprnbqkbnr');
  const [ gameInfo, setGameInfo ] = useState(null);
  const { connectionStatus, onMessage, onConnectionStateChange, send, connect, disconnect } = useWebSocket();
  const [ connectionState, setConnectionState ] = useState("UNKNOWN");
  const navigate = useNavigate();

  const [terminalLines, setTerminalLines] = useState([]);

  const movePieceOnBoard = useCallback((source, destination, piece) => {
    let boardArray = [...board];

    boardArray[source] = 'X';
    boardArray[destination] = piece;

    const newBoard = boardArray.join('');

    setBoard(newBoard);
  }, [board]);

  const handleMessage = useCallback((event) => {
      const data = JSON.parse(event.data);
      console.log(data);
      if (data.action && data.action === "MOVE_SUCCESS") {
        const source = toIndex(data.source);
        const destination = toIndex(data.destination);
        const piece = data.piece;
        const nextPlayer = data.nextPlayer;
        movePieceOnBoard(source, destination, piece);
        setGameInfo((p) => {
          return {
            ...p,
            currentPlayer : nextPlayer
          }
        });
      }
      if (data.action && data.action === "ERROR") {
        // TODO : Give better alert
        alert("that wasnt allowed, error is " + data.errors);
        console.error(data.errors);
      }
      if (data.action && data.action === "PLAYER_RESIGNED") {
        const resigningPlayer = data.resigningPlayer;
        if(username === resigningPlayer) {
          // TODO : Don't update HTML directly, save this in a state variable and let react render appropriately
          document.getElementById("result").innerHTML = "You resigned. Better luck next time.";
        } else {
          document.getElementById("result").innerHTML = "Opponent resigned. Congratulations on victory.";
        }
      }
      
  }, [username, movePieceOnBoard]);

    useEffect(() => {
        const un = localStorage.getItem("chess.username");
        if(!un) {
          navigate("/");
          return;
        }
        setUsername(un);
        const unsubscribeMessages = onMessage(handleMessage);
        const unsubscribeStateChanges = onConnectionStateChange((state) => {
          setConnectionState(state);
        });

        axios.get(domain + "/ongoing-game?username="+un+"&gameId="+gameId)
        .then((response) => {
            setBoard(response.data.board);
            setGameInfo({
              selfColor : response.data.color,
              currentPlayer : response.data.currentPlayer 
            });
          });

        if(connectionStatus.current === "DISCONNECTED") {
          connect("wss://wec2i3hiw3.execute-api.eu-north-1.amazonaws.com/production/?userName=" + un)
        }

        return () => {
          unsubscribeMessages();
          unsubscribeStateChanges();
        }
      }, [onMessage, onConnectionStateChange, gameId, handleMessage, navigate, connect, connectionStatus]
    );

    useEffect(() => {

      let lines = ["Connection : " + connectionState,
        "Ping : 3000 ms",
        "",
        "Game Id : " + gameId,
        "PlayerId : " + username
      ]
      if (gameInfo != null && gameInfo.selfColor != null) {
        lines.push("Color : " + gameInfo.selfColor);
      }
      if (gameInfo != null && gameInfo.currentPlayer != null) {
        lines.push("CurrentPlayer : " + gameInfo.currentPlayer);
      }
      setTerminalLines(lines);
    }, [connectionState, gameId, gameInfo, username]);

    const toNotation = (index) => {
      const file = String.fromCharCode('a'.charCodeAt(0) + (index % 8));
      const rank = Math.floor(index / 8) + 1;
      return `${file}${rank}`;
    }

    function toIndex(notation) {
      const file = notation.charCodeAt(0) - 'a'.charCodeAt(0);
      const rank = parseInt(notation[1], 10) - 1;
      return rank * 8 + file;
    }

  const onPieceMoved = (source, destination, piece) => {
      send(JSON.stringify({
          "userName": username,
          "action": "movePiece",
          "gameId": gameId,
          "move": {
              "movedPiece": piece,
              "playerColor": gameInfo.selfColor[0],
              "startingSquare": toNotation(source),
              "endingSquare": toNotation(destination)
          }
      }));
  }

  const testDisconnect = () => {
    disconnect();
  }

  const resign = () => {
    axios.post(domain + "/resign")
    .then((response) => {
      console.log(response);
    });
  }

  return (
        <div className="flex flex-col md:flex-row bg-gray-900 text-amber-200 font-light">
          {/* Left Panel (40%) */}
          <div className="md:w-2/5 w-full p-6 border-r border-gray-800 flex flex-col space-y-6">
            
            {/* Terminal Box for Connection Info + Game ID */}
            <Terminal ps1='~/chess/game$' lines={terminalLines} />

            {/* Action Buttons */}
            <div className="flex flex-col space-y-3 w-3/5">
              <button
                onClick={testDisconnect}
                className="bg-gray-800 border border-gray-700 hover:border-amber-400 transition-all duration-200 rounded-lg py-2 text-amber-300 hover:text-amber-100 font-medium"
              >
                Offer Draw
              </button>
              <button
                onClick={resign}
                className="bg-gray-800 border border-gray-700 hover:border-red-400 transition-all duration-200 rounded-lg py-2 text-red-400 hover:text-red-300 font-medium"
              >
                Resign
              </button>

              <div id="result"></div>
            </div>
          </div>

          {/* Right Panel (60%) */}
          <div className="md:w-3/5 w-full flex items-center justify-center p-6">
            <div
              id="board"
              className="grid grid-cols-8 grid-rows-8 w-[90%] max-w-[600px] min-w-[450px] aspect-square border-4 border-gray-800 rounded-xl shadow-inner"
            >
              {[...board].map((cell, cellIndex) => {
                const gridrow = 8 - Math.floor(cellIndex / 8);
                const gridcol = (cellIndex % 8) + 1;
                const squareTint = (gridrow + gridcol) % 2 === 1 ? "light" : "dark";
                return (
                  <Square
                    key={cellIndex}
                    onPieceMoved={onPieceMoved}
                    piece={cell}
                    position={cellIndex}
                    squareTint={squareTint}
                    style={{
                      gridRow: gridrow,
                      gridColumn: gridcol,
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>

  );
}

export default Game;
