import React, { useEffect, useState } from "react";
import { Card, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import bookmarkRankingAPI from "../api/userfnc/bookmarkRankingAPI";
import rankingAPI from "../api/userfnc/rankingAPI";

const Ranking = () => {
    const navigate = useNavigate();
    const [bookmarkRanking, setBookmarkRanking] = useState([]);
    const [viewRanking, setViewRanking] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRankings = async () => {
            try {
                setLoading(true);
                const bookmarkResponse = await bookmarkRankingAPI();
                const viewResponse = await rankingAPI();
                setBookmarkRanking(Array.isArray(bookmarkResponse?.content) ? bookmarkResponse.content : []);
                setViewRanking(Array.isArray(viewResponse?.content) ? viewResponse.content : []);
            } catch (error) {
                console.error("랭킹 데이터 로딩 오류:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRankings();
    }, []);

    if (loading) {
        return <div style={styles.loadingContainer}><Spin size="large" /></div>;
    }

    return (
        <div style={styles.container}>
            <div style={{ width: "45%" }}>
                <Card style={styles.card}>
                    <h2 style={styles.cardTitle}>사람들이 많이 저장한 법안</h2>
                    {bookmarkRanking.length > 0 ? (
                        bookmarkRanking.map((bill, index) => (
                            <div
                                key={bill.billId}
                                onClick={() => navigate(`/bills/${bill.billId}`)}
                                style={styles.rankingItem}
                            >
                                <span style={styles.itemText}>{index + 1}. {bill.billTitle}</span>
                                <span style={styles.itemCount}>북마크: {bill.bookmarkCount}</span>
                            </div>
                        ))
                    ) : (
                        <div style={styles.noData}>데이터가 없습니다.</div>
                    )}
                </Card>
            </div>

            {/* 조회수 높은 법안 카드 */}
            <div style={{ width: "45%" }}>
                <Card style={styles.card}>
                    <h2 style={styles.cardTitle}>사람들이 많이 본 법안</h2>
                    {viewRanking.length > 0 ? (
                        viewRanking.map((bill, index) => (
                            <div
                                key={bill.billId}
                                onClick={() => navigate(`/bills/${bill.billId}`)}
                                style={styles.rankingItem}
                            >
                                <span style={styles.itemText}>{index + 1}. {bill.billTitle}</span>
                                <span style={styles.itemCount}>조회수: {bill.billCount}</span>
                            </div>
                        ))
                    ) : (
                        <div style={styles.noData}>데이터가 없습니다.</div>
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
        gap: '20px',
        padding: '20px',
        minHeight: 'calc(100vh - 194px)'
    },
    card: {
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
    rankingItem: {
        padding: '8px',
        borderBottom: '1px solid #eee',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        cursor: 'pointer'
    },
    itemText: {
        flex: '1',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
    },
    itemCount: {
        flexShrink: '0',
        marginLeft: '15px'
    },
    noData: {
        textAlign: 'center',
        padding: '20px',
        color: '#888'
    }
};

export default Ranking;