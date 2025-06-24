import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, message, Spin } from "antd";
import apiClient from "../api/apiClient";

const RecommendedBills = () => {
    const navigate = useNavigate();
    const [recommendedBills, setRecommendedBills] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecommendedBills = async () => {
            try {
                const userId = localStorage.getItem("userId");
                if (!userId) {
                    message.warning("로그인이 필요합니다.");
                    setLoading(false);
                    return;
                }

                const response = await apiClient.post("/recommend/user", { userId });
                setRecommendedBills(response.data);
            } catch (error) {
                console.error("추천 법안을 불러오는 데 실패했습니다:", error);
                message.error("추천 법안 불러오기 실패");
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendedBills();
    }, []);

    if (loading) {
        return <div style={styles.loadingContainer}><Spin size="large" /></div>;
    }

    return (
        <div style={styles.container}>
            <div style={{ width: "60%" }}> {/* 카드 너비 조절 */}
                <Card style={styles.card}>
                    <h2 style={styles.cardTitle}>
                        사용자 맞춤형 추천 법안
                    </h2>

                    {recommendedBills.length > 0 ? (
                        recommendedBills.map((bill, index) => (
                            <div
                                key={bill.billId}
                                onClick={() => navigate(`/bills/${bill.billId}`)}
                                style={styles.billItem}
                            >
                                <span style={styles.itemText}>
                                    {index + 1}. {bill.billTitle}
                                </span>
                            </div>
                        ))
                    ) : (
                        <div style={styles.noData}>
                            추천 법안이 없습니다.
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

const styles = {
    loadingContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 'calc(100vh - 194px)'
    },
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        minHeight: 'calc(100vh - 194px)'
    },
    card: {
        minHeight: '300px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
    },
    cardTitle: {
        textAlign: 'center',
        fontSize: '18px',
        marginTop: '0px',
        marginBottom: '10px',
        color: '#333'
    },
    billItem: {
        padding: '8px 12px',
        borderBottom: '1px solid #eee',
        cursor: 'pointer'
    },
    itemText: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
    },
    noData: {
        textAlign: 'center',
        padding: '20px',
        color: '#888'
    }
};

export default RecommendedBills;