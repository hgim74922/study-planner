/**
 * EduCompass - app.js
 * 
 * [최신 개정 반영]
 * 1. 고1은 전 과목(국·영·수·통사·통과)이 공통과목 -> 5개 전 과목 등급 산출!
 * 2. 현재 고1·고2는 2022 개정 5등급제, 고3·N수생은 2015 개정 9등급제 적용! (학습자가 토글 선택도 가능)
 * 3. 모의고사는 전 학년 전국 표준 9등급제 적용!
 * 4. 고2·고3의 선택과목은 수강 인원수가 상이하므로 등급 제외, 등수(석차) 중심으로 관리!
 * 5. 7가지 공부 성향 정밀 진단 및 11개 주요 대학 실전 입결 융합 분석
 */

// --- 11개 주요 대학 입시결과(입결) 분석 DB (해커톤-입결정보 기반) ---
const UNIV_ADMISSION_DB = {
  '고려대': {
    name: '고려대학교',
    region: '서울',
    badge: 'SKY 최상위권',
    susiGyogwa: {
      jeonhyeong: '학교추천 (학생부교과)',
      cut70_9grade: '1.15 ~ 1.58등급',
      cut70_5grade: '1.00 ~ 1.15등급 (올 1등급 필수)',
      choejeo: '3개 합 7 이내 (의예과: 4합 5) + 한국사 4',
      guide: '수능 최저 충족률이 실질 경쟁률을 절반 이하로 떨어뜨립니다.'
    },
    susiJonghap: {
      jeonhyeong: '학업우수 / 계열적합 (학생부종합)',
      cut70_9grade: '1.45 ~ 2.45등급 (특목/자사 포함 2.8등급대)',
      cut70_5grade: '1.20 ~ 1.60등급',
      point: '전공 관련 심화 탐구 역량 및 세특 기록의 깊이가 결정적. 제시문 면접 대비 필수.'
    },
    jeongsi: {
      cut70Percentile: '96.5% ~ 99.0% (국수탐 백분위 평균)',
      guide: '수능 전 영역 1등급 및 백분위 97% 이상 확보 필수.'
    },
    studyDirection: '고려대는 수시 수능 최저학력기준이 매우 엄격하므로, 내신 1등급 유지와 함께 모의고사 국·영·수 1~2등급 방어가 합격의 제1열쇠입니다.'
  },
  '연세대': {
    name: '연세대학교',
    region: '서울',
    badge: 'SKY 최상위권',
    susiGyogwa: {
      jeonhyeong: '추천형 (학생부교과)',
      cut70_9grade: '1.10 ~ 1.42등급',
      cut70_5grade: '1.00 ~ 1.10등급 (극상위권)',
      choejeo: '수능최저 적용 (국수탐 중 2개 1~2등급)',
      guide: '교과 100%에 가까운 전형으로 올 1등급 성적 필수.'
    },
    susiJonghap: {
      jeonhyeong: '활동우수형 (학생부종합)',
      cut70_9grade: '1.30 ~ 2.25등급',
      cut70_5grade: '1.15 ~ 1.50등급',
      point: '제시문 기반 현장 면접의 변별력이 매우 큼. 논리적 말하기와 비판적 사고력 훈련 병행.'
    },
    jeongsi: {
      cut70Percentile: '97.0% ~ 99.2% (국수탐 백분위 평균)',
      guide: '수능 1등급 최상위권 유지.'
    },
    studyDirection: '연세대는 교과 면접 및 수능 최저를 모두 요구하므로 기본 개념의 본질적 독해력과 논리적 문제 해결 역량을 매일 체계화해야 합니다.'
  },
  '서강대': {
    name: '서강대학교',
    region: '서울',
    badge: '서성한 상위권',
    susiGyogwa: {
      jeonhyeong: '지역균형 (학생부교과)',
      cut70_9grade: '1.38 ~ 1.75등급',
      cut70_5grade: '1.15 ~ 1.35등급',
      choejeo: '3개 영역 각 3등급 이내 (완화된 수능최저)',
      guide: '수능 최저 기준이 완화되어 실질 내신 합격선이 매우 촘촘합니다.'
    },
    susiJonghap: {
      jeonhyeong: '일반 / 서강가치 (학생부종합)',
      cut70_9grade: '1.80 ~ 3.10등급',
      cut70_5grade: '1.30 ~ 1.80등급',
      point: '계열 융합형 교육과정 특성상 문·이과 교차 이수 및 수학적 역량 강조.'
    },
    jeongsi: {
      cut70Percentile: '93.0% ~ 95.5% (수학 가중치 높음)',
      guide: '수학 백분위 95% 이상 킬러 정복 권장.'
    },
    studyDirection: '서강대는 교차지원과 수학 가중치가 매우 높으므로, 문/이과를 불문하고 수학 공통·선택과목에서 안정적인 1등급을 쟁취하는 것이 최우선입니다.'
  },
  '성균관대': {
    name: '성균관대학교',
    region: '서울/수원',
    badge: '서성한 상위권',
    susiGyogwa: {
      jeonhyeong: '학교장추천 (학생부교과)',
      cut70_9grade: '1.35 ~ 1.82등급',
      cut70_5grade: '1.10 ~ 1.35등급',
      choejeo: '3개 합 7 이내 (글로벌리더/경영 등은 3합 6)',
      guide: '진로선택과목 정성평가 도입. 전공 관련 선택과목 이수 및 세특 충실도 평가.'
    },
    susiJonghap: {
      jeonhyeong: '융합형 / 탐구형 (학생부종합)',
      cut70_9grade: '1.85 ~ 3.45등급',
      cut70_5grade: '1.35 ~ 1.95등급',
      point: '전공적합성보다는 학업 역량과 자기주도적 지적 호기심을 폭넓게 평가.'
    },
    jeongsi: {
      cut70Percentile: '94.0% ~ 96.8%',
      guide: '탐구 변환표준점수 유불리 관리 필수.'
    },
    studyDirection: '성균관대는 3개 합 7의 수능 최저 충족이 필수입니다. 탐구 1과목 만점 전략과 국·영·수 중 2개 영역 2등급 이내 확보 전략이 가장 주효합니다.'
  },
  '중앙대': {
    name: '중앙대학교',
    region: '서울/안성',
    badge: '중경외시 핵심',
    susiGyogwa: {
      jeonhyeong: '지역균형 (학생부교과)',
      cut70_9grade: '1.52 ~ 1.98등급',
      cut70_5grade: '1.20 ~ 1.45등급',
      choejeo: '3개 합 7 이내 (영어 1·2등급 동일 처리)',
      guide: '영어 1·2등급이 통합 처리되어 최저 맞추기가 상대적으로 수월합니다.'
    },
    susiJonghap: {
      jeonhyeong: 'CAU융합인재 / CAU탐구인재',
      cut70_9grade: '2.10 ~ 3.75등급',
      cut70_5grade: '1.40 ~ 2.10등급',
      point: '융합인재는 고른 발전 가능성, 탐구인재는 전공 심화 탐구력 중심 선발.'
    },
    jeongsi: {
      cut70Percentile: '91.0% ~ 94.2%',
      guide: '상위 8% 이내 정시 성적 라인.'
    },
    studyDirection: '중앙대는 영어 영역 등급별 감점이 완만하므로, 국어와 수학에 학습 시간의 70%를 배분하고 탐구 1과목을 전략적으로 극대화해야 합니다.'
  },
  '경희대': {
    name: '경희대학교',
    region: '서울/국제',
    badge: '중경외시 핵심',
    susiGyogwa: {
      jeonhyeong: '지역균형 (교과 70% + 서류 30%)',
      cut70_9grade: '1.48 ~ 2.15등급 (의약학 1.0~1.3, 경영 1.96, 자전 1.79)',
      cut70_5grade: '1.18 ~ 1.50등급',
      choejeo: '2개 합 5 이내 + 한국사 5',
      guide: '교과 전형임에도 서류평가 30%가 반영되므로 세특 관리가 필수입니다.'
    },
    susiJonghap: {
      jeonhyeong: '네오르네상스 (학생부종합)',
      cut70_9grade: '1.82 ~ 3.50등급',
      cut70_5grade: '1.35 ~ 2.05등급',
      point: '수능 최저 없음! 1단계 서류 100% 후 면접 30%로 최종 선발.'
    },
    jeongsi: {
      cut70Percentile: '89.5% ~ 93.5%',
      guide: '인문계열 국어 35%, 자연계열 수학 35% 반영비율 주목.'
    },
    studyDirection: '경희대 지역균형은 2개 합 5의 수능 최저를 요구하며 교과 세특을 30% 봅니다. 평소 수행평가와 수업 태도, 취약 2과목 수능 2등급 안정화가 핵심입니다.'
  },
  '한국외대': {
    name: '한국외국어대학교',
    region: '서울/글로벌',
    badge: '어문·사회 특성화',
    susiGyogwa: {
      jeonhyeong: '학교장추천 (학생부교과)',
      cut70_9grade: '1.65 ~ 2.45등급 (서울캠 1.6~2.1 / 글로벌 2.5~3.4)',
      cut70_5grade: '1.30 ~ 1.65등급',
      choejeo: '2개 합 4 이내 (일부 학과)',
      guide: '국어, 영어 과목 반영 비중이 높음.'
    },
    susiJonghap: {
      jeonhyeong: '학생부종합 (면접형 / 서류형)',
      cut70_9grade: '2.30 ~ 3.90등급',
      cut70_5grade: '1.50 ~ 2.20등급',
      point: '외국어 및 다문화, 국제사회에 대한 관심과 융합 지식 평가.'
    },
    jeongsi: {
      cut70Percentile: '88.0% ~ 92.0%',
      guide: '영어 영역 반영 환산점수 우수자 유리.'
    },
    studyDirection: '외대는 국어와 영어 성적 비중이 결정적입니다. 내신 국·영 만점 전략과 수능 독해·구문 체화 훈련에 우선순위를 두세요.'
  },
  '서울시립대': {
    name: '서울시립대학교',
    region: '서울',
    badge: '공립 명문·도시과학',
    susiGyogwa: {
      jeonhyeong: '지역균형선발 (학생부교과)',
      cut70_9grade: '1.58 ~ 2.18등급',
      cut70_5grade: '1.25 ~ 1.50등급',
      choejeo: '3개 합 7 이내',
      guide: '공공인재, 세무, 도시공학 등 간판 학과는 치열한 경쟁.'
    },
    susiJonghap: {
      jeonhyeong: '학생부종합I(면접) / 학생부종합II(서류)',
      cut70_9grade: '2.05 ~ 3.25등급',
      cut70_5grade: '1.40 ~ 1.95등급',
      point: '지원 학과별 인재상 부합도와 전공 관련 이수 과목 성취도 면밀 검토.'
    },
    jeongsi: {
      cut70Percentile: '90.0% ~ 93.0%',
      guide: '수학, 탐구 반영 비중 높음.'
    },
    studyDirection: '서울시립대는 3개 영역 합 7의 수능 최저와 높은 실질 경쟁률을 갖습니다. 과목별 편차를 줄이고 전 과목 2등급 이내로 고르게 맞추는 학습이 필요합니다.'
  },
  '이화여대': {
    name: '이화여자대학교',
    region: '서울',
    badge: '여대 최상위',
    susiGyogwa: {
      jeonhyeong: '고교추천 (교과 80% + 면접 20%)',
      cut70_9grade: '1.45 ~ 1.88등급',
      cut70_5grade: '1.18 ~ 1.40등급',
      choejeo: '수능 최저학력기준 없음!',
      guide: '수능 최저가 없는 대신 내신 극상위권과 면접 실전력이 합격을 좌우.'
    },
    susiJonghap: {
      jeonhyeong: '미래인재 (학생부종합)',
      cut70_9grade: '1.85 ~ 3.15등급',
      cut70_5grade: '1.35 ~ 1.90등급',
      point: '자연계열 2개 합 5, 인문 3개 합 6의 높은 수능 최저 극복이 관건.'
    },
    jeongsi: {
      cut70Percentile: '91.0% ~ 94.0%',
      guide: '수능 통합 선발 및 학과 선택권.'
    },
    studyDirection: '이화여대 고교추천을 노린다면 내신 올 1등급 몰입, 미래인재를 노린다면 수능 3합 6을 맞출 수 있는 킬러 과목 2개 완성이 필수입니다.'
  },
  '광운대': {
    name: '광운대학교',
    region: '서울',
    badge: '전자·IT 공학 특성화',
    susiGyogwa: {
      jeonhyeong: '지역균형 (학생부교과)',
      cut70_9grade: '1.92 ~ 2.65등급 (전자/컴퓨터공학부 1.9~2.2)',
      cut70_5grade: '1.38 ~ 1.70등급',
      choejeo: '수능 최저 없음',
      guide: '내신 성적 100% 반영으로 이공계열 상위권 학과 1등급대 관리 필수.'
    },
    susiJonghap: {
      jeonhyeong: '광운참빛인재 (학생부종합)',
      cut70_9grade: '2.50 ~ 4.10등급',
      cut70_5grade: '1.60 ~ 2.30등급',
      point: '수학 및 과학교과 세특과 프로그래밍/전자 관련 실습 활동 중점 평가.'
    },
    jeongsi: {
      cut70Percentile: '83.0% ~ 88.5%',
      guide: '수학 미적분/기하 필수 반영 학과 다수.'
    },
    studyDirection: '광운대 공학계열을 목표한다면 수학(수학I, 수학II, 미적분)과 물리/화학 선택과목의 내신 석차를 상위권으로 집중 관리해야 합니다.'
  },
  '단국대': {
    name: '단국대학교(죽전)',
    region: '경기',
    badge: '수도권 주요 대학',
    susiGyogwa: {
      jeonhyeong: '지역균형선발 (학생부교과)',
      cut70_9grade: '2.15 ~ 2.90등급',
      cut70_5grade: '1.45 ~ 1.85등급',
      choejeo: '2개 합 6 이내 (수능최저 완만)',
      guide: '안정적인 합격선 형성.'
    },
    susiJonghap: {
      jeonhyeong: 'DKU인재 (학생부종합)',
      cut70_9grade: '2.75 ~ 4.25등급',
      cut70_5grade: '1.70 ~ 2.45등급',
      point: '진로 일관성과 전공 관련 교과 세특 활동의 적극성 평가.'
    },
    jeongsi: {
      cut70Percentile: '81.0% ~ 86.5%',
      guide: '백분위 80% 초중반대 안정권.'
    },
    studyDirection: '단국대는 2개 합 6의 수능 최저를 요구하므로, 자신이 가장 자신 있는 2개 과목을 확실한 2~3등급으로 고정시키는 전략이 효과적입니다.'
  }
};

