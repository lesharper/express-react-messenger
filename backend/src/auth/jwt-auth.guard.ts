import {
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
    UnauthorizedException
} from "@nestjs/common";
import {Observable} from "rxjs";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest()
        try {
            const authHeader = req.headers.authorization
            const bearer = authHeader.split(' ')[0]
            const token = authHeader.split(' ')[1]

            if (bearer != 'Bearer' || !token) {
                throw new HttpException('Пользователь не авторизован', HttpStatus.UNAUTHORIZED)
            }

            const user = this.jwtService.verify(token)
            req.user = user
            return true
        } catch (err) {
            throw new HttpException('Пользователь не авторизован', HttpStatus.UNAUTHORIZED)
        }
    }

}
