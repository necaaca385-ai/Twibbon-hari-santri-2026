/**
 * TWIBBON GENERATOR TPQ BAITUR-RAHMAN
 * HARI SANTRI NASIONAL 2026
 * Mengelola HTML5 Canvas, Drag & Drop, Slider Zoom, Pinch Gesture, dan Export PNG
 */

(function () {
  'use strict';

  // --- 1. DOM Elements ---
  const canvas = document.getElementById('twibbonCanvas');
  const ctx = canvas.getContext('2d');
  const canvasContainer = document.getElementById('canvasContainer');
  const canvasPlaceholder = document.getElementById('canvasPlaceholder');
  const dragHint = document.getElementById('dragHint');

  const photoInput = document.getElementById('photoInput');
  const btnUploadPhoto = document.getElementById('btnUploadPhoto');
  const btnTriggerUpload = document.getElementById('btnTriggerUpload');

  const zoomSlider = document.getElementById('zoomSlider');
  const zoomValue = document.getElementById('zoomValue');
  const btnZoomIn = document.getElementById('btnZoomIn');
  const btnZoomOut = document.getElementById('btnZoomOut');

  const btnRotate = document.getElementById('btnRotate');
  const btnFlip = document.getElementById('btnFlip');
  const btnCenter = document.getElementById('btnCenter');
  const btnReset = document.getElementById('btnReset');

  const btnDownload = document.getElementById('btnDownload');
  const downloadInfo = document.getElementById('downloadInfo');

  const toastContainer = document.getElementById('toastContainer');
  const toastMessage = document.getElementById('toastMessage');
  const toastText = document.getElementById('toastText');

  // --- 2. Canvas & Transform State ---
  let canvasWidth = 1024;
  let canvasHeight = 1024;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  let frameImg = new Image();
  let userImg = null;
  let isFrameLoaded = false;

  // Center coordinate of the transparent circular cutout
  // In the Baitur-Rahman frame: circle is at (~508, ~315) on a 1024x1024 canvas
  let cutoutCenterX = 508;
  let cutoutCenterY = 315;

  // Photo transform parameters
  const state = {
    x: 0,              // Center offset X (in canvas units)
    y: 0,              // Center offset Y (in canvas units)
    defaultX: 0,       // Default alignment to circle center
    defaultY: 0,
    scale: 1.0,        // Zoom factor
    baseScale: 1.0,    // Initial scale to fit photo attractively
    rotation: 0,       // Angle in degrees (0, 90, 180, 270)
    flipH: false,      // Mirrored horizontally
  };

  // Dragging & Pinch State
  let isDragging = false;
  let dragStartPos = { x: 0, y: 0 };
  let photoStartPos = { x: 0, y: 0 };
  let initialPinchDistance = 0;
  let initialPinchScale = 1.0;

  // --- 3. Initial Frame Loading ---
  function initFrame() {
    const isFileProtocol = window.location.protocol === 'file:';

    frameImg.onload = function () {
      isFrameLoaded = true;
      if (frameImg.naturalWidth && frameImg.naturalHeight) {
        canvasWidth = frameImg.naturalWidth;
        canvasHeight = frameImg.naturalHeight;
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        // Proporsikan titik lubang twibbon
        cutoutCenterX = Math.round(canvasWidth * 0.496);
        cutoutCenterY = Math.round(canvasHeight * 0.315);
      }
      render();
    };

    frameImg.onerror = function () {
      console.warn('Gagal memuat frame.png langsung, menggunakan data cadangan...');
      if (typeof DEFAULT_FRAME_DATA !== 'undefined' && DEFAULT_FRAME_DATA) {
        frameImg.src = DEFAULT_FRAME_DATA;
      } else {
        showToast('Frame gagal dimuat. Anda dapat mengunggah frame PNG secara manual.');
      }
    };

    // Saat dibuka langsung via file://, browser memblokir export canvas jika gambar dimuat langsung.
    // Menggunakan DEFAULT_FRAME_DATA (base64) menjamin export PNG berhasil 100% tanpa error CORS.
    if (isFileProtocol && typeof DEFAULT_FRAME_DATA !== 'undefined' && DEFAULT_FRAME_DATA) {
      frameImg.src = DEFAULT_FRAME_DATA;
    } else {
      frameImg.src = 'frame.png';
    }
  }

  // --- 4. Render Engine ---
  function render() {
    // 1. Bersihkan canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // 2. Gambar background putih bersih
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // 3. Gambar foto santri di bawah bingkai (Layer 1)
    if (userImg) {
      ctx.save();

      // Pindahkan titik pusat ke canvas center + offset
      const posX = (canvasWidth / 2) + state.x;
      const posY = (canvasHeight / 2) + state.y;
      ctx.translate(posX, posY);

      // Rotasi
      ctx.rotate((state.rotation * Math.PI) / 180);

      // Skala (dengan opsi flip horizontal)
      const scaleX = (state.flipH ? -1 : 1) * state.scale;
      const scaleY = state.scale;
      ctx.scale(scaleX, scaleY);

      // Gambar foto terpusat di titik (0, 0)
      ctx.drawImage(
        userImg,
        -userImg.width / 2,
        -userImg.height / 2,
        userImg.width,
        userImg.height
      );

      ctx.restore();
    }

    // 4. Gambar Frame TPQ Baitur-Rahman transparan di atas foto (Layer 2)
    if (isFrameLoaded && frameImg.complete && frameImg.naturalWidth !== 0) {
      ctx.drawImage(frameImg, 0, 0, canvasWidth, canvasHeight);
    }
  }

  // --- 5. User Photo Upload Handler ---
  function handlePhotoUpload(file) {
    if (!file || !file.type.startsWith('image/')) {
      showToast('Harap pilih file gambar (JPG, PNG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      const img = new Image();
      img.onload = function () {
        userImg = img;

        // Target ukuran lubang lingkaran twibbon (sekitar 620px)
        const targetSize = 620;
        const scaleToFit = targetSize / Math.min(img.width, img.height);
        state.baseScale = Math.max(0.2, Math.min(scaleToFit, 3.0));
        state.scale = state.baseScale;

        // Posisikan foto pas di tengah lubang lingkaran twibbon
        state.defaultX = cutoutCenterX - (canvasWidth / 2);
        state.defaultY = cutoutCenterY - (canvasHeight / 2);
        state.x = state.defaultX;
        state.y = state.defaultY;

        state.rotation = 0;
        state.flipH = false;

        // Update Slider
        zoomSlider.min = (state.baseScale * 0.25).toFixed(2);
        zoomSlider.max = (state.baseScale * 3.5).toFixed(2);
        zoomSlider.value = state.scale.toFixed(2);
        updateZoomLabel();

        // Aktifkan tombol kontrol
        enableControls(true);

        // Sembunyikan placeholder & tampilkan tips drag
        canvasPlaceholder.classList.add('hidden');
        showDragHintTemporarily();

        render();
        showToast('Foto santri berhasil dimuat! Geser untuk menyesuaikan.');
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  // --- 6. Mouse & Touch Dragging ---
  function getCanvasCoords(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const factorX = canvasWidth / rect.width;
    const factorY = canvasHeight / rect.height;
    return {
      x: (clientX - rect.left) * factorX,
      y: (clientY - rect.top) * factorY,
    };
  }

  function startDrag(clientX, clientY) {
    if (!userImg) return;
    isDragging = true;
    dragStartPos = getCanvasCoords(clientX, clientY);
    photoStartPos = { x: state.x, y: state.y };
  }

  function moveDrag(clientX, clientY) {
    if (!isDragging || !userImg) return;
    const currentPos = getCanvasCoords(clientX, clientY);
    const deltaX = currentPos.x - dragStartPos.x;
    const deltaY = currentPos.y - dragStartPos.y;

    state.x = photoStartPos.x + deltaX;
    state.y = photoStartPos.y + deltaY;

    requestAnimationFrame(render);
  }

  function endDrag() {
    isDragging = false;
  }

  // Mouse Listeners
  canvas.addEventListener('mousedown', function (e) {
    if (e.button === 0) {
      startDrag(e.clientX, e.clientY);
    }
  });

  window.addEventListener('mousemove', function (e) {
    if (isDragging) {
      moveDrag(e.clientX, e.clientY);
    }
  });

  window.addEventListener('mouseup', function () {
    if (isDragging) {
      endDrag();
    }
  });

  // Touch Listeners (Mobile Drag & Pinch to Zoom)
  canvas.addEventListener('touchstart', function (e) {
    if (!userImg) return;
    e.preventDefault();

    if (e.touches.length === 1) {
      const touch = e.touches[0];
      startDrag(touch.clientX, touch.clientY);
    } else if (e.touches.length === 2) {
      isDragging = false;
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      initialPinchDistance = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      initialPinchScale = state.scale;
    }
  }, { passive: false });

  canvas.addEventListener('touchmove', function (e) {
    if (!userImg) return;
    e.preventDefault();

    if (e.touches.length === 1 && isDragging) {
      const touch = e.touches[0];
      moveDrag(touch.clientX, touch.clientY);
    } else if (e.touches.length === 2 && initialPinchDistance > 0) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const currentDistance = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      const ratio = currentDistance / initialPinchDistance;

      let newScale = initialPinchScale * ratio;
      const minScale = parseFloat(zoomSlider.min) || 0.1;
      const maxScale = parseFloat(zoomSlider.max) || 4.0;
      newScale = Math.max(minScale, Math.min(maxScale, newScale));

      state.scale = newScale;
      zoomSlider.value = newScale.toFixed(2);
      updateZoomLabel();
      requestAnimationFrame(render);
    }
  }, { passive: false });

  canvas.addEventListener('touchend', function (e) {
    if (e.touches.length === 0) {
      endDrag();
      initialPinchDistance = 0;
    } else if (e.touches.length === 1) {
      const touch = e.touches[0];
      startDrag(touch.clientX, touch.clientY);
      initialPinchDistance = 0;
    }
  });

  canvas.addEventListener('touchcancel', function () {
    endDrag();
    initialPinchDistance = 0;
  });

  // Mouse Wheel Zoom
  canvas.addEventListener('wheel', function (e) {
    if (!userImg) return;
    e.preventDefault();
    const zoomDelta = e.deltaY < 0 ? 0.05 : -0.05;
    applyZoomDelta(zoomDelta);
  }, { passive: false });

  // --- 8. Zoom Slider & Buttons ---
  function updateZoomLabel() {
    if (!userImg) {
      zoomValue.textContent = '100%';
      return;
    }
    const percent = Math.round((state.scale / state.baseScale) * 100);
    zoomValue.textContent = `${percent}%`;
  }

  function applyZoomDelta(delta) {
    if (!userImg) return;
    let newScale = state.scale + delta;
    const minScale = parseFloat(zoomSlider.min);
    const maxScale = parseFloat(zoomSlider.max);
    newScale = Math.max(minScale, Math.min(maxScale, newScale));

    state.scale = newScale;
    zoomSlider.value = newScale.toFixed(2);
    updateZoomLabel();
    requestAnimationFrame(render);
  }

  zoomSlider.addEventListener('input', function () {
    if (!userImg) return;
    state.scale = parseFloat(this.value);
    updateZoomLabel();
    requestAnimationFrame(render);
  });

  btnZoomIn.addEventListener('click', function () {
    applyZoomDelta(0.1);
  });

  btnZoomOut.addEventListener('click', function () {
    applyZoomDelta(-0.1);
  });

  // --- 9. Transform Actions (Rotate, Flip, Center, Reset) ---
  btnRotate.addEventListener('click', function () {
    if (!userImg) return;
    state.rotation = (state.rotation + 90) % 360;
    render();
    showToast(`Diputar: ${state.rotation}°`);
  });

  btnFlip.addEventListener('click', function () {
    if (!userImg) return;
    state.flipH = !state.flipH;
    render();
    showToast(state.flipH ? 'Foto dicerminkan (Horizontal)' : 'Cermin dinonaktifkan');
  });

  btnCenter.addEventListener('click', function () {
    if (!userImg) return;
    state.x = state.defaultX;
    state.y = state.defaultY;
    render();
    showToast('Posisi foto dipusatkan ke lubang twibbon');
  });

  btnReset.addEventListener('click', function () {
    if (!userImg) return;
    state.x = state.defaultX;
    state.y = state.defaultY;
    state.scale = state.baseScale;
    state.rotation = 0;
    state.flipH = false;
    zoomSlider.value = state.scale.toFixed(2);
    updateZoomLabel();
    render();
    showToast('Pengaturan foto direset ke semula');
  });

  // --- 9. File Input Triggers & Drag-Drop into Window ---
  btnUploadPhoto.addEventListener('click', () => photoInput.click());
  btnTriggerUpload.addEventListener('click', () => photoInput.click());

  photoInput.addEventListener('change', function (e) {
    if (this.files && this.files[0]) {
      handlePhotoUpload(this.files[0]);
    }
  });

  // Drag and drop image file into canvas container
  ['dragenter', 'dragover'].forEach(eventName => {
    canvasContainer.addEventListener(eventName, function (e) {
      e.preventDefault();
      e.stopPropagation();
      canvasContainer.style.borderColor = 'var(--primary-600)';
    });
  });

  ['dragleave', 'drop'].forEach(eventName => {
    canvasContainer.addEventListener(eventName, function (e) {
      e.preventDefault();
      e.stopPropagation();
      canvasContainer.style.borderColor = '';
    });
  });

  canvasContainer.addEventListener('drop', function (e) {
    const dt = e.dataTransfer;
    if (dt && dt.files && dt.files.length > 0) {
      handlePhotoUpload(dt.files[0]);
    }
  });

  // --- 11. Download Handler ---
  btnDownload.addEventListener('click', function () {
    if (!userImg) {
      showToast('Silakan pilih foto terlebih dahulu!');
      return;
    }

    render();

    try {
      const now = new Date();
      const timestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
      const fileName = `twibbon-hari-santri-tpq-baiturrahman-${timestamp}.png`;

      if (canvas.toBlob) {
        canvas.toBlob(function (blob) {
          if (!blob) {
            fallbackDataUrlDownload(fileName);
            return;
          }
          const blobUrl = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
          showToast('Twibbon Hari Santri berhasil diunduh!');
        }, 'image/png');
      } else {
        fallbackDataUrlDownload(fileName);
      }
    } catch (err) {
      console.error('Download error:', err);
      showToast('Gagal mengunduh langsung: ' + err.message);
    }
  });

  function fallbackDataUrlDownload(fileName) {
    try {
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      showToast('Twibbon Hari Santri berhasil diunduh!');
    } catch (e) {
      alert('Perhatian: Browser membatasi unduhan otomatis saat membuka langsung lewat file://. Silakan klik kanan canvas dan pilih "Simpan Gambar Sebagai...".');
    }
  }

  // --- 12. UI Helpers ---
  function enableControls(enabled) {
    zoomSlider.disabled = !enabled;
    btnZoomIn.disabled = !enabled;
    btnZoomOut.disabled = !enabled;
    btnRotate.disabled = !enabled;
    btnFlip.disabled = !enabled;
    btnCenter.disabled = !enabled;
    btnReset.disabled = !enabled;
    btnDownload.disabled = !enabled;

    downloadInfo.textContent = enabled
      ? 'Foto siap! Klik tombol di atas untuk menyimpan ke perangkat Anda.'
      : 'Unggah foto terlebih dahulu untuk mengunduh hasil.';
  }

  let toastTimer = null;
  function showToast(message) {
    toastText.textContent = message;
    toastMessage.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastMessage.classList.remove('show');
    }, 3200);
  }

  function showDragHintTemporarily() {
    dragHint.classList.add('visible');
    setTimeout(() => {
      dragHint.classList.remove('visible');
    }, 3500);
  }

  function escapeHtml(str) {
    return str.replace(/[&<>'"]/g, tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag));
  }

  // --- 13. Init ---
  initFrame();
  render();

})();
