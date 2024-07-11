export type Shop = {
    _id: string,
    name: string,
    about?: string,
    profileImg?: string,
    bannerImg?: string,
    phoneNumber: string,
    email: string,
    addressLine1: string,
    addressLine2?: string, 
    createdAt: string,
    // ratings: [],
    createdBy: {
        _id: string,
        name: string,
        email: string,
        role: "customer" | "seller" | "admin"
    },
    sellerId: {
        _id: string,
        name: string,
        email: string,
        role: "customer" | "seller" | "admin"
    },
    updatedBy?: {
        _id: string,
        name: string,
        email: string,
        role: "customer" | "seller" | "admin"
    },

}

export type User = {
    _id: string,
    name: string,
    email: string,
    role: "customer" | "seller" | "admin",
    status: "active" | "inactive",
    image?: string | null,
    phone?: string | null,
}


type Token = {
    accessToken: string,
    refreshToken: string
}

export type UserWithToken = {
    detail: User,
    token: Token
}


export type Product = {
    _id: string,
    title: string,
    slug: string,
    categories: {
        _id: string, 
        title: string,
        slug: string,
    }[] | null,
    brand: {
        _id: string, 
        title: string,
        slug: string,
    } | null,
    isFeatured: boolean,
    summary: string,
    description?: string,
    price: number,
    discount: number,
    afterDiscount: number,
    status: "active" | "inactive",
    images?: string[],
    colors?: string[] | null,
    stock: number,
    createdAt: string,
    updatedAt?: string,
    shopId: {
        _id: string,
        name: string,
        profileImg?: string,
        about?: string,
    },
    createdBy: {
        _id: string,
        name: string,
        email: string,
        role: "customer" | "seller" | "admin"
    },
    updatedBy?: {
        _id: string,
        name: string,
        email: string,
        role: "customer" | "seller" | "admin"
    },
}

export type Brand = {
    _id: string,
    title: string,
    slug: string,
    status: "active" | "inactive",
    image: string,
    createdBy: string,
    updatedBy: string | null,
    createdAt: string, 
    updatedAt: string,
    homeSection?: boolean
}



export type Category = {
    _id: string,
    title: string,
    image: string,
    parentId: {
        _id: string,
        title: string,
        slug: string
    } | null,
    slug: string,
    status: "active" | "inactive",
    createdAt: string,
    createdBy: {
        _id: string,
        name: string,
        email: string,
        role: "admin" | "seller" | "customer",
    }
}

type CatResponse = {
    result: Category[]
    meta: any 
    message: string,
}