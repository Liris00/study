// 네비게이션 탭 전환
function showSection(id, el) {
    // 모든 섹션 숨기기
    document.querySelectorAll('.section-container').forEach(el => el.classList.remove('active'));
    // 선택된 섹션 보이기
    const target = document.getElementById(id);
    if(target) target.classList.add('active');
    
    // 네비게이션 버튼 활성화 상태 변경
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    const trigger =
        el ||
        (typeof event !== 'undefined' && event && event.currentTarget ? event.currentTarget : null);
    if (trigger) {
        trigger.classList.add('active');
    }
}

// 모달 열기
function openModal(id) {
    const modal = document.getElementById('modalOverlay');
    const title = document.getElementById('modalTitle');
    const body = document.getElementById('modalBody');
    const titleMap = typeof modalTitles !== 'undefined' ? modalTitles : null;

    // 전역 변수 contents에서 데이터 가져오기 (HTML 파일 내에 정의됨)
    if (typeof contents !== 'undefined' && contents[id]) {
        const data = contents[id];
        const fallbackTitle = titleMap && titleMap[id] ? titleMap[id] : '상세 학습';

        if (typeof data === 'object' && data !== null) {
            title.innerText = data.title || fallbackTitle;
            body.innerHTML = data.body || '';
        } else {
            title.innerText = fallbackTitle;
            body.innerHTML = data;
        }
    } else {
        title.innerText = '상세 학습';
        body.innerHTML = "<p>내용을 불러올 수 없습니다.</p>";
    }

    modal.classList.add('open');

    // 캔버스 그리기 함수 실행 (HTML 파일 내에 정의된 runDrawing 함수 호출)
    if (typeof runDrawing === 'function') {
        setTimeout(() => runDrawing(id), 200); // 모달이 뜬 뒤 실행
    }
}

// 모달 닫기
function closeModal() {
    document.getElementById('modalOverlay').classList.remove('open');
}