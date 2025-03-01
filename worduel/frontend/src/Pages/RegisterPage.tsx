import RegisterForm from "@/components/layout/RegisterForm";
import Logo from "@/components/ui/Logo";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
	const navigate = useNavigate();
	
	return (
		<div className="flex flex-col h-screen justify-center">
			<section className="w-screen flex align-center justify-center h-10 sm:h-20 mb-1">
				<button onClick={() => navigate('/')}>
					<Logo />
				</button>
			</section>
			<section className="w-screen flex flex-col align-center justify-center max-h-full max-w-full">
				<h2 className="text-3xl text-center">Inscription</h2>
				<RegisterForm />
			</section>
		</div>
	);
};

export default RegisterPage;
