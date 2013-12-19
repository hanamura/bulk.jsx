# bulk.jsx

ExtendScript utilities for Photoshop.

	#include "underscore.js"
	#include "bulk.jsx"
	
	var bulk = new bulk.Bulk({
		tasks: [
			new bulk.Resize({
				width: 1500,
				height: 1500
			})
		],
		savers: [
			new bulk.Export({
				option: bulk.Options.jpg({quality: 80}),
				template: 'image-<%= index %>.jpg'
			})
		]
	});
	bulk.go();