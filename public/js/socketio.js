(function () {
	// Onload function for page
	document.onload = function (){
		// Init socket for socket.io
		var socket = io();
		socket.on('onRoomUpdate', roomUpdate(rs));
		socket.on('onError', socketError(err))
	};

	// Receives room update from server and updates local roomstate copy accordingly
	function roomUpdate(rs){
		alert("roomUpdate");
	}

	function socketError(err){
		alert(err);
	}

}());