import { useState } from "react";

const ReviewForm = () => {
    const [content, setContent] = useState('')
    const [rating, setRating] = useState(5)

    const hendleSubmit = () => {
        onSubmiy = ({content, rating})
        setContent('')
        setRating(5)
    }

    return (
        <div>
            <h4>리뷰 작성</h4>
            <textarea
                value={content}
                onChange={(e) => setContent(e.textarea.value)}
            />
            
            <input
                type="number"
                min={1}
                max={5}
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
            />

            <button onClick={hendleSubmit}>작성</button>
        </div>
    )
}

export default ReviewForm;