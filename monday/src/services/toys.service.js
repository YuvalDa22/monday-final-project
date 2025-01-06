import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'

export const toyService = {
  query,
  save,
  remove,
  getById,
  getDefaultFilter,
  getFilterFromSearchParams,
}

const STORAGE_KEY = 'toys'

async function query(filterBy = {}) {
  try {
    let toys = await storageService.query(STORAGE_KEY)

    if (filterBy.name) {
      const nameRegex = new RegExp(filterBy.name, 'i')
      toys = toys.filter((toy) => nameRegex.test(toy.name))
    }

    if (filterBy.price) {
      toys = toys.filter((toy) => +toy.price <= filterBy.price)
    }

    if (filterBy.labels && filterBy.labels.length) {
      toys = toys.filter((toy) =>
        filterBy.labels.every((label) => toy.labels.includes(label))
      )
    }

    if (filterBy.sortByPrice) {
      toys = toys.sort((a, b) => +b.price - +a.price)
    }

    return toys
  } catch (error) {
    console.log('error:', error)
    throw error
  }
}

function getById(id) {
  return storageService.get(STORAGE_KEY, id)
}

function remove(id) {
  return storageService.remove(STORAGE_KEY, id)
}

function save(toyToSave) {
  if (toyToSave.id) {
    return storageService.put(STORAGE_KEY, toyToSave)
  } else {
    return storageService.post(STORAGE_KEY, toyToSave)
  }
}

// function createToy(name = '', price = 0, labels = [], inStock = true) {
//   return {
//     name,
//     price,
//     labels,
//     inStock,
//   }
// }

function getDefaultFilter() {
  return {
    name: '',
    price: '',
  }
}

function getFilterFromSearchParams(searchParams) {
  const defaultFilter = getDefaultFilter()
  const filterBy = {}
  for (const field in defaultFilter) {
    filterBy[field] = searchParams.get(field) || ''
  }
  return filterBy
}

// function _createToys() {
//   let toys = utilService.loadFromStorage(STORAGE_KEY)
//   if (!toys || !toys.length) {
//     toys = [
//       {
//         id: 'r1',
//         model: 'Dominique Sote',
//         batteryStatus: 100,
//         type: 'Pleasure',
//       },
//       { id: 'r2', model: 'Salad-O-Matic', batteryStatus: 80, type: 'Cooking' },
//       { id: 'r3', model: 'Dusty', batteryStatus: 100, type: 'Cleaning' },
//       { id: 'r4', model: 'DevTron', batteryStatus: 40, type: 'Office' },
//     ]
//     utilService.saveToStorage(STORAGE_KEY, toys)
//   }
// }
