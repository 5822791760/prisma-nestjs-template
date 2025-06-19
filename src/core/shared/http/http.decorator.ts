import { applyDecorators } from '@nestjs/common';
import { ApiHeader } from '@nestjs/swagger';

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
