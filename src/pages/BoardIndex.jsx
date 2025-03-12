import { getSvg } from '../services/util.service'
import { useState, useEffect } from 'react'
import { Box, Card, Avatar, Flex, Text, Button } from '@radix-ui/themes'
import { Theme } from '@radix-ui/themes'
import '@radix-ui/themes/styles.css'
import { Opacity, StarBorderOutlined } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { loadBoards } from '../store/board/board.actions'
import { showErrorMsg } from '../services/event-bus.service'


const SvgIcon = ({ iconName, options, style }) => {
  return <i dangerouslySetInnerHTML={{ __html: getSvg(iconName, options) }} style={style}></i>
}

export function BoardIndex() {
  const [greeting, setGreeting] = useState('')
  const [filterBy, setFilterBy] = useState(null)
  const { boards, isLoading } = useSelector((storeState) => storeState.boardModule)
  const navigate = useNavigate()

  useEffect(() => { 
    console.log(`board index rendered`)
    onloadBoards();   
  }, [])

  const onloadBoards = async() => {
    try{
      await loadBoards(filterBy)
    } catch (err) {
      showErrorMsg(`Sorry, couldn't load boards`, err)
    }
} 

  useEffect(() => {
    // get current time in Israel
    const israelTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Jerusalem' })
    const hours = new Date(israelTime).getHours()
    let newGreeting
    // 5 AM – 11:59 AM → Good morning
    // 12 PM – 5:59 PM → Good afternoon
    // 6 PM – 9:59 PM → Good evening
    // 10 PM – 4:59 AM → Good night
    if (hours >= 5 && hours < 12) {
      newGreeting = 'Good morning'
    } else if (hours >= 12 && hours < 18) {
      newGreeting = 'Good afternoon'
    } else if (hours >= 18 && hours < 22) {
      newGreeting = 'Good evening'
    } else {
      newGreeting = 'Good night'
    }

    setGreeting(newGreeting)
  }, [])



  if (isLoading) return <div>Loading...</div>
  return (
    <Theme asChild>
      {/* for radix ui card (which is custom theme and not a primitive UI item*/}
      <div className='boardIndex_container'>
        <div className='boardIndex_greeting'>
          <div className='greeting_top'>{greeting}, Gal!</div>
          <div className='greeting_bottom'>
            Quickly access your recent boards, Inbox and workspaces
          </div>
        </div>
        <div className='boardIndex_bottom_container'>
          <div className='boardIndex_boards'>
            <div className='boardIndex_title_container'>
              <SvgIcon
                className='arrow-icon'
                iconName='arrow_dropDown'
                style={{ position: 'relative', top: 3 }}
              />
              <span className='boardIndex_title'>Recently visited </span>
            </div>
            <div className='boardIndex_boards_grid_container'>
              {boards.map((board) => (
                <Box
                  key={board._id}
                  style={{
                    backgroundColor: 'white',
                    padding: '10px',
                    height: '240px',
                  }}
                >
                  <Card
                    className='boardIndex_board'
                    onClick={() => {
                      navigate(`/workspace/board/${board._id}`)
                    }}
                  >
                    <Flex direction='column'>
                      <img
                        className='boardIndex_cardImage'
                        src='https://cdn.monday.com/images/quick_search_recent_board2.svg'
                      />
                      <Box style={{ marginTop: '10px' }}>
                        <div className='card_firstRow_container'>
                          <div>
                            <Text
                              as='div'
                              style={{
                                display: 'flex',
                                gap: '6px',
                                fontWeight: 600,
                                fontSize: '15.5px',
                              }}
                            >
                              <SvgIcon iconName='sidebar_workspace_projectIcon' />
                              {board.title}
                            </Text>
                          </div>
                          <SvgIcon iconName='sidebar_favorites' style={{ opacity: '0.7' }} />
                        </div>
                        <Text
                          as='div'
                          size='2'
                          color='gray'
                          style={{ display: 'flex', gap: '6px' }}
                        >
                          <SvgIcon iconName='monday_flower_icon' />
                          <span style={{ position: 'relative', bottom: 2 }}>
                            work management {'>'} Main workspace
                          </span>
                        </Text>
                      </Box>
                    </Flex>
                  </Card>
                </Box>
              ))}
            </div>
          </div>
          <div className='boardIndex_sidemenu'>
            <Box
              style={{
                backgroundColor: 'white',
                padding: '10px',
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
                borderRadius: '8px',
              }}
            >
              <Flex direction='column'>
                <img
                  className='bi_sidemenu_image'
                  src='https://cdn.monday.com/images/homepage-desktop/templates-banner.png'
                />
                <Box style={{ marginTop: '10px' }}>
                  <Text as='div' size='3' style={{ display: 'flex', gap: '6px', opacity: '0.9' }}>
                    <span style={{ position: 'relative', bottom: 2, left: 3 }}>
                      Boost your workflow in minutes with ready-made templates
                    </span>{' '}
                  </Text>
                  <Flex justify='center' mt='3'>
                    {' '}
                    {/* Centering the button */}
                    <Button
                      style={{
                        width: '100%',
                        padding: '22px 0px',
                        color: 'black',
                        fontWeight: '400',
                        opacity: '1',
                      }}
                      color='gray'
                      variant='outline'
                    >
                      Explore templates
                    </Button>
                  </Flex>
                </Box>
              </Flex>
            </Box>
            <span className='learnAndgetInspired'>Learn & get inspired</span>
            <Box
              style={{
                backgroundColor: 'white',
                padding: '10px',
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
                borderRadius: '8px',
              }}
            >
              <Flex direction='row' gap='3' style={{ padding: 5 }}>
                <img
                  src='https://cdn.monday.com/images/learning-center/get-started-2.svg'
                  width={'45px'}
                  style={{ borderRadius: '10px' }}
                />
                <Box style={{ alignContent: 'center' }}>
                  <div className='card_firstRow_container'>
                    <div>
                      <Text
                        as='div'
                        style={{
                          fontWeight: 600,
                          fontSize: '13.5px',
                          opacity: 0.85,
                        }}
                      >
                        Getting started
                      </Text>
                    </div>
                  </div>
                  <Text as='div' size='2' color='gray'>
                    <span>Learn how monday.com works</span>
                  </Text>
                </Box>
              </Flex>
            </Box>
            <Box
              style={{
                backgroundColor: 'white',
                padding: '10px',
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
                borderRadius: '8px',
              }}
            >
              <Flex direction='row' gap='3' style={{ padding: 5 }}>
                <img
                  src='https://cdn.monday.com/images/learning-center/help-center.svg'
                  width={'45px'}
                  style={{ borderRadius: '10px' }}
                />
                <Box style={{ alignContent: 'center' }}>
                  <div className='card_firstRow_container'>
                    <div>
                      <Text
                        as='div'
                        style={{
                          fontWeight: 600,
                          fontSize: '13.5px',
                          opacity: 0.85,
                        }}
                      >
                        Help center
                      </Text>
                    </div>
                  </div>
                  <Text as='div' size='2' color='gray'>
                    <span>Learn and get support</span>
                  </Text>
                </Box>
              </Flex>
            </Box>
          </div>
        </div>
      </div>
    </Theme>
  )
}

//
