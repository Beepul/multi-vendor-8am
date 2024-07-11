import { LazyLoadImage } from "react-lazy-load-image-component"
import { Product } from "../../types"
import imagePlaceholder from "../../assets/placeholder-image.png"
import { useState } from "react"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Label } from "../ui/label"
import { Button } from "../ui/button"
import { MessageCircle, Minus, Plus, ShoppingBag } from "lucide-react"
import { useAuth } from "../../context/auth.context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"

const PreviewProductComponent = ({product, mode="preview"}: {product: Product, mode?: "preview" | "overview"}) => {
    const {loggedInUser} = useAuth()

    const [selectedQnty, setSelectedQnty] = useState(0)
    const [selectedColor, setSelectedColor] = useState<string | null>(null)

    let imageUrl = imagePlaceholder

    if(product.images && product.images.length > 0){
        imageUrl = import.meta.env.VITE_IMAGE_URL + "/uploads/product/" + (product.images[0] || product.images[1])
    }

    const isPreviewMode = (loggedInUser?.role === "seller" || loggedInUser?.role === "admin") && mode === "preview"

    console.log(mode,isPreviewMode)

    
    return (
        <>
            <section className="grid grid-cols-2 gap-12 mb-8">
                <div>
                    <div className="mb-4">
                        <LazyLoadImage 
                            src={imageUrl}
                            alt=""
                            className="w-full max-h-[350px] object-cover inline-block"
                            effect="blur"
                            crossOrigin="anonymous"
                            onError={(e) => e.currentTarget.src = imagePlaceholder}
                            width={"100%"}
                        />
                    </div>
                    {
                        isPreviewMode && (
                            <div className="">
                                <div className="flex gap-3 items-center mb-2">
                                    <LazyLoadImage 
                                        src={import.meta.env.VITE_IMAGE_URL + "/uploads/shop/" + product.shopId.profileImg}
                                        alt=""
                                        className="w-full h-full object-cover rounded-full border-2 border-blue-800"
                                        effect="blur"
                                        crossOrigin="anonymous"
                                        onError={(e) => e.currentTarget.src = imagePlaceholder}
                                        width={50}
                                        height={50}
                                    />
                                    <div>
                                        <p className="text-blue-800 font-medium">{product.shopId.name}</p>
                                        <span className="text-gray-500 text-sm">(4.5) Ratings</span>
                                    </div>
                                </div>
                                <Button size={"sm"} className="gap-2 font-normal">Message <MessageCircle width={13}/></Button>
                            </div>
                        )
                    }
                </div>
                <div>
                    <h2 className="text-2xl font-semibold text-blue-800">{product.title}</h2>
                    <p className="mb-4">{product.summary}</p>
                    <p className="mb-2">
                        <span className="font-semibold mr-2">Price:</span> 
                        <span className="font-semibold">
                            ${product.afterDiscount}{" "}
                            <span className="line-through text-gray-400 font-normal">${product.price}{" "}</span>
                        </span>
                    </p>
                    <p className="font-semibold mb-2">
                        <span className="mr-2">Stock:</span>
                        {
                            product.stock === 0 ? <span className="text-red-400">Out of stock</span> :
                            <span>{product.stock}</span>
                        }
                    </p>
                    <p className="font-semibold mb-2">
                        <span className="mr-2">Sold:</span>
                        <span>0</span>
                    </p>
                    {product.colors && product.colors.length > 0 && (
                        <div className="font-semibold flex gap-1 mb-4">
                            <span className="mr-2">Color:</span>
                            <div className={`${isPreviewMode && 'pt-2'}`}>
                                {isPreviewMode ? (
                                    <RadioGroup defaultValue={product.colors[0]} onValueChange={(val) => setSelectedColor(val)}>
                                        {product.colors.map((color, i) => (
                                            <div className="flex items-center space-x-2" key={i}>
                                                <RadioGroupItem value={color} id={color} />
                                                <Label htmlFor={color} className="capitalize">{color}</Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                ): (
                                    <span className="capitalize">
                                        {product.colors.join(", ")}
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                    {
                        isPreviewMode && (
                            <>
                                <p className="font-semibold mb-1">Quantity:</p>
                                <div className="flex items-center gap-4">
                                    <div className="flex">
                                        <Button size={"sm"} className="h-auto rounded-e-none"
                                            onClick={() => {
                                                if(selectedQnty >= product.stock){
                                                    return
                                                }
                                                setSelectedQnty(prev => prev + 1)
                                            }}
                                        ><Plus width={14} height={14}/></Button>
                                        <p className="p-2 min-w-9 text-gray-900 font-semibold text-center bg-gray-300">{selectedQnty}</p>
                                        <Button size={"sm"} className="h-auto rounded-s-none"
                                            onClick={() => {
                                                if(selectedQnty <= 0){
                                                    return
                                                }
                                                setSelectedQnty(prev => prev - 1)
                                            }}
                                        ><Minus width={14} height={14} /></Button>
                                    </div>
                                    {
                                        selectedQnty > 0 && (
                                            <Button variant={"primary"}>Add to cart <ShoppingBag height={14}/></Button>
                                        )
                                    }
                                </div>
                            </>
                        )
                    }
                </div>
            </section>
            <section>
                <Tabs defaultValue="account" className="bg-indigo-50 px-9 pb-7 rounded-md">
                    <TabsList className="flex p-0 h-auto border-b-2 rounded-none">
                        <TabsTrigger  
                            className="flex-1 flex py-4 text-base rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-yellow-300"
                            value="product-details">Product Details</TabsTrigger>
                        <TabsTrigger  
                            className="flex-1 flex py-4 text-base rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-yellow-300"
                            value="reviews">Product Reviews</TabsTrigger>
                        <TabsTrigger  
                            className="flex-1 flex py-4 text-base rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-yellow-300"    
                            value="seller-info">Seller Information</TabsTrigger>
                    </TabsList>
                    <TabsContent 
                        className="mt-5"
                        value="product-details">
                        It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).
                    </TabsContent>
                    <TabsContent 
                        className="mt-5"
                        value="reviews">
                            <div className="min-h-[200px] flex items-center justify-center text-muted-foreground font-semibold">
                                <p>No Review Yet!</p>
                            </div>
                    </TabsContent>
                    <TabsContent 
                        className="mt-5"
                        value="seller-info"
                        >
                            <div className="flex justify-between">
                                <div className="max-w-[60%]">
                                    <div className="flex gap-3 items-center mb-2">
                                        <LazyLoadImage 
                                            src={import.meta.env.VITE_IMAGE_URL + "/uploads/shop/" + product.shopId.profileImg}
                                            alt=""
                                            className="w-full h-full object-cover rounded-full border-2 border-blue-800"
                                            effect="blur"
                                            crossOrigin="anonymous"
                                            onError={(e) => e.currentTarget.src = imagePlaceholder}
                                            width={50}
                                            height={50}
                                        />
                                        <div>
                                            <p className="text-blue-800 font-medium">{product.shopId.name}</p>
                                            <span className="text-gray-500 text-sm">(4.5) Ratings</span>
                                        </div>
                                    </div>
                                    <p>{product.shopId.about}</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-700 mb-1">Joined On: <span className="font-normal">29</span></p>
                                    <p className="font-semibold text-gray-700 mb-1">Total Products: <span className="font-normal">29</span></p>
                                    <p className="font-semibold text-gray-700 mb-3">Total Reviews: <span className="font-normal">29</span></p>
                                    <Button className="px-6 rounded-sm h-auto py-2.5">Visit Shop</Button>
                                </div>
                            </div>
                    </TabsContent>
                </Tabs>
            </section>
        </>
    )
}

export default PreviewProductComponent