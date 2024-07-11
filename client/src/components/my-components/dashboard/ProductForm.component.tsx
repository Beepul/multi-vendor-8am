import { Controller, useFieldArray, useForm } from "react-hook-form";
import { IoArrowBackSharp } from "react-icons/io5";
import * as Yup from 'yup'
import { yupResolver } from "@hookform/resolvers/yup";
import AsyncSelect from 'react-select/async';
import axios from "axios";
import { useEffect, useState } from "react";
import debounce from "debounce-promise";
import { HiPhoto } from "react-icons/hi2";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/auth.context";
import { useCreateProduct, useEditProduct } from "../../../api/Product.api";
import { InputTextField, TextAreaField } from "../common/form";
import FormActionComponent from "../common/form/Form-Action.component";
import { Category, Product } from "../../../types";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Button } from "../../ui/button";
import { Plus } from "lucide-react";
import axiosInstance from "../../../config/axios.config";
import useDebouncedQuery from "../../../hooks/useDebouncedQuery";
import { fetchCatOptions } from "../../../api/Category.api";
import { fetchBrandOptions } from "../../../api/Brand.api";
import Select from 'react-select'
import { transformIntoFormData } from "../../../lib/utils";

const statusOptions = [
    { value: 'active', label: 'Publish' },
    { value: 'inactive', label: 'Unpublish' },
]

const debouncedFetchCatOptions = debounce(fetchCatOptions, 1000);
const debouncedFetchBrandOptions = debounce(fetchBrandOptions, 1000);

interface ValidationContext {
    isCreating: boolean;
}

const AddProductDTO = Yup.object({
    title: Yup.string().required().min(2).max(100),
    summary: Yup.string().required().min(10).max(300),
    description: Yup.string().optional().max(400),
    price: Yup.number().required().min(100).nullable().default(0),
    discount: Yup.number().required().min(0).max(90).nullable(),
    categories: Yup.array(Yup.object({value: Yup.mixed(), label: Yup.string()})).optional().nullable(),
    brand: Yup.object({value: Yup.mixed(), label: Yup.string()}).optional().nullable(),
    isFeatured: Yup.bool().required().default(false),
    stock: Yup.number().min(1).required(),
    colors: Yup.array().of(Yup.object({value: Yup.string().required()})),
    images: Yup.array(Yup.mixed()).test(
        'images-required',
        'Images are required',
        function (value) {
            const context = this.options.context as ValidationContext;
            if (context.isCreating && (!value || value.length === 0)) {
                return false;
            }
            return true;
        }
    ),
    status: Yup.string().matches(/(active|inactive)/, "Please select on of the option").required().default("inactive"),
});

export type CreateProductDTOType = Yup.InferType<typeof AddProductDTO> 

const AllowImage = ['image/png','image/jpg','image/jpeg','image/webp']

type Props = {
    purpose?: "create" | "edit" ,
    product?: Product
}

