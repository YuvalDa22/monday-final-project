const { DEV, VITE_LOCAL } = import.meta.env;

import { utilService } from '../util.service';
import { boardService as local } from './board.service.local';
import { boardService as remote } from './board.service.remote';

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
]);

const labels = [
  // Status Labels (l101 - l199)
  { id: 'l101', title: '', color: '#c4c4c4' },
  { id: 'l102', title: 'Done', color: '#00c875' },
  { id: 'l103', title: 'Working on it', color: '#fdab3d' },
  { id: 'l104', title: 'Stuck', color: '#df2f4a' },
  { id: 'l105', title: 'Not started', color: '#784bd1' },
  { id: 'l106', title: 'Testing', color: '#66ccff' },

  // Priority Labels (l201 - l299)
  { id: 'l201', title: '', color: '#c4c4c4' },
  { id: 'l202', title: 'Critical ⚠️', color: '#333333' },
  { id: 'l203', title: 'High', color: '#401694' },
  { id: 'l204', title: 'Medium', color: '#5559df' },
  { id: 'l205', title: 'Low', color: '#579bfc' },
  { id: 'l206', title: 'Optional', color: '#9d99ff' },
];

const members = [
  {
    _id: 'u101',
    fullname: 'Tal Tarablus',
    imgUrl: 'https://i.pravatar.cc/250?u=mail@ashallendesign.co.uk',
  },
  {
    _id: 'u102',
    fullname: 'Yuval Dadon',
    imgUrl: 'https://gravatar.com/images/homepage/avatar-04.png',
  },
  {
    _id: 'u103',
    fullname: 'Ofir Gady',
    imgUrl:
      'https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250',
  },
  {
    _id: 'u104',
    fullname: 'Gal Israeli',
    imgUrl: 'https://gravatar.com/images/homepage/avatar-02.png',
  },
];

function getEmptyBoard(user) {
  return {
    title: 'New Board',
    labels: labels,
    members: [
      ...members,
      { _id: user._id, fullname: user.fullname, imgUrl: user.imgUrl },
    ],
    groupSummary: [null, null, null],
    groups: [{ ...getEmptyGroup() }],
    activities: [],
    cmpsOrder: ['status', 'priority', 'memberIds', 'dueDate'],
    cmpTitles: ['Status', 'Priority', 'Members', 'Due Date'],
  };
}

function getEmptyGroup() {
  return {
    id: 'g' + utilService.makeId(),
    title: 'New Group',
    tasks: [{ ...getEmptyTask() }],
    style: { color: _setNewGroupColor() },
    collapsed: false,
  };
}

function getEmptyTask() {
  return {
    id: 't' + utilService.makeId(),
    title: 'New Task',
    archivedAt: 0,
    status: 'l101',
    priority: 'l201',
    updates: [],
    comments: [],
    checklists: [],
    memberIds: [],
    dueDate: 0,
  };
}

function _setNewGroupColor() {
  const colors = Array.from(groupColors.values());
  const randomIndex = Math.floor(Math.random() * colors.length);
  const randomColor = colors[randomIndex];
  return randomColor;
}

function getDefaultFilter() {
  return {
    txt: '',
    groups: [],
    tasks: [],
    members: [],
    statusLabels: [],
    priorityLabels: [],
  };
}

function createNewUpdate(text, user) {
  return {
    id: utilService.makeId(),
    commenter: {
      id: user._id,
      fullname: user.fullname,
      imgUrl: user.imgUrl,
    },
    text,
    createdAt: Date.now(),
    replies: [],
  };
}

// Filter the board by the filterBy object
function filterBoard(board, filterBy) {
  if (!board) return;

  // If there is no filterBy object, return the board as is
  if (filterBy) {
    let { txt = '' } = filterBy;
    txt = txt.toLowerCase();

    // Filter by search text
    board.groups = board.groups
      .map((group) => {
        const filteredTasks = group.tasks.filter((task) =>
          deepSearch(task, txt, board)
        );
        if (filteredTasks.length > 0 || deepSearch(group, txt, board)) {
          return { ...group, tasks: filteredTasks };
        }
        return null;
      })
      .filter(Boolean); // Remove empty groups

    // Filter by Groups
    if (filterBy.groups && filterBy.groups.length > 0) {
      board.groups = board.groups.filter((group) => {
        return filterBy.groups.includes(group.id);
      });
    }

    // Filter by Tasks
    if (filterBy.tasks && filterBy.tasks.length > 0) {
      filterGroupsByTasks('tasks', filterBy.tasks, board);
    }

    // Filter by Members
    if (filterBy.members && filterBy.members.length > 0) {
      filterGroupsByTasks('members', filterBy.members, board);
    }

    // Filter by Status Labels
    if (filterBy.statusLabels && filterBy.statusLabels.length > 0) {
      filterGroupsByTasks('statusLabels', filterBy.statusLabels, board);
    }

    // Filter by Priority Labels
    if (filterBy.priorityLabels && filterBy.priorityLabels.length > 0) {
      filterGroupsByTasks('priorityLabels', filterBy.priorityLabels, board);
    }
  }
  return board;
}

// Filters the tasks within each group of a board based on the specified filter key and values
const filterGroupsByTasks = (filterKey, filterValues, board) => {
  board.groups = board.groups
    .map((group) => {
      const filteredTasks = group.tasks.filter((task) => {
        if (filterKey === 'tasks') return filterValues.includes(task.id);
        if (filterKey === 'members')
          return task.memberIds.some((memberId) =>
            filterValues.includes(memberId)
          );
        if (filterKey === 'statusLabels')
          return filterValues.includes(task.status);
        if (filterKey === 'priorityLabels')
          return filterValues.includes(task.priority);
        return false;
      });
      if (filteredTasks.length > 0) {
        return { ...group, tasks: filteredTasks }; // Keep the group with only the filtered tasks
      }
      return null;
    })
    .filter(Boolean);
};

//  Recursive function to search in all keys and values
function deepSearch(obj, searchText, board) {
  if (typeof obj === 'string') {
    return obj.toLowerCase().includes(searchText);
  }

  if (typeof obj === 'number') {
    return obj.toString().includes(searchText);
  }

  if (Array.isArray(obj)) {
    return obj.some((item) => deepSearch(item, searchText, board)); // Search inside arrays
  }

  if (typeof obj === 'object' && obj !== null) {
    return Object.entries(obj).some(([key, value]) => {
      if (key === 'status' || key === 'priority') {
        const label = board.labels.find((label) => label.id === value);
        if (label && label.title.toLowerCase().includes(searchText)) {
          return true;
        }
      }

      if (key === 'memberIds' && Array.isArray(value)) {
        return value.some((memberId) => {
          const member = board.members.find(
            (member) => member._id === memberId
          );
          return member && member.fullname.toLowerCase().includes(searchText);
        });
      }

      // Ensure keys and values are both searched
      return (
        key.toLowerCase().includes(searchText) ||
        deepSearch(value, searchText, board)
      );
    });
  }

  return false;
}

const service = VITE_LOCAL === 'true' ? local : remote;
export const boardService = {
  getEmptyBoard,
  getEmptyGroup,
  getEmptyTask,
  getDefaultFilter,
  filterBoard,
  createNewUpdate,
  groupColors,
  ...service,
};
