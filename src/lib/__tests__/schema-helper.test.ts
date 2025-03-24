import { buildSchema, validateSchema } from '../schema-helper';

describe('buildSchema', () => {
  test('builds a simple string schema', () => {
    const result = buildSchema([{ data: 'string' }]);
    expect(result).toEqual({ data: 'string' });
  });

  test('builds schema with array of custom types', () => {
    const schemas = [{ beta_reader_reviews: ['BetaReaderReview'] }, { beta_reader_review: 'string' }];
    const result = buildSchema(schemas);
    expect(result).toEqual({
      beta_reader_reviews: [
        {
          beta_reader_review: 'string',
        },
      ],
    });
  });

  test('builds complex nested schema', () => {
    const schemas = [
      {
        book: {
          title: 'string',
          author: 'string',
          published_date: 'string',
          beta_reader_reviews: ['BetaReaderReview'],
        },
      },
      { beta_reader_review: 'string' },
    ];
    const result = buildSchema(schemas);
    expect(result).toEqual({
      book: {
        title: 'string',
        author: 'string',
        published_date: 'string',
        beta_reader_reviews: [
          {
            beta_reader_review: 'string',
          },
        ],
      },
    });
  });

  test('builds schema with object properties', () => {
    const schemas = [
      {
        user_profile: {
          age: 'number',
          is_adult: 'boolean',
        },
      },
    ];
    const result = buildSchema(schemas);
    expect(result).toEqual({
      user_profile: {
        age: 'number',
        is_adult: 'boolean',
      },
    });
  });

  test('builds schema with array reference', () => {
    const schemas = [
      { users: ['UserProfile'] },
      {
        user_profile: {
          age: 'number',
          is_adult: 'boolean',
        },
      },
    ];
    const result = buildSchema(schemas);
    expect(result).toEqual({
      users: [
        {
          user_profile: {
            age: 'number',
            is_adult: 'boolean',
          },
        },
      ],
    });
  });

  test('throws error for non-snake_case schema key', () => {
    expect(() => {
      buildSchema([{ camelCase: 'string' }]);
    }).toThrow(/must be in snake_case/);
  });

  test('throws error for missing referenced schema', () => {
    expect(() => {
      buildSchema([
        {
          book: {
            title: 'string',
            beta_reader_reviews: ['BetaReaderReview'],
          },
        },
      ]);
    }).toThrow(/Referenced schema "BetaReaderReview" \(as beta_reader_review\)/);
  });

  test('throws error for circular dependency', () => {
    expect(() => {
      buildSchema([
        {
          circular_ref1: {
            // Changed from circular_ref_1 to match snake_case requirements
            name: 'string',
            ref: 'CircularRef1', // This will convert to circular_ref1, creating a self-reference
          },
        },
      ]);
    }).toThrow(/Self reference detected/);
  });

  test('throws error for circular dependency between schemas', () => {
    expect(() => {
      buildSchema([
        {
          schema_a: {
            name: 'string',
            ref: 'SchemaB',
          },
        },
        {
          schema_b: {
            name: 'string',
            ref: 'SchemaA',
          },
        },
      ]);
    }).toThrow(/Circular dependency detected/);
  });

  test('throws error for non-array schema input', () => {
    expect(() => {
      // @ts-ignore
      buildSchema('not an array');
    }).toThrow(/Schema must be an array/);
  });

  test('throws error for empty schema array', () => {
    expect(() => {
      buildSchema([]);
    }).toThrow(/Schema must be an array of at least one object/);
  });

  test('throws error for schema with multiple top-level keys', () => {
    expect(() => {
      buildSchema([{ key1: 'string', key2: 'number' }]);
    }).toThrow(/Schema must have exactly one top-level property/);
  });
});

describe('validateSchema', () => {
  test('validates a simple string schema', () => {
    const schema = { data: 'string' };
    const data = { data: 'test value' };
    const result = validateSchema(schema, data);
    expect(result).toEqual(data);
  });

  test('validates and converts a number schema', () => {
    const schema = { age: 'number' };
    const data = { age: '25' };
    const result = validateSchema(schema, data);
    expect(result).toEqual({ age: 25 });
  });

  test('validates and converts a boolean schema', () => {
    const schema = { is_active: 'boolean' };
    const data = { is_active: 'true' };
    const result = validateSchema(schema, data);
    expect(result).toEqual({ is_active: true });
  });

  test('validates an object schema', () => {
    const schema = {
      user_profile: {
        age: 'number',
        is_adult: 'boolean',
        name: 'string',
      },
    };
    const data = {
      user_profile: {
        age: '30',
        is_adult: 'false',
        name: 'John Doe',
      },
    };
    const result = validateSchema(schema, data);
    expect(result).toEqual({
      user_profile: {
        age: 30,
        is_adult: false,
        name: 'John Doe',
      },
    });
  });

  test('validates an array schema', () => {
    const schema = { tags: ['string'] };
    const data = { tags: ['javascript', 'typescript', 'nodejs'] };
    const result = validateSchema(schema, data);
    expect(result).toEqual(data);
  });

  test('validates an array with primitive types', () => {
    const schema = { scores: ['number'] };
    const data = { scores: ['85', '92', '78'] };
    const result = validateSchema(schema, data);
    expect(result).toEqual({ scores: [85, 92, 78] });
  });

  test('throws error for custom type in schema', () => {
    const schema = { book: { reviews: ['Review'] } };
    const data = { book: { reviews: [{ text: 'Good book' }] } };
    expect(() => {
      validateSchema(schema, data);
    }).toThrow(/Custom type "Review" found in schema/);
  });

  test('throws error for invalid number conversion', () => {
    const schema = { age: 'number' };
    const data = { age: 'not a number' };
    expect(() => {
      validateSchema(schema, data);
    }).toThrow(/Cannot convert string "not a number" to number/);
  });

  test('throws error for invalid boolean conversion', () => {
    const schema = { is_active: 'boolean' };
    const data = { is_active: 'maybe' };
    expect(() => {
      validateSchema(schema, data);
    }).toThrow(/Cannot convert string "maybe" to boolean/);
  });

  test('throws error for missing property', () => {
    const schema = { user: { name: 'string', age: 'number' } };
    const data = { user: { name: 'John' } };
    expect(() => {
      validateSchema(schema, data);
    }).toThrow(/Missing required property "age"/);
  });

  test('throws error for mismatched top-level property', () => {
    const schema = { user: { name: 'string' } };
    const data = { profile: { name: 'John' } };
    expect(() => {
      validateSchema(schema, data);
    }).toThrow(/Data must have exactly one top-level property matching schema/);
  });

  test('throws error for type mismatch', () => {
    const schema = { data: 'string' };
    const data = { data: 123 };
    expect(() => {
      validateSchema(schema, data);
    }).toThrow(/Expected string at data, got number/);
  });

  test('throws error for non-snake_case schema key', () => {
    const schema = { userProfile: { name: 'string' } };
    const data = { userProfile: { name: 'John' } };
    expect(() => {
      validateSchema(schema, data);
    }).toThrow(/Schema key "userProfile" must be in snake_case/);
  });
});
