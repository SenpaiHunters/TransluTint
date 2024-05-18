// MIT License
// Copyright (c) 2024 by Kami
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

// Developer Note:
// This software was developed by Kami. Please respect the terms of the license.
// Do not redistribute or use this software without proper attribution.
// You can find more about my work and connect with me through my social links:
// - GitHub: https://github.com/senpaihunters
// - Twitter: https://twitter.com/Kami_dev_
//

const elements = {
    blurAmount: document.getElementById('blurAmount'),
    brightnessAmount: document.getElementById('brightnessAmount'),
    lineWidth: document.getElementById('lineWidth'),
    lineSpacing: document.getElementById('lineSpacing'),
    glassOpacity: document.getElementById('glassOpacity'),
    imageContainer: document.getElementById('imageContainer'),
    imageInput: document.getElementById('file'),
    imageScale: document.getElementById('imageScale'),
};

function applyEffect() {
    const img = elements.imageContainer.querySelector('img');
    if (!img) {
        console.error('Image not found!');
        return;
    }

    const { blurAmount, brightnessAmount, lineWidth, lineSpacing, glassOpacity, imageScale } = elements;
    const filter = `blur(${blurAmount.value}px) brightness(${brightnessAmount.value})`;
    img.style.filter = filter;

    const scale = `scale(${imageScale.value})`;
    img.style.transform = scale;

    const styles = {
        '--blur-amount': `${blurAmount.value}px`,
        '--brightness-amount': brightnessAmount.value,
        '--line-width': `${lineWidth.value}px`,
        '--line-spacing': `${lineSpacing.value}px`,
        '--glass-opacity': glassOpacity.value,
    };

    Object.entries(styles).forEach(([key, value]) => elements.imageContainer.style.setProperty(key, value));
}

function resetDefaults() {
    elements.blurAmount.value = 5;
    elements.brightnessAmount.value = 0.7;
    elements.lineWidth.value = 1;
    elements.lineSpacing.value = 2;
    elements.glassOpacity.value = 0.1;
    elements.imageScale.value = 1;
    applyEffect();
}


elements.imageScale.addEventListener('input', applyEffect);

document.addEventListener('DOMContentLoaded', () => {
    Object.values(elements).forEach(element => {
        if (element.type === 'range' || element.type === 'number') {
            element.addEventListener('input', applyEffect);
        }
    });

    elements.imageInput.addEventListener('change', handleFileSelect);
    document.querySelector('button').addEventListener('click', resetDefaults);

    const fileUploadForm = document.querySelector('.file-upload-form');
    const dragText = document.querySelector('.file-upload-design span');

    const updateDragState = (isDragging) => {
        fileUploadForm.classList.toggle('drag-over', isDragging);
        dragText.textContent = isDragging ? "Let go and we'll take it from here" : "Browse files";
    };

    fileUploadForm.addEventListener('dragover', (event) => {
        event.preventDefault();
        updateDragState(true);
    });

    fileUploadForm.addEventListener('dragleave', (event) => {
        event.preventDefault();
        updateDragState(false);
    });

    fileUploadForm.addEventListener('drop', (event) => {
        event.preventDefault();
        updateDragState(false);
        handleFileSelect({ target: { files: event.dataTransfer.files } });
    });
});

function handleFileSelect(event) {
    const { files } = event.target;
    if (!files.length) {
        console.error("No files received.");
        return;
    }

    const [file] = files;
    const reader = new FileReader();
    reader.onload = e => {
        const img = new Image();
        img.onload = () => {
            elements.imageContainer.innerHTML = '';
            elements.imageContainer.appendChild(img);
            applyEffect();
            document.querySelector('.file-upload-form').classList.add('hidden');
            document.querySelector('.customization').classList.remove('hidden');
            document.getElementById('uploadNotice').style.display = 'none';
        };
        img.src = e.target.result;
    };
    reader.onerror = () => console.error('Error reading file');
    reader.readAsDataURL(file);
}