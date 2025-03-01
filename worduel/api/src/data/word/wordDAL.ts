import {prismaClient} from "../../prisma/client";
import Word from "../../types/word";

const prisma = prismaClient;

const WordDAL = {
  async findAllWord(): Promise<Word[]> {
    return prisma.word.findMany();
  },

  async getRandomWord(): Promise<Word> {
    const count = await prisma.word.count();
    const randomIndex = Math.floor(Math.random() * count);
    return prisma.word.findFirst({
      skip: randomIndex,
    });
  },

  async findWordById(id: string): Promise<Word> {
    return prisma.word.findUnique({where: {id}});
  },

  async createWord(word: Word): Promise<Word> {
    return prisma.word.create({data: word});
  },
};

export default WordDAL;