// Main canvas state and variables
let canvas, ctx;
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let currentTool = "pen";
let textInput = null;
let isDraggingText = false;
let textDragOffset = { x: 0, y: 0 };

// Tool-specific settings
let toolSettings = {
	pen: { color: "#000000", width: 5 },
	marker: { color: "#ff0000", width: 10 },
	eraser: { width: 20 },
	shape: { color: "#000000", width: 3 },
	text: { color: "#000000", size: 16 },
};

// Current shape being drawn
let currentShape = "rectangle"; // or "circle", "arrow"
let shapePreviewData = null; // Store canvas data for shape preview redrawing

// History for undo/redo
let history = [];
let redoHistory = [];
const MAX_HISTORY = 30;

let startX = 0;
let startY = 0;
let isDrawingShape = false;

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
	updateContextFromCurrentTool();

	// Initialize with a blank canvas state in history
	saveToHistory();
}

function updateContextFromCurrentTool() {
	// Set context properties based on the current tool
	const settings = toolSettings[currentTool];

	if (settings) {
		if (settings.color) {
			ctx.strokeStyle = settings.color;
			ctx.fillStyle = settings.color;
		}

		if (settings.width) {
			ctx.lineWidth = settings.width;
		}
	}
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
	updateContextFromCurrentTool();
	saveToHistory();
}

function setupToolbarListeners() {
	// Tool selection buttons
	document
		.getElementById("shape-type")
		.addEventListener("change", function () {
			currentShape = this.value;
		});

	// Tool buttons
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

			// Update tool settings UI
			updateToolSettingsUI();

			// Update context for the new tool
			updateContextFromCurrentTool();

			// Remove any active text input field
			setTimeout(() => {
				// Remove input after blur event has had time to fire
				if (textInput) finishTextInput();
			}, 0);
		});
	});

	// Base color picker (for compatibility)
	document
		.getElementById("color-picker")
		.addEventListener("input", function () {
			const color = this.value;
			if (
				toolSettings[currentTool] &&
				"color" in toolSettings[currentTool]
			) {
				toolSettings[currentTool].color = color;
				updateContextFromCurrentTool();
			}
		});

	// Tool-specific color pickers
	document.querySelectorAll(".tool-color-picker").forEach((picker) => {
		picker.addEventListener("input", function () {
			const tool = this.getAttribute("data-tool");
			if (toolSettings[tool]) {
				toolSettings[tool].color = this.value;

				// Update context if this is the current tool
				if (tool === currentTool) {
					updateContextFromCurrentTool();
				}
			}
		});
	});

	// Tool-specific width sliders
	document.querySelectorAll(".tool-width-slider").forEach((slider) => {
		slider.addEventListener("input", function () {
			const tool = this.getAttribute("data-tool");
			const valueDisplay = document.getElementById(`${tool}-width-value`);

			if (toolSettings[tool]) {
				toolSettings[tool].width = parseInt(this.value);

				// Update the display value
				if (valueDisplay) {
					valueDisplay.textContent = toolSettings[tool].width;
				}

				// Update context if this is the current tool
				if (tool === currentTool) {
					updateContextFromCurrentTool();
				}
			}
		});
	});

	// Base stroke width slider (for compatibility)
	const strokeWidthSlider = document.getElementById("stroke-width");
	const strokeWidthValue = document.getElementById("stroke-width-value");

	if (strokeWidthSlider && strokeWidthValue) {
		strokeWidthSlider.addEventListener("input", function () {
			const width = parseInt(this.value);
			if (toolSettings[currentTool]) {
				toolSettings[currentTool].width = width;
				strokeWidthValue.textContent = width;
				updateContextFromCurrentTool();
			}
		});
	}

	// Undo button
	document.getElementById("undo-btn").addEventListener("click", undo);

	// Redo button
	document.getElementById("redo-btn").addEventListener("click", redo);

	// Clear button
	document.getElementById("clear-btn").addEventListener("click", clearCanvas);

	// Export button
	const exportBtn = document.getElementById("export-btn");
	if (exportBtn) {
		exportBtn.addEventListener("click", exportCanvas);
	}
}

