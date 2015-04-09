jQuery OverlayZ
===============

A very simple, yet customizable jQuery overlay.

License
-------
Please refer to the LICENSE file for licensing and copyright information.

Examples
--------
More examples are available within the <a href="examples">examples</a> directory.

How "easy" is OverlayZ to use?
<pre>
// Instantiate a standard overlay.
var layz = $.overlayz({
	'html': 'The <u>HTML content</u> of the overlay.',
	'alias': 'my-overlay'
});

// Instantiate a custom formatted overlay.
var layz = $.overlayz({
	'html': 'The <u>HTML content</u> of the overlay.',
	'alias': 'my-overlay',
	'css': {
		'container': {
			'background': 'none'
		},
		'body': {
			'background-color': '#000',
			'border': '40px solid #0f0',
			'border-radius': '40px',
			'padding': '40px',
			'color': '#0f0'
		}
	}
});

// Display the overlay.
layz.fadeIn();

// Hide the overlay.
layz.overlayz.close();

// Hide the overlay using a custom animation.
layz.overlayz.close();

// Remove (delete) the overlay.
layz.overlayz.remove();

// Grab a previously instantiated overlay from a different scope.
var layz = $.overlayz('my-overlay');
</pre>
