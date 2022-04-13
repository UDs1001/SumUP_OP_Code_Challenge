import { useState } from 'react';
import { 
  CARD_NUMBER,
  CARD_NUMBER_PLACEHOLDER,
  SAVE_CREDIT_CARD,
  MAX_LENGTH_ERROR_MESSAGE,
  SERVER_ERROR_MESSAGE,
} from '../enums';
import { filterNumbersOnly, handleCardInputSplits, changeInputEndValues } from '../utils';
import '../index.css';

const CreditCardFormPresentational = ({ 
  isSaveEnabled,
  handleCardInput,
  cardIcon,
  isError,
}) => {
  const [cardNumberInput, setCardNumberInput] = useState('');
  const [maxLengthError, setMaxLengthError] = useState(false);

  const checkMaxLength = (maxLength) => {
    if (maxLength.length > 20) {
      setMaxLengthError(true);
      return true;
    }
    if (maxLength.length <= 20 && maxLengthError) {
      setMaxLengthError(false);
    }
    return false;
  }

  const handleChange = (e) => {
    const isChangeRequired = changeInputEndValues(e.target.value, cardNumberInput);
    if (!isChangeRequired) {
      return;
    }
    let formattedCardNumber = filterNumbersOnly(e.target.value);
    const maxLengthCheck = checkMaxLength(formattedCardNumber);
    if (maxLengthCheck) {
      return;
    }
    formattedCardNumber = handleCardInputSplits(formattedCardNumber.split('')).trim(); 
    setCardNumberInput(formattedCardNumber);
    handleCardInput(formattedCardNumber);
  }

  const getCardImgSrc = () => {
    let cardImgSrc = null;
    if (cardNumberInput) {
      if (cardIcon) {
        cardImgSrc = cardIcon;
      } else {
        cardImgSrc = `${process.env.PUBLIC_URL}/resources/img/card-invalid.svg`
      }
    } else {
      cardImgSrc = `${process.env.PUBLIC_URL}/resources/img/card-unknown.svg`;
    }
    return cardImgSrc;
  }

  return (
    <div className='Form-Wrapper'>
      <label
        data-testid='card-input-label'
        className={`Card-Number-Label${cardNumberInput ? ' Card-Number-Label-Filled' : ''}`}
        htmlFor='card-number-input'
      >
        {CARD_NUMBER}
      </label>
      <div className='Input-Wrapper'>
        <img 
          src={getCardImgSrc()} 
          className='Icon-Image'
          alt='Icon Unavailable'
        />
        <input
          data-testid='card-input'
          className={`Card-Number-Input${cardNumberInput ? ' Card-Number-Input-Filled' : ''}`}
          name='card-number-input'
          value={cardNumberInput}
          onChange={handleChange}
          placeholder={CARD_NUMBER_PLACEHOLDER}
        />
        {maxLengthError ? 
          <div data-testid='max-length-error' className='Error-Message'>{MAX_LENGTH_ERROR_MESSAGE}</div>
          : ''
        }
        {isError ? 
          <div data-testid='server-error' className='Error-Message'>{SERVER_ERROR_MESSAGE}</div>
          : ''
        }
      </div>
      <button data-testid='save-card-button' className={`Save-Button ${isSaveEnabled ? ' Save-Button-Enabled' : ''}`}> 
        <div
          className={`Save-Button-Text ${isSaveEnabled ? ' Save-Button-Text-Enabled' : ''}`}
        >
          {SAVE_CREDIT_CARD}
        </div>
      </button>
    </div>
  )
}

export default CreditCardFormPresentational;