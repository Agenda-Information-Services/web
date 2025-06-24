import React, { useEffect, useState } from 'react';
import { Table, message, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getMyBookmarks } from '../api/mypage/myBookmarkAPI';

const MyBookmarks = () => {
    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBookmarks = async () => {
            try {
                const data = await getMyBookmarks();
                setBookmarks(data);
            } catch (error) {
                message.error("북마크 목록을 불러오는데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchBookmarks();
    }, []);

    const columns = [
        {
            title: '법안 제목',
            dataIndex: 'billTitle',
            key: 'billTitle',
            width: '70%',
        },
        {
            title: '발의자',
            dataIndex: 'proposerName',
            key: 'proposerName',
            align: 'center',
        },
    ];

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>;
    }

    return (
        <Table
            columns={columns}
            dataSource={bookmarks}
            rowKey="billId"
            onRow={(record) => ({
                onClick: () => navigate(`/bills/${record.billId}`),
                style: { cursor: 'pointer' },
            })}
            pagination={{ pageSize: 10 }}
        />
    );
};

export default MyBookmarks;