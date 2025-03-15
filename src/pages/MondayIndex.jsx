
import { useSelector } from "react-redux";


export function MondayIndex() {


    const user = useSelector(state => state.userModule.user)


    return (
        <div className="index-container">
            <h1>You Logged In !</h1>
            <h2>{user.fullname || 'no user'}</h2>
            <img src={user.imgUrl} width={'300px'} alt="" />
        </div>
    )
}