
interface Window {
  deleteUser: (username: string) => boolean;
  listUsers: () => string[];
  loginUser: (username: string) => boolean;
}
