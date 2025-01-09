import { useState } from 'react'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import { Divider } from '@mui/material'

export function SuggestedActions() {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <div className='sa-main-container'>
      <Button
        id='basic-button'
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup='true'
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        sx={{
          padding: '2px',
          minWidth: 0,
          minHeight: 0,
        }}
      >
        <MoreHorizIcon
          sx={{
            fontSize: 20,
          }}
        />
      </Button>
      <Menu
        id='basic-menu'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleClose}>Remove Group</MenuItem>
        <Divider />
        <MenuItem onClick={handleClose}>Remove Task</MenuItem>
        <Divider />
        <MenuItem onClick={handleClose}>Add Label</MenuItem>
        <MenuItem onClick={handleClose}>Remove Label</MenuItem>
      </Menu>
    </div>
  )
}
