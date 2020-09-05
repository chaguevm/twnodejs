var value = "Esto podria ser un post con #Testing #otroht #masht";
var regex = /[#]+([A-Za-z0-9-_]+)/gi;
var match = value.match(regex);

match.forEach(ht => {
    const nht = `<a href='#'>${ht}</a>`;
    value = value.replace(ht, nht);
});
console.log(value);
