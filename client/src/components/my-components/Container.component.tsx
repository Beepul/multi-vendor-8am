type Props = {
    children: React.ReactNode, 
    cn?: string,
    fluid?: boolean,
    noPaddingAround?: boolean
}


const ContainerComponent = ({children, cn, fluid, noPaddingAround}: Props) => {

    return (<>
        <section className={`mx-auto ${cn} ${fluid ? 'max-w-full' : 'max-w-screen-xl'} ${noPaddingAround ? 'p-0' : 'py-4 lg:py-6 px-4 sm:px-6 lg:px-8'}`}>
            {children}
        </section>
    </>)
}


export default ContainerComponent