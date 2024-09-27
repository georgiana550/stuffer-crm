import { Injectable } from '@nestjs/common';
import _ from 'lodash';
import * as xlsx from 'xlsx';

const isJSON = (obj: string): boolean => {
  try {
    JSON.parse(obj);
    return true;
  } catch (e) {
    return false;
  }
};

@Injectable()
export class FilesService {
  constructor() {}

  async processFile(file: Express.Multer.File): Promise<object[]> {
    const workbook = xlsx.read(file.buffer, { type: 'buffer' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    const data = xlsx.utils.sheet_to_json(worksheet);

    const transformedArray = data.map((item) => {
      const jsonString = JSON.stringify(item)
        .trim()
        .replace(/^\{|\}$/g, '');

      return JSON.parse(`{${jsonString}}`);
    });

    return transformedArray;
  }
}
