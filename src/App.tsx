import Dashboard from "./components/Dashboard"
import Navbar from "./components/Navbar"
import Gallery from "./components/Gallery"
import CategoryMenu from "./components/generic-comps/CategoryMenu"
import { Route, Routes } from "react-router-dom"
import QuestionsPage from "./components/generic-comps/QuestionsPage"
import Workspace from "./components/Workspace"
import CreateMenu from "./components/generic-comps/CreateMenu"
import { addStyles } from "react-mathquill";
import CreateQuestion from "./components/generic-comps/CreateQuestion"
import CreateCategory from "./components/generic-comps/CreateCategory"


addStyles()

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
            <Route path='create/question' element={<CreateQuestion />}/>
            <Route path='create/question/:categoryId' element={<CreateQuestion />}/>
            <Route path='create/category' element={<CreateCategory />}/>
            <Route path='test' element={<Workspace />}/>
            {/* <Route path='workspace' element={<Workspace />}/> */}
          </Routes>
        </div>
      </div>
  )
}

export default App
