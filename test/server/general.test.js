// © 2024-2026 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import General from '../../src/server/general';

describe('Public API', () => {
  let sut;
  beforeAll(() => {
    sut = new General('mocked_settings');
  });

  it('construction', () => {
    expect(sut).toBeDefined();
  });

  describe('apiCall', () => {
    it('local', async () => {
      sut._settings = {
        frontEnd: {
          apiCalls: {
            useLocalApi: true
          }
        }
      };
      spyOn(General, '_backEndApiCall').and.returnValue('mocked_result');
      const result = await sut.apiCall('mocked_url');
      expect(result).toBe('mocked_result');
    });

    it('without settings', async () => {
      sut._settings = undefined;
      spyOn(General, '_backEndApiCall').and.returnValue('mocked_result');
      const result = await sut.apiCall('mocked_url');
      expect(result).toBe('mocked_result');
    });

    it('remote', async () => {
      sut._settings = {
        frontEnd: {
          apiCalls: {
            useLocalApi: false
          }
        }
      };
      spyOn(General, '_backEndApiCall').and.returnValue('mocked_result');
      const result = await sut.apiCall('mocked_url');
      expect(result).toBe('mocked_result');
    });
  });
});

describe('Private API', () => {
  let mockedResponse;
  let mockedFetch;
  beforeEach(() => {
    mockedResponse = {
      text: async () => {},
      blob: async () => 'mocked_blob',
      headers: {
        get: () => 'mocked_header'
      }
    };
    mockedFetch = async () => mockedResponse;
  });
  describe('_backendApiCall', () => {
    it('fetch throws error', async() => {
      mockedFetch = async () => { throw new Error('mocked_error'); };
      spyOn(window, 'fetch').and.callFake(mockedFetch);
      await expect(() => General._backEndApiCall(
        'mocked_baseUrl',
        'mocked_apiUrl')
      ).rejects.toThrowError();
    });

    it('spreadsheet', async() => {
      spyOn(mockedResponse.headers, 'get').and.returnValue('spreadsheet');
      spyOn(window, 'fetch').and.callFake(mockedFetch);
      const result = await General._backEndApiCall(
        'mocked_baseUrl',
        'mocked_apiUrl');
      expect(result).toBe('mocked_blob');
    });

    it('text throws error', async() => {
      // eslint-disable-next-line unicorn/consistent-function-scoping
      const mockedText = async () => { throw new Error('mocked text error'); };
      spyOn(mockedResponse, 'text').and.callFake(mockedText);
      spyOn(window, 'fetch').and.callFake(mockedFetch);
      await expect(() => General._backEndApiCall(
        'mocked_baseUrl',
        'mocked_apiUrl')
      ).rejects.toThrowError();
    });

    it('text is html', async() => {
      spyOn(mockedResponse, 'text').and.returnValue('<div>Mocked html error</div>');
      spyOn(window, 'fetch').and.callFake(mockedFetch);
      await expect(() => General._backEndApiCall(
        'mocked_baseUrl',
        'mocked_apiUrl')
      ).rejects.toThrowError();
    });

    it('text is not json parsable', async() => {
      spyOn(mockedResponse, 'text').and.returnValue('mocked invalid json');
      spyOn(window, 'fetch').and.callFake(mockedFetch);
      await expect(() => General._backEndApiCall(
        'mocked_baseUrl',
        'mocked_apiUrl')
      ).rejects.toThrowError();
    });

    it('json contains error property', async() => {
      const jsonText = '{"error": {"foo": "foo", "baa": "baa"}}';
      spyOn(mockedResponse, 'text').and.returnValue(jsonText);
      spyOn(window, 'fetch').and.callFake(mockedFetch);
      await expect(() => General._backEndApiCall(
        'mocked_baseUrl',
        'mocked_apiUrl')
      ).rejects.toThrowError();
    });

    it('normal usage', async() => {
      spyOn(mockedResponse, 'text').and.returnValue('{"foo": "baa"}');
      spyOn(window, 'fetch').and.callFake(mockedFetch);
      const result = await General._backEndApiCall(
        'mocked_baseUrl',
        'mocked_apiUrl',
        {},
        'application/json');
      expect(result).toStrictEqual({ foo: 'baa' });
    });
  });
});
