import React, { useState, useEffect } from 'react';
import { Card, Typography, Layout, Button, message, Form, Input, Space } from 'antd';
import { LoginOutlined, UserAddOutlined, SolutionOutlined, UserOutlined, LockOutlined, CloseCircleOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import loginUser from '../api/integrated/loginAPI';

const { Title, Paragraph, Text } = Typography;
const { Content } = Layout;

const FEATURES = [
    {
        key: 'summary',
        title: "법률안 요약",
        description: "방대한 법률안을 핵심만 요약하여 제공합니다.",
        detail: "최신 AI 기술로 법률안의 주요 변경 사항과 영향을 빠르게 파악할 수 있습니다.",
        image: '/img1.png',
    },
    {
        key: 'recommendation',
        title: "맞춤 법안 추천",
        description: "북마크 기반으로 관심 법안을 자동으로 추천합니다.",
        detail: "관심사를 분석하여 놓치지 말아야 할 법안을 제시합니다.",
        image: '/img2.png',
    },
    {
        key: 'discussion',
        title: "시민 토론 공간",
        description: "관심 있는 법안에 대해 자유롭게 의견을 나누세요.",
        detail: "다양한 시민들의 의견을 확인하며 목소리를 낼 수 있습니다.",
        image: '/img3.png',
    },

];


const LoginForm = ({ navigate }) => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        setLoading(true);
        const { uid, password } = values;

        try {
            const loginData = { uid, password };
            const res = await loginUser(loginData);

            if (res.status === 200 && res.body.accessToken) {
                const greetingName = res.body.nickName || res.body.name || uid;
                // [수정] 성공 메시지
                message.success(`${greetingName}님 환영합니다!`);
                navigate('/mainsearch');
            } else if (res.code === "AE2") {
                message.error("아이디 혹은 비밀번호가 올바르지 않습니다.");
                localStorage.removeItem("accessToken");
            }
            else {
                const errorMessage = res.message || '로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.';
                message.error(errorMessage);
                localStorage.removeItem("accessToken");
            }

        } catch (error) {
            const errorMessage = error.message || '네트워크 연결 또는 서버 오류가 발생했습니다.';
            message.error(errorMessage);
            localStorage.removeItem("accessToken");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card style={{ padding: '20px', textAlign: 'center' }}>
            <Title level={4}>LegisLink 서비스 이용</Title>
            <Paragraph>로그인 후 모든 기능을 이용해 보세요.</Paragraph>

            <Form form={form} onFinish={onFinish} layout="vertical">
                <Form.Item
                    name="uid"
                    rules={[{ required: true, message: '아이디를 입력해주세요.' }]}
                >
                    <Input prefix={<UserOutlined />} placeholder="아이디" size="large" />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[{ required: true, message: '비밀번호를 입력해주세요.' }]}
                >
                    <Input.Password prefix={<LockOutlined />} placeholder="비밀번호" size="large" />
                </Form.Item>

                <Space direction="vertical" style={{ width: '100%' }}>
                    <Button
                        type="primary"
                        size="large"
                        icon={<LoginOutlined />}
                        htmlType="submit"
                        style={{ width: '100%' }}
                        loading={loading}
                    >
                        로그인
                    </Button>
                    <Button
                        type="default"
                        size="large"
                        icon={<UserAddOutlined />}
                        style={{ width: '100%' }}
                        onClick={() => navigate('/signup')}
                    >
                        회원가입
                    </Button>
                </Space>
            </Form>
        </Card>
    );
};


const ImageDetailView = ({ feature, onSelectFeature }) => {
    const currentIndex = FEATURES.findIndex(f => f.key === feature.key);
    const totalFeatures = FEATURES.length;

    const handleNext = () => {
        const nextIndex = (currentIndex + 1) % totalFeatures;
        onSelectFeature(FEATURES[nextIndex].key);
    };

    const handlePrev = () => {
        const prevIndex = (currentIndex - 1 + totalFeatures) % totalFeatures;
        onSelectFeature(FEATURES[prevIndex].key);
    };

    return (
        <div style={styles.imageGalleryContainer}>
            <Button
                type="text"
                icon={<CloseCircleOutlined style={{ fontSize: '24px', color: '#096dd9' }} />}
                onClick={() => onSelectFeature(null)}
                style={styles.closeButton}
            />

            <Title level={3} style={{ color: '#096dd9', marginTop: 0, marginBottom: 8 }}>
                {feature.title}
            </Title>
            <Paragraph style={{ fontSize: '16px', marginBottom: 8, color: '#595959' }}>
                {feature.detail}
            </Paragraph>

            <div style={styles.imageWrapper}>
                <img
                    src={feature.image}
                    alt={feature.title}
                    style={styles.featureImage}
                />
            </div>

            <Button
                icon={<LeftOutlined />}
                onClick={handlePrev}
                size="large"
                type="primary"
                shape="circle"
                style={styles.swipeButtonLeftOuter}
            />
            <Button
                icon={<RightOutlined />}
                onClick={handleNext}
                size="large"
                type="primary"
                shape="circle"
                style={styles.swipeButtonRightOuter}
            />

            <Text style={{ marginTop: '10px', color: '#595959' }}>
                {currentIndex + 1} / {totalFeatures}
            </Text>
        </div>
    );
};


