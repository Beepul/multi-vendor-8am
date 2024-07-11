import { Controller, useForm } from "react-hook-form"
import * as Yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import Select from 'react-select'
import { HiPhoto } from "react-icons/hi2"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import AsyncSelect from 'react-select/async';
import debounce from "debounce-promise"
import axiosInstance from "../../../config/axios.config"
import { useAuth } from "../../../context/auth.context"
import { fetchCatOptions, useCreateCat, useEditCategory } from "../../../api/Category.api"
import FormActionComponent from "../common/form/Form-Action.component"
import { InputTextField } from "../common/form"
import { Category } from "../../../types"
import { LazyLoadImage } from "react-lazy-load-image-component"
import { transformIntoFormData } from "../../../lib/utils"

interface ValidationContext {
    mode: "createMode" | "editMode";
}

const AddCategoryDTO = Yup.object({
    title: Yup.string().required().min(2),
    parentId: Yup.object({
        value: Yup.string().required(),
        label: Yup.string().required()
    }).required().nullable().default(null),
    status: Yup.string().matches(/(active|inactive)/, "Please select one of the option").required().default("inactive"),
    image: Yup.mixed().test(
        'image-required','Image is required', function (value) {

            const context = this.options.context as ValidationContext;

            if(context.mode === "editMode"){
                return true
            }else {
                if(value){
                    return true
                }
            }
            return false
        }
    )
})

const options = [
    { value: 'active', label: 'Publish' },
    { value: 'inactive', label: 'Unpublish' },
]

export type CategoryDTOType = Yup.InferType<typeof AddCategoryDTO>

const AllowImage = ['image/png','image/jpg','image/jpeg','image/webp']

const debouncedFetchCatOptions = debounce(fetchCatOptions, 1000);

type Props = {
    mode: "createMode" | "editMode"
    propCat?: Category
}

