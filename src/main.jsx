import ReactDOM from 'react-dom/client'
import RootCmp from './RootCmp.jsx'
import { Provider } from 'react-redux'
import { store } from './store/store.js'
import { HashRouter as Router } from 'react-router-dom'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'

ReactDOM.createRoot(document.getElementById('root')).render(
	<Provider store={store}>
		<ChakraProvider value={defaultSystem}>
			<Router>
				<RootCmp />
			</Router>
		</ChakraProvider>
	</Provider>
)
