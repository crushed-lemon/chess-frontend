import React from 'react';
import { Outlet } from "react-router-dom";
import './MainLayout.css';
// import { useAuth } from "react-oidc-context";
import { useIdentity } from "../provider/IdentityContext";

const MainLayout = () => {
    const { identity } = useIdentity();
    // const auth = useAuth();

    function signinRedirect() {
        window.location.href = "https://eu-north-1m7qbd8uy1.auth.eu-north-1.amazoncognito.com/login?response_type=code&client_id=127nttui414onihc7vrt9dbf8i&redirect_uri=http://localhost:3000/apps/chess/login-callback";
    }

    function signoutRedirect() {
        window.location.href = "https://eu-north-1m7qbd8uy1.auth.eu-north-1.amazoncognito.com/logout?client_id=127nttui414onihc7vrt9dbf8i&logout_uri=http://localhost:3000/apps/chess/logout";
    }

    function getButton() {
        if (identity === undefined) {
            return <div className="text-gray-400 italic">Loading...</div>;
        } else if (identity === null || identity.logged_out) {
            return (
                <button
                    onClick={() => signinRedirect()}
                    className="bg-amber-900 text-amber-100 font-light px-6 py-3 rounded-full shadow-lg hover:bg-amber-700 transition-all text-lg"
                >
                    Sign in
                </button>
            );
        } else {
            return (
                <button
                    onClick={() => signoutRedirect()}
                    className="bg-amber-900 text-amber-100 font-light px-6 py-3 rounded-full shadow-lg hover:bg-amber-700 transition-all text-lg"
                >
                    Hello {identity.email}
                </button>
            );
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-900">
            <header className="bg-gradient-to-r from-gray-900 via-amber-950 to-amber-800 shadow-lg">
                <div className="container mx-auto flex justify-between items-center py-6 px-8">
                    <div className="left-side">
                        <h1
                            className="text-5xl text-amber-100 font-thin tracking-wider"
                            style={{ fontFamily: "'Dancing Script', cursive" }}
                        >
                            Lime Chess!
                        </h1>
                    </div>
                    <div className="right-side">
                        {getButton()}
                    </div>
                </div>
            </header>

            <main className="flex-1 bg-gray-900 p-8 text-amber-100">
                <Outlet />
            </main>
        </div>
    );

};

export default MainLayout;