// --- 신규 설문: 7가지 공부 성향 데이터 ---
const LEARNING_STYLES = [
  {
    id: 'style_1',
    num: 1,
    title: '원리·본질 탐구형',
    desc: '개념이 도출된 배경과 "왜 그런지" 원리를 확실히 이해한 뒤 문제를 푸는 타입입니다.',
    icon: 'compass',
    badge: '깊이 있는 개념파',
    strength: '한 번 정립된 개념은 잊어버리지 않으며, 킬러 문항이나 신유형 문제를 만났을 때 당황하지 않고 원리적으로 풀어냅니다.',
    trap: '원리와 개념 이해에 너무 많은 시간을 쏟다가 정작 실전 문제 풀이 연습량이 부족해 시험장에서 시간 부족에 직면할 위험이 큽니다.',
    prescription: '개념 공부는 1회 30분으로 타이머를 맞추고, 이해가 70% 정도 되었을 때 즉시 기본-응용 문제 5문항을 풀며 "개념이 문제로 구현되는 방식"을 체화하세요.',
    dailyHabit: '공부 시작 전 공식의 유도 과정을 백지에 3분 만에 증명해보고, 곧바로 관련 기출 3문항에 적용하는 [원리-실전 연결 루틴]을 실천하세요.'
  },
  {
    id: 'style_2',
    num: 2,
    title: '통암기·복사기형',
    desc: '교재나 서술형 문장을 토대로 핵심 키워드와 구절을 통째로 외워 정답률을 올리는 타입입니다.',
    icon: 'copy',
    badge: '정밀 암기 마스터',
    strength: '내신 교과서 및 부교재의 지문, 서술형 평가, 핵심 어휘 문제에서 실수가 거의 없고 압도적인 고득점을 확보합니다.',
    trap: '문장의 조건이 살짝 바뀌거나 낯선 외부 지문, 새로운 수능형 모의고사 변형 문제를 만나면 응용력이 떨어져 오답이 발생합니다.',
    prescription: '단순 문장 암기를 넘어 "이 문장이 왜 중요한지, 조건이 A에서 B로 바뀌면 결론이 어떻게 바뀌는지" 인과관계 1줄 메모를 반드시 병행하세요.',
    dailyHabit: '암기한 문장을 빈 종이에 그대로 복사해 적은 뒤, 빨간 펜으로 출제될 수 있는 변형 조건 2가지를 예측하여 적어보는 연습을 하세요.'
  },
  {
    id: 'style_3',
    num: 3,
    title: '양치기·문제 풀이형',
    desc: '이론 정리보다 최대한 많은 문제를 풀어보며 양으로 감각을 익히고 유형에 적응하는 타입입니다.',
    icon: 'layers',
    badge: '실전 다독형',
    strength: '문제 푸는 속도가 빠르고 웬만한 대표 유형은 기계적으로 척척 풀어내어 시험 초반 시간 단축 능력이 탁월합니다.',
    trap: '틀린 문제를 다시 풀지 않고 해설지만 훑은 뒤 "알았다"고 착각하며 다음 문제집으로 넘어가는 전형적인 "양치기 함정"에 빠집니다.',
    prescription: '새 문제집을 사는 것을 멈추고, 이미 푼 문제집 중 틀렸던 문제만 골라 해설지 없이 다시 풀어내는 [오답 심화 3회독]을 강제 도입하세요.',
    dailyHabit: '하루에 100문제를 푸는 것보다, 틀린 5문제를 완벽히 씹어 먹고 [오답 원인: 개념누락 / 계산실수 / 발상부족]을 태깅하는 루틴을 유지하세요.'
  },
  {
    id: 'style_4',
    num: 4,
    title: '단권화·요약정리형',
    desc: '여러 교재와 프린트의 핵심 내용을 나만의 노트 한 권으로 완벽하게 체계화하여 정리하는 타입입니다.',
    icon: 'book-open',
    badge: '체계적 정리 전문가',
    strength: '시험 1주 전이나 직전 벼락치기 시 압도적인 복습 속도를 자랑하며, 전체 시험 범위의 뼈대를 조망하는 능력이 매우 뛰어납니다.',
    trap: '필기 자체의 완성도(글씨체, 색상, 레이아웃)에 도취되어 "필기하는 노동을 공부로 착각"하고 실제 뇌의 인출 연습이 부족해질 수 있습니다.',
    prescription: '정리 노트 작성 시간은 전체 공부 시간의 20% 이내로 엄격히 제한하고, 정리한 뒤에는 노트를 덮고 백지에 목차를 다시 그려보는 인출을 병행하세요.',
    dailyHabit: '노트를 예쁘게 새로 쓰기보다는 교과서나 기본서 한 권에 모든 포스트잇과 필기를 집약하는 [진짜 단권화] 방식을 고수하세요.'
  },
  {
    id: 'style_5',
    num: 5,
    title: '역설계·기출 분석형',
    desc: '기출문제나 오답을 먼저 분석하여 시험 출제 포인트와 빈출 항목을 역으로 공략하는 타입입니다.',
    icon: 'trending-up',
    badge: '시험 출제 저격수',
    strength: '출제자의 의도를 꿰뚫어 불필요한 군더더기 공부를 줄이고 가장 점수에 직결되는 핵심 파트를 단기간에 공략하는 효율 극대화형입니다.',
    trap: '기초 개념이 부실한 상태에서 족보나 기출 패턴만 역설계하면, 출제 패턴이 바뀌거나 신유형이 나오는 순간 점수가 폭락할 수 있습니다.',
    prescription: '기출 분석을 통해 빈출 영역을 파악했다면, 반드시 해당 단원의 개념서로 역주행하여 주변부 지변 개념까지 단단히 채워 넣으세요.',
    dailyHabit: '문제를 풀고 난 뒤 "출제자는 왜 이 조건(숫자, 단어)을 주었을까?"를 1문항당 1줄씩 출제자 입장에서 역질문해보세요.'
  },
  {
    id: 'style_6',
    num: 6,
    title: '회독·반복 학습형',
    desc: '처음부터 깊게 다 이해하려 하기보다, 전체 내용을 여러 번 빠르게 반복해서 읽으며 이해도를 높이는 타입입니다.',
    icon: 'repeat',
    badge: '누적 기억 마스터',
    strength: '어려운 내용에 지쳐 중도 포기하지 않고 전체 범위를 완주하며, 반복을 통해 뇌의 장기기억으로 고착화하는 힘이 가장 강합니다.',
    trap: '1회독 때 이해 못한 부분을 2~3회독 때도 "또 읽으면 알겠지" 하고 무비판적으로 넘어가 정체기가 길어질 수 있습니다.',
    prescription: '회독마다 뚜렷한 목표를 설정하세요. [1회독: 큰 흐름 파악] → [2회독: 핵심 공식 및 개념 체화] → [3회독: 모르는 선지와 오답만 발췌독].',
    dailyHabit: '어제 본 범위를 오늘 10분 동안 고속 스캔(훑어읽기)한 뒤 오늘의 진도를 나가는 [누적 고속 회독]을 루틴화하세요.'
  },
  {
    id: 'style_7',
    num: 7,
    title: '설명·출력 중심형',
    desc: '남에게 개념을 가르쳐 주듯 직접 말로 설명해 보거나 백지 노트에 적어보며 아는 것과 모르는 것을 구분하는 타입입니다.',
    icon: 'mic',
    badge: '메타인지 종결자 (파인만 학습법)',
    strength: '내가 정말 아는 것과 대충 안다고 착각한 것을 가장 확실하게 분리해내어, 실제 시험장에서 오답률이 가장 낮고 학습 효과가 가장 높습니다.',
    trap: '말로 설명할 스터디 친구나 환경이 마땅치 않거나, 말로는 유창한데 실제 시험의 복잡한 수식 계산 훈련을 소홀히 할 수 있습니다.',
    prescription: '스마트폰 음성 녹음기나 빈 종이를 활용하여 혼자서도 5분 개념 브리핑을 진행하고, 말로 설명한 뒤 반드시 실전 계산 문제를 손으로 풀어보세요.',
    dailyHabit: '오늘 공부를 마친 뒤 책을 덮고, 스마트폰 메모장에 "오늘 배운 핵심 개념 3가지를 초등학생도 이해할 수 있게 3줄로 설명"해 보세요.'
  }
];

// --- 전역 상태 (State) ---
const state = {
  currentStep: 1,
  totalSteps: 9,
  data: {
    grade: '고1', // 고1, 고2, 고3, N수생
    curriculum: '2022', // '2022' (5등급제) 또는 '2015' (9등급제)
    examFocus: '', // 내신, 모의고사, 둘다
    schoolTotal: 250, // 전교생 수
    // 고1의 경우: 5개 전 과목이 공통과목! (국어, 영어, 수학, 통합과학, 통합사회)
    naesinSubjects: [
      { id: 'sub_kor', name: '국어', currentRank: 20, targetRank: 8, isCommon: true },
      { id: 'sub_eng', name: '영어', currentRank: 25, targetRank: 10, isCommon: true },
      { id: 'sub_math', name: '수학', currentRank: 30, targetRank: 12, isCommon: true },
      { id: 'sub_sci', name: '통합과학', currentRank: 22, targetRank: 9, isCommon: true }, // 고1은 공통!
      { id: 'sub_soc', name: '통합사회', currentRank: 18, targetRank: 8, isCommon: true }, // 고1은 공통!
    ],
    // 모의고사는 전 학년 전국 표준 9등급제!
    mockGrades: {
      '국어': { current: 3, target: 1 },
      '영어': { current: 2, target: 1 },
      '수학': { current: 3, target: 1 },
      '사회': { current: 2, target: 1 },
      '과학': { current: 2, target: 1 }
    },
    targetUniversity: '경희대',
    targetMajor: '자율전공학부',
    targetUndecided: false,
    daysUntilExam: '1주 이내', // 1주 이내, 2주 전, 3~4주 전, 1~2개월, 미정
    examPrepLevel: '거의 안 됨', // 거의 안 됨, 개념만 완료, 문제 풀이 중, 총복습 중
    primaryStruggle: '기본 문제는 풀지만 응용 문제에 약함',
    learningStyle: '원리·본질 탐구형',
    studyMethods: ['개념을 읽고 이해하기', '문제집 풀이', '오답 노트 작성'],
    studyEnvironments: ['학교 수업', '인터넷 강의', '문제집 중심 학습'],
    otherEnvironmentText: ''
  }
};

// 등급 계산 공식 (2022 개정 5등급제 vs 2015 개정 9등급제)
function calculateGrade(rank, total, curriculum = (state.data.curriculum || '2022')) {
  if (!rank || !total || rank <= 0 || total <= 0) {
    return curriculum === '2022' ? 5 : 9;
  }
  const pct = (rank / total) * 100;
  if (curriculum === '2022') {
    // 2022 개정 고교 내신 5등급제 (고1, 고2)
    if (pct <= 10) return 1;
    if (pct <= 34) return 2;
    if (pct <= 66) return 3;
    if (pct <= 90) return 4;
    return 5;
  } else {
    // 2015 개정 고교 내신 9등급제 (고3, N수생)
    if (pct <= 4) return 1;
    if (pct <= 11) return 2;
    if (pct <= 23) return 3;
    if (pct <= 40) return 4;
    if (pct <= 60) return 5;
    if (pct <= 77) return 6;
    if (pct <= 89) return 7;
    if (pct <= 96) return 8;
    return 9;
  }
}

// 질문 6 선택지 목록
const struggleOptions = [
  { id: 's1', title: '기초 개념이 부족한 편', desc: '교과서나 기본서의 핵심 원리가 머릿속에 확실히 정리되어 있지 않아요.', icon: 'book-open' },
  { id: 's2', title: '기본 개념은 이해하지만 문제 풀이가 어려움', desc: '선생님 설명이나 개념서는 알겠는데 문제만 보면 어떤 공식을 쓸지 막혀요.', icon: 'help-circle' },
  { id: 's3', title: '기본 문제는 풀지만 응용 문제에 약함', desc: '유형서의 대표 문제는 풀지만 두세 가지 개념이 복합된 변형 문제에서 틀려요.', icon: 'trending-up' },
  { id: 's4', title: '대부분의 문제를 풀지만 고난도 문제에 약함', desc: '1등급을 가르는 킬러 문항이나 신유형 문제를 만났을 때 시간 부족과 막힘을 겪어요.', icon: 'award' },
  { id: 's5', title: '실력은 있지만 시험에서 점수가 기대보다 낮음', desc: '평소 풀 때는 다 맞는데 실전 시험만 보면 계산 실수, 시간 부족, 긴장으로 점수가 깎여요.', icon: 'alert-triangle' },
  { id: 's6', title: '잘 모르겠음', desc: '어디서부터 무엇이 문제인지 객관적으로 파악하기 어려워요.', icon: 'compass' }
];

// 질문 8 선택지 목록 (학습 방법)
const studyMethodOptions = [
  { id: 'm1', label: '개념을 읽고 이해하기', icon: 'book' },
  { id: 'm2', label: '필기 및 노트 정리', icon: 'edit-3' },
  { id: 'm3', label: '교과서 문제 풀이', icon: 'file-text' },
  { id: 'm4', label: '문제집 풀이', icon: 'layers' },
  { id: 'm5', label: '백지 복습 및 암기 테스트', icon: 'check-square' },
  { id: 'm6', label: '오답 노트 작성', icon: 'alert-circle' },
  { id: 'm7', label: '기출문제 및 실전 모의고사 풀이', icon: 'clock' }
];

// 질문 9 선택지 목록 (공부 환경)
const studyEnvOptions = [
  { id: 'e1', label: '학교 수업', icon: 'home' },
  { id: 'e2', label: '학원', icon: 'users' },
  { id: 'e3', label: '인터넷 강의', icon: 'video' },
  { id: 'e4', label: '과외', icon: 'user-check' },
  { id: 'e5', label: '교과서 및 참고서로 독학', icon: 'book-open' },
  { id: 'e6', label: '문제집 중심 학습', icon: 'grid' },
  { id: 'e7', label: '스터디 앱 또는 AI 도구', icon: 'cpu' },
  { id: 'e8', label: '기타', icon: 'more-horizontal' }
];

// 고2, 고3 추천 과목 리스트
const high23Subjects = [
  '문학', '독서', '수학I', '수학II', '미적분', '확률과통계', '영어I', '영어II',
  '물리학I', '화학I', '생명과학I', '지구과학I',
  '생활과윤리', '윤리와사상', '한국지리', '사회문화', '정치와법', '한국사'
];

// --- 초기화 ---
document.addEventListener('DOMContentLoaded', () => {
  loadFromLocalStorage();
  renderCurrentStep();
  setupEventListeners();
  if (window.feather) feather.replace();
});

window.resetSurvey = function () {
  state.currentStep = 1;
  document.getElementById('report-container').classList.add('hidden');
  document.getElementById('survey-container').classList.remove('hidden');
  renderCurrentStep();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.clearAndRestart = function () {
  if (confirm('설문 데이터를 모두 초기화하고 처음부터 다시 시작하시겠습니까?')) {
    localStorage.removeItem('study_diagnostic_state_v3');
    location.reload();
  }
};

function loadFromLocalStorage() {
  const saved = localStorage.getItem('study_diagnostic_state_v3');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.data) {
        state.data = { ...state.data, ...parsed.data };
      }
    } catch (e) {
      console.warn('저장된 설문 데이터를 불러오지 못했습니다.', e);
    }
  }
}

function saveToLocalStorage() {
  localStorage.setItem('study_diagnostic_state_v3', JSON.stringify({ data: state.data }));
}

function setupEventListeners() {
  document.getElementById('btn-prev')?.addEventListener('click', prevStep);
  document.getElementById('btn-next')?.addEventListener('click', nextStep);

  // 상단 데모 프리셋 버튼
  document.querySelectorAll('.demo-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const type = e.currentTarget.dataset.type;
      applyDemoData(type);
    });
  });
}

// 교육과정 직접 전환 토글 (2022 개정 5등급제 vs 2015 개정 9등급제)
window.setCurriculum = function (curr) {
  state.data.curriculum = curr;
  saveToLocalStorage();
  renderCurrentStep();
  showToast(curr === '2022' ? '2022 개정 교육과정 (5등급제)로 설정되었습니다.' : '2015 개정 교육과정 (9등급제)로 설정되었습니다.');
};

// 체험용 샘플 데이터 적용
function applyDemoData(type) {
  if (type === 'high1') {
    state.data.grade = '고1';
    state.data.curriculum = '2022'; // 고1은 2022 개정 5등급제
    state.data.examFocus = '내신 중시';
    state.data.schoolTotal = 250;
    // 고1은 5개 전 과목이 공통과목!
    state.data.naesinSubjects = [
      { id: 'sub_kor', name: '국어', currentRank: 18, targetRank: 8, isCommon: true },
      { id: 'sub_eng', name: '영어', currentRank: 24, targetRank: 9, isCommon: true },
      { id: 'sub_math', name: '수학', currentRank: 28, targetRank: 10, isCommon: true },
      { id: 'sub_sci', name: '통합과학', currentRank: 20, targetRank: 8, isCommon: true }, // 공통!
      { id: 'sub_soc', name: '통합사회', currentRank: 15, targetRank: 6, isCommon: true }, // 공통!
    ];
    state.data.targetUniversity = '경희대';
    state.data.targetMajor = '자율전공학부';
    state.data.targetUndecided = false;
    state.data.daysUntilExam = '1주 이내';
    state.data.examPrepLevel = '거의 안 됨'; // 시험 1주일 전 + 공부 거의 안 됨 + 머리 좋은 편(원리탐구형)
    state.data.primaryStruggle = '실력은 있지만 시험에서 점수가 기대보다 낮음';
    state.data.learningStyle = '원리·본질 탐구형';
    state.data.studyMethods = ['개념을 읽고 이해하기', '필기 및 노트 정리', '문제집 풀이'];
    state.data.studyEnvironments = ['학교 수업', '학원', '인터넷 강의'];
  } else if (type === 'high2') {
    state.data.grade = '고2';
    state.data.curriculum = '2022'; // 고2도 2022 개정 5등급제
    state.data.examFocus = '둘다 중요';
    state.data.schoolTotal = 240;
    // 고2: 공통과목과 선택과목 분리
    state.data.naesinSubjects = [
      { id: 's_1', name: '문학', currentRank: 18, targetRank: 8, isCommon: true },
      { id: 's_2', name: '수학I', currentRank: 25, targetRank: 9, isCommon: true },
      { id: 's_3', name: '영어I', currentRank: 20, targetRank: 7, isCommon: true },
      { id: 's_4', name: '생명과학I', currentRank: 15, targetRank: 5, isCommon: false }, // 선택과목 (등급제외)
      { id: 's_5', name: '사회문화', currentRank: 18, targetRank: 7, isCommon: false }, // 선택과목 (등급제외)
    ];
    state.data.mockGrades = {
      '국어': { current: 2, target: 1 },
      '영어': { current: 2, target: 1 },
      '수학': { current: 3, target: 1 },
      '사회': { current: 2, target: 1 },
      '과학': { current: 2, target: 1 }
    };
    state.data.targetUniversity = '고려대';
    state.data.targetMajor = '생명공학부';
    state.data.targetUndecided = false;
    state.data.daysUntilExam = '2주 전';
    state.data.examPrepLevel = '개념만 완료';
    state.data.primaryStruggle = '대부분의 문제를 풀지만 고난도 문제에 약함';
    state.data.learningStyle = '설명·출력 중심형';
    state.data.studyMethods = ['문제집 풀이', '오답 노트 작성', '기출문제 및 실전 모의고사 풀이'];
    state.data.studyEnvironments = ['학교 수업', '인터넷 강의', '교과서 및 참고서로 독학'];
  } else if (type === 'high3') {
    state.data.grade = '고3';
    state.data.curriculum = '2015'; // 고3은 2015 개정 9등급제!
    state.data.examFocus = '모의고사 중시';
    state.data.schoolTotal = 220;
    state.data.naesinSubjects = [
      { id: 's_1', name: '독서', currentRank: 22, targetRank: 8, isCommon: true },
      { id: 's_2', name: '미적분', currentRank: 28, targetRank: 9, isCommon: true },
      { id: 's_3', name: '영어독해', currentRank: 24, targetRank: 8, isCommon: true },
      { id: 's_4', name: '물리학I', currentRank: 18, targetRank: 6, isCommon: false },
      { id: 's_5', name: '화학I', currentRank: 20, targetRank: 7, isCommon: false }
    ];
    state.data.mockGrades = {
      '국어': { current: 3, target: 1 },
      '영어': { current: 2, target: 1 },
      '수학': { current: 2, target: 1 },
      '사회': { current: 2, target: 1 },
      '과학': { current: 2, target: 1 }
    };
    state.data.targetUniversity = '성균관대';
    state.data.targetMajor = '소프트웨어학과';
    state.data.targetUndecided = false;
    state.data.daysUntilExam = '3~4주 전';
    state.data.examPrepLevel = '문제 풀이 중';
  }

  saveToLocalStorage();
  showToast(`${type === 'high1' ? '고1 [전과목 공통 / 2022 개정 5등급제]' : type === 'high2' ? '고2 [2022 개정 5등급제 / 선택과목 분리]' : '고3 [2015 개정 9등급제 / 수능형]'} 데모가 적용되었습니다!`);
  renderCurrentStep();
}

