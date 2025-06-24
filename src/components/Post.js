import React from "react";
import { Card } from "antd";

const Post = ({ post }) => {
    return (
        <Card title={`법안 ID: ${post.billId}`} style={{ marginBottom: "20px" }}>
            <p>{post.discussionText}</p>
            <p style={{ color: "#888" }}>작성 시각: {new Date(post.createdAt).toLocaleString()}</p>
        </Card>
    );
};

export default Post;
