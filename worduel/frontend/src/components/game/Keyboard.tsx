import React from "react";
import { Button } from "@/components/ui/button";
import BackspaceIcon from "@mui/icons-material/Backspace";
import CheckIcon from "@mui/icons-material/Check";

type KeyboardProps = {
	onKeyPress: (key: string) => void;
	keyboardColors: Record<string, string>;
};

const Keyboard: React.FC<KeyboardProps> = ({ onKeyPress, keyboardColors }) => {
	const renderKey = (label: string) => (
		<Button
			key={label}
			className={`my-1 p-2 h-10 w-8 text-sm md:h-12 md:w-16 md:text-xl ${keyboardColors[label]} hover:bg-foreground/50 hover:shadow-[0_0_12px_4px_hsl(var(--foreground)/0.15)] `}
			onClick={() => onKeyPress(label)}
		>
			{label}
		</Button>
	);
	return (
		<div className="flex justify-center">
			<div className="lg:space-y-1">
				<div className="flex justify-center space-x-1 md:space-x-2">
					{"AZERTYUIOP".split("").map((char) => renderKey(char))}
				</div>

				<div className="flex justify-center space-x-1 md:space-x-2">
					{"QSDFGHJKLM".split("").map((char) => renderKey(char))}
				</div>

				<div className="flex justify-center space-x-1 md:space-x-2">
					<Button
						key="Effacer"
						className="my-1 w-12 h-10 text-base md:w-24 md:h-12 md:text-xl bg-keyboardbackground hover:bg-foreground/50 hover:shadow-[0_0_12px_4px_hsl(var(--foreground)/0.15)]"
						onClick={() => onKeyPress("Effacer")}
					>
						<BackspaceIcon
							sx={{
								width: "2rem !important",
								height: "2rem !important",
							}}
							className="bg-transparent"
						/>
					</Button>
					{"WXCVBN".split("").map((char) => renderKey(char))}
					<Button
						key="Entrer"
						className="my-1 w-12 h-10 text-base md:w-24 md:h-12 md:text-xl bg-keyboardbackground hover:bg-foreground/50 hover:shadow-[0_0_12px_4px_hsl(var(--foreground)/0.15)]"
						onClick={() => onKeyPress("Entrer")}
					>
						<CheckIcon
							sx={{
								width: "2rem !important",
								height: "2rem !important",
							}}
							className="bg-transparent"
						/>
					</Button>
				</div>
			</div>
		</div>
	);
};

export default Keyboard;