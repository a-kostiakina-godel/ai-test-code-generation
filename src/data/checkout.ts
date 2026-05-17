export type CustomerInfo = {
  firstName: string;
  lastName: string;
  postalCode: string;
};

export function defaultCustomer(): CustomerInfo {
  return { firstName: 'Test', lastName: 'User', postalCode: '10001' };
}

export const CheckoutExpectations = {
  completionHeader: 'Thank you for your order!',
  emptyFirstNameError: 'First Name is required',
};
