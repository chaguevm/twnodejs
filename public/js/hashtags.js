const ht = new Vue({
    el: '#hashtags',
    data: {
        hashtags: null
    },
    mounted () {
        axios
          .get('http://localhost:3000/hashtags')
          .then(response => (this.hashtags = response.data))
    }
});