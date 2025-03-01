import clsx from "clsx";
import useWindowHeight from "@/hooks/useWindowHeight";

type GameGridProps = {
	rows: string[][];
	colors: string[][];
	correctPositions: (string | null)[];
	shakeRow: boolean;
	currentRow: number;
	isGameSoloGrid?: boolean;
};



const GameGrid: React.FC<GameGridProps> = ({
	rows,
	colors,
	correctPositions,
	shakeRow,
	currentRow,
	isGameSoloGrid,
}) => {

	const windowHeight = useWindowHeight();

	return (
        <div className="space-y-2 md:space-y-2 lg:space-y-3 my-4 xl:space-y-4 xl:my-8 w-3/6 flex flex-col items-center">
            {rows.map((row, rowIndex) => (
				<div
					key={rowIndex}
					className={clsx(
						"flex space-x-2 md:space-x-2 lg:space-x-3 xl:space-x-4",
						shakeRow && rowIndex === currentRow && "animate-shake"
					)}
				>
					{row.map((letter, letterIndex) => (
						<div
							key={letterIndex}
							className={clsx(
								colors[rowIndex][letterIndex],
								isGameSoloGrid
									? "w-12 h-12 text-2xl xl:w-14 xl:h-14"
									: windowHeight > 750
									? "w-10 h-10 text-xl lg:w-12 lg:h-12 xl:w-14 xl:h-14"
									: "w-8 h-8 text-xl lg:w-12 lg:h-12 xl:w-14 xl:h-14",
								"rounded-md p-2 text-center md:w-10 md:h-10 flex items-center justify-center font-extrabold md:text-2xl lg:text-3xl",
								rowIndex === currentRow &&
									!letter &&
									correctPositions[letterIndex]
									? "opacity-70"
									: "",
								rowIndex === currentRow &&
									letterIndex ===
										row.findIndex((char) => char === "")
									? "ring-2 ring-primary"
									: ""
							)}
						>
							{letter ||
								(rowIndex === currentRow &&
									!letter &&
									correctPositions[letterIndex]) ||
								""}
						</div>
					))}
				</div>
			))}
		</div>
	);
};

export default GameGrid;