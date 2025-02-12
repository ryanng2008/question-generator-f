import { useState, useEffect } from "react"
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import Art from "./generic-comps/ui/Art";


export default function Account() { 
    const { user } = useAuth();
    const [page, setPage] = useState<'login' | 'register'>('login');
    return (
      <div className="mx-4 lg:px-12 md:px-8 px-0 py-8 grid grid-cols-2 gap-4 items-center h-[85vh]"> 
      {/* Fix the spacing here ig */}
        {
          (user) ? 
          <LoggedIn username={user} /> :
          (page === 'login') ?
          <Login switchPage={setPage} /> :
          (page === 'register') ?
          <Register switchPage={setPage} /> :
          <div />
        }
        <Art />
      </div>
    )
}

function LoggedIn({ username }: { username: string }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  async function handleLogout() {
    logout();
    navigate("/");
  }
  return (
    <div className="justify-center flex flex-col gap-4">
      <div className="flex flex-row gap-1 text-xl">Logged in as <p className="font-bold">{username}</p></div>
      <div>
      <button onClick={handleLogout} className='py-1 px-4 rounded-lg text-md font-medium text-mywhite bg-darkgray inline-block hover:scale-105 duration-500'>
        <p>Log out</p>
      </button>
      </div>
    </div>
  )
}

function Login({ switchPage }: { switchPage: (page: 'login' | 'register') => void }) {
  const [credentials, setCredentials] = useState({ username: '', password: ''})
  const [message, setMessage] = useState<string>('Niggger');
  const { login } = useAuth();
  // const navigate = useNavigate();
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      setCredentials(c => ({ ...c, [e.target.name]: e.target.value}))
  }
  async function handleSubmit() {
      const result = await login(credentials.username, credentials.password);
      if(result.message) {
        setMessage(result.message);
        // navigate("/")
      } else {
        setMessage('Login failed')
      }
  }
  useEffect(() => {
    setMessage('');
  }, [credentials])
  
  return (
    <div className="THE STUFF flex flex-col gap-2">
      <h1 className="text-4xl font-semibold my-2">Log in</h1>
      <div className="flex flex-col gap-2 my-2">
        <input className="max-w-[300px] rounded-md p-1 pl-2 outline-2 outline-gray-200" placeholder="Username" value={credentials.username} onChange={handleChange} type="text" name='username' />
        <input className="max-w-[300px] rounded-md p-1 pl-2 outline-2 outline-gray-300" placeholder="Password" value={credentials.password} onChange={handleChange} type="text" name='password' />
      </div>
      <div className="">
      <button onClick={handleSubmit} className='py-1 px-4 rounded-lg text-md font-medium text-mywhite bg-darkgray inline-block hover:scale-105 duration-500'>
        <p>Log in</p>
      </button>
      </div>
      <div className='flex items-center'>
        <button 
        className='py-1 hover:underline hover:text-gray-500 rounded-lg' 
        onClick={() => switchPage('register')}
        >Don't have an account?</button>
      </div>
      {message && <p className="my-1 text-md text-red-800 font-semibold">{message}</p>}
    </div>
  )
}

function Register({ switchPage }: { switchPage: (page: 'login' | 'register') => void }) {
  const [credentials, setCredentials] = useState({ username: '', password: ''});
  const [message, setMessage] = useState<string>('');
  const { register } = useAuth();
  // const navigate = useNavigate();
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCredentials(c => ({ ...c, [e.target.name]: e.target.value}))
  }
  async function handleSubmit() {
    const result = await register(credentials.username, credentials.password);
    if(result.success) {
      setMessage(result.message);
      // navigate("/");
    } else {
      setMessage(result.message);
    }
  }
  useEffect(() => {
    setMessage('');
  }, [credentials])


  return (
  <div className="THE STUFF flex flex-col gap-2">
      <h1 className="text-4xl font-semibold my-2">Create an account</h1>
      <div className="flex flex-col gap-2 my-2">
        <input className="max-w-[300px] rounded-md p-1 pl-2 outline-2 outline-gray-200" placeholder="Username" value={credentials.username} onChange={handleChange} type="text" name='username' />
        <input className="max-w-[300px] rounded-md p-1 pl-2 outline-2 outline-gray-300" placeholder="Password" value={credentials.password} onChange={handleChange} type="text" name='password' />
      </div>
      <div className="">
      <button onClick={handleSubmit} className='py-1 px-4 rounded-lg text-md font-medium text-mywhite bg-darkgray inline-block hover:scale-105 duration-500'>
        <p>Register</p>
      </button>
      </div>
      <div className='flex items-center'>
        <button 
        className='py-1 hover:underline hover:text-gray-500 rounded-lg' 
        onClick={() => switchPage('login')}
        >Have an account already?</button>
      </div>
      {message && <p className="my-1 text-md text-red-800 font-semibold">{message}</p>}
  </div>
  )
}