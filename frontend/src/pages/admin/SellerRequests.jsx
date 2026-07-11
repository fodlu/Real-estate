import { useEffect, useState } from "react";
import { sellerRequestsStyles as s } from "../../assets/dummyStyles";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import API_URL from "../../../config";
import { HiOutlineCheckCircle, HiOutlineClock, HiOutlineMail, HiOutlinePhone } from "react-icons/hi";

const SellerRequests = () => {
	const [requests, setRequests] = useState([]);
	const [loading, setLoading] = useState(true);
	const { token } = useAuth();

	// to fetch the request (made by seller)
	useEffect(() => {
		const fetchRequest = async () => {
			try {
				const res = await axios.get(`${API_URL}/api/admin/pending-sellers`, {
					headers: { Authorization: `Bearer ${token}` },
				});

				if (res.data.success) {
					setRequests(res.data.pendingSellers);
				}
				setLoading(false);
			} catch (err) {
				console.error("Failed to load seller request: ", err);
				setLoading(false);
			}
		};
		fetchRequest();
	}, [token]);

	// to approve a seller
	const handleApprove = async (id) => {
		try {
			const res = await axios.patch(
				`${API_URL}/api/admin/approve-seller/${id}`,
				{},
				{ headers: { Authorization: `Bearer ${token}` } },
			);

			if (res.data.success) {
				setRequests(requests.filter((req) => req._id !== id));
				alert("Seller Approved Successfully");
			}
		} catch (err) {
			alert("Failed to approve the seller: ", err);
		}
	};

	if (loading)
		return (
			<div className={s.loaderFullPage}>
				<div className={s.loader}></div>
			</div>
		);

	return (
		<div className={s.container}>
			<div className={s.headerContainer}>
				<h1 className={s.pageTitle}>Seller Verification</h1>
				<p className={s.pageSubtitle}>
					Review and approve new seller registration request
				</p>
			</div>

			<div className={s.card}>
				<div className={s.cardInner}>
					<h2 className={s.sectionTitle}>
						Pending Requests ({requests.length})
					</h2>

					{requests.length === 0 ?
						<div className={s.emptyState}>
							<HiOutlineCheckCircle size={48} className={s.emptyStateIcon} />
							<p>No Pending seller request at the moment.</p>
						</div>
					:	<div className={s.requestGrid}>
							{requests.map((req) => (
								<div key={req._id} className={s.requestCard}>
									<div className={s.requestHeader}>
										<div className={s.avatar}>
											{req.name.charAt(0).toUpperCase() || "U"}
										</div>

										<div>
											<div className={s.requestName}>{req.name}</div>
											<div className={s.requestDate}>
												<HiOutlineClock /> Joined{" "}
												{new Date(req.createdAt).toLocaleDateString()}
											</div>
										</div>
									</div>

                                    <div className={s.contactInfo}>
                                        <div className={s.contactItem}>
                                            <HiOutlineMail size={18} className="text-primary" />{" "}
                                            {req.email}
                                        </div>
                                        {req.phone && (
                                            <div className={s.contactItem}>
                                                <HiOutlinePhone size={18} className="text-primary" />{" "}
                                                {req.phone}
                                            </div>
                                        )}
                                    </div>

                                    <button onClick={() => handleApprove(req._id)} className={s.approveButton}>
                                        <HiOutlineCheckCircle size={20} />
                                        Approve Seller
                                    </button>
								</div>
							))}
						</div>
					}
				</div>
			</div>
		</div>
	);
};

export default SellerRequests;
