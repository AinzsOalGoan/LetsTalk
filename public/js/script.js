// Main canvas state and variables
let canvas, ctx;
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let currentTool = "pen";
let textInput = null;
let isDraggingText = false;
let textDragOffset = { x: 0, y: 0 };
let eraserCursor = null;

// Tool-specific settings
let toolSettings = {
	pen: { color: "#000000", width: 5 },
	marker: { color: "#ff0000", width: 10 },
	eraser: { width: 20 },
	shape: { color: "#000000", width: 3 },
	text: { color: "#000000", size: 16 },
	select: { color: "#3b82f6", width: 2 }, // Selection border color and width
	eraser: { width: 20 },
};

// Current shape being drawn
let currentShape = "rectangle"; // or "circle", "arrow"
let shapePreviewData = null; // Store canvas data for shape preview redrawing

// Selection tool variables
let isSelecting = false;
let selectionStartX = 0;
let selectionStartY = 0;
let selectionBox = null;
let selectedArea = null;
let isDraggingSelection = false;
let isResizingSelection = false;
let resizeHandle = "";
let lastSelectX = 0;
let lastSelectY = 0;

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
function addCursorStyles() {
	// Add custom cursor styles to the document head
	const style = document.createElement("style");
	style.textContent = `
		.pen-cursor { cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2'%3E%3Cpath d='M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z'%3E%3C/path%3E%3C/svg%3E") 0 24, auto; }
		.marker-cursor { cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23ff0000' stroke-width='2'%3E%3Cpath d='M9 11.24V7.5a2.5 2.5 0 0 1 5 0v3.74'%3E%3C/path%3E%3Cpath d='M5 11l1-1v7.5a2.5 2.5 0 0 0 5 0v-7l1-1'%3E%3C/path%3E%3C/svg%3E") 0 24, auto; }
		.text-cursor { cursor: text; }
		.shape-cursor { cursor: crosshair; }
		.select-cursor { cursor: crosshair; }
		.resize-n { cursor: ns-resize !important; }
		.resize-ne { cursor: nesw-resize !important; }
		.resize-e { cursor: ew-resize !important; }
		.resize-se { cursor: nwse-resize !important; }
		.resize-s { cursor: ns-resize !important; }
		.resize-sw { cursor: nesw-resize !important; }
		.resize-w { cursor: ew-resize !important; }
		.resize-nw { cursor: nwse-resize !important; }
		.selection-box {
			border: 2px dashed #3b82f6 !important;
			background-color: rgba(59, 130, 246, 0.05);
			box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.2);
			border-radius: 2px;
		}
		.text-container {
			box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
			border: 1px solid #3b82f6 !important;
			border-radius: 4px;
			background-color: rgba(255, 255, 255, 0.95);
		}
		.text-toolbar {
			border-bottom-left-radius: 4px;
			background-color: #f0f9ff;
			border-left: 1px solid #bfdbfe;
			border-bottom: 1px solid #bfdbfe;
		}
		.resize-handle {
			background-color: #3b82f6 !important;
			border: 1px solid white;
			box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
			opacity: 0.8;
		}
	`;
	document.head.appendChild(style);
}
function updateCanvasCursor() {
	// Remove any previous cursor classes
	canvas.classList.remove(
		"pen-cursor",
		"marker-cursor",
		"text-cursor",
		"shape-cursor",
		"select-cursor"
	);

	// Add appropriate cursor class based on current tool
	switch (currentTool) {
		case "pen":
			canvas.classList.add("pen-cursor");
			break;
		case "marker":
			canvas.classList.add("marker-cursor");
			break;
		case "text":
			canvas.classList.add("text-cursor");
			break;
		case "shape":
			canvas.classList.add("shape-cursor");
			break;
		case "select":
			canvas.classList.add("select-cursor");
			break;
		case "eraser":
			canvas.style.cursor = "default"; // We'll use our custom eraser cursor
			break;
		default:
			canvas.style.cursor = "default";
	}
}
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

	// Eraser width slider
	const eraserWidthSlider = document.getElementById("eraser-width-slider");
	const eraserWidthValue = document.getElementById("eraser-width-value");

	if (eraserWidthSlider && eraserWidthValue) {
		eraserWidthSlider.addEventListener("input", function () {
			toolSettings.eraser.width = parseInt(this.value);
			eraserWidthValue.textContent = this.value;

			// Update cursor size if visible
			if (currentTool === "eraser" && eraserCursor) {
				const coords = getCoordinates({
					clientX: lastX,
					clientY: lastY,
				});
				updateEraserCursor(
					coords.x,
					coords.y,
					toolSettings.eraser.width
				);
			}
		});
	}

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

			// Update cursor based on selected tool
			if (currentTool === "select") {
				canvas.style.cursor = "crosshair";
			} else {
				canvas.style.cursor = "default";
				removeSelectionBox();
			}
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
	// Update eraser width display if it exists
	const eraserWidthSlider = document.getElementById("eraser-width-slider");
	const eraserWidthValue = document.getElementById("eraser-width-value");
	if (eraserWidthSlider && eraserWidthValue) {
		eraserWidthSlider.value = toolSettings.eraser.width;
		eraserWidthValue.textContent = toolSettings.eraser.width;
	}
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

	createEraserCursor();

	// Key events for selection
	document.addEventListener("keydown", function (e) {
		if (selectionBox && currentTool === "select") {
			if (e.key === "Delete" || e.key === "Backspace") {
				removeSelectionBox();
			} else if (e.key === "Escape") {
				removeSelectionBox();
			}
		}
	});
}

