const PlaceInfoPanel = () => {
    if (!place) return null;

    return (
        <div style={{
            border: '1px solid #ddd',
            padding: '15px',
            borderRadius: '8px',
            backgroundColor: '#fafafa',
            marginTop: '10px',
        }}>
            <h2>{place.name}</h2>
            <p><strong>카테고리:</strong> {place.category}</p>
            <p><strong>주소:</strong> {place.address}</p>
            <p><strong>전화번호:</strong> {place.phone || '정보 없음'}</p>
            {place.imageUrl && (
                <img
                    src={place.imageUrl}
                    alt={place.name}
                    style={{ width: '100%', borderRadius: '8px', marginTop: '10px' }}
                />
            )}
        </div>
    )
}