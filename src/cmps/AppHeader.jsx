import { useNavigate } from "react-router"

import { Link } from "react-router-dom"

export function AppHeader() {


    const naviage = useNavigate()
    return (
        <div className="header-flex">
            <div>

                <img onClick={() => naviage('/')} src="https://agenda.agami-network.com/static/media/agenda-logo-color.cb0ce09dcc5b97c18eb5755c559acc2a.svg" alt="logo" />
                <h2>Friday</h2>

            </div>
            <div>
                <button onClick={() => naviage('/login')}>Log in</button>
                <button>Start Demo</button>
            </div>
        </div>
    )
}