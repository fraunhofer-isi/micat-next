// © 2024 - 2025 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

// eslint-disable-next-line unicorn/prefer-node-protocol
import fs from 'fs';
import General from './general';

export default class BuildTime extends General {
  _singletonInstance = undefined;

  constructor(settings){
    super(settings);
    this._cachedProperties = undefined;
  }

  static instance(){
    // This function must only be called from static next.js methods that are
    // executed via node (instead of being executed in browser).
    if (!BuildTime._singletonInstance) {
      const settings = BuildTime._loadSettingsIfExist();
      BuildTime._singletonInstance = new BuildTime(settings);
    }
    return BuildTime._singletonInstance;
  }

  async readPropertiesFromDatabase(){
    if(!this._cachedProperties){
      const modes = await this.apiCall('id_mode');
      const regions = await this.apiCall('id_region');
      const indicatorGroups = await this.apiCall('id_indicator_group');
      const indicators = await this.apiCall('id_indicator');
      const subsectors = await this.apiCall('id_subsector');
      const actionTypes = await this.apiCall('id_action_type');
      const finalEnergyCarriers = await this.apiCall('id_final_energy_carrier');

      const actionTypeMappingTable = await this.apiCall('mapping__subsector__action_type');
      const actionTypeMapping = this._actionTypeMapping(actionTypeMappingTable);

      this._cachedProperties = {
        modes,
        regions,
        indicatorGroups,
        indicators,
        subsectors,
        actionTypes,
        actionTypeMapping,
        finalEnergyCarriers,
        settings: this._settings.frontEnd
      };
    }
    return this._cachedProperties;
  }

  async getPageProps() {
    let properties;
    try {
      properties = await this.readPropertiesFromDatabase();
    } catch(error){
      const message = 'Could not read properties while building next.js app.';
      console.error(message);
      throw error;
    }
    const modes = properties.modes;
    properties.defaultMode = this._defaultMode(modes);
    const regions = properties.regions;
    properties.defaultRegion = this._defaultRegion(regions);
    return properties;
  }

  _defaultMode(modes){
    let defaultRow = modes.rows.find((row) => row[0] === 1);
    if(this._settings.frontEnd.useDefaultMode) {
      const defaultRowFromSettings = this._defaultFromSettings(modes, this._settings.frontEnd.defaultMode);
      if(defaultRowFromSettings) {
        defaultRow = defaultRowFromSettings;
      }
    }
    const defaultMode = BuildTime._rowToIdObject(defaultRow);
    return defaultMode;
  }

  _defaultRegion(regions){
    let defaultRow = regions.rows.find((row) => row[0] === 0);
    if(this._settings.frontEnd.useDefaultRegion) {
      const defaultRowFromSettings = this._defaultFromSettings(regions, this._settings.frontEnd.defaultRegion);
      if(defaultRowFromSettings) {
        defaultRow = defaultRowFromSettings;
      }
    }
    const defaultRegion = BuildTime._rowToIdObject(defaultRow);
    return defaultRegion;
  }

  static _rowToIdObject(row){
    return {
      id: row[0],
      label: row[1]
    };
  }

  _defaultFromSettings(values, defaultLabel){
    const defaultRow = values.rows.find((row) => {
      const label = row[1];
      return label === defaultLabel;
    });
    return defaultRow;
  }

  _actionTypeMapping(mappingTableJson){
    const mapping = {};
    for (const row of mappingTableJson.rows){
      const idSubsector = row[1];
      const idActionType = row[2];

      if (!(idSubsector in mapping)){
        mapping[idSubsector] = [];
      }
      mapping[idSubsector].push(idActionType);
    }
    return mapping;
  }

  static _loadSettingsIfExist(){
    const settingsPath = './.settings.json';
    const settingsExist = BuildTime._fileExists(settingsPath);
    if(settingsExist){
      const settings = BuildTime._readJson(settingsPath);
      return settings;
    } else {
      const defaultSettings = BuildTime._loadDefaultSettings();
      return defaultSettings;
    }
  }

  static _loadDefaultSettings(){
    const defaultSettingsPath = './.settings.default.json';
    const defaultSettingsExist = BuildTime._fileExists(defaultSettingsPath);
    if(defaultSettingsExist){
      const defaultSettings = BuildTime._readJson(defaultSettingsPath);
      return defaultSettings;
    } else {
      throw new Error('Default settings file could not be found');
    }
  }

  static _fileExists(filePath){
    if(fs.existsSync){
      return fs.existsSync(filePath);
    } else {
      console.warn('fs module does not have a existsSync function');
      console.warn(fs);
      return true;
    }
  }

  static _readJson(filePath){
    const text = fs.readFileSync(filePath, { encoding: 'utf8', flag: 'r' });
    const json = JSON.parse(text);
    return json;
  }
}
