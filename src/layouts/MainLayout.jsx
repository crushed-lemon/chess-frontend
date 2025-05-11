import React from 'react';
import { Outlet } from "react-router-dom";
import './MainLayout.css';
import { useAuth } from "react-oidc-context";

const MainLayout = () => {
  const auth = useAuth();

  function getButton() {
      if (auth.isLoading) {
          return <div>Loading...</div>;
      } else if (auth.error) {
          return <div>Encountering error... {auth.error.message}</div>;
      } else if (auth.isAuthenticated) {
          return <button onClick={() => auth.removeUser()}>Hello {auth.user?.profile.email}</button>;
      } else {
          return <button onClick={() => auth.signinRedirect()}>Sign in</button>;
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