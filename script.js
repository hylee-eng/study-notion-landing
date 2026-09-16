(function () {
  'use strict';

  /* ─────────────────────────────────────────────────────────────
     이 위젯의 핵심: 데이터는 아래 TASKS 배열 하나뿐입니다.
     탭을 눌러도 TASKS는 읽기만 할 뿐 절대 바뀌지 않습니다.
     (정렬·필터링으로도 원본을 건드리지 않습니다 - 복사본만 씁니다)
     바뀌는 것은 "같은 배열을 어떻게 그릴 것인가", 즉 렌더링 함수뿐입니다.
     ───────────────────────────────────────────────────────────── */
  var TASKS = [
    { title: '주간 회의록 정리',   owner: '김하늘', due: '3월 9일',  week: 'w1', status: '완료'   },
    { title: '콘텐츠 기획안 초안', owner: '이도윤', due: '3월 11일', week: 'w1', status: '진행 중' },
    { title: '촬영 일정 확정',     owner: '박서연', due: '3월 13일', week: 'w1', status: '진행 중' },
    { title: '예산안 검토',        owner: '최민준', due: '3월 17일', week: 'w2', status: '완료'   },
    { title: '디자인 시안 공유',   owner: '김하늘', due: '3월 19일', week: 'w2', status: '진행 중' },
    { title: '고객사 피드백 취합', owner: '이도윤', due: '3월 20일', week: 'w2', status: '할 일'   },
    { title: '최종 보고서 작성',   owner: '박서연', due: '3월 24일', week: 'w3', status: '할 일'   },
    { title: '성과 리뷰 미팅',     owner: '최민준', due: '3월 26일', week: 'w3', status: '할 일'   }
  ];

  /* 표시용 상수 (데이터가 아니라 보기 규칙입니다) */
  var STATUSES = ['할 일', '진행 중', '완료'];
  var STATUS_CLASS = { '할 일': 'st-todo', '진행 중': 'st-doing', '완료': 'st-done' };
  var WEEKS = [
    { key: 'w1', label: '1주차', range: '3월 9일 ~ 13일' },
    { key: 'w2', label: '2주차', range: '3월 16일 ~ 20일' },
    { key: 'w3', label: '3주차', range: '3월 23일 ~ 27일' }
  ];
  var AVATAR_CLASS = { '김하늘': 'av-1', '이도윤': 'av-2', '박서연': 'av-3', '최민준': 'av-4' };

  /* ── 공통 조각 ── */
  function badge(status) {
    return '<span class="st ' + STATUS_CLASS[status] + '">' + status + '</span>';
  }
  function avatar(owner) {
    return '<span class="av ' + AVATAR_CLASS[owner] + '">' + owner.charAt(0) + '</span>';
  }
  function miniCard(task, showStatus) {
    return '' +
      '<div class="mini">' +
        '<div class="t-card-title text-ink">' + task.title + '</div>' +
        '<div class="flex items-center gap-2 mini-row">' +
          avatar(task.owner) +
          '<span class="t-cap text-bodytext">' + task.owner + '</span>' +
          '<span class="t-cap text-muted push-right">' + task.due + '</span>' +
        '</div>' +
        (showStatus ? '<div class="mini-row">' + badge(task.status) + '</div>' : '') +
      '</div>';
  }

  /* ── 렌더링 1: 표 (4열, 열 폭 고정) ── */
  function renderTable() {
    var html = '<div class="tb-scroll"><div>' +
      '<div class="tb-r">' +
        '<div class="tb-h t-cap text-muted">제목</div>' +
        '<div class="tb-h t-cap text-muted">담당자</div>' +
        '<div class="tb-h t-cap text-muted">마감일</div>' +
        '<div class="tb-h t-cap text-muted">상태</div>' +
      '</div>';

    TASKS.forEach(function (task) {
      html += '<div class="tb-r">' +
        '<div class="tb-c t-body text-ink">' + task.title + '</div>' +
        '<div class="tb-c">' + avatar(task.owner) + '<span class="t-body text-bodytext">' + task.owner + '</span></div>' +
        '<div class="tb-c t-body text-bodytext">' + task.due + '</div>' +
        '<div class="tb-c">' + badge(task.status) + '</div>' +
      '</div>';
    });

    return html + '</div></div>';
  }

  /* ── 렌더링 2: 보드 (상태별 3칼럼) ── */
  function renderBoard() {
    var html = '<div class="col-grid">';

    STATUSES.forEach(function (status) {
      var group = TASKS.filter(function (t) { return t.status === status; });

      html += '<div>' +
        '<div class="col-head">' + badge(status) +
          '<span class="t-cap text-muted">' + group.length + '</span>' +
        '</div>' +
        '<div class="col-body">';

      group.forEach(function (task) { html += miniCard(task, false); });

      html += '</div></div>';
    });

    return html + '</div>';
  }

  /* ── 렌더링 3: 캘린더 (마감일 주차별 그룹) ── */
  function renderCalendar() {
    var html = '<div class="col-grid">';

    WEEKS.forEach(function (week) {
      var group = TASKS.filter(function (t) { return t.week === week.key; });

      html += '<div>' +
        '<div class="col-head">' +
          '<span class="t-card-title text-ink">' + week.label + '</span>' +
          '<span class="t-cap text-muted push-right">' + week.range + '</span>' +
        '</div>' +
        '<div class="col-body">';

      group.forEach(function (task) { html += miniCard(task, true); });

      html += '</div></div>';
    });

    return html + '</div>';
  }

  /* ── 같은 데이터를 받는 렌더링 함수 목록 ── */
  var VIEWS = { table: renderTable, board: renderBoard, calendar: renderCalendar };

  var viewEl = document.getElementById('exp-view');
  var tabs = document.querySelectorAll('#try .tab');

  function show(name) {
    viewEl.innerHTML = VIEWS[name]();   // TASKS는 그대로, 그리는 함수만 교체
    tabs.forEach(function (tab) {
      tab.setAttribute('aria-selected', String(tab.dataset.view === name));
    });
  }

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () { show(tab.dataset.view); });
  });

  show('table');   // 기본 보기
})();
