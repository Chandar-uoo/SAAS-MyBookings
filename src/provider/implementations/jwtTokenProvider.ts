import jwt from "jsonwebtoken";
 import { ITokenProvider } from "../interfaces/ItokenProvider";

 console.log();
 
export class JwtTokenProvider implements ITokenProvider {
  private access_secret = process.env.ACCESS_TOKEN as string;
  private refresh_secret = process.env.REFRESH_TOKEN as string;

  generateAccessToken(payload: object): string {
    return jwt.sign(payload, this.access_secret, { expiresIn: "15m" });
  }

  generateRefreshToken(payload: object): string {
    return jwt.sign(payload, this.refresh_secret, { expiresIn: "7d" });
  }

  verifyAccessToken(token: string): any {
    return jwt.verify(token, this.access_secret);
  }

  verifyRefreshToken(token: string): any {
    return jwt.verify(token, this.refresh_secret);
  }
}
