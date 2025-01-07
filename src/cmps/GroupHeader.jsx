import { SuggestedActions } from "./SuggestedActions";
import {ContentEditable} from "./react-content-editable";
export function GroupHeader(){
return (
    <>
     
     {/* suggested actions - dynamic cmp */}
        <SuggestedActions event={event}/>
     {/* collapse button */}
        <button onClick={onToggleCollapse}></button>
     {/* group title - contentEditable TODO - UNDERSTAND IT  */}
        <ContentEditable />
     {/* items count */}
        <span>{itemsCount} items</span>

    </>
)
}