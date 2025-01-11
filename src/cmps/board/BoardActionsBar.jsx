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
import { getSvg } from '../../services/util.service'

const SvgIcon = ({ iconName, options }) => {
  return <i dangerouslySetInnerHTML={{ __html: getSvg(iconName, options) }}></i>
}
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
        <SvgIcon iconName={'boardActionsBar_search'} />
        Search
      </IconButton>
      <IconButton sx={{ borderRadius: '5px', fontSize: '18px' }}>
        <SvgIcon iconName={'boardActionsBar_person'} />
        Person
      </IconButton>
      <IconButton sx={{ borderRadius: '5px', fontSize: '18px' }}>
        <SvgIcon iconName={'boardActionsBar_filter'} />
        Filter
      </IconButton>
      <IconButton sx={{ borderRadius: '5px', fontSize: '18px' }}>
        <SvgIcon iconName={'boardActionsBar_sort'} />
        Sort
      </IconButton>
      <IconButton sx={{ borderRadius: '5px', fontSize: '18px' }}>
        <SvgIcon iconName={'boardActionsBar_hide'} />
        Hide
      </IconButton>
      <IconButton sx={{ borderRadius: '5px', fontSize: '18px' }}>
        <SvgIcon iconName={'boardActionsBar_groupBy'} />
        Group by
      </IconButton>
    </Stack>
  )
}
