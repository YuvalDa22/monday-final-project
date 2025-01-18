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
      style={{ display: 'flex', opacity: 0.6 }}
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
      spacing={'15px'}
      style={{ display: 'flex', alignItems: 'center' }}
    >
      <Button
        variant='contained'
        endIcon={<ArrowDropDown sx={{ fill: 'white' }} />} // Updated to use MUI's sx prop
        onClick={handleMenuOpen}
        className='new-task-button'
        sx={{ textTransform: 'none', padding: '5px 12px', fontSize: '15px' }}
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
          fontSize: '15px',
          gap: 0.5,
          opacity: 1,
        }}
      >
        <SearchOutlinedIcon style={{ opacity: 1, height: 22, width: 22 }} />
        Search
      </IconButton>
      <IconButton sx={{ borderRadius: '5px', fontSize: '15px', gap: 1 }}>
        <SvgIcon
          iconName={'boardActionsBar_person'}
          options={{ height: 22, width: 22 }}
        />
        Person
      </IconButton>
      <IconButton sx={{ borderRadius: '5px', fontSize: '15px', gap: 1 }}>
        <SvgIcon
          iconName={'boardActionsBar_filter'}
          options={{ height: 22, width: 22 }}
        />
        Filter
      </IconButton>
      <IconButton sx={{ borderRadius: '5px', fontSize: '15px', gap: 1 }}>
        <SvgIcon
          iconName={'boardActionsBar_sort'}
          options={{ height: 22, width: 22 }}
        />
        Sort
      </IconButton>
      <IconButton sx={{ borderRadius: '5px', fontSize: '15px', gap: 1 }}>
        <SvgIcon
          iconName={'boardActionsBar_hide'}
          options={{ height: 22, width: 22 }}
        />
        Hide
      </IconButton>
      <IconButton sx={{ borderRadius: '5px', fontSize: '15px', gap: 1 }}>
        <SvgIcon
          iconName={'boardActionsBar_groupBy'}
          options={{ height: 17, width: 17 }}
        />
        Group by
      </IconButton>
    </Stack>
  )
}
