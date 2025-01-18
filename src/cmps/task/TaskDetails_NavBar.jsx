import { useState } from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import AddIcon from '@mui/icons-material/Add'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import GridViewIcon from '@mui/icons-material/GridView'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import { getSvg } from '../../services/util.service'
import { TabContext, TabPanel } from '@mui/lab'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import ListIcon from '@mui/icons-material/List'
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'

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
      }}
    ></i>
  )
}

export function TaskDetails_NavBar() {
  const [value, setValue] = useState('1')
  const [tabs, setTabs] = useState([
    { value: '1', label: 'Updates / 1' },
    { value: '2', label: 'Files' },
    { value: '3', label: 'Activity Log' },
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
          <MenuItem onClick={handleClose}>Option 1</MenuItem>
          <Divider />
          <MenuItem onClick={handleClose}>Option 2</MenuItem>
        </Menu>
      </>
    )
  }

  // For the comments in 'Update' tab
  const [inputValue, setInputValue] = useState('')
  const handleInputChange = (event) => {
    setInputValue(event.target.value)
  }

  return (
    <TabContext value={value}>
      <Box
        sx={{
          width: '100%',
          borderBottom: '1px solid rgb(174, 174, 174)',
          display: 'flex',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: -1 }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label='tabs'
            variant='scrollable'
            TabIndicatorProps={{
              sx: {
                height: '2px',
                backgroundColor: '#1976d2',
                bottom: 8,
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
                      gap: '3px',
                      opacity: 0.8,
                    }}
                  >
                    {/* the icon for the first tab */}
                    {tab.value === '1' && <SvgIcon iconName={'sidebar_home'} />}
                    {tab.label}
                    {/* show menu if tab selected */}
                    {value === tab.value && <ThreeDotsMenu />}
                  </Box>
                }
                sx={{
                  textTransform: 'none',
                  padding: '4px 12px',
                  minHeight: '32px',

                  '&:hover': {
                    backgroundColor: '#eaeefb',
                    borderRadius: '5px',
                  },
                }}
              />
            ))}
          </Tabs>
        </Box>
      </Box>
      <TabPanel value='1'>
        {' '}
        <Box
          sx={{
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '2px',
            position: 'relative',
          }}
        >
          <TextField
            multiline
            rows={8}
            fullWidth
            variant='standard'
            value={inputValue} // Use renamed state here
            onChange={handleInputChange}
            placeholder='Write a comment about this task...'
            slotProps={{
              input: {
                disableUnderline: true,
                sx: {
                  padding: '8px',
                  fontSize: '14px',
                },
              },
            }}
            sx={{
              backgroundColor: '#fff',
            }}
          />
          <Button
            variant='contained'
            color='primary'
            sx={{
              textTransform: 'none',
              position: 'absolute',
              bottom: '10px',
              right: '10px',
              padding: '5px 10px',
            }}
            onClick={() => console.log('Submitted text:', inputValue)} // just logging for now
          >
            Update
          </Button>
        </Box>
      </TabPanel>
      <TabPanel value='2'>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              marginBottom: '24px',
            }}
          >
            <Button
              variant='outlined'
              startIcon={<AddIcon />}
              sx={{
                color: 'black',
                textTransform: 'none',
                fontSize: '14px',
                borderColor: 'rgb(193, 193, 193)',
              }}
            >
              Add file
            </Button>
            <TextField
              variant='outlined'
              size='small'
              placeholder='Search for files'
              sx={{
                width: '220px',
              }}
            />
            <Box>
              <IconButton>
                <GridViewIcon />
              </IconButton>
              <IconButton>
                <ListIcon />
              </IconButton>
              <IconButton>
                <FileDownloadOutlinedIcon />
              </IconButton>
            </Box>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              marginBottom: '24px',
            }}
          >
            <Box
              sx={{
                width: '300px',
                height: '200px',
                marginTop: 15,
                backgroundImage:
                  'url("https://cdn.monday.com/images/files-gallery/empty-state-v2.svg")',
                backgroundSize: 'cover',
              }}
            />
            <Typography variant='h7' fontWeight='bold'>
              Drag & drop or add files here
            </Typography>
            <Typography variant='h7' color='gray' sx={{ fontSize: 13 }}>
              Upload, comment and review all files in this item to easily
              collaborate in context
            </Typography>
          </Box>
          <Button
            variant='contained'
            sx={{
              textTransform: 'none',
              fontSize: '15px',
              padding: '6px 16px',
            }}
          >
            + Add file
          </Button>
        </Box>
      </TabPanel>
      <TabPanel value='3'>
        <h2>Not yet implemented</h2>
      </TabPanel>
    </TabContext>
  )
}
