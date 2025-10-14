import './Square.css';
import Piece from './Piece';
import { useEffect, useState } from "react";

function Square({onPieceMoved, onPieceHighlighted, onPiecePlaced, onPieceHighlightCleared, piece, position, style, squareTint, isDestination}) {

    const [selfClass, setSelfClass] = useState(`${squareTint} square`);

    useEffect(() => {
        let newClass = selfClass;
        if(isDestination) {
            newClass = selfClass + " destination";
        } else {
             newClass = selfClass.replace(" destination", " ");
        }
        setSelfClass(newClass);
    }, [squareTint, isDestination, setSelfClass]);

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
        if(sourceSquare!==position) {
            onPieceMoved(sourceSquare, position, droppedPiece);
        } else {
            console.log("Dragged to same square, not generating move event" + sourceSquare);
        }
    }

    const handleClick = (event) => {
        console.log("square clicked");
        if(isDestination === true) {
            onPiecePlaced(position);
        } else {
            if(piece === 'X') {
                onPieceHighlightCleared();
            } else {
                onPieceHighlighted(position, piece);
            }
        }
    }

    if(isDestination) {
        console.log("I am destination at " + position + " my selfclass = " + selfClass);
    }

    return (
    <div className={selfClass}
        style={style}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
    >
        <Piece piece={piece} position={position} onPieceHighlightCleared={onPieceHighlightCleared} />
    </div>
    );
}

export default Square;