const ServiceIntro = ({ selectedFeature, onSelectFeature }) => {

    const currentDetail = FEATURES.find(f => f.key === selectedFeature);

    const isDetailViewActive = selectedFeature !== null;

    return (
        <div style={styles.introContainer}>
            <Title level={2} style={{ color: '#096dd9', marginBottom: '20px' }}>
                LegisLink: 당신의 손안의 국회
            </Title>

            <Paragraph style={{ fontSize: '18px', color: '#595959', marginBottom: '40px' }}>
                복잡한 법률안 정보, 한 눈에 확인하세요.
            </Paragraph>


            <div style={{
                transition: 'opacity 0.5s ease, transform 0.5s ease',
                opacity: isDetailViewActive ? 1 : 0,
                transform: `scale(${isDetailViewActive ? 1 : 0.95})`,
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: isDetailViewActive ? 'auto' : 'none',
                zIndex: 5,
            }}>
                {isDetailViewActive && currentDetail && (
                    <ImageDetailView
                        feature={currentDetail}
                        onSelectFeature={onSelectFeature}
                    />
                )}
            </div>

            <div style={{
                opacity: isDetailViewActive ? 0 : 1,
                transition: 'opacity 0.5s ease, transform 0.5s ease',
                transform: `scale(${isDetailViewActive ? 1.05 : 1})`,
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: isDetailViewActive ? 'none' : 'auto',
                zIndex: 4,

                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                paddingTop: '80px',
            }}>
                <div style={styles.featureGrid}>
                    {FEATURES.map((feature) => (
                        <Card
                            key={feature.key}
                            title={feature.title}
                            bordered={false}
                            style={{
                                ...styles.featureCard,
                                cursor: 'pointer',
                                minHeight: 180,
                            }}
                            bodyStyle={{ padding: '24px' }}
                            onClick={() => onSelectFeature(feature.key)}
                        >
                            <SolutionOutlined style={styles.featureIcon} />
                            <Paragraph style={{ margin: 0 }}>{feature.description}</Paragraph>
                        </Card>
                    ))}
                </div>
            </div>

        </div>
    );
};


const AuthLanding = () => {
    const navigate = useNavigate();
    const [selectedFeature, setSelectedFeature] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            navigate('/mainsearch', { replace: true });
        }
    }, [navigate]);

    return (
        <Content style={styles.content}>
            <div style={styles.mainContainer}>
                <div style={styles.leftPanel}>
                    <ServiceIntro
                        selectedFeature={selectedFeature}
                        onSelectFeature={setSelectedFeature}
                    />
                </div>

                <div style={styles.rightPanel}>
                    <LoginForm navigate={navigate} />
                </div>
            </div>
        </Content>
    );
};

const styles = {
    content: {
        minHeight: '100vh',
        backgroundColor: '#f0f2f5',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '50px 0',
    },
    mainContainer: {
        display: 'flex',
        width: '90%',
        maxWidth: 1320,
        backgroundColor: '#fff',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        borderRadius: 12,
        minHeight: 600,
        overflow: 'hidden',
    },
    leftPanel: {
        flex: 4,
        padding: '40px',
        backgroundColor: '#e6f7ff',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        flexDirection: 'column',
        textAlign: 'center',
        position: 'relative',
        minHeight: 600,
    },
    rightPanel: {
        flex: 1.8,
        padding: '40px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    introContainer: {
        width: '100%',
        textAlign: 'left',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        height: '100%',
    },
    featureGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '20px',
        marginTop: '30px',
        marginBottom: '20px',
    },
    featureCard: {
        textAlign: 'center',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
        transition: 'all 0.3s, border 0.2s',
    },
    featureIcon: {
        fontSize: '32px',
        color: '#1890ff',
        marginBottom: '10px',
    },
    imageGalleryContainer: {
        position: 'relative',
        width: '100%',
        height: '100%',
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: 8,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        minHeight: 520,
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 10,
    },
    imageWrapper: {
        flex: 1,
        width: '100%',
        maxWidth: '90%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        marginTop: 5,
        marginBottom: 5,
    },
    featureImage: {
        width: '100%',
        maxHeight: 350,
        objectFit: 'contain',
        borderRadius: 4,
        transition: 'opacity 0.5s ease',
    },
    swipeButtonLeftOuter: {
        position: 'absolute',
        left: 20,
        top: '55%',
        transform: 'translateY(-50%)',
        opacity: 0.8,
        zIndex: 15,
    },
    swipeButtonRightOuter: {
        position: 'absolute',
        right: 20,
        top: '55%',
        transform: 'translateY(-50%)',
        opacity: 0.8,
        zIndex: 15,
    },
};

export default AuthLanding;