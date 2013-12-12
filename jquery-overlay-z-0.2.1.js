/**

 Overlay-Z v0.2.1
------------------

Produces an overlay which disables click actions on anything within the page,
supposing all page element z-indexes are below 9999.

Ability to customize the display of both the overlay as well as the content
area by passing an object of key/value pairs representing CSS styles.

 License
---------

The MIT License (MIT)

Copyright © 2013 Joshua D. Burns (JDBurnZ) and Message In Action LLC
- JDBurnZ: https://github.com/JDBurnZ
- Message In Action: https://www.messageinaction.com

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/

(function($) {
	$.overlayz = function(arg) {
		var arg_datatype = typeof arg;
		if(arg_datatype == 'string') {
			// If a string is passed, return an overlay with a
			// corresponding alias. If no overlay is found, returns
			// undefined.
			return $.overlayz._alias.lookup(arg);
		} else if(arg_datatype == 'object') {
			// If an object is passed, instantiate and return a new
			// overlay.
			return $.overlayz._new(arg);
		}
		// If some other data-type is passed other than string or object,
		// returns undefined.
	}

	// Mechanism for handling and storing overlays with aliases.
	$.overlayz._alias = {
		'overlays': {
			// Aliased overlays are stored within this object. Key is the
			// alias of the overlay, value is a reference to the instance
			// of the overlay itself.
		},
		'lookup': function(alias) {
			if(alias in $.overlayz._alias.overlays) {
				return $.overlayz._alias.overlays[alias];
			}
		},
		'add': function(alias, $overlay) {
			$.overlayz._alias.overlays[alias] = $overlay;
		},
		'remove': function(alias) {
			if(alias in this.overlays) {
				delete this.overlays[alias];
			}
		}
	};

	$.overlayz._new = function(options) {
		var $overlayz = $('<div class="overlayz"></div>')
			.css($.overlayz._css.container) // Apply the default CSS.
			.appendTo(document.body) // Append the overlay to <body>.
			.hide() // The overlay should be hidden by default.
			.append(
				$('<div class="overlayz-cell"></div>')
					.css($.overlayz._css.cell)
					.append(
						$('<div class="overlayz-body"></div>')
							.css($.overlayz._css.body)
					)
			)
		;

		$overlayz.overlayz = {
			'css': function(css) {
				console.log(css, $overlayz.children('.overlayz-body'));
				if('container' in css) {
					$overlayz.css(css.container);
				}
				if('cell' in css) {
					$overlayz.children('.overlayz-cell').css(css.cell);
				}
				if('body' in css) {
					$overlayz.children('.overlayz-cell').children('.overlayz-body').css(css.body);
				}
				return $overlayz;
			},
			'html': html = function(body) {
				$overlayz.children('.overlayz-cell').children('.overlayz-body').html(body);
				return $overlayz;
			},
			'close': function(animation, speed, callback) {
				if(animation == false) {
					$overlayz.hide();
				} else {
					if(speed == undefined) {
						speed = 'fast';
					}
					if(animation == undefined) {
						animation = 'fadeOut';
					}
					if(callback == undefined) {
						$overlayz[animation](speed);
					} else {
						$overlayz[animation](speed, callback);
					}
				}
				return $overlayz;
			},
			'remove': function() {
				if(this.alias != undefined) {
					$.overlayz._alias.remove(this.alias);
				}
				$overlayz.remove();
			}
		};

		// If CSS parameters have been specified, apply them to the overlay.
		if('css' in options) {
			$overlayz.overlayz.css(options.css);
		}
		
		// If HTML parameters have been specified, apply them to the
		// overlay.
		if('html' in options) {
			$overlayz.overlayz.html(options.html);
		}

		// If the overlay has an alias specified, add it to our lookup
		// table.
		if('alias' in options) {
			$overlayz.overlayz.alias = options.alias;
			$.overlayz._alias.add(options.alias, $overlayz);
		}

		return $overlayz;
	}

	// Defines the default formatting of the overlays.
	$.overlayz._css = {
		'container': {
			'position':         'fixed',
			'display':          'table',
			'top':              '0',
			'left':             '0',
			'width':            '100%',
			'height':           '100%',
			'min-height':       '100%',
			'max-height':       '100%',
			'background-color': 'rgba(0, 0, 0, 0.6)',
			'padding':          '0',
			'margin':           '0'
		},
		'cell': {
			'display':        'table-cell',
			'vertical-align': 'middle'
		},
		'body': {
			'display':          'block',
			'width':            '25%',
			'height':           '250px',
			'margin':           'auto',
			'padding':          '12px',
			'border':           '1px solid #ccc',
			'background-color': 'rgba(255, 255, 255, 1)',
			'text-align':       'left'
		}
	}
})(jQuery);
