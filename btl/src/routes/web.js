const express=require('express');
const {register,login, getData,
    putData,getCreate,deleteData,updateData,getDataById,getdelete,signUp,getNews,registerAD}=require('../controllers/homeController.js')
const{postNews,getNewestNews,getNewsById,getALLnews,updateNews,deleteNews,getdeleteNews,web,getADnews,getHomepage,GetNewsById ,searchNews,
    getSearch
} =require('../controllers/newsController.js');
const router =express.Router();
const authenticateToken = require('../middlewres/users.js')

// router.get('/',getHomepage);
router.post('/register',register);
router.post('/registerAD',registerAD);
router.post('/login',login);
router.get('/admin',getData);
router.get('/create',getCreate);
router.get('/update/:id',getDataById);
router.post('/update/:id',putData);
router.post('/delete/:id',deleteData);
router.get('/delete/:id',getdelete);
router.post('/au/login',signUp);
router.post('/news',postNews);
router.get('/d',getNewestNews);
router.get('/createNews',getNews);
router.get('/homeNews',getALLnews),
router.post('/updateNews/:id',updateNews),
router.get('/updateNews/:id',getNewsById),
router.post('/deleteNews/:id',deleteNews);
router.get('/deleteNews/:id',getdeleteNews);
router.get('/dangky',web);
router.get('/ADcreateNews',getADnews);
router.get('/',getHomepage)
router.get('/tintuc/:id',GetNewsById),
router.get('/s',getSearch),
module.exports=router;