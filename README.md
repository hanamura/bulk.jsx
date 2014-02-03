# bulk.jsx

ExtendScript (.jsx) library for Photoshop.

## Example

```
#include "bulk.full.jsx"

bulk(Folder.selectDialog('Select source folder.'), {filePattern: /\.(jpg|jpeg|png|gif|tif|tiff|psd)$/i})
	.mode({
		mode: ChangeMode.RGB
	})
	.resize({
		type: 'fit',
		width: 1000,
		height: 1000,
		expand: false
	})
	.jpg({
		dest: Folder.selectDialog('Select destination folder.'),
		filename: '<%= bulk.pad(index + 1, 3) %>-<%= basename %>-<%= Number(doc.width) %>x<%= Number(doc.height) %>.jpg',
		overwrite: 'ask',
		quality: 80
	})
	.exec();
```

## Getting Started

### Zip Download

1. [Download bulk.jsx](https://github.com/hanamura/bulk.jsx/archive/master.zip) and Unzip.
2. Go to the unzipped folder **bulk.jsx-master/templates** and edit **template.jsx** (there are already some codes).
3. Launch Photoshop and select menu: **File** > **Scripts** > **Brwse…** then open **template.jsx**.
4. Script runs.

### npm

Install:

```
npm install bulk.jsx
```

Script:

```
#include "node_modules/bulk.jsx/bulk.full.jsx"

// your code here
```

### bower

Install:

```
bower install bulk.jsx
```

Script:

```
#include "bower_components/bulk.jsx/bulk.full.jsx"

// your code here
```

## Dependencies

- [underscore.js](http://underscorejs.org)
- [rebounds.js](https://github.com/hanamura/rebounds.js)

## API

### bulk(src, options = null)

- **src** *Folder | File | String | Array | bulk Object | Function*  
	Source object:
	- **Folder**: Use all matched files inside the folder as task targets.
	- **File**: Use the file as task target.
	- **String**: Absolute file/folder path. Same as `File(string)`.
	- **Array**: Dig items recursively. Folder, File, String or Array are accepted.
	- **bulk Object**: Same as `bulk.src()`.
	- **Function**: Same as `func()`.
- **options** *Object*
	- **options.filePattern** *RegExp*  
		Filename pattern to specify targets. If `null`, all files are accepted. Default value: `null`
	- **options.folderPattern** *RegExp*  
		Folder name pattern to specify targets. If `null`, all folders are accepted. Default value: `null`
	- **options.mask** *String*  
		Parameter passed to `Folder.getFiles(mask)`. Default value: `'*'`.
	- **options.deep** *Boolean*  
		Traverse deeply through files in folders. Default value: `true`.

**Returns**: *bulk Object*

```
bulk(Folder.selectDialog('Select folder.'), {filePattern: /\.jpg$/})
	.resize({type: 'fit', width: 1000, height: 1000})
	.save()
	.exec();
```

### bulk.basename(filename)

- **filename** *String*

**Returns**: *String*

```
bulk.basename('hello.jpg');
// => 'hello'
```

### bulk.extension(filename)

- **filename** *String*

**Returns**: *String*

```
bulk.extension('hello.jpg');
// => 'jpg'
```

### bulk.noConflict()

**Returns**: *bulk*

### bulk.pad(string, length, padString = '0', right = false)

- **string** *String*
- **length** *Integer*
- **padString** *String*
- **right** *Boolean*

**Returns**: *String*

```
bulk.pad('5', 3);
// => '005'
```

### bulk.pixels(callback, context = null)

Shortcut of `bulk.units(Units.PIXELS, callback, context)`.

- **callback** *Function*
- **context** *Object*

**Returns**: *undefined*

### bulk.units(units, callback, context = null)

Set `preference.rulerUnits` to specified units, execute callback and reset to original units.

- **units** *Units*
- **callback** *Function*
- **context** *Object*

**Returns**: *undefined*

```
bulk.units(Units.INCHES, function() {
	$.writeln('document width: ' + String(app.activeDocument.width) + ' inches');
	$.writeln('document height: ' + String(app.activeDocument.height) + ' inches');
});
```

### bulk.walk(src, fileCallback, otherCallback, options = null)

Traverse through files in source, yield each file/other object to callback.

- **src** *Folder | File | String | Array*  
	Source object: **Folder**, **File**, **String** (Same as `File(string)`), **Array** (Parse recursively).
- **fileCallback** *Function(file)*  
	Callback for File objects.
- **otherCallback** *Function(otherObject)*  
	Callback for unknown objects.
- **options** *Object*
	- **options.filePattern** *RegExp*  
		Filename pattern to specify targets. If null, all files are accepted. Default value: `null`
	- **options.folderPattern** *RegExp*  
		Folder name pattern to specify targets. If null, all folders are accepted. Default value: `null`
	- **options.mask** *String*  
		Parameter passed to `Folder.getFiles(mask)`. Default value: `'*'`.
	- **options.deep** *Boolean*  
		Traverse deeply through files in folders. Default value: `true`.

**Returns**: *undefined*

```
bulk.walk(Folder.selectDialog('Select folder.'), function(file) {
	$.writeln(file.name); // log filename
}, null, {
	filePattern: /\.txt$/
});
```

### .crop(options = null)

Task: crop document.

- **options** *Object*
	- **options.width** *UnitValue*
	- **options.height** *UnitValue*
	- **options.anchor** *AnchorPosition*  
		Default value: `AnchorPosition.MIDDLECENTER`.

**Returns**: *bulk Object*

```
bulk(src, options)
	.crop({
		width: 100,
		height: 100,
		anchor: AnchorPosition.TOPCENTER
	})
	.save()
	.exec();
```

### .exec(options = null)

Actually execute bulk object. Specifying ruler units.

- **options** *Object*
	- **options.units** *Units*  
		Default value: `Units.PIXELS`

**Returns**: *bulk Object*

### .export(options = null)

Task: export document.

- **options** *Object*
	- **options.dest** *Folder | String | Template String | Function*  
		Destination folder for output file. Default value: `null`.
		- **Folder**: Passed folder.
		- **String**: Passed to underscore’s [`.template`](http://underscorejs.org/#template) function with `bulk.DocInfo` object: `_.template(string, docInfo)`. Then, evaluated as an absolute path, or a relative path to parent folder of the original file.
		- **Function**: Use return value of `func(docInfo)`.
		- **null**: Same folder with the original file.
	- **options.filename** *String | Template String | Function*  
		Filename for output file. Default value: `null`.
		- **String**: Passed to underscore’s [`.template`](http://underscorejs.org/#template) function with `bulk.DocInfo` object: `_.template(string, docInfo)`.
		- **Function**: Use return value of `func(docInfo)`.
		- **null**: Same name with the original file.
	- **options.overwrite** *Boolean | `'ask'`*  
		Define behavior in case a filename already exists. Default value: `'ask'`.
		- **true**: Overwrite file.
		- **false**: Cancel saving document.
		- **'ask'**: Popup confirm dialog.
	- **options.exportType** *ExportType*
	- **options.exportOptions** *ExportOptions*

**Returns**: *bulk Object*

```
var exportOptions = new ExportOptionsSaveForWeb();
exportOptions.format = SaveDocumentType.JPEG;
exportOptions.quality = 50;

bulk(src, options)
	.export({
		dest: Folder.selectDialog('Select destination folder.'),
		filename: '<%= basename %>-low.<%= extension %>',
		overwrite: false,
		exportType: ExportType.SAVEFORWEB,
		exportOptions: exportOptions
	})
	.exec();
```

### .jpg(options = null)

Task: export document as JPEG for web.

- **options** *Object*
	- **options.dest** *Folder | String | Template String | Function*  
		See `.export()`.
	- **options.filename** *String | Template String | Function*  
		See `.export()`.
	- **options.overwrite** *Boolean | `'ask'`*  
		See `.export()`.
	- **options.quality** *Number (`0` – `100`)*  
		Default value: `100`

**Returns**: *bulk Object*

### .log(options = null)

Task: output document/file information to JavaScript console of ExtendScript Toolkit.

- **options** *Object*
	- **options.template** *String | Template String*  
		Passed to underscore’s [`.template`](http://underscorejs.org/#template) function with `bulk.DocInfo` object: `_.template(string, docInfo)`. Default value: `'<%= filename %>'`.
	- **options.opensDoc** *Boolean*  
		Set `true` if you want to use `<% doc ... %>` inside template string. If `false`, file never opens as document, unless the other tasks require doc. Default value: `true`.

**Returns**: *bulk Object*

```
bulk(src, options)
	.log({
		template: '<%= bulk.pad(index + 1, 3) %>: <%= filename %>',
		opensDoc: false
	})
	.exec();
```

Example output:

```
001: hello.jpg
002: world.jpg
…
```

### .mode(options = null)

Task: change color mode of document.

- **options** *Object*
	- **options.mode** *ChangeMode*  
		Default value: `ChangeMode.RGB`.

**Returns**: *bulk Object*

```
bulk(src, options)
	.mode({
		mode: ChangeMode.CMYK
	})
	.exec();
```

### .opensDoc()

Internal method: get opensDoc property, whether or not bulk object’s tasks need to open file as Photoshop document.

**Returns**: *Boolean*

### .opensDoc(opens)

Internal method: set opensDoc property. Once it is set `true`, unable to change it.

- **opens** *Boolean*

**Returns**: *bulk Object*

### .options()

Get options object passed to `bulk()`.

**Returns**: *Object*

### .pass(callbacks...)

Pass bulk object to all callbacks as `this`. You can use this method to fork tasks.

- **callbacks...** *Function*

**Returns**: *bulk Object*

```
bulk(src, options)
	.resize({
		type: 'fit',
		width: 1000,
		height: 1000
	})
	.pass(
		function() {
			this.jpg({
					dest: destForJpg,
					filename: '<%= basename %>.jpg'
				})
				.exec();
		},
		function() {
			this.crop({
					width: 100,
					height: 100
				})
				.png({
					dest: destForPng,
					filename: '<%= basename %>.png'
				})
				.exec();
		}
	);
```

### .png(options = null)

Task: export document as 24-bit PNG for web.

- **options** *Object*
	- **options.dest** *Folder | String | Template String | Function*  
		See `.export()`.
	- **options.filename** *String | Template String | Function*  
		See `.export()`.
	- **options.overwrite** *Boolean | `'ask'`*  
		See `.export()`.

**Returns**: *bulk Object*

### .push(task, opensDoc = true)

Push task to bulk object and returns clone bulk object. See “Create Custom Task” section.

- **task** *Function*  
	Task function executed for each document/file. `this` in the function is set to `bulk.DocInfo`.
- **opensDoc** *Boolean*  
	If `true`, bulk object opens file as document.

**Returns**: *bulk Object*

### .resize(options = null)

Taks: resize document.

- **options** (Object)
	- **options.type** *`'fit'` | `'fill'` | `'remain'` | `'stretch'` | Function(space, rect, options)*  
		Resize method. Default value: `'fit'`.
		- **'fit'**: Resize document to fit into space.
		- **'fill'**: Resize document to fill space.
		- **'remain'**: Keep document size.
		- **'stretch'**: Resize document stretched into the same size with space. (Doesn’t keep aspect ratio)
		- **Function**: Custom resize function. See [rebounds.js](https://github.com/hanamura/rebounds.js) for detail.
	- **options.width** *UnitValue*
	- **options.height** *UnitValue*
	- **options.reduce** *Boolean*  
		Allow size reduction of document.
		Default value: `true`
	- **options.expand** *Boolean*  
		Allow size expansion of document.
		Default value: `true`
	- **options.resolution** *Number*  
		Default value: `72`.
	- **options.resampleMethod** *ResampleMethod*  
		Default value: `ResampleMethod.BICUBICSHARPER`.

**Returns** *bulk Object*

```
bulk(src, options)
	.resize({
		type: 'fit',
		width: 1000,
		height: 1000,
		reduce: true,
		expand: false,
		resolution: 96,
		resampleMethod: ResampleMethod.BICUBIC
	})
	.save()
	.exec();
```

### .save()

Task: save document.

**Returns**: *bulk Object*

```
bulk(src, options)
	.mode({
		mode: ChangeMode.RGB
	})
	.save()
	.exec();
```

### .src()

Source object passed to `bulk()`.

**Returns**: *Folder | File | String | Array | bulk Object | Function*

### .tasks()

Internal method: task functions added to the bulk object.

**Returns**: *Function Array*

### .tasks(tasks)

Internal method: set tasks to the bulk object.

**Returns**: *bulk Object*

### bulk.DocInfo

Document and File information class. Its instances are passed to task functions as `this` objects.

**Properties**:

- **doc** *Document*  
	Target Document object.
- **file** *File*  
	File object of the target Document.
- **index** *Integer*  
	Current index in sources.
- **filename** *String*  
	Filename of the File.
- **basename** *String*  
	Basename of the File. (example: `'hello'` if filename is `'hello.jpg'`)
- **extension** *String*  
	Extension of the File. (example: `'jpg'` if filename is `'hello.jpg'`)

## Create Custom Task

To create task `logSize` for example:

```
bulk.fn.logSize = function(options) {
	// options
	var filename = !!options.filename;
	var prefix = options.prefix || 'document ';
	var suffix = options.suffix || ' pixels';
	
	// push task and return cloned bulk object
	return this.push(function() {
		// - `$.writeln()` is log function in ExtendScript
		// - `this` is current bulk.DocInfo object
		
		if (filename) {
			$.writeln(String(this.index) + ' filename: ' + this.file.name);
		}
		$.writeln(prefix + 'width: ' + String(this.doc.width) + suffix);
		$.writeln(prefix + 'height: ' + String(this.doc.height) + suffix);
		$.writeln('-');
	});
};
```

To use:

```
bulk(src, options)
	.logSize({
		filename: true,
		prefix: 'my document ',
		suffix: 'px'
	})
	.exec();
```

Example output:

```
0 filename: hello.jpg
my document width: 500px
my document height: 350px
-
1 filename: world.jpg
my document width: 550px
my document height: 200px
-
2 filename: salt.jpg
my document width: 1024px
my document height: 768px
-
```

## License

MIT License
