
import React, { useEffect, useState } from "react";
import { Table } from "antd";
import fetchReportListAPI from "../../api/admin/fetchReportListAPI";

const ReportList = () => {
    const [reports, setReports] = useState([]);

    useEffect(() => {
        const load = async () => {
            const res = await fetchReportListAPI();
            if (res.status === 200) {
                setReports(res.body);
            }
        };
        load();
    }, []);

    const columns = [
        { title: "신고 ID", dataIndex: "reportId" },
        { title: "게시글 제목", dataIndex: "title" },
        { title: "신고자", dataIndex: "reporterName" },
        { title: "신고일자", dataIndex: "reportedAt" },
    ];

    return <Table rowKey="reportId" columns={columns} dataSource={reports} />;
};

export default ReportList;
