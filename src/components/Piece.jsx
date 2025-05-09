

function Piece({piece, position}) {

    function handleDragStart(e) {
        //console.log(fromRow + ", " + fromCol);
        const data = JSON.stringify({carriedPiece: piece, source: position});
        e.dataTransfer.setData('text/plain', data);
    }

    if (piece == 'X') {
        return <></>;
    }
    if (piece == 'p') {
        return (
            <img
                 src={`${process.env.PUBLIC_URL}/assets/pawn2.svg`}
                 height="70px"
                 draggable={true}
                 onDragStart={(e) => handleDragStart(e)}
               />);
    }

    return (
        <p> { piece } </p>
        );
}

export default Piece;