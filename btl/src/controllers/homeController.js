const Account=require('./user.js')
const {registrationSchema,loginSchema}=require('../validations/users.js');
const { render } = require('ejs');
const jwt =require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const CODE = process.env.CODE;

const registerAD = async (req, res, next) => {
    try {
        // Validate registration data using Joi schema
        const { error, value } = registrationSchema.validate(req.body, { abortEarly: false });

        if (error) {
            throw new Error(error.details.map(detail => detail.message).join('; '));
        }

        // Check if username or email already exists
        const existingAccount = await Account.findOne({ $or: [{ username: value.username }, { email: value.email }] });

        if (existingAccount) {
            if (existingAccount.username === value.username) {
                throw new Error('Tên người dùng đã tồn tại.');
            } else {
                throw new Error('Email đã tồn tại.');
            }
        }

        // Create a new account
        const newAccount = new Account({ username: value.username, password: value.password, email: value.email });
        await newAccount.save();

        // Render the 'create' view after successful registration
        return res.status(201).render('create', { successMessage: 'Đăng ký thành công.' });
    } catch (error) {
        console.error('Lỗi trong quá trình đăng ký:', error.message);
        next(error); // Forward error to Express error handling middleware
    }
};
const register = async (req, res, next) => {
    try {
        // Validate registration data using Joi schema
        const { error, value } = registrationSchema.validate(req.body, { abortEarly: false });

        if (error) {
            throw new Error(error.details.map(detail => detail.message).join('; '));
        }

        // Check if username or email already exists
        const existingAccount = await Account.findOne({ $or: [{ username: value.username }, { email: value.email }] });

        if (existingAccount) {
            if (existingAccount.username === value.username) {
                throw new Error('Tên người dùng đã tồn tại.');
            } else {
                throw new Error('Email đã tồn tại.');
            }
        }

        // Create a new account
        const newAccount = new Account({ username: value.username, password: value.password, email: value.email });
        await newAccount.save();

        // Render the 'create' view after successful registration
        return res.status(201).render('dangkydangnhap', { successMessage: 'Đăng ký thành công.' });
    } catch (error) {
        console.error('Lỗi trong quá trình đăng ký:', error.message);
        next(error); // Forward error to Express error handling middleware
    }
};

const login = async (req, res, next) => {
    const { email, password } = req.body;
  
    try {
  
        if (!email || !password) {
            throw new Error('Tên người dùng và mật khẩu là bắt buộc.');
        }
  
        
        const user = await Account.findOne({ email });
  
        
        if (!user) {
            throw new Error('Tên người dùng hoặc mật khẩu không hợp lệ.');
        }
  
        
        const isPasswordValid = await user.comparePassword(password);
  
        
        if (!isPasswordValid) {
            throw new Error('Tên người dùng hoặc mật khẩu không hợp lệ.');
        }
  
        
        res.status(200).send('Đăng nhập thành công.');
    } catch (error) {
        console.error('Lỗi trong quá trình đăng nhập:', error.message);
        next(error); 
    }
  };
const getData =async (req, res, next) => {
    try {
        // Retrieve data from the database
        const data = await Account.find();

        // Render the view with the retrieved data
        res.render('home', { listuser: data }); // Pass data as 'listuser'
    } catch (error) {
        console.error('Error retrieving data:', error);
        res.status(500).json({ message: "Internal server error" });
    }
};
const getDataById = async (req, res, next) => {
    const accountId = req.params.id; // Lấy ID từ request parameters

    try {
        // Lấy dữ liệu từ cơ sở dữ liệu dựa trên ID
        const account = await Account.findById(accountId);

        if (!account) {
            // Nếu không tìm thấy tài khoản, trả về lỗi 404
            return res.status(404).json({ message: 'Account not found' });
        }

        // Trả về dữ liệu tài khoản
        res.render('update', { account: account });
    } catch (error) {
        // Xử lý lỗi nếu có
        console.error('Error retrieving data by ID:', error);
        res.status(500).json({ message: "Internal server error" });
    }
};



