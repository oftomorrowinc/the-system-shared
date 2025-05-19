// src/lib/__tests__/case-conversion.test.ts

import {
  camelToSnake,
  snakeToCamel,
  camelToPascal,
  pascalToCamel,
  snakeToPascal,
  pascalToSnake,
  toSnakeCase,
  toCamelCase,
  toPascalCase,
  fromPascalCase,
} from '../case-conversion';

describe('Case Conversion - String Transformations', () => {
  // Basic conversion tests
  describe('basic conversions', () => {
    test('camelToSnake converts camelCase to snake_case', () => {
      expect(camelToSnake('helloWorld')).toBe('hello_world');
      expect(camelToSnake('userName')).toBe('user_name');
      expect(camelToSnake('APIKey')).toBe('api_key');
      expect(camelToSnake('userIDAndName')).toBe('user_id_and_name');
      expect(camelToSnake('a')).toBe('a');
      expect(camelToSnake('')).toBe('');
    });

    test('snakeToCamel converts snake_case to camelCase', () => {
      expect(snakeToCamel('hello_world')).toBe('helloWorld');
      expect(snakeToCamel('user_name')).toBe('userName');
      expect(snakeToCamel('api_key')).toBe('apiKey');
      expect(snakeToCamel('user_id_and_name')).toBe('userIdAndName');
      expect(snakeToCamel('a')).toBe('a');
      expect(snakeToCamel('')).toBe('');
    });

    test('camelToPascal converts camelCase to PascalCase', () => {
      expect(camelToPascal('helloWorld')).toBe('HelloWorld');
      expect(camelToPascal('userName')).toBe('UserName');
      expect(camelToPascal('apiKey')).toBe('ApiKey');
      expect(camelToPascal('a')).toBe('A');
      expect(camelToPascal('')).toBe('');
    });

    test('pascalToCamel converts PascalCase to camelCase', () => {
      expect(pascalToCamel('HelloWorld')).toBe('helloWorld');
      expect(pascalToCamel('UserName')).toBe('userName');
      expect(pascalToCamel('ApiKey')).toBe('apiKey');
      expect(pascalToCamel('A')).toBe('a');
      expect(pascalToCamel('')).toBe('');
    });

    test('snakeToPascal converts snake_case to PascalCase', () => {
      expect(snakeToPascal('hello_world')).toBe('HelloWorld');
      expect(snakeToPascal('user_name')).toBe('UserName');
      expect(snakeToPascal('api_key')).toBe('ApiKey');
      expect(snakeToPascal('user_id_and_name')).toBe('UserIdAndName');
      expect(snakeToPascal('a')).toBe('A');
      expect(snakeToPascal('')).toBe('');
    });

    test('pascalToSnake converts PascalCase to snake_case', () => {
      expect(pascalToSnake('HelloWorld')).toBe('hello_world');
      expect(pascalToSnake('UserName')).toBe('user_name');
      expect(pascalToSnake('ApiKey')).toBe('api_key');
      expect(pascalToSnake('UserIdAndName')).toBe('user_id_and_name');
      expect(pascalToSnake('A')).toBe('a');
      expect(pascalToSnake('')).toBe('');
    });
  });

  // Edge cases
  describe('edge cases', () => {
    test('handles strings with consecutive uppercase letters', () => {
      expect(camelToSnake('userIDAndName')).toBe('user_id_and_name');
      expect(pascalToSnake('UserIDAndName')).toBe('user_id_and_name');
    });

    test('handles strings with numbers', () => {
      expect(camelToSnake('user123Name')).toBe('user123_name');
      expect(snakeToCamel('user_123_name')).toBe('user123Name');
      expect(camelToPascal('user123Name')).toBe('User123Name');
      expect(pascalToCamel('User123Name')).toBe('user123Name');
    });

    test('handles already converted strings', () => {
      // Apply the same transformation twice
      expect(camelToSnake(camelToSnake('helloWorld'))).toBe('hello_world');
      expect(snakeToCamel(snakeToCamel('hello_world'))).toBe('helloWorld');

      // Apply the inverse transformation
      expect(snakeToCamel(camelToSnake('helloWorld'))).toBe('helloWorld');
      expect(camelToSnake(snakeToCamel('hello_world'))).toBe('hello_world');
      expect(pascalToCamel(camelToPascal('helloWorld'))).toBe('helloWorld');
      expect(camelToPascal(pascalToCamel('HelloWorld'))).toBe('HelloWorld');
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
    expect(toSnakeCase(testObject)).toEqual(snakeCaseObject);
  });

  test('toCamelCase converts all object keys from snake_case to camelCase', () => {
    expect(toCamelCase(snakeCaseObject)).toEqual(testObject);
  });

  test('toPascalCase converts all object keys from camelCase to PascalCase', () => {
    expect(toPascalCase(testObject)).toEqual(pascalCaseObject);
  });

  test('fromPascalCase converts all object keys from PascalCase to camelCase', () => {
    expect(fromPascalCase(pascalCaseObject)).toEqual(testObject);
  });

  test('preserves id and underscore-prefixed fields', () => {
    const result = toSnakeCase(testObject);
    expect(result.id).toBe('user-123');
    expect(result._meta).toEqual({ lastUpdated: 'yesterday' });

    const resultFromPascal = fromPascalCase(pascalCaseObject);
    expect(resultFromPascal.id).toBe('user-123');
    expect(resultFromPascal._meta).toEqual({ lastUpdated: 'yesterday' });
  });

  test('handles null and undefined values', () => {
    const objWithNulls = {
      firstName: null,
      lastName: undefined,
      userDetails: null,
    };

    const snakeResult = toSnakeCase(objWithNulls);
    expect(snakeResult).toEqual({
      first_name: null,
      last_name: undefined,
      user_details: null,
    });

    const pascalResult = toPascalCase(objWithNulls);
    expect(pascalResult).toEqual({
      FirstName: null,
      LastName: undefined,
      UserDetails: null,
    });
  });

  test('handles non-object values', () => {
    expect(toSnakeCase('not an object')).toBe('not an object');
    expect(toCamelCase('not an object')).toBe('not an object');
    expect(toPascalCase('not an object')).toBe('not an object');
    expect(fromPascalCase('not an object')).toBe('not an object');
    expect(toSnakeCase(null)).toBe(null);
    expect(toCamelCase(undefined)).toBe(undefined);
  });

  test('handles empty objects', () => {
    expect(toSnakeCase({})).toEqual({});
    expect(toCamelCase({})).toEqual({});
    expect(toPascalCase({})).toEqual({});
    expect(fromPascalCase({})).toEqual({});
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

    expect(toSnakeCase(array)).toEqual(expectedSnakeArray);
    expect(toPascalCase(array)).toEqual(expectedPascalArray);
  });
});

// Round-trip tests to ensure consistency
describe('Case Conversion - Round Trip Tests', () => {
  test('camelCase -> snake_case -> camelCase preserves the original string', () => {
    const original = 'helloWorldExample';
    expect(snakeToCamel(camelToSnake(original))).toBe(original);
  });

  test('snake_case -> camelCase -> snake_case preserves the original string', () => {
    const original = 'hello_world_example';
    expect(camelToSnake(snakeToCamel(original))).toBe(original);
  });

  test('camelCase -> PascalCase -> camelCase preserves the original string', () => {
    const original = 'helloWorldExample';
    expect(pascalToCamel(camelToPascal(original))).toBe(original);
  });

  test('PascalCase -> camelCase -> PascalCase preserves the original string', () => {
    const original = 'HelloWorldExample';
    expect(camelToPascal(pascalToCamel(original))).toBe(original);
  });

  test('snake_case -> PascalCase -> snake_case preserves the original string', () => {
    const original = 'hello_world_example';
    expect(pascalToSnake(snakeToPascal(original))).toBe(original);
  });

  test('camelCase -> snake_case -> PascalCase -> camelCase preserves the original string', () => {
    const original = 'helloWorldExample';
    expect(pascalToCamel(snakeToPascal(camelToSnake(original)))).toBe(original);
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
    const snakeToCamelResult = toCamelCase(toSnakeCase(original));
    expect(snakeToCamelResult).toEqual(original);

    const camelToPascalToCamelResult = fromPascalCase(toPascalCase(original));
    expect(camelToPascalToCamelResult).toEqual(original);

    // Multi-step conversion
    const multiStepResult = toCamelCase(toSnakeCase(fromPascalCase(toPascalCase(original))));
    expect(multiStepResult).toEqual(original);
  });
});
