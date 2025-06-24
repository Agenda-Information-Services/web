import React, { useEffect, useState } from "react";
import { Layout, List, Button, message, Typography } from "antd";
import apiClient from "../../api/apiClient";
import { useNavigate } from "react-router-dom";

const { Content } = Layout;
const { Title } = Typography;

const AdminReportPage = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const res = await apiClient.get(`/api/admin/report/list?userId=${userId}`);
                setReports(res.data);
            } catch (error) {
                message.error("신고 리스트 조회 실패");
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, [userId]);

    const suspendUser = async () => {
        try {
            await apiClient.put(`/api/admin/user/suspend/${userId}`);
            message.success("유저가 정지되었습니다.");
        } catch {
            message.error("정지 실패");
        }
    };

    const resumeUser = async () => {
        try {
            await apiClient.put(`/api/admin/user/resume/${userId}`);
            message.success("유저 정지 해제");
        } catch {
            message.error("정지 해제 실패");
        }
    };

    return (
        <Layout style={{ padding: "24px" }}>
            <Content>
                <Title level={3}>신고된 게시글 목록</Title>
                <div style={{ marginBottom: 16 }}>
                    <Button danger onClick={suspendUser} style={{ marginRight: 10 }}>
                        유저 정지
                    </Button>
                    <Button type="primary" onClick={resumeUser}>
                        유저 정지 해제
                    </Button>
                </div>
                <List
                    loading={loading}
                    itemLayout="horizontal"
                    dataSource={reports}
                    renderItem={(item) => (
                        <List.Item onClick={() => navigate(`/admin/report/${item.postId}`)} style={{ cursor: "pointer" }}>
                            <List.Item.Meta
                                title={item.title}
                                description={`신고 날짜: ${new Date(item.reportedAt).toLocaleString()}`}
                            />
                        </List.Item>
                    )}
                />
            </Content>
        </Layout>
    );
};

export default AdminReportPage;
