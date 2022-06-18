'use strict';

const { ZCLDataTypes, Cluster } = require('zigbee-clusters');

const ATTRIBUTES = {
  measuredValue: { id: 0, type: ZCLDataTypes.uint16 },
};

const COMMANDS = {};

class SoilMoistureCluster extends Cluster {

  static get ID() {
    return 1032;
  }

  static get NAME() {
    return 'soilMoisture';
  }

  static get ATTRIBUTES() {
    return ATTRIBUTES;
  }

  static get COMMANDS() {
    return COMMANDS;
  }

}

Cluster.addCluster(SoilMoistureCluster);

module.exports = SoilMoistureCluster;
