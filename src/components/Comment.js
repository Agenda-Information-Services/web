import React, { useState } from 'react';
import { Input, Button, List, Form, Avatar, Modal } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { TextArea } = Input;

const Comment = ({ comment, onEditComment, onDeleteComment, onReportComment, level = 0 }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isReportModalVisible, setIsReportModalVisible] = useState(false);
    const [editForm] = Form.useForm();
    const [reportForm] = Form.useForm();

    const currentUserId = localStorage.getItem("userId");
    const currentUserNickName = localStorage.getItem("nickName");
    const isMyComment = currentUserId === String(comment.userId);
    const authorDisplayName = isMyComment ? currentUserNickName : '익명';

    const handleEdit = () => {
        editForm.setFieldsValue({ content: comment.commentContent });
        setIsEditing(true);
    };

    const handleEditSubmit = (values) => {
        onEditComment(comment.id, values.content);
        setIsEditing(false);
    };

    const handleReport = () => {
        setIsReportModalVisible(true);
    };

    const handleReportSubmit = (values) => {
        onReportComment(comment.id, values.reason);
        setIsReportModalVisible(false);
        reportForm.resetFields();
    };

    return (
        <div style={{ marginLeft: level > 0 ? `${level * 40}px` : '0px' }}>
            <List.Item
                actions={[
                    isMyComment && <Button type="link" onClick={handleEdit}>수정</Button>,
                    isMyComment && <Button type="link" danger onClick={() => onDeleteComment(comment.id)}>삭제</Button>,
                    !isMyComment && <Button type="link" style={{color: 'orange'}} onClick={handleReport}>신고</Button>
                ].filter(Boolean)}
            >
                {isEditing ? (
                    <Form form={editForm} onFinish={handleEditSubmit} style={{ width: '100%' }}>
                        <Form.Item name="content" noStyle>
                            <TextArea rows={2} />
                        </Form.Item>
                        <Button type="primary" htmlType="submit" size="small" style={{ marginTop: 8 }}>수정 완료</Button>
                        <Button onClick={() => setIsEditing(false)} size="small" style={{ marginLeft: 8 }}>취소</Button>
                    </Form>
                ) : (
                    <List.Item.Meta
                        avatar={<Avatar icon={<UserOutlined />} />}
                        title={<span>{authorDisplayName}</span>}
                        description={
                            <div>
                                <p style={{
                                    marginBottom: 0,
                                    color: '#000',
                                    fontSize: '15px'
                                }}>{comment.commentContent}</p>
                                <p style={{fontSize: "0.9em", color: "#999", marginTop: 4}}>
                                    | {new Date(comment.createdAt).toLocaleString()}
                                </p>
                            </div>
                        }
                    />
                )}
            </List.Item>

            {/* 자식 댓글(대댓글) 렌더링 */}
            {comment.children && comment.children.length > 0 && (
                <List
                    dataSource={comment.children}
                    renderItem={(childComment) => (
                        <Comment
                            key={childComment.id}
                            comment={childComment}
                            onEditComment={onEditComment}
                            onDeleteComment={onDeleteComment}
                            onReportComment={onReportComment}
                            level={level + 1}
                        />
                    )}
                    split={false}
                />
            )}

            {/* 신고 모달 */}
            <Modal
                title="댓글 신고"
                open={isReportModalVisible}
                onCancel={() => setIsReportModalVisible(false)}
                footer={null}
            >
                <Form form={reportForm} onFinish={handleReportSubmit} layout="vertical">
                    <Form.Item label="신고 사유" name="reason" rules={[{ required: true, message: '신고 사유를 입력해주세요.' }]}>
                        <TextArea rows={4} placeholder="신고 사유를 구체적으로 작성해주세요." />
                    </Form.Item>
                    <Form.Item style={{ textAlign: 'right' }}>
                        <Button onClick={() => setIsReportModalVisible(false)} style={{ marginRight: 8 }}>취소</Button>
                        <Button type="primary" danger htmlType="submit">신고하기</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Comment;