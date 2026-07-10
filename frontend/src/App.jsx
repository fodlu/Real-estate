import { Route, Routes } from "react-router-dom";
import LandingPage from "./pages/shared/LandingPage";
import Properties from "./pages/shared/Properties";
import PropertyDetail from "./pages/shared/PropertyDetail";
import Register from "./pages/auth/Register";
import VerifyEmail from "./pages/auth/VerifyEmail";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import Profile from "./pages/shared/Profile";
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import SellerRequests from "./pages/admin/SellerRequests";
import AdminProperty from "./pages/admin/AdminProperty";
import AdminInquiries from "./pages/admin/AdminInquiries";
import AdminContacts from "./pages/admin/AdminContacts";
import SellerLayout from "./components/SellerLayout";
import SellerDashboard from "./pages/seller/SellerDashboard";

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

				<Route path='/profile' element={<Profile />} />

				<Route element={<SellerLayout />}>
					<Route path="/dashboard" element={<SellerDashboard />} />
				</Route>

				<Route element={<AdminLayout />}>
					<Route path="/admin-dashboard" element={<AdminDashboard />} />
					<Route path="/admin/users" element={<AdminUsers />} />
					<Route path="/admin/seller-requests" element={<SellerRequests />} />
					<Route path="/admin/properties" element={<AdminProperty />} />
					<Route path="/admin/inquiries" element={<AdminInquiries />} />
					<Route path="/admin/contacts" element={<AdminContacts />} />
				</Route>
			</Routes>
		</div>
	);
};

export default App;
