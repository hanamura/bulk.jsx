#target "photoshop"
#include "../bulk.full.jsx"

(function() {
	// margin
	var mx = 50;
	var my = 40;

	// window
	var window = new Window('dialog', 'Size', {x:0, y:0, width: 400, height: 400});

	// labels - size
	var labelWidth = window.add('statictext', {
		x: mx,
		y: my,
		width: 120,
		height: 20
	}, 'Max width:');
	var labelHeight = window.add('statictext', {
		x: mx,
		y: labelWidth.bounds.y + labelWidth.bounds.height + 20,
		width: labelWidth.bounds.width,
		height: labelWidth.bounds.height
	}, 'Max height:');
	var labelQuality = window.add('statictext', {
		x: mx,
		y: labelHeight.bounds.y + labelHeight.bounds.height + 20,
		width: labelWidth.bounds.width,
		height: labelWidth.bounds.height
	}, 'Quality (0 – 100):');

	// input - size
	var inputWidth = window.add('edittext', {
		x: labelWidth.bounds.x + labelWidth.bounds.width,
		y: labelWidth.bounds.y,
		width: window.bounds.width - (labelWidth.bounds.x + labelWidth.bounds.width) - mx,
		height: labelWidth.bounds.height
	});
	var inputHeight = window.add('edittext', {
		x: labelHeight.bounds.x + labelHeight.bounds.width,
		y: labelHeight.bounds.y,
		width: inputWidth.bounds.width,
		height: labelHeight.bounds.height
	});
	var inputQuality = window.add('edittext', {
		x: labelQuality.bounds.x + labelQuality.bounds.width,
		y: labelQuality.bounds.y,
		width: inputWidth.bounds.width,
		height: labelQuality.bounds.height
	});

	// button
	var buttonMargin = 10;

	var buttonCancel = window.add('button', {
		x: mx,
		y: labelQuality.bounds.y + labelQuality.bounds.height + 30,
		width: (window.bounds.width - mx * 2 - buttonMargin) / 2,
		height: 30
	}, 'Cancel');

	buttonCancel.addEventListener('click', function(e) {
		window.close();
	});

	var buttonOk = window.add('button', {
		x: buttonCancel.bounds.x + buttonCancel.bounds.width + buttonMargin,
		y: buttonCancel.bounds.y,
		width: buttonCancel.bounds.width,
		height: buttonCancel.bounds.height
	}, 'OK');

	buttonOk.addEventListener('click', function(e) {
		window.close();

		var pattern = /^\s*\d+\s*$/;
		var width, height, quality;

		if (
			pattern.test(inputWidth.text) &&
			pattern.test(inputHeight.text) &&
			pattern.test(inputQuality.text)
		) {
			width = Number(inputWidth.text);
			height = Number(inputHeight.text);
			quality = Number(inputQuality.text);
		} else {
			return alert('Invalid input.');
		}

		bulk(Folder.selectDialog('Select source folder.'), {filePattern: /\.(jpg|jpeg|png|gif|tif|tiff|psd)$/i})
			.mode({
				mode: ChangeMode.RGB
			})
			.resize({
				type: 'fit',
				width: width,
				height: height,
				expand: false
			})
			.jpg({
				dest: Folder.selectDialog('Select destination folder.'),
				filename: '<%= basename %>-<%= Number(doc.width) %>x<%= Number(doc.height) %>-' + String(quality) + '.jpg',
				quality: quality
			})
			.exec();
	});

	// resize
	window.bounds = {x: 0, y: 0, width: window.bounds.width, height: buttonCancel.bounds.y + buttonCancel.bounds.height + my};

	// show
	window.center();
	window.show();
})();
