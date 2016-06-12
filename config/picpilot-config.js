var PersistentSettings=require('../app/util/PersistentSettings');

//Picpilot specific options and settings
var picpilot_config={
  command_password:"1234",
  heart_beat_timeout:5000 //how often to send the heartbeat in milliseconds
};

module.exports=new PersistentSettings('picpilot_config',picpilot_config);