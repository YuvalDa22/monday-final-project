const { DEV, VITE_LOCAL } = import.meta.env

import { boardService as local } from './board.service.local'
import { boardService as remote } from './board.service.remote'

const groupColors = new Map([
  ['red', '#bb3354'],
  ['green', '#037f4c'],
  ['lightGreen', '#00c875'],
  ['lime', '#9cd326'],
  ['yellow', '#cab641'],
  ['gold', '#ffcb00'],
  ['purple', '#784bd1'],
  ['violet', '#9d50dd'],
  ['blue', '#007eb5'],
  ['lightBlue', '#579bfc'],
  ['skyBlue', '#66ccff'],
  ['pink', '#df2f4a'],
  ['hotPink', '#ff007f'],
  ['lightPink', '#ff5ac4'],
  ['orange', '#ff642e'],
  ['amber', '#fdab3d'],
  ['brown', '#7f5347'],
  ['gray', '#c4c4c4'],
  ['darkGray', '#757575'],
])

function getEmptyBoard() {
  return {
    title: 'New Board',
    isStarred: false,
    archivedAt: 0,
    createdBy: {
      _id: '',
      fullname: '',
      imgUrl: '',
    },
    style: {},
    labels: [],
    members: [],
    groupSummary: [null, null, null],
    groups: [{...getEmptyGroup()},
    {...getEmptyGroup()}],
    archivedItems: [], //Groups or Tasks
    activities: [],
    cmpsOrder: ["status", "priority", "memberIds", "dueDate"],
    cmpTitles: ["Status", "Priority", "Members", "Due Date"],
    groupSummary: [],
  }
}
  
function getEmptyGroup() {
  return {
    title: 'New Group',
    archivedAt: 0,
    tasks: [{...getEmptyTask()},
    {...getEmptyTask()}],
    archivedItems: [],
    style: { color: _setNewGroupColor() },
    collapsed: false,
  }
}

  function getEmptyTask() {
    return {
      title: '',
      archivedAt: 0,
      status: 'l101',
      priority: 'l201',
      description: '',
      comments: [],
      checklists: [],
      memberIds: [],
      labelIds: [],
      dueDate: 0,
      byMember: {},
      style: {},
    }
  }

  function _setNewGroupColor() {
    const colors = Array.from(groupColors.values())
    const randomIndex = Math.floor(Math.random() * colors.length)
    const randomColor = colors[randomIndex]
    return randomColor
  }


const service = VITE_LOCAL === 'true' ? local : remote
export const boardService = { getEmptyBoard, getEmptyGroup, getEmptyTask, groupColors, ...service }





