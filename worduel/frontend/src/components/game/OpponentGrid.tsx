// src/components/game/OpponentGrid.tsx
import React from "react";
import clsx from "clsx";
import OpponentInfos from "@/components/ui/OpponentInfos";

type OpponentUser = {
  id: string;
  username: string;
  avatar: string;
};

type OpponentGridProps = {
  rows: string[][];
  colors: string[][];
  currentRow: number;
  opponentUser?: OpponentUser;
};

const OpponentGrid: React.FC<OpponentGridProps> = React.memo(({
  rows,
  colors,
  currentRow,
  opponentUser
}) => {
  return (
    <div className="flex flex-row-reverse w-screen content-center justify-evenly mb-4 md:mb-4 xl:mb-6 md:w-full md:mx-24">
      <OpponentInfos
        username={opponentUser?.username || "Opponent"}
        avatar={opponentUser?.avatar}
      />
      <div className="space-y-2">
        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className={clsx("flex space-x-1 md:space-x-2", rowIndex === currentRow ? "some-class-if-needed" : "")}
          >
            {row.map((letter, letterIndex) => (
              <div
                key={letterIndex}
                className={clsx(
                  colors[rowIndex][letterIndex],
                  "rounded-md p-1 w-8 h-2 md:w-10 flex items-center justify-center bg-foreground/10",
                  rowIndex === currentRow
                    ? "opacity-70"
                    : "",
                  rowIndex === currentRow
                )}
              >
                {letter}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
});

export default OpponentGrid;
