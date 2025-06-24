import React from 'react';
import UserHeader from './Header';
import QuickMenu from './QuickMenu';

const MainLayout = ({ children }) => {
    return (
        <div style={styles.layout}>
            <header style={styles.header}>
                <UserHeader />
            </header>
            <main style={styles.content}>
                {children}
            </main>
            <footer style={styles.footer}>
                <QuickMenu />
            </footer>
        </div>
    );
};

const styles = {
    layout: {
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
    },
    header: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
    },
    content: {
        paddingTop: '64px',
        paddingBottom: '130px', // 퀵메뉴가 가리지 않도록 넉넉한 하단 여백 확보
        height: '100vh',
        overflowY: 'auto',      // 스크롤이 필요할 때만 자동으로 나타나도록 변경
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
    },
    footer: {
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        backgroundColor: '#fff',
    },
};

export default MainLayout;