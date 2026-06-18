const DB_NAME = "ccc-local-mvp";
const DB_VERSION = 1;
const STORE_NAME = "entries";
const BACKUP_VERSION = 3;
const API_KEY_STORAGE_KEY = "ccc-openai-api-key";
const API_MODEL_STORAGE_KEY = "ccc-openai-model";
const CLOUD_EMAIL_STORAGE_KEY = "ccc-cloud-email";
const CLOUD_CONFIG_URL = "/api/config";
const CLOUD_ENTRY_TABLE = "ccc_entries";
const CLOUD_PHOTO_BUCKET = "ccc-photos";

const categories = {
  food: {
    label: "음식",
    className: "food",
    coverIcon: "food",
    prompt: "음식 사진을 보고 음식명, 장소 맥락, 맛 메모 초안을 정리해줘.",
    fields: [
      { name: "foodName", label: "음식명", type: "text", placeholder: "예: 봉골레 파스타" },
      { name: "placeName", label: "장소명", type: "text", placeholder: "예: 작은 식당" },
      { name: "tasteNotes", label: "맛 메모", type: "textarea", wide: true, placeholder: "향, 식감, 온도, 인상" },
      {
        name: "priceRange",
        label: "가격대",
        type: "select",
        options: ["", "1만원 이하", "1~3만원", "3~5만원", "5만원 이상"]
      },
      {
        name: "revisit",
        label: "재방문",
        type: "select",
        options: ["", "예", "고민", "아니오"]
      }
    ]
  },
  wine: {
    label: "와인",
    className: "wine",
    coverIcon: "wine",
    prompt: "와인 라벨을 읽고 와인명, 생산지, 품종, 빈티지 후보를 채우고 테이스팅 노트 초안을 적어줘.",
    fields: [
      { name: "wineName", label: "와인명", type: "text", placeholder: "예: Chianti Classico" },
      { name: "region", label: "생산지", type: "text", placeholder: "예: Tuscany" },
      { name: "grape", label: "품종", type: "text", placeholder: "예: Sangiovese" },
      { name: "vintage", label: "빈티지", type: "text", placeholder: "예: 2020" },
      { name: "price", label: "가격", type: "text", placeholder: "예: 45,000원" },
      { name: "pairing", label: "페어링", type: "text", placeholder: "예: 스테이크" },
      { name: "aiTastingNote", label: "AI 테이스팅 노트", type: "textarea", wide: true, placeholder: "AI가 만든 초안" },
      { name: "myTastingNote", label: "내가 느낀 맛", type: "textarea", wide: true, placeholder: "실제로 느낀 향, 맛, 여운" },
      {
        name: "rating",
        label: "평점",
        type: "select",
        options: ["", "1", "2", "3", "4", "5"]
      }
    ]
  },
  culture: {
    label: "문화예술",
    className: "culture",
    coverIcon: "culture",
    prompt: "작품, 전시, 공연, 건축물의 기본 배경정보와 감상 정리용 키워드를 제안해줘.",
    fields: [
      { name: "workTitle", label: "작품명", type: "text", placeholder: "예: 전시명 또는 영화명" },
      { name: "creator", label: "작가/감독", type: "text", placeholder: "예: 작가 이름" },
      { name: "venue", label: "장소", type: "text", placeholder: "예: 미술관, 극장, 건축물" },
      {
        name: "genre",
        label: "분야",
        type: "select",
        options: ["", "전시", "공연", "영화", "책", "음악", "건축", "기타"]
      },
      { name: "backgroundNote", label: "배경정보", type: "textarea", wide: true, placeholder: "AI 조사/정리 결과를 다듬는 영역" },
      { name: "impressivePart", label: "인상 깊은 부분", type: "textarea", wide: true, placeholder: "장면, 문장, 작품, 공간감" },
      {
        name: "rating",
        label: "평점",
        type: "select",
        options: ["", "1", "2", "3", "4", "5"]
      }
    ]
  },
  math: {
    label: "수학문제",
    className: "math",
    coverIcon: "math",
    prompt: "수학문제 사진을 보고 단원, 문제 유형, 풀이 핵심, 설명이 어려운 지점을 요약해줘.",
    fields: [
      {
        name: "purpose",
        label: "사용 목적",
        type: "select",
        options: ["", "개인 공부", "학생 지도", "둘 다"]
      },
      { name: "unit", label: "단원", type: "text", placeholder: "예: 이차함수" },
      { name: "problemType", label: "문제 유형", type: "text", placeholder: "예: 그래프 해석" },
      {
        name: "difficulty",
        label: "난이도",
        type: "select",
        options: ["", "쉬움", "보통", "어려움", "매우 어려움"]
      },
      { name: "solutionIdea", label: "풀이 핵심", type: "textarea", wide: true, placeholder: "접근 방법과 핵심 아이디어" },
      { name: "mistakeReason", label: "오답/막힌 부분", type: "textarea", wide: true, placeholder: "헷갈린 개념, 계산 실수, 조건 누락" },
      { name: "teachingNote", label: "설명 보완 메모", type: "textarea", wide: true, placeholder: "다음 설명 포인트" },
      { name: "aiConversationSummary", label: "AI 대화 요약", type: "textarea", wide: true, placeholder: "AI와 정리한 풀이/설명 요약" },
      { name: "needSimilarProblems", label: "유사 문제 필요", type: "checkbox" }
    ]
  }
};

const allDetailKeys = [
  "foodName",
  "placeName",
  "tasteNotes",
  "priceRange",
  "revisit",
  "wineName",
  "region",
  "grape",
  "vintage",
  "price",
  "pairing",
  "aiTastingNote",
  "myTastingNote",
  "rating",
  "workTitle",
  "creator",
  "venue",
  "genre",
  "backgroundNote",
  "impressivePart",
  "purpose",
  "unit",
  "problemType",
  "difficulty",
  "solutionIdea",
  "mistakeReason",
  "teachingNote",
  "aiConversationSummary",
  "needSimilarProblems"
];

const fallbackAiState = {
  mode: "manual-button",
  categorySuggestion: null,
  summary: null,
  extractedInfo: null,
  userPromptHistory: [],
  lastAnalyzedAt: null
};

const fallbackExportState = {
  exportReady: false,
  exportTitle: ""
};

let db;
let entries = [];
let currentView = "home";
let selectedCategory = "food";
let activeAlbum = null;
let showingTrash = false;
let pendingPhotoBlob = null;
let pendingPhotoMetadata = null;
let photoItems = [];
let previewUrl = null;
let detailPhotoUrl = null;
let listPhotoUrls = [];
let albumPhotoUrls = [];
let photoStripUrls = [];
let detailGalleryUrls = [];
let categoryDrafts = {};
let latestAiDraft = null;
let toastTimer;
let cloudConfig = null;
let supabaseClient = null;
let cloudSession = null;
let cloudBusy = false;
let cloudAuthNotice = null;

const elements = {};

document.addEventListener("DOMContentLoaded", init);

async function init() {
  cacheElements();
  bindEvents();
  renderCategoryFields();
  seedAiPrompt();
  loadSavedApiSettings();
  initCloud();

  try {
    db = await openDatabase();
    await loadEntries();
    showToast("CCC 로컬 보관함이 준비되었습니다.");
  } catch (error) {
    console.error(error);
    showToast("로컬 저장소를 열 수 없습니다.");
  }

  registerServiceWorker();
}

function cacheElements() {
  elements.homeView = document.querySelector("#homeView");
  elements.albumView = document.querySelector("#albumView");
  elements.editorView = document.querySelector("#editorView");
  elements.backButton = document.querySelector("#backButton");
  elements.form = document.querySelector("#entryForm");
  elements.entryId = document.querySelector("#entryId");
  elements.editorTitle = document.querySelector("#editorTitle");
  elements.clearFormButton = document.querySelector("#clearFormButton");
  elements.cancelEditButton = document.querySelector("#cancelEditButton");
  elements.saveButton = document.querySelector("#saveButton");
  elements.homeCameraButton = document.querySelector("#homeCameraButton");
  elements.homeLibraryButton = document.querySelector("#homeLibraryButton");
  elements.albumCaptureButton = document.querySelector("#albumCaptureButton");
  elements.cameraButton = document.querySelector("#cameraButton");
  elements.libraryButton = document.querySelector("#libraryButton");
  elements.cameraInput = document.querySelector("#cameraInput");
  elements.libraryInput = document.querySelector("#libraryInput");
  elements.photoPreview = document.querySelector("#photoPreview");
  elements.photoPlaceholder = document.querySelector("#photoPlaceholder");
  elements.photoStrip = document.querySelector("#photoStrip");
  elements.clearPhotosButton = document.querySelector("#clearPhotosButton");
  elements.metadataPanel = document.querySelector("#metadataPanel");
  elements.categoryControl = document.querySelector("#categoryControl");
  elements.categoryDetailsTitle = document.querySelector("#categoryDetailsTitle");
  elements.categoryFields = document.querySelector("#categoryFields");
  elements.aiPromptInput = document.querySelector("#aiPromptInput");
  elements.apiKeyInput = document.querySelector("#apiKeyInput");
  elements.apiModelInput = document.querySelector("#apiModelInput");
  elements.rememberApiKeyInput = document.querySelector("#rememberApiKeyInput");
  elements.clearSavedApiKeyButton = document.querySelector("#clearSavedApiKeyButton");
  elements.runAiButton = document.querySelector("#runAiButton");
  elements.applyAiButton = document.querySelector("#applyAiButton");
  elements.checkAiServerButton = document.querySelector("#checkAiServerButton");
  elements.aiResult = document.querySelector("#aiResult");
  elements.titleInput = document.querySelector("#titleInput");
  elements.locationInput = document.querySelector("#locationInput");
  elements.capturedDateInput = document.querySelector("#capturedDateInput");
  elements.capturedTimeInput = document.querySelector("#capturedTimeInput");
  elements.quickCommentInput = document.querySelector("#quickCommentInput");
  elements.detailedCommentInput = document.querySelector("#detailedCommentInput");
  elements.reflectionInput = document.querySelector("#reflectionInput");
  elements.tagsInput = document.querySelector("#tagsInput");
  elements.albumGrid = document.querySelector("#albumGrid");
  elements.albumViewTitle = document.querySelector("#albumViewTitle");
  elements.entryList = document.querySelector("#entryList");
  elements.searchInput = document.querySelector("#searchInput");
  elements.totalCount = document.querySelector("#totalCount");
  elements.unfinishedCount = document.querySelector("#unfinishedCount");
  elements.todayCount = document.querySelector("#todayCount");
  elements.trashCount = document.querySelector("#trashCount");
  elements.cloudStatusBadge = document.querySelector("#cloudStatusBadge");
  elements.cloudSummaryCopy = document.querySelector("#cloudSummaryCopy");
  elements.cloudEmailInput = document.querySelector("#cloudEmailInput");
  elements.cloudEmailField = elements.cloudEmailInput?.closest(".field");
  elements.cloudEmailField?.classList.add("cloud-email-field");
  elements.cloudLoginButton = document.querySelector("#cloudLoginButton");
  elements.cloudRefreshButton = document.querySelector("#cloudRefreshButton");
  elements.cloudPushButton = document.querySelector("#cloudPushButton");
  elements.cloudPullButton = document.querySelector("#cloudPullButton");
  elements.cloudSignOutButton = document.querySelector("#cloudSignOutButton");
  elements.cloudNote = document.querySelector("#cloudNote");
  elements.exportBackupButton = document.querySelector("#exportBackupButton");
  elements.importBackupButton = document.querySelector("#importBackupButton");
  elements.backupInput = document.querySelector("#backupInput");
  elements.trashToggleButton = document.querySelector("#trashToggleButton");
  elements.detailDialog = document.querySelector("#detailDialog");
  elements.closeDetailButton = document.querySelector("#closeDetailButton");
  elements.detailCategory = document.querySelector("#detailCategory");
  elements.detailTitle = document.querySelector("#detailTitle");
  elements.detailDate = document.querySelector("#detailDate");
  elements.detailPhoto = document.querySelector("#detailPhoto");
  elements.detailGallery = document.querySelector("#detailGallery");
  elements.detailList = document.querySelector("#detailList");
  elements.activeDetailActions = document.querySelector("#activeDetailActions");
  elements.trashDetailActions = document.querySelector("#trashDetailActions");
  elements.editEntryButton = document.querySelector("#editEntryButton");
  elements.printPdfButton = document.querySelector("#printPdfButton");
  elements.saveOriginalButton = document.querySelector("#saveOriginalButton");
  elements.deleteEntryButton = document.querySelector("#deleteEntryButton");
  elements.restoreEntryButton = document.querySelector("#restoreEntryButton");
  elements.permanentDeleteButton = document.querySelector("#permanentDeleteButton");
  elements.toast = document.querySelector("#toast");
}

