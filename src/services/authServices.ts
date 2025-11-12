import { UserRepository } from "../repositories/userRepositary";
import { ConflictError, AuthError } from "../utils/errors";

import { ITokenProvider } from "../provider/interfaces/ItokenProvider";
import { IPasswordHasher } from "../provider/interfaces/IPasswordHasher";

export class AuthService {
  private userRepository: UserRepository;
  private tokenProvider: ITokenProvider;
  private passwordHasher: IPasswordHasher;

  constructor(tokenProvider: ITokenProvider, passwordHasher: IPasswordHasher) {
    this.userRepository = new UserRepository();
    this.tokenProvider = tokenProvider;
    this.passwordHasher = passwordHasher;
  }
  async SignupService(data: { name: string; email: string; password: string }) {
    // check emailExists
    const emailExists = await this.userRepository.findEmailExists(data.email);
    if (emailExists) {
      throw new ConflictError("Email already exists");
    }
    //hash password
    const hashedPassword = await this.passwordHasher.hash(data.password);
    //create new tenant
    const user = await this.userRepository.create({
      ...data,
      password: hashedPassword,
    });
    const { password, ...safeuser } = user;

    // jwt token
    const accessToken = this.tokenProvider.generateAccessToken({
      id: safeuser.id,
    });
    const refreshToken = this.tokenProvider.generateRefreshToken({
      id: safeuser.id,
    });
    // return
    return { user: safeuser, accessToken, refreshToken };
  }
  async LoginService(data: { email: string; password: string }) {
    // check emailExists
    const user = await this.userRepository.findEmailExists(data.email);
    if (!user) {
      throw new AuthError("invalid email or password");
    }
    const isPasswordValid = await this.passwordHasher.compare(
      data.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new AuthError("invalid email or password");
    }

    const { password, ...safeuser } = user;
    const accessToken = this.tokenProvider.generateAccessToken({
      id: safeuser.id,
    });
    const refreshToken = this.tokenProvider.generateRefreshToken({
      id: safeuser.id,
    });
    return { user: safeuser, accessToken, refreshToken };
  }
}
