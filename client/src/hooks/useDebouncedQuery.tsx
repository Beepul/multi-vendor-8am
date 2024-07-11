import { useEffect, useState } from "react"
import { useQuery } from "react-query"

const useDebouncedQuery = (queryKey: any, queryFn: () => Promise<any>, debounceTime: number) => {
    const [debouncedValue, setDebouncedValue] = useState(queryKey)

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(queryKey)
        }, debounceTime)

        return () => {
            clearTimeout(handler)
        }
    },[queryKey, debounceTime])

    // console.log(debouncedValue)


    // return useQuery([debouncedValue], queryFn, {
    //     enabled: !!debouncedValue,
    //     staleTime: Infinity,
    //     cacheTime: Infinity
    // })
    const {data, isLoading} = useQuery([debouncedValue], queryFn, {
        enabled: !!debouncedValue
    })
    return {
        data, 
        isLoading
    }
}

export default useDebouncedQuery