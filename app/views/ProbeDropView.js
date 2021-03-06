/**
 * @author Serge Babayan
 * @module views/ProbeDropView
 * @requires models/Commands
 * @requires util/Bitmask
 * @requires util/Logger
 * @requires models/TelemetryData
 * @requires util/Validator
 * @requires util/Template
 * @requires electron
 * @copyright Waterloo Aerial Robotics Group 2016
 * @licence https://raw.githubusercontent.com/UWARG/WARG-Ground-Station/master/LICENSE
 * @description View that allows a user to drop and reset the probes on the aircraft
 */

var remote = require('electron').remote;
var Commands = remote.require('./app/models/Commands');
var TelemetryData = remote.require('./app/models/TelemetryData');
var Bitmask = require('../util/Bitmask');
var Logger = remote.require('./app/util/Logger');
var Validator = require('../util/Validator');
var Template = require('../util/Template');

module.exports = function (Marionette) {

  return Marionette.ItemView.extend({
    template: Template('ProbeDropView'),
    className: 'exampleView',

    ui: {
      probe1_status: '#probe1-status',
      probe2_status: '#probe2-status',
      probe3_status: '#probe3-status'
    },

    events: {
      'click #drop-probe-1-button': 'dropProbe1',
      'click #drop-probe-2-button': 'dropProbe2',
      'click #drop-probe-3-button': 'dropProbe3',
      'click #reset-probe-1-button': 'resetProbe1',
      'click #reset-probe-2-button': 'resetProbe2',
      'click #reset-probe-3-button': 'resetProbe3'
    },

    initialize: function () {
      this.data_callback = null;
    },
    onRender: function () {
      this.data_callback = this.dataCallback.bind(this);
      TelemetryData.on('aircraft_status', this.data_callback);
    },

    onBeforeDestroy: function () {
      TelemetryData.removeListener('aircraft_status', this.data_callback);
    },

    dataCallback: function (data) {
      if (data.probe_status !== null) {
        var status = new Bitmask(data.probe_status);

        this.ui.probe1_status.text(status.getBit(0) ? 'Dropped' : 'Not Dropped');
        this.ui.probe2_status.text(status.getBit(1) ? 'Dropped' : 'Not Dropped');
        this.ui.probe3_status.text(status.getBit(2) ? 'Dropped' : 'Not Dropped');
      }
    },

    dropProbe1: function () {
      Commands.dropProbe(1);
    },
    dropProbe2: function () {
      Commands.dropProbe(2);
    },
    dropProbe3: function () {
      Commands.dropProbe(3);
    },
    resetProbe1: function () {
      Commands.resetProbe(1);
    },
    resetProbe2: function () {
      Commands.resetProbe(2);
    },
    resetProbe3: function () {
      Commands.resetProbe(3);
    }
  });
};