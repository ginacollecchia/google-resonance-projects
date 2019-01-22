let canvasControl;
let audioContext;
let audioElements = [];
let soundSources = [];
let scene;
let sourceIds = ['sourceAButton', 'sourceBButton', 'sourceCButton'];
let dimensions = {
	small: {
		width: 1.5, height: 2.4, depth: 1.3,
	},
	medium: {
		width: 4, height: 3.2, depth: 3.9,
	},
	large: {
		width: 8, height: 3.4, depth: 9,
	},
	huge: {
		width: 20, height: 10, depth: 20,
	},
};
let materials = {
  brick: {
    left: 'brick-bare', right: 'brick-bare',
    up: 'brick-bare', down: 'wood-panel',
    front: 'brick-bare', back: 'brick-bare',
  },
  curtains: {
    left: 'curtain-heavy', right: 'curtain-heavy',
    up: 'wood-panel', down: 'wood-panel',
    front: 'curtain-heavy', back: 'curtain-heavy',
  },
  marble: {
    left: 'marble', right: 'marble',
    up: 'marble', down: 'marble',
    front: 'marble', back: 'marble',
  },
  outside: {
    left: 'transparent', right: 'transparent',
    up: 'transparent', down: 'grass',
    front: 'transparent', back: 'transparent',
  },
};
let audioSources = [
	'https://cdn.rawgit.com/resonance-audio/resonance-audio-web-sdk/master/examples/resources/cube-sound.wav',
	'https://cdn.rawgit.com/resonance-audio/resonance-audio-web-sdk/master/examples/resources/speech-sample.wav',
	'https://cdn.rawgit.com/resonance-audio/resonance-audio-web-sdk/master/examples/resources/music.wav',
];
let dimensionSelection = 'small';
let materialSelection = 'brick';
let dimensionSelectionWidth = 8;
let dimensionSelectionHeight = 3.4;
let dimensionSelectionDepth = 9;
let materialSelectionLeft = 'brick-bare';
let materialSelectionRight = 'brick-bare';
let materialSelectionFront = 'brick-bare';
let materialSelectionBack = 'brick-bare';
let materialSelectionTop = 'brick-bare';
let materialSelectionBottom = 'wood-panel';
let volumeCubeSound = 100;
let volumeSpeech = 100;
let volumeMusic = 100;
let audioReady = false;

/** 
 * @private
 */

function selectRoomProperties() {
	if (!audioReady)
		return;
	
	// dimensionSelection = document.getElementById('roomDimensionsSelect').value;
	// materialSelection = document.getElementById('roomMaterialsSelect').value;
	dimensionSelectionWidth = document.getElementById('roomDimensionsEnterWidth').value;
	dimensionSelectionHeight = document.getElementById('roomDimensionsEnterHeight').value;
	dimensionSelectionDepth = document.getElementById('roomDimensionsEnterDepth').value;
	materialSelectionLeft = document.getElementById('roomMaterialsSelectLeft').value;
	materialSelectionRight = document.getElementById('roomMaterialsSelectRight').value;
	materialSelectionFront = document.getElementById('roomMaterialsSelectFront').value;
	materialSelectionBack = document.getElementById('roomMaterialsSelectBack').value;
	materialSelectionTop = document.getElementById('roomMaterialsSelectTop').value;
	materialSelectionBottom = document.getElementById('roomMaterialsSelectBottom').value;
	dimensions = {width: dimensionSelectionWidth, height: dimensionSelectionHeight, depth: dimensionSelectionDepth,};
	materials = {left: materialSelectionLeft, right: materialSelectionRight, up: materialSelectionTop, down: materialSelectionBottom, front: materialSelectionFront, back: materialSelectionBack,}; 
	/* document.getElementById('roomLeftText').innerHTML = materialSelectionLeft;
	document.getElementById('roomRightText').innerHTML = materialSelectionRight;
	document.getElementById('roomFrontText').innerHTML = materialSelectionFront;
	document.getElementById('roomBackText').innerHTML = materialSelectionBack;
	document.getElementById('roomTopText').innerHTML = materialSelectionTop;
	document.getElementById('roomBottomText').innerHTML = materialSelectionBottom;
	document.getElementById('roomWidthText').innerHTML = dimensionSelectionWidth.toString() + " meters";
	document.getElementById('roomDepthText').innerHTML = dimensionSelectionDepth.toString() + " meters";
	document.getElementById('roomHeightText').innerHTML = dimensionSelectionHeight.toString() + " meters"; */
	scene.setRoomProperties(dimensions, materials);
	canvasControl.invokeCallback();
}

/**
 * @private
 */

function adjustSourceVolume() {
	if (!audioReady)
		return;
	
	volumeCubeSound = parseFloat(document.getElementById('volumeAdjustCubeSound').value);
	volumeSpeech = parseFloat(document.getElementById('volumeAdjustSpeech').value);
	volumeMusic = parseFloat(document.getElementById('volumeAdjustMusic').value);
	
	audioSources[0].setGain(volumeCubeSound/100.0);
	audioSources[1].setGain(volumeSpeech/100.0);
	audioSources[2].setGain(volumeMusic/100.0);
}

/** 
 * @param {Object} elements
 * @private
 */

function updatePositions(elements) {
	if (!audioReady)
		return;
	
	for (let i = 0; i < elements.length; i++) {
		let x = (elements[i].x - 0.5) * dimensions.width / 2;
		let y = 0;
		let z = (elements[i].y - 0.5) * dimensions.depth / 2;
		if (i < elements.length - 1) {
			soundSources[i].setPosition(x,y,z);
		} else {
			scene.setListenerPosition(x,y,z);
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