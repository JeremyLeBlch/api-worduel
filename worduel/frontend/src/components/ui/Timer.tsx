import { useState, useEffect } from "react";

interface TimerProps {
    initialTime: number;
}

const Timer = ({ initialTime }: TimerProps) => {
    const [timeLeft, setTimeLeft] = useState(initialTime);

    useEffect(() => {
        if (timeLeft === 0) return;
        const timerId = setInterval(() => {
            setTimeLeft((prevTime) => prevTime - 1);
        }, 1000);

        return () => clearInterval(timerId);
    }, [timeLeft]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
            .toString()
            .padStart(2, "0")}`;
    };

    return (
        <>
            <div className="bg-gradient-to-r from-transparent via-foreground/20 to-transparent w-full p-1">
                <p className="bg-transparent text-md lg:text-xl xl:text-2xl uppercase text-foreground">
                    Temps restant :{" "}
                    <span className={`bg-transparent font-semibold ${timeLeft <= 10 ? "text-secondary" : "text-foreground"}`}>
                        {formatTime(timeLeft)}
                    </span>
                </p>
            </div>
        </>
    );
};

export default Timer;