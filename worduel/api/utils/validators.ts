export const validateEmail = (email: string): void => {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!emailRegex.test(email)) {
      throw new Error('Format d\'email invalide');
    }
  };
  
export const validatePassword = (password: string): void => {
    if (password.length < 8) {
        throw new Error('Le mot de passe doit contenir au moins 8 caractères');
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
        throw new Error('Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial');
    }
};

export const validateUsername = (username: string): void => {
    if (username.length < 3 || username.length > 20) {
        throw new Error('Le nom d\'utilisateur doit contenir entre 3 et 20 caractères');
    }
    const usernameRegex = /^[a-zA-Z0-9_-]+$/;
    if (!usernameRegex.test(username)) {
        throw new Error('Le nom d\'utilisateur ne peut contenir que des lettres, des chiffres, des tirets et des underscores');
    }
};