import Stack from '@mui/material/Stack'
import IconButton from '@mui/material/IconButton'
import { getSvg } from '../../services/util.service'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import LoopIcon from '@mui/icons-material/Loop'
import Avatar from '@mui/material/Avatar'
import { Tooltip } from 'radix-ui'
import { useNavigate, useParams } from 'react-router-dom'

const SvgIcon = ({ iconName, options, customStyle }) => {
  return (
    <i
      dangerouslySetInnerHTML={{ __html: getSvg(iconName, options) }}
      style={customStyle || { display: 'flex', opacity: 0.65 }}
    ></i>
  )
}

export function AdditionalBoardActions() {
  const navigate = useNavigate()
  const { boardId } = useParams()
  return (
    <Stack direction={'row'} gap={'10px'} style={{ display: 'flex', alignItems: 'center' }}>
      <IconButton sx={{ borderRadius: '5px', fontSize: '15px', gap: 1 }}>
        <SvgIcon
          iconName={'additionalBoardActions_integrate'}
          options={{ height: 20, width: 20 }}
        />
        <span>Integrate</span>
      </IconButton>
      <IconButton sx={{ borderRadius: '5px', fontSize: '15px', gap: 1 }}>
        <SvgIcon iconName={'additionalBoardActions_automate'} options={{ height: 20, width: 20 }} />
        <span>Automate / 1</span>
      </IconButton>
      <IconButton sx={{ borderRadius: '5px', fontSize: '15px', gap: 1 }}>
        <SvgIcon
          iconName={'additionalBoardActions_discussion'}
          options={{ height: 20, width: 20 }}
        />
      </IconButton>
      <Tooltip.Provider>
        <Tooltip.Root delayDuration={0}>
          <Tooltip.Trigger asChild>
            <div
              className='navbar-avatar-container'
              onClick={() => navigate(`/workspace/board/${boardId}/activity_log`)}
            >
              <Avatar
                className='navbar-avatar'
                alt='User Avatar'
                src='https://cdn1.monday.com/dapulse_default_photo.png'
                sx={{ width: 28, height: 28, marginLeft: 0, marginRight: 0 }}
              />
            </div>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content side='bottom' className='TooltipContent' sideOffset={5}>
              View activity log
              <Tooltip.Arrow className='TooltipArrow' />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>

      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          border: '1px solid rgb(164, 164, 164)',
          borderRadius: '4px',
          opacity: 0.77,
        }}
      >
        <Button
          variant='text'
          sx={{
            padding: '0px 6px',
            textTransform: 'none',
            color: '#3f51b5',
            fontSize: '14px',
            borderRadius: 0,
          }}
        >
          <span className='additionalBoardActions_invite'>Invite / 1</span>
        </Button>

        <Divider
          orientation='vertical'
          flexItem
          sx={{
            borderColor: 'rgb(164, 164, 164)',
            borderWidth: '1px',
            opacity: 0.77,
          }}
        />

        <IconButton
          sx={{
            padding: '6px',
            color: '#3f51b5',
            borderRadius: 0,
          }}
        >
          <SvgIcon
            iconName={'additionalBoardActions_copyLink'}
            options={{ height: 22, width: 22 }}
            customStyle={{ display: 'flex', opacity: 1 }}
          />
        </IconButton>
      </Box>
      <IconButton sx={{ borderRadius: '5px', fontSize: '15px', gap: 1 }}>
        <SvgIcon
          iconName={'additionalBoardActions_dots'}
          options={{ height: 16, width: 16 }}
          customStyle={{ display: 'flex', opacity: 1 }}
        />
      </IconButton>
    </Stack>
  )
}
