/* 
// for playing a group of sound sources, which move
let numberOfBirds = 8;
let elements;
let canvasControl;
let deltaTimeMilliseconds = 33;
let areaSize = 10;
let speedRange = 0.2;
let speedMinimum = 0.1;
let neighborDistance = 0.1;
let alignmentWeight = 0.3;
let cohesionWeight = 0.1;
let separationWeight = 0.15;
let radiusMinimum = 0.015;
let radiusRange = 0.025 - radiusMinimum;
let audioContext;
let audioElements = [];
let soundSources = [];
let intervalCallback;
let audioReady = false; */

// for playing a single sound source
let audioContext;
let scene;
let audioElement;
let audioElementSource;
let source;
let audioReady = false;

function initAudio() {
	// Create an AudioContext
	audioContext = new (window.AudioContext || window.webkitAudioContext);

	// Create a (first-order Ambisonic) Resonance Audio scene and pass it
	// the AudioContext.
    scene = new ResonanceAudio(audioContext);

    // Send scene's rendered binaural output to stereo out.
    scene.output.connect(audioContext.destination);
	
	// Define room dimensions.
	// By default, room dimensions are undefined (0m x 0m x 0m).
	let roomDimensions = {
	  width: 3.1,
	  height: 2.5,
	  depth: 3.4,
	};

	// Define materials for each of the room’s six surfaces.
	// Room materials have different acoustic reflectivity.
	let roomMaterials = {
	  // Room wall materials
	  left: 'brick-bare',
	  right: 'curtain-heavy',
	  front: 'marble',
	  back: 'glass-thin',
	  // Room floor
	  down: 'grass',
	  // Room ceiling
	  up: 'transparent',
	};

	// Add the room definition to the scene.
	scene.setRoomProperties(roomDimensions, roomMaterials);
	
	// Create an audio element, feed into audio rgaph
	audioElement = document.createElement('audio');
	audioElement.src = '../resources/dropping-nails-9s.wav';
	audioElement.crossOrigin = 'anonymous';
	audioElement.load();
	// Loop it
	audioElement.loop = true;

	// Generate a MediaElementSource from the AudioElement.
	audioElementSource = audioContext.createMediaElementSource(audioElement);

	// Add the MediaElementSource to the scene as an audio input source.
	source = scene.createSource();
	audioElementSource.connect(source.input);

	// Set the source position relative to the room center (source default position).
	source.setPosition(-0.707, -0.707, 0);

	// Play the audio.
	// audioElement.play();
	audioReady = true;
}

let onLoad = function() {
	// Initialize play button functionality
	let sourcePlayback = document.getElementById('sourceButton');
	sourcePlayback.onclick = function(event) {
		switch (event.target.textContent) {
			case 'Play': {
				if (!audioReady) {
					initAudio();
				}
				event.target.textContent = 'Pause';
				audioElement.play();
			}
			break;
			case 'Pause': {
				event.target.textContent = 'Play';
				audioElement.pause();
			}
			break;
		}
	};
	
	let canvas = document.getElementById('canvas');
	let elements = [
		{ 
			icon: 'sourceIcon',
			x: 0.25, 
			y: 0.25,
			radius: 0.04,
			alpha: 0.333,
			clickable: false,
		},
		{
			icon: 'listenerIcon',
			x: 0.5,
			y: 0.5,
			radius: 0.04,
			alpha: 0.333,
			clickable: false,
		},
	];
	new CanvasControl(canvas, elements);
};
window.addEventListener('load', onLoad);

