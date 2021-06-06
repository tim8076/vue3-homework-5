

export default {
    template: '#modalComponent',
    props: {
        tempProduct: {
            type: Object,
            required: true
        },
        isNew: {
            type: Boolean,
            required: true
        }
    },
    emits: ['update-product', 'upload-img'],
    data(){
        return {
            modal: ''
        }
    },
    computed: {
        modalTitle() {
            return this.isNew ? '新增產品' : '編輯產品'
        }
    },
    methods: {
        openModal(){
            this.modal.show();
        },
        hideModal(){
            this.modal.hide();
        },
        updateProduct() {
            this.$emit('update-product', this.tempProduct);
        },
        uploadImage(e) {
            const file = e.target.files[0];
            const formData = new FormData();
            formData.append('file-to-upload', file);
            this.$emit('upload-img', formData);
        },
        addToCart(id){
            this.$emit('add-cart', id)
        }
    },
    mounted(){
        this.modal = new bootstrap.Modal(this.$refs.modal);
    }
}