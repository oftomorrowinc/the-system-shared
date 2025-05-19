'use strict';
// src/lib/__tests__/case-conversion.test.ts
Object.defineProperty(exports, '__esModule', { value: true });
const case_conversion_1 = require('../case-conversion');
describe('Case Conversion - String Transformations', () => {
  // Basic conversion tests
  describe('basic conversions', () => {
    test('camelToSnake converts camelCase to snake_case', () => {
      expect((0, case_conversion_1.camelToSnake)('helloWorld')).toBe('hello_world');
      expect((0, case_conversion_1.camelToSnake)('userName')).toBe('user_name');
      expect((0, case_conversion_1.camelToSnake)('APIKey')).toBe('api_key');
      expect((0, case_conversion_1.camelToSnake)('userIDAndName')).toBe('user_id_and_name');
      expect((0, case_conversion_1.camelToSnake)('a')).toBe('a');
      expect((0, case_conversion_1.camelToSnake)('')).toBe('');
    });
    test('snakeToCamel converts snake_case to camelCase', () => {
      expect((0, case_conversion_1.snakeToCamel)('hello_world')).toBe('helloWorld');
      expect((0, case_conversion_1.snakeToCamel)('user_name')).toBe('userName');
      expect((0, case_conversion_1.snakeToCamel)('api_key')).toBe('apiKey');
      expect((0, case_conversion_1.snakeToCamel)('user_id_and_name')).toBe('userIdAndName');
      expect((0, case_conversion_1.snakeToCamel)('a')).toBe('a');
      expect((0, case_conversion_1.snakeToCamel)('')).toBe('');
    });
    test('camelToPascal converts camelCase to PascalCase', () => {
      expect((0, case_conversion_1.camelToPascal)('helloWorld')).toBe('HelloWorld');
      expect((0, case_conversion_1.camelToPascal)('userName')).toBe('UserName');
      expect((0, case_conversion_1.camelToPascal)('apiKey')).toBe('ApiKey');
      expect((0, case_conversion_1.camelToPascal)('a')).toBe('A');
      expect((0, case_conversion_1.camelToPascal)('')).toBe('');
    });
    test('pascalToCamel converts PascalCase to camelCase', () => {
      expect((0, case_conversion_1.pascalToCamel)('HelloWorld')).toBe('helloWorld');
      expect((0, case_conversion_1.pascalToCamel)('UserName')).toBe('userName');
      expect((0, case_conversion_1.pascalToCamel)('ApiKey')).toBe('apiKey');
      expect((0, case_conversion_1.pascalToCamel)('A')).toBe('a');
      expect((0, case_conversion_1.pascalToCamel)('')).toBe('');
    });
    test('snakeToPascal converts snake_case to PascalCase', () => {
      expect((0, case_conversion_1.snakeToPascal)('hello_world')).toBe('HelloWorld');
      expect((0, case_conversion_1.snakeToPascal)('user_name')).toBe('UserName');
      expect((0, case_conversion_1.snakeToPascal)('api_key')).toBe('ApiKey');
      expect((0, case_conversion_1.snakeToPascal)('user_id_and_name')).toBe('UserIdAndName');
      expect((0, case_conversion_1.snakeToPascal)('a')).toBe('A');
      expect((0, case_conversion_1.snakeToPascal)('')).toBe('');
    });
    test('pascalToSnake converts PascalCase to snake_case', () => {
      expect((0, case_conversion_1.pascalToSnake)('HelloWorld')).toBe('hello_world');
      expect((0, case_conversion_1.pascalToSnake)('UserName')).toBe('user_name');
      expect((0, case_conversion_1.pascalToSnake)('ApiKey')).toBe('api_key');
      expect((0, case_conversion_1.pascalToSnake)('UserIdAndName')).toBe('user_id_and_name');
      expect((0, case_conversion_1.pascalToSnake)('A')).toBe('a');
      expect((0, case_conversion_1.pascalToSnake)('')).toBe('');
    });
  });
  // Edge cases
  describe('edge cases', () => {
    test('handles strings with consecutive uppercase letters', () => {
      expect((0, case_conversion_1.camelToSnake)('userIDAndName')).toBe('user_id_and_name');
      expect((0, case_conversion_1.pascalToSnake)('UserIDAndName')).toBe('user_id_and_name');
    });
    test('handles strings with numbers', () => {
      expect((0, case_conversion_1.camelToSnake)('user123Name')).toBe('user123_name');
      expect((0, case_conversion_1.snakeToCamel)('user_123_name')).toBe('user123Name');
      expect((0, case_conversion_1.camelToPascal)('user123Name')).toBe('User123Name');
      expect((0, case_conversion_1.pascalToCamel)('User123Name')).toBe('user123Name');
    });
    test('handles already converted strings', () => {
      // Apply the same transformation twice
      expect(
        (0, case_conversion_1.camelToSnake)((0, case_conversion_1.camelToSnake)('helloWorld'))
      ).toBe('hello_world');
      expect(
        (0, case_conversion_1.snakeToCamel)((0, case_conversion_1.snakeToCamel)('hello_world'))
      ).toBe('helloWorld');
      // Apply the inverse transformation
      expect(
        (0, case_conversion_1.snakeToCamel)((0, case_conversion_1.camelToSnake)('helloWorld'))
      ).toBe('helloWorld');
      expect(
        (0, case_conversion_1.camelToSnake)((0, case_conversion_1.snakeToCamel)('hello_world'))
      ).toBe('hello_world');
      expect(
        (0, case_conversion_1.pascalToCamel)((0, case_conversion_1.camelToPascal)('helloWorld'))
      ).toBe('helloWorld');
      expect(
        (0, case_conversion_1.camelToPascal)((0, case_conversion_1.pascalToCamel)('HelloWorld'))
      ).toBe('HelloWorld');
    });
  });
});
describe('Case Conversion - Object Transformations', () => {
  const testObject = {
    firstName: 'John',
    lastName: 'Doe',
    userDetails: {
      emailAddress: 'john.doe@example.com',
      phoneNumber: '123-456-7890',
      preferences: {
        isDarkMode: true,
        notificationSettings: {
          emailNotifications: true,
          pushNotifications: false,
        },
      },
    },
    addressList: [
      {
        streetAddress: '123 Main St',
        cityName: 'Anytown',
      },
      {
        streetAddress: '456 Oak Ave',
        cityName: 'Othertown',
      },
    ],
    id: 'user-123',
    _meta: {
      lastUpdated: 'yesterday',
    },
  };
  const snakeCaseObject = {
    first_name: 'John',
    last_name: 'Doe',
    user_details: {
      email_address: 'john.doe@example.com',
      phone_number: '123-456-7890',
      preferences: {
        is_dark_mode: true,
        notification_settings: {
          email_notifications: true,
          push_notifications: false,
        },
      },
    },
    address_list: [
      {
        street_address: '123 Main St',
        city_name: 'Anytown',
      },
      {
        street_address: '456 Oak Ave',
        city_name: 'Othertown',
      },
    ],
    id: 'user-123',
    _meta: {
      lastUpdated: 'yesterday',
    },
  };
  const pascalCaseObject = {
    FirstName: 'John',
    LastName: 'Doe',
    UserDetails: {
      EmailAddress: 'john.doe@example.com',
      PhoneNumber: '123-456-7890',
      Preferences: {
        IsDarkMode: true,
        NotificationSettings: {
          EmailNotifications: true,
          PushNotifications: false,
        },
      },
    },
    AddressList: [
      {
        StreetAddress: '123 Main St',
        CityName: 'Anytown',
      },
      {
        StreetAddress: '456 Oak Ave',
        CityName: 'Othertown',
      },
    ],
    id: 'user-123',
    _meta: {
      lastUpdated: 'yesterday',
    },
  };
  test('toSnakeCase converts all object keys from camelCase to snake_case', () => {
    expect((0, case_conversion_1.toSnakeCase)(testObject)).toEqual(snakeCaseObject);
  });
  test('toCamelCase converts all object keys from snake_case to camelCase', () => {
    expect((0, case_conversion_1.toCamelCase)(snakeCaseObject)).toEqual(testObject);
  });
  test('toPascalCase converts all object keys from camelCase to PascalCase', () => {
    expect((0, case_conversion_1.toPascalCase)(testObject)).toEqual(pascalCaseObject);
  });
  test('fromPascalCase converts all object keys from PascalCase to camelCase', () => {
    expect((0, case_conversion_1.fromPascalCase)(pascalCaseObject)).toEqual(testObject);
  });
  test('preserves id and underscore-prefixed fields', () => {
    const result = (0, case_conversion_1.toSnakeCase)(testObject);
    expect(result.id).toBe('user-123');
    expect(result._meta).toEqual({ lastUpdated: 'yesterday' });
    const resultFromPascal = (0, case_conversion_1.fromPascalCase)(pascalCaseObject);
    expect(resultFromPascal.id).toBe('user-123');
    expect(resultFromPascal._meta).toEqual({ lastUpdated: 'yesterday' });
  });
  test('handles null and undefined values', () => {
    const objWithNulls = {
      firstName: null,
      lastName: undefined,
      userDetails: null,
    };
    const snakeResult = (0, case_conversion_1.toSnakeCase)(objWithNulls);
    expect(snakeResult).toEqual({
      first_name: null,
      last_name: undefined,
      user_details: null,
    });
    const pascalResult = (0, case_conversion_1.toPascalCase)(objWithNulls);
    expect(pascalResult).toEqual({
      FirstName: null,
      LastName: undefined,
      UserDetails: null,
    });
  });
  test('handles non-object values', () => {
    expect((0, case_conversion_1.toSnakeCase)('not an object')).toBe('not an object');
    expect((0, case_conversion_1.toCamelCase)('not an object')).toBe('not an object');
    expect((0, case_conversion_1.toPascalCase)('not an object')).toBe('not an object');
    expect((0, case_conversion_1.fromPascalCase)('not an object')).toBe('not an object');
    expect((0, case_conversion_1.toSnakeCase)(null)).toBe(null);
    expect((0, case_conversion_1.toCamelCase)(undefined)).toBe(undefined);
  });
  test('handles empty objects', () => {
    expect((0, case_conversion_1.toSnakeCase)({})).toEqual({});
    expect((0, case_conversion_1.toCamelCase)({})).toEqual({});
    expect((0, case_conversion_1.toPascalCase)({})).toEqual({});
    expect((0, case_conversion_1.fromPascalCase)({})).toEqual({});
  });
  test('handles arrays at the top level', () => {
    const array = [
      { firstName: 'John', lastName: 'Doe' },
      { firstName: 'Jane', lastName: 'Smith' },
    ];
    const expectedSnakeArray = [
      { first_name: 'John', last_name: 'Doe' },
      { first_name: 'Jane', last_name: 'Smith' },
    ];
    const expectedPascalArray = [
      { FirstName: 'John', LastName: 'Doe' },
      { FirstName: 'Jane', LastName: 'Smith' },
    ];
    expect((0, case_conversion_1.toSnakeCase)(array)).toEqual(expectedSnakeArray);
    expect((0, case_conversion_1.toPascalCase)(array)).toEqual(expectedPascalArray);
  });
});
// Round-trip tests to ensure consistency
describe('Case Conversion - Round Trip Tests', () => {
  test('camelCase -> snake_case -> camelCase preserves the original string', () => {
    const original = 'helloWorldExample';
    expect((0, case_conversion_1.snakeToCamel)((0, case_conversion_1.camelToSnake)(original))).toBe(
      original
    );
  });
  test('snake_case -> camelCase -> snake_case preserves the original string', () => {
    const original = 'hello_world_example';
    expect((0, case_conversion_1.camelToSnake)((0, case_conversion_1.snakeToCamel)(original))).toBe(
      original
    );
  });
  test('camelCase -> PascalCase -> camelCase preserves the original string', () => {
    const original = 'helloWorldExample';
    expect(
      (0, case_conversion_1.pascalToCamel)((0, case_conversion_1.camelToPascal)(original))
    ).toBe(original);
  });
  test('PascalCase -> camelCase -> PascalCase preserves the original string', () => {
    const original = 'HelloWorldExample';
    expect(
      (0, case_conversion_1.camelToPascal)((0, case_conversion_1.pascalToCamel)(original))
    ).toBe(original);
  });
  test('snake_case -> PascalCase -> snake_case preserves the original string', () => {
    const original = 'hello_world_example';
    expect(
      (0, case_conversion_1.pascalToSnake)((0, case_conversion_1.snakeToPascal)(original))
    ).toBe(original);
  });
  test('camelCase -> snake_case -> PascalCase -> camelCase preserves the original string', () => {
    const original = 'helloWorldExample';
    expect(
      (0, case_conversion_1.pascalToCamel)(
        (0, case_conversion_1.snakeToPascal)((0, case_conversion_1.camelToSnake)(original))
      )
    ).toBe(original);
  });
  test('Object round-trip conversions maintain data integrity', () => {
    const original = {
      firstName: 'John',
      lastName: 'Doe',
      userDetails: {
        emailAddress: 'john.doe@example.com',
      },
    };
    // Test multiple conversion paths
    const snakeToCamelResult = (0, case_conversion_1.toCamelCase)(
      (0, case_conversion_1.toSnakeCase)(original)
    );
    expect(snakeToCamelResult).toEqual(original);
    const camelToPascalToCamelResult = (0, case_conversion_1.fromPascalCase)(
      (0, case_conversion_1.toPascalCase)(original)
    );
    expect(camelToPascalToCamelResult).toEqual(original);
    // Multi-step conversion
    const multiStepResult = (0, case_conversion_1.toCamelCase)(
      (0, case_conversion_1.toSnakeCase)(
        (0, case_conversion_1.fromPascalCase)((0, case_conversion_1.toPascalCase)(original))
      )
    );
    expect(multiStepResult).toEqual(original);
  });
});
