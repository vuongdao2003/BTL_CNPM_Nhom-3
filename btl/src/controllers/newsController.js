const News =require('./news.js');
const { render } = require('ejs');
const getADnews = (req, res, next) => {
    res.render('createnewsAmin'); 
};
const web = async (req,res,next)=>{
    res.render('dangkydangnhap');
}
const postNews = async (req, res, next) => {
    const { header, content } = req.body; // Lấy dữ liệu từ request body

    try {
        // Tạo một bản ghi tin tức mới trong cơ sở dữ liệu
        const newNews = new News({
            header,
            content
        });

        // Lưu bản ghi mới vào cơ sở dữ liệu
        const savedNews = await newNews.save();

        // Trả về kết quả thành công
        res.render('createNews', { message: 'Tạo tin thành công' });

    } catch (error) {
        // Xử lý lỗi nếu có
        console.error('Lỗi trong quá trình tạo tin tức mới:', error);
        res.status(500).json({ message: 'Đã xảy ra lỗi trong quá trình xử lý yêu cầu' });
    }
};
const getHomepage = async (req, res, next) => {
    try {
        // Tìm 4 tin tức đầu tiên trong cơ sở dữ liệu
        const newestNews = await News.find().sort({ _id: -1 }).limit(4);
        // Kiểm tra xem có tin tức nào được tìm thấy hay không
        if (!newestNews || newestNews.length === 0) {
            return res.status(404).json({ message: 'Không có tin tức nào được tìm thấy' });
        }

        // Trả về 4 tin tức đầu tiên
        res.render('homePage', { newestNews });
    } catch (error) {
        // Xử lý lỗi nếu có
        console.error('Lỗi trong quá trình lấy tin tức mới nhất:', error);
        res.status(500).json({ message: 'Đã xảy ra lỗi trong quá trình xử lý yêu cầu' });
    }
};
const getNewestNews = async (req, res, next) => {
    try {
        // Tìm tin tức mới nhất trong cơ sở dữ liệu
        const newestNews = await News.findOne().sort({ _id: -1 });
        // Kiểm tra xem có tin tức nào được tìm thấy hay không
        if (!newestNews) {
            return res.status(404).json({ message: 'Không có tin tức mới nhất' });
        }

        // Trả về tin tức mới nhất
        res.render('news', { newestNews });
    } catch (error) {
        // Xử lý lỗi nếu có
        console.error('Lỗi trong quá trình lấy tin tức mới nhất:', error);
        res.status(500).json({ message: 'Đã xảy ra lỗi trong quá trình xử lý yêu cầu' });
    }
};
const GetNewsById=async (req, res, next) => {
    const newsId = req.params.id; // Assuming the ID is passed in the URL params

    try {
        // Find news by ID in the database
        const news = await News.findById(newsId);
        
        // Check if the news exists
        if (!news) {
            return res.status(404).json({ message: 'Không tìm thấy tin tức' });
        }

        // Render the news template with the found news
        res.render('news', { news }); // Assuming the template expects a single news article
    } catch (error) {
        // Handle errors
        console.error('Lỗi trong quá trình lấy tin tức theo ID:', error);
        res.status(500).json({ message: 'Đã xảy ra lỗi trong quá trình xử lý yêu cầu' });
    }
};
const getNewsById = async (req, res, next) => {
    const newsId = req.params.id; // Assuming the ID is passed in the URL params

    try {
        // Find news by ID in the database
        const news = await News.findById(newsId);
        
        // Check if the news exists
        if (!news) {
            return res.status(404).json({ message: 'Không tìm thấy tin tức' });
        }

        // Render the news template with the found news
        res.render('updateNews', { news }); // Assuming the template expects a single news article
    } catch (error) {
        // Handle errors
        console.error('Lỗi trong quá trình lấy tin tức theo ID:', error);
        res.status(500).json({ message: 'Đã xảy ra lỗi trong quá trình xử lý yêu cầu' });
    }
};



