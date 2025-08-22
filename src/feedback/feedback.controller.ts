import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { FeedbackService } from './feedback.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Feedback')
@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Get('recent')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get recent feedback for current user' })
  @ApiResponse({ status: 200, description: 'Return recent feedback' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getRecentFeedback(@Request() req) {
    return this.feedbackService.getRecentFeedback(req.user.sub);
  }
}
