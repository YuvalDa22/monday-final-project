import { useState } from 'react'
import { SuggestedActions } from '../SuggestedActions.jsx'
// import { ContentEditable } from "./react-content-editable";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
export function GroupHeader({ group }) {
  const [isRotated, setIsRotated] = useState(false)

  // Toggle the rotation state when the icon is clicked
  const handleClick = () => {
    setIsRotated(!isRotated)
  }

  {
    /* TODO: Maybe remove all the inline styles ? not entirely necesarry tho */
  }

  return (
    <div className='gh-main-container' style={{ alignItems: 'baseline' }}>
      <SuggestedActions />
      <div onClick={handleClick} style={{ cursor: 'pointer' }}>
        {/* TODO: Implement expand/collapse logic to the group */}
        <ExpandMoreIcon
          style={{
            transition: 'transform 0.3s ease',
            transform: isRotated ? 'rotate(-90deg)' : 'rotate(0deg)',
            fontSize: '24px',
            marginRight: '10px',
            position: 'relative',
            top: '4',
          }}
        />
      </div>
      {/* group title - contentEditable TODO - UNDERSTAND IT  */}
      {/*TODO: make it <ContentEditable> */}
      <h2 style={{ marginRight: 8 }}>{group.title}</h2>{' '}
      <span className='gh-how-many-tasks'>{group.tasks.length} Tasks</span>
    </div>
  )
}
