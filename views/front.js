
import headerComponent from '../component/header.js'
import modal from '../component/modal.js'

export default {
    template: "#front",
    data(){
        return{
            api: 'https://vue3-course-api.hexschool.io/',
            path: 'tim8076',
            products: [],
            pagination: {},
            tempProduct: {},
            carts: [],
            final_total: 0,
            order:{
                email:'',
                name:'',
                tel:'',
                address: '',
                message: ''
            },
            isLoading: false
        }
    },
    components:{
        headerComponent,
        modal,
    },
    methods: {
        openModal(product){
            this.tempProduct = { ...product };
            this.$refs.frontModal.openModal();
        },
        getProducts(page = 1){
            axios.get(`${this.api}api/${this.path}/products?page=${page}`)
                .then(res => {
                    console.log(res);
                    if (res.data.success) {
                        const { products, pagination } = res.data;
                        this.products = products;
                        this.pagination = pagination;
                    } else {
                        alert(res.data.message);
                    }
                })
        },
        addToCart(id){
            this.isLoading = true;
            axios.post(`${this.api}api/${this.path}/cart`, { 
                data: { product_id: id, qty: 1 } 
            })
            .then(res =>{
                if(res.data.success){
                    alert(res.data.message);
                    this.$refs.frontModal.hideModal();
                    this.getCart();              
                }else{
                    alert(res.data.message);
                }
                this.isLoading = false;
            })    
        },
        getCart(){
            axios.get(`${this.api}api/${this.path}/cart`)
                 .then(res => {
                    if(res.data.success){
                        this.carts = res.data.data.carts;
                        this.final_total = res.data.data.final_total;
                    }else{
                        alert(res.data.message)
                    }
                 })
        },
        deleteCartItem(id){
            this.isLoading = true;
            if (confirm('確認刪除商品?')){
                axios.delete(`${this.api}api/${this.path}/cart/${id}`)
                    .then(res => {
                        if (res.data.success) this.getCart();                        
                        alert(res.data.message);
                        this.isLoading = false;  
                    })
            }else{
                this.isLoading = false;
            }
        },
        deleteAllCartItems(){
            this.isLoading = true;
            if(confirm('刪除全部商品?')){
                axios.delete(`${this.api}api/${this.path}/carts`)
                    .then(res => {
                        if (res.data.success) this.getCart();
                        alert(res.data.message);
                        this.isLoading = false;
                    })
            }else{
                this.isLoading = false;
            }     
        },
        modifyCartItem(product){
            this.isLoading = true;
            const { id, qty } = product;
            let productId = product.product.id;
            axios.put(`${this.api}api/${this.path}/cart/${id}`, { 
                data: { product_id: productId, qty }
            })
            .then(res =>{
                if (res.data.success) this.getCart();
                alert(res.data.message);    
                this.isLoading = false;
            })
        },
        sendOder(){
            if (this.carts.length === 0) return alert('購物車沒商品，請前往選購');
            this.isLoading = true;
            axios.post(`${this.api}api/${this.path}/order`, {
                data: {
                    user: this.order,
                    message: this.order.message
                }
            })
            .then(res =>{
                if(res.data.success){
                    alert(res.data.message);
                    const order = Object.keys(this.order);
                    order.forEach(item =>{
                        this.order[item] = '';
                    })
                    this.getCart();
                    this.isLoading = false;
                }else{
                    alert(res.data.message);
                    this.isLoading = false;
                }
            })
        }
    },
    mounted(){
        this.getProducts();
        this.getCart();
    }
}