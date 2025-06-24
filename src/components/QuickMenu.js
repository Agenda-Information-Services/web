import React from "react";
import { useNavigate } from "react-router-dom";
import HoverIcon from "../assets/icons/HoverIcon";
import searchIcon from "../assets/icons/search.gif";
import searchIcon2 from "../assets/icons/search.png";
import recommendIcon from "../assets/icons/recommend.gif";
import recommendIcon2 from "../assets/icons/recommend.png";
import rankIcon from "../assets/icons/rank.gif";
import rankIcon2 from "../assets/icons/rank.png";
import discussIcon from "../assets/icons/discuss.gif";
import discussIcon2 from "../assets/icons/discuss.png";
import listIcon from "../assets/icons/list.gif";
import listIcon2 from "../assets/icons/list.png";
import proposerIcon from "../assets/icons/proposer.gif";
import proposerIcon2 from "../assets/icons/proposer.png";


const menuItems = [
    {
        label: "법안 검색",
        path: "/",
        staticIcon: searchIcon2,
        hoverIcon: searchIcon,
    },
    {
        label: "추천 법안",
        path: "/recommend",
        staticIcon: recommendIcon2,
        hoverIcon: recommendIcon,
    },
    {
        label: "법안 랭킹",
        path: "/ranking",
        staticIcon: rankIcon2,
        hoverIcon: rankIcon,
    },
    {
        label: "법안 토의",
        path: "/discussion",
        staticIcon: discussIcon2,
        hoverIcon: discussIcon,
    },
    {
        label: "법안 리스트",
        path: "/bills",
        staticIcon: listIcon2,
        hoverIcon: listIcon,
    },
    {
        label:"발의자 리스트",
        path:"/proposers",
        staticIcon: proposerIcon2,
        hoverIcon: proposerIcon
    }
];

const QuickMenu = () => {
    const navigate = useNavigate();

    return (
        <>
            <div style={styles.wrapper}>
                {menuItems.map((item, idx) => (
                    <div
                        key={idx}
                        onClick={() => navigate(item.path)}
                        style={styles.menuItem}
                    >
                        <HoverIcon
                            staticSrc={item.staticIcon}
                            hoverSrc={item.hoverIcon}
                        />
                        <div style={styles.label}>{item.label}</div>
                    </div>
                ))}
            </div>

            <div style={styles.footer}>
                Animated icons by Lordicon.com
            </div>
        </>
    );
};

const styles = {
    wrapper: {
        width: "50vw",
        margin: "2px auto 20px auto",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    menuItem: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        cursor: "pointer",
    },
    label: {
        fontSize: "16px",
        color: "#111",
    },
    footer: {
        position: "fixed",
        bottom: 10,
        right: 20,
        fontSize: "10px",
        color: "rgba(0, 0, 0, 0.2)",
        pointerEvents: "none",
        zIndex: 1000,
    },
};

export default QuickMenu;
