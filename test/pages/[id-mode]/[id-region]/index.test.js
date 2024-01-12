// © 2024 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import BuildTime from '../../../../src/server/build-time';
import {
  Index,
  getStaticPaths,
  getStaticProps
} from '../../../../src/pages/[id-mode]/[id-region]/index';

describe('main', () => {
  let sut;
  beforeEach(() => {
    const properties = {
      foo: 'mocked_property'
    };
    sut = new Index(properties);
  });

  it('construction', () => {
    expect(sut.props.foo).toBe('mocked_property');
  });

  it('render', () => {
    const result = sut.render();
    expect(result).toBeDefined();
    expect(result.props.foo).toBe('mocked_property');
  });

  describe('getStaticPaths', () => {
    it('without error', async () => {
      const mockedBuildTime = {
        readPropertiesFromDatabase: () => {}
      };
      spyOn(mockedBuildTime, 'readPropertiesFromDatabase').and.returnValue('mocked_properties');
      spyOn(BuildTime, 'instance').and.returnValue(mockedBuildTime);
      spyOn(Index, '_generatePaths').and.returnValue('mocked_paths');
      const result = await getStaticPaths();
      expect(result.paths).toBe('mocked_paths');
    });

    it('with error', async () => {
      const mockedBuildTime = {
        readPropertiesFromDatabase: () => {}
      };
      const mockedError = new Error('mocked_error');
      const mockedReadProperties = () => { throw mockedError; };
      spyOn(mockedBuildTime, 'readPropertiesFromDatabase').and.callFake(mockedReadProperties);
      spyOn(BuildTime, 'instance').and.returnValue(mockedBuildTime);
      spyOn(console, 'error');

      await expect(getStaticPaths()).rejects.toThrow(mockedError);
    });
  });

  describe('getStaticProps', () => {
    it('without error', async () => {
      spyOn(console, 'log');
      const mockedBuildTime = {
        readPropertiesFromDatabase: () => {}
      };
      spyOn(mockedBuildTime, 'readPropertiesFromDatabase').and.returnValue('mocked_properties');
      spyOn(BuildTime, 'instance').and.returnValue(mockedBuildTime);
      spyOn(Index, '_extractRouteParametersFromContextAndAppendToProperties').and.returnValue('mocked_properties');
      const result = await getStaticProps();
      expect(result.props).toBe('mocked_properties');
    });

    it('with error', async () => {
      const mockedBuildTime = {
        readPropertiesFromDatabase: () => {}
      };
      const mockedError = new Error('mocked_error');
      const mockedReadproperties = () => { throw mockedError; };
      spyOn(mockedBuildTime, 'readPropertiesFromDatabase').and.callFake(mockedReadproperties);
      spyOn(BuildTime, 'instance').and.returnValue(mockedBuildTime);
      spyOn(console, 'error');

      await expect(getStaticProps()).rejects.toThrow(mockedError);
    });
  });

  it('_generatePaths', () => {
    const properties = {
      regions: {
        rows: [['mocked_id', 'mocked_label', 'mocked_description']]
      },
      modes: {
        rows: [['mocked_mode_id', 'mocked_mode_label', 'mocked_mode_description']]
      }
    };
    const paths = Index._generatePaths(properties);
    expect(paths.length).toBe(1);

    const path = paths[0];
    expect(path.params['id-mode']).toBe('mocked_mode_id');
    expect(path.params['id-region']).toBe('mocked_id');
  });

  it('_extractRouteParametersFromContextAndAppendToProperties', () => {
    const properties = {};
    const context = {
      params: {
        'id-mode': '33',
        'id-region': '66'
      }
    };
    const result = Index._extractRouteParametersFromContextAndAppendToProperties(
      properties,
      context
    );
    expect(result.idMode).toBe(33);
    expect(result.idRegion).toBe(66);
  });
});