const ProductFormComponent = ({purpose="create", product}: Props) => {

    const getCatOptions = async (inputValue: string) => {
        const options = await debouncedFetchCatOptions(inputValue);
        return options || [];
    };

    const getBrandOptions = async (inputValue: string) => {
        const options = await debouncedFetchBrandOptions(inputValue);
        return options || [];
    };

    const {loggedInUser} = useAuth()
    const [existingImages, setExisitingImages] = useState<string[] | null>(null)
    const [selectedImages, setSelectedImages] = useState<File[]>([])
    const [imagesError, setImagesError] = useState<string | null>(null)
   
    const {control, formState: {errors}, watch, register, handleSubmit, setValue, reset, setError, setFocus} = useForm({
        defaultValues: {
            title: "",
            summary: "",
            description: "",
            price: 0,
            discount: 0,
            categories: [],
            brand: null,
            isFeatured: false,
            images: undefined,
            stock: 0,
            colors: [{value: ""}],
            status: "inactive",
        },
        resolver: yupResolver(AddProductDTO),
        context: {
            isCreating: purpose === "create"
        }
    })

    const {fields,append,remove} = useFieldArray({
        control,
        name: 'colors'
    })

    const {createProduct, isLoading, isSuccess, error} = useCreateProduct()

    const {editError,editProduct,isEditLoading,isEditSuccess} = useEditProduct()

    const handleProductSubmit = (data: any) => {
        const transformedData = {...data}
        
        if(data.brand) transformedData.brand = data.brand.value
        
        if(data.categories && data.categories?.length > 0){
            transformedData.categories = data.categories.map((cat:{value: string}) => cat.value)
        }else {
            transformedData.categories = []
        }
        if (data.colors && data.colors.length > 0) {
            transformedData.colors = data.colors.map((color: {value: string}) => color.value);
        } else {
            transformedData.colors = [];
        }

        const formData = transformIntoFormData(transformedData)

        if(purpose === "edit" && product){
            editProduct({
                id: product?._id,
                payload: formData
            })
        }else {
            createProduct(formData)
        }
    };

    const handleUploadImage = (files: FileList) => {
        const fileArray = Array.from(files)
        setImagesError(null)
        if(files && fileArray.length <= 0){
            setImagesError("Please select at least one image of the product")
            return
        }
        let imgErr = null

        fileArray.map((file) => {
            if(!AllowImage.includes(file.type)){
                imgErr = "One of the image is not a valid type, please select again."
                return 
            }
            if(file.size > 500000){
                imgErr = "One of the image have large size. Try keeping it minimum 500kb."
                return 
            }
            return 
        })
        
        if(imgErr){
            setImagesError(imgErr)
        }else {
            setSelectedImages(fileArray)
            setValue("images",fileArray)
            setError("images", {
                message: "",
            })
        }
    }

    useEffect(() => {
        if(purpose == "edit"){
            if(!isEditSuccess && editError){
                toast.error((editError as any).message, {
                    closeOnClick: true,
                    draggable: true
                })
                return
            }
            if(isEditSuccess){
                toast.success("Product has been updated successfully", {
                    draggable: true,
                    closeOnClick: true
                })
                setImagesError(null)
                return 
            }
        }else {
            if(!isSuccess && error){
                toast.error((error as any).message, {
                    closeOnClick: true,
                    draggable: true
                })
                return
            }
            if(isSuccess){
                toast.success("Product has been created, Admin will now verify your product. Wait until further notice.", {
                    draggable: true,
                    closeOnClick: true
                })
                reset()
                setSelectedImages([])
                setImagesError(null)
                return 
            }
        }

    },[isSuccess, error, isEditSuccess, editError])

    useEffect(() => {
        if(purpose === "edit" && product){
            console.log(product)
            setValue("title", product.title)
            setValue("summary", product.summary)
            setValue("description", product.description)
            setValue("price", product.price)
            setValue("discount", product.discount)
            setValue("status", product.status)
            if(product.categories && product.categories.length > 0){
                const formatedCat = product.categories.map((cat) => {
                    return {
                        value: cat._id,
                        label: cat.title
                    }
                })
                setValue("categories", formatedCat)
            }
            if(product.brand){
                setValue("brand", {value: product.brand._id, label: product?.brand.title})
            }
            setValue("isFeatured", product.isFeatured)
            setValue("stock", product.stock)
    
            if(product.colors){
                const colors = product.colors?.map((color) => {
                    return {
                        value: color
                    }
                })
                setValue("colors", colors)
            }
            if(product.images){
                setExisitingImages(product.images)
            }
        }
    },[purpose,product])

    // console.log(fields, watch())

    return (
        <>
            <form onSubmit={handleSubmit(handleProductSubmit)}>
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
                    <label htmlFor="summary" className="block text-sm font-medium leading-6 text-gray-900">
                        Summary
                    </label>
                    <div className="mt-2">
                        <TextAreaField 
                            control={control}
                            name="summary"
                            placeholder="Enter your product summary"
                            errMsg={errors.summary?.message}
                        />
                    </div>
                </div>
                <div className="mb-6">
                    <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                        Description (optional)
                    </label>
                    <div className="mt-2">
                        <TextAreaField 
                            control={control}
                            name="description"
                            placeholder="Enter your product description"
                            errMsg={errors.description?.message}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-8">
                    <div className="mb-6">
                        <label htmlFor="price" className="block text-sm font-medium leading-6 text-gray-900">
                            Price
                        </label>
                        <div className="mt-2">
                            <InputTextField 
                                control={control}
                                name="price"
                                placeholder="Eg: 1000"
                                errMsg={errors.price?.message}
                            />
                        </div>
                    </div>
                    <div className="mb-6">
                        <label htmlFor="discount" className="block text-sm font-medium leading-6 text-gray-900">
                            Discount in '%' (optional)
                        </label>
                        <div className="mt-2">
                            <InputTextField 
                                control={control}
                                name="discount"
                                placeholder="Eg: 10"
                                errMsg={errors.discount?.message}
                            />
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-8 mb-6">
                    <div>
                        <label htmlFor="stock" className="block text-sm font-medium leading-6 text-gray-900">
                            Stock
                        </label>
                        <div className="mt-2">
                            <InputTextField 
                                control={control}
                                name="stock"
                                placeholder="Eg: 100"
                                errMsg={errors.stock?.message}
                            />
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor={`colors.${fields.length-1}.value`} className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                                Add color of your product (optional)
                            </label>
                            <Button 
                                type="button"
                                // size={'icon'}
                                className="p-0 bg-transparent text-gray-800 hover:bg-transparent text-sm h-auto pb-1"
                                // variant={'primary'} 
                                onClick={() => append({ value: "" })}
                                ><span className="text-blue-800 underline mr-1 hover:text-blue-700">Click here</span> to add another color</Button>
                        </div>
                        {fields?.map((field,i) => (
                            <div key={field.id} className="flex mb-2 items-center">
                                <InputTextField 
                                    control={control}
                                    name={`colors.${i}.value`}
                                    placeholder="Enter your product color"
                                    errMsg={errors.colors?.message}
                                />
                                <Button 
                                    type="button"
                                    onClick={() => remove(i)}
                                    size={"sm"}
                                >Remove</Button>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-8 mb-6">
                    <div>
                        <label htmlFor="categories" className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                            Select categories
                        </label>
                        <Controller 
                            name="categories"
                            control={control}
                            render={({field}) => (
                                <AsyncSelect 
                                    {...field}
                                    id="categories"
                                    isMulti 
                                    cacheOptions 
                                    loadOptions={getCatOptions} 
                                    onChange={(selectedOptions) => field.onChange(selectedOptions)}
                                />
                            )}
                        />
                    </div>
                    <div>
                        <label htmlFor="brand" className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                            Select brand of your product
                        </label>
                        <Controller 
                            name="brand"
                            control={control}
                            render={({field}) => (
                                <AsyncSelect 
                                    {...field}
                                    id="brand"
                                    cacheOptions 
                                    loadOptions={getBrandOptions} 
                                    onChange={(selectedOptions) => field.onChange(selectedOptions)}
                                />
                            )}
                        />
                    </div>
                </div>
                {
                    loggedInUser?.role === 'admin' && (
                        <div className="grid grid-cols-2 gap-8">
                            <div className="mb-6">
                                <label htmlFor="status" className="block text-sm font-medium leading-6 text-gray-900">
                                    Status
                                </label>
                                <div className="mt-2">
                                    <Select 
                                        options={statusOptions} 
                                        id="status"
                                        defaultValue={{label: product?.status === "active" ? "Publish" : "Unpublish", value: product?.status as string}}
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
                    )
                }
                <div className="mb-6">
                    <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">
                        Upload product images
                    </label>
                    <div className={`mt-2 flex justify-center rounded-lg border border-dashed  px-6 py-10 ${(imagesError || errors.images?.message) ? 'border-red-600' : 'border-gray-900/25'}`}>
                        <div className="w-full">
                            <div className="flex gap-6 justify-center">
                                {(selectedImages && selectedImages.length > 0) ? selectedImages.map((file,i) => (
                                    <LazyLoadImage 
                                        className="flex-1 max-w-[200px] object-cover" 
                                        src={URL.createObjectURL(file)} 
                                        alt="" 
                                        key={`product-image-${i}`}
                                        effect="blur"
                                        />
                                )): existingImages ? existingImages.map((img, i) => (
                                    <LazyLoadImage 
                                        className="flex-1 max-w-[200px] object-cover" 
                                        src={import.meta.env.VITE_IMAGE_URL+'/uploads/product/'+img} 
                                        alt="" 
                                        key={`product-image-${i}`}
                                        crossOrigin="anonymous"
                                        effect="blur"
                                        />
                                )) : (<>
                                    <HiPhoto className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                                </>)}
                            </div>
                            <div className="mt-4 text-center text-sm leading-6 text-gray-600">
                            <label
                                htmlFor="poduct-images"
                                className="relative cursor-pointer rounded-md  font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                            >
                                <span>Upload a file</span>
                                <input 
                                id="poduct-images" 
                                name="poduct-images" 
                                type="file" 
                                className="sr-only" 
                                multiple
                                onChange={(e) => {
                                    if(e.target.files){
                                    handleUploadImage(e.target.files)
                                    }
                                }}
                                />
                            </label>
                            </div>
                            <p className="text-xs text-center mt-1 text-gray-600">PNG, JPG, JPEG, Webp up to 500kb</p>
                            <span className="text-md text-red-400 text-center inline-block w-full">{imagesError || errors.images?.message}</span>
                        </div>
                    </div>
                </div>
                <div className="mb-6 flex gap-2">
                    <input 
                        type="checkbox" 
                        id="isFeatured" 
                        className="cursor-pointer"
                        {...register("isFeatured")}  
                    />
                    <label htmlFor="isFeatured" className="block text-sm font-medium leading-6 text-gray-900">
                        Make this product as featured product?
                    </label>
                </div>
                <FormActionComponent 
                    isLoading={isLoading}
                    title={purpose === "edit" ? "Update" : "Submit"}
                />
            </form>
        </>
    )
}

export default ProductFormComponent