function bindEvents() {
  elements.backButton.addEventListener("click", handleBack);
  elements.form.addEventListener("submit", handleFormSubmit);
  elements.clearFormButton.addEventListener("click", () => resetForm());
  elements.cancelEditButton.addEventListener("click", () => {
    resetForm({ silent: true });
    if (activeAlbum) showAlbum(activeAlbum);
    else showHome();
  });
  elements.homeCameraButton.addEventListener("click", () => startNewCapture("camera"));
  elements.homeLibraryButton.addEventListener("click", () => startNewCapture("library"));
  elements.albumCaptureButton.addEventListener("click", () => startNewCapture("camera", activeAlbum));
  elements.cameraButton.addEventListener("click", () => elements.cameraInput.click());
  elements.libraryButton.addEventListener("click", () => elements.libraryInput.click());
  elements.clearPhotosButton.addEventListener("click", clearAllPhotos);
  elements.cameraInput.addEventListener("change", handlePhotoSelection);
  elements.libraryInput.addEventListener("change", handlePhotoSelection);
  elements.photoStrip.addEventListener("click", handlePhotoStripClick);
  elements.categoryControl.addEventListener("click", handleCategoryClick);
  elements.searchInput.addEventListener("input", renderEntries);
  elements.entryList.addEventListener("click", handleEntryListClick);
  elements.albumGrid.addEventListener("click", handleAlbumClick);
  elements.runAiButton.addEventListener("click", handleRunAi);
  elements.applyAiButton.addEventListener("click", applyAiDraft);
  elements.checkAiServerButton.addEventListener("click", checkAiServer);
  elements.rememberApiKeyInput.addEventListener("change", handleRememberApiKeyChange);
  elements.apiKeyInput.addEventListener("input", handleApiKeyInput);
  elements.clearSavedApiKeyButton.addEventListener("click", clearSavedApiKey);
  elements.cloudLoginButton.addEventListener("click", handleCloudLogin);
  elements.cloudRefreshButton.addEventListener("click", refreshCloudSession);
  elements.cloudPushButton.addEventListener("click", handleCloudPush);
  elements.cloudPullButton.addEventListener("click", handleCloudPull);
  elements.cloudSignOutButton.addEventListener("click", handleCloudSignOut);
  elements.exportBackupButton.addEventListener("click", handleExportBackup);
  elements.importBackupButton.addEventListener("click", () => elements.backupInput.click());
  elements.backupInput.addEventListener("change", handleImportBackup);
  elements.trashToggleButton.addEventListener("click", toggleTrashView);
  elements.closeDetailButton.addEventListener("click", closeDetailDialog);
  elements.editEntryButton.addEventListener("click", handleEditFromDetail);
  elements.printPdfButton.addEventListener("click", handlePrintPdf);
  elements.saveOriginalButton.addEventListener("click", handleSaveOriginalPhoto);
  elements.deleteEntryButton.addEventListener("click", handleMoveToTrash);
  elements.restoreEntryButton.addEventListener("click", handleRestoreEntry);
  elements.permanentDeleteButton.addEventListener("click", handlePermanentDelete);
  elements.detailDialog.addEventListener("close", clearDetailPhotoUrl);
}

