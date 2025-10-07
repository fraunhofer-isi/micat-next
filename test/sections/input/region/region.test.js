// © 2024, 2025 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import React from 'react';
import Region, {
  _Region
} from './../../../../src/sections/input/region/region';

describe('construction for european region', () => {
  let mockedProperties;
  let sut;
  beforeEach(() => {
    mockedProperties = {
      context: {
        idRegion: 0,
        regions: {
          rows: [[]]
        }
      }
    };
    spyOn(React, 'useState').and.returnValue(['europeanUnion', () => {}]);
    spyOn(React, 'useEffect').and.callFake(delegate => delegate());
    spyOn(_Region, '_regionSelector');
    spyOn(_Region, '_municipalityInput');
    sut = new Region(mockedProperties);
  });

  it('construction for country', () => {
    mockedProperties.context.idRegion = 1;
    const result = new Region(mockedProperties);
    expect(result).toBeDefined();
  });

  it('europeanSelector', () => {
    const geographicAreaSelectors = sut.props.children[1];
    const radioInput = geographicAreaSelectors.props.children[0].props.children;
    const change = radioInput.props.change;

    spyOn(_Region, '_handleGeographicAreaChange');
    change();
    expect(_Region._handleGeographicAreaChange).toBeCalled();
  });
  it('countrySelector', () => {
    const geographicAreaSelectors = sut.props.children[1];
    const radioInput =
      geographicAreaSelectors.props.children[1].props.children[0];
    const change = radioInput.props.change;

    spyOn(_Region, '_handleGeographicAreaChange');
    change();
    expect(_Region._handleGeographicAreaChange).toBeCalled();
  });
  it('municipalitySelector', () => {
    const geographicAreaSelectors = sut.props.children[1];
    const radioInput =
      geographicAreaSelectors.props.children[2].props.children[0];
    const change = radioInput.props.change;

    spyOn(_Region, '_handleGeographicAreaChange');
    change();
    expect(_Region._handleGeographicAreaChange).toBeCalled();
  });
});

it('construction for country', () => {
  const mockedProperties = {
    context: {
      idRegion: 1,
      regions: {
        rows: [[]]
      }
    }
  };
  mockedProperties.context.idRegion = 1;
  spyOn(React, 'useState').and.returnValue(['country', () => {}]);
  spyOn(React, 'useEffect').and.callFake(delegate => delegate());
  const result = new Region(mockedProperties);
  expect(result).toBeDefined();
});

it('construction for municipality', () => {
  const mockedProperties = {
    context: {
      idRegion: 1,
      regions: {
        rows: [[]]
      }
    }
  };
  mockedProperties.context.idRegion = 1;
  spyOn(React, 'useState').and.returnValue(['municipality', () => {}]);
  spyOn(React, 'useEffect').and.callFake(delegate => delegate());
  const result = new Region(mockedProperties);
  expect(result).toBeDefined();
});

describe('_Region', () => {
  let mockedProperties;
  beforeEach(() => {
    mockedProperties = {
      context: {
        idRegion: 0,
        regions: {
          rows: [[]]
        }
      },
      change: jest.fn()
    };
  });

  describe('_handleGeographcAreaChange', () => {
    const mockedSetGeographicArea = jest.fn();
    const mockedSetPopulation = jest.fn();
    it('idRegion defined and geographicArea is europeanUnion', () => {
      _Region._handleGeographicAreaChange(
        mockedProperties,
        'europeanUnion',
        mockedSetGeographicArea,
        100_000,
        mockedSetPopulation
      );
      expect(mockedSetGeographicArea).toHaveBeenCalled();
    });
    it('idRegion undefined and geographicArea is not europeanUnion', () => {
      _Region._handleGeographicAreaChange(
        mockedProperties,
        'Single country',
        mockedSetGeographicArea,
        100_000,
        mockedSetPopulation
      );
      expect(mockedSetGeographicArea).toHaveBeenCalled();
    });
  });
  it('_europeanUnionFilter', () => {
    const result = _Region._europeanUnionIdFilter([0, 1, 2]);
    expect(result).toBe(false);
  });

  describe('_regionSelector', () => {
    it('filterEuropeanUnion is true', async () => {
      spyOn(_Region, '_europeanUnionIdFilter');
      const result = _Region._regionSelector(mockedProperties, true);
      expect(result).toBeDefined();
      const change = result.props.change;
      await change();
      expect(mockedProperties.change).toHaveBeenCalled();
    });
    it('filterEuropeanUnion is false', async () => {
      spyOn(_Region, '_europeanUnionIdFilter');
      const result = _Region._regionSelector(mockedProperties);
      expect(result).toBeDefined();
      const change = result.props.change;
      await change();
      expect(mockedProperties.change).toHaveBeenCalled();
    });
    it('filterEuropeanUnion is true and defaultRegionID is not "0"', async () => {
      spyOn(_Region, '_europeanUnionIdFilter');
      mockedProperties.context.idRegion = 1;
      const result = _Region._regionSelector(mockedProperties, true);
      expect(result).toBeDefined();
      const change = result.props.change;
      await change();
      expect(mockedProperties.change).toHaveBeenCalled();
    });
  });

  it('_populationInput', () => {
    const mockedSetPopulation = jest.fn();
    const mockedProperties = {};
    const result = _Region._populationInput(
      mockedProperties,
      'mocked_population',
      'mocked_population_default_value',
      mockedSetPopulation
    );
    const mockedHandlePopulationInputChange = spyOn(_Region, '_handlePopulationInputChange');
    expect(result).toBeDefined();
    const change = result.props.children.props.change;
    change('mocked_population');
    expect(mockedHandlePopulationInputChange).toBeCalled();
  });

  describe('_handlePopulationInputChange', () => {
    const mockedSetPopulation = jest.fn();
    it('idRegion defined', () => {
      const mockedProperties = {
        change: jest.fn(),
        context: {
          idRegion: 1
        }
      };
      _Region._handlePopulationInputChange(mockedProperties, 'mocked_population', mockedSetPopulation);
    });
    it('idRegion undefined', () => {
      const mockedProperties = {
        change: jest.fn(),
        context: {}
      };
      _Region._handlePopulationInputChange(mockedProperties, 'mocked_population', mockedSetPopulation);
    });
  });

  it('_municipalityInput', () => {
    spyOn(_Region, '_populationInput');
    const result = _Region._municipalityInput(
      'mocked_regionSelector',
      'mocked_population',
      'mocked_setPopulation'
    );
    expect(result).toBeDefined();
  });
});
