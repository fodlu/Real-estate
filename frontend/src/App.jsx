import { Route, Routes } from "react-router-dom";
import LandingPage from "./pages/shared/LandingPage";
import Properties from "./pages/shared/Properties";
import PropertyDetail from "./pages/shared/PropertyDetail";
import Register from "./pages/auth/Register";
import VerifyEmail from "./pages/auth/VerifyEmail";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

const App = () => {
	return (
		<div>
			<Routes>
				<Route path='/register' element={<Register />} />
				<Route path='/verify-email' element={<VerifyEmail />} />
				<Route path='/login' element={<Login />} />
				<Route path='/forget-password' element={<ForgotPassword />} />
				<Route path='/reset-password/:token' element={<ResetPassword />} />

				<Route path='/' element={<LandingPage />} />
				<Route path='/properties' element={<Properties />} />
				<Route path='/property/:id' element={<PropertyDetail />} />
			</Routes>
		</div>
	);
};

export default App;
