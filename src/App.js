import './styles/fonts.css';
import 'antd/dist/reset.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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

const App = () => {
    return (
        <>
            <Router>
                <Routes>
                    <Route path="/" element={<MainLayout><MainSearch /></MainLayout>} />
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
            </Router>
        </>
    );
};

export default App;