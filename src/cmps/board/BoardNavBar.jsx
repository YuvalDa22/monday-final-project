import { useState } from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import AddIcon from '@mui/icons-material/Add'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'

export function BoardNavBar() {
  const [value, setValue] = useState(1)
  const [tabs, setTabs] = useState([
    { value: 1, label: 'Main Table' },
    { value: 2, label: 'Item 2' },
    { value: 3, label: 'Item 3' },
  ])

  // Handle tab change
  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  // Handle adding new tabs
  const handleAddTab = () => {
    setTabs((prev) => {
      const nextValue = prev.length + 1
      const nextLabel = `Item ${prev.length + 1}`
      return [...prev, { value: nextValue, label: nextLabel }]
    })
  }

  // The three dots menu each item has
  const ThreeDotsMenu = () => {
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget) // Attach to the button clicked
    }

    const handleClose = () => {
      setAnchorEl(null) // Close menu
    }
    return (
      <>
        <span
          id='basic-button'
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup='true'
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
          style={{
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            padding: '2px',
            minWidth: 0,
            minHeight: 0,
          }}
        >
          <MoreHorizIcon sx={{ opacity: '0.55', scale: 0.7 }} />
        </span>

        <Menu
          id='basic-menu'
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          <MenuItem onClick={handleClose}>משהו</MenuItem>
          <Divider />
          <MenuItem onClick={handleClose}>עוד משהו</MenuItem>
        </Menu>
      </>
    )
  }

  return (
    <Box
      sx={{
        width: '100%',
        borderBottom: '1px solid #e0e0e0',
        display: 'flex',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label='tabs'
          variant='scrollable'
          TabIndicatorProps={{
            sx: {
              height: '2px',
              backgroundColor: '#1976d2',
            },
          }}
        >
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              value={tab.value}
              label={
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {/* the icon for the first tab */}
                  {tab.value === 1 && (
                    <HomeOutlinedIcon sx={{ opacity: '0.55' }} />
                  )}
                  {tab.label}
                  {/* show menu if tab selected */}
                  {value === tab.value && <ThreeDotsMenu />}
                </Box>
              }
              sx={{
                textTransform: 'none',
                padding: '4px 12px',
                minHeight: '32px',
                lineHeight: '2.7',
                '&:hover': {
                  backgroundColor: '#eaeefb',
                  borderRadius: '5px',
                },
              }}
            />
          ))}
        </Tabs>

        <IconButton
          onClick={handleAddTab}
          sx={{
            padding: '6px',
            borderRadius: '5px',
            marginLeft: '8px',
            '&:hover': {
              backgroundColor: '#eaeefb',
            },
          }}
        >
          <AddIcon sx={{ fontSize: '15px', opacity: 0.6 }} />
        </IconButton>
      </Box>
    </Box>
  )
}
