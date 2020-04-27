// If absolute URL from the remote server is provided, configure the CORS
// header on that server.
var url = 'https://timmi-on-rails.github.io/catalog/catalog.pdf';

// Loaded via <script> tag, create shortcut to access PDF.js exports.
var pdfjsLib = window['pdfjs-dist/build/pdf'];

// The workerSrc property shall be specified.
pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdf.worker.js';

var pdf = null;
var pageNumber = 1;

// Asynchronous download of PDF
var loadingTask = pdfjsLib.getDocument(url);
loadingTask.promise.then(function(_pdf) {
  console.log('PDF loaded');
  
  // Fetch the first page
  pdf = _pdf;
  renderCurrentPage()
  
}, function (reason) {
  // PDF loading error
  console.error(reason);
});

function renderCurrentPage() {
  pdf.getPage(pageNumber).then(function(page) {
    console.log('Page loaded');

    // Prepare canvas using PDF page dimensions
    var canvas = document.getElementById('the-canvas');
    var context = canvas.getContext('2d');
    var scale = 2;//window.screen.width / page.getViewport({scale: 1.0}).width;
    var viewport = page.getViewport({scale: scale});
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    // Render PDF page into canvas context
    var renderContext = {
      canvasContext: context,
      viewport: viewport
    };
    var renderTask = page.render(renderContext);
    renderTask.promise.then(function () {
      console.log('Page rendered');
    });
  });
}

function onPrevPage() {
  if (pageNumber <= 1) {
    return;
  }
  pageNumber--;
  renderCurrentPage();
}
document.getElementById('prev').addEventListener('click', onPrevPage);

function onNextPage() {
  if (pageNumber >= pdf.numPages) {
    return;
  }
  pageNumber++;
  renderCurrentPage();
}
document.getElementById('next').addEventListener('click', onNextPage);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js').then(registration => {
      console.log('SW registered: ', registration);
    }).catch(registrationError => {
      console.log('SW registration failed: ', registrationError);
    });
  });
}
