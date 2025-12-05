import { RouterProvider } from 'react-router-dom';
import './App.css'
import router from '@/router';
import NormalizeStyles from './styles/NormalizeStyles';

function App() {

  return (
    <>
      <NormalizeStyles></NormalizeStyles>
      <RouterProvider router={router}></RouterProvider>
    </>
  )

}

export default App
