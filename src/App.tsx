import Dashboard from "./components/Dashboard"
import Navbar from "./components/Navbar"
import Gallery from "./components/Gallery"
import CategoryMenu from "./components/generic-comps/CategoryMenu"
import { Route, Routes } from "react-router-dom"
import QuestionsPage from "./components/generic-comps/QuestionsPage"

function App() {

  return (
      <div className='App'>
        <Navbar />
        <div className='content'>
          <Routes> 
            <Route path='' element={<Dashboard />} />
            <Route path='library' element={<Gallery />} /> 
            <Route path='library/:categoryId' element={<CategoryMenu />} />
            <Route path='library/:categoryId/questions' element={<QuestionsPage />}/>
          </Routes>
        </div>
      </div>
  )
}

export default App
