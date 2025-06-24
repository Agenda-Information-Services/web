import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {Card, Spin, message, Typography, List, Form, Input, Button, Modal} from 'antd';
import {getPostById, reportPost} from '../api/userfnc/postAPI';
import { createComment, getCommentsByPostId, deleteComment, editComment, reportComment } from '../api/userfnc/commentAPI';
import Comment from '../components/Comment';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const buildCommentTree = (comments) => {
    const commentMap = {};
    const tree = [];
    if (!Array.isArray(comments)) return [];

    comments.forEach(comment => {
        commentMap[comment.commentId] = { ...comment, id: comment.commentId, children: [] };
    });

    comments.forEach(comment => {
        if (comment.parentCommentId && commentMap[comment.parentCommentId]) {
            commentMap[comment.parentCommentId].children.push(commentMap[comment.commentId]);
        } else {
            tree.push(commentMap[comment.commentId]);
        }
    });

    Object.values(commentMap).forEach(node => {
        if (node.children.length > 0) {
            node.children.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        }
    });
    tree.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    return tree;
};


const DiscussionDetail = () => {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isReportModalVisible, setIsReportModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [reportForm] = Form.useForm();

    const commentTree = useMemo(() => buildCommentTree(comments), [comments]);

    const fetchPostAndComments = async () => {
        try {
            setLoading(true);
            const postResponse = await getPostById(postId);
            const commentsResponse = await getCommentsByPostId(postId);
            setPost(postResponse);
            setComments(Array.isArray(commentsResponse) ? commentsResponse : []);
        } catch (error) {
            message.error("게시글과 댓글을 불러오는 데 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPostAndComments();
    }, [postId]);

    const handleAddComment = async (values) => {
        try {
            await createComment(postId, values.content);
            message.success("댓글이 등록되었습니다.");
            form.resetFields();
            fetchPostAndComments();
        } catch (error) {
            message.error("댓글 등록에 실패했습니다.");
        }
    };

    const handleEditComment = async (commentId, newContent) => {
        try {
            await editComment(commentId, newContent);
            message.success("댓글이 수정되었습니다.");
            fetchPostAndComments();
        } catch (error) {
            message.error("댓글 수정에 실패했습니다.");
        }
    };

    const handleDeleteComment = async (commentId) => {
        Modal.confirm({
            title: '댓글을 삭제하시겠습니까?',
            content: '삭제된 댓글은 복구할 수 없습니다.',
            okText: '삭제',
            okType: 'danger',
            cancelText: '취소',
            onOk: async () => {
                try {
                    await deleteComment(commentId);
                    message.success("댓글이 삭제되었습니다.");
                    fetchPostAndComments();
                } catch (error) {
                    message.error("댓글 삭제에 실패했습니다.");
                }
            },
        });
    };

    const handleReportComment = async (commentId, reason) => {
        try {
            await reportComment(commentId, reason);
            message.success("댓글이 신고되었습니다.");
        } catch (error) {
            message.error("댓글 신고에 실패했습니다.");
        }
    };

    const handleReportPost = async (values) => {
        try {
            await reportPost(post.postId, values.reason);
            message.success("게시글이 신고되었습니다.");
            setIsReportModalVisible(false);
            reportForm.resetFields();
        } catch (error) {
            message.error("게시글 신고에 실패했습니다.");
        }
    };

    if (loading || !post) {
        return <div style={styles.loadingContainer}><Spin size="large" /></div>;
    }

    return (
        <div style={{...styles.container, overflowY: 'auto', height: 'calc(100vh - 194px)'}}>
            <Card style={styles.postCard}>
                <div style={styles.postHeader}>
                    <Title level={3} style={{flex: 1, margin: 0}}>{post.postTitle}</Title>
                    <Button type="link" danger onClick={() => setIsReportModalVisible(true)}>게시글 신고</Button>
                </div>
                <Text type="secondary">{post.author} | {new Date(post.postDate).toLocaleString()}</Text>
                <Paragraph style={styles.postContent}>{post.content}</Paragraph>
            </Card>

            <Title level={4} style={{marginTop: '30px'}}>댓글</Title>

            <List
                dataSource={commentTree}
                renderItem={(comment) => (
                    <Comment
                        key={comment.id}
                        comment={comment}
                        onEditComment={handleEditComment}
                        onDeleteComment={handleDeleteComment}
                        onReportComment={handleReportComment}
                    />
                )}
                split={false}
            />

            <Card style={{marginTop: '20px'}}>
                <Form form={form} onFinish={handleAddComment}>
                    <Form.Item name="content" rules={[{required: true, message: '댓글 내용을 입력해주세요.'}]}>
                        <TextArea rows={3} placeholder="댓글을 입력하세요"/>
                    </Form.Item>
                    <Form.Item style={{textAlign: 'right', marginBottom: 0}}>
                        <Button type="primary" htmlType="submit">댓글 등록</Button>
                    </Form.Item>
                </Form>
            </Card>

            <Modal
                title="게시글 신고"
                open={isReportModalVisible}
                onCancel={() => setIsReportModalVisible(false)}
                footer={null}
            >
                <Form form={reportForm} onFinish={handleReportPost} layout="vertical">
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

const styles = {
    loadingContainer: {display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 194px)'},
    container: {
        padding: '24px 15%',
    },
    postCard: {
        padding: '20px',
    },
    postHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '8px'
    },
    postContent: {
        marginTop: '20px',
        fontSize: '16px',
        lineHeight: 1.8
    }
};

export default DiscussionDetail;