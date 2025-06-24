import React, { useState, useEffect } from "react";
import { Layout, List, Spin, message } from "antd";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";
import Bookmark from "../components/Bookmark";

const { Content } = Layout;

const Bills = () => {
    const navigate = useNavigate();
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });

    useEffect(() => {
        fetchBills(1);
    }, []);

    const fetchBills = async (page) => {
        try {
            setLoading(true);
            const response = await apiClient.get(`/bills/search?title=&page=${page - 1}&size=10`);
            setBills(response.data.content);
            setPagination({
                ...pagination,
                current: page,
                total: response.data.totalElements
            });
        } catch (error) {
            console.error('법안 목록을 불러오는 중 오류 발생:', error);
            message.error('법안 목록을 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page) => {
        fetchBills(page);
    };

    const renderBillItem = (item) => {
        return (
            <div 
                style={styles.textBlock}
                onClick={() => navigate(`/bills/${item.billId}`)}
            >
                <div style={styles.resultTitleWrapper}>
                        <div onClick={(e) => e.stopPropagation()}>
                            <Bookmark id={item.billId} />
                        </div>
                        <span style={styles.resultTitle}>{item.billTitle}</span>
                    </div>
                    <div style={styles.resultDescription}>
                        안건번호: {item.billNumber}<br />
                        발의자: {item.billProposer}<br />
                        정당: {item.poly}<br />
                        소관위: {item.committee}<br />
                        상태: {item.billStatus}
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
                ) : bills.length > 0 ? (
                    <>
                        <div style={styles.searchInfo}>
                            최근 등록된 법안 목록: {pagination.total}건
                        </div>
                        <List
                            grid={{ gutter: 16, column: 1 }}
                            dataSource={bills}
                            renderItem={renderBillItem}
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
                        등록된 법안이 없습니다.
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
    resultTitleWrapper: {
        display: "flex",
        alignItems: "center",
        gap: "3px",
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

export default Bills;
