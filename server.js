// import express from 'express';
// import http from 'http';
const express = require('express');
const MongoClient = require('mongodb').MongoClient,
	assert = require('assert');
// const http = require('http');
const app = express();
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
// const url = 'mongodb://localhost:27017/myproject';
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

app.get('/', function(req, res) {
	res.send('Hello World!');
});

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

//连接数据库
MongoClient.connect(url, function(err, db) {
	assert.equal(null, err);
	console.log("Connected correctly to server");
	state.db = db;
	// db.close();
});

app.listen(3000);