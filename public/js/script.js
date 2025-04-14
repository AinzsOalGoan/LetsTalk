// Main canvas state and variables
let canvas, ctx;
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let currentTool = "pen";
let currentColor = "#000000";
let currentStrokeWidth = 5;
let textInput = null;

// History for undo/redo
let history = [];
let redoHistory = [];
const MAX_HISTORY = 30;

document.addEventListener("DOMContentLoaded", function () {
	// Create canvas element dynamically to fit the container
  console.log("DOM Ready");
	setupCanvas();

	// Set up event listeners for toolbar buttons
	setupToolbarListeners();

	// Set up canvas event listeners
	setupCanvasListeners();

	// Window resize handler
	window.addEventListener("resize", debounce(resizeCanvas, 250));
});

function setupCanvas() {
	const container = document.getElementById("canvas-container");

	// Remove any existing canvas if we're resetting
	if (canvas) {
		container.removeChild(canvas);
	}

	// Create a new canvas that fills the container
	canvas = document.createElement("canvas");
	canvas.id = "drawing-canvas";
	canvas.className = "absolute top-0 left-0";
	canvas.width = container.clientWidth;
	canvas.height = container.clientHeight;
	container.appendChild(canvas);

	// Get context and set default styles
	ctx = canvas.getContext("2d");
	ctx.lineCap = "round";
	ctx.lineJoin = "round";
	ctx.strokeStyle = currentColor;
	ctx.lineWidth = currentStrokeWidth;

	// Initialize with a blank canvas state in history
	saveToHistory();
}

function resizeCanvas() {
	const container = document.getElementById("canvas-container");

	// Save current canvas content
	const tempCanvas = document.createElement("canvas");
	const tempCtx = tempCanvas.getContext("2d");
	tempCanvas.width = canvas.width;
	tempCanvas.height = canvas.height;
	tempCtx.drawImage(canvas, 0, 0);

	// Resize canvas to fit container
	canvas.width = container.clientWidth;
	canvas.height = container.clientHeight;

	// Restore previous drawing
	ctx.drawImage(tempCanvas, 0, 0);

	// Reset context properties (they get cleared on resize)
	ctx.lineCap = "round";
	ctx.lineJoin = "round";
	ctx.strokeStyle = currentColor;
	ctx.lineWidth = currentStrokeWidth;
}

function setupToolbarListeners() {
	// Tool selection buttons
	document.querySelectorAll(".tool-btn").forEach((btn) => {
		btn.addEventListener("click", function () {
			// Remove active class from all buttons
			document.querySelectorAll(".tool-btn").forEach((b) => {
				b.classList.remove("active", "bg-blue-500", "text-white");
				b.classList.add("bg-gray-200");
			});

			// Add active class to clicked button
			this.classList.remove("bg-gray-200");
			this.classList.add("active", "bg-blue-500", "text-white");

			// Set current tool
			currentTool = this.id.replace("-tool", "");

			// Remove any active text input field
			if (textInput) {
				finishTextInput();
			}
		});
	});

	// Color picker
	document
		.getElementById("color-picker")
		.addEventListener("input", function () {
			currentColor = this.value;
			ctx.strokeStyle = currentColor;
			ctx.fillStyle = currentColor;
		});

	// Stroke width slider
	const strokeWidthSlider = document.getElementById("stroke-width");
	const strokeWidthValue = document.getElementById("stroke-width-value");

	strokeWidthSlider.addEventListener("input", function () {
		currentStrokeWidth = parseInt(this.value);
		strokeWidthValue.textContent = currentStrokeWidth;
		ctx.lineWidth = currentStrokeWidth;
	});

	// Undo button
	document.getElementById("undo-btn").addEventListener("click", undo);

	// Redo button
	document.getElementById("redo-btn").addEventListener("click", redo);

	// Clear button
	document.getElementById("clear-btn").addEventListener("click", clearCanvas);
}

function setupCanvasListeners() {
	canvas.addEventListener("mousedown", startDrawing);
	canvas.addEventListener("mousemove", draw);
	canvas.addEventListener("mouseup", stopDrawing);
	canvas.addEventListener("mouseout", stopDrawing);

	// Touch support
	canvas.addEventListener("touchstart", handleTouch(startDrawing));
	canvas.addEventListener("touchmove", handleTouch(draw));
	canvas.addEventListener("touchend", handleTouch(stopDrawing));
	canvas.addEventListener("touchcancel", handleTouch(stopDrawing));
}

function startDrawing(e) {
	isDrawing = true;

	// Get coordinates
	const coords = getCoordinates(e);
	lastX = coords.x;
	lastY = coords.y;

	// Different behavior based on selected tool
	if (currentTool === "text") {
		createTextInput(lastX, lastY);
		isDrawing = false; // Stop drawing flow for text
		return;
	}

	// Start a new path for pen and marker
	ctx.beginPath();
	ctx.moveTo(lastX, lastY);

	// For marker, we do a single dot if the user just clicks
	if (currentTool === "marker") {
		ctx.globalAlpha = 0.3; // Semi-transparent for marker
		ctx.lineTo(lastX + 0.1, lastY + 0.1); // Tiny movement to ensure a dot appears
		ctx.stroke();
	} else {
		ctx.globalAlpha = 1.0; // Fully opaque for pen
	}
}