function updateToolSettingsUI() {
	// Update UI to show settings for the current tool
	document.querySelectorAll(".tool-settings").forEach((settingsPanel) => {
		const tool = settingsPanel.getAttribute("data-tool");
		if (tool === currentTool) {
			settingsPanel.classList.remove("hidden");
		} else {
			settingsPanel.classList.add("hidden");
		}
	});

	// Update the displayed values to match current tool settings
	if (toolSettings[currentTool]) {
		const settings = toolSettings[currentTool];

		// Update color picker if it exists
		const colorPicker = document.querySelector(
			`.tool-color-picker[data-tool="${currentTool}"]`
		);
		if (colorPicker && settings.color) {
			colorPicker.value = settings.color;
		}

		// Update width slider if it exists
		const widthSlider = document.querySelector(
			`.tool-width-slider[data-tool="${currentTool}"]`
		);
		if (widthSlider && settings.width) {
			widthSlider.value = settings.width;

			// Update displayed value
			const valueDisplay = document.getElementById(
				`${currentTool}-width-value`
			);
			if (valueDisplay) {
				valueDisplay.textContent = settings.width;
			}
		}
	}
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

	if (currentTool === "eraser") {
		ctx.globalCompositeOperation = "destination-out";
		ctx.beginPath();
		ctx.moveTo(lastX, lastY);
		return;
	}

	if (currentTool === "shape") {
		isDrawingShape = true;
		startX = coords.x;
		startY = coords.y;

		// Store the current canvas state for redrawing during shape preview
		shapePreviewData = ctx.getImageData(0, 0, canvas.width, canvas.height);
		return;
	}

	// Start a new path for pen and marker
	ctx.beginPath();
	ctx.moveTo(lastX, lastY);

	// For marker, we use semi-transparency
	if (currentTool === "marker") {
		ctx.globalAlpha = 0.1; // Semi-transparent for marker
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

	if (currentTool === "eraser") {
		ctx.lineTo(currentX, currentY);
		ctx.stroke();
		lastX = currentX;
		lastY = currentY;
		return;
	}

	if (currentTool === "pen" || currentTool === "marker") {
		// Regular pen/marker drawing
		ctx.lineTo(currentX, currentY);
		ctx.stroke();

		// Update last position
		lastX = currentX;
		lastY = currentY;
		return;
	}

	if (currentTool === "shape" && isDrawingShape) {
		// Restore the original canvas state before drawing the shape preview
		if (shapePreviewData) {
			ctx.putImageData(shapePreviewData, 0, 0);
		}

		const w = currentX - startX;
		const h = currentY - startY;

		// Draw the shape preview
		ctx.beginPath();

		// Use the shape-specific settings
		ctx.strokeStyle = toolSettings.shape.color;
		ctx.lineWidth = toolSettings.shape.width;
		ctx.globalAlpha = 1.0;

		if (currentShape === "rectangle") {
			ctx.strokeRect(startX, startY, w, h);
		} else if (currentShape === "circle") {
			const radius = Math.sqrt(w * w + h * h);
			ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
			ctx.stroke();
		} else if (currentShape === "arrow") {
			drawArrow(startX, startY, currentX, currentY);
		}

		return;
	}
}

function drawArrow(fromX, fromY, toX, toY) {
	// Calculate arrow properties
	const headLength = 15;
	const angle = Math.atan2(toY - fromY, toX - fromX);

	// Draw the line
	ctx.beginPath();
	ctx.moveTo(fromX, fromY);
	ctx.lineTo(toX, toY);
	ctx.stroke();

	// Draw the arrow head
	ctx.beginPath();
	ctx.moveTo(toX, toY);
	ctx.lineTo(
		toX - headLength * Math.cos(angle - Math.PI / 6),
		toY - headLength * Math.sin(angle - Math.PI / 6)
	);
	ctx.lineTo(
		toX - headLength * Math.cos(angle + Math.PI / 6),
		toY - headLength * Math.sin(angle + Math.PI / 6)
	);
	ctx.closePath();
	ctx.fillStyle = toolSettings.shape.color;
	ctx.fill();
}

function stopDrawing() {
	if (!isDrawing) return;

	isDrawing = false;

	// Special handling for shape tool
	if (currentTool === "shape" && isDrawingShape) {
		isDrawingShape = false;
		shapePreviewData = null;
	}

	// Reset composite operation for eraser
	if (currentTool === "eraser") {
		ctx.globalCompositeOperation = "source-over";
	}

	// Reset global alpha for marker
	ctx.globalAlpha = 1.0;

	// Save to history
	saveToHistory();
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

	// Create a container for the text input and resize handles
	const textContainer = document.createElement("div");
	textContainer.className =
		"absolute border border-blue-500 p-1 rounded resize";
	textContainer.style.left = `${x + canvas.offsetLeft}px`;
	textContainer.style.top = `${y + canvas.offsetTop}px`;
	textContainer.style.minWidth = "150px";
	textContainer.style.minHeight = "40px";
	textContainer.style.zIndex = "1000";
	textContainer.style.background = "white";
	textContainer.style.resize = "both";
	textContainer.style.overflow = "auto";
	textContainer.style.cursor = "move";

	// Create the text area
	textInput = document.createElement("textarea");
	textInput.className = "w-full h-full border-none outline-none resize-none";
	textInput.style.color = toolSettings.text.color;
	textInput.style.fontSize = `${toolSettings.text.size}px`;
	textInput.style.fontFamily = "sans-serif";
	textInput.style.background = "transparent";
	textInput.style.cursor = "text";

	// Add the text area to the container
	textContainer.appendChild(textInput);

	// Add the container to the document
	document.body.appendChild(textContainer);

	// Focus the text area
	textInput.focus();

	// Add drag functionality
	textContainer.addEventListener("mousedown", startDraggingText);
	document.addEventListener("mousemove", dragText);
	document.addEventListener("mouseup", stopDraggingText);

	// Touch support for dragging
	textContainer.addEventListener(
		"touchstart",
		handleTouch(startDraggingText)
	);
	document.addEventListener("touchmove", handleTouch(dragText));
	document.addEventListener("touchend", handleTouch(stopDraggingText));

	// Save reference to container
	textInput.container = textContainer;

	// Handle Enter + Ctrl key for submission
	textInput.addEventListener("keydown", function (e) {
		if (e.key === "Enter" && e.ctrlKey) {
			finishTextInput();
		}
	});

	// Add a floating toolbar for the text box
	const textToolbar = document.createElement("div");
	textToolbar.className =
		"absolute top-0 right-0 flex bg-white border border-gray-300 rounded-bl px-2 py-1";
	textToolbar.style.transform = "translateY(-100%)";

	// Add a "Done" button
	const doneButton = document.createElement("button");
	doneButton.innerHTML = "✓";
	doneButton.className = "mr-2 text-green-600 hover:text-green-800";
	doneButton.title = "Done (Ctrl+Enter)";
	doneButton.addEventListener("click", finishTextInput);
	textToolbar.appendChild(doneButton);

	// Add a "Cancel" button
	const cancelButton = document.createElement("button");
	cancelButton.innerHTML = "✕";
	cancelButton.className = "text-red-600 hover:text-red-800";
	cancelButton.title = "Cancel";
	cancelButton.addEventListener("click", function () {
		textInput.value = "";
		finishTextInput();
	});
	textToolbar.appendChild(cancelButton);

	textContainer.appendChild(textToolbar);
}

function startDraggingText(e) {
	if (e.target === textInput) return; // Don't drag when clicking on textarea

	isDraggingText = true;

	const container = textInput.container;
	const containerRect = container.getBoundingClientRect();

	// Calculate offset between mouse position and container position
	if (e.type.includes("touch")) {
		const touch = e.touches[0] || e.changedTouches[0];
		textDragOffset.x = touch.clientX - containerRect.left;
		textDragOffset.y = touch.clientY - containerRect.top;
	} else {
		textDragOffset.x = e.clientX - containerRect.left;
		textDragOffset.y = e.clientY - containerRect.top;
	}

	e.preventDefault();
}

function dragText(e) {
	if (!isDraggingText || !textInput || !textInput.container) return;

	let clientX, clientY;
	if (e.type.includes("touch")) {
		const touch = e.touches[0] || e.changedTouches[0];
		clientX = touch.clientX;
		clientY = touch.clientY;
	} else {
		clientX = e.clientX;
		clientY = e.clientY;
	}

	const container = textInput.container;
	container.style.left = `${clientX - textDragOffset.x}px`;
	container.style.top = `${clientY - textDragOffset.y}px`;

	e.preventDefault();
}

function stopDraggingText() {
	isDraggingText = false;
}

function finishTextInput() {
	if (!textInput || !textInput.container) return;

	const text = textInput.value;

	if (text.trim() !== "") {
		// Calculate position relative to canvas
		const container = textInput.container;
		const containerRect = container.getBoundingClientRect();
		const canvasRect = canvas.getBoundingClientRect();

		const x = containerRect.left - canvasRect.left;
		const y = containerRect.top - canvasRect.top;

		// Get font settings
		ctx.font = `${toolSettings.text.size}px sans-serif`;
		ctx.fillStyle = toolSettings.text.color;
		ctx.textBaseline = "top";

		// Handle multiline text
		const lineHeight = toolSettings.text.size * 1.2;
		const lines = text.split("\n");

		lines.forEach((line, i) => {
			ctx.fillText(line, x, y + i * lineHeight);
		});

		saveToHistory();
	}

	// Remove container and cleanup
	if (textInput.container) {
		textInput.container.remove();
	}

	// Remove event listeners
	document.removeEventListener("mousemove", dragText);
	document.removeEventListener("mouseup", stopDraggingText);
	document.removeEventListener("touchmove", handleTouch(dragText));
	document.removeEventListener("touchend", handleTouch(stopDraggingText));

	textInput = null;
	isDraggingText = false;
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

function exportCanvas() {
	const link = document.createElement("a");
	link.download = "drawing.png";
	link.href = canvas.toDataURL();
	link.click();
}
