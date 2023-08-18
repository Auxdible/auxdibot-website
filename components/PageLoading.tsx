import { BsThreeDots } from "react-icons/bs";

export default function PageLoading() {
    return (<main className={"h-screen flex justify-center items-center bg-gray-700"}>
        <BsThreeDots className={"animate-spin text-8xl text-white"}/>
    </main>)
}