import { useParams } from 'react-router-dom';
import { useState } from "react";
import Square from "../components/Square";
import './Game.css';

function Game() {
  const { gameId } = useParams();
  const [ board, setBoard ] = useState('RNBQKBNRPPPPPPPPXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXpppppppprnbqkbnr');

  const onPieceMoved = (source, destination, piece) => {
    let boardArray = [...board];

    boardArray[source] = 'X';
    boardArray[destination] = piece;

    const newBoard = boardArray.join('');

    setBoard(newBoard);
  }

  return (
        <>
            <h3>Game ID: {gameId}</h3>

            <div className = "board" id = "board">
                {
                    [...board].map(
                        (cell, cellIndex) => {
                            const gridrow = (7 - Math.floor(cellIndex / 8)) + 1;
                            const gridcol = (cellIndex % 8) + 1;
                            const color = ((gridrow + gridcol) % 2 == 1) ? 'light' : 'dark';
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
