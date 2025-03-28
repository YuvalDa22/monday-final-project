import svgs from '../assets/icons-svgs/icons'

export const utilService = {
  makeId,
  saveToStorage,
  loadFromStorage,
  debounce,
  animateCSS,
  getSvg,
  formatDate,
  calcTimePassed,
}

function makeId(length = 5) {
  var text = ''
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}

function saveToStorage(key, value) {
  localStorage[key] = JSON.stringify(value)
  localStorage[key] = JSON.stringify(value)
}

function loadFromStorage(key, defaultValue = null) {
  var value = localStorage[key] || defaultValue
  return JSON.parse(value)
}

function animateCSS(el, animation, options = {}) {
  const { isRemoveClass = true } = options

  const prefix = 'animate__'
  return new Promise((resolve) => {
    const animationName = `${prefix}${animation}`
    el.classList.add(`${prefix}animated`, animationName)

    function handleAnimationEnd(event) {
      event.stopPropagation()
      if (isRemoveClass) el.classList.remove(`${prefix}animated`, animationName)
      resolve('Animation ended')
    }

    el.addEventListener('animationend', handleAnimationEnd, { once: true })
  })
}

export function debounce(func, delay) {
  let timeoutId

  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      func(...args)
    }, delay)
  }
}

export function getExistingProperties(obj) {
  const truthyObj = {}
  for (const key in obj) {
    const val = obj[key]
    if (val || typeof val === 'boolean') {
      truthyObj[key] = val
    }
  }
  return truthyObj
}

export function getSvg(name, options = { height: '22', width: '22', color: 'currentColor' }) {
  const { height, width, color } = options
  if (!svgs[name]) return ''
  // return svgs[name];
  return svgs[name]
    .replaceAll('fill="currentColor"', `fill="${color}"`)
    .replaceAll('stroke="currentColor"', `stroke="${color}"`)
    .replaceAll('width=""', `width="${width}"`)
    .replaceAll('height=""', `height="${height}"`)
}

// right now not being implemented because of datepicker-mui
function formatDate(date) {
  const parsedDate = new Date(date)

  if (!date || isNaN(parsedDate.getTime())) return ''

  const options = { day: 'numeric', month: 'short', year: 'numeric' }
  return parsedDate.toLocaleDateString('en-US', options)
}

function calcTimePassed(item) {
  const diff = Date.now() - item.createdAt // Time difference in milliseconds
  const seconds = Math.floor(diff / 1000) // Convert to seconds

  // if less than a minute, show seconds , if less than an hour , show minutes , etc etc ....
  if (seconds < 60) return 'now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return minutes + 'm'
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return hours + 'h'
  const days = Math.floor(hours / 24)
  return days + 'd'
}
