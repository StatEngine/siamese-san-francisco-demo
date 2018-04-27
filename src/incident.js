import 'babel-polyfill';
import IncidentNormalizer from '@statengine/siamese';
import _ from 'lodash';
import moment from 'moment-timezone';

export default class SanFranciscoDemoIncident extends IncidentNormalizer {
  // eslint-disable-next-line no-unused-vars
  constructor(payload, {
    timeZone = 'US/Pacific',
    projection = 'EPSG:4326',
    fdId = '38005',
    firecaresId = '94264',
    name = 'San Francisco Fire Department',
    state = 'CA',
    shiftConfig = {
      firstDay: '2016-10-18',
      pattern: 'acababacbcacacbabcbcb',
      shiftStart: '0800',
    },
  } = {}) {
    super(payload, { timeZone, projection, fdId, firecaresId, name, state, shiftConfig });
  }

  parseDate(incomingDate) {
    return moment.tz(incomingDate, this.timeZone);
  }

  normalizeAddress() {
    const payload = this.payload[0];

    const address = {
      address_id: '',
      address_line1: payload.address,
      city: payload.city,
      postal_code: payload.zipcode_of_incident,
      response_zone: payload.box,
      state: 'CA',
      longitude: parseFloat(payload.location.coordinates[0]),
      latitude: parseFloat(payload.location.coordinates[1]),
      battalion: payload.battalion,
      first_due: payload.station_area
    };

    address.geohash = IncidentNormalizer.latLongToGeohash(address.longitude, address.latitude);

    return address;
  }

  normalizeDescription() {
    const ts = (t) => {
      if (_.isEmpty(t)) { return null; }
      const v = this.parseDate(t);
      return v ? v.format() : null;
    };

    const payload = this.payload[0];
    const eventOpened = this.parseDate(payload.entry_dttm);

    // let firstUnitEnroute;
    // if (this.payload.EnrouteDateTime) {
    //   firstUnitEnroute = this.payload.EnrouteDateTime;
    // } else {
    //   const unitsEnRoute = _.filter(this.payload.Unit, u => u.UnitEnrouteDateTime);
    //   const minUnitEnroute = _.minBy(unitsEnRoute, u => moment(u.UnitEnrouteDateTime).valueOf());
    //   firstUnitEnroute = minUnitEnroute ? minUnitEnroute.UnitEnrouteDateTime : undefined;
    // }

     const uniqUnits = _.uniq(
       _.map(this.payload, u => u.unit_id));


    const minTimes = timestamp => ts(_.minBy(this.payload.filter(obj => !_.isEmpty(obj[timestamp])),
      unit => ts(unit[timestamp]))[timestamp]);

    const maxTimes = timestamp => ts(_.maxBy(this.payload.filter(obj => !_.isEmpty(obj[timestamp])),
      unit => ts(unit[timestamp]))[timestamp]);

    const description = {
      event_opened: eventOpened.format(),
      type: payload.call_type_group,
      subtype: payload.call_type,
      event_id: payload.call_number,
      incident_number: payload.incident_number,
      event_closed: maxTimes('available_dttm'),
      units: uniqUnits,
      first_unit_dispatched: minTimes('dispatch_dttm'),
      first_unit_enroute: minTimes('response_dttm'),
      first_unit_arrived: minTimes('on_scene_dttm'),
      psap_answer_time: ts(payload.received_dttm),
      hour_of_day: eventOpened.hours(),
      day_of_week: eventOpened.format('dddd'),
      shift: this.calculateShift(eventOpened.format()),
      priority: payload.priority,
      alarms: !_.isUndefined(payload.number_of_alarms) ? Number(payload.number_of_alarms) : undefined
    };
    description.extended_data = IncidentNormalizer.calculateDescriptionExtendedData(description);
    return description;
  }
}
