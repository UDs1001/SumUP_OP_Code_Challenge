import { render, screen, fireEvent } from '@testing-library/react';
import CreditCardFormPresentational from './CreditCardFormPresentational';
import userEvent from "@testing-library/user-event";
import { MAX_LENGTH_ERROR_MESSAGE, SERVER_ERROR_MESSAGE } from '../enums'; 

test('calling render with initial props', async () => {
    render(<CreditCardFormPresentational isSaveEnabled={false} cardIcon={null}/>)
    expect(screen.getByTestId('card-input-label')).toHaveClass('Card-Number-Label');
    expect(screen.getByTestId('card-input')).toHaveClass('Card-Number-Input');
    expect(screen.getByAltText('Icon Unavailable')).toHaveAttribute('src', `${process.env.PUBLIC_URL}/resources/img/card-unknown.svg`);
    expect(screen.getByTestId('save-card-button')).toHaveClass('Save-Button');
    expect(screen.getByText('SAVE CREDIT CARD')).toHaveClass('Save-Button-Text');
});

test('Server error message true', async () => {
    render(<CreditCardFormPresentational isError={true}/>)
    const serverError = screen.queryByText(SERVER_ERROR_MESSAGE);
    expect(serverError).toBeInTheDocument();
});

test('Server error message false', async () => {
    render(<CreditCardFormPresentational isError={false}/>)
    const serverError = screen.queryByText(SERVER_ERROR_MESSAGE);
    expect(serverError).not.toBeInTheDocument();
});

test('Input change for non digit values', async () => {
    render(<CreditCardFormPresentational isSaveEnabled={false} handleCardInput={() => {}} />)
    fireEvent.change(screen.getByTestId('card-input'), {
      target: {value: 'abc!e~:;'}
    });
    expect(screen.getByTestId('card-input')).toHaveAttribute('value', '');
});

test('Input change for digit values and icon invalid', async () => {
    render(<CreditCardFormPresentational isSaveEnabled={false} handleCardInput={() => {}} cardIcon={null}/>)
    fireEvent.change(screen.getByTestId('card-input'), {
      target: {value: '1213'}
    });
    expect(screen.getByTestId('card-input-label')).toHaveClass('Card-Number-Label Card-Number-Label-Filled');
    expect(screen.getByTestId('card-input')).toHaveClass('Card-Number-Input Card-Number-Input-Filled');
    expect(screen.getByTestId('card-input')).toHaveAttribute('value', '1213');
    expect(screen.getByAltText('Icon Unavailable')).toHaveAttribute('src', `${process.env.PUBLIC_URL}/resources/img/card-invalid.svg`);
});

test('Input change for 15 digit values of valid card and icon available and save enabled', async () => {
    render(<CreditCardFormPresentational isSaveEnabled={true} handleCardInput={() => {}} cardIcon={'/validPath'}/>)
    fireEvent.change(screen.getByTestId('card-input'), {
      target: {value: '121312442344567'}
    });
    expect(screen.getByTestId('card-input')).toHaveAttribute('value', '1213  1244  2344  567');
    expect(screen.getByAltText('Icon Unavailable')).toHaveAttribute('src', '/validPath');
    expect(screen.getByTestId('save-card-button')).toHaveClass('Save-Button Save-Button-Enabled');
    expect(screen.getByText('SAVE CREDIT CARD')).toHaveClass('Save-Button-Text Save-Button-Text-Enabled');
});


describe ('Test Suite for Input Changes', () => {
    beforeEach(() => render(<CreditCardFormPresentational handleCardInput={() => {}} />));

    test('Input change for more than max digits allowed', async () => {
        fireEvent.change(screen.getByTestId('card-input'), {
          target: {value: '123456789012345678901234567890'}
        });
        expect(screen.getByTestId('card-input')).toHaveAttribute('value', '');
    });
    
    test('Input change till max digits allowed', async () => {
        fireEvent.change(screen.getByTestId('card-input'), {
          target: {value: '12345678901234567890'}
        });
        expect(screen.getByTestId('card-input')).toHaveAttribute('value', '1234  5678  9012  3456  7890');
        const maxLengthError = screen.queryByText(MAX_LENGTH_ERROR_MESSAGE);
        expect(maxLengthError).not.toBeInTheDocument();
    });

    test('Input change exceeded max digits allowed', async () => {
        fireEvent.change(screen.getByTestId('card-input'), {
          target: {value: '123456789012345678901234567890'}
        });
        expect(screen.getByTestId('card-input')).toHaveAttribute('value', '');
        const maxLengthError = screen.queryByText(MAX_LENGTH_ERROR_MESSAGE);
        expect(maxLengthError).toBeInTheDocument();
    });
    
    test('test function changeInputEndValues with pasting values', async () => {
        fireEvent.change(screen.getByTestId('card-input'), {
          target: {value: '12345678'}
        });
        fireEvent.change(screen.getByTestId('card-input'), {
          target: {value: '1234568'}
        });
        expect(screen.getByTestId('card-input')).toHaveAttribute('value', '1234  5678');
        const maxLengthError = screen.queryByText(MAX_LENGTH_ERROR_MESSAGE);
        expect(maxLengthError).not.toBeInTheDocument();
    });
    
    test('calling render test function changeInputEndValues with modifications', async () => {
        const cardInput = screen.getByTestId("card-input");
        userEvent.type(cardInput, "123456789");
        expect(screen.getByTestId('card-input')).toHaveAttribute('value', '1234  5678  9');
        cardInput.setSelectionRange(13, 13);
        userEvent.type(cardInput, '{backspace}')
        expect(screen.getByTestId('card-input')).toHaveAttribute('value', '1234  5678');
        cardInput.setSelectionRange(1, 3);
        userEvent.type(cardInput, '{backspace}')
        expect(screen.getByTestId('card-input')).toHaveAttribute('value', '1234  5678');
        const maxLengthError = screen.queryByText(MAX_LENGTH_ERROR_MESSAGE);
        expect(maxLengthError).not.toBeInTheDocument();
    });
});