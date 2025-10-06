import { useParams } from 'react-router-dom';
import { useState } from "react";
import Square from "../components/Square";
import './Game.css';
import { useWebSocket } from "../provider/WebSocketContext";
import { useEffect } from 'react';
import axios from 'axios';

const domain = process.env.REACT_APP_BACKEND_DOMAIN;

function Game() {
  const { gameId } = useParams();
  const [ board, setBoard ] = useState('RNBQKBNRPPPPPPPPXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXpppppppprnbqkbnr');
  const { onMessage, onConnectionStateChange, send, disconnect } = useWebSocket();

  const handleMessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.action && data.action === "opponentPlayedMove") {
        const source = data.source;
        const destination = data.destination;
        const piece = data.piece;
        movePieceOnBoard(source, destination, piece);
      }
      if (data.action && data.action === "selfPlayedMove") {
        const source = toIndex(data.source);
        const destination = toIndex(data.destination);
        const piece = data.piece;
        const error = data.error;
        if (!error || error === '') {
          movePieceOnBoard(source, destination, piece);
        }
      }
      if (data.action && data.action === "resigned") {
        const resigningPlayer = data.resigningPlayer;
        const userName = gameId.split('&userName=')[1].split('&color=')[0];
        if(userName === resigningPlayer) {
          document.getElementById("result").innerHTML = "You resigned. Better luck next time.";
        } else {
          document.getElementById("result").innerHTML = "Opponent resigned. Congratulations on victory.";
        }
      }
      
  };

    useEffect(() => {
        const unsubscribeMessages = onMessage(handleMessage);
        const unsubscribeStateChanges = onConnectionStateChange((state) => {
          document.getElementById("connState").innerHTML = state;
        });

        const userName = gameId.split('&userName=')[1].split('&color=')[0];
        const realGameId = gameId.split('&userName=')[0];

        axios.get(domain + "/ongoing-game?username="+sUn+"&gameId="+realGameId)
        .then((response) => {
            setBoard(response.data.board);
          });

        return () => {
          unsubscribeMessages();
          unsubscribeStateChanges();
        }
      }
    );

    const toNotation = (index) => {
      const file = String.fromCharCode('a'.charCodeAt(0) + (index % 8));
      const rank = Math.floor(index / 8) + 1;
      return `${file}${rank}`;
    }

    function toIndex(notation) {
      const file = notation.charCodeAt(0) - 'a'.charCodeAt(0);  // 0–7
      const rank = parseInt(notation[1], 10) - 1;               // 0–7
      return rank * 8 + file;
    }

  const onPieceMoved = (source, destination, piece) => {
      const realGameId = gameId.split('&userName=')[0];
      const userNameAndColor = gameId.split('&userName=')[1];
      const userName = userNameAndColor.split('&color=')[0];
      const color = userNameAndColor.split('&color=')[1].split('')[0];
      send(JSON.stringify({
          "userName": userName,
          "action": "movePiece",
          "gameId": realGameId,
          "move": {
              "movedPiece": piece,
              "playerColor": color,
              "startingSquare": toNotation(source),
              "endingSquare": toNotation(destination)
          }
      }));
  }

  const movePieceOnBoard = (source, destination, piece) => {
    let boardArray = [...board];

    boardArray[source] = 'X';
    boardArray[destination] = piece;

    const newBoard = boardArray.join('');

    setBoard(newBoard);
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
        <>
            <h3>Game ID: {gameId}</h3>

            <button onClick={testDisconnect}> Test disconnection </button>
            <button onClick={resign}> Resign </button>
            <div id="connState"></div>
            <div id="result" className='text-lg'></div>

            <div className = "board" id = "board">
                {
                    [...board].map(
                        (cell, cellIndex) => {
                            const gridrow = (7 - Math.floor(cellIndex / 8)) + 1;
                            const gridcol = (cellIndex % 8) + 1;
                            const color = ((gridrow + gridcol) % 2 === 1) ? 'light' : 'dark';
                            return (
                                <Square key={cellIndex} onPieceMoved={onPieceMoved} piece={cell} position={cellIndex} color={color} style={{gridRow: gridrow, gridColumn: gridcol}}/>);
                        }
                    )
                }
            </div>
        </>

  );
}

export default Game;
