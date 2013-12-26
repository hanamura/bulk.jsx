# bulk.jsx

ExtendScript utilities for Photoshop.

## Example

```javascript
#include "underscore.js"
#include "bulk.jsx"

bulk.pixels(function() {
	new bulk.Bulk({
		pattern: /^.+\.(jpg|jpeg|png|gif|psd)$/i,
		deep: true,
		tasks: [
			new bulk.Mode({
				mode: ChangeMode.RGB
			}),
			new bulk.Resize({
				width: 1500,
				height: 1500,
				resizeMethod: bulk.Resize.NOBORDER
			}),
			new bulk.Crop({
				width: 1500,
				height: 1500
			})
		],
		savers: [
			new bulk.Export({
				option: bulk.Options.jpg({quality: 80}),
				template: 'image-<% print(bulk.pad(index + 1, 3)) %>.jpg'
			})
		]
	}).go();
});
```

Run this script with Photoshop, then:

1. Set global ruler units to pixels.
2. Opens dialog to select input folder.
3. Opens dialog to select output folder.
4. Processes all matched image files in the selected folder.
	- Changes color mode to RGB.
	- Resizes documents.
	- Crops documents.
5. Exports as JPEG with filename.
	- `image-001.jpg`
	- `image-002.jpg`
	- `image-003.jpg`
	- …
6. Reset global ruler units.