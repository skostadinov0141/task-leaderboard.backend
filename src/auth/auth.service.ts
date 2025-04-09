import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { randomBytes } from 'crypto';
import ms, { StringValue } from 'ms';

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async validateGoogleIdToken(idToken: string): Promise<TokenPayload> {
    const client = new OAuth2Client();
    const ticket = await client
      .verifyIdToken({
        idToken,
        audience: this.configService.get('GOOGLE_CLIENT_ID'),
      })
      .catch((reason) => {
        console.error('Error verifying ID token:', reason);
        throw new UnauthorizedException('Invalid ID token');
      });
    const payloadData = ticket.getPayload();
    if (!payloadData) {
      throw new UnauthorizedException('Invalid ID token');
    }
    return payloadData;
  }

  async createAccessToken(userId: string): Promise<string> {
    const tokenPayload = {
      sub: userId,
    };
    return await this.jwtService.signAsync(tokenPayload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_EXPIRATION_TIME'),
    });
  }

  async createRefreshCode(userId: string): Promise<string> {
    const code = randomBytes(64).toString('hex');
    const cacheKey = `refreshCode:${userId}`;
    const existingCode = await this.cacheManager.get(cacheKey);
    if (existingCode) {
      await this.cacheManager.del(cacheKey);
    }
    await this.cacheManager.set(
      cacheKey,
      code,
      ms(this.configService.get('REFRESH_CODE_EXPIRATION_TIME') as StringValue),
    );
    return code;
  }

  async validateRefreshCode(userId: string, code: string): Promise<boolean> {
    const cacheKey = `refreshCode:${userId}`;
    const cachedCode = await this.cacheManager.get<string>(cacheKey);
    if (cachedCode !== code) {
      throw new UnauthorizedException('Invalid refresh code');
    }
    return true;
  }

  async validateAccessToken(token: string): Promise<any> {
    try {
      return await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT_SECRET'),
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid access token');
    }
  }

  async invalidateRefreshCode(userId: string): Promise<void> {
    const cacheKey = `refreshCode:${userId}`;
    await this.cacheManager.del(cacheKey);
  }

  async createTokenPair(
    userId: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = await this.createAccessToken(userId);
    const refreshToken = await this.createRefreshCode(userId);
    return { accessToken, refreshToken };
  }

  async refreshTokenPair(
    userId: string,
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    await this.validateRefreshCode(userId, refreshToken);
    const { accessToken, refreshToken: newRefreshToken } =
      await this.createTokenPair(userId);
    return { accessToken, refreshToken: newRefreshToken };
  }
}
