/* Study Hub Common JS
    - 네비게이션, 모달, 탭, 초기화 로직 포함
    - 확장 가능한 구조: 각 챕터에서 필요한 부분만 오버라이드 가능
*/

// --- 전역 상태 ---
window.simStep = 0;

// --- 1. 페이지 초기화 (확장 가능) ---
window.initializePage = function() {
    // 모든 섹션 숨기기
    document.querySelectorAll('.section-container').forEach(el => el.classList.remove('active'));
    
    // 첫 번째 섹션 찾기 (우선순위: data-first-section > 첫 번째 active 클래스 > 첫 번째 섹션)
    var firstSection = null;
    var firstSectionId = document.body.getAttribute('data-first-section');
    if (firstSectionId) {
        firstSection = document.getElementById(firstSectionId);
    }
    if (!firstSection) {
        firstSection = document.querySelector('.section-container.active');
    }
    if (!firstSection) {
        var sections = document.querySelectorAll('.section-container');
        if (sections.length > 0) firstSection = sections[0];
    }
    if (firstSection) firstSection.classList.add('active');
    
    // 첫 번째 네비게이션 활성화
    var navs = document.querySelectorAll('.nav-item');
    if (navs.length > 0) navs[0].classList.add('active');
    
    // 챕터별 초기화 후처리 (각 챕터에서 오버라이드 가능)
    if (typeof window.onPageInitialized === 'function') {
        window.onPageInitialized();
    }
}

// --- 2. 네비게이션 전환 ---
window.showSection = function(id, el) {
    var sections = document.querySelectorAll('.section-container');
    for(var i=0; i<sections.length; i++) sections[i].classList.remove('active');
    
    var target = document.getElementById(id);
    if(target) target.classList.add('active');

    var navs = document.querySelectorAll('.nav-item');
    for(var i=0; i<navs.length; i++) navs[i].classList.remove('active');
    
    if(el) el.classList.add('active');
}

// --- 3. 모달 제어 (확장 가능) ---
window.openModal = function(id) {
    var overlay = document.getElementById('modalOverlay');
    var title = document.getElementById('modalTitle');
    var body = document.getElementById('modalBody');
    
    if (!overlay || !title || !body) return;
    
    // contents와 modalTitles 객체는 각 HTML 파일 내부에 정의되어 있어야 함
    // window.contents 또는 const contents 둘 다 지원 (window에 등록하는 것을 권장)
    var contents = window.contents || {};
    var modalTitles = window.modalTitles || {};
    
    title.innerText = modalTitles[id] || '학습 내용';
    body.innerHTML = contents[id] || '<p>내용을 불러올 수 없습니다.</p>';
    
    overlay.classList.add('open');
    
    // 시뮬레이션 상태 초기화
    window.simStep = 0;
    
    // 탭 초기화: HTML 삽입 직후 탭이 active인지 확인
    // 즉시 실행 + requestAnimationFrame으로 이중 보장
    (function initTabs() {
        var tabContainers = body.querySelectorAll('.tab-container');
        for(var i=0; i<tabContainers.length; i++) {
            var container = tabContainers[i];
            // active 탭이 있는지 확인
            var activePane = container.querySelector('.tab-pane.active');
            var activeBtn = container.querySelector('.tab-btn.active');
            
            // active 탭이 없거나, active 탭과 버튼이 매칭되지 않으면 첫 번째 탭 활성화
            if (!activePane || !activeBtn) {
                // 모든 탭과 버튼의 active 클래스 제거
                var allPanes = container.querySelectorAll('.tab-pane');
                var allBtns = container.querySelectorAll('.tab-btn');
                for(var j=0; j<allPanes.length; j++) {
                    allPanes[j].classList.remove('active');
                    allPanes[j].style.display = 'none'; // 명시적으로 숨김
                }
                for(var j=0; j<allBtns.length; j++) allBtns[j].classList.remove('active');
                
                // 첫 번째 탭과 버튼 활성화
                var firstPane = container.querySelector('.tab-pane');
                var firstBtn = container.querySelector('.tab-btn');
                if (firstPane && firstBtn) {
                    firstPane.classList.add('active');
                    firstBtn.classList.add('active');
                    firstPane.style.display = 'block'; // 명시적으로 표시
                }
            } else {
                // active 탭이 이미 있으면, display를 강제로 block으로 설정
                activePane.style.display = 'block';
                // 다른 탭들은 숨김
                var allPanes = container.querySelectorAll('.tab-pane');
                for(var j=0; j<allPanes.length; j++) {
                    if (allPanes[j] !== activePane) {
                        allPanes[j].style.display = 'none';
                    }
                }
            }
        }
    })();
    
    // requestAnimationFrame으로 한 번 더 확인 (CSS 적용 후)
    requestAnimationFrame(function() {
        var tabContainers = body.querySelectorAll('.tab-container');
        for(var i=0; i<tabContainers.length; i++) {
            var container = tabContainers[i];
            var activePane = container.querySelector('.tab-pane.active');
            if (activePane) {
                activePane.style.display = 'block';
            }
        }
    });
    
    // 챕터별 모달 열기 전처리 (각 챕터에서 오버라이드 가능)
    if (typeof window.onModalOpening === 'function') {
        window.onModalOpening(id);
    }

    // 캔버스 그리기 (각 챕터별 함수 runCanvasDrawing이 존재하면 실행)
    if (typeof window.runCanvasDrawing === 'function') {
        setTimeout(function() {
            window.runCanvasDrawing(id);
        }, 50);
    }
};

window.closeModal = function() {
    document.getElementById('modalOverlay').classList.remove('open');
};

// --- 4. 탭 전환 ---
window.switchTab = function(tabName, btn) {
    var container = btn.closest('.tab-container');
    var btns = container.querySelectorAll('.tab-btn');
    var panes = container.querySelectorAll('.tab-pane');

    for(var i=0; i<btns.length; i++) btns[i].classList.remove('active');
    for(var i=0; i<panes.length; i++) {
        panes[i].classList.remove('active');
        panes[i].style.display = 'none'; // 명시적으로 숨김
    }
    
    btn.classList.add('active');
    var targetPane = container.querySelector('#tab-' + tabName);
    if (targetPane) {
        targetPane.classList.add('active');
        targetPane.style.display = 'block'; // 명시적으로 표시
    }
};

// --- 5. 실행 보장 로직 ---
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.initializePage);
} else {
    window.initializePage();
}
