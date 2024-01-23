import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Todo from './todo';
import Signup from './signup';
import Login from './login';
import Update from './update';

function App() {
  return (
      <BrowserRouter>
          <Routes>
            <Route path='/todo' element={<Todo/>}/>
            <Route path='/signup' element={<Signup/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/update/:id' element={<Update/>}/>
          </Routes>
      </BrowserRouter>
  )
}

export default App
