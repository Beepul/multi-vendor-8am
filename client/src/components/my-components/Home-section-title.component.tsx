type Props = {
    cn?: string, 
    titleCN?: string, 
    descriptionCN?: string, 
    title: string, 
    description?: string
}

const HomeSectionTitle = ({cn,titleCN,descriptionCN, title, description}: Props) => {
    return (
        <>
            <div className={`${cn}`}>
                <h3 className={`text-2xl leading-loose font-semibold ${titleCN}`}>{title}</h3>
                <p className={`${descriptionCN}`}>{description}</p>
            </div>
        </>
    )
}

export default HomeSectionTitle