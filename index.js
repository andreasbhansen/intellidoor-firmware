// External modules
var noble = require('noble');
var five = require('johnny-five');
var board = new five.Board();
var request = require('superagent');

// Internal modules
var DoorConnection = require('./modules/connection.js');
var integrations = require('./modules/integrations.js');

var IntelliDoorID = 'TikPnzpZfTMFXFvYH';

var allowedUUIDs = [];
var isInAction = false;

board.on('ready', function ()
{
	console.log('Board - internal door system - is ready.');

	DoorConnection.setApiKey('apiKey').listenToDoor(IntelliDoorID, function (door)
	{
		allowedUUIDs = [];

		for (var i = 0; i < door.users_with_access.length; i++)
		{
			var userObj = door.users_with_access[i];
			allowedUUIDs.push(userObj.UUID);
		}

		noble.startScanning(allowedUUIDs, true);

		noble.on('discover', function (peripheral)
		{
			if (!isInAction)
			{
				isInAction = true;
				var peripheralUUID = peripheral.advertisement.serviceUuids[0];

				console.log('Noble found peripheral with UUID', peripheralUUID);

				peripheral.connect(function (err)
				{
					if (err)
					{
						console.log('Connect Err', err);
					}

					console.log('Is UUID undefined?:', typeof peripheralUUID === 'undefined');
					if (typeof peripheralUUID === 'undefined')
					{
						peripheral.disconnect(function (err)
						{
							isInAction = false;
							console.log('UUID not found, disconnecting... err: ', err);
						});
					}
					else
					{
						console.log('Inside request');
						request
							.get('http://localhost:3000/api/check-door-access-for-uuid/' + IntelliDoorID + '/' + peripheralUUID)
							.end(function (err, res)
							{
								console.log('if error: ', err);

								console.log(res.body.message);
								if (res.body.message === "Open for UUID.")
								{

									console.log('Open door!');
									var led = new five.Led(13);
									led.on();

									setTimeout(function ()
									{
										peripheral.disconnect(function (err)
										{
											console.log('Disconnect Err', err);
											isInAction = false;
										});

										console.log('10s gone - Time\'s up, close the door!');
										led.off();
									}, 10000);

								}
							});
					}
				});
			}
		});

		console.log(allowedUUIDs);
		noble.startScanning(allowedUUIDs, true);
		console.log('Noble - BLE scanning system - is ready.');
		console.log('Noble - BLE scanning system - is scanning...');
	});

});