import useWindowHeight from "@/hooks/useWindowHeight";

const HelpPopover = () => {

    const windowHeight = useWindowHeight();
    console.log(windowHeight);

    return (
        <div className={`bg-transparent text-sm mx-auto p-2 pb-4 text-justify max-h-full overflow-y-auto ${windowHeight < 900 ? 'w-full' : 'w-full xl:w-5/12'}`}>
            <h2 className="text-3xl font-semibold mb-4 text-foreground bg-transparent text-center md:text-justify ">
                Comment jouer à Worduel ?
            </h2>

            <section className="mb-4 bg-transparent">
                <p className="text-foreground mb-2 bg-transparent">
                    Dans <strong className="bg-transparent">Worduel</strong>, l'objectif est de deviner un mot mystère en un nombre limité de tentatives. Voici comment jouer :
                </p>

                <h3 className="text-2xl font-semibold mb-2 text-foreground bg-transparent">
                    Les couleurs des lettres :
                </h3>
                <ul className="list-none text-left text-foreground bg-transparent space-y-2">
                    <li className="flex items-center space-x-2 bg-transparent">
                        <div className="w-8 h-8  text-lg md:text-xl rounded-md p-2 flex items-center justify-center font-extrabold bg-gray-500 text-background">
                            A
                        </div>
                        <span className="bg-transparent">Les lettres grises ne sont pas dans le mot.</span>
                    </li>
                    <li className="flex items-center space-x-2 bg-transparent">
                        <div className="w-8 h-8 text-lg md:text-xl rounded-md p-3 flex items-center justify-center font-extrabold bg-secondary text-foreground">
                            B
                        </div>
                        <span className="bg-transparent">Les lettres de cette couleur sont présentes dans le mot mais mal placées.</span>
                    </li>
                    <li className="flex items-center space-x-2 bg-transparent">
                        <div className="w-8 h-8 text-lg md:text-xl rounded-md p-2 flex items-center justify-center font-extrabold bg-primary text-foreground">
                            C
                        </div>
                        <span className="bg-transparent">Les lettres de cette couleur sont bien placées.</span>
                    </li>
                </ul>

                <h4 className="text-xl font-semibold mb-2 text-foreground bg-transparent mt-2">
                    Exemple :
                </h4>
                <div className="space-y-1 md:space-y-2 my-4 w-full flex flex-col items-center bg-transparent">
                    {[
                        ['M', 'E', 'L', 'O', 'N'],
                        ['M', 'I', 'N', 'E', 'S'],
                        ['M', 'A', 'R', 'I', 'N'],
                    ].map((row, rowIndex) => (
                        <div key={rowIndex} className="flex space-x-1 md:space-x-2 bg-transparent">
                            {row.map((letter, letterIndex) => (
                                <div
                                    key={letterIndex}
                                    className={`w-6 h-6 text-sm md:w-10 md:h-10 md:text-lg rounded-md p-2 flex items-center justify-center font-extrabold ${
                                        rowIndex === 0 && (letterIndex === 0 || letterIndex === 4)
                                            ? "bg-primary text-foreground"
                                            : rowIndex === 0 && (letterIndex === 1 || letterIndex === 2 || letterIndex === 3)
                                            ? "bg-gray-500 text-background"
                                            : rowIndex === 1 && letterIndex === 0
                                            ? "bg-primary text-foreground"
                                            : rowIndex === 1 && (letterIndex === 1 || letterIndex === 2)
                                            ? "bg-secondary text-foreground"
                                            : rowIndex === 1 && (letterIndex === 3 || letterIndex === 4)
                                            ? "bg-gray-500 text-background"
                                            : rowIndex === 2
                                            ? "bg-primary text-foreground"
                                            : "bg-foreground/30 text-foreground"
                                    }`}
                                >
                                    {letter}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
                <p className="text-foreground mb-4 bg-transparent">
                    <ul className="list-disc list-inside bg-transparent">
                        <li className="bg-transparent">A la première tentative, seules les lettres <b className="bg-transparent text-primary">M</b> et <b className="bg-transparent text-primary">N</b> sont bien placées.</li>
                        <li className="bg-transparent">A la deuxième tentative, La lettre <b className="bg-transparent text-primary">M</b> est bien placée, les lettres <b className="bg-transparent text-secondary">I</b> et <b className="bg-transparent text-secondary">N</b> sont présentes mais mal placées.</li>
                        <li className="bg-transparent">A la troisième tentative, c'est <b className="bg-transparent text-primary">trouvé</b> !</li>
                    </ul>
                </p>

                <h3 className="text-2xl font-semibold mb-2 text-foreground bg-transparent">
                    Modes de jeu :
                </h3>

                <h4 className="text-xl font-semibold mb-2 text-foreground bg-transparent">
                    Mode Solo :
                </h4>
                <p className="text-foreground mb-4 bg-transparent">
                    En mode solo, vous jouez à votre rythme <b className="bg-transparent">sans limite de temps</b>. Devinez le mot mystère en utilisant vos meilleures tentatives. Vous pouvez réfléchir et essayer autant de fois que nécessaire pour perfectionner votre stratégie.
                </p>

                <h4 className="text-xl font-semibold mb-2 text-foreground bg-transparent">
                    Mode Duel :
                </h4>
                <p className="text-foreground mb-4 bg-transparent">
                    En mode duel, vous affrontez <b className="bg-transparent">un adversaire en temps réel</b>. Le premier joueur à deviner correctement le mot mystère ou celui qui utilise le moins de tentatives pour se rapprocher de la solution marque le plus de points. Un chronomètre rend la partie plus intense et stratégique. <br />
                    Vous pourrez également garder un oeil sur l'avancée de votre adversaire en surveillant ses tentatives.
                </p>

                <p className="text-foreground mb-2 bg-transparent font-semibold text-sm">
                    Êtes-vous prêt à relever le défi et devenir le maître de Worduel ? Bonne chance !
                </p>
            </section>
        </div>
    );
};

export default HelpPopover;