// 단계 렌더링 컨트롤러
function renderCurrentStep() {
  const stepContainer = document.getElementById('step-content');
  const progressFill = document.getElementById('progress-fill');
  const stepNumberBadge = document.getElementById('step-number-badge');
  const stepTitle = document.getElementById('step-title');
  const stepDescription = document.getElementById('step-description');
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');

  // 진행도 바
  const progressPercent = ((state.currentStep) / state.totalSteps) * 100;
  if (progressFill) progressFill.style.width = `${progressPercent}%`;
  if (stepNumberBadge) stepNumberBadge.textContent = `단계 ${state.currentStep} / ${state.totalSteps}`;

  // 이전 버튼
  if (state.currentStep === 1) {
    btnPrev?.classList.add('opacity-40', 'cursor-not-allowed');
    if (btnPrev) btnPrev.disabled = true;
  } else {
    btnPrev?.classList.remove('opacity-40', 'cursor-not-allowed');
    if (btnPrev) btnPrev.disabled = false;
  }

  // 다음 버튼
  if (state.currentStep === state.totalSteps) {
    if (btnNext) {
      btnNext.innerHTML = `<span>대학 입결 매칭 & 맞춤 리포트 생성하기</span><i data-feather="check-circle" class="w-5 h-5 ml-1"></i>`;
      btnNext.classList.remove('bg-indigo-600', 'hover:bg-indigo-700');
      btnNext.classList.add('bg-emerald-600', 'hover:bg-emerald-700');
    }
  } else {
    if (btnNext) {
      btnNext.innerHTML = `<span>다음 단계</span><i data-feather="arrow-right" class="w-4 h-4 ml-1"></i>`;
      btnNext.classList.add('bg-indigo-600', 'hover:bg-indigo-700');
      btnNext.classList.remove('bg-emerald-600', 'hover:bg-emerald-700');
    }
  }

  switch (state.currentStep) {
    case 1:
      stepTitle.textContent = '1. 현재 나이(학년)를 선택해주세요';
      stepDescription.textContent = '현재 1·2학년은 2022 개정 5등급제, 3학년·N수생은 2015 개정 9등급제가 자동 적용됩니다.';
      renderStep1(stepContainer);
      break;
    case 2:
      stepTitle.textContent = '2. 어떤 시험을 더 중점적으로 준비하시나요?';
      stepDescription.textContent = '수시 교과/학종, 수능 정시, 수능 최저 충족 등 학습 가중치를 결정합니다.';
      renderStep2(stepContainer);
      break;
    case 3:
      stepTitle.textContent = '3. 현재 성적과 목표 성적을 입력해주세요';
      stepDescription.textContent = state.data.grade === '고1' 
        ? '고1은 5개 전 과목(국/영/수/통사/통과)이 공통과목이므로 전 과목 5등급제 등급이 산출됩니다.'
        : '고2·고3은 공통과목은 등급이 산출되며, 선택과목은 수강인원 차이로 등수(석차) 중심으로 관리됩니다.';
      renderStep3(stepContainer);
      break;
    case 4:
      stepTitle.textContent = '4. 목표 대학과 학과(또는 희망 진로)가 있나요?';
      stepDescription.textContent = '해커톤 입결 분석 DB(고려대, 연세대, 성균관대, 서강대, 경희대 등 11개 대학)의 실전 합격 컷과 즉시 대조합니다.';
      renderStep4(stepContainer);
      break;
    case 5:
      stepTitle.textContent = '5. 다음 시험까지 얼마나 남았나요?';
      stepDescription.textContent = '남은 기간에 맞춰 파이널 벼락치기 또는 단계별 심화 커리큘럼을 배분합니다.';
      renderStep5(stepContainer);
      break;
    case 6:
      stepTitle.textContent = '6. 공부할 때 어떤 점이 가장 힘드신가요?';
      stepDescription.textContent = '학습 정체를 유발하는 핵심 병목 원인을 진단하여 실질적 처방전을 제시합니다.';
      renderStep6(stepContainer);
      break;
    case 7:
      stepTitle.textContent = '7. 당신의 공부 성향은 무엇인가요?';
      stepDescription.textContent = '자신의 인지 스타일과 공부 방식에 최적화된 학습 처방과 함정 극복법을 도출합니다.';
      renderStep7(stepContainer);
      break;
    case 8:
      stepTitle.textContent = '8. 현재 주로 사용하는 학습 방법은 무엇인가요?';
      stepDescription.textContent = '복수 선택 가능. 인풋(개념/강의)과 아웃풋(인출/풀이) 메타인지 밸런스를 측정합니다.';
      renderStep8(stepContainer);
      break;
    case 9:
      stepTitle.textContent = '9. 현재 어떤 환경/수단으로 공부하고 있나요?';
      stepDescription.textContent = '복수 선택 가능. 학원·인강과 혼자 공부하는 순공 자습 시간의 시너지를 설계합니다.';
      renderStep9(stepContainer);
      break;
  }

  if (window.feather) feather.replace();
}

// 1단계: 나이/학년 선택 (고1/고2는 2022 5등급제, 고3/N수생은 2015 9등급제)
function renderStep1(container) {
  const grades = [
    { value: '고1', badge: '2022 개정 5등급제', desc: '1학년은 모든 과목(국·영·수·통사·통과)이 공통과목으로 운영됩니다.' },
    { value: '고2', badge: '2022 개정 5등급제', desc: '공통과목은 5등급제, 선택과목은 수강인원 상이로 등수 중심 관리' },
    { value: '고3', badge: '2015 개정 9등급제', desc: '기존 9등급제 체제 유지, 수능 최저 충족 및 수시/정시 원서 집중' },
    { value: 'N수생', badge: '2015 개정 9등급제', desc: '수능 모의고사 9등급제 및 전년도 9등급제 입결 기반 정시 몰입' }
  ];

  let html = `
    <div class="space-y-5">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
  `;

  grades.forEach(g => {
    const isSelected = state.data.grade === g.value;
    html += `
      <div class="selectable-card ${isSelected ? 'selected' : ''}" onclick="selectGrade('${g.value}')">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center space-x-2">
            <span class="text-xl font-bold text-gray-900">${g.value}</span>
            <span class="text-xs px-2.5 py-0.5 rounded-full font-semibold ${isSelected ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-700'}">${g.badge}</span>
          </div>
          <div class="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center check-circle ${isSelected ? 'border-indigo-600 bg-indigo-600 text-white' : ''}">
            <i data-feather="check" class="w-3.5 h-3.5 check-icon"></i>
          </div>
        </div>
        <p class="text-sm text-gray-600">${g.desc}</p>
      </div>
    `;
  });

  html += `
      </div>

      <!-- 교육과정 직접 전환 토글 (사용자 선택권 보장) -->
      <div class="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
        <div>
          <span class="font-bold text-gray-800 block">내신 등급제 적용 기준:</span>
          <span class="text-gray-500">현재 선택: <strong>${state.data.curriculum === '2022' ? '2022 개정 5등급제 (1·2학년)' : '2015 개정 9등급제 (3학년·N수생)'}</strong></span>
        </div>
        <div class="flex items-center space-x-2">
          <button type="button" onclick="setCurriculum('2022')" 
            class="px-3 py-1.5 rounded-lg font-bold border transition-all ${state.data.curriculum === '2022' ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}">
            2022 개정 (5등급제)
          </button>
          <button type="button" onclick="setCurriculum('2015')" 
            class="px-3 py-1.5 rounded-lg font-bold border transition-all ${state.data.curriculum === '2015' ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}">
            2015 개정 (9등급제)
          </button>
        </div>
      </div>
    </div>
  `;

  container.innerHTML = html;
}

window.selectGrade = function (val) {
  state.data.grade = val;

  // 학년별 기본 교육과정 자동 세팅:
  // 1학년, 2학년 -> 2022 개정 5등급제
  // 3학년, N수생 -> 2015 개정 9등급제
  if (val === '고1' || val === '고2') {
    state.data.curriculum = '2022';
  } else {
    state.data.curriculum = '2015';
  }

  // 1. 고1인 경우: 5개 전 과목이 공통과목! (통합과학/사회 포함)
  if (val === '고1') {
    state.data.naesinSubjects = [
      { id: 'sub_kor', name: '국어', currentRank: 20, targetRank: 8, isCommon: true },
      { id: 'sub_eng', name: '영어', currentRank: 25, targetRank: 10, isCommon: true },
      { id: 'sub_math', name: '수학', currentRank: 30, targetRank: 12, isCommon: true },
      { id: 'sub_sci', name: '통합과학', currentRank: 22, targetRank: 9, isCommon: true }, // 고1은 공통!
      { id: 'sub_soc', name: '통합사회', currentRank: 18, targetRank: 8, isCommon: true }, // 고1은 공통!
    ];
  } else if (val === '고2') {
    // 고2: 공통과목과 선택과목 분리
    state.data.naesinSubjects = [
      { id: 's_1', name: '문학', currentRank: 18, targetRank: 8, isCommon: true },
      { id: 's_2', name: '수학I', currentRank: 25, targetRank: 9, isCommon: true },
      { id: 's_3', name: '영어I', currentRank: 20, targetRank: 7, isCommon: true },
      { id: 's_4', name: '생명과학I', currentRank: 15, targetRank: 5, isCommon: false }, // 선택과목
      { id: 's_5', name: '사회문화', currentRank: 18, targetRank: 7, isCommon: false }, // 선택과목
    ];
  } else if (val === '고3') {
    // 고3: 2015 개정 9등급제
    state.data.naesinSubjects = [
      { id: 's_1', name: '독서', currentRank: 22, targetRank: 8, isCommon: true },
      { id: 's_2', name: '미적분', currentRank: 28, targetRank: 9, isCommon: true },
      { id: 's_3', name: '영어독해', currentRank: 24, targetRank: 8, isCommon: true },
      { id: 's_4', name: '물리학I', currentRank: 18, targetRank: 6, isCommon: false },
      { id: 's_5', name: '화학I', currentRank: 20, targetRank: 7, isCommon: false }
    ];
  } else if (val === 'N수생') {
    if (!state.data.examFocus) state.data.examFocus = '모의고사 중시';
  }

  saveToLocalStorage();
  renderCurrentStep();
};

// 2단계: 시험 중시 방향
function renderStep2(container) {
  const is5Grade = state.data.curriculum === '2022';
  const options = [
    { value: '내신 중시', title: '내신 중시 (수시 / 학생부 위주)', desc: `학교 지필·수행평가 중심. ${is5Grade ? '2022 개정 5등급제 1~2등급(상위 10%~34%)' : '2015 개정 9등급제 1~2등급(상위 4%~11%)'} 진입 목표.`, tag: '수시 교과/학종 목표' },
    { value: '모의고사 중시', title: '모의고사 / 수능 중시 (정시 위주)', desc: '전국 모의평가 및 수능 중심(전 학년 9등급제). 평가원 출제 원리 및 수능 백분위 도약 목표.', tag: '정시 / 수능최저 목표' },
    { value: '둘다 중요', title: '둘 다 중요 (내신 + 수능 투트랙)', desc: '내신 상위권을 확보하면서 상위권 대학 수능 최저학력기준을 동시에 공략.', tag: '학종 + 수능최저 안정권' }
  ];

  let html = `<div class="space-y-4">`;
  options.forEach(opt => {
    const isSelected = state.data.examFocus === opt.value;
    html += `
      <div class="selectable-card ${isSelected ? 'selected' : ''}" onclick="selectExamFocus('${opt.value}')">
        <div class="flex items-center justify-between">
          <div class="space-y-1">
            <div class="flex items-center space-x-2">
              <span class="text-lg font-bold text-gray-900">${opt.title}</span>
              <span class="text-xs px-2.5 py-0.5 rounded-full font-semibold ${isSelected ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'}">${opt.tag}</span>
            </div>
            <p class="text-sm text-gray-600">${opt.desc}</p>
          </div>
          <div class="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center check-circle ${isSelected ? 'border-indigo-600 bg-indigo-600 text-white' : ''}">
            <i data-feather="check" class="w-3.5 h-3.5 check-icon"></i>
          </div>
        </div>
      </div>
    `;
  });
  html += `</div>`;
  container.innerHTML = html;
}

window.selectExamFocus = function (val) {
  state.data.examFocus = val;
  saveToLocalStorage();
  renderCurrentStep();
};

