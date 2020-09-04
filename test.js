var value = "Esto podria ser un post con #Testing #otroht #masht";

var regex = /[#]+([A-Za-z0-9-_]+)/gi;

var match = value.match(regex);

console.log(match);

if(match)
    console.log('Ok');
else
    console.log('no ok');