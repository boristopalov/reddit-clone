import UsernamePasswordInput from "../resolvers/UsernamePasswordInput";
// promisify scrypt so we can use await syntax instead of callback

export const validateRegister = async (input: UsernamePasswordInput) => {
  if (!input.email.includes("@")) {
    return [
      {
        field: "email",
        message: "email must be valid",
      },
    ];
  }
  if (input.username.length <= 3) {
    return [
      {
        field: "username",
        message: "username must be longer than 3 characters!",
      },
    ];
  }
  if (input.username.includes("@")) {
    return [
      {
        field: "username",
        message: "username must include an @ symbol",
      },
    ];
  }
  if (input.password.length <= 3) {
    return [
      {
        field: "password",
        message: "password must be longer than 3 characters!",
      },
    ];
  }
  return null;
};
