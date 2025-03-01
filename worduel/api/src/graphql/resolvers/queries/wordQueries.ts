const wordQueries = {
  word: async (parent, { id }, { prisma }) => {
    try {
      const word = await prisma.word.findUnique({ where: { id } });
      if (!word) {
        throw new Error('Mot non trouvé');
      }
      return word;
    } catch (err) {
      throw new Error('Erreur interne du serveur');
    }
  },
  words: async (parent, { filter, skip, take }, { prisma }) => {
    const where = filter?.word_text
      ? { word_text: { contains: filter.word_text, mode: 'insensitive' } }
      : {};

    try {
      const words = await prisma.word.findMany({
        where,
        skip: skip || 0,
        take: take || 50,
        orderBy: { word_text: 'asc' },
      });
      return words;
    } catch (error) {
      console.error('Erreur lors de la récupération des mots:', error);
      throw new Error('Impossible de récupérer les mots');
    }
  },
  randomWord: async (parent, args, { prisma }) => {
    try {
      const count = await prisma.word.count();
      const randomIndex = Math.floor(Math.random() * count);
      const [randomWord] = await prisma.word.findMany({
        skip: randomIndex,
        take: 1,
      });
      return randomWord;
    } catch (error) {
      console.error('Erreur lors de la récupération d\'un mot aléatoire:', error);
      throw new Error('Impossible de récupérer un mot aléatoire');
    }
  }
};


export default wordQueries;