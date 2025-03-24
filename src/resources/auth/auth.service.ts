import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from '@common/database/entities';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Transactional } from 'typeorm-transactional';
import {
  IAuthToken,
  ILogin,
  IRegistration,
  ITokenPayload,
} from '@common/models';
import { ERROR_MESSAGES } from '@common/erorr-mesagges';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersEntity)
    private userRepository: Repository<UsersEntity>,
    private jwtService: JwtService,
  ) {}

  /**
   * Creates a new user in the database and returns an authentication token.
   * @param {IRegistration} body - User registration details.
   * @returns {IAuthToken} - Authentication token for the newly registered user.
   */

  @Transactional()
  async registration(body: IRegistration) {
    const userEmail = await this.userRepository.findOne({
      where: { email: body.email },
    });

    if (userEmail) {
      throw new BadRequestException(ERROR_MESSAGES.USER_ALREADY_EXISTS);
    }

    body.password = await bcrypt.hash(body.password, 10);

    const { id } = await this.userRepository.save(body);
    const payload: ITokenPayload = {
      id,
    };

    const accessToken = await this.createAccessToken(payload);

    return { accessToken };
  }

  /**
   * Generates a JWT access token based on the provided payload.
   * @param {ITokenPayload} payload - Data to be included in the token.
   * @returns {Promise<string>} - Signed JWT access token.
   */
  async createAccessToken(payload: ITokenPayload): Promise<string> {
    return this.jwtService.sign(payload);
  }

  /**
   * Authenticates a user by checking credentials and returns an authentication token.
   * @param {ILogin} body - User login details.
   * @returns {IAuthToken} - Authentication token if login is successful.
   */

  async login(body: ILogin): Promise<IAuthToken> {
    const { login, password } = body;

    const user = await this.userRepository.findOne({
      where: [{ email: login }],
    });

    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_EXISTS);
    }
    if (!bcrypt.compareSync(password, user.password)) {
      throw new BadRequestException(ERROR_MESSAGES.USER_INVALID_PASSWORD);
    }

    const payload = { id: user.id };
    const accessToken = await this.createAccessToken(payload);

    return { accessToken };
  }
}
