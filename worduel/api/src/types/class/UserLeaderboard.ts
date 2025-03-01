export default class UserLeaderboard {
  username: string;
  total_score_multi: number;
  avatar: string;

  constructor(data: UserLeaderboard) {
    this.username = data.username;
    this.total_score_multi = data.total_score_multi;
    this.avatar = data.avatar;
  }
}