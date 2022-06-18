const { ZigBeeDevice } = require("homey-zigbeedriver");
const { debug, CLUSTER, ZCLNode } = require("zigbee-clusters");
const { SoilMoistureCluster } = require('./../../lib/soilMoisture');

debug(true);

interface DeviceProps {
  zclNode: typeof ZCLNode
}

class FlowerSensor extends ZigBeeDevice {
  async onNodeInit({ zclNode }: DeviceProps) {
    this.log(zclNode.endpoints[1].clusters);

    await this.configureAttributeReporting([
      {
        endpointId: 1,
        cluster: CLUSTER.TEMPERATURE_MEASUREMENT,
        attributeName: 'measuredValue',
        minInterval: 0,
        maxInterval: 21600,
        minChange: 0,
      },
      {
        endpointId: 1,
        cluster: {
          NAME: 'soilMoisture',
          ID: 1032,
        },
        attributeName: 'measuredValue',
        minInterval: 0,
        maxInterval: 21600,
        minChange: 0,
      },
      {
        endpointId: 1,
        cluster: CLUSTER.POWER_CONFIGURATION,
        attributeName: 'batteryPercentageRemaining',
        minInterval: 0,
        maxInterval: 21600,
        minChange: 0,
      },
    ]);

    // 1.2.) Listen to attribute reports for the above configured attribute reporting
    zclNode.endpoints[1].clusters.temperatureMeasurement.on(
      'attr.measuredValue',
      (value: any) => {
        const parsedValue = Math.round((value / 100) * 10) / 10;
        this.log(`temp value ${parsedValue} ${value}`);

        this.setCapabilityValue('measure_temperature', parsedValue);
      },
    );

    // 1.2.) Listen to attribute reports for the above configured attribute reporting
    zclNode.endpoints[1].clusters.powerConfiguration.on(
      'attr.batteryPercentageRemaining',
      (value: any) => {
        const parsedValue = (value / 2);
        this.log(`battery percentage remaining ${parsedValue}`);

        this.setCapabilityValue('measure_battery', parsedValue);
      },
    );

    // 1.2.) Listen to attribute reports for the above configured attribute reporting
    zclNode.endpoints[1].clusters.soilMoisture.on(
      'attr.measuredValue',
      (value: any) => {
        const parsedValue = parseFloat(value) / 100;

        this.log(`soil moisture value ${parsedValue}`);

        this.setCapabilityValue('measure_moisture', parsedValue);
      },
    );
  }

}

module.exports = FlowerSensor;
