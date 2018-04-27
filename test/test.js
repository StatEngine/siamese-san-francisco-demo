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
    });

    describe('correctly parses the description', () => {
      let description;

      before(() => {
        description = sf.normalizeDescription();
      });

      it('correctly parses the priorityDispatch', () => {
        expect(description.shift).to.be.equal('3');
      });

      it('correctly parses the event open time', () => {
        expect(description.event_opened).to.equal('2017-12-13T07:46:46-07:00');
      });

      it('correctly parses the event type', () => {
        expect(description.type).to.equal('ME');
      });

      it('correctly parses the incident number', () => {
        expect(description.incident_number).to.equal('F173470056');
      });

      it('correctly parses the event close time', () => {
        expect(description.event_closed).to.equal('2017-12-13T08:41:12-07:00');
      });

      it('correctly parses the shift', () => {
        expect(description.shift).to.be.equal('A');
      });

      it('correctly parses the event subtype', () => {
        expect(description.subtype).to.equal('SCA');
      });

      it('correcty parses the units', () => {
        expect(description.units.length).to.equal(3);
        expect(description.units).to.include('EN021');
        expect(description.units).to.include('PM016');
        expect(description.units).to.include('PM049');
      });

      it('correctly parses the first unit dispatch time', () => {
        // eslint-disable-next-line no-unused-expressions
        expect(description.first_unit_dispatched).to.equal('2017-12-13T07:46:49-07:00');
      });

      // TODO
      it('correctly parses the first unit enroute time', () => {
        expect(description.first_unit_enroute).to.equal('2017-12-13T07:48:05-07:00');
      });

      it('correctly parses the first unit arrival time', () => {
        expect(description.first_unit_arrived).to.be.equal('2017-12-13T07:52:04-07:00');
      });

      it('correctly parses the hour of day', () => {
        expect(description.hour_of_day).to.equal(7);
      });

      it('correctly parses the day of the week', () => {
        expect(description.day_of_week).to.equal('Wednesday');
      });

      it('correctly parses the alarm', () => {
        expect(description.alarms).to.equal(1);
      });

      it('correctly parses loss_stopped', () => {
        expect(description.loss_stopped).to.be.null;
      });

      it('correctly parses the psap answer time', () => {
        expect(description.psap_answer_time).to.equal('2017-12-13T07:46:08-07:00');
      });

      it('correctly parses the event id', () => {
        expect(description.event_id).to.equal('3101996');
      });

      it('correctly parses the comments', () => {
        expect(description.comments).to.be.undefined;
      });

      it('correctly parses the extended data', () => {
        expect(description.extended_data.response_duration).to.equal(315);
        expect(description.extended_data.event_duration).to.equal(3266);
        expect(description.extended_data.AgencyIncidentCallType).to.equal('6M1');
        expect(description.extended_data.AgencyIncidentCallTypeDescription).to.equal('CARDIAC ARREST - UNC OR NOT BREATHING NORMALLY');
      });
    });

    describe.skip('correctly parses the apparatus', () => {
      let apparatus;
      let e21;
      let pm16;
      let pm49;

      before(() => {
        apparatus = sf.normalizeApparatus();
        e21 = apparatus.find(app => app.unit_id === 'EN021');
        pm16 = apparatus.find(app => app.unit_id === 'PM016');
        pm49 = apparatus.find(app => app.unit_id === 'PM049');
      });

      it('correctly parses the shift of the apparatus', () => {
        expect(e21.shift).to.equal('A');
        expect(pm16.shift).to.equal('A');
        expect(pm49.shift).to.equal('A');
      });

      it('correctly parses the car id of an apparatus', () => {
        expect(e21.car_id).to.equal('8794');
        expect(pm16.car_id).to.equal('8851');
        expect(pm49.car_id).to.equal('8848');
      });

      it.skip('correctly parses the unit\'s station', () => {
      //   expect(e21.station).to.equal('FSTA23');
      //   expect(pm16.station).to.equal('FSTA17');
      //   expect(pm49.station).to.equal('FSTA13');
      });

      it('correctly parses the unit\'s type', () => {
        expect(e21.unit_type).to.equal('Engine');
        expect(pm16.unit_type).to.equal('ALS');
        expect(pm49.unit_type).to.equal('ALS');
      });

      it('correctly parses the unit\'s dispatch time', () => {
        expect(e21.unit_status.dispatched.timestamp).to.equal('2017-12-13T07:46:50-07:00');
        expect(pm16.unit_status.dispatched.timestamp).to.equal('2017-12-13T07:47:51-07:00');
        expect(pm49.unit_status.dispatched.timestamp).to.equal('2017-12-13T07:46:51-07:00');
      });

      it('correctly parses the unit\'s enroute time', () => {
        expect(e21.unit_status.enroute.timestamp).to.equal('2017-12-13T07:48:31-07:00');
        expect(pm16.unit_status.enroute.timestamp).to.equal('2017-12-13T07:50:18-07:00');
        expect(pm49.unit_status.enroute.timestamp).to.equal('2017-12-13T07:48:05-07:00');
      });

      it('correctly parses the unit\'s arrival time', () => {
        expect(e21.unit_status.arrived.timestamp).to.equal('2017-12-13T07:52:04-07:00');
        expect(pm16.unit_status.arrived.timestamp).to.equal('2017-12-13T07:53:47-07:00');
        expect(pm49.unit_status.arrived).to.be.undefined;
      });

      it('correctly parses the unit\'s available time', () => {
        expect(e21.unit_status.available.timestamp).to.equal('2017-12-13T08:41:12-07:00');
        expect(pm16.unit_status.available.timestamp).to.equal('2017-12-13T07:54:29-07:00');
        expect(pm49.unit_status.available.timestamp).to.equal('2017-12-13T07:49:24-07:00');
      });

      it('correctly parses a unit\'s personnel', () => {
        expect(e21.personnel).to.be.undefined;
        expect(pm16.personnel).to.be.undefined;
        expect(pm49.personnel).to.be.undefined;
      });

      it('correctly parses the extended data', () => {
        expect(e21.extended_data.turnout_duration).to.equal(101);
        expect(e21.extended_data.travel_duration).to.equal(213);
        expect(e21.extended_data.response_duration).to.equal(314);
        expect(e21.extended_data.event_duration).to.equal(3262);
      });
    });
  });
});
