
export function getDestinationSquares(board, position, piece) {

    if (!board || board.length !== 64 || !piece) return [];

    const isWhite = piece === piece.toUpperCase();
    const opponentColorCheck = (target) => {
        if (target === "X") return true;
        const isOpponent = isWhite ? target === target.toLowerCase() : target === target.toUpperCase();
        return isOpponent;
    };

    const result = [];
    const rank = Math.floor(position / 8);
    const file = position % 8;

    const directions = {
        N: [-1, 0],
        S: [1, 0],
        E: [0, 1],
        W: [0, -1],
        NE: [-1, 1],
        NW: [-1, -1],
        SE: [1, 1],
        SW: [1, -1],
    };

    const inside = (r, f) => r >= 0 && r < 8 && f >= 0 && f < 8;
    const idx = (r, f) => r * 8 + f;

    const addLineMoves = (dirs) => {
        dirs.forEach(([dr, df]) => {
        let r = rank + dr;
        let f = file + df;
        while (inside(r, f)) {
            const target = board[idx(r, f)];
            if (target === "X") {
            result.push(idx(r, f));
            } else {
            if (opponentColorCheck(target)) result.push(idx(r, f));
            break;
            }
            r += dr;
            f += df;
        }
        });
    };

    const addSingleMoves = (dirs) => {
        dirs.forEach(([dr, df]) => {
        const r = rank + dr;
        const f = file + df;
        if (inside(r, f)) {
            const target = board[idx(r, f)];
            if (target === "X" || opponentColorCheck(target)) result.push(idx(r, f));
        }
        });
    };

    const p = piece.toLowerCase();

    if (p === "p") {
        const dir = isWhite ? 1 : -1;
        const startRank = isWhite ? 1 : 6;

        // forward 1
        if (inside(rank + dir, file) && board[idx(rank + dir, file)] === "X") {
        result.push(idx(rank + dir, file));

        // forward 2
        if (rank === startRank && board[idx(rank + 2 * dir, file)] === "X") {
            result.push(idx(rank + 2 * dir, file));
        }
        }

        // captures
        for (let df of [-1, 1]) {
        const r = rank + dir;
        const f = file + df;
        if (inside(r, f)) {
            const target = board[idx(r, f)];
            if (target !== "X" && opponentColorCheck(target)) result.push(idx(r, f));
        }
        }
    }

    else if (p === "r") {
        addLineMoves([directions.N, directions.S, directions.E, directions.W]);
    }

    else if (p === "b") {
        addLineMoves([directions.NE, directions.NW, directions.SE, directions.SW]);
    }

    else if (p === "q") {
        addLineMoves(Object.values(directions));
    }

    else if (p === "n") {
        const knightMoves = [
        [-2, -1], [-2, 1],
        [-1, -2], [-1, 2],
        [1, -2], [1, 2],
        [2, -1], [2, 1]
        ];
        addSingleMoves(knightMoves);
    }

    else if (p === "k") {
        addSingleMoves(Object.values(directions));
    }

    return result;

}
