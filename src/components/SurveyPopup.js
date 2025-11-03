import React from 'react';
import { Card, Button, Typography, Space } from 'antd';
import { CloseOutlined, QuestionCircleOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const SurveyPopup = ({ isVisible, onClose, surveyLink }) => {
    const containerClass = `survey-popup-container ${isVisible ? 'visible' : ''}`;

    return (
        <div className={containerClass}>
            <Card
                size="small"
                title={
                    <Space size={4}>
                        <QuestionCircleOutlined style={{ color: '#1890ff' }} />
                        <Text strong>사용자 설문조사</Text>
                    </Space>
                }
                extra={<Button type="text" icon={<CloseOutlined />} onClick={onClose} size="small" />}
                style={{ width: 300, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)' }}
                headStyle={{ padding: '8px 12px' }}
                bodyStyle={{ padding: '8px 12px' }}
            >
                <Paragraph style={{ marginBottom: 12 }}>
                    더 나은 서비스를 위해 잠시 시간을 내어 설문에 참여해 주시겠어요?
                </Paragraph>
                <div style={{ textAlign: 'right' }}>
                    <Button
                        type="primary"
                        href={surveyLink}
                        target="_blank"
                        onClick={onClose}
                    >
                        설문 참여하기
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default SurveyPopup;
