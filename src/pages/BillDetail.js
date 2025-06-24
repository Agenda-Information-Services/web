import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Layout, Spin, message, Card, Button } from "antd";
import {LikeOutlined, DislikeOutlined} from "@ant-design/icons";
import LinkBillInfo from "../components/LinkBillInfo";
import apiClient from "../api/apiClient";
import voteAPI from "../api/userfnc/voteAPI";
import Bookmark from '../components/Bookmark';

const { Content } = Layout;

const BillDetail = () => {
    const { billId } = useParams();
    const [bill, setBill] = useState(null);
    const [loading, setLoading] = useState(true);
    const [tooltip, setTooltip] = useState({ visible: false, text: "", x: 0, y: 0 });
    const [userVote, setUserVote]=useState(null);
    useEffect(() => {
        const fetchBill = async () => {
            try {
                const response = await apiClient.get(`/bills/${billId}`);
                setBill(response.data);
            } catch (error) {
                message.error("법안 정보를 불러오는 데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        };
        fetchBill();
    }, [billId]);

    const terms = useMemo(() => {
        try {
            const parsed = JSON.parse(bill?.term || "{}");
            return parsed.terms || [];
        } catch {
            return [];
        }
    }, [bill]);

    const highlightedDetail = useMemo(() => {
        if (!bill?.detail) return bill?.detail || "";

        let content = bill.detail;

        if (content.startsWith("제안이유 및 주요내용")) {
            content = content.slice("제안이유 및 주요내용".length).trimStart();
        }

        const usedTerms = new Set();

        terms.forEach(({ term, description }) => {
            const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            const regex = new RegExp(`(${escapedTerm})`, "g");

            let foundOnce = false;
            content = content.replace(regex, (match) => {
                if (!usedTerms.has(term) && !foundOnce) {
                    usedTerms.add(term);
                    foundOnce = true;
                    return `<span class="highlighted-term" 
                    style="font-weight:bold; color:#2a72de; border-bottom:1px dashed #2a72de; cursor:help"
                    data-explanation="${description}">${match}</span>`;
                }
                return match;
            });
        });
        return content;
    }, [bill?.detail, terms]);

    const formatPrediction = () => {
        try {
            const prediction = JSON.parse(bill.prediction || "{}");

            const renderEffectList = (effects, title, color) => (
                <div style={{ marginBottom: "20px" }}>
                    <h3 style={{ color, fontWeight: "bold" }}>{title}</h3>
                    <ul style={{ paddingLeft: "20px", marginTop: "10px" }}>
                        {effects.map((item, i) => (
                            <li key={i} style={{ marginBottom: "8px", lineHeight: "1.8" }}>
                                <strong>{item.title}</strong>: {item.description}
                            </li>
                        ))}
                    </ul>
                </div>
            );

            return (
                <>
                    {prediction.positive_effects &&
                        renderEffectList(prediction.positive_effects, "[긍정적 영향]", "#0A9100")}
                    {prediction.negative_effects &&
                        renderEffectList(prediction.negative_effects, "[부정적 영향]", "#E30000")}
                </>
            );
        } catch {
            return <p style={{ lineHeight: "1.8" }}>{bill.prediction}</p>;
        }
    };

    const formatSummary = () => {
        try {
            const summary = JSON.parse(bill.summary || "{}");
            return (
                <>
                    {summary.summary && (
                        <div style={{ marginBottom: "16px" }}>
                            <h4 style={{ fontWeight: "bold", color: "#0300b2" }}>요약</h4>
                            <p style={{ margin: 0, lineHeight: "1.8" }}>{summary.summary}</p>
                        </div>
                    )}
                    {summary.purpose && (
                        <div style={{ marginBottom: "16px" }}>
                            <h4 style={{ fontWeight: "bold", color: "#0300b2" }}>제안 목적</h4>
                            <p style={{ margin: 0, lineHeight: "1.8" }}>{summary.purpose}</p>
                        </div>
                    )}
                </>
            );
        } catch {
            return <p style={{ lineHeight: "1.8" }}>{bill.summary}</p>;
        }
    };

    useEffect(() => {
        const handleMouseOver = (e) => {
            const target = e.target;
            if (target.classList.contains("highlighted-term")) {
                const explanation = target.getAttribute("data-explanation");
                setTooltip({
                    visible: true,
                    text: explanation,
                    x: e.pageX + 10,
                    y: e.pageY + 10,
                });
            }
        };

        const handleMouseOut = (e) => {
            if (e.target.classList.contains("highlighted-term")) {
                setTooltip({ visible: false, text: "", x: 0, y: 0 });
            }
        };

        document.addEventListener("mouseover", handleMouseOver);
        document.addEventListener("mouseout", handleMouseOut);

        return () => {
            document.removeEventListener("mouseover", handleMouseOver);
            document.removeEventListener("mouseout", handleMouseOut);
        };
    }, []);

    const handleVote = async (voteType) => {
        try {
            if (userVote === voteType) {
                // 투표 취소
                await voteAPI(billId, voteType);
                setUserVote(null);
                message.success("투표가 취소되었습니다.");
            } else {
                // 새로운 투표
                await voteAPI(billId, voteType);
                setUserVote(voteType);
                message.success("투표가 등록되었습니다.");
            }
            // 투표 후 법안 정보 새로고침
            const response = await apiClient.get(`/bills/${billId}`);
            setBill(response.data);
        } catch (error) {
            message.error("투표 처리 중 오류가 발생했습니다.");
        }
    };

    if (loading) {
        return (
            <Layout style={styles.layout}>
                <div style={styles.loading}><Spin size="large" /></div>
            </Layout>
        );
    }

    if (!bill) {
        return (
            <Layout style={styles.layout}>
                <div style={styles.loading}>법안 정보를 찾을 수 없습니다.</div>
            </Layout>
        );
    }
    return (
        <Layout style={styles.layout}>
            <Content style={styles.content}>
                <div style={styles.titleContainer}>
                    <h1 style={{
                        flexGrow: 1,
                        margin: 0,
                        lineHeight: 1.3,
                        wordBreak: 'keep-all',
                        marginBottom: 10,
                    }}>
                        {bill.billTitle}
                    </h1>
                    <div style={{display: 'flex', alignItems: 'center', gap: '3px', flexShrink: 0}}>
                        <Bookmark id={Number(billId)}/>
                        <LinkBillInfo billId={billId}/>
                    </div>
                </div>

                <div style={{padding: "12px 0px"}}>
                    <p><strong>안건번호:</strong> {bill.billNumber}</p>
                    <p><strong>발의일:</strong> {new Date(bill.billDate).toLocaleDateString()}</p>
                    <p><strong>발의자:</strong> {bill.billProposer}</p>
                    <p><strong>발의자 소속:</strong> {bill.poly}</p>
                    <p><strong>소관 위원회:</strong> {bill.committee}</p>
                    <p><strong>진행 상태:</strong> {bill.billStatus}</p>
                </div>

                <div style={{padding: "12px 0px"}}>
                    <h3>세부 내용</h3>
                    <Card>
                        <div
                            style={styles.preserveLineBreak}
                            dangerouslySetInnerHTML={{__html: highlightedDetail}}
                        />
                    </Card>
                </div>

                <div style={{padding: "12px 0px"}}>
                    <h3>쉬운 설명</h3>
                    <Card>{formatSummary()}</Card>
                </div>

                <div style={{padding: "12px 0px"}}>
                    <h3>영향 예측</h3>
                    <Card>{formatPrediction()}</Card>
                </div>

                <div style={{padding: "12px 0px"}}>
                    <h3>투표하기</h3>
                    <Card>
                        <div style={styles.voteContainer}>
                            <Button 
                                type={userVote === 'YES' ? 'primary' : 'default'}
                                icon={<LikeOutlined />}
                                onClick={() => handleVote('YES')}
                                style={styles.voteButtonYes}
                            />
                            <Button 
                                type={userVote === 'NO' ? 'primary' : 'default'}
                                icon={<DislikeOutlined />}
                                onClick={() => handleVote('NO')}
                                style={styles.voteButtonNo}
                            />
                        </div>
                        <div style={styles.voteStats}>
                            <div style={styles.voteBar}>
                                <div style={styles.voteBarContainer}>
                                    <div 
                                        style={{
                                            ...styles.voteBarFill,
                                            width: `${bill?.yes + bill?.no > 0 ? 
                                                (bill.yes / (bill.yes + bill.no)) * 100 : 0}%`,
                                            backgroundColor: '#1890ff'
                                        }}
                                    />
                                    <div 
                                        style={{
                                            ...styles.voteBarFill,
                                            width: `${bill?.yes + bill?.no > 0 ? 
                                                (bill.no / (bill.yes + bill.no)) * 100 : 0}%`,
                                            backgroundColor: '#ff4d4f'
                                        }}
                                    />
                                </div>
                                <div style={styles.voteCounts}>
                                    <span style={{ color: '#1890ff' }}>찬성 {bill?.yes || 0}표</span>
                                    <span style={{ color: '#ff4d4f' }}>반대 {bill?.no || 0}표</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {tooltip.visible && (
                    <div style={{...styles.tooltip, top: tooltip.y, left: tooltip.x}}>
                        {tooltip.text}
                    </div>
                )}
            </Content>
        </Layout>
    );
};

const styles = {
    layout: {
        height: "100vh",
        backgroundColor: "#fff",
        overflow: "hidden",
    },
    content: {
        padding: "24px 20%",
        height: "calc(100vh - 180px)",
        overflowY: "auto",
    },
    loading: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "calc(100vh - 180px)",
        fontSize: "1.2em",
        color: "#666",
    },
    preserveLineBreak: {
        whiteSpace: "pre-wrap",
        //whiteSpace: "pre-line",
        lineHeight: "1.9",
        color: "#222",
        wordBreak: "keep-all",
    },
    titleContainer: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
    },
    tooltip: {
        position: "absolute",
        zIndex: 1000,
        background: "#fff",
        color: "#333",
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "10px",
        fontSize: "14px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
        maxWidth: "300px",
        lineHeight: "1.5",
    },
    highlightedTerm: {
        fontWeight: "bold",
        color: "#2a72de",
        borderBottom: "1px dashed #2a72de",
        cursor: "help"
    },
    voteContainer: {
        display: 'flex',
        justifyContent: 'center',
        gap: '20px',
        padding: '20px 0',
    },
    voteButtonYes: {
        width: '50px',
        height: '50px',
        fontSize: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        right:'150px'
    },
    voteButtonNo: {
        width: '50px',
        height: '50px',
        fontSize: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        left: '150px'
    },
    voteStats: {
        marginTop: '20px',
    },
    voteBar: {
        maxWidth: '600px',
        margin: '0 auto',
    },
    voteBarContainer: {
        width: '100%',
        height: '30px',
        backgroundColor: '#f0f0f0',
        borderRadius: '15px',
        overflow: 'hidden',
        display: 'flex',
        marginBottom: '10px',
    },
    voteBarFill: {
        height: '100%',
        transition: 'width 0.3s ease-in-out',
    },
    voteCounts: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0 10px',
        fontSize: '14px',
    },


};

export default BillDetail;
