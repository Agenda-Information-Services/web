import React from "react";
import { Card, Input, Button, Typography } from "antd";

const { Title } = Typography;

const AdminLogin = () => {
    return (
        <div style={styles.container}>
            <Card style={styles.card}>
                {/* 서비스명 */}
                <Title level={2} style={styles.logo}>midas</Title>

                {/* ID PW 입력 필드 */}
                <Input placeholder="ID" style={styles.input} />
                <Input.Password placeholder="PW" style={styles.input} />

                {/* 로그인 버튼 */}
                <Button type="default" style={styles.loginButton}>
                    관리자 로그인
                </Button>
            </Card>
        </div>
    );
};

// 스타일 정의
const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#F8F9FA",
        flexDirection: "column",
    },
    card: {
        width: 350,
        textAlign: "center",
        padding: 40,
        borderRadius: 10,
        backgroundColor: "#FFFFFF",
        boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2)",
        border: "none",
        marginTop: "-10vh",
    },
    logo: {
        fontWeight: "bold",
    },
    input: {
        marginBottom: 15,
        height: 40,
        borderRadius: 5,
    },
    loginButton: {
        width: "100%",
        height: 40,
        fontWeight: "bold",
        backgroundColor: "#F0F4F8",
        border: "1px solid #D1D5DB",
    },
};

export default AdminLogin;