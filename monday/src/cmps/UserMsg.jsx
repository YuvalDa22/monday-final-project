import { useEffect, useState } from "react"
import { eventBusService } from "../services/event-bus.service"

export function UserMsg() {
    const [msg, setMsg] = useState(null)

    useEffect(() => {
        eventBusService.on('show-user-msg', msg => {
            setMsg(msg)
            setTimeout(closeMsg, 3000);
        })
    }, [])

    function closeMsg() {
        setMsg(null)
    }

    if (!msg) return <></>
    return (
        <div className={"user-msg " + msg.type}>
            <h4>{msg.txt}</h4>
            <button onClick={closeMsg} className="close-btn">X</button>
        </div>
    )
}
