import Dashboard from "./components/Dashboard"
import Navbar from "./components/Navbar"
import Gallery from "./components/Gallery"
import CategoryMenu from "./components/generic-comps/CategoryMenu"
import { Route, Routes, useLocation } from "react-router-dom"
import { useEffect } from "react"
import QuestionsPage from "./components/generic-comps/QuestionsPage"
// import Workspace from "./components/Workspace"
import CreateMenu from "./components/generic-comps/CreateMenu"
import { addStyles } from "react-mathquill";
import CreateQuestion from "./components/generic-comps/CreateQuestion"
import CreateCategory from "./components/generic-comps/CreateCategory"
import Account from "./components/Account"
import { useAuth } from "./AuthContext"
import EditQuestion from "./components/generic-comps/EditQuestion"
import RepetitionPage from "./components/generic-comps/RepetitionPage"
import BulkCreate from "./components/BulkCreate"
// import Metadata from "./lib/Metadata"


addStyles()

function App() {
  const { loadUser } = useAuth();
  const location = useLocation();
  useEffect(() => {
    loadUser()
  }, [location])
  return (
      <div className='min-h-screen flex flex-col'>
        {/* <Metadata /> */}
        <Navbar />
        <Routes> 
          <Route path='' element={<Dashboard />} />
          <Route path='library' element={<Gallery />} /> 
          <Route path='library/:categoryId' element={<CategoryMenu />} />
          <Route path='library/:categoryId/questions' element={<QuestionsPage />}/>
          <Route path='library/:categoryId/adaptive' element={<RepetitionPage />}/>
          <Route path='create' element={<CreateMenu />}/>
          <Route path='create/question' element={<CreateQuestion />}/>
          <Route path='create/question/:categoryId' element={<CreateQuestion />}/>
          <Route path='create/category' element={<CreateCategory />}/>
          <Route path='edit/:categoryId/:questionId' element={<EditQuestion />} />
          {/* <Route path='test' element={<Workspace />}/> */}
          <Route path='account' element={<Account />}/>
          <Route path='lab' element={<BulkCreate />} />
          {/* <Route path='workspace' element={<Workspace />}/>  */}
        </Routes>
      </div>
  )
}

export default App
