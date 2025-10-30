const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.post('/register', async (req,res)=>{
  try{
    const {email,password} = req.body;
    if(!email || !password) return res.status(400).json({msg:'Provide email and password'});
    let user = await User.findOne({email});
    if(user) return res.status(400).json({msg:'User already registered'});
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    user = new User({email, password: hash});
    await user.save();
    res.json({msg:'Registered'});
  }catch(e){ console.error(e); res.status(500).json({msg:'Server error'}); }
});

router.post('/login', async (req,res)=>{
  try{
    const {email,password} = req.body;
    const user = await User.findOne({email});
    if(!user) return res.status(400).json({msg:'Invalid credentials'});
    const ok = await bcrypt.compare(password, user.password);
    if(!ok) return res.status(400).json({msg:'Invalid credentials'});
    const token = jwt.sign({id:user._id}, process.env.JWT_SECRET || 'secret', {expiresIn:'6h'});
    res.json({token});
  }catch(e){ console.error(e); res.status(500).json({msg:'Server error'}); }
});

module.exports = router;