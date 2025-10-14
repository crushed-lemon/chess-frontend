

const background = 't'; // transparent background
const size = 45; // size is 45x45

function Piece({piece, position, onPieceHighlightCleared}) {

    function handleDragStart(e) {
        onPieceHighlightCleared();
        const data = JSON.stringify({carriedPiece: piece, source: position});
        e.dataTransfer.setData('text/plain', data);
    }

    function toImage(piece) {
        const isUpper = piece === piece.toUpperCase();
        const lowerPiece = piece.toLowerCase();

        const colorChar = isUpper ? "l" : "d";

        const filename = `${lowerPiece}${colorChar}${background}${size}.svg`;

        return filename;
    }

    if (piece === 'X') {
        return <></>;
    }
    const imgSrc = `${process.env.PUBLIC_URL}/assets/${toImage(piece)}`;
    return (
        <img
                src={imgSrc}
                alt={piece}
                className="w-[60px] h-[60px]"
                draggable={true}
                onDragStart={(e) => handleDragStart(e)}
            />);
}

export default Piece;