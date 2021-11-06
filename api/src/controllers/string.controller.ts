import {Filter, repository} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
  response,
  HttpErrors,
} from '@loopback/rest';
import {String} from '../models';
import {StringRepository} from '../repositories';

export class StringController {
  constructor(
    @repository(StringRepository)
    public stringRepository: StringRepository,
  ) {}

  @get('/strings/{lang}')
  @response(200, {
    description: 'Array of String model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(String, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.path.string('lang') lang: string,
    @param.filter(String) filter?: Filter<String>,
  ): Promise<String[]> {
    if (lang !== 'en' && lang !== 'de') {
      throw new HttpErrors.BadRequest('Unsupported language!');
    }

    return this.stringRepository.find({
      ...filter,
      fields: ['identifier', lang as keyof String],
    });
  }
}
