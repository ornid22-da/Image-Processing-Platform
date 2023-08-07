//------------------------------------------------------------------------
// Drag and drop image handling
//------------------------------------------------------------------------

var fileDrag = document.getElementById("file-drag");
var fileSelect = document.getElementById("file-upload");

// Add event listeners
fileDrag.addEventListener("dragover", fileDragHover, false);
fileDrag.addEventListener("dragleave", fileDragHover, false);
fileDrag.addEventListener("drop", fileSelectHandler, false);
fileSelect.addEventListener("change", fileSelectHandler, false);

function fileDragHover(e) {
  // prevent default behaviour
  e.preventDefault();
  e.stopPropagation();

  fileDrag.className = e.type === "dragover" ? "upload-box dragover" : "upload-box";
}

function fileSelectHandler(e) {
  // handle file selecting
  var files = e.target.files || e.dataTransfer.files;
  fileDragHover(e);
  for (var i = 0, f; (f = files[i]); i++) {
    previewFile(f);
  }
}

//------------------------------------------------------------------------
// Web page elements for functions to use
//------------------------------------------------------------------------

var imagePreview = document.getElementById("image-preview");
var imageDisplay1 = document.getElementById("image-display1");
var imageDisplay2 = document.getElementById("image-display2");
var imageDisplay3 = document.getElementById("image-display3");
var imageDisplay4 = document.getElementById("image-display4");
var uploadCaption = document.getElementById("upload-caption");
var predResult1 = document.getElementById("pred-result1");
var predResult2 = document.getElementById("pred-result2");
var predResult3 = document.getElementById("pred-result3");
var predResult4 = document.getElementById("pred-result4");
var loader = document.getElementById("loader");

//------------------------------------------------------------------------
// Main button events
//------------------------------------------------------------------------

function submitImage() {
  // action for the submit button
  console.log("submit");

  if (!imageDisplay1.src || !imageDisplay1.src.startsWith("data") || !imageDisplay2.src || !imageDisplay2.src.startsWith("data") || !imageDisplay3.src || !imageDisplay3.src.startsWith("data") || !imageDisplay4.src || !imageDisplay4.src.startsWith("data")) {
    window.alert("Please select an image before submit.");
    return;
  }

  loader.classList.remove("hidden");
  imageDisplay1.classList.add("loading");
  imageDisplay2.classList.add("loading");
  imageDisplay3.classList.add("loading");
  imageDisplay4.classList.add("loading");


  // call the predict function of the backend
  predictImage1(imageDisplay1.src);
  predictImage2(imageDisplay2.src);
  predictImage3(imageDisplay3.src);
  predictImage4(imageDisplay4.src);
}

function clearImage() {
  // reset selected files
  fileSelect.value = "";

  // remove image sources and hide them
  imagePreview.src = "";
  imageDisplay1.src = "";
  imageDisplay2.src = "";
  imageDisplay3.src = "";
  imageDisplay4.src = "";
  predResult1.innerHTML = "";
  predResult2.innerHTML = "";
  predResult3.innerHTML = "";
  predResult4.innerHTML = "";

  hide(imagePreview);
  hide(imageDisplay1);
  hide(imageDisplay2);
  hide(imageDisplay3);
  hide(imageDisplay4);
  hide(loader);
  hide(predResult1);
  hide(predResult2);
  hide(predResult3);
  hide(predResult4);
  show(uploadCaption);

  imageDisplay1.classList.remove("loading");
  imageDisplay2.classList.remove("loading");
  imageDisplay3.classList.remove("loading");
  imageDisplay4.classList.remove("loading");
}

function previewFile(file) {
  // show the preview of the image
  console.log(file.name);
  var fileName = encodeURI(file.name);

  var reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onloadend = () => {
    imagePreview.src = URL.createObjectURL(file);

    show(imagePreview);
    hide(uploadCaption);

    // reset
    predResult1.innerHTML = "";
    predResult2.innerHTML = "";
    predResult3.innerHTML = "";
    predResult4.innerHTML = "";
    imageDisplay1.classList.remove("loading");
    imageDisplay2.classList.remove("loading");
    imageDisplay3.classList.remove("loading");
    imageDisplay4.classList.remove("loading");

    displayImage(reader.result, "image-display1");
    displayImage(reader.result, "image-display2");
    displayImage(reader.result, "image-display3");
    displayImage(reader.result, "image-display4");
  };
}

//------------------------------------------------------------------------
// Helper functions
//------------------------------------------------------------------------

function predictImage1(image) {
  fetch("/predict1", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(image)
  })
    .then(resp => {
      if (resp.ok)
        resp.json().then(data => {
          displayResult1(data);
        });
    })
    .catch(err => {
      console.log("An error occured", err.message);
      window.alert("Oops! Something went wrong.");
    });
}

