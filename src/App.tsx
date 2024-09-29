import Dashboard from "./components/Dashboard"
import Navbar from "./components/Navbar"
import Gallery from "./components/Gallery"
import CategoryMenu from "./components/generic-comps/CategoryMenu"
import { Route, Routes } from "react-router-dom"
import QuestionsPage from "./components/generic-comps/QuestionsPage"
import Workspace from "./components/Workspace"
import CreateMenu from "./components/generic-comps/CreateMenu"


function App() {

  return (
      <div className='App font-inter'>
        <Navbar />
        <div className='content'>
          <Routes> 
            <Route path='' element={<Dashboard />} />
            <Route path='library' element={<Gallery />} /> 
            <Route path='library/:categoryId' element={<CategoryMenu />} />
            <Route path='library/:categoryId/questions' element={<QuestionsPage />}/>
            <Route path='create' element={<CreateMenu />}/>
            <Route path='workspace' element={<Workspace />}/>
          </Routes>
        </div>
      </div>
  )
}

export default App
