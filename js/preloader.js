function Preloader(items) {
	var _Items = items;
	var _LoadedCount = 0;
	this.preloadComplete = null;
	var _PreloadedItems = new Array();
	this.preload = function() 
	{
		var scope = this;
		if (_Items != null)
		{
			for (var i=0; i< _Items.length; i++)
			{
				var item = _Items[i];
				switch (item.type)
				{

					case "image":
						var image = new Image();
						$(image).bind('load', {id: item.identifier, imageRef: image},function (event) {
							scope.loading(event.data.id, event.data.imageRef);
						});
						image.src = item.src;

						break;
					case "audio":
						var audio = new Audio();
						$(audio).bind('canplaythrough', {id: item.identifier, audioRef: audio},function (event) {
  							scope.loading(event.data.id, event.data.audioRef);
						});

						audio.src = item.src;
												
						break;
					case "video":
						var video = new Video();
						$(video).bind('canplaythrough', {id: item.identifier, videoRef: audio},function (event) {
  							scope.loading(event.data.id, event.data.videoRef);
						});
						
						video.src = item.src;
						break;
				}
			}
		
		} else {
			//Nothing to load so fire onload complete
			this.onPreLoadComplete();
		}
		
	
	}
	
	this.getItem = function(id) {
		return _PreloadedItems[id];
	}
	
	
	this.loading = function(id, item) {
		_LoadedCount++;
		_PreloadedItems[id] = item;
		this.onProgressChanged();
		if (_LoadedCount == _Items.length)
		{
			this.onPreLoadComplete();
		}
	}
	
	this.onPreLoadComplete = function() {
		if (this.preloadComplete !=null) {
			this.preloadComplete(true);
		}
	}
	
	this.onProgressChanged= function() {
		if (this.progressChanged !=null) {
			var percentDone = (_LoadedCount/ _Items.length) * 100;
			this.progressChanged(percentDone);
		}
		
	}
}