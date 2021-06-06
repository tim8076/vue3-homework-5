
export default {
    template: "#signIn",
    data(){
        return{
            api: 'https://vue3-course-api.hexschool.io/',
            username: '',
            password: '',
            isLoading: false
        }
    },
    methods: {
        signIn(e){
            this.isLoading = true;
            e.preventDefault();
            let signinData = {
                username: this.username,
                password: this.password
            }
            axios.post(`${this.api}admin/signin`,signinData)
                .then(res =>{
                    if (res.data.success){
                        const { token, expired } = res.data;
                        document.cookie = `timToken=${token}; expires=${expired}`;
                        this.$router.push('/dashBoard');
                    }else{
                        alert('帳號或密碼錯誤');
                    }
                    this.username = '';
                    this.password = '';
                    this.isLoading = false;
                })
                .catch(err=>{
                    console.dir(err);
                    this.isLoading = false;
                })
        }
    },
}
