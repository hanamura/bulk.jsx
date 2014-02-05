#target "photoshop"
#include "../bulk.full.jsx"

// edit and customize below

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
