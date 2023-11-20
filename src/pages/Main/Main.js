import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import Modal from 'react-modal';
import GraphBarChart from './GraphBarChart';
import GraphCircularChart from './GraphCircularChart';
import ko from 'date-fns/locale/ko';
import './Main.scss';

const Main = () => {
  // 모달창 노출 여부 확인
  const [currentModal, setCurrentModal] = useState('');
  // 참여하기 체크박스 체크시 입력창 활성화 여부 확인
  const [isParticChecked, setIsParticChecked] = useState(false);
  // 생성하기 체크박스 체크시 입력창 활성화 여부 확인
  const [isCreatingChecked, setIsCreatingChecked] = useState(false);
  // 완료 버튼 활성화, 비활성화 여부 확인
  const [isCompleteEnabled, setIsCompleteEnabled] = useState(false);
  // 선택된 메뉴 상태 저장
  const [checkedMenu, setCheckedMenu] = useState('');
  // 인증번호 입력값 상태 추가
  const [verificationCode, setVerificationCode] = useState('');
  // 필수 입력 값 여부 확인
  const [inputValues, setInputValues] = useState(INITIAL_INPUT_VALUES);
  // 1년 수입/지출 비교
  const [yearlyData, setYearlyData] = useState(null);
  const selectedYear = 2023;
  // 월별 - 카테고리 현황(%)
  const [monthlyData, setMonthlyData] = useState(null);
  const selectedMonth = 11;

  // 모달창 닫기
  const closeModal = () => {
    setCurrentModal('');
    resetInputStates();
  };
  // 입력 값 초기화(모달창 닫았을때)
  const resetInputStates = () => {
    setCheckedMenu('');
    setInputValues(INITIAL_INPUT_VALUES);
    setIsCompleteEnabled(false);
  };

  // 생성하기 체크박스가 활성화되면 완료 버튼 활성화
  useEffect(() => {
    setIsCompleteEnabled(checkedMenu === 'creating');
  }, [checkedMenu]);

  // input, selectBox 값 변경 여부
  const handleInputChange = (fieldName, value) => {
    if (fieldName === 'verifiInput') {
      // 인증번호 입력값 업데이트
      setVerificationCode(value);
      // 참여하기 체크박스가 활성화되면서 인증번호를 입력되면 완료 버튼 활성화
      const isVerificationCodeValid =
        checkedMenu === 'partic' && value.length === 8;

      setIsCompleteEnabled(isVerificationCodeValid);
    } else {
      // 다른 필드의 입력값 업데이트
      const updatedInputValues = { ...inputValues, [fieldName]: value };
      setInputValues(updatedInputValues);
      // 완료 버튼 활성화 여부 업데이트
      const { divide, category, day, price, memo } = updatedInputValues;
      setIsCompleteEnabled(divide && category && day && price && memo);
      // 체크박스 클릭시 비활성화
      if (
        (fieldName === 'partic' && checkedMenu === 'partic') ||
        (fieldName === 'creating' && checkedMenu === 'creating')
      ) {
        resetInputStates();
      }
    }
  };
  // 페이지 이동
  const navigate = useNavigate();
  // 토큰
  const token = localStorage.getItem('token');
  // const token =
  //   'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRocmVlc2xAZ21haWwuY29tIiwiaWF0IjoxNzAwMTI4ODExLCJleHAiOjE3MDg3Njg4MTF9.a8jm42FaiAwRdy_hkOFgXo8iNh10kZzEDbg_EjkKNBg';
  // 가계부 참여하기
  const goToJoin = () => {
    // 가족 인증 코드
    const auth_code = '077db0f7';
    fetch('http://10.58.52.143:8000/family/join', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ auth_code }),
    })
      .then((res) => res.json())
      // .catch((error) => console.error(error))
      .then((data) => {
        if (data.message === 'JOIN_SUCCESS') {
          alert('가계부 참여가 완료되었습니다.');
        } else {
          alert('인증번호를 다시 한번 확인해주세요.');
        }
      });
  };

  // 가계부 생성하기
  const goToCreating = () => {
    fetch('http://10.58.52.143:8000/family/book', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      // .catch((error) => console.error(error))
      .then((data) => {
        if (data.message === 'AUTH_CODE_CREATED_SUCCESS') {
          alert('설정 페이지로 이동합니다.');
          navigate('/setting');
        } else if (data.message === 'INTERNAL_SERVER_ERROR') {
          alert('생성에 실패했습니다. 다시 시도해주세요.');
        }
      });
  };

  // 개인 수입/지출 등록하기 (모달창)
  const goToIncomeExpend = () => {
    fetch('http://10.58.52.109:8000/flow', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json;charset=utf-8',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        type: INITIAL_INPUT_VALUES.divide,
        category: INITIAL_INPUT_VALUES.category,
        memo: INITIAL_INPUT_VALUES.memo,
        amount: INITIAL_INPUT_VALUES.price,
        year: INITIAL_INPUT_VALUES.year,
        month: INITIAL_INPUT_VALUES.month,
        date: INITIAL_INPUT_VALUES.date,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === 'POST_SUCCESS') {
          alert('등록이 완료되었습니다.');
        } else {
          alert('등록에 실패했습니다. 다시 한번 확인해주세요');
        }
      });
  };
  // 수입/지출 여부 드롭다운(구분), (카테고리) 목록 조회
  useEffect(() => {
    // 구분
    fetch('http://10.58.52.147:8000/flow-type', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json;charset=utf-8',
        authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === 'GET_SUCCESS') {
          alert('수입/지출 목록을 성공적으로 가져왔습니다.');
        } else {
          alert('수입/지출 목록을 가져오는데 실패했습니다.');
        }
      });

    // 카테고리
    fetch('http://10.58.52.147:8000/category', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json;charset=utf-8',
        authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === 'GET_SUCCESS') {
          alert('카테고리 목록을 성공적으로 가져왔습니다.');
        } else {
          alert('카테고리 목록을 가져오는데 실패했습니다.');
        }
      });
  }, []);

  // 차트(막대, 원형)
  useEffect(() => {
    // 1년 수입/지출(막대그래프)
    fetch(
      `http://10.58.52.104:8000/flow/view?rule=year&year=${selectedYear}&unit=family`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          authorization: `Bearer ${token}`,
        },
      },
    )
      .then((response) => response.json())
      .then((data) => {
        setYearlyData(data);
      })
      .catch((error) =>
        console.error('1년 수입/지출 데이터를 가져오는 중 에러:', error),
      );
    // 월별 - 카테고리별(원형차트)
    fetch(
      `http://10.58.52.104:8000/flow/view?rule=category&year=${selectedYear}&month=${selectedMonth}&unit=family`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          authorization: `Bearer ${token}`,
        },
      },
    )
      .then((response) => response.json())
      .then((data) => {
        setMonthlyData(data);
      })
      .catch((error) =>
        console.error('월별-카테고리별 현황 데이터를 가져오는 중 에러:', error),
      );
  }, [selectedYear, selectedMonth]);

  // 완료 버튼 클릭시 실행되는 함수
  const handleComplete = () => {
    // 생성하기
    if (checkedMenu === 'creating') {
      goToCreating();
      // 참여하기
    } else if (checkedMenu === 'partic') {
      goToJoin();
    }
  };
  // 월별 - 카테고리별 현황 클릭 -> table 페이지 이동
  const goToTable = () => {
    navigate('/table');
  };

  return (
    <>
      <div className="dashboard">
        <button
          className="actionButton"
          onClick={() => setCurrentModal('참여')}
        >
          참여 & 생성하기
        </button>
        <Modal
          isOpen={currentModal === '참여'}
          overlayClassName="overlay"
          className="modal"
        >
          <button className="closeBtn" onClick={closeModal}>
            <img src="/../images/close.svg" alt="닫기버튼" />
          </button>
          <div className="mainFrame">
            <div
              className={`partic${checkedMenu === 'partic' ? ' selected' : ''}`}
              onClick={() => {
                if (checkedMenu === 'partic') {
                  setIsParticChecked(false);
                  setCheckedMenu('');
                } else {
                  setIsParticChecked(true);
                  setIsCreatingChecked(false);
                  setCheckedMenu('partic');
                }
              }}
            >
              <input
                className="clickBox"
                type="checkbox"
                onChange={() => {}}
                checked={checkedMenu === 'partic'}
                readOnly
              />
              <p className="clickText">참여하기</p>
              <span className="womanEmoji" role="img" aria-label="Emoji">
                💁🏻‍♀️
              </span>
              <input
                className="verifiInput"
                type="text"
                placeholder="인증번호를 입력해주세요"
                maxLength={8}
                disabled={checkedMenu !== 'partic'}
                onClick={(event) => event.stopPropagation()}
                onChange={(event) =>
                  handleInputChange('verifiInput', event.target.value)
                }
              />
            </div>
            <div
              className={`creating${
                checkedMenu === 'creating' ? ' selected' : ''
              }`}
              onClick={() => {
                if (checkedMenu === 'creating') {
                  setIsCreatingChecked(false);
                  setCheckedMenu('');
                } else {
                  setIsCreatingChecked(true);
                  setIsParticChecked(false);
                  setCheckedMenu('creating');
                }
              }}
            >
              <input
                className="clickBox"
                type="checkbox"
                onChange={() => {}}
                checked={checkedMenu === 'creating'}
              />
              <p className="creatingText">생성하기</p>
              <span className="manEmoji" role="img" aria-label="Emoji">
                🙋🏻‍♂️
              </span>
              <p className="settingText">설정페이지로 이동합니다.</p>
            </div>
          </div>
          <div className="buttonFrame">
            <button
              className={'completeButton'}
              disabled={!isCompleteEnabled}
              onClick={handleComplete}
            >
              완료
            </button>
          </div>
        </Modal>
        <button
          className="actionButton"
          onClick={() => setCurrentModal('수입')}
        >
          수입/지출 등록하기
        </button>
        <Modal
          isOpen={currentModal === '수입'}
          overlayClassName="overlay"
          className="modal"
        >
          <button className="closeBtn" onClick={closeModal}>
            <img src="/../images/close.svg" alt="닫기버튼" />
          </button>
          <div className="requiredTextMain">
            <p className="divideText">구분</p>
            <p className="categoryText">카테고리</p>
          </div>
          <div className="divideFrame">
            <select
              className="selectBox"
              value={inputValues.divide}
              onChange={(event) =>
                handleInputChange('divide', event.target.value)
              }
            >
              {DIVIDE_LIST.map((divide, index) => (
                <option key={index}>{divide}</option>
              ))}
            </select>
            <select
              className="selectBox"
              value={inputValues.category}
              onChange={(event) =>
                handleInputChange('category', event.target.value)
              }
            >
              {CATEGORY_LIST.map((category, index) => (
                <option key={index}>{category}</option>
              ))}
            </select>
          </div>
          <div className="requiredTextMain">
            <p className="dayText">일자</p>
            <p className="priceText">금액</p>
          </div>
          <div className="divideFrame">
            <DatePicker
              className="selectBox"
              selected={inputValues.day}
              onChange={(date) => handleInputChange('day', date)}
              selectsEnd
              dateFormat="yyyy년MM월dd일"
              locale={ko}
            ></DatePicker>
            <input
              type="text"
              className="priceInput"
              placeholder="금액을 입력해주세요"
              value={inputValues.price}
              onChange={(event) => {
                const onlyNumbers = event.target.value.replace(/[^0-9]/g, '');
                handleInputChange('price', onlyNumbers);
              }}
            />
          </div>
          <div className="memoTextMain">
            <p className="memoText">메모</p>
          </div>
          <div className="divideFrame">
            <input
              className="memoInput"
              type="text"
              maxLength={25}
              placeholder="25자 내로 작성해주세요"
              value={inputValues.memo}
              onChange={(event) =>
                handleInputChange('memo', event.target.value)
              }
            />
          </div>
          <div className="yearTextMain">
            <p className="yearText">반복 종료 년/월</p>
            <p className="optionalText">선택 입력</p>
          </div>
          <div className="divideFrame">
            <select className="selectBox">
              {YEAR_LIST.map((year, index) => (
                <option key={index}>{year}</option>
              ))}
            </select>
            <select className="selectBox">
              {MONTH_LIST.map((month, index) => (
                <option key={index}>{month}</option>
              ))}
            </select>
          </div>
          <div className="buttonFrame">
            <button
              className="completeButton"
              disabled={!isCompleteEnabled}
              onClick={goToIncomeExpend}
            >
              완료
            </button>
          </div>
        </Modal>
      </div>
      <div className="dashboardContainer">
        <div className="graphMain">
          <div className="graphBarChart">
            <p className="yearText">1년 수입/지출 비교</p>
            {yearlyData && <GraphBarChart data={yearlyData} />}
          </div>
          <div className="graphCirculChart" onClick={goToTable}>
            <p className="monthText">월별-카테고리별 현황(%)</p>
            {monthlyData && <GraphCircularChart data={monthlyData} />}
          </div>
        </div>
        <div className="graphPersonal">
          {[1, 2, 3, 4].map((item, index) => (
            <div className="graphPersonalChart" key={index} onClick={goToTable}>
              <p className="personalText">개인별 사용현황(%)</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Main;

const DIVIDE_LIST = ['Select an Option', '수입', '지출'];
const CATEGORY_LIST = ['Select an Option', '생활비', '식비', '고정비', '기타'];
const YEAR_LIST = Array.from({ length: 20 }, (_, i) => `${i + 2020}년`);
const MONTH_LIST = Array.from({ length: 12 }, (_, i) => `${i + 1}월`);
const INITIAL_INPUT_VALUES = {
  divide: '', // 구분
  category: '', // 카테고리
  year: '', // 년(일자)
  month: '', // 월(일자)
  day: '', // 일(일자)
  price: '', // 금액
  memo: '', // 메모
};
