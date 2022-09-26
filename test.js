const orderData = {
  name: 'XXXXXXXXx',
  quantity: 2,
  price: 1000,
};

let order = {
  amount: orderData.quantity * orderData.price,
  currency: 'TWD',
  packages: [
    {
      id: 'products_1',
      amount: orderData.quantity * orderData.price,
      products: [
        {
          name: orderData.name,
          quantity: orderData.quantity,
          price: orderData.price,
        },
      ],
    },
  ],
};
const requestData = order;

await axios.post(`${BACKEND_URL}`, order);
