import { expect } from 'chai';
import path from 'path';
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
    let sf;

    before(() => FireIncident.fromFile(path.join(__dirname, './data/17073664.json')).then((res) => { sf = res; }));

    describe('correctly parses the department', () => {
      let department;

      before(() => {
        department = sf.normalizeFireDepartment();
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
        address = sf.normalizeAddress();
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
        description = sf.normalizeDescription();
      });

      it('correctly parses the priority', () => {
        expect(description.priority).to.be.equal('3');
      });

      it('correctly parses the event open time', () => {
        //2017-06-23T20:33:40.000
        expect(description.event_opened).to.equal('2017-06-23T20:33:40-07:00');
      });

      it('correctly parses the event type', () => {
        expect(description.type).to.equal('Alarm');
      });

      it('correctly parses the incident number', () => {
        expect(description.incident_number).to.equal('17073664');
      });

      it('correctly parses the units', () => {
        expect(description.units).to.eql(['B05', 'T06', 'E05', 'E06']);
      });

      it('correctly parses the event close time', () => {
        expect(description.event_closed).to.equal('2017-06-23T20:53:27-07:00');
      });

      it.skip('correctly parses the shift', () => {
        expect(description.shift).to.be.equal('A');
      });

      it('correctly parses the event subtype', () => {
        expect(description.subtype).to.equal('Alarms');
      });

      it('correctly parses the first unit dispatch time', () => {
        // eslint-disable-next-line no-unused-expressions
        expect(description.first_unit_dispatched).to.equal('2017-06-23T20:34:06-07:00');
      });

      // TODO
      it('correctly parses the first unit enroute time', () => {
        expect(description.first_unit_enroute).to.equal('2017-06-23T20:36:08-07:00');
      });

      it('correctly parses the first unit arrival time', () => {
        expect(description.first_unit_arrived).to.be.equal('2017-06-23T20:41:38-07:00');
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

      it('correctly parses the extended data', () => {
        expect(description.extended_data.response_duration).to.equal(452);
        expect(description.extended_data.event_duration).to.equal(1187);
      });
    });

    describe('correctly parses the apparatus', () => {
      let apparatus;
      let t06;
      let e06;
      let e05;
      let b05;

      before(() => {
        apparatus = sf.normalizeApparatus();
        t06 = apparatus.find(app => app.unit_id === 'T06');
        e06 = apparatus.find(app => app.unit_id === 'E06');
        e05 = apparatus.find(app => app.unit_id === 'E05');
        b05 = apparatus.find(app => app.unit_id === 'B05');
      });

      it.skip('correctly parses the shift of the apparatus', () => {
        expect(t06.shift).to.equal('A');
        expect(e06.shift).to.equal('A');
        expect(e05.shift).to.equal('A');
      });

      it.skip('correctly parses the unit\'s station', () => {
      //   expect(t06.station).to.equal('FSTA23');
      //   expect(e06.station).to.equal('FSTA17');
      //   expect(e05.station).to.equal('FSTA13');
      });

      it('correctly parses the unit\'s type', () => {
        expect(t06.unit_type).to.equal('Truck/Aerial');
        expect(e06.unit_type).to.equal('Engine');
        expect(e05.unit_type).to.equal('Engine');
        expect(b05.unit_type).to.equal('Chief Officer');
      });

      it('correctly parses the unit\'s dispatch time', () => {
        expect(t06.unit_status.dispatched.timestamp).to.equal('2017-06-23T20:34:06-07:00');
        expect(e06.unit_status.dispatched.timestamp).to.equal('2017-06-23T20:34:06-07:00');
        expect(e05.unit_status.dispatched.timestamp).to.equal('2017-06-23T20:37:59-07:00');
      });

      it('correctly parses the unit\'s enroute time', () => {
        expect(t06.unit_status.enroute).to.be.undefined;
        expect(e06.unit_status.enroute.timestamp).to.equal('2017-06-23T20:36:08-07:00');
        expect(e05.unit_status.enroute.timestamp).to.equal('2017-06-23T20:37:59-07:00');
      });

      it('correctly parses the unit\'s arrival time', () => {
        expect(t06.unit_status.arrived).to.be.undefined;
        expect(e06.unit_status.arrived).to.be.undefined;
        expect(e05.unit_status.arrived.timestamp).to.be.equal('2017-06-23T20:41:38-07:00');
      });

      it('correctly parses the unit\'s available time', () => {
        expect(t06.unit_status.available.timestamp).to.equal('2017-06-23T20:35:46-07:00');
        expect(e06.unit_status.available.timestamp).to.equal('2017-06-23T20:37:59-07:00');
        expect(e05.unit_status.available.timestamp).to.equal('2017-06-23T20:53:27-07:00');
      });

      it('correctly parses a unit\'s personnel', () => {
        expect(t06.personnel).to.be.undefined;
        expect(e06.personnel).to.be.undefined;
        expect(e05.personnel).to.be.undefined;
      });

      it('correctly parses the extended data', () => {
        expect(e05.extended_data.turnout_duration).to.equal(0);
        expect(e05.extended_data.travel_duration).to.equal(219);
        expect(e05.extended_data.response_duration).to.equal(219);
        expect(e05.extended_data.event_duration).to.equal(928);
      });
    });
  });
});
