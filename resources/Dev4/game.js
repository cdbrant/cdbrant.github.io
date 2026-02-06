/*
game.js for Perlenspiel 3.3.x
Last revision: 2022-03-15 (BM)

Perlenspiel is a scheme by Professor Moriarty (bmoriarty@wpi.edu).
This version of Perlenspiel (3.3.x) is hosted at <https://ps3.perlenspiel.net>
Perlenspiel is Copyright © 2009-22 Brian Moriarty.
This file is part of the standard Perlenspiel 3.3.x devkit distribution.

Perlenspiel is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Perlenspiel is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Lesser General Public License for more details.

You may have received a copy of the GNU Lesser General Public License
along with the Perlenspiel devkit. If not, see <http://www.gnu.org/licenses/>.
*/

/*
This JavaScript file is a template for creating new Perlenspiel 3.3.x games.
Any unused event-handling function templates can be safely deleted.
Refer to the tutorials and documentation at <https://ps3.perlenspiel.net> for details.
*/

/*
The following comment lines are for JSHint <https://jshint.com>, a tool for monitoring code quality.
You may find them useful if your development environment is configured to support JSHint.
If you don't use JSHint (or are using it with a configuration file), you can safely delete these two lines.
*/

/* jshint browser : true, devel : true, esversion : 6, freeze : true */
/* globals PS : true */

"use strict"; // Do NOT remove this directive!

