import { useContext } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { LogOut, User } from "lucide-react";
import avatar from "@/assets/images/avatar.jpg";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { AuthContext } from '../../context/AuthContext';
import { useQuery } from "@apollo/client";
import { GET_USER_PROFILE } from "@/api/login";

const AvatarMenu: React.FC = () => {
	const navigate = useNavigate();
	const { logout } = useContext(AuthContext);

	const handleLogout = async () => {
		await logout();
		navigate('/');
		toast.success("Déconnexion réussie");
	  };
	
	  // Query pour récuperer l'image de profil
	const { data } = useQuery(GET_USER_PROFILE);
	
	return (
		<>
			<DropdownMenu.Root>
				<DropdownMenu.Trigger asChild>
					<Avatar className="cursor-pointer rounded-full h-full">
						<AvatarImage
							src={data?.me?.avatar ? `/images/${data.me.avatar}` : avatar}
							alt="User Avatar"
							className="object-cover h-8 w-8 rounded-full"
						/>
						<AvatarFallback>WD</AvatarFallback>
					</Avatar>
				</DropdownMenu.Trigger>

				<DropdownMenu.Content
					align="start"
					className="w-48 mt-2 bg-white rounded-lg"
				>
					<Link to="/profile">
						<DropdownMenu.Item className="flex items-center px-4 py-2 hover:bg-foregroundhover hover:outline-none text-white cursor-pointer">
							<User className="mr-2 h-4 w-4 bg-inherit" />
							<p className="bg-inherit">Mon Compte</p>
						</DropdownMenu.Item>
					</Link>
					<DropdownMenu.Item
						onClick={handleLogout}
						className="flex items-center px-4 py-2 hover:bg-foregroundhover hover:outline-none text-white cursor-pointer"
					>
						<LogOut className="mr-2 h-4 w-4 bg-inherit" />
						<p className="bg-inherit">Déconnexion</p>
					</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
			<ToastContainer position="top-center" autoClose={1000} hideProgressBar  />
			{/* Style du toast a modifier */}
		</>
	);
};

export default AvatarMenu;
