import { XMarkIcon } from "@heroicons/react/20/solid";
import Art from "./ui/Art";
import { useState } from 'react';
import { handlePostCategory } from "../../lib/api/createApi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";

export default function CreateCategory() {
    // Make a form with the fields for a category
    // Title, Description, Tags
    const { user } = useAuth();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [tagsInput, setTagsInput] = useState('');
    const [message, setMessage] = useState('');
    const [allowSubmit, setAllowSubmit] = useState(true);
    const [publicCategory, setPublicCategory] = useState(false);
    const handleAddItem = () => {
        if (tagsInput.trim() !== '') {
            setTags((prevTags) => [...prevTags, tagsInput]);
            setTagsInput(''); // Clear the input field
        }
    };
    async function onCreate() {
        if(!allowSubmit) {
            return
        }
        setAllowSubmit(false);
        if(!user) {
            setMessage('Log in first!')
            return
        }
        const createCategory = await handlePostCategory(title, description, tags, publicCategory);
        if(createCategory.success) {
            setMessage('Success!')
            navigate(`/library/${createCategory.inserted_id}/questions`)
        } else {
            setMessage('Failed to create this category')
        }
    }
    return (
            
            <div className="md:grid flex flex-col gap-8 grid-cols-2 mx-4 lg:px-12 md:px-8 px-0 py-8 grow">
                <div className="flex flex-col gap-8">
                    <div className="HEAD my-4">
                        <h1 className="md:text-6xl text-5xl font-semibold">Create category</h1>
                    </div>
                    <div className="BIG BODY bg-lightgray rounded-lg drop-shadow-xl flex flex-col gap-8 py-6 px-8">

                        <div className="TITLE flex flex-col gap-4">
                        <h1 className="text-xl font-medium">Title</h1>
                        <input value={title} onChange={e => setTitle(e.target.value)} className="outline-mywhite py-2 px-3 text-md rounded-lg" placeholder="Put your here (keep it concise...)"  type="text" />
                        </div>
                        <div className="DESC flex flex-col gap-4">
                        <h1 className="text-xl font-medium">Description</h1>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} className="outline-mywhite py-2 px-3 text-md rounded-lg h-20 overflow-scroll no-scrollbar" placeholder="This category is all about learning"  />
                        </div>
                        <div className="SETTINGS flex flex-col gap-3">
                        <h1 className="text-xl font-medium">Configuration</h1>
                        <ul className="flex flex-col gap-6 list-disc list-inside">
                            <li className="flex gap-3">
                            <div className="rounded-full h-[5px] w-[5px] bg-black my-auto ml-4"></div>
                            <h1 className="text-md text-darkgray">Public category</h1>
                            <div className="inline-flex items-center">
                            <label className="flex items-center cursor-pointer relative">
                              <input type="checkbox" 
                              onChange={() => setPublicCategory(!publicCategory)} 
                              checked={publicCategory} 
                              className="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-slate-800 bg-white checked:border-slate-800" id="check" />
                              <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                </svg>
                              </span>
                            </label>
                            </div>
                            </li>
                        </ul>
                        </div>
                        <div className="TAGS flex flex-col gap-4">
                        <h1 className="text-xl font-medium">Tags</h1>
                        <input 
                        type="text" 
                        className='outline-mywhite py-1 px-2 rounded-lg w-[50%]'
                        onKeyDown={e => { if(e.key === 'Enter') handleAddItem() }} 
                        value={tagsInput} 
                        placeholder='Type your tags here'
                        onChange={e => setTagsInput(e.target.value)} />
                        <ul className="flex flex-wrap gap-3 h-24 p-4 overflow-scroll no-scrollbar bg-white rounded-xl border-[2px] border-darkgray">
                            {tags.map((tag, i) => { 
                                return (
                                <li key={i}><div className="bg-[#444341] rounded-xl pl-4 pr-3 py-1 flex flex-row gap-1 items-center">
                                    <p className="text-white text-sm font-semibold">{tag}</p>
                                    <button onClick={() => setTags(t => t.filter((_currTag, index) => index !== i))}>
                                        <XMarkIcon className="text-white h-4" />
                                    </button>
                                </div></li>)})}
                        </ul>
                        </div>
                        <div className="SUBMIT flex flex-row gap-16">
                            <button onClick={onCreate} className="ml-2 bg-darkgray text-white px-6 hover:scale-105 duration-300 py-2 font-medium text-lg rounded-lg drop-shadow-xl">Create</button>
                            <p className="my-auto">{message}</p>
                        </div>
                    </div>
                </div>
                <div className="mx-auto my-auto md:flex hidden  ">
                <Art />
                </div>
            </div>
    )
}
