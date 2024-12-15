const form = document.querySelector("form"),
fileInput = document.querySelector(".file-input"), 
progressArea = document.querySelector(".progress-area"),
uploadedArea = document.querySelector(".uploaded-area"),
submitButton = document.querySelector(".submit-btn");

let uploadedFiles = []; // Store uploaded files

// File Input Trigger
form.addEventListener("click", () =>{
    fileInput.click();
});

// Handle File Input Change
fileInput.onchange = ({target})=>{
    let file = target.files[0];
    if(file){
        let fileName = file.name;
        if(fileName.length >= 12){
            let splitName = fileName.split('.');
            fileName = splitName[0].substring(0, 13) + "... ." + splitName[1];
        }
        uploadFile(fileName, file);
    }
}

// Upload File Function
function uploadFile(name, file){
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "php/upload.php");

    // Handle Progress
    xhr.upload.addEventListener("progress", ({loaded, total}) =>{
        let fileLoaded = Math.floor((loaded/total)*100);
        let fileSize = (total / 1024).toFixed(2) + " KB";

        let progressHTML = `
            <li class="row">
                <i class="fas fa-file-alt"></i>
                <div class="content">
                    <div class="details">
                        <span class="name">${name} * Uploading</span>
                        <span class="percent">${fileLoaded}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress" style="width:${fileLoaded}%"></div>
                    </div>
                </div>
            </li>`;

        progressArea.innerHTML = progressHTML;

        if(loaded == total){
            uploadedFiles.push(name);
            progressArea.innerHTML = "";
            let uploadedHTML = `
                <li class="row">
                    <div class="content upload">
                        <i class="fas fa-file-alt"></i>
                        <div class="details">
                            <span class="name">${name} * Uploaded</span>
                            <span class="size">${fileSize}</span>
                        </div>
                    </div>
                    <span class="delete-btn" onclick="deleteFile(this, '${name}')">
                        <i class="fas fa-trash"></i>
                    </span>
                </li>`;
            uploadedArea.insertAdjacentHTML("afterbegin", uploadedHTML);
        }
    });

    let data = new FormData();
    data.append("file", file);
    xhr.send(data);
}

// Handle Submit Button
submitButton.addEventListener("click", () => {
    if (uploadedFiles.length > 0) {
        alert("Files submitted successfully!");
    } else {
        alert("No files to submit!");
    }
});

// Delete File Function
function deleteFile(element, fileName) {
    element.parentElement.remove();
    uploadedFiles = uploadedFiles.filter(file => file !== fileName);
}
