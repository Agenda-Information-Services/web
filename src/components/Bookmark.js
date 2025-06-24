import React, { useState, useEffect } from 'react';
import { BookOutlined } from '@ant-design/icons';
import bookmarkAPI from '../api/userfnc/bookmarkAPI';

const Bookmark = ({ id }) => {
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // 북마크 상태 확인
    useEffect(() => {
        const checkBookmarkStatus = async () => {
            try {
                setIsLoading(true);
                const bookmarks = await bookmarkAPI.getBookmarks();
                // 북마크 목록에서 현재 법안 ID가 있는지 확인
                const isBookmarked = bookmarks.some(bookmark => Number(bookmark.billId) === Number(id));
                setIsBookmarked(isBookmarked);
            } catch (error) {
                console.error('북마크 상태 확인 중 오류 발생:', error);
            } finally {
                setIsLoading(false);
            }
        };
        checkBookmarkStatus();
    }, [id]);

    // 북마크 토글 처리
    const handleBookmark = async () => {
        try {
            if (isBookmarked) {
                // 북마크 삭제
                await bookmarkAPI.deleteBookmark(id);
                setIsBookmarked(false);
            } else {
                // 북마크 추가
                await bookmarkAPI.createBookmark(id);
                setIsBookmarked(true);
            }
        } catch (error) {
            console.error('북마크 처리 중 오류 발생:', error);
        }
    };

    if (isLoading) {
        return null;
    }

    return (
        <button 
            onClick={handleBookmark}
            className="bookmark-button"
            style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '5px',
                //marginRight: '10px',
                display: 'flex',
                alignItems: 'center'
            }}
            title={isBookmarked ? "북마크 삭제" : "북마크 추가"}
        >
            <BookOutlined 
                style={{ 
                    fontSize: '24px',
                    color: isBookmarked ? '#F3AD3C' : '#000000' ,
                    transition: 'color 0.3s ease'
                }} 
            />
        </button>
    );
};

export default Bookmark;
