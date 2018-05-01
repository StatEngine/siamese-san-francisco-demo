import { expect } from 'chai';
import path from 'path';
import fs from 'fs';

import FireIncident from '../src/incident';

describe('San Francisco Normalizer', () => {
  describe.skip('Unit Type Normalizer', () => {
    const incident = new FireIncident();

    it('Correctly normalizes engines.', () => {
      expect(incident.normalizeUnitType('EN009')).to.equal('Engine');
    });

    it('Correctly normalizes ALS units.', () => {
      expect(incident.normalizeUnitType('PM009')).to.equal('ALS');
      expect(incident.normalizeUnitType('UAEMS1')).to.equal('ALS');
    });

    it('Correctly normalizes ladders.', () => {
      expect(incident.normalizeUnitType('LD380')).to.equal('Truck/Aerial');
      expect(incident.normalizeUnitType('QT380')).to.equal('Truck/Aerial');
    });

    it('Correctly normalizes brush trucks.', () => {
      expect(incident.normalizeUnitType('BR380')).to.equal('Brush Truck');
    });

    it('Correctly normalizes tenders.', () => {
      expect(incident.normalizeUnitType('WT380')).to.equal('Tanker/Tender');
      expect(incident.normalizeUnitType('LT007')).to.equal('Tanker/Tender');
    });

    it('Correctly normalizes hazmat units.', () => {
      expect(incident.normalizeUnitType('HM380')).to.equal('Hazmat Unit');
    });

    it('Correctly normalizes rescues.', () => {
      expect(incident.normalizeUnitType('RE005')).to.equal('Rescue Unit');
      expect(incident.normalizeUnitType('HV005')).to.equal('Rescue Unit');
    });

    it('Correctly normalizes command units.', () => {
      expect(incident.normalizeUnitType('CV380')).to.equal('Mobile Command Post');
    });

    it('Correctly normalizes chiefs.', () => {
      expect(incident.normalizeUnitType('AC009')).to.equal('Chief Officer');
      expect(incident.normalizeUnitType('FC01')).to.equal('Chief Officer');
      expect(incident.normalizeUnitType('DC01')).to.equal('Chief Officer');
      expect(incident.normalizeUnitType('BN01')).to.equal('Chief Officer');
    });

    it('Correctly normalizes support units.', () => {
      expect(incident.normalizeUnitType('AP009')).to.equal('Support Unit');
      expect(incident.normalizeUnitType('AT001')).to.equal('Support Unit');
    });
  });

  describe.only('Basic Incident', () => {
    let b05, e05, e06, t06;

    before(() => {
      b05 = new FireIncident(JSON.parse(fs.readFileSync(path.join(__dirname, './data/171743725-B05.json'))));
      e05 = new FireIncident(JSON.parse(fs.readFileSync(path.join(__dirname, './data/171743725-E05.json'))));
      e06 = new FireIncident(JSON.parse(fs.readFileSync(path.join(__dirname, './data/171743725-E06.json'))));
      t06 = new FireIncident(JSON.parse(fs.readFileSync(path.join(__dirname, './data/171743725-T06.json'))));
    });

    describe('correctly parses the department', () => {
      let department;

      before(() => {
        department = b05.normalizeFireDepartment();
      });

      it('correctly parses the fdid', () => {
        expect(department.fd_id).to.equal('38005');
      });

      it('correctly parses the firecaresId', () => {
        expect(department.firecares_id).to.equal('94264');
      });

      it('correctly parses the name', () => {
        expect(department.name).to.equal('San Francisco Fire Department');
      });

      it('correctly parses the state', () => {
        expect(department.state).to.equal('CA');
      });

      it('correctly parses the timezone', () => {
        expect(department.timezone).to.equal('US/Pacific');
      });
    });

    describe('correctly parses the address', () => {
      let address;

      before(() => {
        address = b05.normalizeAddress();
      });

      it('correctly parses the house number', () => {
        expect(address.number).to.be.undefined;
      });

      it('correctly parses the house number', () => {
        expect(address.building_number).to.be.undefined;
      });

      it('correctly parses the address line', () => {
        expect(address.address_line1).to.equal('500 Block of WALLER ST');
      });

      it('correctly parses the city', () => {
        expect(address.city).to.equal('San Francisco');
      });

      it('correctly parses the first cross street', () => {
        expect(address.cross_street1).to.be.undefined;
      });

      it('correctly parses the second cross street', () => {
        expect(address.cross_street2).to.be.undefined;
      });

      it('correctly parses the first due', () => {
        expect(address.first_due).to.be.equal('06');
      });

      it('correctly parses the street name', () => {
        expect(address.name).to.be.undefined;
      });

      it('correctly parses the postal code', () => {
        expect(address.postal_code).to.equal('94117');
      });

      it('correctly parses the prefix direction', () => {
        expect(address.prefix_direction).to.be.undefined;
      });

      it('correctly parses the suffix direction', () => {
        expect(address.suffix_direction).to.be.undefined;
      });

      it('correctly parses the response zone', () => {
        expect(address.response_zone).to.equal('3635');
      });

      it('correctly parses the state', () => {
        expect(address.state).to.equal('CA');
      });

      it('correctly parses the street type', () => {
        expect(address.type).to.be.undefined;
      });

      it('correctly parses the latitude', () => {
        expect(address.latitude).to.equal(37.770966902634);
      });

      it('correctly parses the longitude', () => {
        expect(address.longitude).to.equal(-122.432321754736);
      });

      it('correctly parses the geohash', () => {
        expect(address.geohash).to.equal('9q8yvgzxb4s1');
      });

      it('correctly parses the common place name', () => {
        // eslint-disable-next-line no-unused-expressions
        expect(address.common_place_name).to.be.undefined;
      });

      it('correctly parses the battalion', () => {
        expect(address.battalion).to.equal('B05');
      });

      it('correctly parses the elevation', () => {
        expect(address.elevation).to.be.undefined;
      });

      it('correctly parses the neighborhood', () => {
        expect(address.neighborhood).to.equal('Haight Ashbury');
      });
    });

    describe('correctly parses the description', () => {
      let description;

      before(() => {
        description = b05.normalizeDescription();
      });

      it('correctly parses the priority', () => {
        expect(description.priority).to.be.equal('3');
      });

      it('correctly parses the event open time', () => {
        expect(description.event_opened).to.equal('2017-06-23T20:33:40-07:00');
      });

      it('correctly parses the event type', () => {
        expect(description.type).to.equal('Alarms');
      });

      it('correctly parses the incident number', () => {
        expect(description.incident_number).to.equal('17073664');
      });

      it('correctly parses the event close time', () => {
        expect(description.event_closed).to.equal('2017-06-23T20:35:46-07:00');
      });

      it.skip('correctly parses the shift', () => {
        expect(description.shift).to.be.equal('A');
      });

      it('correctly parses the event subtype', () => {
        expect(description.subtype).to.equal('Alarm');
      });

      it('correctly parses the event category', () => {
        expect(description.category).to.equal('FIRE');
      });

      it('correctly parses the hour of day', () => {
        expect(description.hour_of_day).to.equal(20);
      });

      it('correctly parses the day of the week', () => {
        expect(description.day_of_week).to.equal('Friday');
      });

      it('correctly parses the alarm', () => {
        expect(description.alarms).to.equal(1);
      });

      it('correctly parses loss_stopped', () => {
        expect(description.loss_stopped).to.be.undefined;
      });

      it('correctly parses the psap answer time', () => {
        expect(description.psap_answer_time).to.equal('2017-06-23T20:30:09-07:00');
      });

      it('correctly parses the event id', () => {
        expect(description.event_id).to.equal('171743725');
      });

      it('correctly parses the comments', () => {
        expect(description.comments).to.be.undefined;
      });
    });

    describe('correctly parses the apparatus', () => {
      let b05a, e05a, e06a, t06a;

      before(() => {
        b05a = b05.normalizeApparatus()[0];
        e05a = e05.normalizeApparatus()[0];
        e06a = e06.normalizeApparatus()[0];
        t06a = t06.normalizeApparatus()[0];
      });

      it.skip('correctly parses the shift of the apparatus', () => {
        expect(t06.shift).to.equal('A');
        expect(e06.shift).to.equal('A');
        expect(e05.shift).to.equal('A');
      });

      it.skip('correctly parses the unit\'s station', () => {
         expect(t06.station).to.equal('FSTA23');
         expect(e06.station).to.equal('FSTA17');
         expect(e05.station).to.equal('FSTA13');
      });

      it('correctly parses the unit\'s type', () => {
        expect(b05a.unit_type).to.equal('Chief Officer');
        expect(e06a.unit_type).to.equal('Engine');
        expect(e05a.unit_type).to.equal('Engine');
        expect(t06a.unit_type).to.equal('Truck/Aerial');
      });

      it('correctly parses the unit\'s dispatch time', () => {
        expect(b05a.unit_status.dispatched.timestamp).to.equal('2017-06-23T20:34:06-07:00');
        expect(e05a.unit_status.dispatched.timestamp).to.equal('2017-06-23T20:37:59-07:00');
        expect(e06a.unit_status.dispatched.timestamp).to.equal('2017-06-23T20:34:06-07:00');
        expect(t06a.unit_status.dispatched.timestamp).to.equal('2017-06-23T20:34:06-07:00');
      });

      it('correctly parses the unit\'s enroute time', () => {
        expect(b05a.unit_status.enroute).to.be.undefined;
        expect(e05a.unit_status.enroute.timestamp).to.equal('2017-06-23T20:37:59-07:00');
        expect(e06a.unit_status.enroute.timestamp).to.equal('2017-06-23T20:36:08-07:00');
        expect(t06a.unit_status.enroute).to.be.undefined;
      });

      it('correctly parses the unit\'s arrival time', () => {
        expect(b05a.unit_status.arrived).to.be.undefined;
        expect(e05a.unit_status.arrived.timestamp).to.equal('2017-06-23T20:41:38-07:00');
        expect(e06a.unit_status.arrived).to.be.undefined;
        expect(t06a.unit_status.arrived).to.be.undefined;
      });

      it('correctly parses the unit\'s available time', () => {
        expect(b05a.unit_status.available.timestamp).to.equal('2017-06-23T20:35:46-07:00');
        expect(e05a.unit_status.available.timestamp).to.equal('2017-06-23T20:53:27-07:00');
        expect(e06a.unit_status.available.timestamp).to.equal('2017-06-23T20:37:59-07:00');
        expect(t06a.unit_status.available.timestamp).to.equal('2017-06-23T20:35:46-07:00');
      });

      it('correctly parses a unit\'s personnel', () => {
        expect(b05a.personnel).to.be.undefined;
        expect(e05a.personnel).to.be.undefined;
        expect(e06a.personnel).to.be.undefined;
        expect(t06a.personnel).to.be.undefined;
      });

      it('correctly parses the extended data', () => {
        expect(e05a.extended_data.turnout_duration).to.equal(0);
        expect(e05a.extended_data.travel_duration).to.equal(219);
        expect(e05a.extended_data.response_duration).to.equal(219);
        expect(e05a.extended_data.event_duration).to.equal(928);
      });
    });
  });
});