// 3단계: 성적 & 목표 (고1 전과목 공통 처리 + 5등급제/9등급제 차등)
function renderStep3(container) {
  const isNaesinNeeded = state.data.examFocus === '내신 중시' || state.data.examFocus === '둘다 중요' || !state.data.examFocus;
  const isMockNeeded = state.data.examFocus === '모의고사 중시' || state.data.examFocus === '둘다 중요';
  const isHigh1 = state.data.grade === '고1';
  const is5Grade = state.data.curriculum === '2022';

  let html = `<div class="space-y-8 animate-fade-in">`;

  // 안내 배너: 고1 전과목 공통 & 5등급제 vs 9등급제 안내
  html += `
    <div class="p-4 rounded-2xl bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 text-indigo-950 space-y-2">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div class="flex items-center space-x-2 font-bold text-sm text-indigo-900">
          <i data-feather="award" class="w-4 h-4 text-indigo-600"></i>
          <span>${state.data.grade} 내신 성적 체계: [${is5Grade ? '2022 개정 5등급제 (1·2학년)' : '2015 개정 9등급제 (3학년·N수생)'}]</span>
        </div>
        <!-- 교육과정 전환 미니 버튼 -->
        <div class="flex items-center space-x-1.5 text-xs">
          <span class="text-gray-500">체계 전환:</span>
          <button type="button" onclick="setCurriculum('${is5Grade ? '2015' : '2022'}')" 
            class="px-2 py-0.5 bg-white border border-indigo-300 text-indigo-700 font-bold rounded hover:bg-indigo-50">
            ${is5Grade ? '9등급제로 전환' : '5등급제로 전환'}
          </button>
        </div>
      </div>
      <div class="text-xs text-indigo-800 leading-relaxed space-y-1">
        ${is5Grade 
          ? `<p>• <strong>2022 개정 5등급제 기준:</strong> <strong>1등급(상위 10%)</strong> | <strong>2등급(상위 34%)</strong> | <strong>3등급(상위 66%)</strong> | <strong>4등급(상위 90%)</strong> | <strong>5등급(100%)</strong></p>` 
          : `<p>• <strong>2015 개정 9등급제 기준:</strong> <strong>1등급(4%)</strong> | <strong>2등급(11%)</strong> | <strong>3등급(23%)</strong> | <strong>4등급(40%)</strong> | <strong>5등급(60%)</strong> | <strong>6등급(77%)</strong>...</p>`}
        ${isHigh1 
          ? `<p>• <strong>1학년 안내:</strong> 1학년은 <strong>모든 과목(국·영·수·통사·통과)이 전교생 공통과목</strong>이므로 5개 전 과목의 내신 등급이 산출됩니다.</p>` 
          : `<p>• <strong>2·3학년 안내:</strong> 공통과목은 전교생 기준 등급이 산출되며, <strong>선택과목</strong>은 과목별 수강인원이 상이하므로 등급 대신 <strong>‘등수(석차)’</strong> 중심으로 관리됩니다.</p>`}
      </div>
    </div>
  `;

  // 3-1: 내신 성적 입력
  if (isNaesinNeeded) {
    html += `
      <div class="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-gray-100 gap-3">
          <div>
            <div class="flex items-center space-x-2">
              <span class="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">3-1</span>
              <h3 class="text-lg font-bold text-gray-900">내신 성적 및 목표 등수</h3>
            </div>
            <p class="text-xs text-gray-500 mt-1">
              ${isHigh1 
                ? '고1: 국어, 영어, 수학, 통합과학, 통합사회 5개 전 과목의 현재 및 목표 등수를 입력해주세요.' 
                : '고2·고3: 수강 중인 과목과 현재 및 목표 등수를 적어주세요. (선택과목은 등급 제외)'}
            </p>
          </div>
          <!-- 전교생 수 입력 -->
          <div class="flex items-center space-x-2 bg-gray-50 p-2.5 rounded-xl border border-gray-200">
            <label class="text-xs font-semibold text-gray-700 whitespace-nowrap">우리 학교 전교생 수:</label>
            <input type="number" id="input-school-total" min="10" max="2000" value="${state.data.schoolTotal || 250}" 
              class="w-20 px-2 py-1 text-center font-bold text-indigo-700 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onchange="updateSchoolTotal(this.value)" />
            <span class="text-xs text-gray-500">명</span>
          </div>
        </div>

        <!-- 과목 테이블 헤더 -->
        <div class="space-y-3">
          <div class="hidden sm:grid grid-cols-12 gap-3 px-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
            <div class="col-span-4">과목명 및 구분</div>
            <div class="col-span-3 text-center">현재 등수 (석차)</div>
            <div class="col-span-3 text-center">목표 등수 (석차)</div>
            <div class="col-span-2 text-center">도약 목표</div>
          </div>
    `;

    state.data.naesinSubjects.forEach((sub, idx) => {
      // 1학년이면 무조건 5개 과목 모두 공통! 2·3학년은 sub.isCommon 기준
      const isCommon = isHigh1 ? true : sub.isCommon;
      const curGrade = calculateGrade(sub.currentRank, state.data.schoolTotal, state.data.curriculum);
      const tarGrade = calculateGrade(sub.targetRank, state.data.schoolTotal, state.data.curriculum);
      const rankGap = sub.currentRank - sub.targetRank;

      html += `
        <div class="grid grid-cols-1 sm:grid-cols-12 gap-3 p-3.5 rounded-xl border border-gray-200 hover:border-indigo-300 transition-all bg-gray-50/60 items-center">
          <!-- 과목명 & 공통/선택 뱃지 -->
          <div class="sm:col-span-4 flex items-center justify-between sm:justify-start space-x-2">
            ${isHigh1 && idx < 5 
              ? `<div class="flex items-center space-x-1.5">
                   <span class="font-bold text-gray-800 text-sm sm:text-base">${sub.name}</span>
                   <span class="text-[10px] px-2 py-0.5 rounded-full font-bold subject-type-common">
                     공통과목
                   </span>
                 </div>`
              : `<div class="flex items-center space-x-2 w-full">
                   <input type="text" value="${sub.name}" placeholder="과목명" 
                     class="font-bold text-gray-800 text-sm bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                     onchange="updateSubjectName(${idx}, this.value)" />
                   <button type="button" onclick="toggleSubjectCommon(${idx})" title="공통/선택 전환"
                     class="text-[10px] px-2 py-1 rounded-md font-bold whitespace-nowrap cursor-pointer transition-colors ${isCommon ? 'subject-type-common' : 'subject-type-elective'}">
                     ${isCommon ? '공통' : '선택'}
                   </button>
                   <button type="button" onclick="removeSubject(${idx})" class="text-red-400 hover:text-red-600 p-1" title="삭제">
                     <i data-feather="trash-2" class="w-4 h-4"></i>
                   </button>
                 </div>`
            }
          </div>

          <!-- 현재 등수 -->
          <div class="sm:col-span-3 flex items-center justify-between sm:justify-center space-x-2 bg-white sm:bg-transparent p-2 sm:p-0 rounded-lg">
            <span class="sm:hidden text-xs text-gray-600 font-medium">현재 등수:</span>
            <div class="flex items-center space-x-1.5">
              <input type="number" min="1" max="${state.data.schoolTotal}" value="${sub.currentRank}" 
                class="w-16 px-2 py-1 text-center font-semibold text-gray-800 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onchange="updateSubjectRank(${idx}, 'currentRank', this.value)" />
              <span class="text-xs text-gray-600">등</span>
              <!-- 공통과목만 등급 산출, 선택과목은 등급 제외! -->
              ${isCommon 
                ? `<span class="grade-badge grade-${curGrade}">${curGrade}등급</span>` 
                : `<span class="text-[11px] text-gray-400 font-medium px-1.5 py-0.5 bg-gray-100 rounded">등급제외</span>`}
            </div>
          </div>

          <!-- 목표 등수 -->
          <div class="sm:col-span-3 flex items-center justify-between sm:justify-center space-x-2 bg-white sm:bg-transparent p-2 sm:p-0 rounded-lg">
            <span class="sm:hidden text-xs text-indigo-700 font-medium">목표 등수:</span>
            <div class="flex items-center space-x-1.5">
              <input type="number" min="1" max="${state.data.schoolTotal}" value="${sub.targetRank}" 
                class="w-16 px-2 py-1 text-center font-bold text-indigo-700 bg-white border border-indigo-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onchange="updateSubjectRank(${idx}, 'targetRank', this.value)" />
              <span class="text-xs text-gray-600">등</span>
              <!-- 공통과목만 등급 산출, 선택과목은 등급 제외! -->
              ${isCommon 
                ? `<span class="grade-badge grade-${tarGrade}">${tarGrade}등급</span>` 
                : `<span class="text-[11px] text-gray-400 font-medium px-1.5 py-0.5 bg-gray-100 rounded">등급제외</span>`}
            </div>
          </div>

          <!-- 도약 목표 -->
          <div class="sm:col-span-2 text-center text-xs">
            ${rankGap > 0 
              ? `<span class="inline-flex items-center px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 font-bold">
                  ▲ ${rankGap}등 단축
                 </span>`
              : rankGap === 0 
                ? `<span class="text-gray-500 font-medium">유지</span>`
                : `<span class="text-gray-400 font-medium">-</span>`}
          </div>
        </div>
      `;
    });

    html += `</div>`;

    // 2·3학년이거나 과목 추가 희망 시
    if (!isHigh1) {
      html += `
        <div class="pt-4 border-t border-gray-100 space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-gray-600">수강 중인 선택과목 한 번에 추가:</span>
            <button type="button" onclick="addNewSubject()" class="inline-flex items-center text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors">
              <i data-feather="plus" class="w-3.5 h-3.5 mr-1"></i> 과목 직접 추가
            </button>
          </div>
          <div class="flex flex-wrap gap-1.5">
            ${high23Subjects.map(subName => `
              <button type="button" onclick="quickAddSubject('${subName}')" 
                class="text-xs px-2.5 py-1 bg-white hover:bg-indigo-50 text-gray-700 hover:text-indigo-700 border border-gray-200 hover:border-indigo-300 rounded-md transition-all">
                + ${subName}
              </button>
            `).join('')}
          </div>
        </div>
      `;
    }

    html += `</div>`;
  }

  // 3-2: 모의고사 등급 (전국 표준 9등급제)
  if (isMockNeeded) {
    html += `
      <div class="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-5">
        <div class="pb-3 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <div class="flex items-center space-x-2">
              <span class="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-xs">3-2</span>
              <h3 class="text-lg font-bold text-gray-900">모의고사 / 수능 등급 및 목표 (전국 표준 9등급제)</h3>
            </div>
            <p class="text-xs text-gray-500 mt-1">
              모의고사는 모든 학년 동일하게 전국 9등급제(1~9등급)로 평가됩니다.
            </p>
          </div>
          <span class="text-xs px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 font-bold border border-teal-200 w-fit">
            모의고사: 전 학년 9등급제 표준
          </span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
    `;

    const mockSubjects = ['국어', '영어', '수학', '사회', '과학'];
    mockSubjects.forEach(sub => {
      const current = state.data.mockGrades[sub]?.current || 3;
      const target = state.data.mockGrades[sub]?.target || 1;

      html += `
        <div class="p-4 rounded-xl border border-gray-200 bg-gray-50/70 space-y-3">
          <div class="flex items-center justify-between">
            <span class="font-bold text-gray-900 text-base">${sub}</span>
            <span class="text-xs px-2 py-0.5 rounded-full font-semibold ${current <= target ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
              ${current > target ? `${current - target}등급 도약` : '목표 달성권'}
            </span>
          </div>

          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <label class="text-xs font-medium text-gray-600">현재 등급</label>
              <select class="px-2 py-1 text-xs font-bold rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                onchange="updateMockGrade('${sub}', 'current', this.value)">
                ${[1,2,3,4,5,6,7,8,9].map(g => `<option value="${g}" ${current === g ? 'selected' : ''}>${g}등급</option>`).join('')}
              </select>
            </div>

            <div class="flex items-center justify-between">
              <label class="text-xs font-bold text-teal-700">목표 등급</label>
              <select class="px-2 py-1 text-xs font-bold rounded-lg border border-teal-300 bg-teal-50 text-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                onchange="updateMockGrade('${sub}', 'target', this.value)">
                ${[1,2,3,4,5,6,7,8,9].map(g => `<option value="${g}" ${target === g ? 'selected' : ''}>${g}등급</option>`).join('')}
              </select>
            </div>
          </div>
        </div>
      `;
    });

    html += `</div></div>`;
  }

  html += `</div>`;
  container.innerHTML = html;
}

window.updateSchoolTotal = function (val) {
  state.data.schoolTotal = Math.max(10, parseInt(val) || 250);
  saveToLocalStorage();
  renderCurrentStep();
};

window.updateSubjectRank = function (idx, field, val) {
  if (state.data.naesinSubjects[idx]) {
    state.data.naesinSubjects[idx][field] = Math.max(1, parseInt(val) || 1);
    saveToLocalStorage();
    renderCurrentStep();
  }
};

window.updateSubjectName = function (idx, val) {
  if (state.data.naesinSubjects[idx]) {
    state.data.naesinSubjects[idx].name = val.trim() || '과목';
    saveToLocalStorage();
    renderCurrentStep();
  }
};

window.toggleSubjectCommon = function (idx) {
  if (state.data.naesinSubjects[idx]) {
    state.data.naesinSubjects[idx].isCommon = !state.data.naesinSubjects[idx].isCommon;
    saveToLocalStorage();
    renderCurrentStep();
  }
};

window.addNewSubject = function () {
  const newId = 'sub_' + Date.now();
  state.data.naesinSubjects.push({
    id: newId,
    name: '선택과목',
    currentRank: 25,
    targetRank: 10,
    isCommon: false
  });
  saveToLocalStorage();
  renderCurrentStep();
};

window.quickAddSubject = function (subName) {
  const exists = state.data.naesinSubjects.some(s => s.name === subName);
  if (exists) {
    showToast(`이미 '${subName}' 과목이 목록에 있습니다.`);
    return;
  }
  const isCommonByDefault = subName.includes('국어') || subName.includes('수학') || subName.includes('영어') || subName === '문학' || subName === '독서' || subName === '수학I';
  state.data.naesinSubjects.push({
    id: 'sub_' + Date.now(),
    name: subName,
    currentRank: 25,
    targetRank: 10,
    isCommon: isCommonByDefault
  });
  saveToLocalStorage();
  renderCurrentStep();
  showToast(`'${subName}' 과목이 추가되었습니다.`);
};

window.removeSubject = function (idx) {
  if (state.data.naesinSubjects.length <= 1) {
    showToast('최소 1개 이상의 과목이 필요합니다.');
    return;
  }
  state.data.naesinSubjects.splice(idx, 1);
  saveToLocalStorage();
  renderCurrentStep();
};

window.updateMockGrade = function (sub, field, val) {
  if (!state.data.mockGrades[sub]) state.data.mockGrades[sub] = { current: 3, target: 1 };
  state.data.mockGrades[sub][field] = parseInt(val) || 1;
  saveToLocalStorage();
  renderCurrentStep();
};

// 4단계: 목표 대학과 학과 (11개 대학 빠른 선택 칩 탑재)
function renderStep4(container) {
  const isUndecided = state.data.targetUndecided;
  const univKeys = Object.keys(UNIV_ADMISSION_DB);

  let html = `
    <div class="max-w-xl mx-auto space-y-6">
      <div class="selectable-card ${isUndecided ? 'selected' : ''}" onclick="toggleUndecided()">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <i data-feather="compass" class="w-5 h-5 ${isUndecided ? 'text-indigo-600' : 'text-gray-400'}"></i>
            <div>
              <span class="font-bold text-gray-900">아직 구체적으로 정하지 않음</span>
              <p class="text-xs text-gray-500">목표가 정해지지 않아도 성적 도약 및 진로 탐색에 맞춘 기본형 플랜을 제공합니다.</p>
            </div>
          </div>
          <div class="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center check-circle ${isUndecided ? 'border-indigo-600 bg-indigo-600 text-white' : ''}">
            <i data-feather="check" class="w-3.5 h-3.5 check-icon"></i>
          </div>
        </div>
      </div>

      <div class="space-y-5 ${isUndecided ? 'opacity-40 pointer-events-none' : ''}">
        <!-- 11개 주요 대학 원클릭 선택 칩 -->
        <div class="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-2.5">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-gray-700 flex items-center gap-1.5">
              <i data-feather="database" class="w-3.5 h-3.5 text-indigo-600"></i> 해커톤 입결 분석 탑재 11개 주요 대학 빠른 선택:
            </span>
          </div>
          <div class="flex flex-wrap gap-1.5">
            ${univKeys.map(k => `
              <button type="button" onclick="selectQuickUniv('${k}')" 
                class="text-xs px-2.5 py-1 rounded-lg font-medium transition-all ${state.data.targetUniversity === k ? 'bg-indigo-600 text-white font-bold shadow' : 'bg-white text-gray-700 border border-gray-200 hover:border-indigo-400 hover:bg-indigo-50'}">
                ${k}
              </button>
            `).join('')}
          </div>
        </div>

        <div>
          <label class="block text-sm font-bold text-gray-700 mb-1.5">
            목표 대학 <span class="text-indigo-600 font-normal text-xs">(직접 입력 또는 상단 칩 클릭)</span>
          </label>
          <div class="relative">
            <input type="text" id="target-uni-input" value="${state.data.targetUniversity || ''}" 
              placeholder="예: 경희대, 고려대, 연세대, 성균관대 등"
              oninput="state.data.targetUniversity = this.value; saveToLocalStorage();"
              class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white font-medium" />
            <i data-feather="award" class="absolute right-3.5 top-3.5 w-5 h-5 text-gray-400 pointer-events-none"></i>
          </div>
        </div>

        <div>
          <label class="block text-sm font-bold text-gray-700 mb-1.5">
            목표 학과 또는 진로 <span class="text-indigo-600 font-normal text-xs">(예: 자율전공학부, 경영학, 생명공학, 소프트웨어 등)</span>
          </label>
          <div class="relative">
            <input type="text" id="target-major-input" value="${state.data.targetMajor || ''}" 
              placeholder="희망 학과나 관심 진로 분야를 입력해주세요"
              oninput="state.data.targetMajor = this.value; saveToLocalStorage();"
              class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white font-medium" />
            <i data-feather="briefcase" class="absolute right-3.5 top-3.5 w-5 h-5 text-gray-400 pointer-events-none"></i>
          </div>
        </div>
      </div>
    </div>
  `;

  container.innerHTML = html;
}

window.selectQuickUniv = function (name) {
  state.data.targetUniversity = name;
  const input = document.getElementById('target-uni-input');
  if (input) input.value = name;
  saveToLocalStorage();
  renderCurrentStep();
};

window.toggleUndecided = function () {
  state.data.targetUndecided = !state.data.targetUndecided;
  if (state.data.targetUndecided) {
    state.data.targetUniversity = '';
    state.data.targetMajor = '';
  }
  saveToLocalStorage();
  renderCurrentStep();
};

// 5단계: 다음 시험까지 남은 기간 & 현재 준비 완성도
function renderStep5(container) {
  const periods = [
    { value: '1주 이내', title: '1주 이내 (초단기 직전 대비)', tag: 'D-7 파이널 벼락치기', desc: '새로운 고난도 문제 지양, 오답 선별 3회독 & 핵심 요약 백지 복습, 실전 시뮬레이션 집중' },
    { value: '2주 전', title: '2주 전 (시험 2주 집중 기간)', tag: 'D-14 약점 집중 보완', desc: '취약 단원 개념 압축 정리, 단원별 기출 및 변형 문제 훈련, 시간 관리 연습' },
    { value: '3~4주 전', title: '3~4주 전 (체계적 4주 완성 플랜)', tag: 'D-30 단계별 마스터', desc: '4주 전 개념 뼈대 -> 3주 전 유형 마스터 -> 2주 전 기출 심화 -> 1주 전 오답 총정리' },
    { value: '1~2개월 이상', title: '1~2개월 이상 (중장기 플랜)', tag: '선행 및 기초 체력', desc: '취약 과목 기초부터 다지기, 선행 학습 및 모의고사 고난도 킬러 대비 장기 호흡' },
    { value: '미정', title: '미정 (기본 학습 습관 형성)', tag: '루틴 체계화', desc: '정해진 시험 일정 없이 매일 꾸준한 자기주도학습 습관과 과목별 기본기 확립' }
  ];

  const prepLevels = [
    { value: '거의 안 됨', title: '공부 거의 안 됨 (10% 미만 / 벼락치기 필요)', desc: '아직 준비가 덜 되었지만 단기간에 승부수를 띄워야 하는 상황 (공부 머리는 있는 편 or 급속 돌파)', color: 'rose' },
    { value: '개념만 완료', title: '기본 개념 1회독 완료 (30~50%)', desc: '수업이나 인강은 들었으나 문제 풀이나 암기가 부족하여 체화가 필요한 단계', color: 'amber' },
    { value: '문제 풀이 중', title: '문제 풀이 진행 중 (60~80%)', desc: '유형서와 기출문제를 풀며 틀린 문제와 취약 파트를 보완하는 단계', color: 'indigo' },
    { value: '총복습 중', title: '파이널 총복습 중 (90% 이상)', desc: '전체 회독을 끝내고 오답 노트 점검 및 고난도 킬러 문항 대비 단계', color: 'emerald' }
  ];

  let html = `
    <div class="space-y-6 max-w-2xl mx-auto">
      
      <!-- 5-1: 남은 기간 -->
      <div class="space-y-3">
        <label class="block text-sm font-bold text-gray-800 flex items-center gap-1.5">
          <span class="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">A</span>
          다음 시험까지 얼마나 남았나요?
        </label>
        <div class="space-y-2.5">
  `;

  periods.forEach(p => {
    const isSelected = state.data.daysUntilExam === p.value;
    html += `
      <div class="selectable-card ${isSelected ? 'selected' : ''}" onclick="selectExamPeriod('${p.value}')">
        <div class="flex items-center justify-between">
          <div class="space-y-0.5">
            <div class="flex items-center space-x-2">
              <span class="text-sm sm:text-base font-bold text-gray-900">${p.title}</span>
              <span class="text-[11px] px-2 py-0.5 rounded-full font-semibold ${isSelected ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'}">${p.tag}</span>
            </div>
            <p class="text-xs text-gray-600">${p.desc}</p>
          </div>
          <div class="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center check-circle ${isSelected ? 'border-indigo-600 bg-indigo-600 text-white' : ''}">
            <i data-feather="check" class="w-3 h-3 check-icon"></i>
          </div>
        </div>
      </div>
    `;
  });

  html += `
        </div>
      </div>

      <!-- 5-2: 현재 준비 완성도 (사용자 상황 진단) -->
      <div class="space-y-3 pt-4 border-t border-gray-200">
        <div class="flex items-center justify-between">
          <label class="block text-sm font-bold text-gray-800 flex items-center gap-1.5">
            <span class="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs">B</span>
            현재 시험 범위에 대한 나의 준비 상태(완성도)는 어떤가요?
          </label>
        </div>
        <p class="text-xs text-gray-500">남은 시간과 현재 진도 상태에 맞춰 1주 전/2주 전/3주 전/4주 전 및 맞춤 벼락치기 전략이 자동 처방됩니다.</p>
        <div class="space-y-2.5">
  `;

  prepLevels.forEach(pl => {
    const isSelected = (state.data.examPrepLevel || '거의 안 됨') === pl.value;
    html += `
      <div class="selectable-card ${isSelected ? 'selected' : ''}" onclick="selectExamPrepLevel('${pl.value}')">
        <div class="flex items-center justify-between">
          <div class="space-y-0.5">
            <span class="text-sm font-bold text-gray-900 block">${pl.title}</span>
            <p class="text-xs text-gray-600">${pl.desc}</p>
          </div>
          <div class="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center check-circle ${isSelected ? 'border-indigo-600 bg-indigo-600 text-white' : ''}">
            <i data-feather="check" class="w-3 h-3 check-icon"></i>
          </div>
        </div>
      </div>
    `;
  });

  html += `
        </div>
      </div>

    </div>
  `;
  container.innerHTML = html;
}

