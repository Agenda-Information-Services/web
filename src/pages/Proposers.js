import React, { useState, useEffect } from "react";
import { Layout, List, Spin, message } from "antd";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";

const { Content } = Layout;

const Proposers = () => {
    const navigate = useNavigate();
    const [proposers, setProposers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });

    useEffect(() => {
        fetchProposers(1);
    }, []);

    const fetchProposers = async (page) => {
        try {
            setLoading(true);
            const response = await apiClient.get(`/proposers/search?keyword=&page=${page - 1}&size=10`);
            setProposers(response.data.content);
            setPagination({
                ...pagination,
                current: page,
                total: response.data.totalElements
            });
        } catch (error) {
            console.error('발의자 목록을 불러오는 중 오류 발생:', error);
            message.error('발의자 목록을 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page) => {
        fetchProposers(page);
    };

    const renderProposerItem = (item) => {
        return (
            <div 
                style={styles.textBlock}
                onClick={() => navigate(`/proposers/${item.id}`)}
            >
                <div style={styles.resultTitle}>{item.name}</div>
                <div style={styles.resultDescription}>
                    소속 정당: {item.party}<br></br>
                    직책: {item.career}<br></br>
                </div>
            </div>
        );
    };

    return (
        <Layout style={styles.layout}>
            <div style={styles.content}>
                {loading ? (
                    <div style={styles.loadingContainer}>
                        <Spin size="large" />
                    </div>
                ) : proposers.length > 0 ? (
                    <>
                        <div style={styles.searchInfo}>
                            등록된 발의자 목록: {pagination.total}명
                        </div>
                        <List
                            grid={{ gutter: 16, column: 1 }}
                            dataSource={proposers}
                            renderItem={renderProposerItem}
                            pagination={{
                                current: pagination.current,
                                pageSize: pagination.pageSize,
                                total: pagination.total,
                                onChange: handlePageChange,
                                showSizeChanger: false,
                                style: styles.pagination
                            }}
                        />
                    </>
                ) : (
                    <div style={styles.noResults}>
                        등록된 발의자 정보가 없습니다.
                    </div>
                )}
            </div>
        </Layout>
    );
};

const styles = {
    layout: {
        height: "100vh",
        overflow: "hidden",
        position: "relative",
        backgroundColor: "#fff",
    },
    content: {
        padding: "20px 20%",
        overflowY: "auto",
        height: "calc(100vh - 180px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    loadingContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
    },
    searchInfo: {
        marginBottom: "20px",
        fontSize: "1.2em",
        color: "#666",
        width: "100%"
    },
    noResults: {
        textAlign: "center",
        padding: "40px",
        fontSize: "1.2em",
        color: "#666",
    },
    textBlock: {
        padding: "16px",
        borderBottom: "1px solid #ddd",
        cursor: "pointer",
        width: "100%"
    },
    resultTitle: {
        fontSize: "1.2em",
        color: "#1a0dab",
        fontWeight: "bold",
        marginBottom: "6px",
    },
    resultDescription: {
        fontSize: "0.95em",
        color: "#545454",
    },
    pagination: {
        textAlign: 'center',
        marginTop: '20px',
        display: 'flex',
        justifyContent: 'center',
        width: '100%'
    }
};

export default Proposers;
