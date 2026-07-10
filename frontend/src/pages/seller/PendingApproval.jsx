import React, { useEffect, useState } from "react";
import { pendingApprovalStyles as s } from "../../assets/dummyStyles";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { HiOutlineClock, HiOutlineRefresh, HiOutlineSupport } from "react-icons/hi";

const PendingApproval = () => {
	const { logout, user, refreshUser } = useAuth();
	const [refreshing, setRefreshing] = useState(false);

	// auto refresh
	useEffect(() => {
		const interval = setInterval(() => refreshUser(), [10000]);
		return clearInterval(interval);
	}, [refreshUser]);

	// handle manual refresh
	const handleManualRefresh = async () => {
		setRefreshing();
		await refreshUser();
		setTimeout(() => setRefreshing(false), 1000);
	};

	return (
		<div className={s.container}>
			<div className={s.iconCircle}>
				<HiOutlineClock size={48} />
			</div>
			<h1 className={s.heading}>Approval Pending</h1>
			<p className={s.description}>
				Hello {user?.name}, your seller account is currently under review by our
				administration teams. Approval usually take less than 24 hours. You will
				gain full dashboard access once you are verfied
			</p>

            <div className={s.buttonGroup}>
                <a href="/properties" className={s.browseButton}>Browse Properties</a>
                <button onClick={handleManualRefresh} disabled={refreshing} className={`${s.refreshButtonBase} ${refreshing ? s.refreshButtonDisabled : s.refreshButtonEnabled}`}>
                    <HiOutlineRefresh size={20} className={refreshing ? "animate-spin" : ""} />
                    {refreshing ? "Checking" : "Check Status Now"}
                </button>
            </div>

            <div className={s.supportContainer}>
                <HiOutlineSupport size={18} />
                Need Help? {" "}
                <Link to='/contact' className={s.supportLink}>Contact Support</Link>
            </div>
		</div>
	);
};

export default PendingApproval;
