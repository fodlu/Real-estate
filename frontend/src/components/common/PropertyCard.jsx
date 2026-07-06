import React from "react";
import { propertyCardStyles as s } from "../../assets/dummyStyles";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { HiEye, HiHeart, HiLocationMarker, HiOutlineHeart, HiShieldCheck } from "react-icons/hi";

const PropertyCard = ({
	property,
	renderActions,
	isWishListed,
	onToggleWishlist,
}) => {
	if (!property) return null;

	const { user } = useAuth();
	const navigate = useNavigate();

	// for wishlist click
	const handleWishlistClicks = (e) => {
		e.preventDefault();
		e.preventPropagation();

		if (!user) {
			navigate("/login");
			return;
		}
		if (onToggleWishlist) {
			onToggleWishlist(property._id);
		}
	};

	const formattedPrice = new Intl.NumberFormat("en-IN", {
		style: "currency",
		currency: "NGA",
		maximumFractionDigits: 0,
	}).format(property.price);

	const statusBadgeClass = s.badgeStatus(property.status);

	return (
		<div className={s.card}>
			<Link to={`/property/${property._id}`} className={s.link}>
				<div className={s.imageSection}>
					<img
						src={property.image[0]}
						alt={property.title}
						className={s.image}
					/>

                    {/* top badge section */}
                    <div className={s.topBadges}>
                        <div className={s.badgesLeft}>
                            {renderActions ? (
                                <span className={statusBadgeClass}>
                                    {property.status === 'sale' ? "available" : property.status}
                                </span>
                            ) : (
                                <span className={s.badgeNew}>New</span>
                            )}
                            <span className={s.badgeVerified}>
                                <HiShieldCheck size={14} /> Verified
                            </span>
                        </div>

                        {(!user || user.role === 'buyer') && (
                            <button className={s.wishlistButton(isWishListed)} onClick={handleWishlistClicks}>
                                {isWishListed ? (
                                    <HiHeart size={20} />
                                ) : (
                                    <HiOutlineHeart size={20} />
                                )}
                            </button>
                        )}
                    </div>

                    <div className={s.priceOverlay}>
                        <h3 className={s.price}>{formattedPrice}</h3>
                    </div>
				</div>

                <div className={s.content}>
                    <div className="flex justify-between items-center">
                        <span className={s.propertyType}>{property.propertyType}</span>
                        {property.views !== undefined} && (
                            <div className={s.views}>
                                <HiEye size={16} /> {property.views}
                            </div>
                        )
                    </div>

                    <h4 className={s.title}>{property.title}</h4>

                    <div className={s.location}>
                        <HiLocationMarker className={s.locationIcon} />
                        <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                            {property.area}, {property.city}
                        </span>
                    </div>

                    
                </div>
			</Link>
		</div>
	);
};

export default PropertyCard;
