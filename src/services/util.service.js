import svgs from '../assets/icons-svgs/icons'

export const utilService = {
  makeId,
  saveToStorage,
  loadFromStorage,
  debounce,
  animateCSS,
  getSvg,
  formatDate,
  createUniqueColorPicker
}

function makeId(length = 5) {
  var text = ''
  var possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}

function saveToStorage(key, value) {
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

export function getSvg(
  name,
  options = { height: '22', width: '22', color: 'currentColor' }
) {
  const { height, width, color } = options

  if (!svgs[name]) return ''
  // return svgs[name];
  return svgs[name]
    .replaceAll('fill="currentColor"', `fill="${color}"`)
    .replaceAll('stroke="currentColor"', `stroke="${color}"`)
    .replaceAll('width=""', `width="${width}"`)
    .replaceAll('height=""', `height="${height}"`)
}

    // Format the date to `dd/mm/yyyy` or return "No date selected"
    function formatDate (date){
      if (!date || isNaN(date.getTime())) return 'No date selected'; 
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
  };

  function createUniqueColorPicker() {
    const colors = [
        "red", "blue", "green", "yellow", "purple", "orange", "pink", "brown",
        "black", "white", "gray", "cyan", "magenta", "teal", "lime", "indigo",
        "violet", "gold", "silver", "maroon", "navy", "turquoise", "coral",
        "salmon", "khaki", "plum", "orchid", "tan", "peach", "crimson", "olive"
        // Add more colors here as needed for a larger list
    ];

    let remainingColors = [...colors]; // Clone the array initially

    return function getRandomUniqueColor() {
        if (remainingColors.length === 0) {
            console.log("All colors have been used. Resetting the color list.");
            remainingColors = [...colors]; // Reset the remaining colors
        }

        const randomIndex = Math.floor(Math.random() * remainingColors.length);
        const color = remainingColors[randomIndex];
        remainingColors.splice(randomIndex, 1); // Remove the chosen color

        return color;
    };
}
