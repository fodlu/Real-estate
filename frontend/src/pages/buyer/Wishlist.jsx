import { useEffect, useState } from "react";
import { wishlistStyles as s } from "../../assets/dummyStyles";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/common/Navbar";
import API_URL from "../../../config";
import axios from "axios";
import { HiHeart, HiTrash } from "react-icons/hi";
import { Link } from "react-router-dom";
import PropertyCard from "../../components/common/PropertyCard";

const Wishlist = () => {
	const { token } = useAuth();
	const [wishlists, setWishlists] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// to remove property from the wishlist
	const removeFromWishlist = async (propertyId) => {
		if (!propertyId) {
			alert("Invalid Property ID");
			return;
		}

		try {
			await axios.delete(`${API_URL}/api/wishlist`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			setWishlists((prev) =>
				prev.filter(
					(item) => item.property && item.property._id !== propertyId,
				),
			);
		} catch (err) {
			const errorMessage =
				err.response?.data?.message || "Failed to remove from wishlist";
			alert(errorMessage);
		}
	};

	useEffect(() => {
		const fetchWishlist = async () => {
			try {
				const res = await axios.get(`${API_URL}/api/wishlist`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				if (res.data.success) {
					setWishlists(res.data.data);
					setError(null);
					setLoading(false);
				}
			} catch {
				setError("Failed to load wishlists.");
				setLoading(false);
			}
		};
		fetchWishlist();
	}, []);

	if (loading) {
		return (
			<div className={s.loaderFullPage}>
				<div className={s.loader}></div>
			</div>
		);
	}

	return (
		<div className={s.pageContainer}>
			<Navbar />

			<main className={s.mainContainer}>
				<div className={s.headingWrapper}>
					<h1 className={s.heading}>Your Wishlist</h1>
					<p className={s.subheading}>Properties you have saved for later.</p>
				</div>

				{wishlists.length === 0 ?
					<div className={s.emptyCard}>
						<div className={s.emptyIconWrapper}>
							<HiHeart size={40} />
						</div>

						<h2 className={s.emptyTitle}>Your wishlist is empty</h2>
						<p className={s.emptyText}>
							Start exploring properties and save your favorites
						</p>

						<Link to='/' className={s.browseButton}>
							Browse Properties
						</Link>
					</div>
				:	<div className={s.gridContainer}>
						{wishlists
							?.filter((item) => item.property)
							.map((item) => (
								<PropertyCard
									key={item._id}
									property={item.property}
									renderActions={() => (
										<button
											onClick={(e) => {
												e.preventDefault();
												e.stopPropagation();
												removeFromWishlist(item.property._id);
											}}
											className={s.removeButton}>
											<HiTrash size={18} /> Remove From Wishlist
										</button>
									)}
								/>
							))}
					</div>
				}
			</main>
		</div>
	);
};

export default Wishlist;
