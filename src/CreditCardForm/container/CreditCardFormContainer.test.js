import { act, render, screen, fireEvent } from '@testing-library/react';
import CreditCardFormContainer from './CreditCardFormContainer';
import userEvent from "@testing-library/user-event";
import { SERVER_ERROR_MESSAGE } from '../enums';
import { cardSchemesApi } from '../api';

jest.mock('../api');

describe('All Credit Cards ', () => {
    beforeEach(async () => {
        const mockResponse = {
            "type": "dictionary-card-schemes",
            "data": [
                {
                    "id": "amex",
                    "name": "American Express",
                    "ranges": "34,37",
                    "length": "15",
                    "icon": "https://sumup-op-hiring-test.s3.eu-west-1.amazonaws.com/resources/amex.svg"
                },
                {
                    "id": "jcb",
                    "name": "JCB",
                    "ranges": "3528-3589",
                    "length": "16-19",
                    "icon": "https://sumup-op-hiring-test.s3.eu-west-1.amazonaws.com/resources/jcb.svg"
                },
                {
                    "id": "master",
                    "name": "MasterCard",
                    "ranges": "2221-2720, 51-55",
                    "length": "16",
                    "icon": "https://sumup-op-hiring-test.s3.eu-west-1.amazonaws.com/resources/master.svg"
                },
                {
                    "id": "visa",
                    "name": "Visa",
                    "ranges": "4",
                    "length": "13,16,19",
                    "icon": "https://sumup-op-hiring-test.s3.eu-west-1.amazonaws.com/resources/visa.svg"
                }
            ]
        };
        cardSchemesApi.mockResolvedValueOnce(mockResponse);
        await act(async () =>
            render(<CreditCardFormContainer />)
        );
    });

    describe('renders CreditCardFormContainer with successful api scenarios', () => {

        test('renders CreditCardFormContainer at mount', (async () => {
            fireEvent.change(screen.getByTestId('card-input'), {
                target: { value: '3530' }
            });
            expect(screen.getByAltText('Icon Unavailable')).toHaveAttribute('src', `${process.env.PUBLIC_URL}/resources/img/card-invalid.svg`);
            expect(screen.getByTestId('save-card-button')).toHaveClass('Save-Button');
            expect(screen.getByText('SAVE CREDIT CARD')).toHaveClass('Save-Button-Text');
        }));
    });

    describe('AMERICAN EXPRESS Credit Card', () => {
        test('check valid credit card AMERICAN EXPRESS comma separated ranges and validity check passed', (async () => {
            fireEvent.change(screen.getByTestId('card-input'), {
                target: { value: '378282246310005' }
            });
            expect(screen.getByAltText('Icon Unavailable')).toHaveAttribute('src', 'https://sumup-op-hiring-test.s3.eu-west-1.amazonaws.com/resources/amex.svg');
            expect(screen.getByTestId('save-card-button')).toHaveClass('Save-Button-Enabled');
            expect(screen.getByText('SAVE CREDIT CARD')).toHaveClass('Save-Button-Text-Enabled');
        }));

        test('check valid credit card AMERICAN EXPRESS comma separated ranges and validity check and length failed', (async () => {
            const cardInput = screen.getByTestId("card-input");
            userEvent.type(cardInput, '378282246310005');
            cardInput.setSelectionRange(19, 19);
            userEvent.type(cardInput, "{backspace}9");
            expect(screen.getByAltText('Icon Unavailable')).toHaveAttribute('src', `${process.env.PUBLIC_URL}/resources/img/card-invalid.svg`);
            expect(screen.getByTestId('save-card-button')).not.toHaveClass('Save-Button-Enabled');
            expect(screen.getByText('SAVE CREDIT CARD')).not.toHaveClass('Save-Button-Text-Enabled');
        }));
    });

    describe('JCB Credit Card', () => {
        test('check valid credit card JCB and validity check passed', (async () => {
            fireEvent.change(screen.getByTestId('card-input'), {
                target: { value: '3530111333300000' }
            });
            expect(screen.getByAltText('Icon Unavailable')).toHaveAttribute('src', 'https://sumup-op-hiring-test.s3.eu-west-1.amazonaws.com/resources/jcb.svg');
            expect(screen.getByTestId('save-card-button')).toHaveClass('Save-Button-Enabled');
            expect(screen.getByText('SAVE CREDIT CARD')).toHaveClass('Save-Button-Text-Enabled');
        }));

        test('check valid credit card JCB and validity check failed and length failed ', (async () => {
            const cardInput = screen.getByTestId("card-input");
            userEvent.type(cardInput, '3530111333300000');
            cardInput.setSelectionRange(21, 22);
            userEvent.type(cardInput, "{backspace}9");
            expect(screen.getByAltText('Icon Unavailable')).toHaveAttribute('src', `${process.env.PUBLIC_URL}/resources/img/card-invalid.svg`);
            expect(screen.getByTestId('save-card-button')).not.toHaveClass('Save-Button-Enabled');
            expect(screen.getByText('SAVE CREDIT CARD')).not.toHaveClass('Save-Button-Text-Enabled');
        }));

        test('check valid credit card JCB and validity check passed ', (async () => {
            const cardInput = screen.getByTestId("card-input");
            userEvent.type(cardInput, '3530111333300000');
            cardInput.setSelectionRange(21, 22);
            userEvent.type(cardInput, "{backspace}000");
            expect(screen.getByAltText('Icon Unavailable')).toHaveAttribute('src', 'https://sumup-op-hiring-test.s3.eu-west-1.amazonaws.com/resources/jcb.svg');
            expect(screen.getByTestId('save-card-button')).toHaveClass('Save-Button-Enabled');
            expect(screen.getByText('SAVE CREDIT CARD')).toHaveClass('Save-Button-Text-Enabled');
        }));

        test('check valid credit card JCB and validity check passed input values only at end ', (async () => {
            const cardInput = screen.getByTestId("card-input");
            userEvent.type(cardInput, '3530111333300000');
            cardInput.setSelectionRange(10, 12);
            userEvent.type(cardInput, "{backspace}");
            expect(screen.getByAltText('Icon Unavailable')).toHaveAttribute('src', 'https://sumup-op-hiring-test.s3.eu-west-1.amazonaws.com/resources/jcb.svg');
            expect(screen.getByTestId('save-card-button')).toHaveClass('Save-Button-Enabled');
            expect(screen.getByText('SAVE CREDIT CARD')).toHaveClass('Save-Button-Text-Enabled');
        }));
    });

    describe('MasterCard', () => {
        test('check valid credit card Master Card and validity check passed and length passed and scheme range failed ', (async () => {
            const cardInput = screen.getByTestId("card-input");
            userEvent.type(cardInput, '5609105105105100');
            cardInput.setSelectionRange(21, 22);
            expect(screen.getByAltText('Icon Unavailable')).toHaveAttribute('src', `${process.env.PUBLIC_URL}/resources/img/card-invalid.svg`);
            expect(screen.getByTestId('save-card-button')).not.toHaveClass('Save-Button-Enabled');
            expect(screen.getByText('SAVE CREDIT CARD')).not.toHaveClass('Save-Button-Text-Enabled');
        }));

        test('check valid credit card MasterCard and validity check passed input values only at end ', (async () => {
            const cardInput = screen.getByTestId("card-input");
            userEvent.type(cardInput, '5105105105105100');
            cardInput.setSelectionRange(10, 12);
            userEvent.type(cardInput, "{backspace}");
            expect(screen.getByAltText('Icon Unavailable')).toHaveAttribute('src', 'https://sumup-op-hiring-test.s3.eu-west-1.amazonaws.com/resources/master.svg');
            expect(screen.getByTestId('save-card-button')).toHaveClass('Save-Button-Enabled');
            expect(screen.getByText('SAVE CREDIT CARD')).toHaveClass('Save-Button-Text-Enabled');
        }));
    });

    describe('VISA Credit Card', () => {
        test('check valid credit card VISA and validity check passed and length passed and scheme range failed ', (async () => {
            const cardInput = screen.getByTestId("card-input");
            userEvent.type(cardInput, '3212888888881881');
            cardInput.setSelectionRange(21, 22);
            expect(screen.getByAltText('Icon Unavailable')).toHaveAttribute('src', `${process.env.PUBLIC_URL}/resources/img/card-invalid.svg`);
            expect(screen.getByTestId('save-card-button')).not.toHaveClass('Save-Button-Enabled');
            expect(screen.getByText('SAVE CREDIT CARD')).not.toHaveClass('Save-Button-Text-Enabled');
        }));

        test('check valid credit card VISA and validity check passed input values only at end ', (async () => {
            const cardInput = screen.getByTestId("card-input");
            userEvent.type(cardInput, '4012888888881881');
            cardInput.setSelectionRange(10, 12);
            userEvent.type(cardInput, "{backspace}");
            expect(screen.getByAltText('Icon Unavailable')).toHaveAttribute('src', 'https://sumup-op-hiring-test.s3.eu-west-1.amazonaws.com/resources/visa.svg');
            expect(screen.getByTestId('save-card-button')).toHaveClass('Save-Button-Enabled');
            expect(screen.getByText('SAVE CREDIT CARD')).toHaveClass('Save-Button-Text-Enabled');
        }));
    });
})

test('renders CreditCardFormContainer at mount with server error', (async () => {
    cardSchemesApi.mockRejectedValueOnce(new Error('Async error'));
    await act(async () =>
        render(<CreditCardFormContainer />)
    );
    const serverError = screen.queryByText(SERVER_ERROR_MESSAGE);
    expect(serverError).toBeInTheDocument();
    expect(screen.getByAltText('Icon Unavailable')).toHaveAttribute('src', `${process.env.PUBLIC_URL}/resources/img/card-unknown.svg`);
    expect(screen.getByTestId('save-card-button')).not.toHaveClass('Save-Button-Enabled');
    expect(screen.getByText('SAVE CREDIT CARD')).not.toHaveClass('Save-Button-Text-Enabled');
}));

