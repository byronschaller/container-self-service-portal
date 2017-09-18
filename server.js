const express = require('express');
const bodyParser = require('body-parser');
var request = require('request');
var fs = require('fs');
var toArray = require('lodash.toarray')

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
		var ret = body
		var pret = JSON.parse(ret)

		console.log('ret:', pret["children"])

		var aPret = pret["children"]

		var bPret = JSON.stringify(aPret)
		console.log('array:', bPret["uri"])

				res.render('index.ejs', {
					body: ret
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
