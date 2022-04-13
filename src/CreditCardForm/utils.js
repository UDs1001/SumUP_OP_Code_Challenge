const handleCardInputSplits = (formatInput) => {
    const formattedInput = formatInput.reduce((acc, inputChar, inputIndex) => {
        let formatInputChar = inputChar;
        if ((inputIndex + 1) % 4 === 0) {
            formatInputChar = formatInputChar + '  ';
        }
        acc.push(formatInputChar);
        return acc;
    }, []);
    return formattedInput.join('');
}

const filterNumbersOnly = (stringValue) => stringValue.replace(/\D/g, '');

const checkValidity = (cardNumber) => {
    let result = 0;
    let flag = 0;
    for (let i = cardNumber.length - 1; i >= 0; i--) {
        flag = flag + 1;
        if (flag % 2 === 0) {
            let doubleNum = cardNumber[i] * 2
            if (doubleNum > 9) {
                const doubleNumArr = doubleNum.toString().split('');
                result = result + Number(doubleNumArr[0]) + Number(doubleNumArr[1]);
            } else {
                result = result + doubleNum;
            }
        } else {
            result = result + Number(cardNumber[i]);
        }
    }
    return result % 10 === 0;
}

const checkCardLength = (lengthValues, cardNumberLength) => {
    let lengthFlag = false;
    if (lengthValues.includes(',')) {
        let lengthValuesArray = lengthValues.split(',');
        lengthValuesArray.forEach((lengthVal) => {
            if (!lengthFlag) {
                if (Number(lengthVal) === Number(cardNumberLength)) {
                    lengthFlag = true;
                }
            }
        })
    } else if (lengthValues.includes('-')) {
        let charIndexBetween = lengthValues.indexOf('-');
        let lengthStart = lengthValues.slice(0, charIndexBetween).trim();
        let lengthEnd = lengthValues.slice(charIndexBetween + 1, lengthValues.length).trim();
        if (Number(cardNumberLength) >= Number(lengthStart) && Number(cardNumberLength) <= Number(lengthEnd)) {
            lengthFlag = true;
        }
    } else {
        lengthFlag = Number(cardNumberLength) === Number(lengthValues);
    }
    return lengthFlag;
}

const checkRangesWithin = (rangeValues, cardNumber) => {
    let rangeBetweenCharIndex = rangeValues.indexOf('-');
    let rangeStart = rangeValues.slice(0, rangeBetweenCharIndex).trim();
    let rangeEnd = rangeValues.slice(rangeBetweenCharIndex + 1, rangeValues.length).trim();
    let cardNumberRange = cardNumber.slice(0, rangeStart.length).trim();
    let rangesBool = Number(cardNumberRange) >= Number(rangeStart) && Number(cardNumberRange) <= Number(rangeEnd);
    return rangesBool;
}

const checkCardScheme = (cardNumber, data) => {
    let isRange = false;
    let isLength = false;
    let iconUrl = null;
    let noMoreRangeCheck = false;
    let lengthToBeChecked = null;

    if (data && data.length) {
        data.forEach((val) => {
            if (!isRange && val?.ranges && val?.length) {
                if (val.ranges.includes(',') && val.ranges.includes('-')) {
                    let rangesArray = val.ranges.split(',');
                    rangesArray.forEach((rangeVal) => {
                        if (!noMoreRangeCheck) {
                            isRange = checkRangesWithin(rangeVal, cardNumber);
                            if (isRange) {
                              noMoreRangeCheck = true;
                              lengthToBeChecked = val.length;
                              iconUrl = val?.icon;
                            }
                        }
                    })
                } else if (val.ranges.includes(',')) {
                    let rangesArray = val.ranges.split(',');
                    rangesArray.forEach((rangeVal) => {
                        if (!noMoreRangeCheck) {
                            let cardNumberRange = cardNumber.slice(0, rangeVal.length).trim();
                            if (Number(cardNumberRange) === Number(rangeVal)) {
                                isRange = true;
                                noMoreRangeCheck = true;
                                lengthToBeChecked = val.length;
                                iconUrl = val?.icon;
                            }
                        }
                    });
                } else if (val.ranges.includes('-')) {
                    isRange = checkRangesWithin(val.ranges, cardNumber);
                    if (isRange) {
                        lengthToBeChecked = val.length;
                        iconUrl = val?.icon;
                    }
                } else {
                    let cardNumberRange = cardNumber.slice(0, val.ranges.length).trim();
                    isRange = cardNumberRange === val.ranges;
                    if (isRange) {
                        lengthToBeChecked = val.length;
                        iconUrl = val?.icon;
                    }
                }
            }
        });
    }

    if (!isRange) {
        return {
            saveEnabled: false,
            cardIcon: null
        };
    } else {
        isLength = checkCardLength(lengthToBeChecked, cardNumber.length);
    }

    return {
        saveEnabled: isRange && isLength,
        cardIcon: iconUrl
    };
}

const changeInputEndValues = (input, creditNumber) => {
    if (input && creditNumber && input > creditNumber) {
      let slicedInput = input.slice(0, input.length - 1);
      if (slicedInput !== creditNumber) {
        return false;
      }
    }
    if (input && creditNumber && input < creditNumber) {
      let slicedCardInput = creditNumber.slice(0, creditNumber.length - 1);
      if (slicedCardInput !== input) {
        return false;
      }
    }
    return true;
  }

export {
    handleCardInputSplits,
    filterNumbersOnly,
    checkValidity,
    checkCardScheme,
    changeInputEndValues
}