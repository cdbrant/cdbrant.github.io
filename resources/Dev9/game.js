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

// Constants and variables
var mainTimerID;
var timer = 10
var tick_count = 0
var net_position = 2
var randY = 2
var caughtFish = 0
var wave_state = 0
var net_state = 0
var armor = 0
var net_enhanced = 0
var active_Fish = []
var active_Bombs = []
var active_Armor = []
var active_PowerNet = []

function draw_background() {
	PS.color( PS.ALL, PS.ALL, PS.COLOR_BLUE )
	PS.color( PS.ALL, 11, PS.COLOR_YELLOW )
	PS.color( PS.ALL, 0, PS.COLOR_WHITE )
}

function draw_net() {
	if ( net_enhanced > 0) {
		PS.color( 1, net_position, PS.COLOR_GRAY );
		PS.glyph( 1, net_position, 0x1F945 );
		PS.color( 1, ( net_position - 1 ), PS.COLOR_GRAY );
		PS.glyph( 1, ( net_position - 1), 0x1F945 );
		if ( net_position > 3) {
			PS.color( 1, ( net_position - 2 ), PS.COLOR_BLUE );
			PS.glyph( 1, ( net_position - 2), 0x0049 );
		}
		if ( net_position < 10 ) {
			PS.color( 1, ( net_position + 1 ), PS.COLOR_GRAY );
			PS.glyph( 1, ( net_position + 1), 0x1F945 );
			if (net_position < 9) {
				PS.color( 1, ( net_position + 2 ), PS.COLOR_BLUE );
				PS.glyph( 1, ( net_position + 2), 0 );
			}
		}
	}
	else {
		PS.color( 1, net_position, PS.COLOR_GRAY );
		PS.glyph( 1, net_position, 0x1F945 );
		PS.color( 1, ( net_position - 1 ), PS.COLOR_BLUE );
		PS.glyph( 1, ( net_position - 1), 0x0049 );
		if ( net_position < 10 ) {
			PS.color( 1, ( net_position + 1 ), PS.COLOR_BLUE );
			PS.glyph( 1, ( net_position + 1), 0 );
		}
	}
	
}

function draw_fish() {
	randY = getRandom( 2, 10 );
	for ( let i = 0; i < active_Fish.length; i += 1 ) {
		let pos = active_Fish[ i ]
		let x = pos[ 0 ]
		let y = pos[ 1 ]
		PS.glyph( x, y, 0 );
		active_Fish.splice(active_Fish.indexOf( [x, y] ), 1);
		if ( x == 2 ) {
			if ( y == net_position ) {
				PS.audioPlay( "fx_squish" );
				caughtFish += 1
				return
			}
			if ( net_enhanced > 0 ) {
				if ( y == (net_position + 1) ) {
					PS.audioPlay( "fx_squish" );
					caughtFish += 1
					return
				}
				if ( y == (net_position - 1) ) {
					PS.audioPlay( "fx_squish" );
					caughtFish += 1
					return
				}
			}
		}
		if ( x > 0 ) {
			PS.glyph( (x - 1), y, 0x1F420 )
			active_Fish.push( [(x - 1), y] );
		}
	}
	if ( active_Fish.length == 0 ) {
		PS.glyph( 11, randY, 0x1F420 )
		active_Fish.push( [11, randY] );
	}
}

function draw_waves() {
	if ( wave_state == 0 ) {
		PS.color(0, 1, PS.COLOR_WHITE);
		PS.color(1, 1, PS.COLOR_WHITE);
		PS.color(2, 1, PS.COLOR_BLUE);
		PS.color(3, 1, PS.COLOR_BLUE);
		PS.color(4, 1, PS.COLOR_WHITE);
		PS.color(5, 1, PS.COLOR_WHITE);
		PS.color(6, 1, PS.COLOR_BLUE);
		PS.color(7, 1, PS.COLOR_BLUE);
		PS.color(8, 1, PS.COLOR_WHITE);
		PS.color(9, 1, PS.COLOR_WHITE);
		PS.color(10, 1, PS.COLOR_BLUE);
		PS.color(11, 1, PS.COLOR_BLUE);
		wave_state = 1
	}
	else {
		PS.color(0, 1, PS.COLOR_BLUE);
		PS.color(1, 1, PS.COLOR_BLUE);
		PS.color(2, 1, PS.COLOR_WHITE);
		PS.color(3, 1, PS.COLOR_WHITE);
		PS.color(4, 1, PS.COLOR_BLUE);
		PS.color(5, 1, PS.COLOR_BLUE);
		PS.color(6, 1, PS.COLOR_WHITE);
		PS.color(7, 1, PS.COLOR_WHITE);
		PS.color(8, 1, PS.COLOR_BLUE);
		PS.color(9, 1, PS.COLOR_BLUE);
		PS.color(10, 1, PS.COLOR_WHITE);
		PS.color(11, 1, PS.COLOR_WHITE);
		wave_state = 0
	}
}