const updateNews = async (req, res, next) => {
    const accountId = req.params.id; // Lấy ID từ request parameters
    const newData = req.body; // Dữ liệu mới từ request body

    try {
        // Kiểm tra xem có dữ liệu mới để cập nhật không
        if (!newData || Object.keys(newData).length === 0) {
            throw new Error('Không có dữ liệu mới để cập nhật.');
        }

        // Cập nhật dữ liệu trong cơ sở dữ liệu dựa trên ID
        const updatedData = await News.findByIdAndUpdate(accountId, newData, { new: true });

        // Kiểm tra xem dữ liệu đã được cập nhật thành công hay không
        if (!updatedData) {
            throw new Error('Không tìm thấy dữ liệu để cập nhật.');
        }

        // Trả về thông báo thành công và dữ liệu đã được cập nhật
        res.render('rehomeNews', { message: "Cập nhật thành công" });
    } catch (error) {
        // Xử lý lỗi nếu có
        console.error('Lỗi trong quá trình cập nhật:', error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getdeleteNews = async (req, res, next) => {
    const newsId = req.params.id; // Lấy ID từ request parameters

    try {
        // Lấy dữ liệu từ cơ sở dữ liệu dựa trên ID
        const news = await News.findById(newsId);

        if (!news) {
            // Nếu không tìm thấy tài khoản, trả về lỗi 404
            return res.status(404).json({ message: 'Account not found' });
        }

        // Trả về dữ liệu tài khoản
        res.render('deleteNews', { news });
    } catch (error) {
        // Xử lý lỗi nếu có
        console.error('Error retrieving data by ID:', error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const deleteNews = async (req, res, next) => {
    const { id } = req.params; // Lấy id của tin tức cần xóa từ request parameters
    try {
        // Xóa tin tức khỏi cơ sở dữ liệu
        const deletedNews = await News.findByIdAndDelete(id);

        // Kiểm tra xem tin tức có tồn tại hay không
        if (!deletedNews) {
            return res.status(404).json({ message: 'Không tìm thấy tin tức cần xóa' });
        }

        // Trả về kết quả thành công
        res.render('rehomeNews', { message: "Xóa thành công" });
    } catch (error) {
        // Xử lý lỗi nếu có
        console.error('Lỗi trong quá trình xóa tin tức:', error);
        res.status(500).json({ message: 'Đã xảy ra lỗi trong quá trình xử lý yêu cầu' });
    }
};
const getALLnews =async (req, res, next) => {
    try {
        // Retrieve data from the database
        const data = await News.find();

        // Render the view with the retrieved data
        res.render('homeNews', { listuser: data }); // Pass data as 'listuser'
    } catch (error) {
        console.error('Error retrieving data:', error);
        res.status(500).json({ message: "Internal server error" });
    }
};
const searchNews = async (req, res, next) => {
    try {
        const query = req.header; // Assuming the search query is sent via a custom header named 'searchquery'
        
        // Check if the query is null or empty
        if (!query) {
            return res.status(400).json({ message: 'Search query is missing or empty' });
        }

        // Perform the search
        const searchResults = await News.find({
            $text: { $search: query }
        }).exec();

        res.render('searchResults', { searchResults, query });
    } catch (error) {
        console.error('Error searching for news:', error);
        res.status(500).json({ message: 'An error occurred while searching for news' });
    }
};

module.exports = searchNews;

const getSearch = async (req, res, next) => {
    try {
        // Tìm 4 tin tức đầu tiên trong cơ sở dữ liệu
        const newestNews = await News.find().sort({ _id: -1 }).limit(4);
        // Kiểm tra xem có tin tức nào được tìm thấy hay không
        if (!newestNews || newestNews.length === 0) {
            return res.status(404).json({ message: 'Không có tin tức nào được tìm thấy' });
        }

        // Trả về 4 tin tức đầu tiên
        res.render('homePagenotLogin', { newestNews });
    } catch (error) {
        // Xử lý lỗi nếu có
        console.error('Lỗi trong quá trình lấy tin tức mới nhất:', error);
        res.status(500).json({ message: 'Đã xảy ra lỗi trong quá trình xử lý yêu cầu' });
    }
};

module.exports={postNews,getNewestNews,updateNews, deleteNews,

    getNewsById, getALLnews,getdeleteNews,web,getADnews,getHomepage,GetNewsById,searchNews,getSearch
}