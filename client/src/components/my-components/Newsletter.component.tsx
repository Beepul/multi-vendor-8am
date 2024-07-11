
const NewsLetterComponent = () => {
    return (
        <>
            <div className="mx-auto max-w-screen-xl px-4 pb-6 pt-0 sm:px-6 lg:px-8 lg:pt-16">
                <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2 pb-16 border-b border-gray-100">
                    <div className="max-w-xl lg:max-w-lg">
                        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Subscribe to our newsletter.</h2>
                        <p className="mt-4 text-lg leading-8 text-gray-300">
                        Nostrud amet eu ullamco nisi aute in ad minim nostrud adipisicing velit quis. Duis tempor incididunt
                        dolore.
                        </p>
                    </div>
                    <div className="flex justify-end">
                        <div className="mt-6 flex gap-x-4 justify-end items-center w-full max-w-md">
                            <label htmlFor="email-address" className="sr-only">
                                Email address
                            </label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="min-w-0 flex-auto rounded-md border-0 bg-white/5 px-5 py-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 focus:outline-none placeholder:text-gray-200"
                                placeholder="Enter your email"
                            />
                            <button
                                type="submit"
                                className="flex-none rounded-md bg-indigo-500 px-5 py-3 transition-all duration-300 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                            >
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default NewsLetterComponent