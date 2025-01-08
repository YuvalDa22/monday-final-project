import { useNavigate } from "react-router"
import { login, signup } from "../store/user/user.actions";
import { useState } from "react";
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service";
import { AppHeader } from "../cmps/layout/AppHeader";
import { Link } from "react-router-dom";
import { ImgUploader } from "../cmps/ImgUploader";


export function SignUp() {

    const [user, setUser] = useState({})
    const navigate = useNavigate()




    function handleChange(event) {
        const { name, value } = event.target;
        setUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    }
    async function handleSubmit(e) {
        e.preventDefault();

        try {
            signup(user)
            showSuccessMsg('made a new account')
            navigate('/index')
        }
        catch (err) {
            showErrorMsg('something went wrong')
            console.log(err)
        }
    }

    function onUploaded(imgUrl) {
        setUser(prevCredentials => ({ ...prevCredentials, imgUrl }))
    }

    return (
        <>
            <AppHeader />
            <div className="container">
                <h1>Sign Up Now!</h1>
                <form className="login-form " onSubmit={handleSubmit}>
                    <div className="form-section">

                        <input
                            type="email"
                            name="email"
                            onChange={handleChange}
                            placeholder="Email-adress"
                        />
                    </div>
                    <div className="form-section">

                        <input
                            type="text"
                            name="fullName"
                            onChange={handleChange}
                            placeholder="Full Name"
                        />
                    </div>
                    <div className="form-section">

                        <input
                            type="password"
                            name="password"
                            onChange={handleChange}
                            placeholder="Password"
                        />
                    </div>
                    <button type="submit">Submit</button>
                    <ImgUploader onUploaded={onUploaded} />

                </form>
                <div>
                    <p>  have an account ? <Link to={'/login'}>Log In</Link > </p>
                </div>
            </div>
        </>
    );
}