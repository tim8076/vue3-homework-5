
import pagination from '../component/pagination.js';
import modal from '../component/modal.js';

export default {
    template: '#dashBoard',
    data() {
        return {
            api: 'https://vue3-course-api.hexschool.io/',
            path: 'tim8076',
            products: [],
            tempProduct: {},
            isNew: false,
            isLoading: false,
            pagination: {},
        }
    },
    components:{
        pagination,
        modal
    },
    methods:{
        openModal(isNew, item) {
            if (isNew) {
                this.tempProduct = {};
                this.isNew = true;
            } else {
                this.tempProduct = { ...item };
                this.isNew = false;
            } 
            this.$refs.productModal.openModal();
        },
        getProductList(page = 1){
            this.isLoading = true;
            axios.get(`${this.api}api/${this.path}/admin/products?page=${page}`)
                .then(res => {
                    console.log(res);
                    if(res.data.success){
                        const { products, pagination } = res.data;
                        this.products = products;
                        this.pagination = pagination;
                        this.isLoading = false;
                    }else{
                        alert(res.data.message);
                        this.isLoading = false;
                    }
                })         
        },
        updateProduct(tempProduct){
            this.isLoading = true;
            let api = `${this.api}api/${this.path}/admin/product`;
            let httpMethod = 'post';
            if(!this.isNew){
                api = `${this.api}api/${this.path}/admin/product/${this.tempProduct.id}`;
                httpMethod = 'put';
            }
            axios[httpMethod](api, { data: tempProduct })
                .then(res => {
                    if (res.data.success) {
                        this.$refs.productModal.hideModal();
                        this.getProductList();
                        this.isLoading = false;
                    }else{
                        alert(res.data.message);
                        this.isLoading = false;
                    }
                })
        },
        deleteProduct(product){
            if(confirm(`確認刪除 ${product.title} ?`)){
                this.isLoading = true;
                axios.delete(`${this.api}api/${this.path}/admin/product/${product.id}`)
                    .then(res => {
                        if (res.data.success) {
                            this.getProductList();
                        }else {
                            alert(res.data.message);
                        }
                    })
            }
            this.isLoading = false;
        },
        uploadImage(formData){
            this.isLoading = true;
            axios.post(`${this.api}api/${this.path}/admin/upload`,formData)
                .then(res =>{
                    if(res.data.success){
                        this.tempProduct.imageUrl = res.data.imageUrl;
                        this.isLoading = false;
                    }else{
                        alert(res.data.message);
                        this.isLoading = false;
                    }
                })
        }
    },
    mounted(){
        const token = document.cookie
            .split('; ')
            .find(row => row.startsWith('timToken='))
            .split('=')[1];
        axios.defaults.headers.common['Authorization'] = token;
        this.getProductList();
    }
}

