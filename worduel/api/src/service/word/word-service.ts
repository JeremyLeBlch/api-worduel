import WordDAL from "../../data/word/wordDAL";

const WordService = {
  async getWordById(id: string) {
    return await WordDAL.findWordById(id);
  },
  async createWord(word: any) {
    return await WordDAL.createWord(word);
  },
}
export default WordService;