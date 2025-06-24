import React, { useEffect, useState } from "react";
import { Card, Typography, Form, Input, Avatar, Button, message, Divider, Modal, Tabs, Spin, Table } from "antd";
import { UserOutlined } from "@ant-design/icons";
import UserHeader from "../components/Header";
import updateProfileAPI from "../api/mypage/updateProfileAPI";
import deleteUserAPI from "../api/integrated/deleteUserAPI";
import { getMyBookmarks } from '../api/mypage/myBookmarkAPI';
import { getMyPosts } from '../api/userfnc/postAPI'; // 새로 만든 API 함수 import
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

// --- 북마크 목록 컴포넌트 ---
const MyBookmarks = () => {
    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBookmarks = async () => {
            try {
                const data = await getMyBookmarks();
                setBookmarks(data);
            } catch (error) {
                message.error("북마크 목록을 불러오는데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        };
        fetchBookmarks();
    }, []);

    const columns = [
        { title: '법안 제목', dataIndex: 'billTitle', key: 'billTitle', width: '70%' },
        { title: '발의자', dataIndex: 'proposerName', key: 'proposerName', align: 'center' },
    ];

    if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>;

    return (
        <Table
            columns={columns}
            dataSource={bookmarks}
            rowKey="billId"
            onRow={(record) => ({
                onClick: () => navigate(`/bills/${record.billId}`),
                style: { cursor: 'pointer' },
            })}
            pagination={{ pageSize: 10 }}
        />
    );
};

// --- 내가 작성한 게시글 목록 컴포넌트 (새로 추가) ---
const MyPosts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const data = await getMyPosts();
                setPosts(data);
            } catch (error) {
                message.error("작성한 게시글을 불러오는데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    const columns = [
        { title: '게시글 제목', dataIndex: 'postTitle', key: 'postTitle', width: '60%' },
        { title: '조회수', dataIndex: 'postCount', key: 'postCount', align: 'center' },
        { title: '작성일', dataIndex: 'postDate', key: 'postDate', align: 'center', render: (date) => new Date(date).toLocaleDateString() },
    ];

    if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>;

    return (
        <Table
            columns={columns}
            dataSource={posts}
            rowKey="postId"
            onRow={(record) => ({
                onClick: () => navigate(`/discussion/${record.postId}`),
                style: { cursor: 'pointer' },
            })}
            pagination={{ pageSize: 10 }}
        />
    );
};


// --- 프로필 관리 컴포넌트 ---
const ProfileEditor = () => {
    // ... (ProfileEditor 컴포넌트 내용은 기존과 동일)
    const [form] = Form.useForm();
    const nickName = localStorage.getItem("nickName");
    const name = localStorage.getItem("username");
    const email = localStorage.getItem("email");
    const userId = localStorage.getItem("userId");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [confirmName, setConfirmName] = useState("");

    useEffect(() => {
        form.setFieldsValue({ newNickName: nickName });
    }, [nickName, form]);

    const handleUpdate = async () => { try { const values = await form.validateFields(); const payload = { currentPassword: values.currentPassword, ...(values.newPassword && { newPassword: values.newPassword }), ...(values.newNickName && { newNickName: values.newNickName }), }; const res = await updateProfileAPI(payload); if (res.status === 200) { message.success("프로필이 수정되었습니다."); if (payload.newNickName) { localStorage.setItem("nickName", payload.newNickName); window.location.reload(); } } else { message.error(res.message || "수정 실패"); } } catch (err) { console.error("폼 유효성 오류:", err); } };
    const showDeleteConfirm = () => setIsModalOpen(true);
    const handleDelete = async () => { if (confirmName !== name) { message.error("이름이 일치하지 않습니다."); return; } const res = await deleteUserAPI(userId); if (res.status === 200) { message.success("회원탈퇴가 완료되었습니다."); localStorage.clear(); window.location.href = "/"; } else { message.error(res.message || "회원탈퇴 실패"); } };

    return ( <div style={{ padding: '0 24px' }}> <div style={styles.profileHeader}> <Avatar size={64} icon={<UserOutlined />} /> <div style={{ marginLeft: 20 }}> <Title level={5}>{name}</Title> <Text>{nickName}</Text><br /> <Text type="secondary">{email}</Text> </div> </div> <Divider style={{ marginBottom: 16 }} /> <Form form={form} layout="vertical"> <Form.Item label="이름" style={{ marginBottom: 10 }}><Input value={name} disabled /></Form.Item> <Form.Item name="newNickName" label="닉네임" rules={[{ required: true, message: "닉네임을 입력하세요" }]} style={{ marginBottom: 10 }}><Input /></Form.Item> <Form.Item name="currentPassword" label="현재 비밀번호" rules={[{ required: true, message: "현재 비밀번호는 필수입니다" }]} style={{ marginBottom: 10 }}><Input.Password /></Form.Item> <Form.Item name="newPassword" label="새 비밀번호" rules={[{ min: 10, message: "비밀번호는 10자 이상이어야 합니다" }]} ><Input.Password /></Form.Item> <Form.Item><Button type="primary" onClick={handleUpdate} block >수정하기</Button></Form.Item> </Form> <Button danger block onClick={showDeleteConfirm}>회원탈퇴</Button> <Modal title="회원탈퇴 확인" open={isModalOpen} onCancel={() => { setIsModalOpen(false); setConfirmName(""); }} onOk={handleDelete} okText="탈퇴" cancelText="취소"> <p>회원탈퇴를 하시려면 이름(<strong>{name}</strong>)을 정확히 입력해주세요.</p> <Input placeholder="이름 입력" value={confirmName} onChange={(e) => setConfirmName(e.target.value)} /> </Modal> </div> );
};


// --- 최종 MyPage 컴포넌트 ---
const MyPage = () => {
    const items = [
        { key: '1', label: '프로필 관리', children: <ProfileEditor /> },
        { key: '2', label: '북마크한 법안', children: <MyBookmarks /> },
        { key: '3', label: '내가 작성한 게시글', children: <MyPosts /> }, // 탭 추가
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
    pageWrapper: { display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#f0f2f5' },
    contentWrapper: { flex: 1, overflowY: 'auto', padding: '10px 0' },
    card: { maxWidth: 800, margin: '0 auto' },
    profileHeader: { display: "flex", alignItems: "center", marginBottom: 10 },
};

export default MyPage;