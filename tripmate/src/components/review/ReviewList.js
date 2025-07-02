const ReviewList = (reviews, onDelete) => {
    return (
        <div>
            <h4>리뷰 목록</h4>

            {reviews.map((review) => (
                <div key={reviews.id}
                    style={{border: '1px solid #ccc', padding: 10, margin: 5}}
                >
                    <p>{review.content}</p>
                    <p>평점 : {review.rating}</p>
                    <button onClick={() => onDelete(review.id)}>삭제</button>
                </div>
            ))}
        </div>
    )
}

export default ReviewList;