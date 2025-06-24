import React, { useState, useEffect } from "react";
import { Layout, Input, Select, List, Spin, Pagination, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { searchBills, formatSearchQuery } from "../api/userfnc/searchAPI";
import Bookmark from "../components/Bookmark";

const { Content } = Layout;
const { Option } = Select;

const SearchResult = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const initialQuery = searchParams.get("query") || "";
    const initialType = searchParams.get("type") || "billTitle";

    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [searchType, setSearchType] = useState(initialType);
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalElements, setTotalElements] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    const fetchData = async (page = 1) => {
        try {
            setLoading(true);
            if (searchType === "embeding") {
                const response = await searchBills(searchType, searchQuery);
                setSearchResults(response.slice((page - 1) * pageSize, page * pageSize));
                setTotalElements(response.length);
            } else {
                const response = await searchBills(searchType, searchQuery, page - 1, pageSize);
                setSearchResults(response.content);
                setTotalElements(response.totalElements);
            }
        } catch (error) {
            message.error("검색 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e) => {
        if (e.key === "Enter" && searchQuery.trim()) {
            setCurrentPage(1);
            navigate(`/searchresult?type=${searchType}&query=${encodeURIComponent(searchQuery)}`);
            fetchData(1);
        }
    };

    useEffect(() => {
        if (initialQuery) {
            fetchData(currentPage);
        }
    }, [currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const renderSearchResult = (item) => {
        if (searchType === "proposers") {
            return (
                <div
                    style={styles.textBlock}
                    onClick={() => navigate(`/proposers/${item.id}`)}
                >
                    <div style={styles.resultTitle}>{item.name}</div>
                    <div style={styles.resultDescription}>
                        소속 정당: {item.party}<br/>
                        직책: {item.career}
                    </div>
                </div>
            );
        } else {
            return (
                <div
                    style={styles.textBlock}
                    onClick={() => navigate(`/bills/${item.billId}`)}
                >
                    <div style={styles.resultTitleWrapper}>
                        <div onClick={(e) => e.stopPropagation()}>
                            <Bookmark id={item.billId} />
                        </div>
                        <span style={styles.resultTitle}>{item.billTitle}</span>
                    </div>
                    <div style={styles.resultDescription}>
                        안건번호: {item.billNumber}<br />
                        발의자: {item.billProposer}<br />
                        정당: {item.poly}<br />
                        소관위: {item.committee}<br />
                        상태: {item.billStatus}
                    </div>
                </div>
            );
        }
    };

    return (
        <Layout style={styles.layout}>
            <div style={styles.searchWrapper}>
                <Select
                    value={searchType}
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
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleSearch}
                />
            </div>

            <div style={styles.content}>
                {loading ? (
                    <div style={styles.loadingContainer}>
                        <Spin size="large" />
                    </div>
                ) : searchResults.length > 0 ? (
                    <>
                        <div style={styles.searchInfo}>
                            {formatSearchQuery(searchType, searchQuery)} 검색 결과: {totalElements}건
                        </div>
                        <List
                            grid={{ gutter: 16, column: 1 }}
                            dataSource={searchResults}
                            renderItem={renderSearchResult}
                        />
                        <div style={styles.paginationWrapper}>
                            <Pagination
                                current={currentPage}
                                pageSize={pageSize}
                                total={totalElements}
                                onChange={handlePageChange}
                                showQuickJumper={false}
                                showSizeChanger={false}
                            />
                        </div>
                    </>
                ) : (
                    <div style={styles.noResults}>
                        검색 결과가 없습니다.
                    </div>
                )}
            </div>
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
        padding: "20px 20%",
        overflowY: "auto",
        height: "calc(100vh - 180px)",
    },
    searchWrapper: {
        paddingTop: "10px",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        gap: "10px",
    },
    searchSelect: {
        width: "180px",
        height: "8.3vh",
        fontSize: "1.2vw",
        textAlign: "center",
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
    loadingContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
    },
    searchInfo: {
        marginBottom: "20px",
        fontSize: "1.2em",
        color: "#666",
    },
    noResults: {
        textAlign: "center",
        padding: "40px",
        fontSize: "1.2em",
        color: "#666",
    },
    textBlock: {
        padding: "16px",
        borderBottom: "1px solid #ddd",
        cursor: "pointer",
    },
    resultTitleWrapper: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
    },
    resultTitle: {
        fontSize: "1.2em",
        color: "#1a0dab",
        fontWeight: "bold",
        marginBottom: "6px",
    },
    resultDescription: {
        fontSize: "0.95em",
        color: "#545454",
    },
    paginationWrapper: {
        display: "flex",
        justifyContent: "center",
        marginTop: "24px",
    },
};

export default SearchResult;
