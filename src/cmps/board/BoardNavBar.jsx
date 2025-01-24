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
import { getSvg } from '../../services/util.service'

const SvgIcon = ({ iconName, options }) => {
  return (
    <i
      dangerouslySetInnerHTML={{ __html: getSvg(iconName, options) }}
      style={{
        display: 'flex',
        opacity: 0.75,
        height: 17,
        width: 17,
        alignItems: 'center',
        pointerEvents: 'none', // So clicking directly on the SVG won't create an ugly black background
      }}
    ></i>
  )
}

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
          className="border-nav-bar-menu"
          id="basic-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
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
          id="basic-menu"
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
      className="BoardNavBar"
      sx={{
        width: '100%',
        borderBottom: '1px solid #e0e0e0',
        height: '30px',
        display: 'flex',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="tabs"
          variant="scrollable"
          TabIndicatorProps={{
            sx: {
              height: '2px',
              bottom: 9.5,
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
                  className={'BoardNavBar_text'}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px',
                  }}
                >
                  {/* the icon for the first tab */}
                  {tab.value === 1 && <SvgIcon iconName={'sidebar_home'} />}
                  {tab.label}
                  {/* show menu if tab selected */}
                  {value === tab.value && <ThreeDotsMenu />}
                </Box>
              }
              sx={{
                textTransform: 'none',
                padding: '4px 12px',
                minHeight: '10px',
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
            bottom: 7,
            '&:hover': {
              backgroundColor: '#eaeefb',
            },
          }}
        >
          <AddIcon className="BoardNavBar_add-icon" sx={{ fontSize: '15px' }} />
        </IconButton>
      </Box>
    </Box>
  )
}
