import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const IdentityContext = createContext();

const domain = process.env.REACT_APP_BACKEND_DOMAIN;

export function IdentityProvider({children}) {

    const [identity, setIdentity] = useState(undefined);

    useEffect(() => {
        axios.get(`${domain}/whoami`, { withCredentials: true }) // sends the cookie
              .then(res => setIdentity(res.data))           // identity is returned
              .catch(() => setIdentity(null));
    }, []);

    return (
        <IdentityContext.Provider value = {{ identity, setIdentity }}>
            {children}
        </IdentityContext.Provider>
    );
}

export function useIdentity() {
    return useContext(IdentityContext);
}
