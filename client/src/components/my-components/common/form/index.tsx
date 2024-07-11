import { useController } from "react-hook-form"

type InputProps = {
    type?: string
    name: string
    errMsg?: string | null  
    control: any
    placeholder?: string
}
export const InputTextField = ({type="text", name, errMsg = null, control, placeholder=""}: InputProps) => {
    const {field} = useController({
        control: control,
        name: name
    })
    return (
        <>
            <input
                id={name}
                autoComplete={name}
                type={type}
                placeholder={placeholder}
                className="pl-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                {...field}
                />
            <span className="text-red-500 text-sm">{errMsg}</span>
        </>
    )
}

type TextAreaProps = {
    name: string
    errMsg?: string | null  
    control: any
    placeholder?: string
}

export const TextAreaField = ({name, errMsg = null, control, placeholder=""}: TextAreaProps) => {
    const {field} = useController({
        control: control,
        name: name
    })
    return (
        <>
            <textarea
                id={name}
                placeholder={placeholder}
                rows={3}
                className="px-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                {...field}
                />
            <span className="text-red-500 text-sm">{errMsg}</span>
        </>
    )
}