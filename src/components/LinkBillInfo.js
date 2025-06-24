import React, { useState } from 'react';
import { message } from 'antd';
import apiClient from '../api/apiClient';
import BillInfoIcon from '../assets/icons/BillInfoIcon.png';


const LinkBillInfo = ({ billId }) => {
    const [loading, setLoading] = useState(false);

    const handleDownload = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get(`/bills/${billId}/link`);
            const { link } = response.data;
            
            window.open(link, '_blank');
        } catch (error) {
            console.error('링크 가져오는 중 오류 발생:', error);
            message.error('링크를 가져오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <img
            src={BillInfoIcon}
            alt="의안정보시스템에서 보기"
            onClick={handleDownload}
            style={{
                width: 'auto',
                height:'20px',
                cursor: 'pointer',
                marginLeft: '10px',
                opacity: loading ? 0.5 : 1,
                transition: 'opacity 0.3s'
            }}
        />
    );
};

export default LinkBillInfo;
