import Dashboard from "./components/Dashboard"
import Navbar from "./components/Navbar"
import Gallery from "./components/Gallery"
import CategoryMenu from "./components/generic-comps/CategoryMenu"
import { Route, Routes, useLocation } from "react-router-dom"
import { useEffect } from "react"
import QuestionsPage from "./components/generic-comps/QuestionsPage"
// import Workspace from "./components/Workspace"
// import CreateMenu from "./components/generic-comps/CreateMenu"
import { addStyles } from "react-mathquill";
import CreateQuestion from "./components/generic-comps/CreateQuestion"
import Account from "./components/Account"
import { useAuth } from "./AuthContext"
import EditQuestion from "./components/generic-comps/EditQuestion"
import RepetitionPage from "./components/generic-comps/RepetitionPage"
import BulkCreate from "./components/BulkCreate"
import SmartCategory from "./components/CreateSet"
// import Metadata from "./lib/Metadata"


addStyles()

function App() {
  const { loadUser } = useAuth();
  const location = useLocation();
  useEffect(() => {
    loadUser()
  }, [location])
  return (
      <div className='min-h-screen'>
        {/* <Metadata /> */}
        <Navbar />
        <Routes> 
          <Route path='' element={<Dashboard />} />
          <Route path='library' element={<Gallery />} /> 
          <Route path='library/:categoryId' element={<CategoryMenu />} />
          <Route path='library/:categoryId/questions' element={<QuestionsPage />}/>
          <Route path='library/:categoryId/adaptive' element={<RepetitionPage />}/>
          <Route path='create' element={<SmartCategory />}/>
          <Route path='create/question' element={<CreateQuestion />}/>
          <Route path='create/question/:categoryId' element={<CreateQuestion />}/>
          <Route path='create/set' element={<SmartCategory />}/>
          <Route path='edit/:categoryId/:questionId' element={<EditQuestion />} />
          <Route path='create/bulk/:categoryId' element={<BulkCreate />} />
          <Route path='create/bulk' element={<BulkCreate />} />
          {/* <Route path='test' element={<Workspace />}/> */}
          <Route path='account' element={<Account />}/>
          <Route path='lab' element={<SmartCategory />} />
          {/* <Route path='workspace' element={<Workspace />}/>  */}
        </Routes>
      </div>
  )
}

export default App
