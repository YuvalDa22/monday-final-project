import { useState } from 'react'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import { Divider } from '@mui/material'
import { removeGroup } from '../store/board/board.actions'

export function SuggestedActions({ board, group, updateFooterGroupRemoved }) {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleMenuClose = () => {
    setAnchorEl(null)
  }
  const handleRemoveGroup = () => {
    updateFooterGroupRemoved(null, group)
    removeGroup(group)
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
          color: 'rgb(50, 51, 56)',
          padding: 0,
          minWidth: '0px',
        }}
      >
        <MoreHorizIcon
          sx={{
            height: '20px',
            width: '20px',
          }}
        />
      </Button>
      <Menu
        id='basic-menu'
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem
          onClick={() => {
            handleRemoveGroup()
          }}
        >
          Remove Group
        </MenuItem>
        {/* <Divider />
        <MenuItem onClick={handleMenuClose}>...</MenuItem> */}
      </Menu>
    </div>
  )
}
