import { BadRequestException } from '@nestjs/common';

export function imageFileFilter(req: any, file: any, callback: Function) {

  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
  ];

  const isValid = allowedMimeTypes.includes(file.mimetype);

  if (!isValid) {
    return callback(
      new BadRequestException(
        'Only jpg, jpeg, png and webp files are allowed',
      ),
      false,
    );
  }

  callback(null, true);
}