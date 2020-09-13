const app = new Vue({
    el: '#app',
    data: {
        users: null  
    },
    mounted () {
        axios
          .get('http://localhost:3000/recomendedusers')
          .then(response => (this.users = response.data))
    }
});