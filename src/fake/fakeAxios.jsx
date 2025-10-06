
const fakeAxios = {
    get : (url) => {
        if(url === 'lobby-requests') {
            const response = {
                data : {
                    lobby : false
                }
            }

            return Promise.resolve(response);
        }
        if(url === 'game-requests') {
            const response = {
                data : null,
                data2 : {
                    username : "giri",
                    gameId : "bcbbe0b0-536e-48ab-9d20-985ffa774f9d",
                    color : "BLACK"
                }
            }
            return Promise.resolve(response);
        }
        if(url === "game") {
            const response = {
                data : {
                    board : "RNBQKBNRPPPPPXPPXXXXPXXXXXXXXXXXXXXXXXXqXXXXXXXXpppppppprnbXkbnr"
                }
            }
            return Promise.resolve(response);
        }
    }
}

export {fakeAxios}