function draw_bombs() {
	randY = getRandom( 2, 10 );
	for ( let i = 0; i < active_Bombs.length; i += 1 ) {
		let pos = active_Bombs[ i ]
		let x = pos[ 0 ]
		let y = pos[ 1 ]
		PS.glyph( x, y, 0 );
		active_Bombs.splice(active_Bombs.indexOf( [x, y] ), 1);
		if ( x == 2 ) {
			if ( y == net_position ) {
				if ( armor == 0 ) {
					PS.audioPlay( "fx_bang" );
					caughtFish = 0
					tick_count = 0
					return
				}
				else {
					PS.audioPlay( "fx_bang" );
					armor -= 1
					return
				}
			}
			if ( net_enhanced > 0 ) {
				if ( y == (net_position + 1) ) {
					if ( armor == 0 ) {
						PS.audioPlay( "fx_bang" );
						caughtFish = 0
						tick_count = 0
						return
					}
					else {
						PS.audioPlay( "fx_bang" );
						armor -= 1
						return
					}
				}
				if ( y == (net_position - 1) ) {
					if ( armor == 0 ) {
						PS.audioPlay( "fx_bang" );
						caughtFish = 0
						tick_count = 0
						return
					}
					else {
						PS.audioPlay( "fx_bang" );
						armor -= 1
						return
					}
				}
			}
		}
		if ( x > 0 ) {
			PS.glyph( (x - 1), y, 0x1F4A3 )
			active_Bombs.push( [(x - 1), y] );
		}
	}
	if ( active_Bombs.length == 0 ) {
		PS.glyph( 11, randY, 0x1F4A3 )
		active_Bombs.push( [11, randY] );
	}
}

function draw_armor() {
	randY = getRandom( 2, 10 );
	for ( let i = 0; i < active_Armor.length; i += 1 ) {
		let pos = active_Armor[ i ]
		let x = pos[ 0 ]
		let y = pos[ 1 ]
		PS.glyph( x, y, 0 );
		PS.color(x, y, PS.COLOR_BLUE)
		active_Armor.splice(active_Armor.indexOf( [x, y] ), 1);
		if ( x == 2 ) {
			if ( y == net_position ) {
				PS.audioPlay( "fx_bucket" );
				armor += 1
				return
			}
			if ( net_enhanced > 0 ) {
				if ( y == (net_position + 1) ) {
					PS.audioPlay( "fx_bucket" );
					armor += 1
					return
				}
				if ( y == (net_position - 1) ) {
					PS.audioPlay( "fx_bucket" );
					armor += 1
					return
				}
			}
		}
		if ( x > 0 ) {
			PS.glyph( (x - 1), y, 0x1F6E1 )
			PS.color((x - 1), y, PS.COLOR_GRAY)
			active_Armor.push( [(x - 1), y] );
		}
	}
	var randArmor = getRandom( 1, 50 );
	if (randArmor == 50 ) {
		if ( active_Armor.length == 0 ) {
			PS.color(11, randY, PS.COLOR_GRAY)
			PS.glyph( 11, randY, 0x1F6E1 )
			active_Armor.push( [11, randY] );
		}
	}
}

