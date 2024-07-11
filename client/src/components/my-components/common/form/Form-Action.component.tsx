import LoaderComponent from "../Loader.component"

type Props = {
    type?: "submit" | "button" | "reset",
    isLoading: boolean,
    width?: string,
    title: string
}
const FormActionComponent = ({type="submit", isLoading=false, width, title}: Props) => {
    return (
        <>
            <button
                type={type}
                disabled={isLoading}
                className={`flex ${width} items-center gap-2 justify-center rounded-md bg-blue-800 px-6 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 ${isLoading ? 'cursor-not-allowed bg-blue-600' : 'cursor-pointer'} transition-all duration-300`}
            >
                {title}
                {
                    isLoading && (
                    <LoaderComponent color="#ffffff"/>
                    )
                }
            </button>
        </>
    )
}

export default FormActionComponent