// Sidebar.jsx
//import React from "react";
import { Divider } from '@mui/material'
import { getSvg } from '../../services/util.service'
import { StarBorderOutlined } from '@mui/icons-material'

const SvgIcon = ({ iconName, options }) => {
  return <i dangerouslySetInnerHTML={{ __html: getSvg(iconName, options) }}></i>
}
// sidebar_home:
// '<svg viewBox="0 0 20 20" fill="currentColor" width="" height="" aria-hidden="true" tabindex="-1" class="icon_a812034417" data-testid="icon"><path d="M9.56992 2.1408C9.82591 1.95307 10.1741 1.95307 10.4301 2.1408L17.7028 7.47413C17.8896 7.61113 18 7.82894 18 8.06061V16.7879C18 17.1895 17.6744 17.5152 17.2727 17.5152H11.9394C11.5377 17.5152 11.2121 17.1895 11.2121 16.7879V13.1515H8.78788V16.7879C8.78788 17.1895 8.46227 17.5152 8.06061 17.5152H2.72727C2.32561 17.5152 2 17.1895 2 16.7879V8.06061C2 7.82894 2.11037 7.61113 2.29719 7.47413L9.56992 2.1408ZM3.45455 8.42914V16.0606H7.33333V12.4242C7.33333 12.0226 7.65894 11.697 8.06061 11.697H11.9394C12.3411 11.697 12.6667 12.0226 12.6667 12.4242V16.0606H16.5455V8.42914L10 3.62914L3.45455 8.42914Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>',
// sidebar_myWork:
// '<svg viewBox="0 0 20 20" fill="currentColor" width="" height="" aria-hidden="true" tabindex="-1" class="icon_a812034417" data-testid="icon"><path d="M5.99986 1.82129C6.41407 1.82129 6.74986 2.15708 6.74986 2.57129V4.10701H13.2499V2.57129C13.2499 2.15708 13.5856 1.82129 13.9999 1.82129C14.4141 1.82129 14.7499 2.15708 14.7499 2.57129V4.107H16.2856C16.7876 4.107 17.269 4.30643 17.624 4.66141C17.979 5.01639 18.1784 5.49784 18.1784 5.99986V16.2856C18.1784 16.7876 17.979 17.269 17.624 17.624C17.269 17.979 16.7876 18.1784 16.2856 18.1784H3.71415C3.21213 18.1784 2.73067 17.979 2.37569 17.624C2.02071 17.269 1.82129 16.7876 1.82129 16.2856V5.99986C1.82129 5.49784 2.02071 5.01639 2.37569 4.66141C2.73067 4.30643 3.21213 4.107 3.71415 4.107C3.763 4.107 3.81077 4.11168 3.85702 4.1206C3.90326 4.11168 3.95102 4.10701 3.99986 4.10701H5.24986V2.57129C5.24986 2.15708 5.58565 1.82129 5.99986 1.82129ZM5.24986 7.14272V5.60701H3.99986C3.95101 5.60701 3.90324 5.60234 3.85699 5.59342C3.81075 5.60233 3.76299 5.607 3.71415 5.607C3.60995 5.607 3.51003 5.64839 3.43635 5.72207C3.36268 5.79574 3.32129 5.89567 3.32129 5.99986V16.2856C3.32129 16.3898 3.36268 16.4897 3.43635 16.5634C3.51003 16.637 3.60995 16.6784 3.71415 16.6784H16.2856C16.3898 16.6784 16.4897 16.637 16.5634 16.5634C16.637 16.4897 16.6784 16.3898 16.6784 16.2856V5.99986C16.6784 5.89567 16.637 5.79574 16.5634 5.72207C16.4897 5.64839 16.3898 5.607 16.2856 5.607H14.7499V7.14272C14.7499 7.55693 14.4141 7.89272 13.9999 7.89272C13.5856 7.89272 13.2499 7.55693 13.2499 7.14272V5.60701H6.74986V7.14272C6.74986 7.55693 6.41407 7.89272 5.99986 7.89272C5.58565 7.89272 5.24986 7.55693 5.24986 7.14272ZM13.4214 9.92231C13.6942 9.61058 13.6626 9.13676 13.3509 8.864C13.0392 8.59124 12.5653 8.62283 12.2926 8.93455L8.75058 12.9825L7.02129 11.6856C6.68992 11.437 6.21982 11.5042 5.97129 11.8356C5.72276 12.1669 5.78992 12.637 6.12129 12.8856L8.407 14.5999C8.72086 14.8353 9.16309 14.789 9.42144 14.4937L13.4214 9.92231Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>',
// sidebar_favorites:
// '<canvas style="vertical-align: top; width: 19px; height: 20px;" width="28" height="30"></canvas>',
// sidebar_workspaces:
// '<svg viewBox="0 0 20 20" fill="currentColor" width="" height="" aria-hidden="true" tabindex="-1" class="icon_a812034417" data-testid="icon"><path d="M3 2.25C2.58579 2.25 2.25 2.58579 2.25 3V8.38462C2.25 8.79883 2.58579 9.13462 3 9.13462H8.38462C8.79883 9.13462 9.13462 8.79883 9.13462 8.38462V3C9.13462 2.58579 8.79883 2.25 8.38462 2.25H3ZM3.75 7.63462V3.75H7.63462V7.63462H3.75ZM11.6154 2.25C11.2012 2.25 10.8654 2.58579 10.8654 3V8.38462C10.8654 8.79883 11.2012 9.13462 11.6154 9.13462H17C17.4142 9.13462 17.75 8.79883 17.75 8.38462V3C17.75 2.58579 17.4142 2.25 17 2.25H11.6154ZM12.3654 7.63462V3.75H16.25V7.63462H12.3654ZM2.25 11.6154C2.25 11.2012 2.58579 10.8654 3 10.8654H8.38462C8.79883 10.8654 9.13462 11.2012 9.13462 11.6154V17C9.13462 17.4142 8.79883 17.75 8.38462 17.75H3C2.58579 17.75 2.25 17.4142 2.25 17V11.6154ZM3.75 12.3654V16.25H7.63462V12.3654H3.75ZM11.6154 10.8654C11.2012 10.8654 10.8654 11.2012 10.8654 11.6154V17C10.8654 17.4142 11.2012 17.75 11.6154 17.75H17C17.4142 17.75 17.75 17.4142 17.75 17V11.6154C17.75 11.2012 17.4142 10.8654 17 10.8654H11.6154ZM12.3654 16.25V12.3654H16.25V16.25H12.3654Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>',
// sidebar_workspace_projectIcon:
// '<svg viewBox="0 0 20 20" fill="currentColor" width="" height="" aria-hidden="true" class="icon_35c1b9ef14" data-testid="icon"><path d="M7.5 4.5H16C16.2761 4.5 16.5 4.72386 16.5 5V15C16.5 15.2761 16.2761 15.5 16 15.5H7.5L7.5 4.5ZM6 4.5H4C3.72386 4.5 3.5 4.72386 3.5 5V15C3.5 15.2761 3.72386 15.5 4 15.5H6L6 4.5ZM2 5C2 3.89543 2.89543 3 4 3H16C17.1046 3 18 3.89543 18 5V15C18 16.1046 17.1046 17 16 17H4C2.89543 17 2 16.1046 2 15V5Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>',
// }

export default function Sidebar() {
  return (
    <div className='sidebar'>
      {/* Navigation Links */}
      <ul className='sidebar-links'>
        <li className='sidebar-item'>
          <SvgIcon iconName={'sidebar_home'} /> <span>Home</span>
        </li>
        <li className='sidebar-item'>
          <SvgIcon iconName={'sidebar_myWork'} /> <span>My work</span>
        </li>
      </ul>
      <Divider className='divider' />
      <ul className='sidebar-links'>
        <li className='sidebar-item'>
          <StarBorderOutlined />
          <span>Favorites</span>
        </li>
      </ul>
      <Divider className='divider' />
      <ul className='sidebar-links'>
        <li className='sidebar-item'>
          <SvgIcon iconName={'sidebar_workspaces'} />
          <span>Workspaces</span>
        </li>
      </ul>
      {/* Workspace Section */}
      <div className='workspace-section'>
        <ul className='workspace-links'>
          <li className='workspace-item active'>
            <SvgIcon
              iconName={'sidebar_workspace_projectIcon'}
              options={{ height: '17', width: '17' }}
            />
            <span>Main Workspace</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
