

function Piece({piece, position}) {

    const image = {
        'p' : 'pawn2',
        'P' : 'pawn1',
        'r' : 'rook2'
    }

    function handleDragStart(e) {
        //console.log(fromRow + ", " + fromCol);
        const data = JSON.stringify({carriedPiece: piece, source: position});
        e.dataTransfer.setData('text/plain', data);
    }

    if (piece === 'X') {
        return <></>;
    }
    if (piece === 'p' || piece === 'P' || piece === 'r') {
        const imgSrc = `${process.env.PUBLIC_URL}/assets/${image[piece]}.svg`;
        return (
            <img
                 src={imgSrc}
                 alt={piece}
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