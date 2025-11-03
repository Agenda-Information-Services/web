import React, { useEffect, useState } from "react";
import { Table, Button, message } from "antd";
import { getReportedPostsByUser, getReportDetail } from "../../api/admin/userAPI";
import { useNavigate } from "react-router-dom";

const ReportedPosts = () => {
    const [reports, setReports] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const MAX_USER_ID = 40;
            const userIds = Array.from({ length: MAX_USER_ID + 1 }, (_, i) => i);

            const promises = userIds.map(async (userId) => {
                try {
                    const res = await getReportedPostsByUser(userId);
                    return Array.isArray(res) ? res : [];
                } catch (err) {
                    return [];
                }
            });

            const allReportsArrays = await Promise.all(promises);
            const allReports = allReportsArrays.flat();

            const uniqueReports = [];
            const uniqueKeys = new Set();

            allReports.forEach(report => {
                if (!report) return;

                const key = report.reportId
                    ? report.reportId
                    : `${report.postId}-${report.reportedAt}`;

                if (!uniqueKeys.has(key)) {
                    uniqueKeys.add(key);
                    uniqueReports.push(report);
                }
            });

            console.log("📦 신고 응답:", uniqueReports);
            setReports(uniqueReports);

        } catch (err) {
            console.error("❌ API 호출 실패:", err);
            message.error("신고된 게시글 목록을 불러오는 데 실패했습니다.");
        }
    };

    const handleDetailClick = async (reportId) => {
        try {
            const detail = await getReportDetail(reportId);
            const postId = detail?.postId;
            if (postId) {
                navigate(`/discussion/${postId}`);
            } else {
                message.warning("게시글 정보를 찾을 수 없습니다.");
            }
        } catch (err) {
            message.error("신고 상세 정보를 불러오는 데 실패했습니다.");
        }
    };

    const columns = [
        {
            title: "게시글 ID",
            dataIndex: "postId",
            key: "postId",
            width: "10%",
            align: 'center',
        },
        {
            title: <div style={{ textAlign: 'center' }}>제목</div>,
            dataIndex: "title",
            key: "title",
            width: "40%",
        },
        {
            title: "신고일",
            dataIndex: "reportedAt",
            key: "reportedAt",
            width: "20%",
            align: 'center',
            render: (text) =>
                text ? new Date(text).toLocaleString() : "날짜 없음",
        },
        {
            title: "조치",
            key: "action",
            width: "30%",
            align: 'center',
            render: (_, record) => (
                <Button onClick={() => handleDetailClick(record.reportId || `${record.postId}-${record.reportedAt}`)}>
                    상세보기
                </Button>
            ),
        },
    ];

    return (
        <div>
            <h2 style={{ fontSize: "20px", fontWeight: 600, marginBottom: '15px' }}>신고된 게시글</h2>
            <Table
                size="small"
                columns={columns}
                dataSource={reports}
                rowKey={(record) => record.reportId || `${record.postId}-${record.reportedAt}`}
                pagination={{ pageSize: 10 }}
            />
        </div>
    );
};

export default ReportedPosts;