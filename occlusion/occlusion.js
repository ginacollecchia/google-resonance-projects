let canvasControl;
let audioContext;
let audioElements = [];
let soundSources = [];
let scene;
let sourceIds = ['sourceAButton', 'sourceBButton', 'sourceCButton'];
let dimensions = {
	width: 8, height: 3.4, depth: 9,
};
let materials = {
    left: 'brick-bare', right: 'brick-bare', front: 'brick-bare', back: 'brick-bare', up: 'brick-bare', down: 'wood-panel',
};
let audioSources = [
	'https://cdn.rawgit.com/resonance-audio/resonance-audio-web-sdk/master/examples/resources/cube-sound.wav',
	'https://cdn.rawgit.com/resonance-audio/resonance-audio-web-sdk/master/examples/resources/speech-sample.wav',
	'https://cdn.rawgit.com/resonance-audio/resonance-audio-web-sdk/master/examples/resources/music.wav',
];
let audioReady = false;

/** 
 * @private
 */

function selectRoomProperties() {
	if (!audioReady)
		return;
	
	// dimensionSelection = document.getElementById('roomDimensionsSelect').value;
	// materialSelection = document.getElementById('roomMaterialsSelect').value;
	dimensions.width = document.getElementById('roomDimensionsEnterWidth').value;
	dimensions.height = document.getElementById('roomDimensionsEnterHeight').value;
	dimensions.depth = document.getElementById('roomDimensionsEnterDepth').value;
	materials.left = document.getElementById('roomMaterialsSelectLeft').value;
	materials.right = document.getElementById('roomMaterialsSelectRight').value;
	materials.front = document.getElementById('roomMaterialsSelectFront').value;
	materials.back = document.getElementById('roomMaterialsSelectBack').value;
	materials.up = document.getElementById('roomMaterialsSelectTop').value;
	materials.down = document.getElementById('roomMaterialsSelectBottom').value;
	scene.setRoomProperties(dimensions, materials);
	canvasControl.invokeCallback();
}

/**
 * @private
 */

function adjustSourceVolume() {
	if (!audioReady)
		return;
	
    let volumes = [];
    
    volumes[0] = parseFloat(document.getElementById('volumeAdjustCubeSound').value);
	volumes[1] = parseFloat(document.getElementById('volumeAdjustSpeech').value);
	volumes[2] = parseFloat(document.getElementById('volumeAdjustMusic').value);
	
    for (let i = 0; i < soundSources.length; i++) {
        audioElements[i].volume = volumes[i]/100.0;
    }
}

/** 
 * @param {Object} elements
 * @private
 */

function updatePositions(elements) {
	if (!audioReady)
		return;
	
	for (let i = 0; i < elements.length; i++) {
		let x = (elements[i].x - 0.5) * dimensions.width / 2.0;
		let y = 0;
		let z = (elements[i].y - 0.5) * dimensions.depth / 2.0;
		if (i < elements.length - 1) {
			soundSources[i].setPosition(x, y, z);
		} else {
			scene.setListenerPosition(x, y, z);
		}
	}
}

/** 
 * @private
 */
function initAudio() {
	// required for Google Resonance to start the context
	audioContext = new (window.AudioContext || window.webkitAudioContext);
	let audioElementSources = [];
	for (let i = 0; i < audioSources.length; i++) {
		audioElements[i] = document.createElement('audio');
		audioElements[i].src = audioSources[i];
		audioElements[i].crossOrigin = 'anonymous';
		audioElements[i].load();
		audioElements[i].loop = true;
		audioElementSources[i] = audioContext.createMediaElementSource(audioElements[i]);
	}
	
	// Initialize the scene and create source(s)
	scene = new ResonanceAudio(audioContext, {ambisonicOrder: 1,});
	for (let i = 0; i < audioSources.length; i++) {
		soundSources[i] = scene.createSource();
		audioElementSources[i].connect(soundSources[i].input);
	}
	// connect to the audio graph
	scene.output.connect(audioContext.destination);
	
	audioReady = true;
}

let onLoad = function() {
    // Initialize play button functionality.
    for (let i = 0; i < sourceIds.length; i++) {
    	let button = document.getElementById(sourceIds[i]);
		button.addEventListener('click', function(event) {
			switch (event.target.textContent) {
				case 'Play': {
					if (!audioReady) {
						initAudio();
					}
					event.target.textContent = 'Pause';
					audioElements[i].play();
				}
				break;
				case 'Pause': {
					event.target.textContent = 'Play';
					audioElements[i].pause();
				}
				break;
			}
		});
	}

    document.getElementById('roomDimensionsEnterWidth').addEventListener('change', function(event) {
        selectRoomProperties();
    });
    document.getElementById('roomDimensionsEnterHeight').addEventListener('change', function(event) {
        selectRoomProperties();
    });
    document.getElementById('roomDimensionsEnterDepth').addEventListener('change', function(event) {
        selectRoomProperties();
    });

    document.getElementById('roomMaterialsSelectLeft').addEventListener('change', function(event) {
        selectRoomProperties();
    });
    document.getElementById('roomMaterialsSelectRight').addEventListener('change', function(event) {
        selectRoomProperties();
    });
    document.getElementById('roomMaterialsSelectTop').addEventListener('change', function(event) {
        selectRoomProperties();
    });
    document.getElementById('roomMaterialsSelectBottom').addEventListener('change', function(event) {
        selectRoomProperties();
    });
    document.getElementById('roomMaterialsSelectFront').addEventListener('change', function(event) {
        selectRoomProperties();
    });
    document.getElementById('roomMaterialsSelectBack').addEventListener('change', function(event) {
        selectRoomProperties();
    });
	
	document.getElementById('volumeAdjustCubeSound').addEventListener('change', function(event) {
		adjustSourceVolume();
	});
	document.getElementById('volumeAdjustSpeech').addEventListener('change', function(event) {
		adjustSourceVolume();
	});
	document.getElementById('volumeAdjustMusic').addEventListener('change', function(event) {
		adjustSourceVolume();
	});

    let canvas = document.getElementById('canvas');
    let elements = [
      {
        icon: 'sourceAIcon',
        x: 0.25,
        y: 0.25,
        radius: 0.04,
        alpha: 0.75,
        clickable: true,
      },
      {
        icon: 'sourceBIcon',
        x: 0.75,
        y: 0.25,
        radius: 0.04,
        alpha: 0.75,
        clickable: true,
      },
      {
        icon: 'sourceCIcon',
        x: 0.25,
        y: 0.75,
        radius: 0.04,
        alpha: 0.75,
        clickable: true,
      },
      {
        icon: 'listenerIcon',
        x: 0.5,
        y: 0.5,
        radius: 0.04,
        alpha: 0.75,
        clickable: true,
      },
    ];
    canvasControl = new CanvasControl(canvas, elements, updatePositions);

    selectRoomProperties();
};
window.addEventListener('load', onLoad);