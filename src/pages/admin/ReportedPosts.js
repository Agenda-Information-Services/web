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
            const testUserId = "1";
            const res = await getReportedPostsByUser(testUserId);
            console.log("📦 신고 응답:", res);
            setReports(res);
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
                // 상세 페이지 경로가 토론 게시판 상세로 연결된다고 가정합니다.
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
                <Button onClick={() => handleDetailClick(record.reportId)}>
                    상세보기
                </Button>
            ),
        },
    ];

    return (
        // Layout과 Content 대신 div 사용
        <div>
            <h2 style={{ fontSize: "20px", fontWeight: 600, marginBottom: '15px' }}>신고된 게시글</h2>
            <Table
                size="small" // 테이블 행 높이 줄이기
                columns={columns}
                dataSource={reports}
                rowKey={(record) => record.reportId || `${record.postId}-${record.title}`}
                pagination={{ pageSize: 10 }}
                // style에서 marginTop 제거
            />
        </div>
    );
};

export default ReportedPosts;