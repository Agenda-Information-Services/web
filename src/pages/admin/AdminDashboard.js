import React from "react";
import { Tabs, Card } from "antd";
import UserHeader from "../../components/Header";
import UserManagement from "./UserManagement";
import ReportedPosts from "./ReportedPosts";

const AdminDashboard = () => {
    const items = [
        {
            key: '1',
            label: '사용자 관리',
            children: <UserManagement />,
        },
        {
            key: '2',
            label: '신고된 게시물',
            children: <ReportedPosts />,
        },
    ];

    return (
        <div style={styles.pageWrapper}>
            <UserHeader />
            <div style={styles.contentWrapper}>
                <Card style={styles.card}>
                    <Tabs defaultActiveKey="1" items={items} />
                </Card>
            </div>
        </div>
    );
};

const styles = {
    pageWrapper: {
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        backgroundColor: '#f0f2f5',
    },
    contentWrapper: {
        flex: 1,
        overflowY: 'auto',
        padding: '24px 0',
    },
    card: {
        maxWidth: 1200, // 관리자 페이지는 더 넓게 설정
        margin: '0 auto',
    },
};

export default AdminDashboard;