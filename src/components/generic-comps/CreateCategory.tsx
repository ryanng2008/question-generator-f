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
    const handleAddItem = () => {
        if (tagsInput.trim() !== '') {
            setTags((prevTags) => [...prevTags, tagsInput]);
            setTagsInput(''); // Clear the input field
        }
    };
    async function onCreate() {
        if(!user) {
            setMessage('Log in first!')
            return
        }
        const createCategory = await handlePostCategory(title, description, tags);
        if(createCategory.success) {
            setMessage('Success!')
            navigate(`/library/${createCategory.inserted_id}/questions`)
        } else {
            setMessage('Failed to create this category')
        }
    }
    return (
        <div className="flex flex-col gap-8 mx-4 lg:px-12 md:px-8 px-0 py-8">
            <div className="HEAD my-4">
                <h1 className="text-6xl font-semibold">Create Category</h1>
            </div>
            <div className="grid grid-cols-2">
                <div className="BIG BODY bg-lightgray rounded-lg drop-shadow-xl flex flex-col gap-8 py-6 px-8">
                    <div className="TITLE flex flex-col gap-4">
                        <h1 className="text-xl font-medium">Title</h1>
                        <input value={title} onChange={e => setTitle(e.target.value)} className="outline-mywhite py-2 px-3 text-md rounded-lg" placeholder="Put your here (keep it concise...)"  type="text" />
                    </div>
                    <div className="DESC flex flex-col gap-4">
                        <h1 className="text-xl font-medium">Description</h1>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} className="outline-mywhite py-2 px-3 text-md rounded-lg h-20 overflow-scroll no-scrollbar" placeholder="This category is all about learning"  />
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
                        <ul className="flex flex-wrap gap-3 h-24 p-4 overflow-scroll no-scrollbar bg-white rounded-xl border-[3px] border-midgray">
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
                        <button onClick={onCreate} className="ml-2 bg-darkgray text-white px-6 hover:scale-105 duration-300 py-2 font-medium text-lg rounded-lg drop-shadow-xl">Submit</button>
                        <p className="my-auto">{message}</p>
                    </div>
                </div>
                <Art />
            </div>
        </div>
    )
}
