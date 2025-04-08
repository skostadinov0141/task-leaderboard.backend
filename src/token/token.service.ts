import { HttpException, Inject, Injectable } from '@nestjs/common';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { randomBytes } from 'crypto';
import ms, { StringValue } from 'ms';

@Injectable()
export class TokenService {
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
        throw new HttpException('Invalid ID token', 401);
      });
    const payloadData = ticket.getPayload();
    if (!payloadData) {
      throw new HttpException('Invalid ID token', 401);
    }
    return payloadData;
  }

  async createAccessToken(userId: string): Promise<string> {
    // Implement your logic to create an access token
    const tokenPayload = {
      sub: userId,
    };
    return await this.jwtService.signAsync(tokenPayload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_EXPIRATION_TIME'),
    });
  }

  async createrefreshCode(userId: string): Promise<string> {
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
}
