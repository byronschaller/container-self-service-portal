const express = require('express');
const bodyParser = require('body-parser');
var request = require('request');
var fs = require('fs');


const app = express();


app.use(bodyParser.urlencoded({extended: true}))

app.set('view engine', 'ejs')


app.listen(3000, () => {
	console.log('listening on 3000')
})


app.get('/', (req, res) => {

request('http://localhost:8080/api/storage/test-repo', function (error, response, body) {
		console.log('error:', error);
		console.log('statusCode:', response && response.StatusCode);
		console.log('body:', body);
		var ret = JSON.parse(body)
		var uriArray = []
		//foreach(ret.children)
		//console.log('ret:', ret.children)
		Object.keys(ret.children).forEach(function(key){
			Object.keys(ret.children[key]).forEach(function(key1){
				if (key1 == "uri") {
					uriArray.push(ret.children[key][key1])
				}
				console.log(key1 + '=' + ret.children[key][key1]);
		 });
		});
				console.log(uriArray)
				res.render('index.ejs', {
					packages: uriArray
				})
	})



		//res.sendFile(__dirname + '/index.html')
	})

app.get('/confirmed', (req, res) => {
			res.sendFile(__dirname + '/confirmed.html')
		})

app.get('/download', (req, res) => {
        var file = __dirname + '/Dockerfile';
				res.download(file);

			})

app.post('/buildrequest', (req, res) => {

console.log(req.body.img)

var sub2json = '{"buildType": {"id": "BuildDockerImageViaApi_CloneBuildDeploy"}, "properties": {"property": [{"name": "env.cpu", "value": "' + req.body.cpu + '"}], "property": [{"name": "env.ram", "value":"' +  req.body.ram + '"}], "property": [{"name": "env.vol", "value":"' + req.body.vol + '"}], "property": [{"name": "env.img", "value":"' + req.body.img + '"}], "property": [{"name": "env.git", "value":"' + req.body.gitrepo + '"}]}}'

console.log(sub2json)

request.post({
	headers: {'content-type' : 'application/json'},
	url:     'http://admin:admin@localhost:8111/app/rest/buildQueue',
  json:    true,
	body:    JSON.parse(sub2json)

	}, function(error, response, body){
    console.log(error);
		console.log(body);
})

console.log(req.body)

res.redirect('/')

})

app.post('/createdockerfile', (req, res) => {
	console.log(req.body);
	console.log(req.body.cmd_check);


	var stream = fs.createWriteStream("Dockerfile");
	stream.once('open', function(fd){
		stream.write("MAINTAINER docker_file_builder_app\n");
		stream.write("FROM " + req.body.base_image + "\n");
		stream.write("ENTRYPOINT " + req.body.entrypoint + "\n")
		stream.end();
	});


	res.redirect('/download')
})