/*
PS.init( system, options )
Called once after engine is initialized but before event-polling begins.
This function doesn't have to do anything, although initializing the grid dimensions with PS.gridSize() is recommended.
If PS.grid() is not called, the default grid dimensions (8 x 8 beads) are applied.
Any value returned is ignored.
[system : Object] = A JavaScript object containing engine and host platform information properties; see API documentation for details.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

const walls_level_1 = [ [0, 4], [1, 4], [2, 4], [3, 4], [4, 4], [5, 4], [6, 4], [7, 4] ]; // Level 1 Data
const upper_level_1 = [ [0, 0], [0, 1], [1, 0], [5, 0], [6, 0], [7, 0], [2, 2], [5, 2], [6, 2], [7, 2], [1, 3], [2, 3], [3, 3], [6, 3] ];
const lower_level_1 = [];
const desired_level_1 = [ [0, 5], [0, 6], [1, 5], [1, 8], [2, 7], [2, 8], [3, 8], [5, 5], [5, 7], [6, 5], [6, 6], [6, 7], [6, 8], [7, 5] ]; // Solution

var index = 0
var level_complete = false
var current_level = 1

function drawWalls(list) {
	PS.color( PS.ALL, PS.ALL, PS.COLOR_BLACK )
	for ( let i = 0; i < list.length; i += 1 ) {
		let pos = list[ i ]
		let x = pos[ 0 ]
		let y = pos[ 1 ]
		PS.color( x, y, PS.COLOR_GRAY )
	}
}

function drawCells(list) {
	for ( let i = 0; i < list.length; i += 1 ) {
		let pos = list[ i ]
		let x = pos[ 0 ]
		let y = pos[ 1 ]
		PS.color( x, y, PS.COLOR_YELLOW )
	}
}

function loadLevel(level) {
	if (level = 1) {
		drawWalls( walls_level_1 );
		drawCells ( upper_level_1 );
		drawCells ( lower_level_1);
		// PS.debug("level 1 loaded\n")
	}
	
}

function compareArrays(array1, array2) {
    if (array1.length !== array2.length) return false;
	if (JSON.stringify(array1) === JSON.stringify(array2)) {
		return true;
	}
	else return false;
}

function flipCell(x, y) {
	if (PS.color( x, y ) == PS.COLOR_BLACK) {
		PS.color( x, y, PS.COLOR_YELLOW)
		lower_level_1.push( [x, y] )
		lower_level_1.sort();
		return lower_level_1
	}
	else if (PS.color( x, y ) == PS.COLOR_YELLOW) {
		PS.color( x, y, PS.COLOR_BLACK)
		if (index > -1) {
			lower_level_1.splice(lower_level_1.indexOf( [x, y] ), 1);
		}
		lower_level_1.sort();
		return lower_level_1
	}
	else if (PS.color( x, y ) == PS.COLOR_GRAY) {
		return
	}
	else {
		return
	}
}

PS.init = function( system, options ) {
	// Uncomment the following code line
	// to verify operation:

	// PS.debug( "PS.init() called\n" );

	// This function should normally begin
	// with a call to PS.gridSize( x, y )
	// where x and y are the desired initial
	// dimensions of the grid.
	// Call PS.gridSize() FIRST to avoid problems!
	// The sample call below sets the grid to the
	// default dimensions (8 x 8).
	// Uncomment the following code line and change
	// the x and y parameters as needed.

	PS.gridSize( 8, 9 );

	// This is also a good place to display
	// your game title or a welcome message
	// in the status line above the grid.
	// Uncomment the following code line and
	// change the string parameter as needed.

	PS.statusText( "Lightroom" );

	// Add any other initialization code you need here.
	upper_level_1.sort();
	desired_level_1.sort();
	loadLevel(current_level);
};

/*
PS.touch ( x, y, data, options )
Called when the left mouse button is clicked over bead(x, y), or when bead(x, y) is touched.
This function doesn't have to do anything. Any value returned is ignored.
[x : Number] = zero-based x-position (column) of the bead on the grid.
[y : Number] = zero-based y-position (row) of the bead on the grid.
[data : *] = The JavaScript value previously associated with bead(x, y) using PS.data(); default = 0.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.touch = function( x, y, data, options ) {
	// Uncomment the following code line
	// to inspect x/y parameters:

	// PS.debug( "PS.touch() @ " + x + ", " + y + "\n" );

	// Add code here for mouse clicks/touches
	// over a bead.
	if ( y > 4) {
		PS.audioPlay( "fx_tick" )
		flipCell( x, y );
		if (x > 0) {
			flipCell( (x - 1), y )
		} 
		if (x < 7) {
			flipCell( (x + 1), y )
		}
		if (y > 5) {
			flipCell(x, (y - 1) )
		}
		if (y < 8) {
			flipCell(x, (y + 1) )
		}
		// PS.debug(lower_level_1 + "\n")
	}
	else {
		PS.audioPlay( "fx_bloink" )
	}
	
	var level_complete = compareArrays( lower_level_1, desired_level_1 )
	// PS.debug("level complete:" + level_complete + "\n")

	if (level_complete == true) {
		PS.audioPlay("fx_tada");
		PS.color(PS.ALL, PS.ALL, PS.COLOR_GREEN);
		lower_level_1.length = 0
		let timer = PS.timerStart( 60, function () {
			PS.timerStop( timer )
			PS.color(PS.ALL, PS.ALL, PS.COLOR_BLACK);
			loadLevel(current_level);
		})
	}
	
};

/*
PS.release ( x, y, data, options )
Called when the left mouse button is released, or when a touch is lifted, over bead(x, y).
This function doesn't have to do anything. Any value returned is ignored.
[x : Number] = zero-based x-position (column) of the bead on the grid.
[y : Number] = zero-based y-position (row) of the bead on the grid.
[data : *] = The JavaScript value previously associated with bead(x, y) using PS.data(); default = 0.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.release = function( x, y, data, options ) {
	// Uncomment the following code line to inspect x/y parameters:

	// PS.debug( "PS.release() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse button/touch is released over a bead.
};

/*
PS.enter ( x, y, button, data, options )
Called when the mouse cursor/touch enters bead(x, y).
This function doesn't have to do anything. Any value returned is ignored.
[x : Number] = zero-based x-position (column) of the bead on the grid.
[y : Number] = zero-based y-position (row) of the bead on the grid.
[data : *] = The JavaScript value previously associated with bead(x, y) using PS.data(); default = 0.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.enter = function( x, y, data, options ) {
	// Uncomment the following code line to inspect x/y parameters:

	// PS.debug( "PS.enter() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse cursor/touch enters a bead.
};

/*
PS.exit ( x, y, data, options )
Called when the mouse cursor/touch exits bead(x, y).
This function doesn't have to do anything. Any value returned is ignored.
[x : Number] = zero-based x-position (column) of the bead on the grid.
[y : Number] = zero-based y-position (row) of the bead on the grid.
[data : *] = The JavaScript value previously associated with bead(x, y) using PS.data(); default = 0.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.exit = function( x, y, data, options ) {
	// Uncomment the following code line to inspect x/y parameters:

	// PS.debug( "PS.exit() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse cursor/touch exits a bead.
};

/*
PS.exitGrid ( options )
Called when the mouse cursor/touch exits the grid perimeter.
This function doesn't have to do anything. Any value returned is ignored.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.exitGrid = function( options ) {
	// Uncomment the following code line to verify operation:

	// PS.debug( "PS.exitGrid() called\n" );

	// Add code here for when the mouse cursor/touch moves off the grid.
};

/*
PS.keyDown ( key, shift, ctrl, options )
Called when a key on the keyboard is pressed.
This function doesn't have to do anything. Any value returned is ignored.
[key : Number] = ASCII code of the released key, or one of the PS.KEY_* constants documented in the API.
[shift : Boolean] = true if shift key is held down, else false.
[ctrl : Boolean] = true if control key is held down, else false.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.keyDown = function( key, shift, ctrl, options ) {
	// Uncomment the following code line to inspect first three parameters:

	// PS.debug( "PS.keyDown(): key=" + key + ", shift=" + shift + ", ctrl=" + ctrl + "\n" );

	// Add code here for when a key is pressed.
	if (key == 114) {
		PS.audioPlay("fx_pop")
		PS.color(PS.ALL, PS.ALL, PS.COLOR_BLACK);
		lower_level_1.length = 0
		loadLevel(current_level);
	}
};

/*
PS.keyUp ( key, shift, ctrl, options )
Called when a key on the keyboard is released.
This function doesn't have to do anything. Any value returned is ignored.
[key : Number] = ASCII code of the released key, or one of the PS.KEY_* constants documented in the API.
[shift : Boolean] = true if shift key is held down, else false.
[ctrl : Boolean] = true if control key is held down, else false.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.keyUp = function( key, shift, ctrl, options ) {
	// Uncomment the following code line to inspect first three parameters:

	// PS.debug( "PS.keyUp(): key=" + key + ", shift=" + shift + ", ctrl=" + ctrl + "\n" );

	// Add code here for when a key is released.
};

/*
PS.input ( sensors, options )
Called when a supported input device event (other than those above) is detected.
This function doesn't have to do anything. Any value returned is ignored.
[sensors : Object] = A JavaScript object with properties indicating sensor status; see API documentation for details.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
NOTE: Currently, only mouse wheel events are reported, and only when the mouse cursor is positioned directly over the grid.
*/

PS.input = function( sensors, options ) {
	// Uncomment the following code lines to inspect first parameter:

//	 var device = sensors.wheel; // check for scroll wheel
//
//	 if ( device ) {
//	   PS.debug( "PS.input(): " + device + "\n" );
//	 }

	// Add code here for when an input event is detected.
};