const CategoryFormComponent = ({mode="createMode", propCat}: Props) => {
    
    const getCatOptions = async (inputValue: string) => {
        const options = await debouncedFetchCatOptions(inputValue);
        return options || [];
    };

    const [existingImage, setExisitingImage] = useState<string | null>(null)
    const [selectedImage, setSelectedImage] = useState<{img: File | null, err: string | null}>({
        img: null,
        err: null
    })

    const {control, formState: {errors}, register, setValue, handleSubmit, setError, reset, watch} = useForm({
        defaultValues: {
            title: "",
            parentId: null,
            status: "inactive",
            image: undefined
        },
        resolver: yupResolver(AddCategoryDTO),
        context: {
            mode: mode
        }
    })

    console.log(watch())

    const {createCat, error, isLoading, isSuccess} = useCreateCat()

    const {editCategory, editError, isEditLoading, isEditSuccess} = useEditCategory()

    const handleCategorySubmit = (val: CategoryDTOType) => {
        const transformedData: any = {
            ...val,
            parentId: val.parentId?.value
        }
        
        const formData = transformIntoFormData(transformedData)

        if(mode === "editMode" && propCat){
            editCategory({
                id: propCat._id,
                payload: formData
            })
        }else{
            createCat(formData)
        }
    }

    const handleUploadImage = (image: File) => {
        if(!image) return 
        if(!AllowImage.includes(image.type)){
            setSelectedImage({
              img: null,
              err: "Please select a valid image"
            })
            return
        }
        if(image.size > 500000){
            setSelectedImage({
                img: null,
                err: "Image size is too large. Try keeping it minimum 500kb."
            })
            return
        }
        setSelectedImage({
            img: image,
            err: null
        })
        console.log(image)
        setValue("image", image)
        setError("image", {message: undefined})
    }

    useEffect(() => {
        if(!isSuccess && error){
            toast.error((error as any).message, {
                closeOnClick: true, 
                draggable: true,
            })
            return
        }
        if(isSuccess){
            toast.success("Category created successfully", {
                closeOnClick: true, 
                draggable: true,
            })
            reset()
            setSelectedImage({
                img: null,
                err: null
            })
            return 
        }
        if(!isEditSuccess && editError){
            toast.error((editError as any).message, {
                closeOnClick: true, 
                draggable: true,
            })
            return
        }
        if(isEditSuccess){
            toast.success("Category updated successfully", {
                closeOnClick: true, 
                draggable: true,
            })
            return 
        }
    }, [isSuccess, error, isEditSuccess, editError])

    useEffect(() => {
        if(mode === "editMode" && propCat){
            setValue("title", propCat.title)
            setValue("status", propCat.status)
            if(propCat.parentId) {
                setValue("parentId", {value: propCat.parentId?._id as string, label: propCat.parentId?.title as string})
            }
            if(propCat.image){
                setExisitingImage(propCat.image)
            }
        }
    },[mode,propCat])
    return (
        <>
            <form onSubmit={handleSubmit(handleCategorySubmit, (err) => {
                    console.log(err)
                })}>
                <div className="mb-4">
                    <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">
                        Cover photo
                    </label>
                    <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                    <div className="w-full">
                        {
                            selectedImage.img ? (
                                <img className="mx-auto max-h-[150px] object-cover" src={URL.createObjectURL(selectedImage.img)} alt="" />
                            ) :
                            existingImage ? (
                                <LazyLoadImage 
                                    className="block max-w-[170px] mx-auto" 
                                    src={import.meta.env.VITE_IMAGE_URL+'/uploads/category/'+existingImage} 
                                    alt="" 
                                    crossOrigin="anonymous"
                                    effect="blur"
                                    width={'100%'}
                                    />
                                )
                                : (
                                    <HiPhoto className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                                )
                        }
                        <div className="mt-4 text-center text-sm leading-6 text-gray-600">
                            <label
                                htmlFor="cover-upload"
                                className="relative cursor-pointer rounded-md font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                            >
                                <span>Upload category image</span>
                                <input 
                                    id="cover-upload" 
                                    name="cover-upload" 
                                    type="file" 
                                    className="sr-only" 
                                    onChange={(e) => {
                                        if(e.target.files){
                                            handleUploadImage(e.target.files[0])
                                        }
                                    }}
                                />
                            </label>
                        </div>
                        <p className="text-xs text-center mt-1 text-gray-600">PNG, JPG, JPEG, Webp up to 500kb</p>
                        <span className="text-xs text-red-400 text-center inline-block w-full">{errors.image?.message || selectedImage.err}</span>
                    </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-11">
                    <div className="mb-6">
                        <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">
                            Title
                        </label>
                        <div className="mt-2">
                            <InputTextField 
                                control={control}
                                type="text"
                                name="title"
                                placeholder="Enter your product name"
                                errMsg={errors.title?.message}
                            />
                        </div>
                    </div>
                    <div className="mb-6">
                        <label htmlFor="status" className="block text-sm font-medium leading-6 text-gray-900">
                            Status
                        </label>
                        <div className="mt-2">
                            <Select 
                                options={options} 
                                id="status"
                                defaultValue={{label: propCat?.status === "active" ? "Publish" : "Unpublish", value: propCat?.status as string}}
                                onChange={(val) => {
                                    if(val){
                                        setValue("status", val?.value)
                                    }
                                }}
                                />
                        </div>
                        <span className="text-sm text-red-500">{errors.status?.message}</span>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-11">
                    <div className="mb-6">
                        <label htmlFor="categories" className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                            Select parent categories <span className="text-gray-500">(optional)</span>
                        </label>
                        <Controller 
                            name="parentId"
                            control={control}
                            render={({field}) => (
                                <AsyncSelect 
                                    {...field}
                                    id="categories"
                                    cacheOptions 
                                    loadOptions={getCatOptions} 
                                    onChange={(selectedOptions) => {
                                        field.onChange(selectedOptions)
                                    }}
                                />
                            )}
                        />
                    </div>
                </div>
                <FormActionComponent 
                    isLoading={mode === "createMode" ? isLoading : isEditLoading }
                    title={mode === "createMode" ? "Submit" : "Update"}
                />
            </form>
        </>
    )
}

export default CategoryFormComponent