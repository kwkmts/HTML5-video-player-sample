const main = () => {
  const video = document.getElementById('video-player');

  // ビデオファイル選択ボタン
  const fileSelector = document.getElementById('video-file');
  const videoSelectButton = document.getElementById('video-select');

  videoSelectButton.addEventListener('click', e => fileSelector.click());

  // ビデオファイル選択
  let isloaded = false;

  fileSelector.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file.type.match('video.*')) {
      alert('This file is not video.');
      return;
    }

    video.src = window.URL.createObjectURL(file);
    video.load();
    isloaded = true;
  });

  // ビデオ再生/ポーズボタン
  let isPlayed = false;
  const videoPlayButton = document.getElementById('video-play-pause');

  videoPlayButton.addEventListener('click', () => {
    if (!isloaded) return;

    if (isPlayed) {
      videoPlayButton.innerHTML = '<i class="fas fa-play fa-lg"></i>';
      video.pause();
    } else {
      videoPlayButton.innerHTML = '<i class="fas fa-pause fa-lg"></i>';
      video.play();
    }

    isPlayed = !isPlayed;
  });

  // ビデオフルスクリーンボタン
  const videoFullScreenButton = document.getElementById('video-fullscreen');

  videoFullScreenButton.addEventListener('click', () => {
    video.requestFullScreen =
      video.requestFullScreen ||
      video.webkitRequestFullscreen ||
      video.mozRequestFullScreen;
    video.requestFullScreen && video.requestFullScreen();
  });

  //秒数を"<時>:<分>:<秒>"の形式に
  const secondsToHours = seconds => {
    const ONE_HOUR = 60 * 60;
    const ONE_MINUTE = 60;
    const h = Math.floor(seconds / ONE_HOUR);
    const m = Math.floor((seconds - h * ONE_HOUR) / ONE_MINUTE);
    const s = Math.floor(seconds - h * ONE_HOUR - m * ONE_MINUTE);
    return (
      String(h).padStart(2, '0') +
      ':' +
      String(m).padStart(2, '0') +
      ':' +
      String(s).padStart(2, '0')
    );
  };

  // プログレスバー長さと時間表示の更新
  const progressOut = document.getElementById('progress-out');
  const progressIn = document.getElementById('progress-in');
  const currentTime = document.getElementById('current');
  const duration = document.getElementById('duration');

  video.addEventListener('timeupdate', () => {
    progressIn.style.transform = `scaleX(${
      video.currentTime / video.duration
    })`;
    currentTime.innerText = secondsToHours(video.currentTime);
  });

  video.addEventListener('loadeddata', () => {
    duration.innerText = secondsToHours(video.duration);
  });

  // プログレスバークリック時イベント
  progressOut.addEventListener('click', e => {
    const percent =
      (e.pageX -
        (progressOut.getBoundingClientRect().left + window.pageXOffset)) /
      progressOut.clientWidth;
    video.currentTime = video.duration * percent;
  });

  //再生速度調整
  const playbackRateSlider = document.getElementById('playback-rate-slider');
  const playbackRate = document.getElementById('playback-rate');

  playbackRate.innerText = `x${parseFloat(playbackRateSlider.value).toFixed(
    1
  )}`;
  video.playbackRate = parseFloat(playbackRateSlider.value);

  playbackRateSlider.addEventListener('input', () => {
    playbackRate.innerText = `x${parseFloat(playbackRateSlider.value).toFixed(
      1
    )}`;
    video.playbackRate = parseFloat(playbackRateSlider.value);
  });

  video.addEventListener('loadeddata', () => {
    video.playbackRate = parseFloat(playbackRateSlider.value);
  });

  //音量調整
  const volumeSlider = document.getElementById('volume-slider');
  const volume = document.getElementById('volume');

  volume.innerText = `${volumeSlider.value}`;
  video.volume = parseFloat(volumeSlider.value / 100);

  volumeSlider.addEventListener('input', () => {
    volume.innerText = `${volumeSlider.value}`;
    video.volume = parseFloat(volumeSlider.value / 100);
  });

  video.addEventListener('loadeddata', () => {
    video.volume = parseFloat(volumeSlider.value / 100);
  });
};

document.addEventListener('DOMContentLoaded', () => main());
