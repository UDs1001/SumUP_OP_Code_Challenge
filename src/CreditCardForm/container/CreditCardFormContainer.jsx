import { useState, useEffect } from 'react';
import CreditCardFormPresentational from '../presentational/CreditCardFormPresentational';
import { checkValidity, checkCardScheme } from '../utils';
import { cardSchemesApi } from '../api';

const CreditCardFormContainer = () => {
  const [isSaveCardEnabled, setSaveCardEnabled] = useState(false);
  const [iconPath, setIconPath] = useState(null);
  const [schemeData, setSchemeData] = useState(null);
  const [isError, setError] = useState(false);

  useEffect(() => {
    const requestId = Math.floor(Math.random()*(9223372036854775807-1+1)+1);
    const url = `https://sumup-op-hiring-test.s3.eu-west-1.amazonaws.com/api-mock/cards-dictionary.json?request_id=${requestId}`;
    cardSchemesApi(url, {}, 3).then(res => {
      setSchemeData(res.data);
      setError(false)
    })
    .catch(() => setError(true))
  }, [])

  const handleState = (validCard, cardSaveEnabled, cardIconAvailable) => {
    if (isError && validCard) {
      setSaveCardEnabled(validCard);
      setIconPath(null);
    } else if (validCard && cardSaveEnabled){
      setSaveCardEnabled(cardSaveEnabled);
      setIconPath(cardIconAvailable);
    } else {
      setSaveCardEnabled(false);
      setIconPath(null);
    }
  }

  const handleCardInput = (inputVal) => {
    const inputCardNumber = inputVal.replaceAll('  ', '');
    const isValid = checkValidity(inputCardNumber);
    const { saveEnabled, cardIcon } = checkCardScheme(inputCardNumber, schemeData);
    handleState(isValid, saveEnabled, cardIcon);
  }
  return (
    <>
      <CreditCardFormPresentational
        isSaveEnabled={isSaveCardEnabled}
        handleCardInput={handleCardInput}
        cardIcon={iconPath}
        isError={isError}
      />
    </>
  )
};

export default CreditCardFormContainer;