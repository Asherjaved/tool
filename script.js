window.addEventListener("load", () => {
    const loader = document.getElementById("loader");
    loader.style.display = "none";
});

/* Navigation Between Tools */
document.querySelectorAll('.tool-card').forEach(card => {
    card.addEventListener('click', () => {
        document.querySelectorAll('.tool').forEach(t => t.style.display = "none");
        const selected = document.getElementById(card.dataset.tool + 'Tool');
        if (selected) selected.style.display = "block";
        window.scrollTo({ top: selected.offsetTop - 70, behavior: 'smooth' });
    });
});

/* Word Counter */
const wordInput = document.getElementById('wordInput');
if (wordInput) {
    const wordCount = document.getElementById('wordCount');
    const charCount = document.getElementById('charCount');
    const sentenceCount = document.getElementById('sentenceCount');
    const clearBtn = document.getElementById('clearText');

    wordInput.addEventListener('input', () => {
        let text = wordInput.value.trim();
        let words = text ? text.split(/\s+/).length : 0;
        let chars = text.length;
        let sentences = text ? text.split(/[.!?]+/).filter(Boolean).length : 0;

        wordCount.textContent = words;
        charCount.textContent = chars;
        sentenceCount.textContent = sentences;
    });

    clearBtn.addEventListener('click', () => wordInput.value = '');
}

/* Image Compressor */
const imageInput = document.getElementById('imageInput');
if (imageInput) {
    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.getElementById('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0, img.width, img.height);
                const quality = 0.6;
                canvas.classList.remove('hidden');
                const compressed = canvas.toDataURL('image/jpeg', quality);
                const originalKB = (file.size / 1024).toFixed(2);
                const compressedKB = (compressed.length * 3 / 4 / 1024).toFixed(2);
                document.getElementById('compressInfo').innerHTML = `
                    Original: ${originalKB} KB<br>Compressed: ${compressedKB} KB
                `;
                const downloadBtn = document.getElementById('downloadCompressed');
                downloadBtn.classList.remove('hidden');
                downloadBtn.onclick = () => {
                    const link = document.createElement('a');
                    link.href = compressed;
                    link.download = 'compressed.jpg';
                    link.click();
                };
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    });
}

/* Case Converter */
function convertCase(type) {
    const input = document.getElementById('caseInput');
    let text = input.value;
    switch (type) {
        case 'upper': text = text.toUpperCase(); break;
        case 'lower': text = text.toLowerCase(); break;
        case 'sentence':
            text = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
            break;
        case 'capitalized':
            text = text.replace(/\b\w/g, c => c.toUpperCase());
            break;
    }
    input.value = text;
}

/* QR Code Generator */
const qrBtn = document.getElementById('generateQR');
if (qrBtn) {
    qrBtn.addEventListener('click', () => {
        const text = document.getElementById('qrText').value.trim();
        const qrDiv = document.getElementById('qrResult');
        qrDiv.innerHTML = '';
        if (!text) return;
        const canvas = document.createElement('canvas');
        QRCode.toCanvas(canvas, text, { width: 200 }, function() {
            qrDiv.appendChild(canvas);
            const downloadBtn = document.getElementById('downloadQR');
            downloadBtn.classList.remove('hidden');
            downloadBtn.onclick = () => {
                const link = document.createElement('a');
                link.href = canvas.toDataURL();
                link.download = 'qrcode.png';
                link.click();
            };
        });
    });
}

/* PDF Merge Tool */
const mergeBtn = document.getElementById('mergePDF');
if (mergeBtn) {
    mergeBtn.addEventListener('click', async () => {
        const files = document.getElementById('pdfInput').files;
        if (!files.length) return alert('Please upload PDFs first.');

        const { PDFDocument } = window.jspdf.jsPDF;
        const merged = new PDFDocument();

        const pdfDoc = await PDFLib.PDFDocument.create();
        for (const file of files) {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await PDFLib.PDFDocument.load(arrayBuffer);
            const pages = await pdfDoc.copyPages(pdf, pdf.getPageIndices());
            pages.forEach((page) => pdfDoc.addPage(page));
        }
        const mergedBytes = await pdfDoc.save();
        const blob = new Blob([mergedBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);

        const download = document.getElementById('downloadPDF');
        download.classList.remove('hidden');
        download.href = url;
    });
}
