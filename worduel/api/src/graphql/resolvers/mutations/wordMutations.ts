import { authorize } from '../../../middlewares/authorize';
import WordService from "../../../service/word/word-service";

const wordMutations = {
  createWord: authorize(['admin'])(async (parent, { wordText }, { prisma }) => {
    return await WordService.createWord({ wordText });
  }),
  wordById: (async (parent, { id }, { prisma }) => {
    return await WordService.getWordById(id);
  }),
};

export default wordMutations;