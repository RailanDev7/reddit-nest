import { ConflictException, HttpCode, HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { PrismaConfigService } from 'src/prisma-config/prisma-config.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaConfigService,
    private jwtToken: JwtService
  ) { }
  async create(createAuthDto: CreateAuthDto) {
      const userExist = await this.prisma.user.findUnique({
        where: {
          email: createAuthDto.email
        }
      })
      if (userExist) {
        throw new ConflictException('User already exists')
      }
      const hash = await bcrypt.hash(createAuthDto.password, 12)
      const user = await this.prisma.user.create({
        data: {
          email: createAuthDto.email,
          password: hash
        }
      })
      const payload = { sub: user.id }
      const token = await this.jwtToken.signAsync(payload)
    return {
      access_token: token
    }
  }
  //login service
  async loginService(body) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: body.email
      }
    })
    if (!user) {
      throw new NotFoundException('User not found.')
    }
    const passwordOk = await bcrypt.compare(body.password, user.password)
    if (!passwordOk) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const payload = {
      sub: user.id
    }
    const token = await this.jwtToken.signAsync(payload)
    return {
      access_token: token
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
