import React, { useState } from "react";
import { Layout, Input, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Content } = Layout;
const { Option } = Select;

const MainPage = () => {
    /* 검색Input 입력시 이동시킴 */
    const [searchQuery, setSearchQuery] = useState("");
    const [searchType, setSearchType] = useState("billTitle");
    const navigate = useNavigate();

    const handleSearch = (e) => {
        if (e.key === "Enter" && searchQuery.trim()) {
            navigate(`/searchresult?type=${searchType}&query=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <Layout style={styles.layout}>
            
            <Content style={styles.content}>
                <div style={styles.searchWrapper}>
                    <Select
                        defaultValue="billTitle"
                        style={styles.searchSelect}
                        onChange={setSearchType}
                    >
                        <Option value="billTitle">법안명</Option>
                        <Option value="proposers">발의자 정보</Option>
                        <Option value="proposerInfo">발의자 기준</Option>
                        <Option value="detail">내용</Option>
                        <Option value="titleProposer">법안명+발의자</Option>
                        <Option value="titleProposerDetail">법안명+발의자+내용</Option>
                        <Option value="committee">소관위</Option>
                        <Option value="all">종합</Option>
                        <Option value="embeding">자연어 검색</Option>

                    </Select>
                    <Input
                        placeholder="궁금한 발의안을 검색해보세요!"
                        size="large"
                        suffix={
                            <SearchOutlined
                                onClick={() => {
                                    if (searchQuery.trim()) {
                                        navigate(`/searchresult?type=${searchType}&query=${encodeURIComponent(searchQuery)}`);
                                    }
                                }}
                                style={{ color: "#c59fff", fontSize: "1.6vw", cursor: "pointer" }}
                            />
                        }
                        style={styles.searchInput}
                        /* 검색 기능 관련 요소 */
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={handleSearch}
                    />
                </div>
            </Content>
        </Layout>
    );
};

const styles = {
    layout: {
        height: "100vh",
        overflow: "hidden",
        position: "relative",
        backgroundColor: "#fff",
    },
    content: {
        height: "calc(100vh - 64px - 100px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        paddingTop: "25vh",
    },
    searchWrapper: {
        width: "100%",
        display: "flex",
        justifyContent: "center",
        gap: "10px",
    },
    searchSelect: {
        width: "180px",
        height: "8.3vh",
        fontSize: "1.2vw",
        textAlign: "center"
    },
    searchInput: {
        width: "50vw",
        height: "8.3vh",
        fontSize: "1.4vw",
        borderRadius: "50px",
        padding: "0 2vw",
        border: "2px solid #c59fff",
        boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
    },
};

export default MainPage;
