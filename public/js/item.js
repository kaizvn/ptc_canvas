/**
 * Created by KaiNguyen on 7/30/16.
 */


function setMiddleLocation(location, size) {
	return Math.max(location - (size / 2 || 0), 0);
}

function Item(type, value, x, y, width, height, options) {
	this.options = options || {};
	var self = this;
	this.type = type || '';
	this.value = value || '';
	this.locX = x;
	this.locY = y;
	this.width = width || 0;
	this.height = height || 0;
	if (type == 'image') {
		var image = new Image();
		image.onload = function () {
			if (image.height > self.options.maxHeight) {
				image.width = image.width / image.height * self.options.maxHeight;
				image.height = self.options.maxHeight;
			}

			if (!self.width || !self.height) {
				var updateObj = {
					locX: setMiddleLocation(self.locX, image.width),
					locY: setMiddleLocation(self.locY, image.height),
					width: image.width,
					height: image.height
				};

				self.update(updateObj);
			}
			options.canvasCtx.drawImage(self.value, self.locX, self.locY, self.width, self.height);
		};
		image.src = self.value;

		this.value = image;
	}
}

Item.prototype.addToCanvas = function (canvasCtx) {
	switch (this.type) {
		case 'image':
			canvasCtx.drawImage(this.value, this.locX, this.locY, this.width, this.height);
			break;
		case 'text':
			//TODO: calculate width : > length => 0 , 0
			canvasCtx.fillStyle = '#000';
			canvasCtx.fillText(this.value, this.locX, this.locY, this.width);
		default:
			break;
	}
};

Item.prototype.update = function (newItemObj) {
	var self = this;


	Object.keys(newItemObj).forEach(function (key) {
		(self[key] != void 0) && (self[key] = newItemObj[key]);
	})
};

Item.prototype.isSelected = function (middleX, middleY) {
	var x = setMiddleLocation(middleX, this.width);
	var y = setMiddleLocation(middleY, this.height);

	//TODO : get selected and remove item from list
	switch (this.type) {
		case 'text':
			return (x < this.locX + this.width / 2
			&& x > this.locX - this.width / 2
			&& y > this.locY - this.height
			&& y < this.locY);
		case 'image':
			return (x > this.locX - this.width / 2
			&& x < this.locX + this.width / 2
			&& y > this.locY - this.height / 2
			&& y < this.locY + this.height / 2);
		default :
			return false;
	}

};

Item.prototype.move = function (x, y) {
	//TODO: get Selected and update current x,y, then redraw
	this.update({
		locX: setMiddleLocation(x, this.width),
		locY: setMiddleLocation(y, this.height)
	});
};

Item.prototype.resize = function () {
	// TODO : update width ,height
};
