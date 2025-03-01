interface GameTitleProps {
    title: string;
}

const GameTitle = ({ title }: GameTitleProps) => {
    return (
        <div className="absolute top-12 w-screen bg-transparent">
            <div className="text-foreground/10 text-xl md:text-2xl font-semibold bg-transparen uppercase mb-2">
                {title}
            </div>
        </div>
    );
};

export default GameTitle;
