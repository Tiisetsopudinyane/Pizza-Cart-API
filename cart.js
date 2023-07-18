document.addEventListener("alpine:init", () => {
  Alpine.data('pizzaCart', () => {
      return {
          title: 'Pizza Cart API',
          pizzas: [],
          username: 'tiisetsopudinyane',
          cartId: 'ULvJhRJ775',
          cartPizzas: [],
          cartData: [],
          cartTotal: 0.00,
          paymentAmount: 0,
          message:'',
          pizza: '',
          image:'',
          login() {
            if (this.username.length > 2) {
                localStorage['username'] = this.username;
                this.createCart();
            } else {
                alert('username is too short');
            }
        },
        logout() {
            if (confirm('Do you want to logout?')) {
                this.username = '';
                this.cartId = '';
                localStorage['cartId'] = '';
                localStorage['username'] = '';
            }},
          getCart() {
              const getCarturl = `https://pizza-api.projectcodex.net/api/pizza-cart/${this.cartId}/get`
              return axios.get(getCarturl);

          },
          addPizza(PizzaId) {

              return axios.post('https://pizza-api.projectcodex.net/api/pizza-cart/add', {
                  "cart_code": this.cartId,
                  "pizza_id": PizzaId,
                   
              });
          },
          removePizza(PizzaId) {

              return axios.post('https://pizza-api.projectcodex.net/api/pizza-cart/remove', {
                  "cart_code": this.cartId,
                  "pizza_id": PizzaId

              });
          },
          pay(amount) {
              return axios.post('https://pizza-api.projectcodex.net/api/pizza-cart/pay',

                  {
                      "cart_code": this.cartId,
                      "amount": amount
                  });
          },
          showCartData() {
              this.getCart().then(result => {
                  this.cartData = result.data.pizzas;
                  // console.log(this.cartData)


                  const cartData = result.data
                  this.cartPizzas = cartData.pizzas;
                  this.cartTotal = cartData.total.toFixed(2);
                  // alert(this.cartTotal);

              });

          },

          init() {
              axios
                  .get('https://pizza-api.projectcodex.net/api/pizzas')
                  .then(result => {
                      this.pizzas = result.data.pizzas;
                  });

              this.showCartData();
          },
          addPizzaToCart(PizzaId) {
              // alert(PizzaId)
              this.addPizza(PizzaId)
                  .then(() => {
                      this.showCartData();
                  });
          },
          removePizzaFromCart(PizzaId) {
              // alert(PizzaId)
              this.removePizza(PizzaId)
                  .then(() => {
                      this.showCartData();
                  });

          },
          createCart() {
            if (!this.username) {
                //this.cartId = 'No username to create cart for'
                return;
            }
            const cartId = localStorage['cartId'];
            if (cartId) {
                this.cartId = cartId;
            } else {
                const createCartURL = `https://pizza-api.projectcodex.net/api/pizza-cart/create?username=${this.username}`
                return axios.get(createCartURL)
                    .then(result => {
                        this.cartId = result.data.cart_code;
                        localStorage['cartId'] = this.cartId;
                    })
            }
        },
          payForCart() {
            // alert("Pay now : "+ this.paymentAmount)
            this
            .pay(this.paymentAmount)
            .then(result => {
                if ( result.data.status == 'failure') {
                    this.message = result.data.message;
                    setTimeout(() => this.message= '', 3000);
                } 
                else if(this.cartPizzas.length===0){
                    this.message='you cant make purchase with an empty cart';
                    setTimeout(() => {
                        this.message='';
                        }, 3000);
                }
                else {
                this.message = 'Payment Received, Enjoy!';

                setTimeout(() => {
                this.message = '';
                this.cartPizzas = [];
                this.cartTotal = 0.00
                this.cartId = ''
                // this.createCart();
                this.paymentAmount = 0.00
                }, 3000);

                }
        });},
          
          images(pizza){
            return `images/${pizza.size}.png`;
          },
          toFixd(amount){
            return amount.toFixed(2);
          }

      }
  });

});