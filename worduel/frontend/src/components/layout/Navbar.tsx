import LightModeIcon from "@mui/icons-material/LightMode";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import HelpIcon from "@mui/icons-material/Help";
import AvatarMenu from "../ui/AvatarMenu";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { useDarkMode } from "../../context/DarkModeContext";
import { Link, useLocation } from "react-router-dom";
import Logo from "../ui/Logo";

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import HelpPopover from "@/components/layout/HelpPopover";

const Navbar = () => {
	const { isDarkMode, toggleDarkMode } = useDarkMode();
	const location = useLocation();
	const isActive = (path: string) => location.pathname === path;

	return (
		<nav className="fixed top-0 left-0 h-12 w-full flex items-center justify-between p-2 z-20">
			<Link to="/game-mode-selection" className="h-full object-contain">
				<div className="h-full object-contain hover:cursor-pointer">
					<Logo />
				</div>
			</Link>

			<div className="flex items-center space-x-4">

				<Popover>
					<PopoverTrigger>
						<HelpIcon
							className="opacity-30 hover:opacity-100 hover:cursor-pointer"
						/>
					</PopoverTrigger>
					<PopoverContent>
						<HelpPopover />
					</PopoverContent>
				</Popover>


				<Link to="/game-mode-selection">
					<SportsEsportsIcon
						className={`hover:opacity-100 hover:cursor-pointer ${isActive("/game-mode-selection") ||
								isActive("/solo") ||
								isActive("/duel")
								? "opacity-100"
								: "opacity-30"
							}`}
					/>
				</Link>
				<Link to="/history">
					<LeaderboardIcon
						className={`hover:opacity-100 hover:cursor-pointer ${isActive("/history")
								? "opacity-100"
								: "opacity-30"
							}`}
					/>
				</Link>
				<Link to="/leaderboard">
					<EmojiEventsIcon
						className={`hover:opacity-100 hover:cursor-pointer ${isActive("/leaderboard") ? "opacity-100" : "opacity-30"
							}`}
					/>
				</Link>
				{isDarkMode ? (
					<LightModeIcon
						className="opacity-30 hover:opacity-100 hover:cursor-pointer"
						onClick={toggleDarkMode}
					/>
				) : (
					<DarkModeIcon
						className="opacity-30 hover:opacity-100 hover:cursor-pointer"
						onClick={toggleDarkMode}
					/>
				)}
				<AvatarMenu />
			</div>
		</nav>
	);
};

export default Navbar;
