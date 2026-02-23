import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import store from './redux/store.ts'
import { add, type userStateType } from './redux/userSlice.ts'


const localUser = localStorage.getItem('localUser');
let userState: userStateType = JSON.parse(localUser as string)

if (localUser) {
  store.dispatch(add(userState));
}


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>

  </StrictMode>,
)
