import { Controller, useFieldArray, useForm } from "react-hook-form";
import SectionTitleComponent from "../../components/my-components/dashboard/Section-title.component"
import { useAuth } from "../../context/auth.context"
import { IoArrowBackSharp } from "react-icons/io5";
import * as Yup from 'yup'
import { yupResolver } from "@hookform/resolvers/yup";
import { InputTextField, TextAreaField } from "../../components/my-components/common/form";
import FormActionComponent from "../../components/my-components/common/form/Form-Action.component";
import AsyncSelect from 'react-select/async';
import axios from "axios";
import { useEffect, useState } from "react";
import debounce from "debounce-promise";
import { HiPhoto } from "react-icons/hi2";
import { CreateProductPayload, useCreateProduct } from "../../api/Product.api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ProductFormComponent from "../../components/my-components/dashboard/ProductForm.component";

const getOptions = debounce(async (value) => {
    if (!value) {
      return Promise.resolve({ options: [] });
    }
    const response = await axios.get(
      `https://jsonplaceholder.typicode.com/users?name_like=${value}`
    );
  
    const names = response.data.map((name: any) => {
      return {
        value: name.id,
        label: name.name
      };
    });
  
    console.log(names);
  
    return names;
  }, 1000);

const AddProductDTO = Yup.object({
    title: Yup.string().required().min(2).max(100),
    summary: Yup.string().required().min(10).max(300),
    description: Yup.string().optional().max(400),
    price: Yup.number().required().min(100).nullable().default(0),
    discount: Yup.number().required().min(0).max(90).nullable(),
    categories: Yup.array(Yup.object({value: Yup.mixed(), label: Yup.string()})).optional().nullable(),
    brand: Yup.object({value: Yup.mixed(), label: Yup.string()}).optional().nullable(),
    isFeatured: Yup.bool().required().default(false),
    images: Yup.array(Yup.mixed().required()).required()
})

export type CreateProductDTOType = Yup.InferType<typeof AddProductDTO> 

const AllowImage = ['image/png','image/jpg','image/jpeg','image/webp']

const AddProductPage = () => {
    const {loggedInUser} = useAuth()
    const [selectedImages, setSelectedImages] = useState<File[]>([])
    const [imagesError, setImagesError] = useState<string | null>(null)
   
    const {control, formState: {errors}, register, handleSubmit, setValue, reset} = useForm({
        defaultValues: {
            title: "",
            summary: "",
            description: "",
            price: 0,
            discount: 0,
            categories: null,
            brand: null,
            isFeatured: false,
            images: undefined
        },
        resolver: yupResolver(AddProductDTO)
    })

    const {createProduct, isLoading, isSuccess, error} = useCreateProduct()

    const handleProductSubmit = (data: CreateProductDTOType) => {
        const transformedData = {...data}

        if(data.brand) transformedData.brand = data.brand.value

        if(data.categories && data.categories?.length > 0){
            transformedData.categories = data.categories.map((cat) => cat.value)
        }else {
            transformedData.categories = []
        }

        const formData = new FormData()

        Object.entries(transformedData).forEach(([key, val]) => {
            if (key === "images") {
                // Append each file directly
                (val as File[]).forEach((file) => formData.append(key, file));
            } else if (Array.isArray(val)) {
                // Append each item in arrays
                val.forEach((item, index) => formData.append(`${key}[${index}]`, item as string));
            } else {
                formData.append(key, val as any);
            }
        });

        createProduct(formData)
    };

    const handleUploadImage = (files: FileList) => {
        const fileArray = Array.from(files)
        setImagesError(null)
        if(fileArray.length <= 0){
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
        }
    }

    useEffect(() => {
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

    },[isSuccess, error])

    return (
        <>
            <section className="py-5">
                <SectionTitleComponent 
                    title={'Create New Product'}
                    link={`/${loggedInUser?.role}/products`}
                    linkText={<IoArrowBackSharp className="text-xl" />}
                />
                <div>
                    <ProductFormComponent />
                </div>
            </section>
        </>
    )
}

export default AddProductPage