window.selectExamPeriod = function (val) {
  state.data.daysUntilExam = val;
  saveToLocalStorage();
  renderCurrentStep();
};

window.selectExamPrepLevel = function (val) {
  state.data.examPrepLevel = val;
  saveToLocalStorage();
  renderCurrentStep();
};

// 6단계: 공부할 때 힘든 점 (병목)
function renderStep6(container) {
  let html = `<div class="grid grid-cols-1 md:grid-cols-2 gap-4">`;
  struggleOptions.forEach(opt => {
    const isSelected = state.data.primaryStruggle === opt.title;
    html += `
      <div class="selectable-card ${isSelected ? 'selected' : ''}" onclick="selectStruggle('${opt.title}')">
        <div class="flex items-start justify-between">
          <div class="flex items-start space-x-3">
            <div class="p-2.5 rounded-xl ${isSelected ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-600'} flex-shrink-0 mt-0.5">
              <i data-feather="${opt.icon}" class="w-5 h-5"></i>
            </div>
            <div>
              <h4 class="font-bold text-gray-900 text-sm sm:text-base mb-1">${opt.title}</h4>
              <p class="text-xs text-gray-600 leading-relaxed">${opt.desc}</p>
            </div>
          </div>
          <div class="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center check-circle flex-shrink-0 ml-2 ${isSelected ? 'border-indigo-600 bg-indigo-600 text-white' : ''}">
            <i data-feather="check" class="w-3 h-3 check-icon"></i>
          </div>
        </div>
      </div>
    `;
  });
  html += `</div>`;
  container.innerHTML = html;
}

window.selectStruggle = function (val) {
  state.data.primaryStruggle = val;
  saveToLocalStorage();
  renderCurrentStep();
};

// 7단계: 당신의 공부 성향은 무엇인가요? (7가지 타입)
function renderStep7(container) {
  let html = `
    <div class="space-y-4 max-w-3xl mx-auto">
      <div class="text-xs text-indigo-700 bg-indigo-50 p-3 rounded-xl border border-indigo-100 flex items-center gap-2">
        <i data-feather="zap" class="w-4 h-4 flex-shrink-0"></i>
        <span>자신에게 가장 가까운 공부 스타일 1가지를 선택해 주세요. 각 성향에 맞춘 치명적 함정 극복법과 최적의 학습 루틴을 처방해 드립니다.</span>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5">
  `;

  LEARNING_STYLES.forEach(st => {
    const isSelected = state.data.learningStyle === st.title;
    html += `
      <div class="selectable-card ${isSelected ? 'selected ring-2 ring-indigo-500' : ''}" onclick="selectLearningStyle('${st.title}')">
        <div class="flex items-start justify-between mb-1.5">
          <div class="flex items-center space-x-2">
            <span class="w-6 h-6 rounded-md bg-indigo-100 text-indigo-800 font-bold text-xs flex items-center justify-center">${st.num}</span>
            <span class="font-bold text-gray-900 text-base">${st.title}</span>
          </div>
          <div class="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center check-circle ${isSelected ? 'border-indigo-600 bg-indigo-600 text-white' : ''}">
            <i data-feather="check" class="w-3 h-3 check-icon"></i>
          </div>
        </div>
        <p class="text-xs text-gray-600 leading-relaxed pl-8">${st.desc}</p>
      </div>
    `;
  });

  html += `</div></div>`;
  container.innerHTML = html;
}

window.selectLearningStyle = function (val) {
  state.data.learningStyle = val;
  saveToLocalStorage();
  renderCurrentStep();
};

// 8단계: 현재 사용하는 학습 방법 (복수 선택)
function renderStep8(container) {
  let html = `
    <div class="max-w-2xl mx-auto space-y-4">
      <div class="flex items-center justify-between text-xs text-gray-500 pb-1">
        <span>해당되는 학습 방법을 모두 선택해 주세요.</span>
        <span class="font-semibold text-indigo-600">${state.data.studyMethods.length}개 선택됨</span>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
  `;

  studyMethodOptions.forEach(opt => {
    const isSelected = state.data.studyMethods.includes(opt.label);
    html += `
      <div class="selectable-card ${isSelected ? 'selected' : ''}" onclick="toggleStudyMethod('${opt.label}')">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="p-2 rounded-lg ${isSelected ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'}">
              <i data-feather="${opt.icon}" class="w-4 h-4"></i>
            </div>
            <span class="font-bold text-sm text-gray-800">${opt.label}</span>
          </div>
          <div class="w-5 h-5 rounded-md border-2 border-gray-300 flex items-center justify-center check-circle ${isSelected ? 'border-indigo-600 bg-indigo-600 text-white' : ''}">
            <i data-feather="check" class="w-3.5 h-3.5 check-icon"></i>
          </div>
        </div>
      </div>
    `;
  });

  html += `</div></div>`;
  container.innerHTML = html;
}

window.toggleStudyMethod = function (label) {
  const arr = state.data.studyMethods;
  const index = arr.indexOf(label);
  if (index > -1) arr.splice(index, 1);
  else arr.push(label);
  saveToLocalStorage();
  renderCurrentStep();
};

// 9단계: 현재 공부하고 있는 환경/수단 (복수 선택)
function renderStep9(container) {
  const isOtherSelected = state.data.studyEnvironments.includes('기타');

  let html = `
    <div class="max-w-2xl mx-auto space-y-4">
      <div class="flex items-center justify-between text-xs text-gray-500 pb-1">
        <span>현재 이용하고 있는 학습 환경을 모두 선택해 주세요.</span>
        <span class="font-semibold text-indigo-600">${state.data.studyEnvironments.length}개 선택됨</span>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
  `;

  studyEnvOptions.forEach(opt => {
    const isSelected = state.data.studyEnvironments.includes(opt.label);
    html += `
      <div class="selectable-card ${isSelected ? 'selected' : ''}" onclick="toggleStudyEnv('${opt.label}')">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="p-2 rounded-lg ${isSelected ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'}">
              <i data-feather="${opt.icon}" class="w-4 h-4"></i>
            </div>
            <span class="font-bold text-sm text-gray-800">${opt.label}</span>
          </div>
          <div class="w-5 h-5 rounded-md border-2 border-gray-300 flex items-center justify-center check-circle ${isSelected ? 'border-indigo-600 bg-indigo-600 text-white' : ''}">
            <i data-feather="check" class="w-3.5 h-3.5 check-icon"></i>
          </div>
        </div>
      </div>
    `;
  });

  html += `</div>`;

  if (isOtherSelected) {
    html += `
      <div class="pt-3 animate-fade-in">
        <label class="block text-xs font-bold text-gray-700 mb-1">기타 공부 환경을 간단히 적어주세요:</label>
        <input type="text" value="${state.data.otherEnvironmentText || ''}" 
          placeholder="예: 독서실 자율 스터디, 스터디 카페 멘토링 등"
          oninput="state.data.otherEnvironmentText = this.value; saveToLocalStorage();"
          class="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white font-medium" />
      </div>
    `;
  }

  html += `</div>`;
  container.innerHTML = html;
}

window.toggleStudyEnv = function (label) {
  const arr = state.data.studyEnvironments;
  const index = arr.indexOf(label);
  if (index > -1) arr.splice(index, 1);
  else arr.push(label);
  saveToLocalStorage();
  renderCurrentStep();
};

// 다음/이전 네비게이션
function nextStep() {
  if (!validateCurrentStep()) return;
  if (state.currentStep < state.totalSteps) {
    state.currentStep++;
    renderCurrentStep();
    window.scrollTo({ top: 100, behavior: 'smooth' });
  } else {
    generatePersonalizedReport();
  }
}

function prevStep() {
  if (state.currentStep > 1) {
    state.currentStep--;
    renderCurrentStep();
    window.scrollTo({ top: 100, behavior: 'smooth' });
  }
}

function validateCurrentStep() {
  switch (state.currentStep) {
    case 1:
      if (!state.data.grade) { showToast('나이(학년)를 선택해주세요.'); return false; }
      break;
    case 2:
      if (!state.data.examFocus) { showToast('중점 준비 시험을 선택해주세요.'); return false; }
      break;
    case 3:
      if (state.data.examFocus === '내신 중시' || state.data.examFocus === '둘다 중요') {
        if (!state.data.naesinSubjects || state.data.naesinSubjects.length === 0) {
          showToast('과목을 최소 1개 이상 입력해주세요.'); return false;
        }
      }
      break;
    case 4:
      const uniInput = document.getElementById('target-uni-input');
      const majorInput = document.getElementById('target-major-input');
      if (uniInput) state.data.targetUniversity = uniInput.value.trim();
      if (majorInput) state.data.targetMajor = majorInput.value.trim();
      if (!state.data.targetUndecided && !state.data.targetUniversity && !state.data.targetMajor) {
        showToast('목표 대학/학과를 입력하거나 "아직 정하지 않음"을 선택해주세요.');
        return false;
      }
      break;
    case 5:
      if (!state.data.daysUntilExam) { showToast('다음 시험까지 남은 기간을 선택해주세요.'); return false; }
      break;
    case 6:
      if (!state.data.primaryStruggle) { showToast('가장 힘든 점을 하나 선택해주세요.'); return false; }
      break;
    case 7:
      if (!state.data.learningStyle) { showToast('공부 성향을 하나 선택해주세요.'); return false; }
      break;
    case 8:
      if (state.data.studyMethods.length === 0) { showToast('학습 방법을 최소 1개 이상 선택해주세요.'); return false; }
      break;
    case 9:
      if (state.data.studyEnvironments.length === 0) { showToast('공부 환경을 최소 1개 이상 선택해주세요.'); return false; }
      break;
  }
  return true;
}

