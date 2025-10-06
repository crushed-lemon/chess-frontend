import './Square.css';
import Piece from './Piece';
import { useState } from "react";

function Square({onPieceMoved, piece, position, style, squareTint}) {

    const [selfClass, setSelfClass] = useState([`${squareTint} square`]);

    const handleDragOver = (event) => {
        event.preventDefault();
    }

    const handleDragEnter = (event) => {
        console.log(selfClass);
        event.preventDefault();
        let newClass = selfClass + " hovering-piece";
        setSelfClass(newClass);
    }

    const handleDragLeave = (event) => {
        event.preventDefault();
        let newClass = selfClass.replace(" hovering-piece", " ");
        setSelfClass(newClass);
    }

    const handleDrop = (event) => {
        let newClass = selfClass.replace(" hovering-piece", " ");
        setSelfClass(newClass);

        const data = JSON.parse(event.dataTransfer.getData('text/plain'));
        const droppedPiece = data.carriedPiece;
        const sourceSquare = data.source;
        onPieceMoved(sourceSquare, position, droppedPiece);
    }

    return (
    <div className={selfClass}
        style={style}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
    >
        <Piece piece={piece} position={position} />
    </div>
    );
}

export default Square;