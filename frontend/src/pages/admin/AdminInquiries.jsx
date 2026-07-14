import { useEffect, useState } from "react";
import { adminInquiriesStyles as s } from "../../assets/dummyStyles";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import API_URL from "../../../config";
import {
	HiOutlineAnnotation,
	HiOutlineCalendar,
	HiOutlineHome,
} from "react-icons/hi";

const AdminInquiries = () => {
	const [inquiries, setInquiries] = useState([]);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);

	const { token } = useAuth();

	// to fetch the inquiries raised by buyer to seller
	useEffect(() => {
		const fetchInquiries = async () => {
			if (!token) return;
			setLoading(true);
			try {
				console.log("Fetching inquiries...");
				const res = await axios.get(`${API_URL}/api/admin/inquiries`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				// console.log("inquiry response: ", res.data);
				if (res.data.success) {
					setInquiries(res.data.inquiries);
				}
				setLoading(false);
			} catch (error) {
				console.error("Failed to load inquiries: ", error);
				setError(
					error.response?.data?.message ||
						error.message ||
						"Failed to load inquiries",
				);
				setLoading(false);
			}
		};
		fetchInquiries();
	}, [token]);

	if (loading) {
		return (
			<div className='loader-full-page'>
				<div className='loader'></div>
			</div>
		);
	}

	if (error) {
		return (
			<div className='error-container p-8 text-center text-[#dc2626]'>
				<h3>Error loading inquiries</h3>
				<p>{error}</p>
				<button className='btn' onClick={() => window.location.reload()}>
					Retry
				</button>
			</div>
		);
	}

	return (
		<>
			<div className={s.headerContainer}>
				<h1 className={s.headerTitle}>Platform Inquiries</h1>
				<p className={s.headerSubtitle}>
					Review communication between buyers and sellers.
				</p>
			</div>

			<div className={s.listContainer}>
				{inquiries.map((inq) => (
					<div key={inq._id} className={s.inquiryCard}>
						<div className={s.cardTopSection}>
							<div className={s.propertyInfoWrapper}>
								<div className={s.propertyIconWrapper}>
									<HiOutlineHome size={24} />
								</div>

								<div className={s.propertyTextWrapper}>
									<div className={s.propertyTitle}>
										{inq.property?.title || "Unknown Property"}
									</div>
									<div className={s.propertyId}>
										Property ID: {inq.property?._id}
									</div>
								</div>
							</div>

							<div className={s.dateWrapper}>
								<HiOutlineCalendar className={s.dateIcon} />{" "}
								{new Date(inq.createdAt).toLocaleDateString()}
							</div>
						</div>

						<div className={s.detailsGrid}>
							<div className={s.detailCard}>
								<div className={s.detailLabel}>Buyer Label</div>
								<div className={s.detailName}>{inq.buyer?.name}</div>
								<div className={s.detailEmail}>{inq.buyer?.email}</div>
							</div>

							<div className={s.detailCard}>
								<div className={s.detailLabel}>Seller Label</div>
								<div className={s.detailName}>{inq.seller?.name}</div>
								<div className={s.detailEmail}>{inq.seller?.email}</div>
							</div>
						</div>

						<div className={s.messageContainer}>
							<div className={s.messageHeader}>
								<HiOutlineAnnotation /> MESSAGE
							</div>
							<p className={s.messageText}>"{inq.message}"</p>
						</div>
					</div>
				))}

				{inquiries.length === 0 && (
					<div className={s.emptyState}>
						<div className={s.emptyIconWrapper}>
							<HiOutlineAnnotation size={48} className='mx-auto' />
						</div>
						<h2> No Inquiries found</h2>
                        <p className={s.emptyText}>There are no inquiries recorded on the platform</p>
					</div>
				)}
			</div>
		</>
	);
};

export default AdminInquiries;
