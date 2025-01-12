import { useState } from 'react'
import { Button, IconButton, Menu, MenuItem } from '@mui/material'
import { ArrowDropDown } from '@mui/icons-material'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import Stack from '@mui/material/Stack'

import { getSvg } from '../../services/util.service'

const SvgIcon = ({ iconName, options }) => {
  return (
    <i
      dangerouslySetInnerHTML={{ __html: getSvg(iconName, options) }}
      style={{ display: 'flex', opacity: 0.62 }}
    ></i>
  )
}

export function BoardActionsBar() {
  const [anchorEl, setAnchorEl] = useState(null)
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget)
  const handleMenuClose = () => setAnchorEl(null)
  return (
    <Stack
      direction={'row'}
      spacing={'25px'}
      style={{ display: 'flex', alignItems: 'center' }}
    >
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
      <IconButton
        sx={{
          borderRadius: '5px',
          fontSize: '18px',
          gap: 1,
        }}
      >
        <SearchOutlinedIcon style={{ opacity: 0.62, height: 20, width: 20 }} />
        Search
      </IconButton>
      <IconButton sx={{ borderRadius: '5px', fontSize: '18px', gap: 1 }}>
        <SvgIcon
          iconName={'boardActionsBar_person'}
          options={{ height: 20, width: 20 }}
        />
        Person
      </IconButton>
      <IconButton sx={{ borderRadius: '5px', fontSize: '18px', gap: 1 }}>
        <SvgIcon
          iconName={'boardActionsBar_filter'}
          options={{ height: 20, width: 20 }}
        />
        Filter
      </IconButton>
      <IconButton sx={{ borderRadius: '5px', fontSize: '18px', gap: 1 }}>
        <SvgIcon
          iconName={'boardActionsBar_sort'}
          options={{ height: 20, width: 20 }}
        />
        Sort
      </IconButton>
      <IconButton sx={{ borderRadius: '5px', fontSize: '18px', gap: 1 }}>
        <SvgIcon
          iconName={'boardActionsBar_hide'}
          options={{ height: 20, width: 20 }}
        />
        Hide
      </IconButton>
      <IconButton sx={{ borderRadius: '5px', fontSize: '18px', gap: 1 }}>
        <SvgIcon
          iconName={'boardActionsBar_groupBy'}
          options={{ height: 16, width: 16 }}
        />
        Group by
      </IconButton>
    </Stack>
  )
}
