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
          return <div>Loading...</div>;
      } else if (identity === null || identity.logged_out) {
          return <button onClick={() => signinRedirect()}>Sign in</button>;
      } else {
          console.log(identity);
          return <button onClick={() => signoutRedirect()}>Hello {identity.email}</button>;
      }
  }

  return (
    <div>
      <header>
        <div className="header">
            <div className = "left-side">
                <h1>Lime Chess!</h1>
            </div>
            <div className = "right-side">
                { getButton() }
            </div>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;