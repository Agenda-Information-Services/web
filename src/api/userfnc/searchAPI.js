import apiClient from "../apiClient";

// 검색어를 공백 기준으로 분할하고 필요한 만큼의 단어를 반환
const splitSearchQuery = (query, count) => {
    const words = query.trim().split(/\s+/);
    return words.slice(0, count);
};

// 검색 조건에 따라 API endpoint URL을 구성
export const searchBills = async (type, query, page = 0, size = 10) => {
    const encodedQuery = encodeURIComponent(query);
    let url = "";

    if (type === "billTitle") {
        url = `/bills/search?title=${encodedQuery}&page=${page}&size=${size}`;
        const response = await apiClient.get(url);
        return response.data;
    } else if (type === "proposers") {
        url = `/proposers/search?keyword=${encodedQuery}&page=${page}&size=${size}`;
        const response = await apiClient.get(url);
        return response.data;
    } else if (type === "proposerInfo") {
        url = `/bills/search?proposer=${encodedQuery}&page=${page}&size=${size}`;
        const response = await apiClient.get(url);
        return response.data;
    } else if (type === "detail") {
        url = `/bills/search?detail=${encodedQuery}&page=${page}&size=${size}`;
        const response = await apiClient.get(url);
        return response.data;
    } else if (type === "titleProposer") {
        const [title, proposer] = splitSearchQuery(query, 2);
        url = `/bills/search?title=${encodeURIComponent(title)}&proposer=${encodeURIComponent(proposer || '')}&page=${page}&size=${size}`;
        const response = await apiClient.get(url);
        return response.data;
    } else if (type === "titleProposerDetail") {
        const [title, proposer, detail] = splitSearchQuery(query, 3);
        url = `/bills/search?title=${encodeURIComponent(title)}&proposer=${encodeURIComponent(proposer || '')}&detail=${encodeURIComponent(detail || '')}&page=${page}&size=${size}`;
        const response = await apiClient.get(url);
        return response.data;
    } else if (type === "committee") {
        url = `/bills/search?committee=${encodedQuery}&page=${page}&size=${size}`;
        const response = await apiClient.get(url);
        return response.data;
    } else if (type === "all") {
        const [title, proposer, detail, committee] = splitSearchQuery(query, 4);
        url = `/bills/search?title=${encodeURIComponent(title)}&proposer=${encodeURIComponent(proposer || '')}&detail=${encodeURIComponent(detail || '')}&committee=${encodeURIComponent(committee || '')}&page=${page}&size=${size}`;
        const response = await apiClient.get(url);
        return response.data;
    } else if (type === "embeding") {
        // 자연어 검색: POST 방식
        const response = await apiClient.post('/recommend', { query });
        return response.data;
    } else {
        throw new Error("지원하지 않는 검색 타입입니다.");
    }
};

// 사용자 친화적인 검색 설명 포맷
export const formatSearchQuery = (type, query) => {
    if (type === "billTitle") return `"${query}"에 대한 법안명`;
    if (type === "proposers") return `"${query}"에 대한 발의자`;
    if (type === "detail") return `"${query}"에 대한 내용`;
    if (type === "committee") return `"${query}"에 대한 소관위`;
    
    // 복합 검색의 경우 검색어를 분리하여 표시
    const words = query.trim().split(/\s+/);
    if (type === "titleProposer") {
        return `법안명 "${words[0] || ''}" 발의자 "${words[1] || ''}"에 대한 검색`;
    }
    if (type === "titleProposerDetail") {
        return `법안명 "${words[0] || ''}" 발의자 "${words[1] || ''}" 내용 "${words[2] || ''}"에 대한 검색`;
    }
    if (type === "all") {
        return `법안명 "${words[0] || ''}" 발의자 "${words[1] || ''}" 내용 "${words[2] || ''}" 소관위 "${words[3] || ''}"에 대한 검색`;
    }
    
    return `"${query}"에 대한 결과`;
};
