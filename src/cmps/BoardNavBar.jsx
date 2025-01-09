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
  const [value, setValue] = useState('one')

  // Handle tab change
  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const handleAddTab = () => {
    // TODO: implement
  }

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <Box
      sx={{
        width: '100%',
        borderBottom: '1px solid #e0e0e0', // the gray underline
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
              // blue line
              height: '2px',
              backgroundColor: '#1976d2',
            },
          }}
        >
          {/* Tab 1 */}
          <Tab
            value='one'
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <HomeOutlinedIcon sx={{ opacity: '0.55' }} />
                Main Table
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
                  <MoreHorizIcon sx={{ opacity: '0.55', scale: 0.7 }} />
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
                  <MenuItem onClick={handleClose}>משהו</MenuItem>
                  <Divider />
                  <MenuItem onClick={handleClose}>עוד משהו</MenuItem>
                </Menu>
              </Box>
            }
            sx={{
              textTransform: 'none',
              padding: '4px 12px', // Reduce padding
              minHeight: '32px', // Compact height
              lineHeight: '2.7', // Align text closer to underline
              '&:hover': {
                backgroundColor: '#eaeefb',
                borderRadius: '5px',
              },
            }}
          />

          {/* Tab 2 */}
          <Tab
            value='two'
            label='Item Two'
            sx={{
              textTransform: 'none',
              padding: '4px 12px',
              minHeight: '32px',
              lineHeight: '1',
              '&:hover': {
                backgroundColor: '#eaeefb',
                borderRadius: '5px',
              },
            }}
          />

          {/* Tab 3 */}
          <Tab
            value='three'
            label='Item Three'
            sx={{
              textTransform: 'none',
              padding: '4px 12px',
              minHeight: '32px',
              lineHeight: '1',
              '&:hover': {
                backgroundColor: '#eaeefb',
                borderRadius: '5px',
              },
            }}
          />
        </Tabs>

        {/* Plus Button - Right next to the tabs */}
        <IconButton
          onClick={handleAddTab}
          sx={{
            padding: '6px',
            borderRadius: '5px',
            marginLeft: '8px',
            '&:hover': {
              backgroundColor: '#eaeefb', // Hover effect
            },
          }}
        >
          <AddIcon sx={{ fontSize: '15px', opacity: 0.6 }} />
        </IconButton>
      </Box>
    </Box>
  )
}
