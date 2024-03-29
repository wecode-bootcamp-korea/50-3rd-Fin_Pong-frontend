import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { splitDate } from '../../../utils/convert';
import CalenderInput from './CalenderInput';
import CompleteBtn from './CompleteBtn';
import API from '../../../config';
import './BudgetModal.scss';

const BudgetModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [settingInfo, setSettingInfo] = useState({
    date: new Date(),
    budget: '',
  });

  const TOKEN = localStorage.getItem('TOKEN');
  const { year, month, date } = splitDate(new Date(settingInfo.date));

  const handleInfo = (name, value) => {
    setSettingInfo({ ...settingInfo, [name]: value });
  };

  const handleClick = () => {
    fetch(API.Budget, {
      method: 'post',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify({
        year: year,
        month: month,
        date: date,
        budget: settingInfo.budget,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === 'POST_SUCCESS') {
          alert(' 내역 등록이 완료되었습니다! ');
          navigate('/setting');
        } else alert('빈칸없이 작성해주세요! ');
      });
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('click', handleBackdropClick);
    };
  }, [isOpen, onClose]);

  const handleKeyDown = (e) => {
    if (e && e.key === 'Escape') {
      onClose();
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target.classList.contains('backDrop')) {
      onClose();
    }
  };

  return (
    <div className="budgetModal">
      <div className={`${isOpen ? 'backDrop' : ''}`} />
      <div className={`modal ${isOpen ? 'open' : ''}`}>
        <div className="budgetInfo">
          <h2 className="budgetContentName">🗓️ 예산 등록</h2>
          <div className="budgetContentList">
            <CalenderInput
              text="일자"
              handleDateChange={(date) => handleInfo('date', date)}
              date={settingInfo.date}
            />
            <div className="budget">
              <label className="budgetName">금액</label>
              <input
                className="budgetInput"
                type="text"
                onChange={(e) => handleInfo('budget', e.target.value)}
                value={settingInfo.budget}
              />
            </div>
          </div>
          <div className="btn">
            <CompleteBtn
              className="completeBtnContainer"
              onClick={handleClick}
            />
            <button className="closeBtn" onClick={onClose}>
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default BudgetModal;
