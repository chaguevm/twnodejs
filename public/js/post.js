const tweets = new Vue({
    el: '#tweets',
    data: {
        tweets: null
    },
    mounted(){
        axios
          .get('http://localhost:3000/tweets')
          .then(response => (this.tweets = response.data.tweets))
    }
});