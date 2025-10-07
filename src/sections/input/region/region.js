// © 2024, 2025 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import React from 'react';
import RadioInput from '../../../components/input/radio/radio-input';
import NumberInput from '../../../components/input/number/number-input';
import IdSelector from '../id/id-selector';
import styles from './region.module.scss';

export default function Region(properties) {
  const [geographicArea, setGeographicArea] = React.useState();

  const populationDefaultValue = 100_000;
  const [population, setPopulation] = React.useState(populationDefaultValue);

  React.useEffect(() => {
    if (properties.context.idRegion === 0) {
      setGeographicArea('europeanUnion');
    } else {
      setGeographicArea('country');
    }
    setPopulation(populationDefaultValue);
  }, []);

  const regionSelector = _Region._regionSelector(properties, true);
  const municipalityInput = _Region._municipalityInput(
    properties,
    regionSelector,
    population,
    populationDefaultValue,
    setPopulation
  );

  return (
    <div>
      Geographic area
      <div className={styles.region}>
        <div className={styles.selector}>
          <RadioInput
            label="European Union  (EU27 2020)"
            value={geographicArea === 'europeanUnion'}
            change={() =>
              _Region._handleGeographicAreaChange(
                properties,
                'europeanUnion',
                setGeographicArea,
                populationDefaultValue,
                setPopulation
              )
            }
          />
        </div>
        <div className={styles.selector}>
          <RadioInput
            label="Single country:"
            value={geographicArea === 'country'}
            change={() =>
              _Region._handleGeographicAreaChange(
                properties,
                'country',
                setGeographicArea,
                populationDefaultValue,
                setPopulation
              )
            }
          />
          {geographicArea === 'country' ? regionSelector : undefined}
        </div>
        <div className={styles.selector}>
          <RadioInput
            label="Municipality in:"
            value={geographicArea === 'municipality'}
            change={() =>
              _Region._handleGeographicAreaChange(
                properties,
                'municipality',
                setGeographicArea,
                populationDefaultValue,
                setPopulation
              )
            }
          />
          {geographicArea === 'municipality' ? municipalityInput : undefined}
        </div>
      </div>
    </div>
  );
}

export class _Region {
  static _handleGeographicAreaChange(
    properties,
    geographicArea,
    setGeographicArea,
    populationDefaultValue,
    setPopulation
  ) {
    setGeographicArea(geographicArea);
    let regionId = properties.context.idRegion || 1;
    if (geographicArea === 'europeanUnion') {
      regionId = 0;
    }
    if (geographicArea === 'europeanUnion' || geographicArea === 'country') {
      setPopulation();
      properties.change(regionId);
    } else {
      setPopulation(populationDefaultValue);
      properties.change(regionId, populationDefaultValue);
    }
  }

  static _municipalityInput(
    properties,
    regionSelector,
    population,
    populationDefaultValue,
    setPopulation
  ) {
    const populationInput = this._populationInput(
      properties,
      population,
      populationDefaultValue,
      setPopulation
    );
    return (
      <>
        {regionSelector} with a population of {populationInput} inhabitants
      </>
    );
  }

  static _populationInput(
    properties,
    population,
    populationDefaultValue,
    setPopulation
  ) {
    return (
      <div className={styles['number-input']}>
      <NumberInput
        value={population}
        initialValue={populationDefaultValue}
        minimumValue={0}
        maximumValue={1_000_000}
        step={1}
        change={value =>
          this._handlePopulationInputChange(properties, value, setPopulation)
        }
        inputReference={properties.populationReference}
      />
      </div>
    );
  }

  static _handlePopulationInputChange(properties, population, setPopulation) {
    setPopulation(population);
    const regionId = properties.context.idRegion || 1;
    properties.change(regionId, population);
  }

  static _regionSelector(properties, filterEuropeanUnion = false) {
    const context = properties.context;
    const regions = context.regions;
    let defaultRegionId = context.idRegion;
    if (filterEuropeanUnion) {
      regions.rows = regions.rows.filter(row =>
        this._europeanUnionIdFilter(row)
      );
      if (defaultRegionId === 0) {
        defaultRegionId = 1;
      }
    }
    return (
      <IdSelector
        id-table={regions}
        default-id-value={defaultRegionId}
        change={async idRegion => properties.change(idRegion)}
      ></IdSelector>
    );
  }

  static _europeanUnionIdFilter(row) {
    return row[0] !== 0;
  }
}
