import { Link } from "react-router-dom";
import { logoStyles as s } from "../../assets/dummyStyles";

const Logo = ({
	fontSize = "1.5rem",
	iconSize = 24,
	showText = true,
	...props
}) => {
	return (
		<Link
			to='/'
			{...props}
			className={`${s.link} ${props.className || ""}`}
            style={{fontSize, ...props.style}}>
                <div className={s.iconWrapper}>

                </div>
            </Link>
	);
};

export default Logo;
