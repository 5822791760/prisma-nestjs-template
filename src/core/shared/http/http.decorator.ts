import { UseInterceptors, applyDecorators } from '@nestjs/common';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { MulterField } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { ApiConsumes, ApiHeader } from '@nestjs/swagger';

import { AVAILABLE_LANG } from '@core/global/lang/lang.common';

import { CSV_HEADER, LANG_HEADER } from './http.headers';

export function HeaderLang() {
  return applyDecorators(
    ApiHeader({
      name: LANG_HEADER,
      required: false,
      enum: AVAILABLE_LANG,
      description: 'Set language',
    }),
  );
}

export function HeaderCsv() {
  return applyDecorators(
    ApiHeader({
      name: CSV_HEADER,
      required: false,
      description: 'Use `csv` to receive the response as CSV',
    }),
    HeaderLang(),
  );
}

export function UseFileMap(files: MulterField[]) {
  return applyDecorators(UseInterceptors(FileFieldsInterceptor(files)));
}

export function UseFile(name: string) {
  return applyDecorators(
    UseInterceptors(FileInterceptor(name)),
    ApiConsumes('multipart/form-data'),
  );
}
