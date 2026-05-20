import { BadRequestException } from "@nestjs/common";




export async function verifyUserId(userId:number) {
    if (!userId) {
          throw new BadRequestException(
            'UserId is required',
          );
        }
    
}