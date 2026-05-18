import {
	type CallHandler,
	type ExecutionContext,
	Injectable,
	Logger,
	type NestInterceptor,
} from '@nestjs/common'
import type { Request, Response, } from 'express'
import { type Observable, tap, } from 'rxjs'

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
	private readonly logger = new Logger('HTTP',)

	public intercept(context: ExecutionContext, next: CallHandler,): Observable<unknown> {
		const ctx = context.switchToHttp()
		const req = ctx.getRequest<Request>()
		const res = ctx.getResponse<Response>()
		const start = Date.now()

		return next.handle().pipe(
			tap(() => {
				const ms = Date.now() - start
				this.logger.log(`${req.method} ${req.originalUrl} ${res.statusCode} - ${ms}ms`,)
			},),
		)
	}
}
