
import { Link } from "react-router-dom";
import Art from "./ui/Art";

export default function CreateMenu() {
    return (
    <div className="flex flex-col gap-4 mx-4 lg:px-12 md:px-8 px-0 py-8">
        <div className="HEAD my-4">
            <h1 className="text-6xl font-semibold">Create</h1>
        </div>
        <div className="grid grid-cols-2 min-h-[60vh]">
            <div className="MENU BUTTONS flex flex-col gap-4 pt-8">
                <Link to='/create/category' className="bg-lightgray py-4 px-4 text-xl hover:scale-[101%] duration-300 text-darkgray font-medium rounded-2xl">
                <p>Create category</p>
                </Link>
                <Link to='/create/question' className="bg-lightgray py-4 px-4 text-xl hover:scale-[101%] duration-300 text-darkgray font-medium rounded-2xl">
                <p>Create question</p>
                </Link>
            </div>
            <Art />
        </div>
    </div>)
}




// TRASH


{/* <div className="flex flex-row gap-4 items-center mx-8">
    <div className="w-1/5 max-w-[100px]">
        <h1>Test</h1>
    </div>
    <div className="w-[10%] bg-green-200 py-4" />
    <div className="">
    </div>
</div> */}
