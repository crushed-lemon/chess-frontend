
import { useState } from "react";

const Home = ({submitUserName}) => {

    const [userName, setUserName] = useState('');

    const submitForm = (e) => {
        e.preventDefault();
        submitUserName(userName);
    }

    return (
            <header className="App-header">

                <h2> Enter your username and start playing! This will be changed to a login-based system soon. </h2>

                <form onSubmit={submitForm}>
                    <p>Enter username : </p>
                    <input type="text"
                    value = {userName}
                     onChange = {(e) => setUserName(e.target.value)}
                     />
                    <button type  = "submit">Enter!</button>
                </form>
            </header>
    )
}

export default Home