
import { validatePassword, validateUsername } from "../../../utils/validators";
import bcrypt from "bcryptjs";
import UserDAL from "../../data/user/userDAL";
import UserLeaderboard from "../../types/class/UserLeaderboard";

const UserService = {
  async updateUser(userId: string, updates: any, prisma: any) {
    const data: any = {};

    // Mise à jour du username
    if (updates.username) {
      validateUsername(updates.username);

      // Vérification si le nouveau nom d'utilisateur est déjà pris
      const existingUser = await prisma.user.findUnique({
        where: { username: updates.username },
      });
      if (existingUser && existingUser.id !== userId) {
        throw new Error('Ce nom d\'utilisateur est déjà utilisé');
      }
      data.username = updates.username;
    }

    // Mise à jour de l'avatar
    if (updates.avatar) {
      data.avatar = updates.avatar;
    }

    // Mise à jour du mot de passe
    if (updates.password) {
      validatePassword(updates.password);

      // Hacher le nouveau mot de passe
      const hashedPassword = await bcrypt.hash(updates.password, 10);

      // mise a jour du mdp en db
      await prisma.authentication.updateMany({
        where: {
          user_id: userId,
          type: 'email',
        },
        data: {
          password_hash: hashedPassword,
        },
      });
    }

    if (updates.primary_color_preference) {
      data.primary_color_preference = updates.primary_color_preference;
    }
    if (updates.secondary_color_preference) {
      data.secondary_color_preference = updates.secondary_color_preference;
    }

    if (Object.keys(data).length > 0) {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data,
      });
      return updatedUser;
    } else {
      // Si aucune donnée n'est fournie, retourner l'utilisateur actuel
      return await prisma.user.findUnique({ where: { id: userId } });
    }
  },

  async getLeaderboard(): Promise<UserLeaderboard[]> {
    const users = await UserDAL.findAll();
    const usersSort =  users.sort((a, b) => b.total_score_multi - a.total_score_multi);
    for (let i = 0; i < usersSort.length; i++) {
      const user = usersSort[i];
      new UserLeaderboard(user);
    }
    return usersSort;
  },
};

export default UserService;