function predictImage2(image) {
  fetch("/predict2", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(image)
  })
    .then(resp => {
      if (resp.ok)
        resp.json().then(data => {
          displayResult2(data);
        });
    })
    .catch(err => {
      console.log("An error occured", err.message);
      window.alert("Oops! Something went wrong.");
    });
}

function predictImage3(image) {
  fetch("/predict3", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(image)
  })
    .then(resp => {
      if (resp.ok)
        resp.json().then(data => {
          displayResult3(data);
        });
    })
    .catch(err => {
      console.log("An error occured", err.message);
      window.alert("Oops! Something went wrong.");
    });
}

function predictImage4(image) {
  fetch("/predict4", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(image)
  })
    .then(resp => {
      if (resp.ok)
        resp.json().then(data => {
          displayResult4(data);
        });
    })
    .catch(err => {
      console.log("An error occured", err.message);
      window.alert("Oops! Something went wrong.");
    });
}

/*
function predictImage1(image) {
  fetch("/predict1", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({ image: image })
})
    .then(resp => {
        if (resp.ok)
            resp.json().then(data => {
                displayResult1(data.output_path);
            });
    })
    .catch(err => {
        console.log("An error occurred", err.message);
        window.alert("Oops! Something went wrong.");
    });
}

function predictImage2(image) {
  fetch("/predict2", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ image: image })
  })
    .then(resp => {
      if (resp.ok)
        resp.json().then(data => {
          displayResult2(data.output_path);
        });
    })
    .catch(err => {
      console.log("An error occured", err.message);
      window.alert("Oops! Something went wrong.");
    });
}

function predictImage3(image) {
  fetch("/predict3", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ image: image })
  })
    .then(resp => {
      if (resp.ok)
        resp.json().then(data => {
          displayResult3(data.output_path);
        });
    })
    .catch(err => {
      console.log("An error occured", err.message);
      window.alert("Oops! Something went wrong.");
    });
}

function predictImage4(image) {
  fetch("/predict4", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ image: image })
  })
    .then(resp => {
      if (resp.ok)
        resp.json().then(data => {
          displayResult4(data.output_path);
        });
    })
    .catch(err => {
      console.log("An error occured", err.message);
      window.alert("Oops! Something went wrong.");
    });
}
*/

function displayImage(image, id) {
  // display image on given id <img> element
  let display = document.getElementById(id);
  display.src = image;
  show(display);
}

function displayResult1(data) {
  // display the result
  // imageDisplay.classList.remove("loading");
  hide(loader);
  predResult1.innerHTML = data.result;
  show(predResult1);
}

function displayResult2(data) {
  // display the result
  // imageDisplay.classList.remove("loading");
  hide(loader);
  predResult2.innerHTML = data.result;
  show(predResult2);
}

function displayResult3(data) {
  // display the result
  // imageDisplay.classList.remove("loading");
  hide(loader);
  predResult3.innerHTML = data.result;
  show(predResult3);
}

function displayResult4(data) {
  // display the result
  // imageDisplay.classList.remove("loading");
  hide(loader);
  predResult4.innerHTML = data.result;
  show(predResult4);
}

/*

function displayResult1(data) {
  // display the result
  // imageDisplay.classList.remove("loading");
  hide(loader);
  hide(imageDisplay1);
  predResult1.innerHTML = `
      <h2>Segmented Image</h2>
      <img src="${outputPath}" alt="Segmented Image">
  `;
  show(predResult1);
}

function displayResult2(data) {
  // display the result
  // imageDisplay.classList.remove("loading");
  hide(loader);
  hide(imageDisplay2);
  predResult2.innerHTML = `
      <h2>Segmented Image</h2>
      <img src="${outputPath}" alt="Segmented Image">
  `;
  show(predResult2);
}

function displayResult3(data) {
  // display the result
  // imageDisplay.classList.remove("loading");
  hide(loader);
  hide(imageDisplay3);
  predResult3.innerHTML = `
      <h2>Segmented Image</h2>
      <img src="${outputPath}" alt="Segmented Image">
  `;
  show(predResult3);
}

function displayResult4(data) {
  // display the result
  // imageDisplay.classList.remove("loading");
  hide(loader);
  hide(imageDisplay4);
  predResult4.innerHTML = `
      <h2>Segmented Image</h2>
      <img src="${outputPath}" alt="Segmented Image">
  `;
  show(predResult4);
}

*/


function hide(el) {
  // hide an element
  el.classList.add("hidden");
}

function show(el) {
  // show an element
  el.classList.remove("hidden");
}