function draw(e) {
	if (!isDrawing) return;

	// Prevent scrolling on touch devices
	e.preventDefault();

	// Get new coordinates
	const coords = getCoordinates(e);
	const currentX = coords.x;
	const currentY = coords.y;

	if (currentTool === "pen") {
		// Regular pen drawing
		ctx.lineTo(currentX, currentY);
		ctx.stroke();
	} else if (currentTool === "marker") {
		// Marker with transparency
		ctx.lineTo(currentX, currentY);
		ctx.stroke();
	}

	// Update last position
	lastX = currentX;
	lastY = currentY;
}

function stopDrawing() {
	if (isDrawing) {
		isDrawing = false;
		saveToHistory();
	}
}

function getCoordinates(e) {
	let x, y;

	// Handle both mouse and touch events
	if (e.type.includes("touch")) {
		const touch = e.touches[0] || e.changedTouches[0];
		const rect = canvas.getBoundingClientRect();
		x = touch.clientX - rect.left;
		y = touch.clientY - rect.top;
	} else {
		x = e.offsetX;
		y = e.offsetY;
	}

	return { x, y };
}

function handleTouch(callback) {
	return function (e) {
		e.preventDefault(); // Prevent scrolling
		callback(e);
	};
}

function createTextInput(x, y) {
	// Remove any existing text input
	if (textInput) {
		finishTextInput();
	}

	// Create a new input element
	textInput = document.createElement("input");
	textInput.type = "text";
	textInput.className = "absolute bg-transparent border border-gray-400 p-1";
	textInput.style.left = `${x}px`;
	textInput.style.top = `${y}px`;
	textInput.style.color = currentColor;
	textInput.style.fontSize = `${currentStrokeWidth * 2}px`;
	textInput.style.minWidth = "100px";

	// Add it to container
	document.getElementById("canvas-container").appendChild(textInput);

	// Focus it
	textInput.focus();

	// Handle Enter key or loss of focus
	textInput.addEventListener("keydown", function (e) {
		if (e.key === "Enter") {
			finishTextInput();
		}
	});

	textInput.addEventListener("blur", finishTextInput);
}

function finishTextInput() {
	if (!textInput) return;

	const text = textInput.value.trim();
	if (text) {
		// Draw the text to canvas
		ctx.font = `${currentStrokeWidth * 2}px Arial`;
		ctx.fillStyle = currentColor;
		ctx.fillText(
			text,
			parseInt(textInput.style.left),
			parseInt(textInput.style.top) + parseInt(textInput.style.fontSize)
		);

		// Save state to history
		saveToHistory();
	}

	// Remove the input
	textInput.parentNode.removeChild(textInput);
	textInput = null;
}

function clearCanvas() {
	// Save current state before clearing
	saveToHistory();

	// Clear canvas
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function saveToHistory() {
	// Create a copy of current canvas state
	const imgData = canvas.toDataURL();

	// Add to history
	history.push(imgData);

	// Limit history size
	if (history.length > MAX_HISTORY) {
		history.shift();
	}

	// Clear redo history when new action is performed
	redoHistory = [];

	// Update button states
	updateUndoRedoButtons();
}

function undo() {
	if (history.length <= 1) return; // Keep at least the initial state

	// Move current state to redo history
	redoHistory.push(history.pop());

	// Load the previous state
	loadCanvasState(history[history.length - 1]);

	// Update button states
	updateUndoRedoButtons();
}

function redo() {
	if (redoHistory.length === 0) return;

	// Get last state from redo history
	const state = redoHistory.pop();

	// Add it to history
	history.push(state);

	// Load the state
	loadCanvasState(state);

	// Update button states
	updateUndoRedoButtons();
}

function loadCanvasState(dataURL) {
	const img = new Image();
	img.onload = function () {
		// Clear and draw the saved state
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.drawImage(img, 0, 0);
	};
	img.src = dataURL;
}

function updateUndoRedoButtons() {
	const undoBtn = document.getElementById("undo-btn");
	const redoBtn = document.getElementById("redo-btn");

	// Update visual state of buttons based on history availability
	undoBtn.disabled = history.length <= 1;
	undoBtn.classList.toggle("opacity-50", history.length <= 1);

	redoBtn.disabled = redoHistory.length === 0;
	redoBtn.classList.toggle("opacity-50", redoHistory.length === 0);
}

// Utility function: Debounce for window resize
function debounce(func, wait) {
	let timeout;
	return function () {
		const context = this;
		const args = arguments;
		clearTimeout(timeout);
		timeout = setTimeout(() => func.apply(context, args), wait);
	};
}