function startDrawing(e) {
	if (currentTool === "select") {
		startSelection(e);
		return;
	}

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
		// Show and update eraser cursor
		if (!eraserCursor) createEraserCursor();
		eraserCursor.style.display = "block";
		updateEraserCursor(lastX, lastY, toolSettings.eraser.width);
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
	if (currentTool === "select" && isSelecting) {
		updateSelection(e);
		return;
	}

	if (!isDrawing) {
		// Update eraser cursor position even when not drawing
		if (currentTool === "eraser") {
			const coords = getCoordinates(e);
			if (!eraserCursor) createEraserCursor();
			eraserCursor.style.display = "block";
			updateEraserCursor(coords.x, coords.y, toolSettings.eraser.width);
		}
		return;
	}

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
		// Update eraser cursor position
		updateEraserCursor(currentX, currentY, toolSettings.eraser.width);
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

function stopDrawing() {
	if (currentTool === "select" && isSelecting) {
		finishSelection();
		return;
	}

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
	if (currentTool !== "eraser" && eraserCursor) {
		eraserCursor.style.display = "none";
	}

	// Reset global alpha for marker
	ctx.globalAlpha = 1.0;

	// Save to history
	saveToHistory();
}

// Selection Tool Functions
function startSelection(e) {
	removeSelectionBox();

	isSelecting = true;
	const coords = getCoordinates(e);
	selectionStartX = coords.x;
	selectionStartY = coords.y;

	// Create a temporary selection box
	selectionBox = document.createElement("div");
	selectionBox.className = "selection-box";
	selectionBox.style.position = "absolute";
	selectionBox.style.border = "2px dashed " + toolSettings.select.color;
	selectionBox.style.pointerEvents = "none";
	selectionBox.style.left = selectionStartX + "px";
	selectionBox.style.top = selectionStartY + "px";
	selectionBox.style.width = "0";
	selectionBox.style.height = "0";

	document.getElementById("canvas-container").appendChild(selectionBox);
}

function updateSelection(e) {
	if (!isSelecting) return;

	const coords = getCoordinates(e);
	const currentX = coords.x;
	const currentY = coords.y;

	const width = currentX - selectionStartX;
	const height = currentY - selectionStartY;

	// Update selection box dimensions
	selectionBox.style.left = (width < 0 ? currentX : selectionStartX) + "px";
	selectionBox.style.top = (height < 0 ? currentY : selectionStartY) + "px";
	selectionBox.style.width = Math.abs(width) + "px";
	selectionBox.style.height = Math.abs(height) + "px";
}

function finishSelection() {
	if (!isSelecting) return;
	isSelecting = false;

	const width = parseInt(selectionBox.style.width);
	const height = parseInt(selectionBox.style.height);

	// Only create a selection if it's large enough
	if (width > 10 && height > 10) {
		// Get the selected area
		const x = parseInt(selectionBox.style.left);
		const y = parseInt(selectionBox.style.top);

		// Store the selected area data
		selectedArea = {
			x: x,
			y: y,
			width: width,
			height: height,
			imageData: ctx.getImageData(x, y, width, height),
			originalData: ctx.getImageData(x, y, width, height), // Keep an original copy
		};

		// Make the selection box interactive
		selectionBox.style.pointerEvents = "auto";
		selectionBox.style.cursor = "move";

		// Save the complete canvas state before clearing the selection area
		const fullCanvasData = ctx.getImageData(
			0,
			0,
			canvas.width,
			canvas.height
		);
		selectedArea.backgroundState = fullCanvasData;

		// Clear the selected area from the canvas to remove the original content
		ctx.clearRect(x, y, width, height);

		// Draw the selected content inside the selection box as a preview
		drawSelectedContent();

		// Add resize handles
		addResizeHandles(selectionBox);

		// Add event listeners for dragging
		selectionBox.addEventListener("mousedown", startDragSelection);
	} else {
		// Remove the selection if it's too small
		removeSelectionBox();
	}
}
function startDragSelection(e) {
	if (e.target.classList.contains("resize-handle")) return;

	isDraggingSelection = true;
	lastSelectX = e.clientX;
	lastSelectY = e.clientY;

	// Store the canvas state at the start of dragging
	if (selectedArea) {
		// Restore the canvas to the state without the selection
		ctx.putImageData(selectedArea.backgroundState, 0, 0);
	}

	document.addEventListener("mousemove", dragSelection);
	document.addEventListener("mouseup", stopResizeOrDrag);
}
// New function to draw the selected content
function drawSelectedContent() {
	if (!selectedArea) return;

	// Draw the selected content at its current position
	ctx.putImageData(
		selectedArea.imageData,
		selectedArea.x,
		selectedArea.y,
		0,
		0,
		selectedArea.width,
		selectedArea.height
	);
}
// New function to save the background state
function saveBackgroundBeforeSelection(x, y, width, height) {
	// Save canvas state before selection for background restoration
	selectedArea.backgroundState = ctx.getImageData(
		0,
		0,
		canvas.width,
		canvas.height
	);

	// Clear the selected area from the canvas to avoid duplication
	ctx.clearRect(x, y, width, height);

	// Draw the selection on top for preview
	drawSelectedContent();
}

function addResizeHandles(selectionBox) {
	const handles = ["n", "ne", "e", "se", "s", "sw", "w", "nw"];

	handles.forEach((position) => {
		const handle = document.createElement("div");
		handle.className = `resize-handle resize-${position}`;
		handle.style.position = "absolute";
		handle.style.width = "10px";
		handle.style.height = "10px";
		handle.style.backgroundColor = toolSettings.select.color;
		handle.style.borderRadius = "50%";
		handle.style.zIndex = "10";

		// Position the handle based on its location
		switch (position) {
			case "n":
				handle.style.top = "-5px";
				handle.style.left = "50%";
				handle.style.transform = "translateX(-50%)";
				handle.style.cursor = "ns-resize";
				break;
			case "ne":
				handle.style.top = "-5px";
				handle.style.right = "-5px";
				handle.style.cursor = "nesw-resize";
				break;
			case "e":
				handle.style.right = "-5px";
				handle.style.top = "50%";
				handle.style.transform = "translateY(-50%)";
				handle.style.cursor = "ew-resize";
				break;
			case "se":
				handle.style.bottom = "-5px";
				handle.style.right = "-5px";
				handle.style.cursor = "nwse-resize";
				break;
			case "s":
				handle.style.bottom = "-5px";
				handle.style.left = "50%";
				handle.style.transform = "translateX(-50%)";
				handle.style.cursor = "ns-resize";
				break;
			case "sw":
				handle.style.bottom = "-5px";
				handle.style.left = "-5px";
				handle.style.cursor = "nesw-resize";
				break;
			case "w":
				handle.style.left = "-5px";
				handle.style.top = "50%";
				handle.style.transform = "translateY(-50%)";
				handle.style.cursor = "ew-resize";
				break;
			case "nw":
				handle.style.top = "-5px";
				handle.style.left = "-5px";
				handle.style.cursor = "nwse-resize";
				break;
		}

		handle.setAttribute("data-resize", position);
		selectionBox.appendChild(handle);

		// Add event listener for resize
		handle.addEventListener("mousedown", function (e) {
			e.stopPropagation();
			isResizingSelection = true;
			resizeHandle = position;
			lastSelectX = e.clientX;
			lastSelectY = e.clientY;
			document.addEventListener("mousemove", resizeSelection);
			document.addEventListener("mouseup", stopResizeOrDrag);
		});
	});
}

function dragSelection(e) {
	if (!isDraggingSelection || !selectionBox || !selectedArea) return;

	const dx = e.clientX - lastSelectX;
	const dy = e.clientY - lastSelectY;

	// First, restore the canvas to the background state (without selection)
	if (selectedArea.backgroundState) {
		ctx.putImageData(selectedArea.backgroundState, 0, 0);
	}

	// Update selection box position
	const currentLeft = parseInt(selectionBox.style.left) || 0;
	const currentTop = parseInt(selectionBox.style.top) || 0;

	selectionBox.style.left = currentLeft + dx + "px";
	selectionBox.style.top = currentTop + dy + "px";

	// Update selected area position
	selectedArea.x += dx;
	selectedArea.y += dy;

	// Draw the selected content at the new position
	drawSelectedContent();

	lastSelectX = e.clientX;
	lastSelectY = e.clientY;
}

function dragSelection(e) {
	if (!isDraggingSelection || !selectionBox) return;

	const dx = e.clientX - lastSelectX;
	const dy = e.clientY - lastSelectY;

	const currentLeft = parseInt(selectionBox.style.left) || 0;
	const currentTop = parseInt(selectionBox.style.top) || 0;

	selectionBox.style.left = currentLeft + dx + "px";
	selectionBox.style.top = currentTop + dy + "px";

	lastSelectX = e.clientX;
	lastSelectY = e.clientY;

	// Update selected area position
	if (selectedArea) {
		selectedArea.x += dx;
		selectedArea.y += dy;
	}
}

function resizeSelection(e) {
	if (!isResizingSelection || !selectionBox || !selectedArea) return;

	const dx = e.clientX - lastSelectX;
	const dy = e.clientY - lastSelectY;

	// First, restore the canvas to the background state
	if (selectedArea.backgroundState) {
		ctx.putImageData(selectedArea.backgroundState, 0, 0);
	}

	const selRect = selectionBox.getBoundingClientRect();
	let newWidth = selRect.width;
	let newHeight = selRect.height;
	let newLeft = parseInt(selectionBox.style.left);
	let newTop = parseInt(selectionBox.style.top);

	// Handle resize based on which handle was grabbed
	switch (resizeHandle) {
		case "n":
			newTop += dy;
			newHeight -= dy;
			break;
		case "ne":
			newTop += dy;
			newHeight -= dy;
			newWidth += dx;
			break;
		case "e":
			newWidth += dx;
			break;
		case "se":
			newWidth += dx;
			newHeight += dy;
			break;
		case "s":
			newHeight += dy;
			break;
		case "sw":
			newLeft += dx;
			newWidth -= dx;
			newHeight += dy;
			break;
		case "w":
			newLeft += dx;
			newWidth -= dx;
			break;
		case "nw":
			newLeft += dx;
			newTop += dy;
			newWidth -= dx;
			newHeight -= dy;
			break;
	}

	// Enforce minimum size
	if (newWidth < 20) newWidth = 20;
	if (newHeight < 20) newHeight = 20;

	// Apply the new dimensions to the selection box
	selectionBox.style.width = newWidth + "px";
	selectionBox.style.height = newHeight + "px";
	selectionBox.style.left = newLeft + "px";
	selectionBox.style.top = newTop + "px";

	// Create a new, resized version of the image data
	const tempCanvas = document.createElement("canvas");
	const tempCtx = tempCanvas.getContext("2d");
	tempCanvas.width = selectedArea.originalData.width;
	tempCanvas.height = selectedArea.originalData.height;

	// Put the original image data on the temp canvas
	tempCtx.putImageData(selectedArea.originalData, 0, 0);

	// Create another temp canvas for the resized image
	const resizedCanvas = document.createElement("canvas");
	const resizedCtx = resizedCanvas.getContext("2d");
	resizedCanvas.width = newWidth;
	resizedCanvas.height = newHeight;

	// Draw the original image to the resized canvas with scaling
	resizedCtx.drawImage(tempCanvas, 0, 0, newWidth, newHeight);

	// Update the selected area data
	selectedArea.x = newLeft;
	selectedArea.y = newTop;
	selectedArea.width = newWidth;
	selectedArea.height = newHeight;
	selectedArea.imageData = resizedCtx.getImageData(0, 0, newWidth, newHeight);

	// Draw the resized content
	drawSelectedContent();

	lastSelectX = e.clientX;
	lastSelectY = e.clientY;
}

function stopResizeOrDrag() {
	if (isDraggingSelection || isResizingSelection) {
		// Keep the selection active but update the background state
		if (selectedArea) {
			// Update the background state to include everything except the selection
			let newBackgroundState = ctx.getImageData(
				0,
				0,
				canvas.width,
				canvas.height
			);

			// Clear the selection area from the background (to avoid doubling content)
			ctx.putImageData(newBackgroundState, 0, 0);
			ctx.clearRect(
				selectedArea.x,
				selectedArea.y,
				selectedArea.width,
				selectedArea.height
			);

			// Update the background state without the selection
			selectedArea.backgroundState = ctx.getImageData(
				0,
				0,
				canvas.width,
				canvas.height
			);

			// Redraw the selected content
			drawSelectedContent();
		}
	}

	isDraggingSelection = false;
	isResizingSelection = false;
	document.removeEventListener("mousemove", dragSelection);
	document.removeEventListener("mousemove", resizeSelection);
	document.removeEventListener("mouseup", stopResizeOrDrag);
}

function removeSelectionBox() {
	if (selectionBox) {
		if (selectedArea) {
			// Make sure the selected content stays on the canvas
			drawSelectedContent();
		}
		selectionBox.remove();
		selectionBox = null;
		selectedArea = null;
		// Save the state
		saveToHistory();
	}
	isSelecting = false;
	isDraggingSelection = false;
	isResizingSelection = false;
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

function getCoordinates(e) {
	let x, y;

	// Handle both mouse and touch events
	if (e.type.includes("touch")) {
		const touch = e.touches[0] || e.changedTouches[0];
		const rect = canvas.getBoundingClientRect();
		x = touch.clientX - rect.left;
		y = touch.clientY - rect.top;
	} else {
		const rect = canvas.getBoundingClientRect();
		x = e.clientX - rect.left;
		y = e.clientY - rect.top;
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

// Create a visual indicator for the eraser tool
function createEraserCursor() {
	eraserCursor = document.createElement("div");
	eraserCursor.id = "eraser-cursor";
	eraserCursor.style.position = "absolute";
	eraserCursor.style.border = "1px solid #999";
	eraserCursor.style.borderRadius = "50%";
	eraserCursor.style.backgroundColor = "rgba(200, 200, 200, 0.3)";
	eraserCursor.style.pointerEvents = "none";
	eraserCursor.style.display = "none";
	eraserCursor.style.zIndex = "1000";
	eraserCursor.style.transform = "translate(-50%, -50%)";
	document.getElementById("canvas-container").appendChild(eraserCursor);
}
// Add this function to update the eraser cursor
function updateEraserCursor(x, y, size) {
	if (!eraserCursor) return;

	eraserCursor.style.width = size + "px";
	eraserCursor.style.height = size + "px";
	eraserCursor.style.left = x + "px";
	eraserCursor.style.top = y + "px";
	eraserCursor.style.borderWidth = Math.max(1, size / 10) + "px";
}
