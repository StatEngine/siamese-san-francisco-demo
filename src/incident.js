import 'babel-polyfill';
import IncidentNormalizer from '@statengine/siamese';
import _ from 'lodash';
import moment from 'moment-timezone';

const LOW = 'LOW';
const MEDIUM = 'MEDIUM';
const HIGH = 'HIGH';

const FIRE = 'Fire';
const TECH = 'TechRescue';
const EMS = 'EMS';
const HAZMAT = 'Hazmat';

const typeLookup = {
  'Potentially Life-Threatening': {
    'Medical Incident': {
      risk_category: MEDIUM,
      response_class: EMS
    },
    'Traffic Collision': {
      risk_category: HIGH,
      response_class: EMS,
    },
    'Water Rescue': {
      risk_category: MEDIUM,
      response_class: EMS
    },
    'Other': {
      risk_category: MEDIUM,
      response_class: EMS,
    },
  },
  'Non Life-threatening': {
    'Medical Incident': {
      risk_category: LOW,
      response_class: EMS
    },
    'Traffic Collision': {
      risk_category: LOW,
      response_class: EMS,
    },
    'Other': {
      risk_category: LOW,
      response_class: EMS,
    },
  },
  'Fire': {
    'Outside Fire': {
      risk_category: LOW,
      response_class: FIRE
    },
    'Vehicle Fire': {
      risk_category: MEDIUM,
      response_class: FIRE,
    },
    'Structure Fire': {
      risk_category: HIGH,
      response_class: FIRE
    },
    'Water Rescue': {
      risk_category: MEDIUM,
      response_class: TECH,
    },
    'Other': {
      risk_category: LOW,
      response_class: FIRE,
    },
    'Explosion': {
      risk_category: LOW,
      response_class: FIRE
    },
    'HazMat': {
      risk_category: MEDIUM,
      response_class: HAZMAT,
    },
    'Industrial Accidents': {
      risk_category: LOW,
      response_class: FIRE,
    },
    'Train / Rail Incident': {
      risk_category: HIGH,
      response_class: FIRE,
    },
    'Extrication / Entrapped (Machinery, Vehicle)': {
      risk_category: HIGH,
      response_class: TECH,
    },
    'Mutual Aid / Assist Outside Agency': {
      risk_category: LOW,
      response_class: FIRE,
    },
    'Confined Space / Structure Collapse': {
      risk_category: HIGH,
      response_class: FIRE,
    },
    'High Angle Rescue': {
      risk_category: MEDIUM,
      response_class: TECH,
    },
    'Suspicious Package': {
      risk_category: HIGH,
      response_class: HAZMAT,
    },
    'Watercraft in Distress': {
      risk_category: MEDIUM,
      response_class: TECH,
    },
    'Marine Fire': {
      risk_category: MEDIUM,
      response_class: TECH
    },
  }
};

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
    super(payload, {
      timeZone,
      projection,
      fdId,
      firecaresId,
      name,
      state,
      shiftConfig
    });
  }

  parseDate(incomingDate) {
    return moment.tz(incomingDate, this.timeZone);
  }

  normalizeAddress() {
    const payload = this.payload;

    // hack to fix e02
    if (payload.station_area === 'E02') payload.station_area = '02';
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
      first_due: payload.station_area,
      location: {
        neighborhood: payload.neighborhoods_analysis_boundaries,
      },
    };

    address.geohash = IncidentNormalizer.latLongToGeohash(address.longitude, address.latitude);

    return address;
  }

  static normalizeCategory(incidentType) {
    const emsIncidents = ['Medical Incident'];
    const otherIncidents = ['Other', 'Citizen Assist / Service Call'];

    if (emsIncidents.includes(incidentType)) {
      return 'EMS';
    } else if (otherIncidents.includes(incidentType)) {
      return 'OTHER';
    }
    return 'FIRE';
  }

  normalizeDescription() {
    const ts = (t) => {
      if (_.isEmpty(t)) {
        return null;
      }
      const v = this.parseDate(t);
      return v ? v.format() : null;
    };

    const payload = this.payload;
    const eventOpened = this.parseDate(payload.entry_dttm);

    const classAndRisk = SanFranciscoDemoIncident.lookupClassAndRisk(payload.call_type_group, payload.call_type);

    const description = {
      event_opened: eventOpened.format(),
      type: payload.call_type,
      subtype: payload.call_type_group,
      event_id: payload.call_number,
      incident_number: payload.incident_number,
      psap_answer_time: ts(payload.received_dttm),
      category: SanFranciscoDemoIncident.normalizeCategory(payload.call_type),
      hour_of_day: eventOpened.hours(),
      day_of_week: eventOpened.format('dddd'),
      shift: this.calculateShift(eventOpened.format()),
      priority: payload.priority,
      alarms: !_.isUndefined(payload.number_of_alarms) ?
        Number(payload.number_of_alarms) : undefined,
      response_class: classAndRisk.response_class,
      risk_category: classAndRisk.risk_category,
    };

    description.extended_data = IncidentNormalizer.calculateDescriptionExtendedData(description);
    return description;
  }


  static lookupClassAndRisk(group, type) {
    let response_class = 'Unknown';
    let risk_category = 'Unknown';

    if (group === 'Alarm') {
       response_class = 'Alarm';
       risk_category = LOW;
    }

    if (!_.isNil(group) && !_.isNil(type)) {
      let lookup = _.get(typeLookup, `${group}.${type}`)
      if (lookup) {
        response_class = lookup.response_class;
        risk_category = lookup.risk_category;
      }
    }

    return {
      response_class,
      risk_category,
    };
  };

  static normalizeUnitType(unitType) {
    switch (unitType) {
      case 'CHIEF':
        return 'Chief Officer';
      case 'ENGINE':
        return 'Engine';
      case 'TRUCK':
        return 'Truck/Aerial';
      case 'MEDIC':
        return 'ALS';
      case 'RESCUE CAPTAIN':
        return 'Other Apparatus';
      case 'RESCUE SQUAD':
        return 'Rescue Unit';
      case 'AIRPORT':
        return 'ARFF';
      case 'SUPPORT':
        return 'Support Unit';
      default:
        return 'Unknown';
    }
  }

  normalizeApparatus() {
    const apparatus = [];

    const unit = this.payload;
    const incApp = {
      unit_id: unit.unit_id,
      unit_type: SanFranciscoDemoIncident.normalizeUnitType(unit.unit_type),
      unit_status: {},
    };

    const statuses = [
      ['dispatched', 'dispatch_dttm'],
      ['enroute', 'response_dttm'],
      ['arrived', 'on_scene_dttm'],
      ['available', 'available_dttm'],
      ['transport_started', 'transport_dttm'],
      ['transport_arrived', 'hospital_dttm'],
    ];

    statuses.forEach((status) => {
      const [type, key] = status;
      if (unit[key]) {
        const timestamp = this.parseDate(unit[key]).format();
        incApp.unit_status[type] = {
          timestamp
        };

        if (type === 'dispatched') {
          incApp.shift = this.calculateShift(timestamp);
        }
      }
    });

    incApp.extended_data = IncidentNormalizer.calculateUnitStatusExtendedData(incApp.unit_status);

    apparatus.push(incApp);
    return apparatus;
  }
}