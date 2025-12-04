import { ITokenProvider } from "../provider/interfaces/ItokenProvider";
import { AuthRepositary } from "../repositories/authRepositary";
import { AppError } from "../utils/errors";
import { LoginUserDto, RegisterUserDto } from "../dto/userDto";
import { IPasswordHasher } from "../provider/interfaces/IPasswordHasher";

export class AuthServices {
  constructor(
    private authRepositary: AuthRepositary,
    private passwordHasher: IPasswordHasher,
    private tokenProvider: ITokenProvider
  ) {}

  async SignUpService(schemaName: string, data: RegisterUserDto) {
    const emailExists = await this.authRepositary.findUserExist(
      schemaName,
      data.email
    );
    if (emailExists) {
      throw new AppError ("Email already exists",409);
    }
    //hash password
    const hashedPassword = await this.passwordHasher.hash(data.password);
    //create new tenant
    const user = await this.authRepositary.registerUser(schemaName, {
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
  async LoginService(schemaName: string, data: LoginUserDto) {
    const user = await this.authRepositary.findUserExist(
      schemaName,
      data.email
    );

    if (!user) {
      throw new AppError("invalid email or password",401);
    }
    const isPasswordValid = await this.passwordHasher.compare(
      data.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new AppError("invalid email or password",401);
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
