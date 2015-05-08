var request = require('superagent');

module.exports = {
	sendNotificationToDoorOwner: function (user, door, enteredOrExited)
	{
		request
			.post('https://push.ionic.io/api/v1/push')
			.send({
				"tokens": door.GCM_tokens,
				"notification": {
					"alert": user.email + " just " + enteredOrExited + " door " + door.custom_name,
					"android": {
						"collapseKey": "foo",
						"delayWhileIdle": true,
						"timeToLive": 300
					}
				}
			})
			.set('Content-Type', 'application/json')
			.set('X-Ionic-Application-Id', 'ab72c49a')
			.set('Authorization', 'Basic OTAyMjc1MjliZmJiZjE1ZDA5ZjBiY2JjZjUzMTA4ZTkxYTZmOGIxNGJkNzk0Y2U0Og==')
			.end(function (err, res)
			{
				if (err)
				{
					console.log(err);
				}
				else
				{
					console.log(res);
				}
			});
	},
	turnOnTV: function ()
	{
		console.log('TV turned on');
	},
	turnOffTV: function ()
	{
		console.log('TV turned off');
	},
	turnOnLight: function ()
	{
		console.log('Light turned on');
	},
	turnOffLight: function ()
	{
		console.log('Light turned off');
	}
};