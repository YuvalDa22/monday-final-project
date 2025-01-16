function createEventEmitter() {
  const listenersMap = {}

  return {
      // Use this function to subscribe to an event
      on(evName, listener) {
          listenersMap[evName] = (listenersMap[evName]) ? [...listenersMap[evName], listener] : [listener]
          return () => {
              listenersMap[evName] = listenersMap[evName].filter(func => func !== listener)
          }
      },
      // Use this function to emit an event
      emit(evName, data) {
          if (!listenersMap[evName]) return
          listenersMap[evName].forEach(listener => listener(data))
      }
  }
}




export const eventBusService = createEventEmitter()



export function showSuccessMsg(txt) {
  showUserMsg({ txt, type: 'success' })
}

export function showErrorMsg(txt) {
  showUserMsg({ txt, type: 'error' })
}
function showUserMsg(msg) {
  eventBusService.emit('show-user-msg', msg)
}


//* Use this to demo the service from the console
window.ebs = eventBusService

//* Example for using the service
// eventBusService.on('some-event', (data) => {
//     console.log('Listener 1 got some-event:', data)
// })

// const unsubscribe = eventBusService.on('some-event', (data) => {
//     console.log('Listener 2 - Me Too!', data)
// })

// window.unsubscribe = unsubscribe

// eventBusService.emit('some-event', { num: 999 })


//*  Just as example - unsubscribe after 2 secs
// setTimeout(() => {
//     console.log('Unsubscribing second listener');
//     unsubscribe()
// }, 2000)
// setTimeout(() => eventBusService.emit('some-event', { num: 999 }), 3000)












