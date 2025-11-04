import './styles/fonts.css';
import 'antd/dist/reset.css';

import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

import AdminDashboard from "./pages/admin/AdminDashboard";
import MainSearch from "./pages/MainSearch";
import Signup from "./pages/Signup";
import MyPage from "./pages/MyPage";
import Discussion from "./pages/Discussion";
import DiscussionDetail from "./pages/DiscussionDetail";
import PrivateRoute from "./routes/PrivateRoute";
import AdminRoute from "./routes/AdminRoute";
import Ranking from "./pages/Ranking";
import SearchResult from './pages/SearchResult';
import BillDetail from './pages/BillDetail';
import ProposerDetail from './pages/ProposerDetail';
import Bills from './pages/Bills';
import Proposers from './pages/Proposers';
import AdminReportPage from "./pages/admin/AdminReportPage";
import AdminReportDetailPage from "./pages/admin/AdminReportDetailPage";
import Recommend from "./pages/RecommendedBills";
import MainLayout from './components/MainLayout';
import SurveyPopup from './components/SurveyPopup';
import AuthLanding from './pages/AuthLanding'; // [추가] 새로운 랜딩 페이지 임포트

const SURVEY_THRESHOLD_MINUTES = 7;
const SURVEY_THRESHOLD_PAGES = 25;
const SURVEY_LINK = "https://forms.gle/T5dfHL2TFuzmvXWG8";

const useSurveyTrigger = () => {
    const location = useLocation();
    const [pageCount, setPageCount] = useState(0);
    const [showSurvey, setShowSurvey] = useState(false);

    const handleClose = useCallback(() => {
        setShowSurvey(false);
        sessionStorage.setItem('survey_seen', 'true');
    }, []);

    useEffect(() => {
        setPageCount(prev => {
            const newCount = prev + 1;
            if (newCount >= SURVEY_THRESHOLD_PAGES && !sessionStorage.getItem('survey_seen')) setShowSurvey(true);
            return newCount;
        });
    }, [location.pathname]);

    useEffect(() => {
        if (sessionStorage.getItem('survey_seen') || showSurvey) return;
        const timer = setTimeout(() => {
            setShowSurvey(true);
        }, SURVEY_THRESHOLD_MINUTES * 60 * 1000);
        return () => clearTimeout(timer);
    }, [showSurvey]);
    return { showSurvey, handleClose };
};

const AppContent = () => {
    const { showSurvey, handleClose } = useSurveyTrigger();
    const isAuthLanding = useLocation().pathname === '/';

    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<AuthLanding />} />
                <Route path="/mainsearch" element={<PrivateRoute><MainLayout><MainSearch /></MainLayout></PrivateRoute>} />
                <Route path="/discussion" element={<MainLayout><Discussion /></MainLayout>} />
                <Route path="/discussion/:postId" element={<MainLayout><DiscussionDetail /></MainLayout>} />
                <Route path="/ranking" element={<MainLayout><Ranking /></MainLayout>} />
                <Route path="/searchresult" element={<MainLayout><SearchResult /></MainLayout>} />
                <Route path="/bills/:billId" element={<MainLayout><BillDetail /></MainLayout>} />
                <Route path="/proposers/:proposerId" element={<MainLayout><ProposerDetail /></MainLayout>} />
                <Route path="/bills" element={<MainLayout><Bills /></MainLayout>} />
                <Route path="/proposers" element={<MainLayout><Proposers /></MainLayout>} />

                <Route path="/signup" element={<Signup />} />

                <Route path="/mypage" element={<PrivateRoute><MyPage /></PrivateRoute>} />
                <Route path="/recommend" element={<PrivateRoute><MainLayout><Recommend /></MainLayout></PrivateRoute>} />

                <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                <Route path="/admin/reports" element={<AdminRoute><AdminReportPage /></AdminRoute>} />
                <Route path="/admin/report/:reportId" element={<AdminRoute><AdminReportDetailPage /></AdminRoute>} />
            </Routes>

            {!isAuthLanding && (
                <SurveyPopup
                    isVisible={showSurvey}
                    onClose={handleClose}
                    surveyLink={SURVEY_LINK}
                />
            )}
        </div>
    );
};

const App = () => {
    return (
        <Router>
            <AppContent />
        </Router>
    );
};

export default App;