// Sidebar.jsx
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Divider } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getSvg } from '../../services/util.service';
import {
  Button,
  ButtonGroup,
  IconButton as MuiIconButton,
  Stack as MuiStack,
} from '@mui/material';
import { showErrorMsg, showSuccessMsg } from '../../services/event-bus.service';
import React, { useState, useEffect } from 'react';
import { DropdownMenu } from 'radix-ui';
import {
  addBoard,
  getAllBoardsTitle,
  removeBoard,
} from '../../store/board/board.actions';
import { useSelector } from 'react-redux'

const SvgIcon = ({
  iconName,
  options = { height: '17', width: '17', color: 'currentColor' },
}) => {
  return (
    <i
      className={`${iconName}`} // to fix annoying icons not being in the center
      dangerouslySetInnerHTML={{ __html: getSvg(iconName, options) }}
      style={{
        pointerEvents: 'none',
      }}
    ></i>
  ); // So clicking directly on the SVG won't create an ugly black background
};

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation(); // Get current route
  const match = location.pathname.match(/\/workspace\/board\/([^/]+)/); // since SideBar isn't inside <Route> in RootCmp we can't use useParams
  const boardId = match ? match[1] : null;
  const [allBoardsTitle, setAllBoardsTitle] = useState([]);
  const { boards } = useSelector((storeState) => storeState.boardModule)

  
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const handleClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  useEffect(() => {
    fetchBoardsTitle();
  }, [boards]);

  const fetchBoardsTitle = async () => {
    try {
      const allTitles = await getAllBoardsTitle();
      setAllBoardsTitle(allTitles);
    } catch (err) {
      console.log(`couldn't get or set titles`, err);
      throw err;
    }
  };

  async function onAddBoard() {
    try {
      const addedBoard = await addBoard();
      showSuccessMsg('Board added successfully');
      setAllBoardsTitle((prevBoards) => [
        ...prevBoards,
        { id: addedBoard._id, title: addedBoard.title },
      ]);
    } catch (err) {
      showErrorMsg(`Couldn't add board, please try again.`);
    }
  }

  async function handleRemoveBoard(boardId){
    try {
      removeBoard(boardId)
      showSuccessMsg(`Board removed successfully`)
    } catch (err) {
      showErrorMsg(`Couldn't remove board, please try again`)
      console.log(err)
    } finally {
      handleMenuClose()
    }
  }

  return (
    <div className="sidebar">
      {/* Navigation Links */}
      <ul className="sidebar-links">
        <Link to="/workspace" style={{ all: 'unset' }}>
          <li
            className={`sidebar-item ${
              location.pathname === '/workspace' ? 'active' : ''
            }`}
          >
            <SvgIcon iconName={'sidebar_home'} />{' '}
            <span className="textInSidebar">Home</span>
          </li>
        </Link>

        <li
          className={`sidebar-item ${
            location.pathname.includes('/workspace/myWork') ? 'active' : ''
          }`}
        >
          <SvgIcon iconName={'sidebar_myWork'} />{' '}
          <span className="textInSidebar">My work</span>
        </li>
      </ul>
      <Divider className="divider" />
      <ul className="sidebar-links">
        <li className="sidebar-item">
          <SvgIcon iconName="sidebar_favorites" />
          <span
            className="textInSidebar"
            style={{ position: 'relative', right: 2 }}
          >
            Favorites
          </span>
        </li>
      </ul>
      <Divider className="divider" />
      <ul className="sidebar-links">
        <li
          className={`sidebar-item ${
            location.pathname.includes('/workspace/workspaces') ? 'active' : ''
          }`}
        >
          <SvgIcon iconName={'sidebar_workspaces'} />
          <span className="textInSidebar">Workspaces</span>
        </li>
      </ul>
      {/* Workspace Section */}
      <div className="workspace-section">
        <ul className="workspace-links">
          {/*obj looks like this {id: XXX , title: YYY} */}
          {allBoardsTitle.map((obj) => {
            return (
              <div
                key={obj.id}
                onClick={() => {
                  navigate(`/workspace/board/${obj.id}`);
                  window.location.reload(); // Forces a refresh
                }}
              >
                <li
                  className={`workspace-item ${
                    boardId === obj.id ? 'active' : ''
                  }`}
                >
                  <SvgIcon iconName={'sidebar_workspace_projectIcon'} />
                  <span className="textInSidebar">{obj.title}</span>
                  <Button
                    id="basic-button"
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={(event)=> event.preventDefault() }
                    sx={{
                      color: 'rgb(50, 51, 56)',
                      padding: 0,
                      minWidth: '0px',
                      marginLeft: 'auto',
                      color: 'transparent',
                      '&:hover': {
                        color: '#323338',
                      },
                    }}
                  >
                    <MoreHorizIcon
                      className="more-actions-icon"
                      sx={{
                        height: '20px',
                        width: '20px',
                      }}
                      onClick={handleClick}
                    />
                  </Button>
                  <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleMenuClose}
                    MenuListProps={{
                      'aria-labelledby': 'basic-button',
                    }}
                  >
                    <MenuItem
                      onClick={(event) => {
                        event.preventDefault(); 
                        event.stopPropagation(); 
                        handleRemoveBoard(obj.id);
                      }}
                    >
                      Remove Board
                    </MenuItem>
                  </Menu>
                </li>
              </div>
            );
          })}
        </ul>
      </div>
      <Divider className="divider" />
      <ul className="sidebar-links">
        <li className="sidebar-item">
          <ButtonGroup 
          onClick={(event)=> event.preventDefault() }
          variant="contained" 
          className="new-board-buttons"
          sx={{
            width: '100%',
            height: '100%',
            p: 0,
            gap: 0,
          }}
          >
            <Button 
            onClick={onAddBoard} 
            className="add-board-button"
            style={{
              width: '100%',
              height: '100%',
            }}
            >
              Add New Board
            </Button>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <Button className="dropdown-button"
                
                >
                  <SvgIcon
                    className="add-item"
                    iconName="sidebar_add_item"
                    options={{
                      height: 22,
                      width: 22,
                      color: '#ffff',
                      position: 'fixed',
                    }}
                  />
                </Button>
              </DropdownMenu.Trigger>
            </DropdownMenu.Root>
          </ButtonGroup>
        </li>
      </ul>
    </div>
  );
}
