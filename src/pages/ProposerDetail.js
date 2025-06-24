import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Layout, Spin, message, Card } from "antd";
import apiClient from "../api/apiClient";

const { Content } = Layout;

const ProposerDetail = () => {
    const { proposerId } = useParams();
    const [proposer, setProposer] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProposer = async () => {
            try {
                const response = await apiClient.get(`/proposers/${proposerId}`);
                setProposer(response.data);
            } catch (error) {
                console.error("발의자 정보를 불러오는 중 오류 발생:", error);
                message.error("발의자 정보를 불러오는 데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchProposer();
    }, [proposerId]);

    if (loading) {
        return (
            <Layout>
                <Content style={styles.loading}>
                    <Spin size="large" />
                </Content>
            </Layout>
        );
    }

    if (!proposer) {
        return (
            <Layout>
                <Content style={styles.error}>
                    <p>발의자 정보를 찾을 수 없습니다.</p>
                </Content>
            </Layout>
        );
    }

    return (
        <Layout style={styles.layout}>
            <Content style={styles.content}>
                <h2>{proposer.name}</h2>

                <div style={{padding:"12px 0px"}}>
                <p><strong>정당:</strong> {proposer.party}</p>
                <p><strong>출생일:</strong> {proposer.birth}</p>
                <p><strong>직업:</strong> {proposer.job}</p>
                <p><strong>출신 지역:</strong> {proposer.origin}</p>
                <p><strong>소속 위원회:</strong> {proposer.committees}</p>
                </div>

                <p><strong>주요 경력:</strong></p>
                
                <Card>
                <pre style={{fontFamily:"inherit"}}>{proposer.memberTitle}</pre>
                </Card>
                
            </Content>
        </Layout>
    );
};

const styles = {
    layout: {
        height:"100vh",
        overflow:"hidden",
    },
    content: {
        height:"calc(100vh-180px)",
        overflowY:"auto",
        padding:"24px 20%",
    },
    loading: {
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    error: {
        padding: "40px",
        textAlign: "center",
    },
    pre: {
        whiteSpace: "pre-wrap",
        backgroundColor: "#f7f7f7",
        padding: "12px",
        borderRadius: "8px",
        fontFamily: "inherit",
    },
};

export default ProposerDetail;
