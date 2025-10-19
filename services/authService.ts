const USERS_KEY = 'hebrew_rpg_users';
const CURRENT_USER_KEY = 'hebrew_rpg_current_user';

interface User {
  username: string;
  passwordHash: string; // Storing plain text password is bad, even for mock. Let's do a pseudo-hash.
}

// Simple pseudo-hash function for demonstration. NOT for production.
const pseudoHash = (password: string): string => {
  return `hashed_${password}_salt`;
};

const getUsers = (): User[] => {
  try {
    const usersJson = localStorage.getItem(USERS_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
  } catch (error) {
    console.error("Failed to get users:", error);
    return [];
  }
};

const saveUsers = (users: User[]): void => {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (error) {
    console.error("Failed to save users:", error);
  }
};

export const register = (username: string, password: string): { success: boolean; message: string } => {
  if (!username.trim() || !password.trim()) {
    return { success: false, message: "שם משתמש וסיסמה לא יכולים להיות ריקים." };
  }
  const users = getUsers();
  if (users.some(user => user.username.toLowerCase() === username.toLowerCase())) {
    return { success: false, message: "שם המשתמש כבר קיים." };
  }

  const newUser: User = {
    username,
    passwordHash: pseudoHash(password),
  };
  
  users.push(newUser);
  saveUsers(users);
  return { success: true, message: "ההרשמה הושלמה בהצלחה!" };
};

export const login = (username: string, password: string): { success: boolean; message: string } => {
    const users = getUsers();
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());

    if (!user) {
        return { success: false, message: "שם משתמש או סיסמה שגויים." };
    }

    if (user.passwordHash !== pseudoHash(password)) {
        return { success: false, message: "שם משתמש או סיסמה שגויים." };
    }

    // Use sessionStorage to keep user logged in for the session
    sessionStorage.setItem(CURRENT_USER_KEY, username);
    return { success: true, message: "התחברת בהצלחה!" };
};

export const logout = (): void => {
  sessionStorage.removeItem(CURRENT_USER_KEY);
};

export const getCurrentUser = (): string | null => {
  return sessionStorage.getItem(CURRENT_USER_KEY);
};
