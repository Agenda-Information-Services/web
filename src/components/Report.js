import React, { useState } from "react";
import { Modal, Input, message } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { reportPost, reportComment } from "../api/userfnc/reportAPI";

const { TextArea } = Input;

const Report = ({ visible, onClose, targetId, type, targetAuthor, target }) => {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReport = async () => {
    if (!reason.trim()) {
      message.warning("신고 사유를 입력해주세요.");
      return;
    }

    setLoading(true);
    try {
      let response;
      if (type === "post") {
        response = await reportPost(targetId, reason);
      } else if (type === "comment") {
        response = await reportComment(targetId, reason);
      }

      if (typeof response === "string") {
        message.success(response);
      } else {
        message.success("신고가 접수되었습니다.");
      }

      setReason("");
      onClose();
    } catch (error) {
      console.error("신고 처리 중 오류:", error);

      const msg =
        error?.message ||
        error?.response?.data?.message ||
        "신고 처리 중 오류가 발생했습니다.";

      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={
        <>
          <ExclamationCircleOutlined style={{ marginRight: 8 }} /> 신고하기
        </>
      }
      open={visible}
      onOk={handleReport}
      onCancel={() => {
        setReason("");
        onClose();
      }}
      okText="신고"
      cancelText="취소"
      confirmLoading={loading}
    >
      {targetAuthor && (
        <p style={{ marginBottom: 12, color: '#888' }}>
          대상 작성자: <strong>{targetAuthor}</strong>
        </p>
      )}
      <TextArea
        rows={4}
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="신고 사유를 입력해주세요"
      />
    </Modal>
  );
};

export default Report;
