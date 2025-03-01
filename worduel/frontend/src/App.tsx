import {
	BrowserRouter as Router,
	Routes,
	Route,
} from "react-router-dom";
import { useContext } from "react";
import Home from "./Pages/Home";
import RegisterPage from "./Pages/RegisterPage";
import ConnexionPage from "./Pages/ConnexionPage";
import GameModeSelection from "./Pages/GameModeSelection";
import HistoryPage from "./Pages/HistoryPage";
import LeaderboardPage from "./Pages/LeaderboardPage";
import ProfilePage from "./Pages/ProfilePage";
import NotFound from "./Pages/NotFound";
import Navbar from "./components/layout/Navbar";
import client from "./ApolloClient";
import { ApolloProvider } from "@apollo/client";
import SoloGame from "./Pages/SoloGame";
import SoloGameNoAuth from "./Pages/SoloGameNoAuth";
import DuelGame from "./Pages/DuelGame";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import "./style/app.css";
import ProtectedRoute from "./context/ProtectedRoute";
import ConfirmLinkAccount from "./Pages/ConfirmLinkAccount";
import { ColorPreferenceProvider } from "./context/ColorPreferenceContext.tsx";
import ConfirmLinkGoogle from "./Pages/ConfirmLinkGoogle";
import LinkEmailSuccess from "./Pages/LinkEmailSuccess";
import Loader from "./components/ui/Loader";
import ForgotPasswordRequest from "./Pages/ForgotPasswordRequest";
import ResetPassword from "./Pages/ResetPassword";

function App() {
	const { isAuthenticated, isLoading } = useContext(AuthContext);

	if (isLoading) {
		<Loader />
	}

	return (
		<>
			{isAuthenticated && <Navbar />}

			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/register" element={<RegisterPage />} />
				<Route path="/connexion" element={<ConnexionPage />} />
				<Route
					path="/confirm-link-account"
					element={<ConfirmLinkAccount />}
				/>
				<Route
					path="/confirm-link-google"
					element={<ConfirmLinkGoogle />}
				/>
				<Route path="/link-email-success" element={<LinkEmailSuccess />} />
				<Route
					path="/forgot-password"
					element={<ForgotPasswordRequest />}
				/>
				<Route path="/reset-password" element={<ResetPassword />} />
				<Route
					path="/game-mode-selection"
					element={<ProtectedRoute element={<GameModeSelection />} />}
				/>
				<Route
					path="/solo"
					element={<ProtectedRoute element={<SoloGame />} />}
				/>
				<Route path="/solo-no-auth" element={<SoloGameNoAuth />} />
				<Route
					path="/duel"
					element={<ProtectedRoute element={<DuelGame />} />}
				/>
				<Route
					path="/history"
					element={<ProtectedRoute element={<HistoryPage />} />}
				/>
				<Route
					path="/leaderboard"
					element={<ProtectedRoute element={<LeaderboardPage />} />}
				/>
				<Route
					path="/profile"
					element={<ProtectedRoute element={<ProfilePage />} />}
				/>
				<Route path="*" element={<NotFound />} />
			</Routes>
		</>
	);
}

function Root() {
	return (
		<ApolloProvider client={client}>
			<AuthProvider>
				<Router>
					<ColorPreferenceProvider>
					<App />
					</ColorPreferenceProvider>
				</Router>
			</AuthProvider>
		</ApolloProvider>
	);
}

export default Root;
