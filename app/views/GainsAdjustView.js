var Template=require('../util/Template');
var TelemetryData=require('../models/TelemetryData');
var Commands=require('../models/Commands');
var Validator=require('../util/Validator');
var Logger=require('../util/Logger');

var gains_config=require('../../config/gains-config');

module.exports=function(Marionette){

  return Marionette.ItemView.extend({
    template:Template('GainsAdjustView'), 
    className:'gainsAdjustView', 

    ui:{
      yaw_kd:'#yaw-kd',
      yaw_ki:'#yaw-ki',
      yaw_kp:'#yaw-kp',
      pitch_kd:'#pitch-kd',
      pitch_ki:'#pitch-ki',
      pitch_kp:'#pitch-kp',
      roll_kd:'#roll-kd',
      roll_ki:'#roll-ki',
      roll_kp:'#roll-kp',
      heading_kd:'#heading-kd',
      heading_ki:'#heading-ki',
      heading_kp:'#heading-kp',
      altitude_kd:'#altitude-kd',
      altitude_ki:'#altitude-ki',
      altitude_kp:'#altitude-kp',
      throttle_kd:'#throttle-kd',
      throttle_ki:'#throttle-ki',
      throttle_kp:'#throttle-kp',
      flap_kd:'#flap-kd',
      flap_ki:'#flap-ki',
      flap_kp:'#flap-kp',
      orbit_kp:'#orbit-kp',
      path_kp:'#path-kp',

      send_all:'#send-all-gains-button',
      reset_all:'#reset-default-gains-button',
      yaw_send_button:'#send-yaw-gain-button',
      pitch_send_button:'#send-pitch-gain-button',
      roll_send_button:'#send-roll-gain-button',
      heading_send_button:'#send-heading-gain-button',
      altitude_send_button:'#send-altitude-gain-button',
      throttle_send_button:'#send-throttle-gain-button',
      flap_send_button:'#send-flap-gain-button',
      path_send_button:'#send-path-gain-button',
      orbit_send_button:'#send-orbit-gain-button'
    },

    events:{
      'click #send-all-gains-button':'sendAllGains',
      'click #save-all-gains-button':'saveChanges',
      'click #discard-all-gains-button':'discardChanges',
      'click #reset-default-gains-button':'resetToDefault',
      'click #send-yaw-gain-button':'sendYawGains',
      'click #send-pitch-gain-button':'sendPitchGains',
      'click #send-roll-gain-button':'sendRollGains',
      'click #send-heading-gain-button':'sendHeadingGains',
      'click #send-altitude-gain-button':'sendAltitudeGains',
      'click #send-throttle-gain-button':'sendThrottleGains',
      'click #send-flap-gain-button':'sendFlapGains',
      'click #send-orbit-gain-button':'sendOrbitalGains',
      'click #send-path-gain-button':'sendPathGains'
    },

    initialize: function(){
      this.needs_verifying={
        yaw: {
          status: false,
          ki: 0,
          kp: 0,
          kd: 0,
        },
        pitch: {
          status: false,
          ki: 0,
          kp: 0,
          kd: 0,
        },
        roll: {
          status: false,
          ki: 0,
          kp: 0,
          kd: 0,
        },
        heading: {
          status: false,
          ki: 0,
          kp: 0,
          kd: 0,
        },
        flap: {
          status: false,
          ki: 0,
          kp: 0,
          kd: 0,
        },
        orbit: {
          status: false,
          ki: 0,
          kp: 0,
          kd: 0,
        },
        path: {
          status: false,
          ki: 0,
          kp: 0,
          kd: 0,
        },
        throttle: {
          status: false,
          ki: 0,
          kp: 0,
          kd: 0,
        },
        altitude: {
          status: false,
          ki: 0,
          kp: 0,
          kd: 0,
        }   
      };
      this.data_callback=null;
    },

    onRender:function(){
      this.data_callback=this.dataCallback.bind(this);
      TelemetryData.addListener('data_received',this.data_callback);
      this.discardChanges(); //fills in the values from the settings
    },

    onBeforeDestroy:function(){
      TelemetryData.removeListener('data_received',this.data_callback);
    },

    normalizeData: function(data){
      data.yaw_kp=Number(data.yaw_kp);
      data.yaw_kd=Number(data.yaw_kd);
      data.yaw_ki=Number(data.yaw_ki);
      data.roll_kp=Number(data.roll_kp);
      data.roll_kd=Number(data.roll_kd);
      data.roll_ki=Number(data.roll_ki);
      data.pitch_kp=Number(data.pitch_kp);
      data.pitch_kd=Number(data.pitch_kd);
      data.pitch_ki=Number(data.pitch_ki);
      data.heading_kp=Number(data.heading_kp);
      data.heading_kd=Number(data.heading_kd);
      data.heading_ki=Number(data.heading_ki);
      data.flap_kp=Number(data.flap_kp);
      data.flap_kd=Number(data.flap_kd);
      data.flap_ki=Number(data.flap_ki);
      data.throttle_kp=Number(data.throttle_kp);
      data.throttle_kd=Number(data.throttle_kd);
      data.throttle_ki=Number(data.throttle_ki);
      data.altitude_kp=Number(data.altitude_kp);
      data.altitude_ki=Number(data.altitude_ki);
      data.altitude_kd=Number(data.altitude_kd);
      data.orbit_gain=Number(data.orbit_gain);
      data.path_gain=Number(data.path_gain);
    },

    dataCallback: function(data){
      this.normalizeData(data);
      console.log(this.needs_verifying.roll);
      console.log(data.roll_kp);
      console.log(data.roll_kd);
      console.log(data.roll_ki);
      if(this.needs_verifying.yaw.status){
        if(data.yaw_kp === this.needs_verifying.yaw.kp && data.yaw_ki === this.needs_verifying.yaw.ki && data.yaw_kd === this.needs_verifying.yaw.kd){
          this.needs_verifying.yaw.status=false;
          Logger.info('[Gains Adjust] Yaw gain successfully verified!');
          this.ui.yaw_send_button.text('Send');
        }
      }
      if(this.needs_verifying.pitch.status){
        if(data.pitch_kp === this.needs_verifying.pitch.kp && data.pitch_ki === this.needs_verifying.pitch.ki && data.pitch_kd === this.needs_verifying.pitch.kd){
          this.needs_verifying.pitch.status=false;
          Logger.info('[Gains Adjust] Pitch gain successfully verified!');
          this.ui.pitch_send_button.text('Send');
        }
      }
      if(this.needs_verifying.roll.status){
        if(data.roll_kp === this.needs_verifying.roll.kp && data.roll_ki === this.needs_verifying.roll.ki && data.roll_kd === this.needs_verifying.roll.kd){
          this.needs_verifying.roll.status=false;
          Logger.info('[Gains Adjust] Roll gain successfully verified!');
          this.ui.roll_send_button.text('Send');
        }
      }
      if(this.needs_verifying.heading.status){
        if(data.heading_kp === this.needs_verifying.heading.kp && data.heading_ki === this.needs_verifying.heading.ki && data.heading_kd === this.needs_verifying.heading.kd){
          this.needs_verifying.heading.status=false;
          Logger.info('[Gains Adjust] Heading gain successfully verified!');
          this.ui.heading_send_button.text('Send');
        }
      }
      if(this.needs_verifying.flap.status){
        if(data.flap_kp === this.needs_verifying.flap.kp && data.flap_ki === this.needs_verifying.flap.ki && data.flap_kd === this.needs_verifying.flap.kd){
          this.needs_verifying.flap.status=false;
          Logger.info('[Gains Adjust] Flap gain successfully verified!');
          this.ui.flap_send_button.text('Send');
        }
      }
      if(this.needs_verifying.orbit.status){
        if(data.orbit_gain === this.needs_verifying.orbit.kp){
          this.needs_verifying.orbit.status=false;
          Logger.info('[Gains Adjust] Orbit gain successfully verified!');
          this.ui.orbit_send_button.text('Send');
        }
      }
      if(this.needs_verifying.throttle.status){
        if(data.throttle_kp === this.needs_verifying.throttle.kp && data.throttle_ki === this.needs_verifying.throttle.ki && data.throttle_kd === this.needs_verifying.throttle.kd){
          this.needs_verifying.throttle.status=false;
          Logger.info('[Gains Adjust] Throttle gain successfully verified!');
          this.ui.throttle_send_button.text('Send');
        }
      }
      if(this.needs_verifying.altitude.status){
        if(data.altitude_kp === this.needs_verifying.altitude.kp && data.altitude_ki === this.needs_verifying.altitude.ki && data.altitude_kd === this.needs_verifying.altitude.kd){
          this.needs_verifying.altitude.status=false;
          Logger.info('[Gains Adjust] Altitude gain successfully verified!');
          this.ui.altitude_send_button.text('Send');
        }
      }
      if(this.needs_verifying.path.status){
        if(data.path_gain === this.needs_verifying.path.kp){
          this.needs_verifying.path.status=false;
          Logger.info('[Gains Adjust] Path gain successfully verified!');
          this.ui.path_send_button.text('Send');
        }
      }
    },

    sendYawGains: function(){
      var ki=Number(this.ui.yaw_ki.val());
      var kd=Number(this.ui.yaw_kd.val());
      var kp=Number(this.ui.yaw_kp.val());
      Commands.sendKPGain('yaw',kp);
      Commands.sendKIGain('yaw',ki);
      Commands.sendKDGain('yaw',kd);
      this.needs_verifying.yaw={
        status: true,
        ki: ki,
        kd: kd,
        kp: kp
      };
      this.ui.yaw_send_button.text('Verifying...');
    },
    sendPitchGains: function(){
      var ki=Number(this.ui.pitch_ki.val());
      var kd=Number(this.ui.pitch_kd.val());
      var kp=Number(this.ui.pitch_kp.val());
      Commands.sendKPGain('pitch',kp);
      Commands.sendKIGain('pitch',ki);
      Commands.sendKDGain('pitch',kd);
      this.needs_verifying.pitch={
        status: true,
        ki: ki,
        kd: kd,
        kp: kp
      };
      this.ui.pitch_send_button.text('Verifying...');
    },
    sendRollGains: function(){
      var ki=Number(this.ui.roll_ki.val());
      var kd=Number(this.ui.roll_kd.val());
      var kp=Number(this.ui.roll_kp.val());
      Commands.sendKPGain('roll',kp);
      Commands.sendKIGain('roll',ki);
      Commands.sendKDGain('roll',kd);
      this.needs_verifying.roll={
        status: true,
        ki: ki,
        kd: kd,
        kp: kp
      };
      console.log(this.needs_verifying);
      this.ui.roll_send_button.text('Verifying...');
    },
    sendHeadingGains: function(){
      var ki=Number(this.ui.heading_ki.val());
      var kd=Number(this.ui.heading_kd.val());
      var kp=Number(this.ui.heading_kp.val());
      Commands.sendKPGain('heading',kp);
      Commands.sendKIGain('heading',ki);
      Commands.sendKDGain('heading',kd);
      this.needs_verifying.heading={
        status: true,
        ki: ki,
        kd: kd,
        kp: kp
      };
      this.ui.heading_send_button.text('Verifying...');
    },
    sendAltitudeGains: function(){
      var ki=Number(this.ui.altitude_ki.val());
      var kd=Number(this.ui.altitude_kd.val());
      var kp=Number(this.ui.altitude_kp.val());
      Commands.sendKPGain('altitude',kp);
      Commands.sendKIGain('altitude',ki);
      Commands.sendKDGain('altitude',kd);
      this.needs_verifying.altitude={
        status: true,
        ki: ki,
        kd: kd,
        kp: kp
      };
      this.ui.altitude_send_button.text('Verifying...');
    },
    sendThrottleGains: function(){
      var ki=Number(this.ui.throttle_ki.val());
      var kd=Number(this.ui.throttle_kd.val());
      var kp=Number(this.ui.throttle_kp.val());
      Commands.sendKPGain('throttle',kp);
      Commands.sendKIGain('throttle',ki);
      Commands.sendKDGain('throttle',kd);
      this.needs_verifying.throttle={
        status: true,
        ki: ki,
        kd: kd,
        kp: kp
      };
      this.ui.throttle_send_button.text('Verifying...');
    },
    sendFlapGains: function(){
      var ki=Number(this.ui.flap_ki.val());
      var kd=Number(this.ui.flap_kd.val());
      var kp=Number(this.ui.flap_kp.val());
      Commands.sendKPGain('flap',kp);
      Commands.sendKIGain('flap',ki);
      Commands.sendKDGain('flap',kd);
      this.needs_verifying.flap={
        status: true,
        ki: ki,
        kd: kd,
        kp: kp
      };
      this.ui.flap_send_button.text('Verifying...');
    },
    sendOrbitalGains: function(){
      var kp=Number(this.ui.orbit_kp.val());
      Commands.sendOrbitGain(kp);
      this.needs_verifying.orbit={
        status: true,
        kp: kp
      };
      this.ui.orbit_send_button.text('Verifying...');
    },
    sendPathGains: function(){
      var kp=Number(this.ui.path_kp.val());
      Commands.sendPathGain(kp);
      this.needs_verifying.path={
        status: true,
        kp: kp
      };
      this.ui.path_send_button.text('Verifying...');
    },
    sendAllGains: function(){
      this.sendYawGains();
      this.sendPitchGains();
      this.sendRollGains();
      this.sendHeadingGains();
      this.sendAltitudeGains();
      this.sendThrottleGains();
      this.sendFlapGains();
      this.sendOrbitalGains();
      this.sendPathGains();
    },
    //saves the gain if its a valid number
    checkAndSaveGain: function(id,value){
      if(Validator.isValidNumber(value)){
        gains_config.set(id,Number(value));
      } 
      else{ 
        Logger.error('Did not save '+id+' gain as its not a valid number');
      }
    },

    saveChanges: function(){
      this.checkAndSaveGain('yaw_kd',this.ui.yaw_kd.val());
      this.checkAndSaveGain('yaw_ki',this.ui.yaw_ki.val());
      this.checkAndSaveGain('yaw_kp',this.ui.yaw_kp.val());
      this.checkAndSaveGain('pitch_kd',this.ui.pitch_kd.val());
      this.checkAndSaveGain('pitch_ki',this.ui.pitch_ki.val());
      this.checkAndSaveGain('pitch_kp',this.ui.pitch_kp.val());
      this.checkAndSaveGain('roll_kd',this.ui.roll_kd.val());
      this.checkAndSaveGain('roll_ki',this.ui.roll_ki.val());
      this.checkAndSaveGain('roll_kp',this.ui.roll_kp.val());
      this.checkAndSaveGain('heading_kd',this.ui.heading_kd.val());
      this.checkAndSaveGain('heading_ki',this.ui.heading_ki.val());
      this.checkAndSaveGain('heading_kp',this.ui.heading_kp.val());
      this.checkAndSaveGain('altitude_kd',this.ui.altitude_kd.val());
      this.checkAndSaveGain('altitude_ki',this.ui.altitude_ki.val());
      this.checkAndSaveGain('altitude_kp',this.ui.altitude_kp.val());
      this.checkAndSaveGain('throttle_kd',this.ui.throttle_kd.val());
      this.checkAndSaveGain('throttle_ki',this.ui.throttle_ki.val());
      this.checkAndSaveGain('throttle_kp',this.ui.throttle_kp.val());
      this.checkAndSaveGain('flap_kd',this.ui.flap_kd.val());
      this.checkAndSaveGain('flap_ki',this.ui.flap_ki.val());
      this.checkAndSaveGain('flap_kp',this.ui.flap_kp.val());
      this.checkAndSaveGain('orbit_kp',this.ui.orbit_kp.val());
      this.checkAndSaveGain('path_kp',this.ui.path_kp.val());
    },
    discardChanges: function(){
      this.ui.yaw_kd.val(gains_config.get('yaw_kd'));
      this.ui.yaw_ki.val(gains_config.get('yaw_ki'));
      this.ui.yaw_kp.val(gains_config.get('yaw_kp'));
      this.ui.pitch_kd.val(gains_config.get('pitch_kd'));
      this.ui.pitch_ki.val(gains_config.get('pitch_ki'));
      this.ui.pitch_kp.val(gains_config.get('pitch_kp'));
      this.ui.roll_kd.val(gains_config.get('roll_kd'));
      this.ui.roll_ki.val(gains_config.get('roll_ki'));
      this.ui.roll_kp.val(gains_config.get('roll_kp'));
      this.ui.heading_kd.val(gains_config.get('heading_kd'));
      this.ui.heading_ki.val(gains_config.get('heading_ki'));
      this.ui.heading_kp.val(gains_config.get('heading_kp'));
      this.ui.altitude_kd.val(gains_config.get('altitude_kd'));
      this.ui.altitude_ki.val(gains_config.get('altitude_ki'));
      this.ui.altitude_kp.val(gains_config.get('altitude_kp'));
      this.ui.throttle_kd.val(gains_config.get('throttle_kd'));
      this.ui.throttle_ki.val(gains_config.get('throttle_ki'));
      this.ui.throttle_kp.val(gains_config.get('throttle_kp'));
      this.ui.flap_kd.val(gains_config.get('flap_kd'));
      this.ui.flap_ki.val(gains_config.get('flap_ki'));
      this.ui.flap_kp.val(gains_config.get('flap_kp'));
      this.ui.orbit_kp.val(gains_config.get('orbit_kp'));
      this.ui.path_kp.val(gains_config.get('path_kp'));
    },
    resetToDefault:function(){
      this.ui.yaw_kd.val(gains_config.default_settings['yaw_kd']);
      this.ui.yaw_ki.val(gains_config.default_settings['yaw_ki']);
      this.ui.yaw_kp.val(gains_config.default_settings['yaw_kp']);
      this.ui.pitch_kd.val(gains_config.default_settings['pitch_kd']);
      this.ui.pitch_ki.val(gains_config.default_settings['pitch_ki']);
      this.ui.pitch_kp.val(gains_config.default_settings['pitch_kp']);
      this.ui.roll_kd.val(gains_config.default_settings['roll_kd']);
      this.ui.roll_ki.val(gains_config.default_settings['roll_ki']);
      this.ui.roll_kp.val(gains_config.default_settings['roll_kp']);
      this.ui.heading_kd.val(gains_config.default_settings['heading_kd']);
      this.ui.heading_ki.val(gains_config.default_settings['heading_ki']);
      this.ui.heading_kp.val(gains_config.default_settings['heading_kp']);
      this.ui.altitude_kd.val(gains_config.default_settings['altitude_kd']);
      this.ui.altitude_ki.val(gains_config.default_settings['altitude_ki']);
      this.ui.altitude_kp.val(gains_config.default_settings['altitude_kp']);
      this.ui.throttle_kd.val(gains_config.default_settings['throttle_kd']);
      this.ui.throttle_ki.val(gains_config.default_settings['throttle_ki']);
      this.ui.throttle_kp.val(gains_config.default_settings['throttle_kp']);
      this.ui.flap_kd.val(gains_config.default_settings['flap_kd']);
      this.ui.flap_ki.val(gains_config.default_settings['flap_ki']);
      this.ui.flap_kp.val(gains_config.default_settings['flap_kp']);
      this.ui.orbit_kp.val(gains_config.default_settings['orbit_kp']);
      this.ui.path_kp.val(gains_config.default_settings['path_kp']);

      this.saveChanges();
    }
  });
};