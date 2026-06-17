const API_KEY = 'aac90e0e93808304a2c52648d05ec66b';
const USERNAME = 'tarfishe';
const ENDPOINT = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${USERNAME}&api_key=${API_KEY}&limit=1&format=json`;

async function updateMusicWidget() {
  try {
    const response = await fetch(ENDPOINT);
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    
    const data = await response.json();
    
    const rawTrackData = data.recenttracks.track;
    
    let latestTrack;
    if (Array.isArray(rawTrackData)) {
      latestTrack = rawTrackData[0]; 
    } else {
      latestTrack = rawTrackData;    
    }

    const title = latestTrack.name || "Unknown Track";
    const artist = latestTrack.artist ? latestTrack.artist['#text'] : "Unknown Artist";
    
    const imgObj = latestTrack.image ? latestTrack.image.find(img => img.size === 'large') : null;
    const albumArt = (imgObj && imgObj['#text']) ? imgObj['#text'] : 'https://placeholder.com';
    
    const isNowPlaying = latestTrack['@attr'] && latestTrack['@attr'].nowplaying === 'true';

    document.getElementById('track-art').src = albumArt;
    document.getElementById('track-title').innerText = title;
    document.getElementById('track-artist').innerText = artist;
    
    const badge = document.getElementById('status-badge');
    if (isNowPlaying) {
      badge.innerText = "Now Playing";
      badge.className = "status-badge live";
    } else {
      badge.innerText = "Recently Played";
      badge.className = "status-badge offline";
    }

    document.getElementById('loading').classList.add('hidden');
    document.getElementById('music-content').classList.remove('hidden');

  } catch (error) {
    console.error('System failed to process Last.fm payload:', error);
    document.getElementById('loading').innerText = "Unable to load music data.";
  }
}

document.addEventListener('DOMContentLoaded', updateMusicWidget);
setInterval(updateMusicWidget, 30000);