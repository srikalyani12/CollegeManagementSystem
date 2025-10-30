const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const jwt = require('jsonwebtoken');

// simple middleware
function auth(req,res,next){
  const token = req.header('Authorization')?.split(' ')[1];
  if(!token) return res.status(401).json({msg:'No token'});
  try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = decoded;
    next();
  }catch(e){ return res.status(401).json({msg:'Invalid token'}); }
}

router.get('/', auth, async (req,res)=>{
  const list = await Student.find().limit(100);
  res.json(list);
});

router.post('/', auth, async (req,res)=>{
  const s = new Student(req.body);
  await s.save();
  res.json(s);
});

module.exports = router;