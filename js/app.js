$(document).ready(function() {
	var audioObject = null;

	function getArtistId(query) {
		var request = {
			query: query,
			type: 'artist'
		};

		var result = $.ajax({
			url: "https://api.spotify.com/v1/search",
			data: request,
			dataType: 'json',
			type: 'GET',
		}).done(function(result) {
			var id = result.artists.items[0].id;
			getTopTracks(id); //****************
			return id;
		}).fail(function() {
			alert("Error getting artist.");
		});
	}

	function getTopTracks(artistId) {
		var request = {
			country: "US"
		};

		var result = $.ajax({
			url: "https://api.spotify.com/v1/artists/" + artistId + "/top-tracks",
			data: request,
			dataType: "json",
			type: "GET"
		}).done(function(result) {
			showResults(result); //*****************
			return result;
		}).fail(function() {
			alert("Error getting tracks.");
		});
	}

	function clearResults() {
		$('#results').html("");
		$('#results').addClass('hidden');
	}

	function showResults(results) {
		for (var i = 0; i <= 2; i++) {	
			$('#results').append('<div class="track">' +
				'<button class="btn-play play" data-preview="' + results.tracks[i].preview_url + '"></button>' +
				'<div class="track-info">' +
					'<a href="' + results.tracks[i].external_urls.spotify + '" target="_blank" class="spotify-link">' +
						'<p>' + results.tracks[i].name + ' - </p>' +
						'<p>' + results.tracks[i].artists[0].name + '</p>' +
					'</a>' +
					'<p class="track-album-title">' + results.tracks[i].album.name + '</p>' +
				'</div>' +
				'<a href="' + results.tracks[i].album.external_urls.spotify + '" target="_blank">' +
					'<img class="track-album-art" src="' + results.tracks[i].album.images[2].url + '">' +
				'</a>' +
			'</div>');

		};
		$('#results').removeClass('hidden');

		$('.btn-play').click(function(event) {
			event.preventDefault();

			if ($(this).hasClass('pause')){
				audioObject.pause();
				$(this).removeClass('pause');
				$(this).addClass('play');
			} else if ($(this).hasClass('play')) {
				audioObject = new Audio($(this).attr('data-preview'));
				audioObject.play();
				$(this).removeClass('play');
				$(this).addClass('pause');
			}
		});
	}

	$('#btn-search').click(function(event) {
		event.preventDefault();

		clearResults();

		var searchQuery = $('#search-query').val();
		getArtistId(searchQuery);
		//*************
	});
});