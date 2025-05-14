
import React from "react";
import { useLocation } from "react-router-dom";

function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

const domain = process.env.REACT_APP_BACKEND_DOMAIN;
const successful_login_redirect_uri = process.env.REACT_APP_SUCCESSFUL_LOGIN_REDIRECT_URI;

async function submitCode (code) {
    try {
        const response = await fetch(`${domain}/login-callback`, {
            method : "POST",
            headers : {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ code }),
        });
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }
        await response.text();
        // No need to process the response, it only sets the cookie
        window.location.href = successful_login_redirect_uri;
    } catch (ex) {
    }
}

const LoginCallback = () => {

    const query = useQuery();
    const code = query.get("code");

    if(code) {
        submitCode(code);
    }

    return (
        <div>Redirecting...</div>
    );

}

export default LoginCallback;