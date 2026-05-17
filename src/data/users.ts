export type UserCredentials = {
  username: string;
  password: string;
};

export function validUser(): UserCredentials {
  return {
    username: 'standard_user',
    password: 'secret_sauce',
  };
}

export function lockedUser(): UserCredentials {
  return {
    username: 'locked_out_user',
    password: 'secret_sauce',
  };
}

export function problemUser(): UserCredentials {
  return {
    username: 'problem_user',
    password: 'secret_sauce',
  };
}

export function invalidUser(): UserCredentials {
  return {
    username: 'invalid_user',
    password: 'wrong_password',
  };
}

export const LoginErrors = {
  lockedUser: 'locked out',
  emptyUsername: 'Username is required',
  emptyPassword: 'Password is required',
  invalidCredentials: 'do not match',
};
