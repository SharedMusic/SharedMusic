var DEBUG = true;
var sets = require('simplesets');
var _ = require('underscore')._;

/**
 *	User represents the individual end user 
 *	@constructor
 */
exports.User = function (p_name, p_id, p_roomID) {
	this.name = p_name;
	this.id = p_id;
	this.roomID = p_roomID;
	this._addedTracks = [];
}
var UserPrototype = {
	// Adds a track to the list of user added tracks
	addTrack: function(track) {
		this._addedTracks.push(track);
	}
}
exports.User.prototype = UserPrototype;

/**
 * RoomState represents the current state of a room 
 * and is intended to be passed to clients for them
 * to update the views accordingly.
 * @constructor
 */
var RoomState = function (p_name) {
	this.name = p_name;
	this.users = new sets.Set();
	this.currentSongEpoch = -1;
	this.trackQueue = new Queue();
	this.bootVotes = new sets.Set();
}
exports.RoomState = RoomState;

/**
 * Room handles all relevant information for an individual
 * SharedMusic session and any operations that can be
 * performed to change session's state. 
 *  
 * @constructor
 */
exports.Room = function(p_name, p_id, p_onChange) {
	/**
	 *	The number of milliseconds between track being moved
	 *	to the head of the queue and when client should begin
	 *	playing that track.
	 */
	this._loadDelay = 2000;

	// Public
	this.id = p_id;
	this._state = new RoomState(p_name);
	this._onChange = p_onChange;
	this._songTimeout = null;
}
var RoomPrototype = {

	// Adds a user to the room
	addUser: function (user) {
		if(this._hasUser(user)) {
			this._onChange(null, 'User already exists in room!', user.id);
		} else {
			this._state.users.add(user);
			this._onChange(this._state, null, null);
		}
	},

	// _ prior denotes "private" functions
	_hasUser: function(user) {
		return this._state.users.has(user)
	},
	_removeUser: function(user) {
		return this._state.users.remove(user);
	},
	

	// Removes a user from the room
	removeUser: function (user) {
		if(this._hasUser(user)) {
			this._removeUser(user)
			this._onChange(this._state, null, null);
		} else {
			this._onChange(null, 'User didn\'t exist in room!', user.id);
		}
	},

	// Adds user's vote to boot the current song
	// if there is a song in the track queue.
	// If the boot count gets over half of the
	// users in the room then the next track
	// is requested and boot votes are cleared.
	// If the user has already voted for the song
	// then their vote is undone.
	bootTrack: function (user) {
		if(!this._checkUserExistsInRoom(user)) {
			return;
		}

		if(this._state.bootVotes.has(user.id)) {
			this._state.bootVotes.remove(user.id);
			this._onChange(this._state, null, null);
		} else if(!this._state.trackQueue.isEmpty()) {
			this._state.bootVotes.add(user.id);

			var boots = this._state.bootVotes.size()
			var limit = Math.ceil(this._state.users.size() / 2)
			if(boots >= limit) {
			   	clearTimeout(this._songTimeout);
					this.nextTrack();
			} else {
				this._onChange(this._state, null, null);
			}
		}
	},

	// Adds a given track to the room's track queue
	addTrack: function (user, track) {
		if(!this._checkUserExistsInRoom(user)) {
			return;
		}

		track.recommender = user.name;
		this._state.trackQueue.enqueue(track);
		user.addTrack(track);
		if (this._state.currentSongEpoch == -1) {
			if (DEBUG && this._state.trackQueue.getLength() != 1) {
				console.log('track queue was wrong length');
			}
			this._playSong(track);
		}

		this._onChange(this._state, null, null);
	},

	//play a given track
	_playSong: function(track) {			
		var now = (new Date).getTime()
		this._state.currentSongEpoch = now + this._loadDelay;
		var that = this;
		var timeoutDelay = track.duration + this._loadDelay;
		this._songTimeout = setTimeout(function(){
			that.nextTrack()
		}, timeoutDelay) ;
	},

	_checkUserExistsInRoom: function(user) {
		if(!this._hasUser(user)) {
			this._onChange(null, 'User doesn\'t exist in room', user.id);

			return false;
		}
		return true;
	},

	// Removes the head of the room's track queue
	// and clears any bootvotes for the song.
	nextTrack: function () {
		// The room might have been reaped :^)
		if(this._state != null) {
			this._state.bootVotes = new sets.Set();

			if(this._state.trackQueue.isEmpty()) {
				this._onChange(null, 'TrackQueue is empty!', null);
			} else {
				this._state.trackQueue.dequeue();
				if (this._state.trackQueue.isEmpty()) {
					this._state.currentSongEpoch = -1;
				} else {
					this._playSong(this._state.trackQueue.peek());
				}
				this._onChange(this._state, null, null);
			}
		}
	},

	//returns true is this room is empty
	isEmpty: function() {
		return this._state == null || this._state.users.size() == 0;
	},

	//close a room
	closeRoom: function() {
		this._state = null;
		this._onChange(null, null, null);
	},
	
	//returns a unique name so everyone in a room is unique.
	getUniqueName: function(possName) {
		var exists = false;
		var proposedName = possName;
		
		//set 'exists = true' if the name already exists in the room
		_.find(this._state.users.array(), function(key, value) {
			if(key.name.toLowerCase() === possName.toLowerCase()) {
				return exists = true;
			}
		});
		

		//if possName already exists, try a variation of that name
		if(exists) {
			var tries = 0;
			do {
				exists = false;
				tries++;
				var seed = Math.floor(Math.random()*1001);
				proposedName = possName + seed;

				//set 'exists = true' if the name already exists in the room
				//ps: purposefully didn't refactor this duplicate code into its own function
				//	  because use of 'this' room then becomes out of scope
				_.find(this._state.users.array(), function(key, value) {
					if(key.name.toLowerCase() === possName.toLowerCase()) {
						return exists = true;
					}
				});
				
			} while(exists && tries < 5);
			if (tries >= 5) {
				proposedName = "anony-mouse user";
			}
		}

		return proposedName;
	}
}
exports.Room.prototype = RoomPrototype;

//Queue data structure. 
function Queue() {
  var queue  = [];
  var offset = 0;

  this.getLength = function(){
    return (queue.length - offset);
  }

  this.isEmpty = function(){
    return (queue.length == 0);
  }

  this.enqueue = function(item){
    queue.push(item);
  }

  this.dequeue = function(){
    if (queue.length == 0) return undefined;

    var item = queue[offset];

    if (++ offset * 2 >= queue.length){
      queue  = queue.slice(offset);
      offset = 0;
    }

    return item;
  }

  this.getQueue = function(){
  	return queue.slice(offset, queue.length);
  }

  this.peek = function(){
    return (queue.length > 0 ? queue[offset] : undefined);
  }
}

exports.Queue = Queue;