function draw_netUp() {
	randY = getRandom( 2, 10 );
	for ( let i = 0; i < active_PowerNet.length; i += 1 ) {
		let pos = active_PowerNet[ i ]
		let x = pos[ 0 ]
		let y = pos[ 1 ]
		PS.glyph( x, y, 0 );
		PS.color(x, y, PS.COLOR_BLUE)
		active_PowerNet.splice(active_PowerNet.indexOf( [x, y] ), 1);
		if ( x == 2 ) {
			if ( y == net_position ) {
				PS.audioPlay( "fx_pop" );
				net_enhanced = 150
				draw_net();
				return
			}
			if ( net_enhanced > 0 ) {
				if ( y == (net_position + 1) ) {
					PS.audioPlay( "fx_pop" );
					net_enhanced = 150
					draw_net();
					return
				}
				if ( y == (net_position - 1) ) {
					PS.audioPlay( "fx_pop" );
					net_enhanced = 150
					draw_net();
					return
				}
			}
		}
		if ( x > 0 ) {
			PS.glyph( (x - 1), y, 0x1F578 )
			PS.color((x - 1), y, PS.COLOR_WHITE)
			active_PowerNet.push( [(x - 1), y] );
		}
	}
	var randNet = getRandom( 1, 100 );
	if (randNet == 100 ) {
		if ( active_PowerNet.length == 0 ) {
			PS.color(11, randY, PS.COLOR_WHITE)
			PS.glyph( 11, randY, 0x1F578 )
			active_PowerNet.push( [11, randY] );
		}
	}
}

function getRandom( min, max ) { // Basic random integer function
	min = Math.ceil( min );
	max = Math.floor( max )
	return Math.floor( Math.random( ) * ( max - min + 1 ) ) + min;
}

function mainTimer() { 
	if ( timer > 0 ) {
		timer -= 1;
	}
	else { 
		PS.timerStop( mainTimerID );
		draw_waves();
		draw_fish();
		draw_bombs();
		draw_armor();
		draw_netUp();
		PS.statusText( "Fish Caught: " + JSON.stringify(caughtFish) + ", Armor: " + JSON.stringify(armor));
		tick_count += 1
		if ( tick_count <= 800 ){ 
		mainTimerID = PS.timerStart ( ( 10 - ( tick_count * 0.01 )), mainTimer );
		}
		if ( tick_count > 800 ){ 
		mainTimerID = PS.timerStart ( 2, mainTimer );
		}
		if ( net_enhanced > 0) {
			net_enhanced -= 1
		}
		//PS.debug( "Timer cycled\n" );
		//PS.debug( "Tick Count: " + JSON.stringify(tick_count) + "\n" );
	}
};

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

	PS.gridSize( 12, 12 );
	PS.border( PS.ALL, PS.ALL, 0);

	// This is also a good place to display
	// your game title or a welcome message
	// in the status line above the grid.
	// Uncomment the following code line and
	// change the string parameter as needed.

	PS.statusText( "Scroll to move your Net" );

	// Add any other initialization code you need here.
	// Glyph test function
	//PS.glyph( 0, 0, 0x1F420 )

	// Fish test function	
	PS.audioPlay( "fx_ding" );
	draw_background();
	draw_net();
	PS.glyph( 1, 0, 0x1F6A2 )
	PS.glyphScale( 1, 0, 100)
	mainTimerID = PS.timerStart ( 10, mainTimer );
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
	if ( key == PS.KEY_ARROW_UP ) {
		if ( net_enhanced > 0) {
					if ( net_position > 3 ) {
						net_position -= 1
						draw_net();
					}
				}
				else {
					if ( net_position > 2 ) {
						net_position -= 1
						draw_net();
					}
				}
	}
	if ( key == PS.KEY_ARROW_DOWN ) {
		if ( net_enhanced > 0 ) {
					if ( net_position < 9 ) {
						net_position += 1
						draw_net();
					}
				}
				else {
					if ( net_position < 10 ) {
						net_position += 1
						draw_net();
					}
				}
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
	// Report mouse wheel events in status line

	PS.input = function( device, options ) {
 		var event;

 		event = device.wheel;
 		if ( event ) {
 			if ( event === PS.WHEEL_FORWARD ) {
 				//PS.debug( "Wheel scrolled forward\n" );
				if ( net_enhanced > 0) {
					if ( net_position > 3 ) {
						net_position -= 1
						draw_net();
					}
				}
				else {
					if ( net_position > 2 ) {
						net_position -= 1
						draw_net();
					}
				}
 			}
 			else if ( event === PS.WHEEL_BACKWARD ) {
 				//PS.debug( "Wheel scrolled backward\n" );
				if ( net_enhanced > 0 ) {
					if ( net_position < 9 ) {
						net_position += 1
						draw_net();
					}
				}
				else {
					if ( net_position < 10 ) {
						net_position += 1
						draw_net();
					}
				}
 			}
 		}
	};
};


