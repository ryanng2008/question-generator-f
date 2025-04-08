
import { Link } from "react-router-dom";
import Art from "./ui/Art";

export default function CreateMenu() {
    return (
    // <div className="flex flex-col gap-4 mx-4 lg:px-12 md:px-8 px-0 py-8">
    //     {/* <div className="HEAD my-4">
            
    //     </div> */}
        <div className="md:grid grid-cols-2 min-h-[60vh] mx-4 lg:px-12 px-0 py-8 grow">
            <div className="MENU BUTTONS flex flex-col gap-4 pt-8">
                <h1 className="text-6xl font-semibold mb-6">Create</h1>
                <Link to='/create/set' className="bg-lightgray py-4 px-4 text-xl hover:scale-[101%] duration-300 text-darkgray font-medium rounded-2xl">
                <p>Create set</p>
                </Link>
                <Link to='/create/question' className="bg-lightgray py-4 px-4 text-xl hover:scale-[101%] duration-300 text-darkgray font-medium rounded-2xl">
                <p>Create question</p>
                </Link>
                {/* <Link to='/create/bulk' className="bg-lightgray py-4 px-4 text-xl hover:scale-[101%] duration-300 text-darkgray font-medium rounded-2xl">
                <p>Create questions in bulk</p>
                </Link> */}
            </div>
            <div className="my-auto mx-auto md:block hidden">
            <Art />
            </div>
        </div>
    // </div>
    )
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
