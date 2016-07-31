/**
 * Created by KaiNguyen on 7/31/16.
 */


function renderImage(url, container) {
	if (!/^http/.test(url))
		url = ['images', url].join('/');

	var img = $('<li/>').append($('<img/>').attr({
		id: Date.now(),
		src: url,
		class: 'img-rounded js-img-canvas',
		draggable: true,
	}));

	$('ul', container).append(img);
}

function canvasTransform(selector, options) {
	$.each(selector, function (index, $element) {
		var ctx = new canvasCtx($element, options);
		ctx.bindEvent();
	});
}

function canvasCtx(element, options) {
	var self = this;
	this.$canvas = $(element);
	this.canvasCtx = element.getContext('2d');

	this.options = {
		maxHeight: 200,
		font: 'Arial',
		fontSize: 30,
		imgContainer: '.image',
		uploadForm: '#upload',
		addText: '#addText'
	};

	if (options) {
		Object.keys(options).forEach(function (item) {
			self.options[item] = options[item];
		})
	}
	this.calculateSize();

	this.items = [];
	this.isAddText = false;
	this.isDrag = false;
	this.selectedItem = null;

	this.prepareCanvas();
}

canvasCtx.prototype.calculateSize = function () {
	this.width = this.$canvas.outerWidth();
	this.height = this.$canvas.outerHeight();
	this.offsetX = this.$canvas.offset().left;
	this.offsetY = this.$canvas.offset().top;
};

canvasCtx.prototype.bindEvent = function () {
	var self = this;

	this.$canvas
		.on('dragover', function (ev) {
			ev.preventDefault();
		})
		.on('contextmenu', function (ev) {
			return false;
		})
		.on('drop', function (ev) {
			ev.preventDefault();
			var data = ev.originalEvent.dataTransfer.getData("img");
			var imgItem = new Item('image', data, ev.clientX - self.offsetX, ev.clientY - self.offsetY, 0, 0, {
				maxHeight: 200,
				canvasCtx: self.canvasCtx
			});
			self.items.push(imgItem);

			self.draw();

		})
		.on('click', function (ev) {
			ev.stopPropagation();
			ev.preventDefault();
			if (self.isAddText) {
				var text = prompt('your text', '');
				//addText(text, ev);
				if (typeof text !== 'string') return;

				var width = self.canvasCtx.measureText(text).width;
				var textItem = new Item('text', text, ev.clientX - self.offsetX, ev.clientY - self.offsetY, width, 30);
				self.items.push(textItem);

				self.isAddText = false;
				self.changeCursor('default');

				self.draw();
			}
		})
		.on('mousedown', function (ev) {
			ev.preventDefault();
			ev.stopPropagation();
			if (self.isAddText) return false;

			self.clear();

			for (var i in self.items) {
				var item = self.items[i];

				item.addToCanvas(self.canvasCtx);

				var middleX = ev.clientX - self.offsetX
					, middleY = ev.clientY - self.offsetY;

				if (item instanceof Item && item.isSelected(middleX, middleY)) {
					self.selectedItem = item;
					switch (ev.which) {
						case 1 :
							self.items.splice(+i, 1);
							self.items.unshift(self.selectedItem);
							self.isDrag = true;
							self.changeCursor('pointer');
							break;
						case 3:
							if (self.selectedItem.type === 'text') {
								var text = prompt('your text', self.selectedItem.value);

								if (typeof text !== 'string')
									self.items.splice(+i, 1);

								self.selectedItem.value = text;
								self.selectedItem.width = self.canvasCtx.measureText(text).width;
							} else {
								self.items.splice(+i, 1);
							}
						default:
							break;
					}
					break; // break for
				}
			}

			self.draw();
			return false;
		})
		.on('mousemove', function (ev) {
			if (self.isAddText || !self.selectedItem || !self.isDrag) return false;

			self.selectedItem.move(ev.clientX - self.offsetX, ev.clientY - self.offsetY);
			self.draw();
		})
		.on('mouseup', function (ev) {
			ev.preventDefault();
			self.isDrag = false;
			self.selectedItem = null;
			self.changeCursor('default');

		});

	// Re-calculate offset when window is resized
	$(window).on('resize', function () {
		self.calculateSize();
	});

	$(this.options.addText).on('click', function () {
		self.changeCursor('crosshair');
		self.isAddText = true;
	});

	$(this.options.imgContainer).on('dragstart', '.js-img-canvas', function (ev) {
		ev.originalEvent.dataTransfer.setData("img", ev.target.src);
	});

	// handle upload
	$(this.options.uploadForm).on('submit', function (e) {
		e.preventDefault();
		var formData = new FormData();
		var inputFile = $('input[name="upload"]', this).get(0);

		if (inputFile.files[0] == void 0) return;

		formData.append("upload", inputFile.files[0]);

		var request = new XMLHttpRequest();

		request.onreadystatechange = function () {
			if (request.readyState === 4) {
				switch (request.status) {
					case 200 :
						console.log('ok');
						break;
					default:
						console.log('status: ', request.status);
						break;
				}
			}
		};
		request.onerror = function (error) {
			console.error('error:', error);
		}
		request.open("POST", "/uploads");
		request.send(formData);

	});

};

canvasCtx.prototype.clear = function () {
	this.canvasCtx.clearRect(0, 0, this.width, this.height);
};

canvasCtx.prototype.prepareCanvas = function () {
	this.canvasCtx.font = this.options.fontSize + 'px ' + this.options.font;
};

canvasCtx.prototype.changeCursor = function (cursor) {
	this.$canvas.css({cursor: cursor || 'default'});
}

canvasCtx.prototype.draw = function () {
	this.clear();
	this.prepareCanvas();

	for (var i = this.items.length - 1; i >= 0; i--) {
		this.items[i].addToCanvas(this.canvasCtx);
	}
};

(function ($) {
	$.fn.castMagic = function (options) {
		canvasTransform(this, options);
		// start socket
		var socket = io();

		socket.emit('getImageList', 'hi');

		socket.on('images', function (msg) {
			while (msg && msg.length) {
				renderImage(msg.shift(), options.imgContainer || '.image');
			}
		});

		socket.on('newImage', function (msg) {
			renderImage(msg, options.imgContainer || '.image');
		});
	};
})(jQuery);