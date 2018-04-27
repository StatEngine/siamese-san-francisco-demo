import 'babel-polyfill';
import IncidentNormalizer from '@statengine/siamese';

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

  //normalize
}
