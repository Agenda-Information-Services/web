import React, { useEffect, useState } from "react";
import { Layout, Table, Button, Tag, message, Modal, Descriptions } from "antd";
import { getAllUsers, suspendUser, resumeUser, getUserDetail } from "../../api/admin/userAPI";

const { Content } = Layout;

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await getAllUsers();
            setUsers(res);
        } catch (err) {
            message.error("사용자 목록을 불러오는 데 실패했습니다.");
        }
    };

    const handleViewDetail = async (userId) => {
        try {
            const detail = await getUserDetail(userId);
            setSelectedUser(detail);
            setModalVisible(true);
        } catch {
            message.error("유저 상세 정보를 불러오지 못했습니다.");
        }
    };

    const handleSuspend = async (uid) => {
        try {
            await suspendUser(uid);
            message.success("사용자를 정지시켰습니다.");
            fetchUsers();
        } catch {
            message.error("정지 실패");
        }
    };

    const handleUnsuspend = async (uid) => {
        try {
            await resumeUser(uid);
            message.success("사용자 정지를 해제했습니다.");
            fetchUsers();
        } catch {
            message.error("해제 실패");
        }
    };

    const columns = [
        { title: "ID", dataIndex: "uid", key: "uid" },
        { title: "닉네임", dataIndex: "nickName", key: "nickName" },
        {
            title: "상태",
            dataIndex: "status",
            key: "status",
            render: (status) =>
                status === "ACTIVE" ? <Tag color="green">정상</Tag> : <Tag color="red">정지됨</Tag>,
        },
        {
            title: "조치",
            key: "action",
            render: (_, record) => (
                <>
                    {record.status === "ACTIVE" ? (
                        <Button danger onClick={() => handleSuspend(record.userId)}>정지</Button>
                    ) : (
                        <Button onClick={() => handleUnsuspend(record.userId)}>정지 해제</Button>
                    )}
                    <Button style={{ marginLeft: 8 }} onClick={() => handleViewDetail(record.userId)}>
                        상세보기
                    </Button>
                </>
            ),
        },
    ];

    return (
        <div>
            <Table
                size="small"
                columns={columns}
                dataSource={users}
                rowKey={(record) => record.uid}
                pagination={{ pageSize: 8 }}
            />
            <Modal
                title="사용자 상세 정보"
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={<Button onClick={() => setModalVisible(false)}>닫기</Button>}
            >
                {selectedUser ? (
                    <Descriptions bordered column={1}>
                        <Descriptions.Item label="ID">{selectedUser.userId}</Descriptions.Item>
                        <Descriptions.Item label="이름">{selectedUser.name}</Descriptions.Item>
                        <Descriptions.Item label="닉네임">{selectedUser.nickName}</Descriptions.Item>
                        <Descriptions.Item label="UID">{selectedUser.uid}</Descriptions.Item>
                        <Descriptions.Item label="이메일">{selectedUser.email}</Descriptions.Item>
                        <Descriptions.Item label="전화번호">{selectedUser.phoneNumber}</Descriptions.Item>
                        <Descriptions.Item label="권한">{selectedUser.role}</Descriptions.Item>
                    </Descriptions>
                ) : (
                    <p>불러오는 중...</p>
                )}
            </Modal>
        </div>
    );
};

export default UserManagement;