function showToast(msg) {
  let toast = document.getElementById('toast-msg');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-msg';
    toast.className = 'fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-2xl z-50 flex items-center space-x-2 transition-all opacity-0';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<i data-feather="alert-circle" class="w-4 h-4 text-amber-400"></i><span>${msg}</span>`;
  if (window.feather) feather.replace();
  toast.classList.remove('opacity-0', 'pointer-events-none');
  toast.classList.add('opacity-100');
  setTimeout(() => {
    toast.classList.remove('opacity-100');
    toast.classList.add('opacity-0', 'pointer-events-none');
  }, 2800);
}

// ==========================================
// 💡 맞춤형 분석 & 종합 솔루션 리포트 생성 엔진
// ==========================================
function generatePersonalizedReport() {
  const d = state.data;
  document.getElementById('survey-container').classList.add('hidden');
  const reportContainer = document.getElementById('report-container');
  reportContainer.classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // 1. 목표 대학 입결 매칭
  const targetUnivName = Object.keys(UNIV_ADMISSION_DB).find(k => d.targetUniversity.includes(k)) || (d.targetUniversity ? '고려대' : null);
  const univInfo = targetUnivName ? UNIV_ADMISSION_DB[targetUnivName] : null;

  // 2. 7가지 공부 성향 데이터 매칭
  const styleInfo = LEARNING_STYLES.find(s => s.title === d.learningStyle) || LEARNING_STYLES[0];

  // 3. 고민 사항 처방
  const strugglePrescription = getStrugglePrescription(d.primaryStruggle);

  // 4. 인풋/아웃풋 메타인지 밸런스
  const methodBalance = analyzeMethodBalance(d.studyMethods, d.studyEnvironments);

  // 5. 기간별 로드맵 및 상황별 긴급 처방
  const timelineRoadmap = getTimelineRoadmap(d.daysUntilExam);
  const urgentPrescription = getCustomUrgentPrescription(d);

  // 6. 과목별 분석 (고1은 전과목 등급 산출, 고2/3은 선택과목 등급 제외)
  const subjectAnalysis = analyzeSubjects(d);

  // 리포트 HTML 조립
  reportContainer.innerHTML = `
    <div class="space-y-8 animate-fade-in pb-16">
      
      <!-- 상단 헤더 카드 -->
      <div class="glass-card rounded-3xl p-6 sm:p-8 border border-indigo-100 relative overflow-hidden bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-950 text-white shadow-xl">
        <div class="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div class="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div class="space-y-2">
            <div class="flex flex-wrap items-center gap-2">
              <span class="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/40 text-indigo-200 border border-indigo-400/30">
                ${d.grade} [${d.curriculum === '2022' ? '2022 개정 5등급제' : '2015 개정 9등급제'}]
              </span>
              <span class="px-3 py-1 rounded-full text-xs font-bold bg-teal-500/30 text-teal-200 border border-teal-400/30">
                ${d.examFocus} 트랙
              </span>
              <span class="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/30 text-amber-200 border border-amber-400/30">
                ${d.learningStyle}
              </span>
            </div>
            <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              ${d.targetUniversity || '목표대학'} 합격 도약을 위한 초개인화 학습 솔루션
            </h1>
            <p class="text-indigo-200 text-sm max-w-2xl leading-relaxed">
              입력하신 성적과 목표 대학 입결(70% 컷), 7가지 공부 성향을 정밀 융합 분석하여 최적의 학습 로드맵을 처방합니다.
            </p>
          </div>

          <!-- 상단 액션 버튼 -->
          <div class="flex flex-wrap items-center gap-2 sm:gap-3 no-print">
            <button onclick="window.print()" class="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold backdrop-blur border border-white/20 flex items-center space-x-1.5 transition-all">
              <i data-feather="printer" class="w-4 h-4"></i>
              <span>인쇄 / PDF 저장</span>
            </button>
            <button onclick="resetSurvey()" class="px-3.5 py-2 rounded-xl bg-indigo-500/30 hover:bg-indigo-500/50 text-white text-xs sm:text-sm font-semibold border border-indigo-300/30 flex items-center space-x-1.5 transition-all">
              <i data-feather="edit-2" class="w-4 h-4"></i>
              <span>설문 수정</span>
            </button>
            <button onclick="clearAndRestart()" class="px-3.5 py-2 rounded-xl bg-white text-indigo-900 hover:bg-indigo-50 text-xs sm:text-sm font-bold shadow-md flex items-center space-x-1.5 transition-all">
              <i data-feather="rotate-ccw" class="w-4 h-4"></i>
              <span>새로 진단</span>
            </button>
          </div>
        </div>

        <!-- 핵심 요약 메트릭 그리드 -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-indigo-700/60 text-xs">
          <div>
            <span class="text-indigo-300 block">목표 대학 & 학과</span>
            <strong class="text-sm font-bold text-white truncate block">${d.targetUndecided ? '목표 탐색 중' : `${d.targetUniversity || '대학'} ${d.targetMajor || '학과'}`}</strong>
          </div>
          <div>
            <span class="text-indigo-300 block">학습 성향 유형</span>
            <strong class="text-sm font-bold text-amber-300 truncate block">${styleInfo.title}</strong>
          </div>
          <div>
            <span class="text-indigo-300 block">내신 등급 체계</span>
            <strong class="text-sm font-bold text-emerald-300 truncate block">${d.curriculum === '2022' ? '5등급제 (상위 10% 1등급)' : '9등급제 (상위 4% 1등급)'}</strong>
          </div>
          <div>
            <span class="text-indigo-300 block">최우선 도약 과목</span>
            <strong class="text-sm font-bold text-teal-300 truncate block">${subjectAnalysis.prioritySubject}</strong>
          </div>
        </div>
      </div>

      <!-- 1섹션: 목표 대학 실전 입결 분석 & 합격선 전략 (해커톤-입결정보 연계) -->
      ${renderUnivAdmissionSection(d, univInfo)}

      <!-- 2섹션: 당신의 공부 성향 정밀 진단 & 1:1 맞춤형 처방 (신규 질문 연계) -->
      ${renderLearningStyleSection(styleInfo)}

      <!-- 3섹션: 성적 갭 분석 (공통과목 등급 + 선택과목 등수 도약) -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div class="lg:col-span-7 glass-card rounded-2xl p-6 border border-gray-200">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center space-x-2">
              <div class="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <i data-feather="bar-chart-2" class="w-5 h-5"></i>
              </div>
              <div>
                <h3 class="font-bold text-gray-900 text-base">과목별 현재 vs 목표 도약 분석</h3>
                <p class="text-xs text-gray-500">${d.grade === '고1' ? '1학년 전과목 공통 내신' : '공통과목 등급 산출 & 선택과목 등수 도약'} 갭</p>
              </div>
            </div>
            <span class="text-xs px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700 font-bold">
              총 ${subjectAnalysis.totalRankGap}등 도약 목표
            </span>
          </div>

          <div class="h-64 sm:h-72 w-full">
            <canvas id="gradeGapChart"></canvas>
          </div>
        </div>

        <div class="lg:col-span-5 glass-card rounded-2xl p-6 border border-gray-200 flex flex-col justify-between">
          <div>
            <div class="flex items-center space-x-2 mb-3">
              <div class="p-2 bg-teal-50 text-teal-600 rounded-lg">
                <i data-feather="target" class="w-5 h-5"></i>
              </div>
              <div>
                <h3 class="font-bold text-gray-900 text-base">과목별 성적 진단 카드</h3>
                <p class="text-xs text-gray-500">${d.grade === '고1' ? '※ 1학년은 5개 전 과목 등급이 산출됩니다.' : '※ 선택과목은 수강생 수 차이로 등수만 분석합니다.'}</p>
              </div>
            </div>

            <div class="space-y-2.5">
              ${subjectAnalysis.cardsHtml}
            </div>
          </div>

          <div class="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 leading-relaxed">
            💡 <strong>전략 조언:</strong> ${d.curriculum === '2022' ? '5등급제 <strong>1등급(상위 10%)</strong>을 선점' : '9등급제 <strong>1~2등급(상위 11%)</strong>을 안정적으로 확보'}하고, <strong>${subjectAnalysis.prioritySubject}</strong>의 등수 갭을 줄이는 성공 경험을 만드세요.
          </div>
        </div>
      </div>

      <!-- 4섹션: 핵심 병목 원인 진단 & 처방전 (질문 6) -->
      <div class="glass-card rounded-2xl p-6 sm:p-8 border border-gray-200 space-y-6">
        <div class="flex items-center space-x-3 pb-3 border-b border-gray-100">
          <div class="p-2.5 bg-rose-50 text-rose-600 rounded-xl">
            <i data-feather="activity" class="w-6 h-6"></i>
          </div>
          <div>
            <div class="flex items-center space-x-2">
              <span class="text-xs px-2 py-0.5 rounded font-bold bg-rose-100 text-rose-700">핵심 병목 진단</span>
              <h3 class="text-lg font-bold text-gray-900">${d.primaryStruggle} 극복 솔루션</h3>
            </div>
            <p class="text-xs text-gray-500 mt-0.5">왜 이런 문제가 발생하고, 어떻게 극복해야 할까요?</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div class="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
            <div class="flex items-center space-x-2 text-rose-600 font-bold text-sm">
              <i data-feather="x-circle" class="w-4 h-4"></i>
              <span>현재 문제의 본질</span>
            </div>
            <p class="text-xs sm:text-sm text-gray-700 leading-relaxed">
              ${strugglePrescription.cause}
            </p>
          </div>

          <div class="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-2">
            <div class="flex items-center space-x-2 text-indigo-700 font-bold text-sm">
              <i data-feather="check-circle" class="w-4 h-4"></i>
              <span>추천 공부 행동 강령</span>
            </div>
            <p class="text-xs sm:text-sm text-indigo-950 leading-relaxed">
              ${strugglePrescription.action}
            </p>
          </div>

          <div class="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-2">
            <div class="flex items-center space-x-2 text-emerald-700 font-bold text-sm">
              <i data-feather="zap" class="w-4 h-4"></i>
              <span>당장 오늘부터 실천할 루틴</span>
            </div>
            <p class="text-xs sm:text-sm text-emerald-950 leading-relaxed">
              ${strugglePrescription.dailyHabit}
            </p>
          </div>
        </div>
      </div>

      <!-- 5섹션: 인풋 vs 아웃풋 학습 메타인지 밸런스 -->
      <div class="glass-card rounded-2xl p-6 sm:p-8 border border-gray-200 space-y-5">
        <div class="flex items-center space-x-3 pb-3 border-b border-gray-100">
          <div class="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
            <i data-feather="sliders" class="w-6 h-6"></i>
          </div>
          <div>
            <div class="flex items-center space-x-2">
              <span class="text-xs px-2 py-0.5 rounded font-bold bg-blue-100 text-blue-700">학습 효율 메타인지</span>
              <h3 class="text-lg font-bold text-gray-900">학습 방법 및 공부 환경 분석</h3>
            </div>
            <p class="text-xs text-gray-500 mt-0.5">선택하신 [${d.studyMethods.join(', ')}] 기반 인출 효과성 진단</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div class="space-y-4 p-5 bg-gray-50 rounded-2xl border border-gray-200">
            <div class="flex justify-between items-center text-sm font-bold">
              <span class="text-blue-600">인풋 (이해/강의/필기) ${methodBalance.inputPercent}%</span>
              <span class="text-emerald-600">아웃풋 (풀이/인출/오답) ${methodBalance.outputPercent}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-4 overflow-hidden flex">
              <div class="bg-blue-500 h-full transition-all" style="width: ${methodBalance.inputPercent}%"></div>
              <div class="bg-emerald-500 h-full transition-all" style="width: ${methodBalance.outputPercent}%"></div>
            </div>
            <p class="text-xs text-gray-600 leading-relaxed">
              ${methodBalance.feedback}
            </p>
          </div>

          <div class="p-5 bg-white rounded-2xl border border-gray-200 space-y-3">
            <h4 class="font-bold text-gray-900 text-sm flex items-center space-x-2">
              <i data-feather="compass" class="w-4 h-4 text-indigo-600"></i>
              <span>공부 환경 시너지 가이드</span>
            </h4>
            <div class="text-xs text-gray-700 space-y-2">
              <div class="flex items-start space-x-2">
                <span class="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0"></span>
                <span><strong>학원/인강 비중 관리:</strong> 강의를 듣는 것은 지식의 '입력'일 뿐입니다. 인강 1시간 후 반드시 <strong>30분 백지 인출 또는 자습 풀이</strong>를 플래너에 강제 배정하세요.</span>
              </div>
              <div class="flex items-start space-x-2">
                <span class="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0"></span>
                <span><strong>순공 자습 시간 확보:</strong> 주당 최소 <strong>15~20시간 이상의 순수 자습 시간</strong>이 유지되어야 장기기억 고착화가 가능합니다.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 6섹션: 시험 4주 전 / 3주 전 / 2주 전 / 1주 전 주차별 공부법 & 상황별 맞춤 처방 -->
      <div class="glass-card rounded-3xl p-6 sm:p-8 border border-gray-200 space-y-6">
        
        <!-- 상단 헤더 -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-gray-200 gap-2">
          <div class="flex items-center space-x-3">
            <div class="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
              <i data-feather="calendar" class="w-6 h-6"></i>
            </div>
            <div>
              <div class="flex items-center space-x-2">
                <span class="text-xs px-2.5 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800">D-Day 타임라인</span>
                <span class="text-xs text-gray-500">현재 남은 시간: [${d.daysUntilExam}] • 진도: [${d.examPrepLevel || '진행 중'}]</span>
              </div>
              <h3 class="text-xl font-extrabold text-gray-900 mt-0.5">시험 4주 전 • 3주 전 • 2주 전 • 1주 전 주차별 행동 전략</h3>
            </div>
          </div>
          <span class="text-xs font-semibold px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100 w-fit">
            남은 기간에 맞춰 최적화된 탭이 자동 선택됩니다
          </span>
        </div>

        <!-- 6-A: 나의 현 상황(남은 기간 × 준비도 × 공부 머리/성향) 긴급 맞춤 처방 배너 -->
        <div class="p-5 sm:p-6 rounded-2xl ${urgentPrescription.theme} bg-gradient-to-br from-white via-rose-50/20 to-amber-50/30 space-y-3.5">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2 border-b border-rose-100">
            <div class="flex items-center space-x-2">
              <span class="text-xs px-2.5 py-1 rounded-full font-black bg-rose-600 text-white shadow-sm">
                ${urgentPrescription.badge}
              </span>
              <h4 class="text-base sm:text-lg font-black text-gray-900">${urgentPrescription.title}</h4>
            </div>
          </div>

          <div class="p-3 bg-white/80 rounded-xl border border-rose-100 text-xs text-gray-700 space-y-1">
            <p>💡 <strong>상황 정밀 진단:</strong> ${urgentPrescription.situation}</p>
            <p class="text-rose-700 font-bold">🚫 <strong>절대 금기 사항:</strong> ${urgentPrescription.rule}</p>
          </div>

          <!-- 단계별 긴급 행동 플랜 -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
            ${urgentPrescription.steps.map(st => `
              <div class="p-3 bg-white rounded-xl border border-gray-200 shadow-sm space-y-1">
                <span class="text-[10px] font-black px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 uppercase">${st.day}</span>
                <strong class="text-xs font-bold text-gray-900 block">${st.title}</strong>
                <p class="text-[11px] text-gray-600 leading-relaxed">${st.desc}</p>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- 6-B: 4주 전 / 3주 전 / 2주 전 / 1주 전 주차별 탭 인터페이스 -->
        <div class="space-y-4 pt-2">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-gray-700">전체 주차별 공부법 탭을 클릭하여 각 시기별 전략을 확인하세요:</span>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button type="button" id="tab-week-4" onclick="switchTimelineTab(4)" 
              class="timeline-tab ${d.daysUntilExam === '3~4주 전' || d.daysUntilExam === '1~2개월 이상' ? 'current-period' : ''}">
              <i data-feather="book-open" class="w-3.5 h-3.5"></i>
              <span>4주 전 (D-28)</span>
            </button>
            <button type="button" id="tab-week-3" onclick="switchTimelineTab(3)" 
              class="timeline-tab">
              <i data-feather="layers" class="w-3.5 h-3.5"></i>
              <span>3주 전 (D-21)</span>
            </button>
            <button type="button" id="tab-week-2" onclick="switchTimelineTab(2)" 
              class="timeline-tab ${d.daysUntilExam === '2주 전' ? 'current-period' : ''}">
              <i data-feather="file-text" class="w-3.5 h-3.5"></i>
              <span>2주 전 (D-14)</span>
            </button>
            <button type="button" id="tab-week-1" onclick="switchTimelineTab(1)" 
              class="timeline-tab ${d.daysUntilExam === '1주 이내' ? 'current-period' : ''}">
              <i data-feather="zap" class="w-3.5 h-3.5"></i>
              <span>1주 전 (D-7 파이널)</span>
            </button>
          </div>

          <!-- 동적 주차별 상세 가이드 카드 (JS로 렌더링) -->
          <div id="weekly-tab-content" class="p-5 sm:p-6 rounded-2xl bg-gray-50 border border-gray-200">
            <!-- switchTimelineTab() -->
          </div>
        </div>

      </div>

      <!-- 7섹션: 오늘 바로 실행하는 5대 체크리스트 -->
      <div class="glass-card rounded-2xl p-6 sm:p-8 border border-gray-200 bg-gradient-to-br from-white to-indigo-50/30 space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-gray-200">
          <div class="flex items-center space-x-2">
            <i data-feather="check-square" class="w-5 h-5 text-indigo-600"></i>
            <h3 class="font-bold text-gray-900 text-lg">오늘 바로 시작할 5대 실행 체크리스트</h3>
          </div>
          <span class="text-xs text-gray-500">클릭하여 완료 상태를 체크해보세요!</span>
        </div>

        <div class="space-y-2.5">
          ${getDailyChecklist(d, styleInfo).map(item => `
            <label class="flex items-start space-x-3 p-3.5 rounded-xl bg-white border border-gray-200 hover:border-indigo-300 cursor-pointer transition-all">
              <input type="checkbox" class="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4" />
              <div class="text-xs sm:text-sm text-gray-800 leading-normal font-medium">
                ${item}
              </div>
            </label>
          `).join('')}
        </div>
      </div>

    </div>
  `;

  if (window.feather) feather.replace();

  setTimeout(() => {
    renderGradeGapChart(subjectAnalysis);
    switchTimelineTab(urgentPrescription.tabWeek || 1);
  }, 100);
}

// 대학 입결 분석 섹션 렌더링 헬퍼 (5등급제 vs 9등급제 지원)
function renderUnivAdmissionSection(d, univInfo) {
  if (!univInfo) {
    return `
      <div class="glass-card rounded-2xl p-6 border border-gray-200">
        <div class="flex items-center space-x-2 mb-2 text-indigo-700 font-bold">
          <i data-feather="compass" class="w-5 h-5"></i>
          <span>목표 대학 탐색 트랙</span>
        </div>
        <p class="text-xs text-gray-600 leading-relaxed">
          목표 대학이 아직 미정이거나 개별 대학을 입력하셨습니다. ${d.curriculum === '2022' ? '2022 개정 5등급제 체제에서는 <strong>공통과목 1등급(상위 10%)</strong>' : '2015 개정 9등급제 체제에서는 <strong>내신 1~2등급</strong>'} 확보 및 수능 2개 영역 2등급 이내 확보가 인서울 상위권 대학 진입의 공통 열쇠입니다.
        </p>
      </div>
    `;
  }

  const is5Grade = d.curriculum === '2022';
  const gyogwaCut = is5Grade ? univInfo.susiGyogwa.cut70_5grade : univInfo.susiGyogwa.cut70_9grade;
  const jonghapCut = is5Grade ? univInfo.susiJonghap.cut70_5grade : univInfo.susiJonghap.cut70_9grade;

  return `
    <div class="glass-card rounded-3xl p-6 sm:p-8 border border-indigo-200 bg-gradient-to-br from-white via-indigo-50/20 to-blue-50/30 space-y-6 shadow-md">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-gray-200 gap-3">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-lg shadow-md shadow-indigo-200">
            🏛️
          </div>
          <div>
            <div class="flex items-center space-x-2">
              <span class="text-xs px-2.5 py-0.5 rounded-full font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">${univInfo.badge}</span>
              <span class="text-xs text-gray-500">${univInfo.region} • [${is5Grade ? '2022 개정 5등급제 환산 적용' : '2015 개정 9등급제 적용'}]</span>
            </div>
            <h3 class="text-xl font-extrabold text-gray-900 mt-0.5">${univInfo.name} 전년도 실전 입결 & 합격 전략</h3>
          </div>
        </div>
        <div class="text-xs text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-100">
          희망 학과: <strong>${d.targetMajor || '자율전공/핵심학과'}</strong>
        </div>
      </div>

      <!-- 3대 전형 입결 비교 카드 -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- 1. 수시 학생부교과 -->
        <div class="p-5 rounded-2xl bg-white border border-gray-200 space-y-2.5 shadow-sm">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">수시 학생부교과</span>
            <span class="text-xs font-black text-indigo-600">70% 컷 ${gyogwaCut}</span>
          </div>
          <h4 class="font-bold text-gray-900 text-sm">${univInfo.susiGyogwa.jeonhyeong}</h4>
          <div class="text-xs text-gray-600 space-y-1">
            <p>• <strong>수능 최저:</strong> ${univInfo.susiGyogwa.choejeo}</p>
            <p>• <strong>합격 포인트:</strong> ${univInfo.susiGyogwa.guide}</p>
          </div>
        </div>

        <!-- 2. 수시 학생부종합 -->
        <div class="p-5 rounded-2xl bg-white border border-gray-200 space-y-2.5 shadow-sm">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold px-2 py-0.5 rounded bg-teal-100 text-teal-800">수시 학생부종합</span>
            <span class="text-xs font-black text-teal-700">70% 컷 ${jonghapCut}</span>
          </div>
          <h4 class="font-bold text-gray-900 text-sm">${univInfo.susiJonghap.jeonhyeong}</h4>
          <div class="text-xs text-gray-600 space-y-1">
            <p>• <strong>평가 포인트:</strong> ${univInfo.susiJonghap.point}</p>
          </div>
        </div>

        <!-- 3. 정시 수능 전형 -->
        <div class="p-5 rounded-2xl bg-white border border-gray-200 space-y-2.5 shadow-sm">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">정시 (수능 위주)</span>
            <span class="text-xs font-black text-purple-700">백분위 ${univInfo.jeongsi.cut70Percentile}</span>
          </div>
          <h4 class="font-bold text-gray-900 text-sm">수능 일반 전형</h4>
          <div class="text-xs text-gray-600 space-y-1">
            <p>• <strong>수능 컷 가이드:</strong> ${univInfo.jeongsi.guide}</p>
          </div>
        </div>
      </div>

      <!-- 학습 방향성 처방 -->
      <div class="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-200 space-y-2 text-xs sm:text-sm text-indigo-950">
        <div class="flex items-center space-x-2 font-bold text-indigo-900">
          <i data-feather="check-circle" class="w-4 h-4 text-indigo-600"></i>
          <span>${univInfo.name} 합격을 위한 학습자 맞춤 공부 방향성:</span>
        </div>
        <p class="leading-relaxed pl-6">
          ${univInfo.studyDirection}
        </p>
      </div>
    </div>
  `;
}

// 7가지 공부 성향 분석 섹션 렌더링 헬퍼
function renderLearningStyleSection(styleInfo) {
  return `
    <div class="glass-card rounded-3xl p-6 sm:p-8 border border-amber-200 bg-gradient-to-br from-white via-amber-50/20 to-orange-50/30 space-y-6 shadow-md">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-gray-200 gap-2">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-amber-200">
            <i data-feather="${styleInfo.icon}" class="w-5 h-5"></i>
          </div>
          <div>
            <div class="flex items-center space-x-2">
              <span class="text-xs px-2 py-0.5 rounded font-bold bg-amber-100 text-amber-800">${styleInfo.badge}</span>
              <span class="text-xs text-gray-500">유형 0${styleInfo.num}</span>
            </div>
            <h3 class="text-xl font-extrabold text-gray-900 mt-0.5">나의 공부 성향: [${styleInfo.title}] 심층 처방</h3>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- 강점 -->
        <div class="p-5 rounded-2xl bg-white border border-emerald-200 space-y-2">
          <div class="flex items-center space-x-1.5 text-emerald-700 font-bold text-sm">
            <i data-feather="check-circle" class="w-4 h-4"></i>
            <span>내가 가진 뛰어난 강점</span>
          </div>
          <p class="text-xs sm:text-sm text-gray-700 leading-relaxed">${styleInfo.strength}</p>
        </div>

        <!-- 치명적 함정 -->
        <div class="p-5 rounded-2xl bg-white border border-rose-200 space-y-2">
          <div class="flex items-center space-x-1.5 text-rose-600 font-bold text-sm">
            <i data-feather="alert-triangle" class="w-4 h-4"></i>
            <span>반드시 주의할 치명적 함정(Trap)</span>
          </div>
          <p class="text-xs sm:text-sm text-gray-700 leading-relaxed">${styleInfo.trap}</p>
        </div>

        <!-- 맞춤 공부 처방전 -->
        <div class="p-5 rounded-2xl bg-white border border-indigo-200 space-y-2">
          <div class="flex items-center space-x-1.5 text-indigo-700 font-bold text-sm">
            <i data-feather="zap" class="w-4 h-4"></i>
            <span>성향 맞춤 극복 솔루션</span>
          </div>
          <p class="text-xs sm:text-sm text-indigo-950 leading-relaxed">${styleInfo.prescription}</p>
        </div>
      </div>

      <!-- 일일 실천 루틴 -->
      <div class="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs sm:text-sm text-amber-950 flex items-start space-x-2.5">
        <i data-feather="calendar" class="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0"></i>
        <div>
          <strong class="font-bold text-amber-900 block mb-0.5">오늘부터 실천할 매일의 전용 습관:</strong>
          <span>${styleInfo.dailyHabit}</span>
        </div>
      </div>
    </div>
  `;
}

// 과목별 분석 (1학년 전과목 공통 처리 + 2/3학년 선택과목 등급 제외)
function analyzeSubjects(d) {
  let cardsHtml = '';
  let prioritySubject = '수학';
  let maxGap = -1;
  let totalRankGap = 0;
  const labels = [];
  const currentData = [];
  const targetData = [];
  const isHigh1 = d.grade === '고1';

  if (d.examFocus === '내신 중시' || d.examFocus === '둘다 중요' || !d.examFocus) {
    d.naesinSubjects.forEach(s => {
      // 1학년이면 무조건 공통! 2/3학년은 s.isCommon 기준
      const isCommon = isHigh1 ? true : s.isCommon;
      const gap = s.currentRank - s.targetRank;
      totalRankGap += Math.max(0, gap);
      if (gap > maxGap) {
        maxGap = gap;
        prioritySubject = s.name;
      }
      labels.push(s.name);
      currentData.push(s.currentRank);
      targetData.push(s.targetRank);

      const curG = calculateGrade(s.currentRank, d.schoolTotal, d.curriculum);
      const tarG = calculateGrade(s.targetRank, d.schoolTotal, d.curriculum);

      cardsHtml += `
        <div class="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
          <div>
            <div class="flex items-center space-x-1.5">
              <span class="font-bold text-gray-800 text-sm">${s.name}</span>
              <span class="text-[10px] px-1.5 py-0.5 rounded font-bold ${isCommon ? 'subject-type-common' : 'subject-type-elective'}">
                ${isCommon ? `공통(${d.curriculum === '2022' ? '5등급제' : '9등급제'})` : '선택(등수관리)'}
              </span>
            </div>
            <div class="text-xs text-gray-500 mt-0.5">
              ${isCommon 
                ? `현재 ${s.currentRank}등 (${curG}등급) → 목표 ${s.targetRank}등 (${tarG}등급)` 
                : `현재 ${s.currentRank}등 → 목표 ${s.targetRank}등 (※ 인원수 상이로 등급 제외)`}
            </div>
          </div>
          <span class="text-xs font-bold px-2 py-1 rounded ${gap > 0 ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-200 text-gray-700'}">
            ${gap > 0 ? `▲ ${gap}등 단축` : '목표권 유지'}
          </span>
        </div>
      `;
    });
  } else {
    // 모의고사인 경우 (전국 표준 9등급제)
    const mockSubjects = ['국어', '영어', '수학', '사회', '과학'];
    mockSubjects.forEach(sub => {
      const cur = d.mockGrades[sub]?.current || 3;
      const tar = d.mockGrades[sub]?.target || 1;
      const gap = cur - tar;
      if (gap > maxGap) {
        maxGap = gap;
        prioritySubject = sub;
      }
      labels.push(sub);
      currentData.push(cur);
      targetData.push(tar);

      cardsHtml += `
        <div class="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
          <div>
            <span class="font-bold text-gray-800 text-sm">${sub} (모의고사)</span>
            <div class="text-xs text-gray-500 mt-0.5">현재 ${cur}등급 → 목표 ${tar}등급 (9등급제)</div>
          </div>
          <span class="text-xs font-bold px-2 py-1 rounded ${gap > 0 ? 'bg-teal-100 text-teal-700' : 'bg-gray-200 text-gray-700'}">
            ${gap > 0 ? `▲ ${gap}등급 도약` : '목표 유지'}
          </span>
        </div>
      `;
    });
  }

  return { prioritySubject, maxGap, totalRankGap, cardsHtml, labels, currentData, targetData };
}

// 5대 실행 체크리스트 생성
function getDailyChecklist(d, styleInfo) {
  return [
    `<strong>[성향 전용 루틴]</strong> 나의 <strong>[${styleInfo.title}]</strong> 특성에 맞춰 오늘 <strong>"${styleInfo.dailyHabit}"</strong> 반드시 실천하기`,
    `<strong>[최우선 도약 과목 몰입]</strong> 공통/선택 과목 중 갭이 가장 큰 <strong>[${d.targetUniversity || '목표대학'} 대비 취약 과목]</strong>에 자습 시간 1시간 30분 우선 배정하기`,
    `<strong>[선택과목 등수 관리]</strong> 수강생 수가 적은 선택과목일수록 1문제 차이로 석차가 크게 갈리므로, 서술형 예상 키워드 5개 완벽 암기하기`,
    `<strong>[인출 밸런스 3:7 전환]</strong> 강의나 개념을 읽은 뒤 책을 덮고 A4 백지에 오늘 배운 개념과 공식 3가지를 안 보고 손으로 적어보기`,
    `<strong>[D-Day 타이머 훈련]</strong> 다음 시험(${d.daysUntilExam}) 대비 실제 시험 시간보다 5분 짧게 타이머를 맞추고 타임어택 문제 풀이 1세트 완료하기`
  ];
}

// 고민 사항별 처방
function getStrugglePrescription(struggle) {
  switch (struggle) {
    case '기초 개념이 부족한 편':
      return {
        cause: '용어와 정의, 기본 공식의 유도 과정이 생략된 채 문제만 보려 하기 때문에 낯선 표현이 나오면 뇌가 멈춥니다.',
        action: '난도 높은 문제집을 덮고, 교과서나 기본 개념서의 설명 문장을 소리 내어 읽고 자기 언어로 요약하는 "개념 단권화"를 먼저 끝내세요.',
        dailyHabit: '공부 시작 전 15분 동안 어제 공부한 단원의 목차만 보고 하위 개념과 공식을 백지에 직접 적어보는 [백지 인출 15분]을 진행하세요.'
      };
    case '기본 개념은 이해하지만 문제 풀이가 어려움':
      return {
        cause: '개념을 "눈으로 이해한 상태(수동적 앎)"와 "문제 조건에서 필요한 개념을 꺼내는 상태(능동적 인출)" 사이에 다리가 놓이지 않았기 때문입니다.',
        action: '문제를 읽고 밑줄을 그으며 [주어진 조건]과 [구해야 하는 값]을 분리해 적으세요. 그 다음 "이 조건에서 쓸 수 있는 공식 후보 2가지"를 옆에 적는 연결 훈련을 하세요.',
        dailyHabit: '풀리지 않는 문제는 바로 해설지를 보지 말고, 3분 동안 관련 개념 페이지를 직접 찾아 어떤 공식이 필요한지 매칭한 뒤 다시 시도하세요.'
      };
    case '기본 문제는 풀지만 응용 문제에 약함':
      return {
        cause: '문제를 외워서 푸는 습관 때문입니다. 유형서의 "대표 유형 풀이법"을 통째로 암기하다 보니 조건이 2개 이상 섞인 변형 문제를 만나면 당황합니다.',
        action: '양치기(문제 많이 풀기)를 멈추고 한 문제를 깊게 뜯어보세요. "출제자가 왜 이 단원과 저 단원을 엮었을까?", "조건이 A에서 B로 바뀌면 풀이가 어떻게 바뀔까?"를 역질문하세요.',
        dailyHabit: '틀린 문제 1개를 골라 "친구에게 왜 이 순서로 풀어야 하는지 3분간 설명"하는 메타인지 루틴을 매일 1문항씩 실천하세요.'
      };
    case '대부분의 문제를 풀지만 고난도 문제에 약함':
      return {
        cause: '1등급 킬러 문항은 개념의 깊이뿐 아니라 논리적 케이스 분류(Case-by-case), 발상적 접근, 그리고 고난도 문항에 투자할 시간 확보가 필수적입니다.',
        action: '비킬러(기본 3~4점) 문항 풀이 시간을 극한으로 단축하여 킬러 문항에 쓸 20~25분을 확보하세요. 킬러 문항은 하루에 단 2문항이라도 20분 이상 고민하는 끈기가 필요합니다.',
        dailyHabit: '기출 킬러 문항을 푼 뒤, 출제자의 "출제 의도 1줄 요약"과 "내가 놓친 첫 발상의 실마리"를 오답 카드에 압축 기록하세요.'
      };
    case '실력은 있지만 시험에서 점수가 기대보다 낮음':
      return {
        cause: '시험 당일 긴장감 관리 부족, 시간 배분 실패, 계산 실수, 지문 오독 등 "실전 시험 운용 전략"이 체계화되어 있지 않은 상태입니다.',
        action: '실수를 "실수였다"고 넘기지 말고 [계산 착오 / 조건 누락 / 시간 부족 / 마킹 오류] 4가지로 분류하는 [실수 전용 노트]를 만드세요.',
        dailyHabit: '주 1~2회 실제 시험 시간보다 5분 짧게 타이머를 맞추고 실전 모의고사 OMR 마킹까지 끝내는 타임어택 시뮬레이션을 반복하세요.'
      };
    default:
      return {
        cause: '자신의 현재 위치와 취약 단원에 대한 데이터(오답 분석, 단원별 정답률)가 누적되어 있지 않아 막연한 불안감이 큰 상태입니다.',
        action: '최근 본 시험지나 문제집 2권을 꺼내 틀린 문제들이 어떤 단원인지 표를 만들어보세요. 70% 이상의 약점은 특정 2개 단원에 집중되어 있습니다.',
        dailyHabit: '매일 밤 자기 전 10분, 오늘 푼 문제 수와 맞은 문제 수를 기록하여 학습 성취를 시각화하세요.'
      };
  }
}

// 인풋 vs 아웃풋 분석
function analyzeMethodBalance(methods, envs) {
  let inputCount = 0;
  let outputCount = 0;

  methods.forEach(m => {
    if (m === '개념을 읽고 이해하기' || m === '필기 및 노트 정리') inputCount += 2;
    if (m === '교과서 문제 풀이') { inputCount += 1; outputCount += 1; }
    if (m === '문제집 풀이' || m === '백지 복습 및 암기 테스트' || m === '오답 노트 작성' || m === '기출문제 및 실전 모의고사 풀이') outputCount += 2;
  });

  envs.forEach(e => {
    if (e === '학원' || e === '인터넷 강의' || e === '과외') inputCount += 1.5;
    if (e === '문제집 중심 학습' || e === '스터디 앱 또는 AI 도구') outputCount += 1;
  });

  const total = Math.max(1, inputCount + outputCount);
  const inPct = Math.round((inputCount / total) * 100);
  const outPct = 100 - inPct;

  let label = '황금 밸런스형';
  let feedback = '현재 인풋과 아웃풋의 균형이 아주 좋습니다. 개념 습득과 문제 풀이의 비율을 유지하며 오답 심화 분석에 힘쓰세요.';

  if (inPct > 60) {
    label = '인풋 과다형 (출력 부족 경고)';
    feedback = '강의나 필기 등 "공부하는 기분"을 내는 데 많은 시간을 쓰고 있습니다. 실제로 시험장에서 점수를 만드는 것은 내 손으로 직접 푸는 아웃풋(인출)입니다. 인풋:아웃풋 비율을 3:7로 전환하세요!';
  } else if (outPct > 70) {
    label = '문제 양치기형 (개념 누수 주의)';
    feedback = '개념 정리 없이 문제만 많이 푸는 방식은 점수 정체기(벽)를 부릅니다. 틀린 문제는 반드시 개념서로 돌아가 구멍 난 개념을 메꾸는 역방향 복습을 병행하세요.';
  }

  return { inputPercent: inPct, outputPercent: outPct, label, feedback };
}

// --- 4주 전 / 3주 전 / 2주 전 / 1주 전 주차별 정밀 공부 가이드 DB ---
const WEEKLY_STUDY_GUIDE = {
  4: {
    week: 4,
    dDay: 'D-28 ~ D-22',
    title: '4주 전: [개념 뼈대 구축 및 시험 범위 목차 조망]',
    badge: '4주 전: 개념 단권화',
    ratio: '인풋(개념·교과서) 70% : 아웃풋(기본 유제) 30%',
    mission: '시험 범위 전체 숲(목차)을 조망하고, 교과서 본문과 개념서 필수 예제를 100% 자력으로 풀 수 있는 뼈대를 완성하는 주간',
    tasks: [
      '교과서 및 학교 부교재 전 범위 소리 내어 1회독 정독 (놓친 정의·공식 확인)',
      '대단원/소단원 목차만 보고 하위 핵심 공식 빈 종이에 직접 써보기 (목차 백지화)',
      '개념서(수학의 바이블, 개념원리, 완자 등) 필수 예제 100% 혼자 힘으로 풀이',
      '학교 선생님이 수업시간에 강조한 필기와 프린트물을 교과서 1권에 단권화 집약'
    ],
    warning: '※ 이 시기에 아직 어려운 심화 기출이나 고난도 N제에 손대지 마세요! 개념 누수 방지가 최우선입니다.',
    materials: '교과서, 기본 개념서, 학교 수업 필기 프린트'
  },
  3: {
    week: 3,
    dDay: 'D-21 ~ D-15',
    title: '3주 전: [유형서 마스터 및 학교 부교재/프린트 변형 훈련]',
    badge: '3주 전: 유형 체화',
    ratio: '인풋(복습) 30% : 아웃풋(유형 풀이) 70%',
    mission: '시험에 단골로 출제되는 대표 유형을 기계적으로 풀어낼 수 있도록 문제 풀이량을 집중 투입하는 주간',
    tasks: [
      '유형서(쎈 B단계, RPM, 올림포스 등) 대표 유형 및 상위 유형 2회독 풀이',
      '학교 선생님이 나눠준 수업 프린트 및 부교재 변형 예상 문제 집중 분석',
      '문제를 풀 때 3분 이상 고민해도 안 풀리면 즉시 관련 공식/개념 페이지 역추적',
      '서술형 주관식으로 출제될 수 있는 핵심 문장 및 정의 형광펜 체크'
    ],
    warning: '※ 모르는 문제를 1초 만에 답지 보고 넘기는 "가짜 공부"를 주의하세요. 반드시 3분간 고민하는 습관 유지!',
    materials: '유형별 문제집(쎈, RPM 등), 학교 수업 프린트 변형'
  },
  2: {
    week: 2,
    dDay: 'D-14 ~ D-8',
    title: '2주 전: [우리 학교 3개년 기출 역설계 & 서술형 킬러 타격]',
    badge: '2주 전: 기출 심화',
    ratio: '기출/변형 풀이 80% : 취약 개념 역주행 20%',
    mission: '우리 학교 및 인근 학교 최근 3개년 기출문제를 실전처럼 풀고 서술형 채점 기준표를 정복하는 주간',
    tasks: [
      '우리 학교 최근 3개년 기출 시험지 50분 타이머 맞추고 실전 풀이',
      '서술형 채점 기준표 분석: 단어 하나 누락으로 2~3점 감점당하는 핵심 키워드 완벽 암기',
      '틀린 문제 1차 선별: [개념 결손 / 조건 오독 / 계산 실수] 3분류 태깅',
      '수능특강 및 학력평가 변형 문제 중 학교 선생님 출제 스타일과 일치하는 문항 선별'
    ],
    warning: '※ 새로운 문제집을 또 사지 마세요! 이미 푼 문제집의 틀린 문제와 학교 부교재 반복이 100배 효율적입니다.',
    materials: '우리 학교 3개년 족보 기출, 수능특강/학평 변형 문제'
  },
  1: {
    week: 1,
    dDay: 'D-7 ~ D-Day',
    title: '1주 전: [오답 선별 3회독 & 실전 타임어택 파이널]',
    badge: '1주 전: 파이널 직전',
    ratio: '오답 회독 60% : 실전 모의 OMR 40%',
    mission: '새 문제는 완전 중단하고, 이미 풀었던 문제 중 틀린 것만 3회독하며 실전 시간 배분을 완성하는 주간',
    tasks: [
      '오답 노트 및 1~3주차에 틀렸던 문제만 골라 해설지 없이 3회독 반복 풀이',
      '실제 시험 시간보다 5분 짧게(45분) 타이머 맞추고 OMR 마킹까지 실전 시뮬레이션',
      '시험 전날 밤 30분 만에 전체 범위를 훑을 수 있는 A4 1~2장 "치트시트" 작성',
      '시험 1주일 전부터 최소 6~7시간 숙면 유지 (수면 부족은 시험 당일 뇌 회전력을 30% 감퇴시킵니다)'
    ],
    warning: '※ 풀리지도 않는 새로운 초고난도 킬러를 붙잡고 밤새우지 마세요! 맞출 수 있는 80% 문제를 100% 맞는 것이 승리 공식입니다.',
    materials: '오답 선별 노트, 직전 치트시트 요약본'
  }
};

// 상황별 맞춤 벼락치기 / 긴급 돌파 처방전 생성기
function getCustomUrgentPrescription(d) {
  const is1Week = d.daysUntilExam === '1주 이내';
  const is2Week = d.daysUntilExam === '2주 전';
  const isLowPrep = (d.examPrepLevel || '거의 안 됨') === '거의 안 됨';
  const isConceptOnly = (d.examPrepLevel || '') === '개념만 완료';
  const isSmart = d.learningStyle.includes('원리') || d.learningStyle.includes('역설계') || d.learningStyle.includes('설명') || d.learningStyle.includes('양치기') || d.primaryStruggle.includes('실력은 있지만');

  // 사용자 맞춤형 특수 케이스: 시험 1주일 전 + 공부 거의 안 됨 + 공부 머리 좋은 편
  if (is1Week && isLowPrep && isSmart) {
    return {
      type: 'brainy_cram',
      theme: 'urgent-glow',
      badge: '🚨 D-7 긴급 역전 처방전',
      title: '공부 머리 빠른 학생을 위한 "족보 역설계 기출 침투" 벼락치기 전술',
      situation: '남은 시간은 단 7일, 시험 범위 진도는 거의 안 나갔지만 이해력과 추론 능력이 뛰어난 학생의 전형적인 상황입니다.',
      tabWeek: 1,
      rule: '교과서 1페이지부터 밑줄 그으며 정독하기 절대 금지! 아무리 머리가 좋아도 7일 만에 전 범위를 정석 완독 후 문제를 풀 시간은 물리적으로 부족합니다.',
      steps: [
        { day: 'Day 1~2', title: '기출 정답·해설 먼저 읽기 (출제 급소 역추적)', desc: '우리 학교 3개년 기출문제의 "정답과 해설"을 소설책 읽듯 먼저 읽으세요. 선생님이 어떤 개념을 주관식 서술형으로 냈는지, 어떤 공식을 변형했는지 출제자의 의도를 1시간 만에 스캔합니다.' },
        { day: 'Day 3~4', title: '배점 1순위 핵심 단원 3개 단기 흡수', desc: '이해력이 뛰어난 강점을 살려, 시험에 무조건 출제되는 1순위 핵심 단원 3개의 공식 유도 과정과 대표 예제 풀이법만 빈 종이에 집약 암기하세요.' },
        { day: 'Day 5~6', title: '준킬러 & 서술형 기본점수 싹쓸이 타임어택', desc: '초고난도 킬러 1~2문제는 과감히 버리세요! 배점 높은 서술형 기본 문항과 준킬러 객관식을 100% 맞추는 타임어택 훈련에 올인하여 3등급 이상을 확실히 쟁취합니다.' },
        { day: 'D-1 직전', title: '선생님 강조 필기 확인 & 6시간 숙면', desc: '수업 시간에 별표 친 것만 확인하고 일찍 잠자리에 드세요. 수면 부족은 머리 좋은 학생의 시험 당일 뇌 회전력을 망치는 최대의 적입니다.' }
      ]
    };
  } else if (is1Week && isLowPrep && !isSmart) {
    // 1주 전 + 공부 안 됨 + 암기/회독형
    return {
      type: 'memo_cram',
      theme: 'urgent-glow',
      badge: '🚨 D-7 긴급 생존 처방전',
      title: '서술형 핵심 키워드 50개 통암기 벼락치기 전술',
      situation: '남은 시간은 7일이며 암기력과 성실성에 강점을 가진 학생이 시간이 촉박한 상황입니다.',
      tabWeek: 1,
      rule: '어려운 계산 문제에 매달리지 말고, 배점 높은 서술형 키워드와 단답형 개념을 싹쓸이하여 점수를 방어하세요.',
      steps: [
        { day: 'Day 1~2', title: '교과서 학습활동 및 날개 지문 통암기', desc: '교과서 단원 마무리 학습활동과 수업 프린트의 굵은 글씨 핵심 용어 50개를 포스트잇에 적어 통암기합니다.' },
        { day: 'Day 3~4', title: '교과서 기본 예제 2회독', desc: '교과서 본문에 수록된 대단원 기본 문제만 반복해서 풀며 쉬운 문제 실수를 0으로 만듭니다.' },
        { day: 'Day 5~6', title: '서술형 예상 답안 백지 쓰기', desc: '선생님이 수업 중 강조한 서술형 예상 문장을 빈 종이에 안 보고 똑같이 쓰는 훈련을 합니다.' },
        { day: 'D-1 직전', title: '오답 치트시트 최종 점검', desc: '헷갈리는 공식과 단어만 A4 한 장에 적어 시험 직전 쉬는 시간까지 반복 회독합니다.' }
      ]
    };
  } else if (is1Week && isConceptOnly) {
    // 1주 전 + 개념만 됨
    return {
      type: 'concept_only',
      theme: 'glass-card',
      badge: '⚡ D-7 실전 연결 처방전',
      title: '개념은 알지만 문제가 막힐 때의 대표 유형 집중 돌파',
      situation: '개념은 머리에 들어있으나 실전 문제 적용이 덜 된 상태입니다.',
      tabWeek: 1,
      rule: '새로운 이론을 더 보지 말고, 유형서 대표 문제 20개만 골라 "공식이 문제 조건 어디에 쓰이는지" 1:1 매칭 훈련을 하세요.',
      steps: [
        { day: 'Day 1~3', title: '대표 유형 풀이 조건 매칭', desc: '문제를 읽고 밑줄을 그어 [조건]과 [공식]을 옆에 써보는 연결 풀이 훈련을 집중 실시합니다.' },
        { day: 'Day 4~6', title: '학교 기출 2회분 타임어택', desc: '실제 시험 시간과 동일하게 맞추고 기출 시험지를 풀며 시간 배분 연습을 완료합니다.' },
        { day: 'D-1 직전', title: '실수 노트 점검 & 수면 관리', desc: '계산 착오나 조건 누락이 없도록 주의할 점 3가지를 메모하고 컨디션을 조절합니다.' }
      ]
    };
  } else if (is2Week) {
    // 2주 전
    return {
      type: 'd14_plan',
      theme: 'glass-card',
      badge: '⚡ D-14 2주 완성 집중 처방전',
      title: '1주차 빈출 유형 마스터 + 2주차 기출 오답 회독 압축 플랜',
      situation: '남은 14일은 중위권에서 1~2등급으로 도약할 수 있는 가장 결정적인 골든타임입니다.',
      tabWeek: 2,
      rule: '첫 1주일은 유형서와 학교 프린트 변형에 집중하고, 마지막 1주일은 3개년 기출과 오답 회독에 올인하세요.',
      steps: [
        { day: '1주차 (D-14~D-8)', title: '유형서 B단계 & 학교 부교재 변형 정복', desc: '단원별 대표 유형과 학교 부교재의 변형 예상 문제를 2회독하여 문제 풀이 속도를 끌어올립니다.' },
        { day: '2주차 (D-7~D-Day)', title: '3개년 기출 풀이 & 오답 3회독 파이널', desc: '실전 타임어택으로 기출문제를 풀고, 틀린 문제만 모아 오답 3회독 후 치트시트로 마무리합니다.' }
      ]
    };
  } else {
    // 3~4주 전 or 기본
    return {
      type: 'd30_plan',
      theme: 'glass-card',
      badge: '🏆 D-30 체계적 마스터 처방전',
      title: '4주 전부터 1주 전까지 주차별 고득점 완벽 로드맵',
      situation: '충분한 시간이 확보되어 있으므로 주차별로 체계적인 성적 도약이 가능한 최상의 상태입니다.',
      tabWeek: 4,
      rule: '4주 전 개념 단권화 → 3주 전 유형 마스터 → 2주 전 기출 심화 → 1주 전 오답 파이널 단계를 흔들림 없이 실천하세요.',
      steps: [
        { day: '4주 전 (D-28)', title: '개념 뼈대 & 목차 백지화', desc: '교과서/개념서 1회독 정독 및 핵심 공식 단권화' },
        { day: '3주 전 (D-21)', title: '유형서 대표 문제 마스터', desc: '유형서 B단계 및 학교 프린트 변형 훈련' },
        { day: '2주 전 (D-14)', title: '학교 3개년 기출 역설계', desc: '기출문제 풀이 및 서술형 채점 기준표 키워드 암기' },
        { day: '1주 전 (D-7)', title: '오답 3회독 & 타임어택 파이널', desc: '틀린 문제만 3회독 반복 및 시험 전날 치트시트 완성' }
      ]
    };
  }
}

// 주차별 타임라인 탭 전환 함수
window.currentTimelineWeek = 1;
window.switchTimelineTab = function (weekNum) {
  window.currentTimelineWeek = weekNum;
  document.querySelectorAll('.timeline-tab').forEach(t => t.classList.remove('active'));
  document.getElementById(`tab-week-${weekNum}`)?.classList.add('active');

  const g = WEEKLY_STUDY_GUIDE[weekNum];
  const contentBox = document.getElementById('weekly-tab-content');
  if (!contentBox || !g) return;

  contentBox.innerHTML = `
    <div class="space-y-4 animate-fade-in">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-gray-100 gap-2">
        <div>
          <span class="text-xs px-2.5 py-0.5 rounded-full font-bold bg-indigo-100 text-indigo-700">${g.dDay}</span>
          <h4 class="text-base sm:text-lg font-bold text-gray-900 mt-1">${g.title}</h4>
        </div>
        <div class="text-xs font-semibold px-3 py-1 rounded-xl bg-gray-50 border border-gray-200 text-gray-700">
          비중: <strong class="text-indigo-600">${g.ratio}</strong>
        </div>
      </div>

      <div class="p-3.5 bg-indigo-50/70 rounded-xl border border-indigo-100 text-xs sm:text-sm text-indigo-950 font-medium">
        🎯 <strong>주간 핵심 미션:</strong> ${g.mission}
      </div>

      <div class="space-y-2">
        <span class="text-xs font-bold text-gray-700 uppercase tracking-wider block">월~일 요일별 실천 과제:</span>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          ${g.tasks.map(t => `
            <div class="p-3 bg-white rounded-xl border border-gray-200 flex items-start space-x-2 text-xs text-gray-800">
              <i data-feather="check-circle" class="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5"></i>
              <span>${t}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="p-3 bg-rose-50 rounded-xl border border-rose-200 text-xs text-rose-800 leading-relaxed">
        ${g.warning}
      </div>

      <div class="text-xs text-gray-500 pt-1">
        📚 <strong>추천 교재 및 학습 자료:</strong> ${g.materials}
      </div>
    </div>
  `;

  if (window.feather) feather.replace();
};

// D-Day 기간별 로드맵 (기존 함수 호환 유지)
function getTimelineRoadmap(days) {
  if (days === '1주 이내') {
    return {
      title: '초단기 직전 파이널 루틴',
      steps: [
        {
          title: '새 문제 풀이 완전 중단',
          desc: '새로운 고난도 문제를 풀며 멘탈을 깎지 마세요. 이미 풀어본 문제 중 틀렸던 문제만 3회독합니다.',
          tasks: ['오답 문제 선별 표시', '자주 틀리는 공식 포스트잇 요약', '실전 마인드셋 유지']
        },
        {
          title: '핵심 개념 백지 단권화',
          desc: '시험 전날 밤 30분 만에 전체 범위를 훑을 수 있는 A4 1~2장 분량의 벼락치기 치트시트를 만드세요.',
          tasks: ['단원별 핵심 암기 리스트 작성', '취약 선지 OX 테스트', '수면 시간 6시간 이상 확보']
        },
        {
          title: '실전 타임어택 & OMR',
          desc: '시험 시작 1교시 시간대에 맞춰 뇌를 깨우고 실전 시간 배분(마킹 5분 남기기)을 연습합니다.',
          tasks: ['1회분 직전 모의고사 실전 풀이', '실수 방지 체크리스트 점검', '준비물 및 시험장 시뮬레이션']
        }
      ]
    };
  } else if (days === '2주 전') {
    return {
      title: '시험 2주 집중 완성 루틴',
      steps: [
        {
          title: '1주차: 빈출 유형 및 부교재 변형 정복',
          desc: '시험에 자주 나오는 대표 유형과 학교 선생님 부교재 문제를 집중 풀이합니다.',
          tasks: ['유형서 B단계 2회독', '수업 프린트 핵심 문장 암기', '취약 단원 개념 복습']
        },
        {
          title: '2주차: 3개년 기출 & 오답 회독',
          desc: '학교 기출문제를 실전처럼 풀고 오답 노트에 정리된 문항만 반복 체화합니다.',
          tasks: ['학교 3개년 기출 풀이', '오답 3회독 반복', '실전 OMR 훈련']
        },
        {
          title: '파이널: 컨디션 관리 및 치트시트',
          desc: '시험 전날 밤 30분 총정리 치트시트를 만들고 6시간 이상 숙면을 취합니다.',
          tasks: ['요약 치트시트 완성', '수면 시간 확보', '자신감 유지']
        }
      ]
    };
  } else {
    return {
      title: '시험 4주 체계적 마스터 플랜',
      steps: [
        {
          title: '4주 전: 개념 뼈대 & 목차 백지화',
          desc: '교과서와 기본 개념서를 1회독하고 전체 시험 범위의 뼈대를 완성합니다.',
          tasks: ['교과서 전 범위 정독', '목차 백지 복습', '개념서 필수 예제 풀이']
        },
        {
          title: '3~2주 전: 유형 정복 & 기출 역설계',
          desc: '유형서 마스터 및 학교 3개년 기출문제를 통해 출제 경향을 완벽 분석합니다.',
          tasks: ['유형서 2회독', '학교 3개년 기출 풀이', '서술형 키워드 암기']
        },
        {
          title: '1주 전: 오답 파이널 & 타임어택',
          desc: '틀린 문제만 3회독하고 실전 시간 배분을 완성하여 1~2등급을 굳힙니다.',
          tasks: ['오답 선별 3회독', '실전 45분 타임어택', '직전 치트시트 완성']
        }
      ]
    };
  }
}

// Chart.js 차트 렌더링
let gapChartInstance = null;
function renderGradeGapChart(subjectAnalysis) {
  const ctx = document.getElementById('gradeGapChart');
  if (!ctx) return;

  if (gapChartInstance) gapChartInstance.destroy();

  const isMock = state.data.examFocus === '모의고사 중시';

  gapChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: subjectAnalysis.labels,
      datasets: [
        {
          label: isMock ? '현재 등급 (1~9)' : '현재 석차 (등)',
          data: subjectAnalysis.currentData,
          backgroundColor: 'rgba(156, 163, 175, 0.6)',
          borderColor: 'rgba(107, 114, 128, 1)',
          borderWidth: 1.5,
          borderRadius: 6
        },
        {
          label: isMock ? '목표 등급 (1~9)' : '목표 석차 (등)',
          data: subjectAnalysis.targetData,
          backgroundColor: 'rgba(79, 70, 229, 0.85)',
          borderColor: 'rgba(67, 56, 202, 1)',
          borderWidth: 1.5,
          borderRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            boxWidth: 12,
            font: { family: 'Pretendard', size: 12, weight: 'bold' }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(17, 24, 39, 0.9)',
          padding: 10,
          titleFont: { family: 'Pretendard', size: 13, weight: 'bold' },
          bodyFont: { family: 'Pretendard', size: 12 }
        }
      },
      scales: {
        y: {
          reverse: true,
          beginAtZero: false,
          title: {
            display: true,
            text: isMock ? '등급 (숫자가 낮을수록 우수)' : '석차 (1등에 가까울수록 위로)',
            font: { family: 'Pretendard', size: 11 }
          },
          grid: { color: 'rgba(226, 232, 240, 0.6)' }
        },
        x: { grid: { display: false } }
      }
    }
  });
}
