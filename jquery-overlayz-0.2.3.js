/**

==================
 OverlayZ v0.2.3
==================

A very simple, yet customizable jQuery overlay.

 License
---------

The MIT License (MIT)

Copyright © 2013-2015 Joshua D. Burns <https://github.com/JDBurnZ>

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
				.css($.overlayz._css.main) // Apply default CSS.
				.hide() // Hide overlay by default.
				.appendTo(document.body) // Add overlay to DOM <body>.
				.append(
					$('<div class="overlayz-container"></div>')
						.css($.overlayz._css.container)
						.append(
							$('<div class="overlayz-cell"></div>')
								.css($.overlayz._css.cell)
								.append(
									$('<div class="overlayz-body"></div>')
										.css($.overlayz._css.body)
								)
								.append(
									$('<div class="overlayz-close">&times;</div>')
										.css($.overlayz._css.close)
								)
						)
				);

		$overlayz.overlayz = {
			'body': (
				$overlayz
					.children('.overlayz-container')
					.children('.overlayz-cell')
					.children('.overlayz-body')
			),
			'css': function(css) {
				if('main' in css) {
					$overlayz.css(css.main);
				}
				if('container' in css) {
					$overlayz
						.children('.overlayz-container')
						.css(css.container);
				}
				if('cell' in css) {
					$overlayz
						.children('.overlayz-container')
						.children('.overlayz-cell')
						.css(css.cell);
				}
				if('close' in css) {
					$overlayz
						.children('.overlayz-container')
						.children('.overlayz-cell')
						.children('.overlayz-close')
						.css(css.close)
				}
				if('body' in css) {
					$overlayz
						.children('.overlayz-container')
						.children('.overlayz-cell')
						.children('.overlayz-body')
						.css(css.body);
				}
				return $overlayz;
			},
			'html': html = function(body) {
				$overlayz
					.children('.overlayz-container')
					.children('.overlayz-cell')
					.children('.overlayz-body')
					.html(body);
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

		// When the escape key is pressed, close the overlay if it is displayed.
		$(document.body).on('keydown.overlayz-close', function(event) {
			if(event.keyCode == 27 && $overlayz.is(':visible')) {
				$overlayz.overlayz.close('fadeOut', 'fast');
			}
		});

		// When the user clicks outside of the overlay body and onto the faded out
		// background, automatically close hte overlay.
		$overlayz.on('click.overlayz-close-faded', '.overlayz-cell', function(event) {
			if($overlayz.is(':visible') && $(event.target).hasClass('overlayz-cell')) {
				$overlayz.overlayz.close('fadeOut', 'fast');
			}
		});

		// When the "Close" icon is pressed on the overlay, close it.
		$overlayz.on('click.overlayz-close-icon', '.overlayz-close', function(event) {
			if($overlayz.is(':visible')) {
				$overlayz.overlayz.close('fadeOut', 'fast');
			}
		});

		return $overlayz;
	}

	// Defines the default formatting of the overlays.
	$.overlayz._css = {
		'main': { // Outermost element required to be block element for
		          // animations to work properly.
			'display':          'block',
			'position':         'fixed',
			'top':              '0',
			'left':             '0',
			'width':            '100%',
			'height':           '100%',
			'max-height':       '100%',
		},
		'container': {
			'display':          'table',
			'top':              '0',
			'left':             '0',
			'width':            '100%',
			'height':           '100%',
			'max-height':       '100%',
			'background-color': 'rgba(0, 0, 0, 0.6)',
			'padding':          '0',
			'margin':           '0'
		},
		'cell': { // Provides vertical alignment.
			'display':        'table-cell',
			'vertical-align': 'middle'
		},
		'close': {
			'border': '1px solid #a00000',
			'border-radius': '3px',
			'background-color': 'rgb(204, 0, 0)',
			'color': '#fff',
			'cursor': 'pointer',
			'font-size': '29px',
			'font-weight': 'bold',
			'height': '29px',
			'line-height': '29px',
			'position': 'absolute',
			'right': '8px',
			'text-align': 'center',
			'top': '8px',
			'width': '28px',
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