const getCreate =async (req, res, next) => {
    try {
        // Retrieve data from the database
        const data = await Account.find();

        // Render the view with the retrieved data
        res.render('create', { listuser: data }); // Pass data as 'listuser'
    } catch (error) {
        console.error('Error retrieving data:', error);
        res.status(500).json({ message: "Internal server error" });
    }
};
const putData= async (req, res, next) => {
    const accountId = req.params.id; // Lấy ID từ request parameters
    const newData = req.body; // Dữ liệu mới từ request body

    try {
        // Kiểm tra xem có dữ liệu mới để cập nhật không
        if (!newData || Object.keys(newData).length === 0) {
            throw new Error('Không có dữ liệu mới để cập nhật.');
        }

        // Cập nhật dữ liệu trong cơ sở dữ liệu dựa trên ID
        const updatedData = await Account.findByIdAndUpdate(accountId, newData, { new: true });

        // Kiểm tra xem dữ liệu đã được cập nhật thành công hay không
        if (!updatedData) {
            throw new Error('Không tìm thấy dữ liệu để cập nhật.');
        }

        // Trả về thông báo thành công và dữ liệu đã được cập nhật
        res.render('rehome', { message: "Cập nhật thành công" });
    } catch (error) {
        // Xử lý lỗi nếu có
        console.error('Lỗi trong quá trình cập nhật:', error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

const deleteData=async (req, res, next) => {
    const accountId = req.params.id; // Lấy ID từ request parameters

    try {
        // Xóa tài khoản từ cơ sở dữ liệu dựa trên ID
        const deletedAccount = await Account.findByIdAndDelete(accountId);

        // Kiểm tra xem tài khoản đã được xóa thành công hay không
        if (!deletedAccount) {
            throw new Error('Không tìm thấy tài khoản để xóa.');
        }

        // Trả về thông báo thành công và dữ liệu đã được xóa
        res.render('rehome', { message: "Xóa tài khoản thành công" });
    } catch (error) {
        // Xử lý lỗi nếu có
        console.error('Lỗi trong quá trình xóa tài khoản:', error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

  const updateData =async (req, res, next) => {
    res.render('update');
  }

  const getdelete= async (req, res, next) => {
    const accountId = req.params.id; // Lấy ID từ request parameters

    try {
        // Lấy dữ liệu từ cơ sở dữ liệu dựa trên ID
        const account = await Account.findById(accountId);

        if (!account) {
            // Nếu không tìm thấy tài khoản, trả về lỗi 404
            return res.status(404).json({ message: 'Account not found' });
        }

        // Trả về dữ liệu tài khoản
        res.render('delete', { account: account });
    } catch (error) {
        // Xử lý lỗi nếu có
        console.error('Error retrieving data by ID:', error);
        res.status(500).json({ message: "Internal server error" });
    }
};
const signUp = async (req, res, next) => {
    const { username, password } = req.body;
  
    try {
        if (!username || !password) {
            throw new Error('Tên người dùng và mật khẩu là bắt buộc.');
        }
  
        const user = await Account.findOne({ username });
  
        if (!user) {
            throw new Error('Tên người dùng hoặc mật khẩu không hợp lệ.');
        }
  
        const isPasswordValid = await user.comparePassword(password);
  
        if (!isPasswordValid) {
            throw new Error('Tên người dùng hoặc mật khẩu không hợp lệ.');
        }

        // Generate JWT token
        const token = jwt.sign({ username: user.username, userId: user._id }, '1', { expiresIn: '1h' });
  
        // Send token as response
        res.status(200).json({ message: 'Đăng nhập thành công.', token });
    } catch (error) {
        console.error('Lỗi trong quá trình đăng nhập:', error.message);
        next(error); 
    }
};
const getNews = (req, res, next) => {
    res.render('createNews'); // Add 'res' before 'render'
};

module.exports={
    register,
    login,
    getData,
    putData,
    getCreate,
    deleteData,
    updateData,getDataById,getdelete,signUp,getNews,registerAD 
}
