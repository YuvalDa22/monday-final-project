import { useState } from 'react'
import { Button, IconButton, Menu, MenuItem } from '@mui/material'
import { ArrowDropDown } from '@mui/icons-material'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import Stack from '@mui/material/Stack'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined'
import ImportExportOutlinedIcon from '@mui/icons-material/ImportExportOutlined'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
import BentoOutlinedIcon from '@mui/icons-material/BentoOutlined'

export function BoardActionsBar() {
  const [anchorEl, setAnchorEl] = useState(null)
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget)
  const handleMenuClose = () => setAnchorEl(null)
  return (
    <Stack direction={'row'} spacing={'25px'}>
      <Button
        variant='contained'
        endIcon={<ArrowDropDown sx={{ fill: 'white' }} />} // Updated to use MUI's sx prop
        onClick={handleMenuOpen}
        className='new-task-button'
        sx={{ textTransform: 'none', padding: '5px 10px', fontSize: '15px' }}
      >
        New task
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>option1</MenuItem>
        <MenuItem onClick={handleMenuClose}>option2</MenuItem>
      </Menu>
      <IconButton sx={{ borderRadius: '5px', fontSize: '18px' }}>
        <SearchOutlinedIcon sx={{ opacity: 0.6 }} />
        Search
      </IconButton>
      <IconButton sx={{ borderRadius: '5px', fontSize: '18px' }}>
        <AccountCircleOutlinedIcon sx={{ opacity: 0.6, marginRight: '8px' }} />
        Person
      </IconButton>
      <IconButton sx={{ borderRadius: '5px', fontSize: '18px' }}>
        <FilterAltOutlinedIcon sx={{ opacity: 0.6, marginRight: '8px' }} />
        Filter
      </IconButton>
      <IconButton sx={{ borderRadius: '5px', fontSize: '18px' }}>
        <ImportExportOutlinedIcon sx={{ opacity: 0.6, marginRight: '8px' }} />
        Sort
      </IconButton>
      <IconButton sx={{ borderRadius: '5px', fontSize: '18px' }}>
        <VisibilityOffOutlinedIcon sx={{ opacity: 0.6, marginRight: '8px' }} />
        Hide
      </IconButton>
      <IconButton sx={{ borderRadius: '5px', fontSize: '18px' }}>
        <BentoOutlinedIcon sx={{ opacity: 0.6, marginRight: '8px' }} />
        Group by
      </IconButton>
    </Stack>
  )
}
