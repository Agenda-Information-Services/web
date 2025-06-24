import React, { useEffect, useState } from "react";
import { Layout, Card, Spin, message } from "antd";
import { useParams } from "react-router-dom";
import apiClient from "../../api/apiClient";

const { Content } = Layout;

const AdminReportDetailPage = () => {
    const { reportId } = useParams();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const res = await apiClient.get(`/api/admin/report/${reportId}`);
                setReport(res.data);
            } catch (error) {
                message.error("신고 게시글 상세 정보를 불러오는 데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        };
        fetchReport();
    }, [reportId]);

    if (loading) {
        return <Spin size="large" style={{ display: "block", margin: "20% auto" }} />;
    }

    if (!report) {
        return <p style={{ textAlign: "center" }}>신고 내용을 찾을 수 없습니다.</p>;
    }

    return (
        <Layout style={{ padding: "24px" }}>
            <Content>
                <Card title={`신고된 게시글: ${report.title}`}>
                    <p><strong>작성자 ID:</strong> {report.userId}</p>
                    <p><strong>신고 일자:</strong> {new Date(report.reportedAt).toLocaleString()}</p>
                    <p><strong>내용:</strong></p>
                    <p>{report.content}</p>
                </Card>
            </Content>
        </Layout>
    );
};

export default AdminReportDetailPage;
