import { IoStar, IoStarHalf } from "react-icons/io5";

type Props = {
    rating: number, 
    setRating: (star:number) => void, 
    readOnly?: boolean
}

const RatingReview = ({ rating, setRating, readOnly = false }: Props) => {
    return (
        <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => {
                const halfStar = star - 0.5;
                return (
                    <span key={star} style={{ cursor: readOnly ? 'default' : 'pointer'}}>
                        <span
                            className='text-xl'
                            style={{ color: rating >= star ? 'gold' : rating >= halfStar ? 'gold' : 'gray' }}
                            onClick={() => !readOnly && setRating(star)}
                        >
                            {rating >= star ? <IoStar /> : rating >= halfStar ? <IoStarHalf /> : <IoStar />}
                        </span>
                    </span>
                );
            })}
        </div>
    );
}

export default RatingReview;
