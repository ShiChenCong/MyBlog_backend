const express = require('express');
const MongoClient = require('mongodb').MongoClient,
	assert = require('assert');
const app = express();
const  path = require('path');
const url = `mongodb://127.0.0.1:27017/blog`; //test 是数据库名称
const state = {
	db: null
}
var options = {
	server: {
		auto_reconnect: true,
		poolSize: 10
	}
};
// 引入json解析中间件
const bodyParser = require('body-parser'); //为了能输出req.bodyParser
// // 添加json解析
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//设置跨域
app.all('*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
	res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
	res.header("X-Powered-By", ' 3.2.1');
	next();
});
//
// app.get('*', function (req, res) {
//     console.log('xxxxxx')
//     const indexPath = path.resolve(__dirname, '../MyBlog/index.html');
//     // console.log(indexPath)
//     res.sendFile(indexPath);
// });

//添加文章
app.post('/addArticle', (req, res) => {
	console.log(req.body); //请求body
	// res.send('Hello World'); //返回给页面
	state.db.collection('artilce').insertOne(req.body, (err, r) => { //myblog 是collection名称
		assert.equal(null, err);
		assert.equal(1, r.insertedCount);
		// console.log('插入成功')
	});
	// res.send('data');
	res.end(); //end
})

//查询全部文章
app.get('/queryAll', async (req, res) => {
	let data = await state.db.collection('artilce').find({}).toArray();
	res.send(data);
	res.end();
})


//查询标题和时间
app.get('/queryHeaderAndTime', async (req, res) => {
	//?xx=xxx 用query /xx/xx 用params
	const { collection, limit, page } = req.query;
	let data = await state.db.collection(collection).find({}, {"header":1,"time":1,"_id":-1}).limit(Number(limit)).skip(Number(page)).toArray();
	res.send(data);
	res.end();
})

//根据id查询文章
app.get('/queryById',async (req, res) => {
	const { id, collection } = req.query;
	let data = await state.db.collection(collection).findOne({_id: ObjectId(id)});
	res.send(data);
	res.end();
})

//连接数据库
MongoClient.connect(url, function(err, db) {
	assert.equal(null, err);
	console.log("Connected correctly to server");
	state.db = db;
	// db.close();
});

app.listen(3000);