function openDatabase() {
  return new Promise((resolve, reject) => {
    if (!("indexedDB" in window)) {
      reject(new Error("IndexedDB is not supported."));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        const store = database.createObjectStore(STORE_NAME, { keyPath: "id" });
        store.createIndex("category", "category", { unique: false });
        store.createIndex("createdAt", "createdAt", { unique: false });
        store.createIndex("updatedAt", "updatedAt", { unique: false });
        store.createIndex("deletedAt", "deletedAt", { unique: false });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function getStore(mode = "readonly") {
  return db.transaction(STORE_NAME, mode).objectStore(STORE_NAME);
}

function getAllEntries() {
  return new Promise((resolve, reject) => {
    const request = getStore().getAll();
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

function getEntry(id) {
  return new Promise((resolve, reject) => {
    const request = getStore().get(id);
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

function putEntry(entry) {
  return new Promise((resolve, reject) => {
    const request = getStore("readwrite").put(entry);
    request.onsuccess = () => resolve(entry);
    request.onerror = () => reject(request.error);
  });
}

function removeEntry(id) {
  return new Promise((resolve, reject) => {
    const request = getStore("readwrite").delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

async function loadEntries() {
  entries = await getAllEntries();
  entries.sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));
  renderHome();
  renderEntries();
}

function setView(view) {
  currentView = view;
  elements.homeView.classList.toggle("is-active", view === "home");
  elements.albumView.classList.toggle("is-active", view === "album");
  elements.editorView.classList.toggle("is-active", view === "editor");
  elements.backButton.hidden = view === "home";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showHome() {
  showingTrash = false;
  activeAlbum = null;
  elements.trashToggleButton.textContent = "휴지통";
  elements.searchInput.value = "";
  renderHome();
  setView("home");
}

function showAlbum(category) {
  showingTrash = false;
  activeAlbum = category;
  selectedCategory = category;
  updateCategoryButtons();
  seedAiPrompt();
  elements.albumViewTitle.textContent = `${getCategoryLabel(category)} 앨범`;
  elements.trashToggleButton.textContent = "휴지통";
  elements.searchInput.value = "";
  renderEntries();
  setView("album");
}

function showTrash() {
  showingTrash = true;
  activeAlbum = null;
  elements.albumViewTitle.textContent = "휴지통";
  elements.trashToggleButton.textContent = "보관함";
  elements.searchInput.value = "";
  renderEntries();
  setView("album");
}

function showEditor() {
  setView("editor");
}

function handleBack() {
  if (currentView === "editor" && activeAlbum) {
    showAlbum(activeAlbum);
    return;
  }
  showHome();
}

function startNewCapture(source, category = null) {
  resetForm({ silent: true });
  selectedCategory = category || "food";
  updateCategoryButtons();
  renderCategoryFields();
  seedAiPrompt();
  showEditor();
  if (source === "camera") elements.cameraInput.click();
  else elements.libraryInput.click();
}

function renderHome() {
  updateStats();
  renderAlbumGrid();
}

function renderAlbumGrid() {
  revokeAlbumPhotoUrls();
  elements.albumGrid.replaceChildren();

  Object.entries(categories).forEach(([key, config]) => {
    const albumEntries = entries.filter((entry) => entry.category === key && !entry.deletedAt);
    const latest = albumEntries.find((entry) => entry.photoBlob);
    const button = document.createElement("button");
    button.type = "button";
    button.className = `album-card ${config.className}`;
    button.dataset.album = key;

    const cover = document.createElement("div");
    cover.className = "album-cover";
    if (latest?.photoBlob) {
      const url = URL.createObjectURL(latest.photoBlob);
      albumPhotoUrls.push(url);
      const image = document.createElement("img");
      image.src = url;
      image.alt = "";
      cover.append(image);
    } else {
      const empty = document.createElement("span");
      empty.className = "album-empty-icon";
      empty.setAttribute("aria-label", config.label);
      empty.append(createCategoryIcon(config.coverIcon || key));
      cover.append(empty);
    }

    const body = document.createElement("div");
    body.className = "album-body";
    const title = document.createElement("h3");
    title.textContent = config.label;
    const meta = document.createElement("p");
    meta.textContent = `${albumEntries.length}개 기록`;
    body.append(title, meta);
    button.append(cover, body);
    elements.albumGrid.append(button);
  });
}

function handleAlbumClick(event) {
  const card = event.target.closest("[data-album]");
  if (!card) return;
  showAlbum(card.dataset.album);
}

async function handleFormSubmit(event) {
  event.preventDefault();

  if (!db) {
    showToast("저장소가 아직 준비되지 않았습니다.");
    return;
  }

  const id = elements.entryId.value || createId();
  const existing = elements.entryId.value ? await getEntry(id) : null;
  const now = new Date().toISOString();
  const existingPhotos = getEntryPhotos(existing);
  const photos = photoItems.length ? photoItems : existingPhotos;
  const primaryPhoto = photos[0] || null;
  const capturedAt = getCapturedAtIso() || primaryPhoto?.metadata?.dateOriginalIso || primaryPhoto?.metadata?.lastModifiedIso || existing?.capturedAt || now;
  const photoBlob = primaryPhoto?.blob || null;
  const metadata = primaryPhoto?.metadata || pendingPhotoMetadata || existing?.metadata || null;
  const locationName = elements.locationInput.value.trim();

  const entry = {
    id,
    appName: "CCC",
    category: selectedCategory,
    title: elements.titleInput.value.trim(),
    photoBlob,
    photoMeta: photoBlob
      ? {
          type: photoBlob.type || metadata?.fileType || "image/*",
          size: photoBlob.size || metadata?.fileSize || null,
          name: metadata?.fileName || existing?.photoMeta?.name || "",
          lastModified: metadata?.lastModified || existing?.photoMeta?.lastModified || null,
          qualityPolicy: "original-blob-no-compression"
        }
      : null,
    photos: photos.map((photo, index) => ({
      id: photo.id || createId(),
      blob: photo.blob,
      meta: photo.meta || buildPhotoMeta(photo.blob, photo.metadata),
      metadata: photo.metadata || null,
      isPrimary: index === 0
    })),
    metadata,
    capturedAt,
    quickComment: elements.quickCommentInput.value.trim(),
    detailedComment: elements.detailedCommentInput.value.trim(),
    reflection: elements.reflectionInput.value.trim(),
    tags: parseTags(elements.tagsInput.value),
    createdAt: existing?.createdAt || now,
    updatedAt: now,
    deletedAt: existing?.deletedAt || null,
    location: locationName || metadata?.gps
      ? {
          name: locationName || formatGps(metadata.gps),
          address: "",
          lat: metadata?.gps?.lat ?? null,
          lng: metadata?.gps?.lng ?? null,
          source: metadata?.gps ? "exif" : "manual"
        }
      : null,
    categoryDetails: readCategoryFieldValues(),
    ai: {
      ...(existing?.ai || structuredCloneSafe(fallbackAiState)),
      ...(latestAiDraft
        ? {
            summary: latestAiDraft.aiNote || latestAiDraft.detailedComment || "",
            extractedInfo: latestAiDraft,
            lastAnalyzedAt: new Date().toISOString()
          }
        : {})
    },
    export: existing?.export || structuredCloneSafe(fallbackExportState)
  };

  await putEntry(entry);
  const cloudSync = await autoSyncEntryToCloud(entry, "기록을 Supabase에 저장했습니다.");
  activeAlbum = entry.category;
  await loadEntries();
  resetForm({ silent: true });
  showAlbum(entry.category);
  showToast(getCloudSaveToast("기록을 로컬에 저장했습니다.", "기록을 로컬과 Supabase에 저장했습니다.", cloudSync));
}

async function handlePhotoSelection(event) {
  const files = Array.from(event.target.files || []);
  if (!files.length) return;

  for (const file of files) {
    const metadata = await extractPhotoMetadata(file);
    photoItems.push({
      id: createId(),
      blob: file,
      meta: buildPhotoMeta(file, metadata),
      metadata
    });
  }

  const firstNewMetadata = photoItems[photoItems.length - files.length]?.metadata || null;
  pendingPhotoBlob = photoItems[0]?.blob || null;
  pendingPhotoMetadata = photoItems[0]?.metadata || firstNewMetadata;
  renderPhotoCollection();
  applyMetadataToForm(firstNewMetadata || pendingPhotoMetadata);
  renderMetadataPanel(firstNewMetadata || pendingPhotoMetadata);
  showEditor();
}

function setPhotoPreview(blob) {
  if (previewUrl) URL.revokeObjectURL(previewUrl);
  previewUrl = URL.createObjectURL(blob);
  elements.photoPreview.src = previewUrl;
  elements.photoPreview.hidden = false;
  elements.photoPlaceholder.hidden = true;
}

function clearPhotoPreview() {
  if (previewUrl) {
    URL.revokeObjectURL(previewUrl);
    previewUrl = null;
  }

  elements.cameraInput.value = "";
  elements.libraryInput.value = "";
  elements.photoPreview.removeAttribute("src");
  elements.photoPreview.hidden = true;
  elements.photoPlaceholder.hidden = false;
  elements.metadataPanel.hidden = true;
  elements.metadataPanel.replaceChildren();
  pendingPhotoBlob = null;
  pendingPhotoMetadata = null;
}

function renderPhotoCollection() {
  revokePhotoStripUrls();
  elements.photoStrip.replaceChildren();

  if (!photoItems.length) {
    clearPhotoPreview();
    return;
  }

  pendingPhotoBlob = photoItems[0].blob;
  pendingPhotoMetadata = photoItems[0].metadata || null;
  setPhotoPreview(photoItems[0].blob);

  photoItems.forEach((photo, index) => {
    const item = document.createElement("div");
    item.className = `photo-strip-item${index === 0 ? " is-primary" : ""}`;

    const button = document.createElement("button");
    button.type = "button";
    button.dataset.photoIndex = String(index);
    button.title = index === 0 ? "대표 사진" : "대표 사진으로 설정";

    const image = document.createElement("img");
    const url = URL.createObjectURL(photo.blob);
    photoStripUrls.push(url);
    image.src = url;
    image.alt = "";
    button.append(image);

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "photo-remove";
    remove.dataset.removePhotoIndex = String(index);
    remove.setAttribute("aria-label", "사진 제거");
    remove.textContent = "×";

    item.append(button, remove);
    elements.photoStrip.append(item);
  });
}

function handlePhotoStripClick(event) {
  const removeButton = event.target.closest("[data-remove-photo-index]");
  if (removeButton) {
    const index = Number(removeButton.dataset.removePhotoIndex);
    photoItems.splice(index, 1);
    renderPhotoCollection();
    renderMetadataPanel(photoItems[0]?.metadata || null);
    return;
  }

  const selectButton = event.target.closest("[data-photo-index]");
  if (!selectButton) return;

  const index = Number(selectButton.dataset.photoIndex);
  if (index <= 0 || !photoItems[index]) return;
  const [selected] = photoItems.splice(index, 1);
  photoItems.unshift(selected);
  renderPhotoCollection();
  renderMetadataPanel(photoItems[0]?.metadata || null);
}

function clearAllPhotos() {
  photoItems = [];
  revokePhotoStripUrls();
  elements.photoStrip.replaceChildren();
  clearPhotoPreview();
  showToast("사진을 비웠습니다.");
}

function applyMetadataToForm(metadata) {
  const date = metadata?.dateOriginalIso || metadata?.lastModifiedIso;
  if (date) setCapturedInputs(date);
  if (!elements.locationInput.value.trim() && metadata?.gps) {
    elements.locationInput.value = formatGps(metadata.gps);
  }
}

function renderMetadataPanel(metadata) {
  elements.metadataPanel.replaceChildren();
  if (!metadata) {
    elements.metadataPanel.hidden = true;
    return;
  }

  const rows = [
    ["파일", metadata.fileName || "이름 없음"],
    ["원본 크기", metadata.fileSize ? formatBytes(metadata.fileSize) : ""],
    ["촬영일", metadata.dateOriginalIso ? formatDateLong(metadata.dateOriginalIso) : ""],
    ["파일 수정일", metadata.lastModifiedIso ? formatDateLong(metadata.lastModifiedIso) : ""],
    ["GPS", metadata.gps ? formatGps(metadata.gps) : ""],
    ["EXIF", metadata.exifRead ? "읽음" : "없음 또는 제한됨"]
  ].filter(([, value]) => value);

  rows.forEach(([label, value]) => {
    const item = document.createElement("p");
    item.innerHTML = `<strong>${escapeHtml(label)}</strong> ${escapeHtml(value)}`;
    elements.metadataPanel.append(item);
  });

  elements.metadataPanel.hidden = rows.length === 0;
}

function handleCategoryClick(event) {
  const button = event.target.closest("[data-category]");
  if (!button) return;

  categoryDrafts[selectedCategory] = readCategoryFieldValues();
  selectedCategory = button.dataset.category;
  activeAlbum = activeAlbum || selectedCategory;
  updateCategoryButtons();
  renderCategoryFields(categoryDrafts[selectedCategory] || {});
  seedAiPrompt();
}

function updateCategoryButtons() {
  elements.categoryControl.querySelectorAll("[data-category]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.category === selectedCategory);
  });
}

function renderCategoryFields(values = {}) {
  const config = categories[selectedCategory];
  elements.categoryDetailsTitle.textContent = `${config.label} 정보`;
  elements.categoryFields.replaceChildren();

  config.fields.forEach((field) => {
    const wrapper = document.createElement("label");
    wrapper.className = field.type === "checkbox" ? "check-field" : "field";
    if (field.wide) wrapper.classList.add("wide");

    if (field.type === "checkbox") {
      const input = document.createElement("input");
      input.type = "checkbox";
      input.dataset.fieldName = field.name;
      input.checked = Boolean(values[field.name]);
      const label = document.createElement("span");
      label.textContent = field.label;
      wrapper.append(input, label);
      elements.categoryFields.append(wrapper);
      return;
    }

    const label = document.createElement("span");
    label.textContent = field.label;
    wrapper.append(label);

    let input;
    if (field.type === "textarea") {
      input = document.createElement("textarea");
      input.rows = 3;
    } else if (field.type === "select") {
      input = document.createElement("select");
      field.options.forEach((optionValue) => {
        const option = document.createElement("option");
        option.value = optionValue;
        option.textContent = optionValue || "선택 안 함";
        input.append(option);
      });
    } else {
      input = document.createElement("input");
      input.type = field.type;
      input.autocomplete = "off";
    }

    input.dataset.fieldName = field.name;
    input.value = values[field.name] || "";
    if (field.placeholder) input.placeholder = field.placeholder;
    wrapper.append(input);
    elements.categoryFields.append(wrapper);
  });
}

function readCategoryFieldValues() {
  const values = {};
  elements.categoryFields.querySelectorAll("[data-field-name]").forEach((input) => {
    values[input.dataset.fieldName] = input.type === "checkbox" ? input.checked : input.value.trim();
  });
  return values;
}

async function handleRunAi() {
  const savedEntry = elements.entryId.value ? await getEntry(elements.entryId.value) : null;
  const sourcePhotos = photoItems.length ? photoItems : getEntryPhotos(savedEntry);
  const prompt = elements.aiPromptInput.value.trim() || categories[selectedCategory].prompt;

  if (window.location.protocol === "file:") {
    showAiMessage("AI 호출은 로컬 서버에서 열어야 합니다. node server.js 실행 후 http://주소:포트 로 접속하세요.");
    return;
  }

  if (!sourcePhotos.length && !prompt) {
    showToast("AI에게 보낼 사진이나 요청이 필요합니다.");
    return;
  }

  elements.runAiButton.disabled = true;
  elements.applyAiButton.disabled = true;
  elements.aiResult.hidden = false;
  elements.aiResult.textContent = "AI가 초안을 만드는 중입니다.";

  try {
    const imageDataUrls = await Promise.all(sourcePhotos.slice(0, 4).map((photo) => makeAiImageDataUrl(photo.blob)));
    const apiKey = elements.apiKeyInput.value.trim();
    const model = elements.apiModelInput.value.trim();
    if (apiKey && !apiKey.startsWith("sk-")) {
      throw new Error("API 키는 sk-로 시작하는 전체 키여야 합니다.");
    }
    persistApiSettings();

    const headers = {
      "Content-Type": "application/json"
    };
    if (!apiKey && cloudSession?.access_token) {
      headers.Authorization = `Bearer ${cloudSession.access_token}`;
    }

    const response = await fetch("/api/analyze", {
      method: "POST",
      headers,
      body: JSON.stringify({
        category: selectedCategory,
        categoryLabel: getCategoryLabel(selectedCategory),
        prompt,
        imageDataUrl: imageDataUrls[0] || null,
        imageDataUrls,
        apiKey,
        model,
        currentDraft: {
          title: elements.titleInput.value.trim(),
          quickComment: elements.quickCommentInput.value.trim(),
          detailedComment: elements.detailedCommentInput.value.trim(),
          reflection: elements.reflectionInput.value.trim(),
          tags: parseTags(elements.tagsInput.value),
          categoryDetails: readCategoryFieldValues()
        }
      })
    });

    const payload = await response.json();
    if (!response.ok) {
      throw new Error(payload.error || "AI 호출에 실패했습니다.");
    }

    latestAiDraft = normalizeAiDraft(payload.result);
    elements.aiResult.textContent = formatAiDraft(latestAiDraft);
    elements.applyAiButton.disabled = false;
    showToast("AI 초안이 준비되었습니다.");
  } catch (error) {
    console.error(error);
    const message = normalizeAiError(error);
    elements.aiResult.textContent = message;
    showToast(message);
  } finally {
    elements.runAiButton.disabled = false;
  }
}

async function checkAiServer() {
  if (window.location.protocol === "file:") {
    showAiMessage("현재 파일로 열려 있습니다. AI는 node server.js 실행 후 http://주소:포트 로 접속해야 작동합니다.");
    return;
  }

  try {
    const response = await fetch("/api/health", { cache: "no-store" });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || "서버 상태 확인 실패");

    const keyStatus = payload.hasServerApiKey ? "서버 API 키 있음" : "서버 API 키 없음, 앱 입력 키 사용 가능";
    const runtimeStatus = payload.runtime ? `런타임: ${payload.runtime}` : `포트: ${payload.port || "local"}`;
    const cloudStatus = payload.hasSupabase ? "Supabase 설정 있음" : "Supabase 설정 없음";
    showAiMessage(`서버 연결 정상\n${runtimeStatus}\n모델: ${payload.model}\n${keyStatus}\n${cloudStatus}`);
  } catch (error) {
    showAiMessage(normalizeAiError(error));
  }
}

function normalizeAiDraft(raw) {
  const details = {};
  allDetailKeys.forEach((key) => {
    if (key === "needSimilarProblems") {
      details[key] = Boolean(raw?.categoryDetails?.[key]);
    } else {
      details[key] = String(raw?.categoryDetails?.[key] || "");
    }
  });

  return {
    title: String(raw?.title || ""),
    quickComment: String(raw?.quickComment || ""),
    detailedComment: String(raw?.detailedComment || ""),
    reflection: String(raw?.reflection || ""),
    tags: Array.isArray(raw?.tags) ? raw.tags.map(String).filter(Boolean) : [],
    categoryDetails: details,
    aiNote: String(raw?.aiNote || "")
  };
}

function formatAiDraft(draft) {
  const lines = [];
  if (draft.title) lines.push(`제목: ${draft.title}`);
  if (draft.quickComment) lines.push(`짧은 코멘트: ${draft.quickComment}`);
  if (draft.detailedComment) lines.push(`상세 코멘트: ${draft.detailedComment}`);
  if (draft.reflection) lines.push(`감상 초안: ${draft.reflection}`);
  if (draft.tags.length) lines.push(`태그: ${draft.tags.map((tag) => `#${tag}`).join(" ")}`);
  if (draft.aiNote) lines.push(`AI 메모: ${draft.aiNote}`);

  const activeDetails = categories[selectedCategory].fields
    .map((field) => [field.label, draft.categoryDetails[field.name]])
    .filter(([, value]) => value);
  if (activeDetails.length) {
    lines.push("");
    lines.push("추가 정보");
    activeDetails.forEach(([label, value]) => lines.push(`${label}: ${value}`));
  }

  return lines.join("\n") || "AI가 채울 내용을 찾지 못했습니다.";
}

function applyAiDraft() {
  if (!latestAiDraft) return;

  if (latestAiDraft.title) elements.titleInput.value = latestAiDraft.title;
  if (latestAiDraft.quickComment) elements.quickCommentInput.value = latestAiDraft.quickComment;
  if (latestAiDraft.detailedComment) elements.detailedCommentInput.value = latestAiDraft.detailedComment;
  if (latestAiDraft.reflection && !elements.reflectionInput.value.trim()) {
    elements.reflectionInput.value = latestAiDraft.reflection;
  }
  if (latestAiDraft.tags.length) elements.tagsInput.value = latestAiDraft.tags.join(", ");

  const currentValues = readCategoryFieldValues();
  const nextValues = { ...currentValues };
  categories[selectedCategory].fields.forEach((field) => {
    const value = latestAiDraft.categoryDetails[field.name];
    if (value !== undefined && value !== "" && value !== false) {
      nextValues[field.name] = value;
    }
  });
  renderCategoryFields(nextValues);
  showToast("AI 초안을 입력칸에 반영했습니다.");
}

function showAiMessage(message) {
  elements.aiResult.hidden = false;
  elements.aiResult.textContent = message;
  showToast(message.split("\n")[0]);
}

function normalizeAiError(error) {
  const message = String(error?.message || error || "");

  if (message.includes("Failed to fetch") || message.includes("Load failed")) {
    return "AI 서버에 연결할 수 없습니다. node server.js가 실행 중인지, iPhone 주소가 맞는지 확인하세요.";
  }

  if (message.includes("expected pattern") || message.includes("sk-")) {
    return "API 키 형식이 맞지 않습니다. sk-로 시작하는 전체 OpenAI API 키를 입력하세요.";
  }

  if (message.includes("OPENAI_API_KEY")) {
    return "API 키가 없습니다. 앱의 OpenAI API 키 칸에 sk-로 시작하는 전체 키를 입력하거나 서버 환경변수를 설정하세요.";
  }

  if (message.includes("로그인") || message.includes("Unauthorized") || message.includes("401")) {
    return "서버 OpenAI 키를 사용하려면 먼저 클라우드에 로그인해주세요. 개인 API 키를 직접 입력해서 호출할 수도 있습니다.";
  }

  if (message.includes("insufficient_quota") || message.includes("quota") || message.includes("billing")) {
    return "OpenAI API 할당량이나 결제 설정 때문에 호출이 막혔습니다. OpenAI Platform의 Billing/Usage를 확인한 뒤 다시 시도하세요.";
  }

  if (message.includes("model") || message.includes("Model")) {
    return `모델 설정을 확인하세요. 현재 모델 입력칸 값을 다른 사용 가능한 모델로 바꿔보세요.\n원문: ${message}`;
  }

  return message || "AI 호출 중 알 수 없는 오류가 발생했습니다.";
}

function loadSavedApiSettings() {
  const savedKey = localStorage.getItem(API_KEY_STORAGE_KEY) || "";
  const savedModel = localStorage.getItem(API_MODEL_STORAGE_KEY) || "";

  if (savedKey) {
    elements.apiKeyInput.value = savedKey;
    elements.rememberApiKeyInput.checked = true;
  }

  elements.apiModelInput.value = savedModel || elements.apiModelInput.value || "gpt-5.5";
}

function persistApiSettings() {
  const model = elements.apiModelInput.value.trim();
  if (model) {
    localStorage.setItem(API_MODEL_STORAGE_KEY, model);
  }

  const apiKey = elements.apiKeyInput.value.trim();
  if (!elements.rememberApiKeyInput.checked) return;

  if (!apiKey.startsWith("sk-")) {
    showToast("API 키는 sk-로 시작해야 저장됩니다.");
    return;
  }

  localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
}

function handleRememberApiKeyChange() {
  if (elements.rememberApiKeyInput.checked) {
    persistApiSettings();
    if (localStorage.getItem(API_KEY_STORAGE_KEY)) {
      showToast("이 기기에 API 키를 저장했습니다.");
    }
    return;
  }

  localStorage.removeItem(API_KEY_STORAGE_KEY);
  showToast("저장된 API 키를 삭제했습니다.");
}

function handleApiKeyInput() {
  if (elements.rememberApiKeyInput.checked) {
    persistApiSettings();
  }
}

function clearSavedApiKey() {
  localStorage.removeItem(API_KEY_STORAGE_KEY);
  elements.apiKeyInput.value = "";
  elements.rememberApiKeyInput.checked = false;
  showToast("저장된 API 키를 삭제했습니다.");
}

async function initCloud() {
  const savedEmail = localStorage.getItem(CLOUD_EMAIL_STORAGE_KEY) || "";
  if (elements.cloudEmailInput) elements.cloudEmailInput.value = savedEmail;
  cloudAuthNotice = readCloudAuthRedirectNotice();
  updateCloudUi("Local", "클라우드 설정을 확인하는 중입니다.");
  if (cloudAuthNotice) {
    updateCloudUi("Auth", cloudAuthNotice.note);
    showToast(cloudAuthNotice.toast);
  }

  if (window.location.protocol === "file:") {
    updateCloudUi("Local", "클라우드 저장은 HTTPS 주소에서 사용할 수 있습니다.");
    return;
  }

  try {
    const response = await fetch(CLOUD_CONFIG_URL, { cache: "no-store" });
    if (!response.ok) throw new Error("Cloud config endpoint is not ready.");

    cloudConfig = await response.json();
    if (!cloudConfig.hasSupabase || !cloudConfig.supabaseUrl || !cloudConfig.supabaseAnonKey) {
      updateCloudUi("Local", "Vercel에 Supabase 환경변수를 설정하면 자동 클라우드 저장이 켜집니다.");
      return;
    }

    if (!window.supabase?.createClient) {
      updateCloudUi("Local", "Supabase SDK를 불러오지 못했습니다. 네트워크를 확인해주세요.");
      return;
    }

    supabaseClient = window.supabase.createClient(cloudConfig.supabaseUrl, cloudConfig.supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });

    const { data, error } = await supabaseClient.auth.getSession();
    if (error) throw error;
    cloudSession = data.session || null;

    supabaseClient.auth.onAuthStateChange((_event, session) => {
      cloudSession = session || null;
      updateCloudUi();
    });

    updateCloudUi();
  } catch (error) {
    console.error(error);
    updateCloudUi("Local", normalizeCloudError(error));
  }
}

function updateCloudUi(statusOverride = null, noteOverride = null) {
  if (!elements.cloudStatusBadge) return;

  const configured = Boolean(supabaseClient);
  const signedIn = Boolean(cloudSession?.user);
  const status = statusOverride || (signedIn ? "Cloud" : configured ? "Ready" : "Local");
  document.body.classList.toggle("cloud-configured", configured);
  document.body.classList.toggle("cloud-signed-in", signedIn);
  document.body.classList.toggle("cloud-busy", cloudBusy);

  const note =
    noteOverride ||
    (!signedIn && cloudAuthNotice?.note) ||
    (signedIn
      ? `${cloudSession.user.email || cloudSession.user.id} 계정으로 로그인되어 있습니다.`
      : configured
        ? "이메일로 로그인 링크를 받은 뒤 업로드와 가져오기를 사용할 수 있습니다."
        : "클라우드 동기화가 아직 설정되지 않았습니다.");

  elements.cloudStatusBadge.textContent = status;
  elements.cloudStatusBadge.classList.toggle("is-online", signedIn);
  elements.cloudStatusBadge.classList.toggle("is-offline", !configured);
  elements.cloudSummaryCopy.textContent = signedIn
    ? "로그인 유지 중입니다. 기록은 저장할 때 자동 보관됩니다."
    : configured
      ? "한 번 로그인하면 세션이 유지되고 자동 보관됩니다."
      : "Supabase 설정과 복구 메뉴가 필요할 때만 엽니다.";
  elements.cloudNote.textContent = note;
  elements.cloudLoginButton.disabled = cloudBusy || !configured || signedIn;
  elements.cloudRefreshButton.disabled = cloudBusy || !configured;
  elements.cloudPushButton.disabled = cloudBusy || !signedIn;
  elements.cloudPullButton.disabled = cloudBusy || !signedIn;
  elements.cloudSignOutButton.disabled = cloudBusy || !signedIn;
}

async function handleCloudLogin() {
  try {
    if (!supabaseClient) throw new Error("클라우드 동기화가 아직 설정되지 않았습니다.");
    const email = elements.cloudEmailInput.value.trim();
    if (!email) throw new Error("먼저 이메일 주소를 입력해주세요.");

    localStorage.setItem(CLOUD_EMAIL_STORAGE_KEY, email);
    cloudBusy = true;
    updateCloudUi(null, "로그인 링크를 보내는 중입니다.");

    const redirectTo = getCloudRedirectUrl();
    const { error } = await supabaseClient.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo,
        shouldCreateUser: true
      }
    });
    if (error) throw error;

    cloudAuthNotice = null;
    updateCloudUi(null, "로그인 링크를 보냈습니다. 아이폰에서 메일 링크를 열어 돌아오세요.");
    showToast("로그인 링크를 이메일로 보냈습니다.");
  } catch (error) {
    console.error(error);
    updateCloudUi(null, normalizeCloudError(error));
    showToast(normalizeCloudError(error));
  } finally {
    cloudBusy = false;
    updateCloudUi();
  }
}

async function refreshCloudSession() {
  try {
    if (!supabaseClient) throw new Error("클라우드 동기화가 아직 설정되지 않았습니다.");
    const { data, error } = await supabaseClient.auth.getSession();
    if (error) throw error;
    cloudSession = data.session || null;
    if (cloudSession) {
      await checkCloudStorageReady(cloudSession.user.id);
      updateCloudUi(null, "Supabase DB와 사진 저장소 연결이 정상입니다.");
    } else {
      updateCloudUi(null, "아직 로그인 세션이 없습니다.");
    }
  } catch (error) {
    console.error(error);
    updateCloudUi(null, normalizeCloudError(error));
  }
}

async function handleCloudSignOut() {
  try {
    if (!supabaseClient) return;
    const { error } = await supabaseClient.auth.signOut();
    if (error) throw error;
    cloudSession = null;
    updateCloudUi(null, "클라우드에서 로그아웃했습니다.");
    showToast("클라우드에서 로그아웃했습니다.");
  } catch (error) {
    console.error(error);
    updateCloudUi(null, normalizeCloudError(error));
  }
}

async function handleCloudPush() {
  try {
    const session = requireCloudSession();
    if (!entries.length) {
      showToast("업로드할 기록이 없습니다.");
      return;
    }

    cloudBusy = true;
    updateCloudUi(null, "로컬 기록을 클라우드에 업로드하는 중입니다.");

    let uploaded = 0;
    for (const entry of entries) {
      uploaded += 1;
      updateCloudUi(null, `업로드 중 ${uploaded}/${entries.length}`);
      await uploadEntryToCloud(entry, session.user.id);
    }

    updateCloudUi(null, `${uploaded}개 기록을 클라우드에 업로드했습니다.`);
    showToast("클라우드 업로드를 마쳤습니다.");
  } catch (error) {
    console.error(error);
    updateCloudUi(null, normalizeCloudError(error));
    showToast(normalizeCloudError(error));
  } finally {
    cloudBusy = false;
    updateCloudUi();
  }
}

async function autoSyncEntryToCloud(entry, successMessage) {
  if (!supabaseClient || !cloudSession?.user) return { status: "skipped" };
  if (cloudBusy) return { status: "busy" };

  let finalNote = successMessage;
  try {
    cloudBusy = true;
    updateCloudUi(null, "Supabase에 기록을 저장하는 중입니다.");
    await uploadEntryToCloud(entry, cloudSession.user.id);
    return { status: "synced" };
  } catch (error) {
    console.error(error);
    finalNote = `로컬 저장은 완료됐지만 Supabase 저장에 실패했습니다: ${normalizeCloudError(error)}`;
    return { status: "failed", message: finalNote };
  } finally {
    cloudBusy = false;
    updateCloudUi(null, finalNote);
  }
}

function getCloudSaveToast(localMessage, cloudMessage, cloudSync) {
  if (cloudSync?.status === "synced") return cloudMessage;
  if (cloudSync?.status === "failed") return cloudSync.message;
  if (cloudSync?.status === "busy") return `${localMessage} 다른 클라우드 작업 중이라 이번 저장은 자동 업로드하지 않았습니다.`;
  return localMessage;
}

function createImportSummary() {
  return {
    added: 0,
    updated: 0,
    skipped: 0,
    copied: 0,
    failed: 0
  };
}

function formatImportSummary(label, summary) {
  const parts = [];
  if (summary.added) parts.push(`새 기록 ${summary.added}개`);
  if (summary.updated) parts.push(`업데이트 ${summary.updated}개`);
  if (summary.skipped) parts.push(`유지 ${summary.skipped}개`);
  if (summary.copied) parts.push(`충돌 사본 ${summary.copied}개`);
  if (summary.failed) parts.push(`실패 ${summary.failed}개`);
  return `${label}: ${parts.length ? parts.join(", ") : "변경 없음"}`;
}

async function putImportedEntrySafely(entry, options = {}) {
  const summary = options.summary || createImportSummary();
  const sourceLabel = options.sourceLabel || "가져온 기록";
  const existing = entry?.id ? await getEntry(entry.id) : null;

  if (!existing) {
    await putEntry(entry);
    summary.added += 1;
    return { status: "added", entry };
  }

  if (isSameEntrySnapshot(existing, entry)) {
    summary.skipped += 1;
    return { status: "same", entry: existing };
  }

  const localTime = getEntrySyncTime(existing);
  const incomingTime = getEntrySyncTime(entry, options.fallbackUpdatedAt);
  if (incomingTime > localTime) {
    await putEntry(entry);
    summary.updated += 1;
    return { status: "updated", entry };
  }

  if (localTime > incomingTime) {
    summary.skipped += 1;
    return { status: "local-newer", entry: existing };
  }

  const copy = createConflictCopy(entry, sourceLabel);
  await putEntry(copy);
  summary.copied += 1;
  return { status: "copied", entry: copy };
}

function getEntrySyncTime(entry, fallbackUpdatedAt = null) {
  const value = entry?.updatedAt || fallbackUpdatedAt || entry?.createdAt || "";
  const time = Date.parse(value);
  return Number.isFinite(time) ? time : 0;
}

function isSameEntrySnapshot(left, right) {
  return stableStringifyForCompare(left) === stableStringifyForCompare(right);
}

function stableStringifyForCompare(entry) {
  const snapshot = {
    id: entry?.id || "",
    category: entry?.category || "",
    title: entry?.title || "",
    location: entry?.location || null,
    capturedAt: entry?.capturedAt || "",
    quickComment: entry?.quickComment || "",
    detailedComment: entry?.detailedComment || "",
    reflection: entry?.reflection || "",
    tags: entry?.tags || [],
    categoryDetails: entry?.categoryDetails || {},
    deletedAt: entry?.deletedAt || null,
    updatedAt: entry?.updatedAt || "",
    photoMeta: entry?.photoMeta || null,
    photos: getEntryPhotos(entry).map((photo) => ({
      id: photo.id || "",
      meta: photo.meta || null,
      metadata: photo.metadata || null,
      isPrimary: Boolean(photo.isPrimary)
    }))
  };
  return JSON.stringify(snapshot);
}

function createConflictCopy(entry, sourceLabel) {
  const now = new Date().toISOString();
  const originalPhotos = getEntryPhotos(entry);
  const copyId = createId();
  const copiedPhotos = originalPhotos.map((photo, index) => ({
    ...photo,
    id: photo.id || `${copyId}-photo-${index + 1}`,
    isPrimary: index === 0 || Boolean(photo.isPrimary)
  }));

  return {
    ...entry,
    id: copyId,
    title: `${entry.title || "무제 기록"} (${sourceLabel} 사본)`,
    photos: copiedPhotos,
    photoBlob: copiedPhotos[0]?.blob || null,
    photoMeta: copiedPhotos[0]?.meta || entry.photoMeta || null,
    metadata: copiedPhotos[0]?.metadata || entry.metadata || null,
    createdAt: entry.createdAt || now,
    updatedAt: now,
    cloud: {
      ...(entry.cloud || {}),
      conflictCopyOf: entry.id || null,
      conflictSource: sourceLabel,
      importedAt: now
    }
  };
}

async function handleCloudPull() {
  try {
    requireCloudSession();
    if (!db) throw new Error("로컬 데이터베이스가 아직 준비되지 않았습니다.");

    const confirmed = window.confirm(
      "클라우드 기록을 이 기기로 가져옵니다. 같은 ID는 최신 수정일 기준으로 병합하고, 판단이 어려운 충돌은 사본으로 보관합니다."
    );
    if (!confirmed) return;

    cloudBusy = true;
    updateCloudUi(null, "클라우드 기록을 가져오는 중입니다.");

    const { data, error } = await supabaseClient
      .from(CLOUD_ENTRY_TABLE)
      .select("id,payload,updated_at")
      .order("updated_at", { ascending: false });
    if (error) throw error;

    const rows = data || [];
    let downloaded = 0;
    const summary = createImportSummary();
    for (const row of rows) {
      downloaded += 1;
      updateCloudUi(null, `가져오는 중 ${downloaded}/${rows.length}`);
      const entry = await inflateCloudEntry(row.payload);
      await putImportedEntrySafely(entry, {
        sourceLabel: "클라우드",
        fallbackUpdatedAt: row.updated_at,
        summary
      });
    }

    await loadEntries();
    const message = formatImportSummary("클라우드 가져오기", summary);
    updateCloudUi(null, message);
    showToast(message);
  } catch (error) {
    console.error(error);
    updateCloudUi(null, normalizeCloudError(error));
    showToast(normalizeCloudError(error));
  } finally {
    cloudBusy = false;
    updateCloudUi();
  }
}

function requireCloudSession() {
  if (!supabaseClient) throw new Error("클라우드 동기화가 아직 설정되지 않았습니다.");
  if (!cloudSession?.user) throw new Error("먼저 클라우드에 로그인해주세요.");
  return cloudSession;
}

async function checkCloudStorageReady(userId) {
  if (!supabaseClient) throw new Error("클라우드 동기화가 아직 설정되지 않았습니다.");
  if (!userId) throw new Error("Supabase 사용자 정보를 확인할 수 없습니다.");

  const { error: tableError } = await supabaseClient.from(CLOUD_ENTRY_TABLE).select("id").limit(1);
  if (tableError) {
    throw new Error(`Supabase DB(${CLOUD_ENTRY_TABLE}) 확인 실패: ${tableError.message}`);
  }

  const { error: storageError } = await supabaseClient.storage.from(CLOUD_PHOTO_BUCKET).list(userId, { limit: 1 });
  if (storageError) {
    throw new Error(`Supabase Storage(${CLOUD_PHOTO_BUCKET}) 확인 실패: ${storageError.message}`);
  }

  return true;
}

function getCloudRedirectUrl() {
  const url = new URL(window.location.href);
  url.search = "";
  url.hash = "";
  return url.toString();
}

function readCloudAuthRedirectNotice() {
  const params = new URLSearchParams(window.location.search || "");
  const hashText = window.location.hash?.startsWith("#") ? window.location.hash.slice(1) : window.location.hash || "";
  const hashParams = new URLSearchParams(hashText);
  const error = params.get("error") || hashParams.get("error");
  const errorCode = params.get("error_code") || hashParams.get("error_code");
  const description = params.get("error_description") || hashParams.get("error_description");

  if (!error && !errorCode && !description) return null;

  if (window.history?.replaceState) {
    window.history.replaceState(null, "", `${window.location.origin}${window.location.pathname}`);
  }

  if (errorCode === "otp_expired" || /expired/i.test(description || "")) {
    return {
      toast: "로그인 링크가 만료되었습니다. 새 링크를 다시 받아주세요.",
      note: "로그인 링크가 만료되었거나 이미 사용되었습니다. 이메일을 다시 입력하고 새 로그인 링크를 받아주세요. 링크가 localhost로 열린다면 Supabase Authentication URL Configuration에서 Site URL을 https://ccc-photo-diary.vercel.app 으로 바꿔야 합니다."
    };
  }

  return {
    toast: "클라우드 로그인 링크를 처리하지 못했습니다.",
    note: `클라우드 로그인 오류: ${errorCode || error || description}. 새 로그인 링크를 다시 받아주세요. 링크가 localhost로 열린다면 Supabase 리디렉션 URL 설정이 필요합니다.`
  };
}

async function uploadEntryToCloud(entry, userId) {
  const cloudPhotos = [];
  const photos = getEntryPhotos(entry);

  for (let index = 0; index < photos.length; index += 1) {
    const photo = photos[index];
    const photoId = photo.id || `${entry.id}-photo-${index + 1}`;
    const extension = getPhotoExtension(photo.blob, photo.meta?.name || photo.metadata?.fileName);
    const storagePath = `${userId}/${entry.id}/${sanitizePathSegment(photoId)}.${extension}`;
    const { error } = await supabaseClient.storage.from(CLOUD_PHOTO_BUCKET).upload(storagePath, photo.blob, {
      upsert: true,
      contentType: photo.blob.type || "application/octet-stream"
    });
    if (error) throw error;

    cloudPhotos.push({
      id: photoId,
      storageBucket: CLOUD_PHOTO_BUCKET,
      storagePath,
      meta: photo.meta || buildPhotoMeta(photo.blob, photo.metadata),
      metadata: photo.metadata || null,
      isPrimary: index === 0 || Boolean(photo.isPrimary)
    });
  }

  const payload = serializeEntryForCloud(entry, cloudPhotos);
  const { error } = await supabaseClient.from(CLOUD_ENTRY_TABLE).upsert(
    {
      id: entry.id,
      user_id: userId,
      payload,
      deleted_at: entry.deletedAt || null,
      updated_at: entry.updatedAt || new Date().toISOString()
    },
    { onConflict: "user_id,id" }
  );
  if (error) throw error;
}

async function deleteEntryFromCloud(entry, userId) {
  if (!supabaseClient || !entry?.id || !userId) return;

  const folderPath = `${userId}/${entry.id}`;
  const { data: storedPhotos, error: listError } = await supabaseClient.storage
    .from(CLOUD_PHOTO_BUCKET)
    .list(folderPath, { limit: 100 });
  if (listError) throw listError;

  const storagePaths = (storedPhotos || []).map((item) => `${folderPath}/${item.name}`);
  if (storagePaths.length) {
    const { error: removeStorageError } = await supabaseClient.storage.from(CLOUD_PHOTO_BUCKET).remove(storagePaths);
    if (removeStorageError) throw removeStorageError;
  }

  const { error: deleteRowError } = await supabaseClient
    .from(CLOUD_ENTRY_TABLE)
    .delete()
    .eq("user_id", userId)
    .eq("id", entry.id);
  if (deleteRowError) throw deleteRowError;
}

function serializeEntryForCloud(entry, cloudPhotos) {
  const { photoBlob, photos, ...rest } = entry;
  const payload = structuredCloneSafe(rest);
  payload.photoBlob = null;
  payload.photos = cloudPhotos;
  payload.photoMeta = cloudPhotos[0]?.meta || entry.photoMeta || null;
  payload.metadata = entry.metadata || cloudPhotos[0]?.metadata || null;
  payload.cloud = {
    provider: "supabase",
    bucket: CLOUD_PHOTO_BUCKET,
    syncedAt: new Date().toISOString()
  };
  return payload;
}

async function inflateCloudEntry(payload) {
  const entry = structuredCloneSafe(payload || {});
  const cloudPhotos = Array.isArray(entry.photos) ? entry.photos : [];
  const restoredPhotos = [];

  for (let index = 0; index < cloudPhotos.length; index += 1) {
    const cloudPhoto = cloudPhotos[index];
    if (!cloudPhoto.storagePath) continue;

    const bucket = cloudPhoto.storageBucket || CLOUD_PHOTO_BUCKET;
    const { data, error } = await supabaseClient.storage.from(bucket).download(cloudPhoto.storagePath);
    if (error) throw error;

    restoredPhotos.push({
      id: cloudPhoto.id || `${entry.id || "cloud"}-photo-${index + 1}`,
      blob: data,
      meta: cloudPhoto.meta || buildPhotoMeta(data, cloudPhoto.metadata),
      metadata: cloudPhoto.metadata || null,
      isPrimary: index === 0 || Boolean(cloudPhoto.isPrimary)
    });
  }

  return {
    ...entry,
    photos: restoredPhotos,
    photoBlob: restoredPhotos[0]?.blob || null,
    photoMeta: restoredPhotos[0]?.meta || entry.photoMeta || null,
    metadata: restoredPhotos[0]?.metadata || entry.metadata || null,
    cloud: {
      ...(entry.cloud || {}),
      pulledAt: new Date().toISOString()
    }
  };
}

function getPhotoExtension(blob, fileName = "") {
  const fromName = String(fileName).match(/\.([a-z0-9]{2,5})$/i)?.[1];
  if (fromName) return fromName.toLowerCase().replace("jpeg", "jpg");

  const type = blob?.type || "";
  if (type.includes("png")) return "png";
  if (type.includes("webp")) return "webp";
  if (type.includes("heic")) return "heic";
  if (type.includes("heif")) return "heif";
  if (type.includes("gif")) return "gif";
  return "jpg";
}

function sanitizePathSegment(value) {
  return (
    String(value || "file")
      .replace(/[^a-zA-Z0-9._-]/g, "_")
      .slice(0, 90) || "file"
  );
}

function normalizeCloudError(error) {
  return error?.message || String(error || "클라우드 동기화에 실패했습니다.");
}

function seedAiPrompt() {
  if (!elements.aiPromptInput) return;
  elements.aiPromptInput.value = categories[selectedCategory].prompt;
  latestAiDraft = null;
  elements.applyAiButton.disabled = true;
  elements.aiResult.hidden = true;
  elements.aiResult.textContent = "";
}

function renderEntries() {
  revokeListPhotoUrls();
  elements.entryList.replaceChildren();

  const baseEntries = entries.filter((entry) => {
    if (showingTrash) return Boolean(entry.deletedAt);
    return !entry.deletedAt && (!activeAlbum || entry.category === activeAlbum);
  });
  const filteredEntries = baseEntries.filter((entry) => matchesSearch(entry, elements.searchInput.value));

  if (filteredEntries.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = showingTrash ? "휴지통이 비어 있습니다." : "아직 기록이 없습니다.";
    if (baseEntries.length > 0) empty.textContent = "검색 결과가 없습니다.";
    elements.entryList.append(empty);
    return;
  }

  filteredEntries.forEach((entry) => elements.entryList.append(createEntryCard(entry)));
}

function createEntryCard(entry) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "entry-card";
  button.dataset.entryId = entry.id;

  if (entry.photoBlob) {
    const image = document.createElement("img");
    image.className = "entry-thumb";
    image.alt = "";
    const url = URL.createObjectURL(entry.photoBlob);
    listPhotoUrls.push(url);
    image.src = url;
    button.append(image);
  } else {
    const fallback = document.createElement("span");
    fallback.className = "thumb-fallback";
    fallback.append(createCategoryIcon(categories[entry.category]?.coverIcon || entry.category));
    button.append(fallback);
  }

  const body = document.createElement("div");
  body.className = "entry-body";

  const meta = document.createElement("div");
  meta.className = "entry-meta";
  meta.append(createCategoryBadge(entry.category));

  const dateBadge = document.createElement("span");
  dateBadge.className = "date-badge";
  dateBadge.textContent = formatDateShort(entry.capturedAt || entry.createdAt);
  meta.append(dateBadge);

  if (entry.deletedAt) {
    const deletedBadge = document.createElement("span");
    deletedBadge.className = "date-badge deleted";
    deletedBadge.textContent = "휴지통";
    meta.append(deletedBadge);
  }

  const title = document.createElement("h3");
  title.className = "entry-title";
  title.textContent = entry.title || "무제 기록";

  const excerpt = document.createElement("p");
  excerpt.className = "entry-excerpt";
  excerpt.textContent = getEntryExcerpt(entry);

  body.append(meta, title, excerpt);
  if (entry.tags?.length) {
    const tags = document.createElement("div");
    tags.className = "entry-tags";
    entry.tags.slice(0, 4).forEach((tag) => {
      const chip = document.createElement("span");
      chip.className = "tag-chip";
      chip.textContent = `#${tag}`;
      tags.append(chip);
    });
    body.append(tags);
  }

  button.append(body);
  return button;
}

function updateStats() {
  const activeEntries = entries.filter((entry) => !entry.deletedAt);
  const deletedEntries = entries.filter((entry) => entry.deletedAt);
  const todayKey = formatDateKey(new Date());
  const unfinished = activeEntries.filter((entry) => !entry.detailedComment && !entry.reflection).length;
  const today = activeEntries.filter((entry) => formatDateKey(new Date(entry.capturedAt || entry.createdAt)) === todayKey).length;

  elements.totalCount.textContent = activeEntries.length;
  elements.unfinishedCount.textContent = unfinished;
  elements.todayCount.textContent = today;
  elements.trashCount.textContent = deletedEntries.length;
}

function matchesSearch(entry, rawQuery) {
  const query = rawQuery.trim().toLowerCase();
  if (!query) return true;

  const searchable = [
    getCategoryLabel(entry.category),
    entry.title,
    entry.quickComment,
    entry.detailedComment,
    entry.reflection,
    entry.location?.name,
    entry.metadata?.fileName,
    ...(entry.tags || []),
    ...Object.values(entry.categoryDetails || {})
  ]
    .join(" ")
    .toLowerCase();

  return searchable.includes(query);
}

function handleEntryListClick(event) {
  const card = event.target.closest("[data-entry-id]");
  if (!card) return;

  const entry = entries.find((item) => item.id === card.dataset.entryId);
  if (entry) openDetailDialog(entry);
}

function openDetailDialog(entry) {
  elements.detailDialog.dataset.entryId = entry.id;
  elements.detailCategory.className = `category-badge ${categories[entry.category]?.className || ""}`;
  elements.detailCategory.textContent = getCategoryLabel(entry.category);
  elements.detailTitle.textContent = entry.title || "무제 기록";
  elements.detailDate.textContent = `${formatDateLong(entry.capturedAt || entry.createdAt)} 기록 · ${formatDateLong(entry.updatedAt)} 수정`;
  elements.detailList.replaceChildren();
  clearDetailPhotoUrl();
  elements.detailGallery.replaceChildren();

  elements.activeDetailActions.hidden = Boolean(entry.deletedAt);
  elements.trashDetailActions.hidden = !entry.deletedAt;

  const photos = getEntryPhotos(entry);
  if (photos.length) {
    detailPhotoUrl = URL.createObjectURL(photos[0].blob);
    elements.detailPhoto.src = detailPhotoUrl;
    elements.detailPhoto.hidden = false;
    photos.forEach((photo, index) => {
      const image = document.createElement("img");
      const url = URL.createObjectURL(photo.blob);
      detailGalleryUrls.push(url);
      image.src = url;
      image.alt = `${index + 1}번째 사진`;
      elements.detailGallery.append(image);
    });
  } else {
    elements.detailPhoto.hidden = true;
    elements.detailPhoto.removeAttribute("src");
  }

  addDetailRow("카테고리", getCategoryLabel(entry.category));
  addDetailRow("장소", entry.location?.name || "");
  addDetailRow("촬영일", entry.capturedAt ? formatDateLong(entry.capturedAt) : "");
  addDetailRow("짧은 코멘트", entry.quickComment);
  addDetailRow("상세 코멘트", entry.detailedComment);
  addDetailRow("감상", entry.reflection);
  addDetailRow("태그", entry.tags?.length ? entry.tags.map((tag) => `#${tag}`).join(" ") : "");
  addDetailRow("사진 수", photos.length ? `${photos.length}장` : "");

  categories[entry.category].fields.forEach((field) => {
    const value = entry.categoryDetails?.[field.name];
    addDetailRow(field.label, field.type === "checkbox" ? (value ? "예" : "") : value);
  });

  addDetailRow("AI 메모", entry.ai?.summary || "");
  addDetailRow("원본 파일", entry.metadata?.fileName || entry.photoMeta?.name || "");
  addDetailRow("원본 크기", entry.photoMeta?.size ? formatBytes(entry.photoMeta.size) : "");
  addDetailRow("GPS", entry.metadata?.gps ? formatGps(entry.metadata.gps) : "");
  addDetailRow("사진 보존", entry.photoBlob ? "원본 Blob 저장, 앱에서 압축하지 않음" : "");
  addDetailRow("삭제일", entry.deletedAt ? formatDateLong(entry.deletedAt) : "");

  if (typeof elements.detailDialog.showModal === "function") elements.detailDialog.showModal();
  else elements.detailDialog.setAttribute("open", "");
}

function addDetailRow(label, value) {
  if (value === null || value === undefined || value === "") return;
  const term = document.createElement("dt");
  term.textContent = label;
  const description = document.createElement("dd");
  description.textContent = value;
  elements.detailList.append(term, description);
}

function closeDetailDialog() {
  if (typeof elements.detailDialog.close === "function") elements.detailDialog.close();
  else {
    elements.detailDialog.removeAttribute("open");
    clearDetailPhotoUrl();
  }
}

function clearDetailPhotoUrl() {
  if (detailPhotoUrl) {
    URL.revokeObjectURL(detailPhotoUrl);
    detailPhotoUrl = null;
  }
  detailGalleryUrls.forEach((url) => URL.revokeObjectURL(url));
  detailGalleryUrls = [];
}

function handleEditFromDetail() {
  const entry = getOpenDetailEntry();
  if (!entry || entry.deletedAt) return;
  fillForm(entry);
  closeDetailDialog();
  showEditor();
}

async function handleMoveToTrash() {
  const entry = getOpenDetailEntry();
  if (!entry) return;

  const confirmed = window.confirm(`"${entry.title || "무제 기록"}" 기록을 휴지통으로 옮길까요?`);
  if (!confirmed) return;

  const updatedEntry = { ...entry, deletedAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  await putEntry(updatedEntry);
  const cloudSync = await autoSyncEntryToCloud(updatedEntry, "휴지통 이동을 Supabase에 반영했습니다.");
  closeDetailDialog();
  await loadEntries();
  showAlbum(entry.category);
  showToast(getCloudSaveToast("휴지통으로 옮겼습니다.", "휴지통 이동을 로컬과 Supabase에 반영했습니다.", cloudSync));
}

async function handleRestoreEntry() {
  const entry = getOpenDetailEntry();
  if (!entry) return;

  const updatedEntry = { ...entry, deletedAt: null, updatedAt: new Date().toISOString() };
  await putEntry(updatedEntry);
  const cloudSync = await autoSyncEntryToCloud(updatedEntry, "복원 상태를 Supabase에 반영했습니다.");
  closeDetailDialog();
  await loadEntries();
  showAlbum(entry.category);
  showToast(getCloudSaveToast("기록을 복원했습니다.", "복원 상태를 로컬과 Supabase에 반영했습니다.", cloudSync));
}

async function handlePermanentDelete() {
  const entry = getOpenDetailEntry();
  if (!entry) return;

  const confirmed = window.confirm("완전히 삭제하면 백업이 없는 한 복구할 수 없습니다. 삭제할까요?");
  if (!confirmed) return;

  await removeEntry(entry.id);
  let cloudDeleteFailed = false;
  if (supabaseClient && cloudSession?.user) {
    try {
      await deleteEntryFromCloud(entry, cloudSession.user.id);
    } catch (error) {
      console.error(error);
      cloudDeleteFailed = true;
      showToast(`로컬에서는 삭제됐지만 Supabase 삭제에 실패했습니다: ${normalizeCloudError(error)}`);
    }
  }
  closeDetailDialog();
  await loadEntries();
  showTrash();
  if (!cloudDeleteFailed) showToast("완전히 삭제했습니다.");
}

function getOpenDetailEntry() {
  const id = elements.detailDialog.dataset.entryId;
  return entries.find((item) => item.id === id) || null;
}

function fillForm(entry) {
  resetForm({ silent: true });
  activeAlbum = entry.category;
  elements.entryId.value = entry.id;
  elements.editorTitle.textContent = "기록 수정";
  elements.saveButton.textContent = "수정 저장";
  elements.cancelEditButton.hidden = false;
  selectedCategory = entry.category;
  categoryDrafts = { [entry.category]: entry.categoryDetails || {} };
  updateCategoryButtons();
  renderCategoryFields(entry.categoryDetails || {});
  seedAiPrompt();

  elements.titleInput.value = entry.title || "";
  elements.locationInput.value = entry.location?.name || "";
  setCapturedInputs(entry.capturedAt || entry.createdAt);
  elements.quickCommentInput.value = entry.quickComment || "";
  elements.detailedCommentInput.value = entry.detailedComment || "";
  elements.reflectionInput.value = entry.reflection || "";
  elements.tagsInput.value = (entry.tags || []).join(", ");
  photoItems = getEntryPhotos(entry);
  pendingPhotoMetadata = photoItems[0]?.metadata || entry.metadata || null;
  renderPhotoCollection();
  renderMetadataPanel(pendingPhotoMetadata);
}

function resetForm(options = {}) {
  elements.form.reset();
  elements.entryId.value = "";
  elements.editorTitle.textContent = "기록 정리";
  elements.saveButton.textContent = "저장";
  elements.cancelEditButton.hidden = true;
  selectedCategory = activeAlbum || "food";
  categoryDrafts = {};
  latestAiDraft = null;
  updateCategoryButtons();
  renderCategoryFields();
  seedAiPrompt();
  photoItems = [];
  revokePhotoStripUrls();
  elements.photoStrip.replaceChildren();
  clearPhotoPreview();

  if (!options.silent) showToast("입력 내용을 초기화했습니다.");
}

function toggleTrashView() {
  if (showingTrash) showHome();
  else showTrash();
}

async function handleExportBackup() {
  if (!entries.length) {
    showToast("백업할 기록이 없습니다.");
    return;
  }

  showToast("백업 파일을 만드는 중입니다.");
  const backupEntries = [];
  let photoCount = 0;
  for (const entry of entries) {
    const { photoBlob, photos, ...rest } = entry;
    const normalizedPhotos = getEntryPhotos(entry);
    const photoDataUrls = [];
    for (const photo of normalizedPhotos) {
      photoCount += 1;
      photoDataUrls.push({
        id: photo.id,
        dataUrl: await blobToDataUrl(photo.blob),
        meta: photo.meta || buildPhotoMeta(photo.blob, photo.metadata),
        metadata: photo.metadata || null,
        isPrimary: Boolean(photo.isPrimary)
      });
    }
    backupEntries.push({ ...rest, photoDataUrls, photoDataUrl: photoDataUrls[0]?.dataUrl || null });
  }

  const backup = {
    app: "CCC",
    backupVersion: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    stats: {
      entries: backupEntries.length,
      photos: photoCount
    },
    entries: backupEntries
  };

  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json;charset=utf-8" });
  downloadBlob(blob, `ccc-backup-${formatDateKey(new Date())}.json`);
  showToast(`백업 파일을 만들었습니다. 기록 ${backupEntries.length}개, 사진 ${photoCount}개.`);
}

async function handleImportBackup(event) {
  const [file] = event.target.files || [];
  if (!file) return;

  try {
    const text = await file.text();
    const backup = JSON.parse(text);
    if (!Array.isArray(backup.entries)) throw new Error("Invalid backup.");

    const confirmed = window.confirm(
      `${backup.entries.length}개 기록을 가져옵니다. 같은 ID는 최신 수정일 기준으로 병합하고, 판단이 어려운 충돌은 사본으로 보관합니다.`
    );
    if (!confirmed) return;

    const summary = createImportSummary();
    for (const item of backup.entries) {
      try {
        const { photoDataUrl, photoDataUrls, ...entry } = item;
        const importedPhotos = Array.isArray(photoDataUrls)
          ? photoDataUrls.map((photo, index) => ({
              id: photo.id || createId(),
              blob: dataUrlToBlob(photo.dataUrl),
              meta: photo.meta || null,
              metadata: photo.metadata || null,
              isPrimary: index === 0
            }))
          : photoDataUrl
            ? [
                {
                  id: createId(),
                  blob: dataUrlToBlob(photoDataUrl),
                  meta: entry.photoMeta || null,
                  metadata: entry.metadata || null,
                  isPrimary: true
                }
              ]
            : [];
        await putImportedEntrySafely(
          {
            ...entry,
            photos: importedPhotos,
            photoBlob: importedPhotos[0]?.blob || null,
            photoMeta: importedPhotos[0]?.meta || entry.photoMeta || null,
            metadata: importedPhotos[0]?.metadata || entry.metadata || null,
            updatedAt: entry.updatedAt || new Date().toISOString()
          },
          {
            sourceLabel: "백업",
            summary
          }
        );
      } catch (error) {
        console.error(error);
        summary.failed += 1;
      }
    }

    await loadEntries();
    showHome();
    showToast(formatImportSummary("백업 가져오기", summary));
  } catch (error) {
    console.error(error);
    showToast("백업 파일을 읽지 못했습니다.");
  } finally {
    elements.backupInput.value = "";
  }
}

async function handlePrintPdf() {
  const entry = getOpenDetailEntry();
  if (!entry) return;

  const photos = getEntryPhotos(entry);
  const imageDataUrls = [];
  for (const photo of photos) {
    imageDataUrls.push(await blobToDataUrl(photo.blob));
  }
  const popup = window.open("", "_blank");
  if (!popup) {
    showToast("팝업이 차단되어 PDF 화면을 열 수 없습니다.");
    return;
  }

  popup.document.write(buildPrintHtml(entry, imageDataUrls));
  popup.document.close();
  popup.focus();
  setTimeout(() => popup.print(), 350);
}

async function handleSaveOriginalPhoto() {
  const entry = getOpenDetailEntry();
  const photos = getEntryPhotos(entry);
  if (!photos.length) {
    showToast("저장할 원본 사진이 없습니다.");
    return;
  }

  const files = photos.map((photo, index) => {
    const fileName = photo.metadata?.fileName || `ccc-photo-${entry.id}-${index + 1}.jpg`;
    return new File([photo.blob], fileName, { type: photo.blob.type || "image/jpeg" });
  });

  if (navigator.canShare && navigator.canShare({ files }) && navigator.share) {
    try {
      await navigator.share({ title: entry.title || "CCC 원본 사진", files });
      showToast("공유 시트를 열었습니다. iPhone에서는 이미지 저장을 선택하세요.");
      return;
    } catch (error) {
      if (error.name === "AbortError") return;
    }
  }

  photos.forEach((photo, index) => {
    window.setTimeout(() => downloadBlob(photo.blob, files[index].name), index * 250);
  });
  showToast(`${photos.length}개 원본 사진 다운로드를 시작했습니다.`);
}

function buildPrintHtml(entry, imageDataUrls) {
  const details = collectPrintableRows(entry)
    .map(([label, value]) => `<dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd>`)
    .join("");

  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <title>${escapeHtml(entry.title || "CCC 기록")}</title>
  <style>
    :root { color: #12345b; background: #fffdf8; }
    body {
      margin: 32px;
      color: #12345b;
      background: #fffdf8;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      line-height: 1.55;
    }
    header {
      border: 2px solid #1d67bd;
      border-left-width: 10px;
      padding: 18px 20px;
      margin-bottom: 22px;
      background: linear-gradient(135deg, #fffdf8, #eef7ff);
    }
    small { color: #155caf; font-weight: 800; letter-spacing: .02em; text-transform: uppercase; }
    h1 { margin: 8px 0; font-size: 30px; color: #12345b; }
    figure { break-inside: avoid; margin: 0 0 18px; }
    img {
      display: block;
      max-width: 100%;
      max-height: 620px;
      object-fit: contain;
      border: 1px solid rgba(29, 103, 189, .28);
      background: #eef7ff;
    }
    dl {
      display: grid;
      grid-template-columns: 132px 1fr;
      gap: 10px 16px;
      margin-top: 22px;
      padding-top: 18px;
      border-top: 2px solid rgba(29, 103, 189, .22);
    }
    dt { color: #155caf; font-weight: 850; }
    dd { margin: 0; white-space: pre-wrap; }
    footer {
      margin-top: 28px;
      padding-top: 12px;
      border-top: 1px solid rgba(29, 103, 189, .2);
      color: #687889;
      font-size: 12px;
    }
    @media print {
      body { margin: 16mm; }
      header { break-inside: avoid; }
      figure { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <header>
    <small>CCC · ${escapeHtml(getCategoryLabel(entry.category))}</small>
    <h1>${escapeHtml(entry.title || "무제 기록")}</h1>
    <small>${escapeHtml(formatDateLong(entry.capturedAt || entry.createdAt))}</small>
  </header>
  ${imageDataUrls.map((imageDataUrl, index) => `<figure><img src="${imageDataUrl}" alt="${index + 1}번째 사진" /></figure>`).join("")}
  <dl>${details}</dl>
  <footer>CCC · Capture · Crop · Carving · ${escapeHtml(new Date().toLocaleString("ko-KR"))}</footer>
</body>
</html>`;
}

function collectPrintableRows(entry) {
  const rows = [
    ["카테고리", getCategoryLabel(entry.category)],
    ["장소", entry.location?.name || ""],
    ["촬영일", entry.capturedAt ? formatDateLong(entry.capturedAt) : ""],
    ["짧은 코멘트", entry.quickComment || ""],
    ["상세 코멘트", entry.detailedComment || ""],
    ["감상", entry.reflection || ""],
    ["태그", entry.tags?.length ? entry.tags.map((tag) => `#${tag}`).join(" ") : ""],
    ["AI 메모", entry.ai?.summary || ""]
  ];

  categories[entry.category].fields.forEach((field) => {
    const value = entry.categoryDetails?.[field.name];
    rows.push([field.label, field.type === "checkbox" ? (value ? "예" : "") : value || ""]);
  });

  return rows.filter(([, value]) => value);
}

function getEntryPhotos(entry) {
  if (!entry) return [];

  if (Array.isArray(entry.photos) && entry.photos.length) {
    return entry.photos
      .filter((photo) => photo?.blob)
      .map((photo, index) => ({
        id: photo.id || `${entry.id || "photo"}-${index + 1}`,
        blob: photo.blob,
        meta: photo.meta || buildPhotoMeta(photo.blob, photo.metadata),
        metadata: photo.metadata || null,
        isPrimary: index === 0 || Boolean(photo.isPrimary)
      }));
  }

  if (entry.photoBlob) {
    return [
      {
        id: `${entry.id || "legacy"}-photo-1`,
        blob: entry.photoBlob,
        meta: entry.photoMeta || buildPhotoMeta(entry.photoBlob, entry.metadata),
        metadata: entry.metadata || null,
        isPrimary: true
      }
    ];
  }

  return [];
}

function buildPhotoMeta(blob, metadata = null) {
  if (!blob) return null;

  return {
    type: blob.type || metadata?.fileType || "image/*",
    size: blob.size || metadata?.fileSize || null,
    name: metadata?.fileName || "",
    lastModified: metadata?.lastModified || null,
    qualityPolicy: "original-blob-no-compression"
  };
}

async function extractPhotoMetadata(file) {
  const metadata = {
    fileName: file.name || "",
    fileType: file.type || "",
    fileSize: file.size || 0,
    lastModified: file.lastModified || null,
    lastModifiedIso: file.lastModified ? new Date(file.lastModified).toISOString() : null,
    dateOriginalIso: null,
    gps: null,
    orientation: null,
    exifRead: false
  };

  if (!file.type.includes("jpeg") && !file.type.includes("jpg") && !/\.(jpe?g)$/i.test(file.name || "")) return metadata;

  try {
    const buffer = await file.arrayBuffer();
    const exif = parseExif(buffer);
    metadata.exifRead = exif.exifRead;
    metadata.dateOriginalIso = exif.dateOriginalIso;
    metadata.gps = exif.gps;
    metadata.orientation = exif.orientation;
  } catch {
    metadata.exifRead = false;
  }

  return metadata;
}

function parseExif(buffer) {
  const view = new DataView(buffer);
  const result = { exifRead: false, dateOriginalIso: null, gps: null, orientation: null };
  if (view.getUint16(0, false) !== 0xffd8) return result;

  let offset = 2;
  while (offset < view.byteLength) {
    const marker = view.getUint16(offset, false);
    offset += 2;
    const size = view.getUint16(offset, false);
    offset += 2;

    if (marker === 0xffe1) {
      const exifHeader = readAscii(view, offset, 6);
      if (exifHeader !== "Exif\0\0") return result;
      const tiffOffset = offset + 6;
      const little = view.getUint16(tiffOffset, false) === 0x4949;
      const firstIfdOffset = getUint32(view, tiffOffset + 4, little);
      const ifd0 = readIfd(view, tiffOffset, tiffOffset + firstIfdOffset, little);
      result.orientation = ifd0.tags[0x0112] || null;

      let exifTags = {};
      if (ifd0.tags[0x8769]) exifTags = readIfd(view, tiffOffset, tiffOffset + ifd0.tags[0x8769], little).tags;

      let gpsTags = {};
      if (ifd0.tags[0x8825]) gpsTags = readIfd(view, tiffOffset, tiffOffset + ifd0.tags[0x8825], little).tags;

      const dateString = exifTags[0x9003] || exifTags[0x9004] || ifd0.tags[0x0132] || "";
      result.dateOriginalIso = parseExifDate(dateString);
      result.gps = parseGps(gpsTags);
      result.exifRead = true;
      return result;
    }

    offset += size - 2;
  }

  return result;
}

function readIfd(view, tiffOffset, ifdOffset, little) {
  const tags = {};
  const entries = getUint16(view, ifdOffset, little);

  for (let index = 0; index < entries; index += 1) {
    const entryOffset = ifdOffset + 2 + index * 12;
    const tag = getUint16(view, entryOffset, little);
    const type = getUint16(view, entryOffset + 2, little);
    const count = getUint32(view, entryOffset + 4, little);
    const valueOffset = entryOffset + 8;
    tags[tag] = readExifValue(view, tiffOffset, valueOffset, type, count, little);
  }

  return { tags };
}

function readExifValue(view, tiffOffset, valueOffset, type, count, little) {
  const typeSizes = { 1: 1, 2: 1, 3: 2, 4: 4, 5: 8, 7: 1, 9: 4, 10: 8 };
  const size = (typeSizes[type] || 0) * count;
  const dataOffset = size <= 4 ? valueOffset : tiffOffset + getUint32(view, valueOffset, little);

  if (type === 2) return readAscii(view, dataOffset, count).replace(/\0+$/, "");
  if (type === 3) return count === 1 ? getUint16(view, dataOffset, little) : Array.from({ length: count }, (_, i) => getUint16(view, dataOffset + i * 2, little));
  if (type === 4) return count === 1 ? getUint32(view, dataOffset, little) : Array.from({ length: count }, (_, i) => getUint32(view, dataOffset + i * 4, little));
  if (type === 5) {
    const values = Array.from({ length: count }, (_, i) => {
      const numerator = getUint32(view, dataOffset + i * 8, little);
      const denominator = getUint32(view, dataOffset + i * 8 + 4, little);
      return denominator ? numerator / denominator : 0;
    });
    return count === 1 ? values[0] : values;
  }

  return null;
}

function parseExifDate(value) {
  if (!value || typeof value !== "string") return null;
  const match = value.match(/^(\d{4}):(\d{2}):(\d{2})\s+(\d{2}):(\d{2}):(\d{2})/);
  if (!match) return null;
  const [, year, month, day, hour, minute, second] = match;
  return new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute), Number(second)).toISOString();
}

function parseGps(tags) {
  const latRef = tags[1];
  const latValues = tags[2];
  const lngRef = tags[3];
  const lngValues = tags[4];
  if (!latRef || !latValues || !lngRef || !lngValues) return null;

  const lat = dmsToDecimal(latValues) * (String(latRef).toUpperCase() === "S" ? -1 : 1);
  const lng = dmsToDecimal(lngValues) * (String(lngRef).toUpperCase() === "W" ? -1 : 1);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return { lat, lng };
}

function dmsToDecimal(values) {
  if (!Array.isArray(values) || values.length < 3) return Number.NaN;
  return values[0] + values[1] / 60 + values[2] / 3600;
}

function getUint16(view, offset, little) {
  return view.getUint16(offset, little);
}

function getUint32(view, offset, little) {
  return view.getUint32(offset, little);
}

function readAscii(view, offset, length) {
  let value = "";
  for (let index = 0; index < length; index += 1) value += String.fromCharCode(view.getUint8(offset + index));
  return value;
}

function parseTags(value) {
  return value
    .split(/[,\n#]+/)
    .map((tag) => tag.trim())
    .filter(Boolean)
    .filter((tag, index, list) => list.indexOf(tag) === index);
}

function getCapturedAtIso() {
  const date = elements.capturedDateInput.value;
  const time = elements.capturedTimeInput.value || "00:00";
  if (!date) return null;
  return new Date(`${date}T${time}:00`).toISOString();
}

function setCapturedInputs(isoDate) {
  if (!isoDate) return;
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return;
  elements.capturedDateInput.value = formatDateInput(date);
  elements.capturedTimeInput.value = formatTimeInput(date);
}

function makeAiImageDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const url = URL.createObjectURL(blob);
    image.onload = () => {
      const maxSide = 1600;
      const scale = Math.min(1, maxSide / Math.max(image.naturalWidth, image.naturalHeight));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
      const context = canvas.getContext("2d");
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.86));
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("AI 분석용 이미지를 준비하지 못했습니다."));
    };
    image.src = url;
  });
}

function createCategoryBadge(category) {
  const badge = document.createElement("span");
  badge.className = `category-badge ${categories[category]?.className || ""}`;
  badge.textContent = getCategoryLabel(category);
  return badge;
}

function createCategoryIcon(iconName) {
  const svgNamespace = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNamespace, "svg");
  svg.setAttribute("viewBox", "0 0 64 64");
  svg.setAttribute("aria-hidden", "true");
  svg.classList.add("category-icon");

  const iconPaths = {
    food: `
      <path d="M13 34c0 10 8 18 19 18s19-8 19-18" />
      <path d="M16 34h32" />
      <path d="M22 26c2-6 8-10 14-8 4 1 7 4 8 8" />
      <path d="M21 18v-8" />
      <path d="M27 18v-8" />
      <path d="M24 20c-4 0-7-3-7-7V9" />
      <path d="M48 10v18" />
      <path d="M43 18c0-5 2-8 5-8" />
    `,
    wine: `
      <path d="M24 10h16l-2 18c-.6 5-3.4 8-6 8s-5.4-3-6-8L24 10Z" />
      <path d="M26 22h12" />
      <path d="M32 36v14" />
      <path d="M23 52h18" />
      <path d="M43 16c4 2 6 5 6 9 0 6-4 10-10 11" />
    `,
    culture: `
      <rect x="14" y="14" width="36" height="30" rx="5" />
      <path d="M20 38l9-10 7 7 5-6 9 9" />
      <path d="M24 52h16" />
      <path d="M32 44v8" />
      <path d="M39 22h.1" />
    `,
    math: `
      <path d="M12 39h10l5-24 9 37 7-18h9" />
      <path d="M43 14l9 9" />
      <path d="M52 14l-9 9" />
      <path d="M14 20h10" />
      <path d="M19 15v10" />
    `
  };

  svg.innerHTML = iconPaths[iconName] || iconPaths.food;
  return svg;
}

function getEntryExcerpt(entry) {
  return entry.quickComment || entry.detailedComment || entry.reflection || entry.location?.name || Object.values(entry.categoryDetails || {}).find(Boolean) || "메모 없음";
}

function getCategoryLabel(category) {
  return categories[category]?.label || "기타";
}

function formatDateShort(isoDate) {
  return new Intl.DateTimeFormat("ko-KR", { month: "short", day: "numeric" }).format(new Date(isoDate));
}

function formatDateLong(isoDate) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(isoDate));
}

function formatDateInput(date) {
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0"), String(date.getDate()).padStart(2, "0")].join("-");
}

function formatTimeInput(date) {
  return [String(date.getHours()).padStart(2, "0"), String(date.getMinutes()).padStart(2, "0")].join(":");
}

function formatDateKey(date) {
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0"), String(date.getDate()).padStart(2, "0")].join("-");
}

function formatGps(gps) {
  if (!gps) return "";
  return `위도 ${gps.lat.toFixed(6)}, 경도 ${gps.lng.toFixed(6)}`;
}

function formatBytes(bytes) {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

function createId() {
  if (crypto.randomUUID) return crypto.randomUUID();
  return `entry_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function structuredCloneSafe(value) {
  if (typeof structuredClone === "function") return structuredClone(value);
  return JSON.parse(JSON.stringify(value));
}

function revokeListPhotoUrls() {
  listPhotoUrls.forEach((url) => URL.revokeObjectURL(url));
  listPhotoUrls = [];
}

function revokeAlbumPhotoUrls() {
  albumPhotoUrls.forEach((url) => URL.revokeObjectURL(url));
  albumPhotoUrls = [];
}

function revokePhotoStripUrls() {
  photoStripUrls.forEach((url) => URL.revokeObjectURL(url));
  photoStripUrls = [];
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

function dataUrlToBlob(dataUrl) {
  const [header, base64] = dataUrl.split(",");
  const mime = header.match(/data:(.*?);base64/)?.[1] || "application/octet-stream";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return new Blob([bytes], { type: mime });
}

function downloadBlob(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function showToast(message) {
  clearTimeout(toastTimer);
  elements.toast.textContent = message;
  elements.toast.hidden = false;
  toastTimer = setTimeout(() => {
    elements.toast.hidden = true;
  }, 2600);
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator) || window.location.protocol === "file:") return;
  navigator.serviceWorker.register("./service-worker.js").catch(() => {
    // Static file usage is still supported without the service worker.
  });
}
